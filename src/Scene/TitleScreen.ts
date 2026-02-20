/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants, PICTURE_KIND, ScreenResolution } from '../Common';
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

		// Creating background
		if (Data.TitlescreenGameover.isTitleBackgroundImage) {
			this.pictureBackground = await Picture2D.createWithID(
				Data.TitlescreenGameover.titleBackgroundImageID,
				PICTURE_KIND.TITLE_SCREEN,
				{ cover: true },
			);
		} else {
			await Manager.Videos.play(Data.Videos.get(Data.TitlescreenGameover.titleBackgroundVideoID).getPath());
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

		// Play title screen song
		Data.TitlescreenGameover.titleMusic.playMusic();

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
		this.windowChoicesCommands.update();
	}

	/**
	 *  @inheritdoc
	 *  @param {number} key - the key ID
	 */
	onKeyPressed(key: string) {
		this.windowChoicesCommands.onKeyPressed(key, this.windowChoicesCommands.getCurrentContent().datas);
	}

	/**
	 *  @inheritdoc
	 *  @param {number} key - the key ID
	 *  @return {*}  {boolean}
	 */
	onKeyPressedAndRepeat(key: string): boolean {
		return this.windowChoicesCommands.onKeyPressedAndRepeat(key);
	}

	/**
	 *  @inheritdoc
	 */
	onMouseMove(x: number, y: number) {
		this.windowChoicesCommands.onMouseMove(x, y);
	}

	/**
	 *  @inheritdoc
	 */
	onMouseUp(x: number, y: number) {
		this.windowChoicesCommands.onMouseUp(x, y, this.windowChoicesCommands.getCurrentContent().datas);
	}

	/**
	 *  @inheritdoc
	 */
	drawHUD() {
		if (Data.TitlescreenGameover.isTitleBackgroundImage) {
			this.pictureBackground.draw();
		}
		this.windowChoicesCommands.draw();
	}
}

export { TitleScreen };
