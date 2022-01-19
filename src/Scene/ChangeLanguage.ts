/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas, Graphic, Manager } from "..";
import { Constants, Enum, Inputs, Platform, ScreenResolution } from "../Common";
import { Picture2D, Rectangle, WindowBox, WindowChoices } from "../Core";
import { Base } from "./Base";

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
        const rect = new Rectangle(Constants.HUGE_SPACE, Constants.HUGE_SPACE, 
            WindowBox.MEDIUM_SLOT_WIDTH, WindowBox.LARGE_SLOT_HEIGHT);
        const graphic = new Graphic.Text("Language", { align: Enum.Align.Center });
        const options = { 
            content: graphic
        };
        this.windowBoxLanguage = new WindowBox(rect.x, rect.y, rect.width, rect
            .height, options);
    }

    /** 
     *  Create the window information on top.
     */
    createWindowBoxTop() {
        const rect = new Rectangle(Constants.HUGE_SPACE + WindowBox
            .MEDIUM_SLOT_WIDTH + Constants.LARGE_SPACE, Constants.HUGE_SPACE, 
            ScreenResolution.SCREEN_X - (2 * Constants.HUGE_SPACE) - WindowBox
            .MEDIUM_SLOT_WIDTH - Constants.LARGE_SPACE, WindowBox.LARGE_SLOT_HEIGHT);
        const graphic = new Graphic.Text("Select a language.", { align: Enum.Align.Center });
        const options = { 
            content: graphic
        };
        this.windowBoxTop = new WindowBox(rect.x, rect.y, rect.width, rect.height, 
            options);
    }

    /** 
     *  Create the window information on top.
     */
    createWindowChoicesMain() {
        const rect = new Rectangle(Constants.HUGE_SPACE, Constants.HUGE_SPACE + 
            WindowBox.LARGE_SLOT_HEIGHT + Constants.LARGE_SPACE, ScreenResolution
            .SCREEN_X - (2 * Constants.HUGE_SPACE), WindowBox.MEDIUM_SLOT_HEIGHT);
        const options = {
            nbItemsMax: 9,
            listCallbacks: Datas.Languages.getCommandsCallbacks()
        };
        this.windowChoicesMain = new WindowChoices(rect.x, rect.y, rect.width, 
            rect.height, Datas.Languages.getCommandsGraphics(), options);
        this.windowChoicesMain.unselect();
        this.windowChoicesMain.select(Datas.Languages.getIndexByID(Datas.Settings
            .currentLanguage));
    }

    /** 
     *  Create the window confirmation.
     */
    createWindowBoxConfirm() {
        const width = 200;
        const height = 75;
        const rect = new Rectangle((ScreenResolution.SCREEN_X - width) / 2, (
            ScreenResolution.SCREEN_Y - height) / 2, width, height);
        const graphic = new Graphic.Text("Confirm?", { align: Enum.Align.Center });
        const options = { 
            content: graphic
        };
        this.windowBoxConfirm = new WindowBox(rect.x, rect.y, rect.width, rect
            .height, options);
    }

    /** 
     *  Create the window information on top.
     */
    createWindowChoicesConfirm() {
        const rect = new Rectangle(this.windowBoxConfirm.oX + ((this
            .windowBoxConfirm.oW - WindowBox.SMALL_SLOT_WIDTH) / 2), this
            .windowBoxConfirm.oY + this.windowBoxConfirm.oH, WindowBox
            .SMALL_SLOT_WIDTH, WindowBox.SMALL_SLOT_HEIGHT);
        const options = {
            listCallbacks: [
                () => { // YES
                    Datas.Settings.updateCurrentLanguage(Datas.Languages
                        .listOrder[this.windowChoicesMain.currentSelectedIndex]);
                    Manager.Stack.translateAll();
                    this.step = 0;
                    Manager.Stack.requestPaintHUD = true;
                    return true;
                },
                () => { // NO
                    this.step = 0;
                    Manager.Stack.requestPaintHUD = true;
                    return false;
                }
            ]
        };
        const graphics = [
            new Graphic.Text("Yes", { align: Enum.Align.Center }),
            new Graphic.Text("No", { align: Enum.Align.Center })
        ];
        this.windowChoicesConfirm = new WindowChoices(rect.x, rect.y, rect.width, 
            rect.height, graphics, options);
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
        if (Datas.TitlescreenGameover.isTitleBackgroundImage) {
            this.pictureBackground = await Picture2D.createWithID(Datas
                .TitlescreenGameover.titleBackgroundImageID, Enum.PictureKind
                .TitleScreen, { cover: true });
        } else {
            await Manager.Videos.play(Datas.Videos.get(Datas
                .TitlescreenGameover.titleBackgroundVideoID).getPath());
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
        Datas.Systems.soundCancel.playSound();
        Manager.Stack.pop();
    }

    /** 
     *  Update the scene.
     */
    update() {
        switch (this.step) {
            case 0:
                this.windowChoicesMain.update();
            case 1:
                this.windowChoicesConfirm.update();
                break;
        }
    }

    /** 
     *  Handle scene key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: number) {
        switch (this.step) {
            case 0:
                this.windowChoicesMain.onKeyPressed(key, this);
                if (Datas.Keyboards.checkActionMenu(key)) {
                    this.action();
                } else if (Datas.Keyboards.checkCancelMenu) {
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
    onKeyPressedAndRepeat(key: number): boolean {
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
        if (Datas.TitlescreenGameover.isTitleBackgroundImage) {
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

export { ChangeLanguage }