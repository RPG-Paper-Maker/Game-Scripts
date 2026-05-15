/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ALIGN, ALIGN_VERTICAL, Constants, PICTURE_KIND, Platform, ScreenResolution } from '../Common';
import { Game, Picture2D, WindowBox, WindowChoices } from '../Core';
import { Data, Graphic, Manager } from '../index';
import { Base } from './Base';

/**
 *  The Scene displaying the game title screen.
 *  @class TitleScreen
 *  @extends {Scene.Base}
 */
class TitleScreen extends Base {
	/**
	 *  The title screen background image.
	 *  @type {Picture2D}
	 */
	public pictureBackground: Picture2D;

	/**
	 *  The title screen command window.
	 *  @type {WindowChoices}
	 */
	public windowChoicesCommands: WindowChoices;

	/**
	 *  Whether video autoplay was blocked by the browser (requires user interaction first).
	 *  @type {boolean}
	 */
	public videoBlocked: boolean = false;

	/**
	 *  "Click anywhere to start" text shown when video autoplay is blocked.
	 *  @type {Graphic.Text}
	 */
	public graphicClickToStart: Graphic.Text;

	/**
	 *  Whether the title screen is ready to show image and commands (past loopMs point or no video).
	 *  @type {boolean}
	 */
	public titleReady: boolean = false;

	/**
	 *  Whether the title music has already been started.
	 *  @type {boolean}
	 */
	public musicStarted: boolean = false;

	constructor() {
		super();
	}

	/**
	 *  @inheritdoc
	 */
	create(): void {
		super.create();
	}

	/**
	 *  @inheritdoc
	 */
	async load() {
		Game.current = null;

		// Stop all songs and videos
		Manager.Videos.stop();
		Manager.Songs.stopAll();

		// Reset screen tone
		Manager.GL.screenTone.set(0, 0, 0, 1);

		// Destroy pictures
		Manager.Stack.displayedPictures = [];

		// Creating background (video plays behind, image draws on top)
		let videoPlayed = false;
		if (Data.TitlescreenGameover.isTitleBackgroundVideo && Data.Videos.has(Data.TitlescreenGameover.titleBackgroundVideoID)) {
			const loop = Data.TitlescreenGameover.titleVideoLoop;
			const loopMs = Data.TitlescreenGameover.titleVideoLoopMs;
			try {
				const played = await Manager.Videos.play(
					Data.Videos.get(Data.TitlescreenGameover.titleBackgroundVideoID).getPath(),
					null,
					loop,
					loopMs,
				);
				if (!played) {
					this.videoBlocked = true;
					this.titleReady = true;
					this.graphicClickToStart = new Graphic.Text('Click anywhere to start', {
						x: 0,
						y: 0,
						w: ScreenResolution.SCREEN_X,
						h: ScreenResolution.SCREEN_Y,
						align: ALIGN.CENTER,
						verticalAlign: ALIGN_VERTICAL.CENTER,
						fontSize: 20,
					});
				} else {
					this.titleReady = loop && loopMs === 0;
				}
				videoPlayed = true;
			} catch {
				Manager.Videos.stop();
			}
		}
		if (!videoPlayed) {
			this.titleReady = true;
		}
		if (Data.TitlescreenGameover.isTitleBackgroundImage) {
			try {
				this.pictureBackground = await Picture2D.createWithID(
					Data.TitlescreenGameover.titleBackgroundImageID,
					PICTURE_KIND.TITLE_SCREEN,
					{ cover: true },
				);
			} catch {
				this.pictureBackground = null;
			}
		}

		// Windows
		const commandsNb = Data.TitlescreenGameover.titleCommands.length;
		this.windowChoicesCommands = new WindowChoices(
			ScreenResolution.SCREEN_X / 2 - WindowBox.MEDIUM_SLOT_WIDTH / 2,
			ScreenResolution.SCREEN_Y - Constants.HUGE_SPACE - commandsNb * WindowBox.MEDIUM_SLOT_HEIGHT,
			WindowBox.MEDIUM_SLOT_WIDTH,
			WindowBox.MEDIUM_SLOT_HEIGHT,
			Data.TitlescreenGameover.getTitleCommandsNames(),
			{
				nbItemsMax: commandsNb,
				listCallbacks: Data.TitlescreenGameover.getTitleCommandsActions(),
				padding: [0, 0, 0, 0],
			},
		);

		this.loading = false;
	}

	/**
	 *  @inheritdoc
	 */
	translate() {
		for (let i = 0, l = this.windowChoicesCommands.listContents.length; i < l; i++) {
			(<Graphic.Text>this.windowChoicesCommands.listContents[i]).setText(
				Data.TitlescreenGameover.titleCommands[i].name(),
			);
		}
	}

	/**
	 *  @inheritdoc
	 */
	update() {
		if (Data.TitlescreenGameover.isTitleBackgroundVideo && this.videoBlocked && !Platform.canvasVideos.paused) {
			this.videoBlocked = false;
		}
		if (!this.titleReady) {
			if (Data.TitlescreenGameover.isTitleBackgroundVideo) {
				const loop = Data.TitlescreenGameover.titleVideoLoop;
				const loopMs = Data.TitlescreenGameover.titleVideoLoopMs;
				const currentMs = Platform.canvasVideos.currentTime * 1000;
				const videoEnded = Platform.canvasVideos.ended;
				const ready = loop ? currentMs >= loopMs || videoEnded : videoEnded;
				if (ready) {
					this.titleReady = true;
					Manager.Stack.requestPaintHUD = true;
				}
			} else {
				this.titleReady = true;
				Manager.Stack.requestPaintHUD = true;
			}
		}
		if (!this.videoBlocked && this.titleReady) {
			if (!this.musicStarted) {
				this.musicStarted = true;
				Data.TitlescreenGameover.titleMusic.playMusic();
			}
			this.windowChoicesCommands.update();
		}
	}

	/**
	 *  @inheritdoc
	 *  @param {number} key - the key ID
	 */
	onKeyPressed(key: string) {
		if (this.videoBlocked) {
			this.resumeVideoBackground();
			this.videoBlocked = false;
			Manager.Stack.requestPaintHUD = true;
			return;
		}
		if (!this.titleReady) {
			return;
		}
		this.windowChoicesCommands.onKeyPressed(key, this.windowChoicesCommands.getCurrentContent().datas);
	}

	/**
	 *  @inheritdoc
	 *  @param {number} key - the key ID
	 *  @return {*}  {boolean}
	 */
	onKeyPressedAndRepeat(key: string): boolean {
		if (this.videoBlocked || !this.titleReady) {
			return true;
		}
		return this.windowChoicesCommands.onKeyPressedAndRepeat(key);
	}

	/**
	 *  @inheritdoc
	 */
	onMouseMove(x: number, y: number) {
		if (!this.titleReady) {
			return;
		}
		this.windowChoicesCommands.onMouseMove(x, y);
	}

	/**
	 *  @inheritdoc
	 */
	onMouseUp(x: number, y: number) {
		if (this.videoBlocked) {
			this.resumeVideoBackground();
			this.videoBlocked = false;
			Manager.Stack.requestPaintHUD = true;
			return;
		}
		if (!this.titleReady) {
			return;
		}
		this.windowChoicesCommands.onMouseUp(x, y, this.windowChoicesCommands.getCurrentContent().datas);
	}

	/**
	 *  Retry video playback after user interaction unblocked autoplay.
	 */
	resumeVideoBackground() {
		this.videoBlocked = false;
		const loop = Data.TitlescreenGameover.titleVideoLoop;
		const loopMs = Data.TitlescreenGameover.titleVideoLoopMs;
		this.titleReady = loop && loopMs === 0;
		Manager.Videos.play(
			Data.Videos.get(Data.TitlescreenGameover.titleBackgroundVideoID).getPath(),
			null,
			loop,
			loopMs,
		).catch(console.error);
	}

	/**
	 *  @inheritdoc
	 */
	draw3D() {
		Manager.GL.renderer.clear();
	}

	/**
	 *  @inheritdoc
	 */
	drawHUD() {
		if (this.titleReady && Data.TitlescreenGameover.isTitleBackgroundImage && this.pictureBackground) {
			this.pictureBackground.draw();
		}
		if (this.videoBlocked) {
			this.graphicClickToStart.draw();
		} else if (this.titleReady) {
			this.windowChoicesCommands.draw();
		}
	}
}

export { TitleScreen };
