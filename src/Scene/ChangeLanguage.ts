/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Data, Graphic, Manager } from '..';
import { ALIGN, Constants, Inputs, PICTURE_KIND, ScreenResolution } from '../Common';
import { Picture2D, Rectangle, WindowBox, WindowChoices } from '../Core';
import { Base } from './Base';

/** @class
 *  A scene for the language setting.
 *  @extends Scene.Base
 */
class ChangeLanguage extends Base {
	public pictureBackground: Picture2D;
	public windowBoxLanguage: WindowBox;
	public windowBoxTop: WindowBox;
	public windowChoicesMain: WindowChoices;
	public windowBoxConfirm: WindowBox;
	public windowChoicesConfirm: WindowChoices;
	public step: number = 0;

	constructor() {
		super();
	}

	/**
	 *  Create scene.
	 */
	create() {
		super.create();
		this.createAllWindows();
	}

	/**
	 *  Create all the windows in the scene.
	 */
	createAllWindows() {
		this.createWindowBoxLanguage();
		this.createWindowBoxTop();
		this.createWindowChoicesMain();
		this.createWindowBoxConfirm();
		this.createWindowChoicesConfirm();
	}

	/**
	 *  Create the window language on top.
	 */
	createWindowBoxLanguage() {
		const rect = new Rectangle(
			Constants.HUGE_SPACE,
			Constants.HUGE_SPACE,
			WindowBox.MEDIUM_SLOT_WIDTH,
			WindowBox.LARGE_SLOT_HEIGHT
		);
		const graphic = new Graphic.Text(Data.Languages.extras.language.name(), { align: ALIGN.CENTER });
		const options = {
			content: graphic,
		};
		this.windowBoxLanguage = new WindowBox(rect.x, rect.y, rect.width, rect.height, options);
	}

	/**
	 *  Create the window information on top.
	 */
	createWindowBoxTop() {
		const rect = new Rectangle(
			Constants.HUGE_SPACE + WindowBox.MEDIUM_SLOT_WIDTH + Constants.LARGE_SPACE,
			Constants.HUGE_SPACE,
			ScreenResolution.SCREEN_X - 2 * Constants.HUGE_SPACE - WindowBox.MEDIUM_SLOT_WIDTH - Constants.LARGE_SPACE,
			WindowBox.LARGE_SLOT_HEIGHT
		);
		const graphic = new Graphic.Text(Data.Languages.extras.languageSelectedDescription.name(), {
			align: ALIGN.CENTER,
		});
		const options = {
			content: graphic,
		};
		this.windowBoxTop = new WindowBox(rect.x, rect.y, rect.width, rect.height, options);
	}

	/**
	 *  Create the window information on top.
	 */
	createWindowChoicesMain() {
		const rect = new Rectangle(
			Constants.HUGE_SPACE,
			Constants.HUGE_SPACE + WindowBox.LARGE_SLOT_HEIGHT + Constants.LARGE_SPACE,
			ScreenResolution.SCREEN_X - 2 * Constants.HUGE_SPACE,
			WindowBox.MEDIUM_SLOT_HEIGHT
		);
		const options = {
			nbItemsMax: 9,
			listCallbacks: Data.Languages.getCommandsCallbacks(),
		};
		this.windowChoicesMain = new WindowChoices(
			rect.x,
			rect.y,
			rect.width,
			rect.height,
			Data.Languages.getCommandsGraphics(),
			options
		);
		this.windowChoicesMain.unselect();
		this.windowChoicesMain.select(Data.Languages.getIndexByID(Data.Settings.currentLanguage));
	}

	/**
	 *  Create the window confirmation.
	 */
	createWindowBoxConfirm() {
		const width = 200;
		const height = 75;
		const rect = new Rectangle(
			(ScreenResolution.SCREEN_X - width) / 2,
			(ScreenResolution.SCREEN_Y - height) / 2,
			width,
			height
		);
		const graphic = new Graphic.Text(Data.Languages.extras.confirm.name(), { align: ALIGN.CENTER });
		const options = {
			content: graphic,
		};
		this.windowBoxConfirm = new WindowBox(rect.x, rect.y, rect.width, rect.height, options);
	}

	/**
	 *  Create the window information on top.
	 */
	createWindowChoicesConfirm() {
		const rect = new Rectangle(
			this.windowBoxConfirm.oX + (this.windowBoxConfirm.oW - WindowBox.SMALL_SLOT_WIDTH) / 2,
			this.windowBoxConfirm.oY + this.windowBoxConfirm.oH,
			WindowBox.SMALL_SLOT_WIDTH,
			WindowBox.SMALL_SLOT_HEIGHT
		);
		const options = {
			listCallbacks: [
				() => {
					// YES
					Data.Settings.updateCurrentLanguage(
						Data.Languages.listOrder[this.windowChoicesMain.currentSelectedIndex]
					);
					Manager.Stack.translateAll();
					this.step = 0;
					Manager.Stack.requestPaintHUD = true;
					return true;
				},
				() => {
					// NO
					this.step = 0;
					Manager.Stack.requestPaintHUD = true;
					return false;
				},
			],
		};
		const graphics = [
			new Graphic.Text(Data.Languages.extras.yes.name(), { align: ALIGN.CENTER }),
			new Graphic.Text(Data.Languages.extras.no.name(), { align: ALIGN.CENTER }),
		];
		this.windowChoicesConfirm = new WindowChoices(rect.x, rect.y, rect.width, rect.height, graphics, options);
	}

	/**
	 *  Load async stuff.
	 */
	async load() {
		await this.createBackground();
		this.loading = false;
	}

	/**
	 *  Create background stuff.
	 */
	async createBackground() {
		if (Data.TitlescreenGameover.isTitleBackgroundImage) {
			this.pictureBackground = await Picture2D.createWithID(
				Data.TitlescreenGameover.titleBackgroundImageID,
				PICTURE_KIND.TITLE_SCREEN,
				{ cover: true }
			);
		} else {
			await Manager.Videos.play(Data.Videos.get(Data.TitlescreenGameover.titleBackgroundVideoID).getPath());
		}
	}

	/**
	 *  Action the scene.
	 */
	action() {
		this.windowChoicesConfirm.unselect();
		this.windowChoicesConfirm.select(0);
		this.step = 1;
	}

	/**
	 *  Cancel the scene.
	 */
	cancel() {
		Data.Systems.soundCancel.playSound();
		Manager.Stack.pop();
	}

	/**
	 *  Update the scene.
	 */
	update() {
		switch (this.step) {
			case 0:
				this.windowChoicesMain.update();
				break;
			case 1:
				this.windowChoicesConfirm.update();
				break;
		}
	}

	/**
	 *  Handle scene key pressed.
	 *  @param {number} key - The key ID
	 */
	onKeyPressed(key: string) {
		switch (this.step) {
			case 0:
				this.windowChoicesMain.onKeyPressed(key, this);
				if (Data.Keyboards.checkActionMenu(key)) {
					this.action();
				} else if (Data.Keyboards.checkCancelMenu(key)) {
					this.cancel();
				}
				break;
			case 1:
				this.windowChoicesConfirm.onKeyPressed(key, this);
				break;
			default:
				break;
		}
	}

	/**
	 *  Handle scene pressed and repeat key.
	 *  @param {number} key - The key ID
	 *  @returns {boolean}
	 */
	onKeyPressedAndRepeat(key: string): boolean {
		switch (this.step) {
			case 0:
				this.windowChoicesMain.onKeyPressedAndRepeat(key);
				break;
			case 1:
				this.windowChoicesConfirm.onKeyPressedAndRepeat(key);
				break;
		}
		return true;
	}

	/**
	 *  @inheritdoc
	 */
	onMouseMove(x: number, y: number) {
		switch (this.step) {
			case 0:
				this.windowChoicesMain.onMouseMove(x, y);
				break;
			case 1:
				this.windowChoicesConfirm.onMouseMove(x, y);
				break;
		}
	}

	/**
	 *  @inheritdoc
	 */
	onMouseUp(x: number, y: number) {
		switch (this.step) {
			case 0:
				this.windowChoicesMain.onMouseUp(x, y, this);
				if (Inputs.mouseLeftPressed) {
					this.action();
				} else if (Inputs.mouseRightPressed) {
					this.cancel();
				}
				break;
			case 1:
				this.windowChoicesConfirm.onMouseUp(x, y, this);
				break;
			default:
				break;
		}
	}

	/**
	 *  Draw the HUD scene
	 */
	drawHUD() {
		if (Data.TitlescreenGameover.isTitleBackgroundImage) {
			this.pictureBackground.draw();
		}
		this.windowBoxLanguage.draw();
		this.windowBoxTop.draw();
		this.windowChoicesMain.draw();
		if (this.step === 1) {
			this.windowBoxConfirm.draw();
			this.windowChoicesConfirm.draw();
		}
	}
}

export { ChangeLanguage };
