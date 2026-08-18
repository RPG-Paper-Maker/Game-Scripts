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

	private waitingForVideoLoopPoint: boolean = false;

	/** Whether this title-screen entry should skip the video introduction. */
	public startAtLoop: boolean;

	constructor(startAtLoop: boolean = false) {
		super(true, startAtLoop);
	}

	/**
	 * Initialize the return mode before the asynchronous scene load starts.
	 */
	initialize(startAtLoop: boolean = false) {
		this.startAtLoop = startAtLoop;
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
			const startMs = this.startAtLoop && loop ? loopMs : 0;
			try {
				const played = await Manager.Videos.play(
					Data.Videos.get(Data.TitlescreenGameover.titleBackgroundVideoID).getPath(),
					null,
					loop,
					loopMs,
					startMs,
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
					this.titleReady = !loop || loopMs === 0 || startMs > 0;
					if (!this.titleReady) {
						this.waitForVideoLoopPoint();
					}
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
			Data.TitlescreenGameover.titleCommandsWindowX,
			Data.TitlescreenGameover.titleCommandsWindowY,
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
				const ready = videoEnded || (!this.waitingForVideoLoopPoint && (loop ? currentMs >= loopMs : false));
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
			this.resumeVideoBackground(Data.Keyboards.checkActionMenu(key) && this.hasVideoIntroduction());
			this.videoBlocked = false;
			Manager.Stack.requestPaintHUD = true;
			return;
		}
		if (Data.Keyboards.checkActionMenu(key) && this.skipVideoIntroduction()) {
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
			this.resumeVideoBackground(this.hasVideoIntroduction());
			this.videoBlocked = false;
			Manager.Stack.requestPaintHUD = true;
			return;
		}
		if (this.skipVideoIntroduction()) {
			return;
		}
		if (!this.titleReady) {
			return;
		}
		this.windowChoicesCommands.onMouseUp(x, y, this.windowChoicesCommands.getCurrentContent().datas);
	}

	/**
	 * Check whether the configured title video has a non-looping introduction.
	 */
	hasVideoIntroduction(): boolean {
		return (
			Data.TitlescreenGameover.isTitleBackgroundVideo &&
			Data.TitlescreenGameover.titleVideoLoop &&
			Data.TitlescreenGameover.titleVideoLoopMs > 0
		);
	}

	/**
	 * Skip the title-video introduction and immediately reveal the menu.
	 */
	skipVideoIntroduction(): boolean {
		if (this.titleReady || this.startAtLoop || !this.hasVideoIntroduction()) {
			return false;
		}
		this.titleReady = true;
		Manager.Videos.seek(Data.TitlescreenGameover.titleVideoLoopMs).catch(() => {});
		Manager.Stack.requestPaintHUD = true;
		return true;
	}

	/**
	 *  Retry video playback after user interaction unblocked autoplay.
	 */
	resumeVideoBackground(skipIntroduction: boolean = false) {
		this.videoBlocked = false;
		const loop = Data.TitlescreenGameover.titleVideoLoop;
		const loopMs = Data.TitlescreenGameover.titleVideoLoopMs;
		const startMs = (this.startAtLoop || skipIntroduction) && loop ? loopMs : 0;
		this.titleReady = !loop || loopMs === 0 || startMs > 0;
		Manager.Videos.play(
			Data.Videos.get(Data.TitlescreenGameover.titleBackgroundVideoID).getPath(),
			null,
			loop,
			loopMs,
			startMs,
		).then((played) => {
			if (played && !this.titleReady) {
				this.waitForVideoLoopPoint();
			}
		}).catch(console.error);
	}

	private waitForVideoLoopPoint() {
		if (typeof Platform.canvasVideos.requestVideoFrameCallback !== 'function') {
			return;
		}
		this.waitingForVideoLoopPoint = true;
		const loopMs = Data.TitlescreenGameover.titleVideoLoopMs;
		const onVideoFrame = (_now: number, metadata: VideoFrameCallbackMetadata) => {
			if (this.titleReady) {
				this.waitingForVideoLoopPoint = false;
				return;
			}
			if (metadata.mediaTime * 1000 >= loopMs) {
				this.waitingForVideoLoopPoint = false;
				this.titleReady = true;
				Manager.Stack.requestPaintHUD = true;
				return;
			}
			Platform.canvasVideos.requestVideoFrameCallback(onVideoFrame);
		};
		Platform.canvasVideos.requestVideoFrameCallback(onVideoFrame);
	}

	/**
	 *  @inheritdoc
	 */
	draw3D() {
		Manager.GL.renderer.setClearColor(0x000000, 1);
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
