/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas, Graphic, Manager } from "..";
import { Constants, Enum, Platform, ScreenResolution } from "../Common";
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
            nbItemsMax: 9
        };
        this.windowChoicesMain = new WindowChoices(rect.x, rect.y, rect.width, 
            rect.height, Datas.Languages.getCommandsGraphics(), options);
        this.windowChoicesMain.unselect();
        this.windowChoicesMain.select(Datas.Languages.getIndexByID(Datas.Settings
            .currentLanguage));
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
            Platform.canvasVideos.classList.remove('hidden');
            Platform.canvasVideos.src = Datas.Videos.get(Datas
                .TitlescreenGameover.titleBackgroundVideoID).getPath();
            await Platform.canvasVideos.play();
        }
    }

    /** 
     *  Handle scene key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: number) {
        this.windowChoicesMain.onKeyPressed(key, this);
        if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
            .Cancel) || Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
            .controls.MainMenu))
        {
            Datas.Systems.soundCancel.playSound();
            Manager.Stack.pop();
        }
    }

    /** 
     *  Handle scene pressed and repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key: number): boolean {
        let index = this.windowChoicesMain.currentSelectedIndex;
        this.windowChoicesMain.onKeyPressedAndRepeat(key);
        let newIndex = this.windowChoicesMain.currentSelectedIndex;
        if (newIndex !== index) {
            Datas.Settings.updateCurrentLanguage(Datas.Languages.listOrder[newIndex]);
        }
        return true;
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
    }
}

export { ChangeLanguage }