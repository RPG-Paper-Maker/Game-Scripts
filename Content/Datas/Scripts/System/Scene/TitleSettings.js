/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base";
import { Datas, Graphic, Manager } from "..";
import { Picture2D, WindowBox, WindowChoices } from "../Core";
import { Enum, Constants, ScreenResolution } from "../Common";
var PictureKind = Enum.PictureKind;
var Align = Enum.Align;
/** @class
 *  A scene for the title screen settings.
 *  @extends SceneGame
 *  @property {Picture2D} pictureBackground The title screen background picture
 *  @property {WindowBox} windowSettings The window box for displaying settings
 *  @property {WindoBox} windowInformations The window box for displaying
 *  informations
 *  @property {WindowChoices} windowChoicesMain The main window choices
 */
class TitleSettings extends Base {
    constructor() {
        super();
    }
    /**
     *  Load async stuff.
     */
    async load() {
        // Creating background
        if (Datas.TitlescreenGameover.isTitleBackgroundImage) {
            this.pictureBackground = await Picture2D.createWithID(Datas
                .TitlescreenGameover.titleBackgroundImageID, PictureKind
                .TitleScreen);
            this.pictureBackground.cover = true;
        }
        // Creating windows
        this.windowSettings = new WindowBox(Constants.HUGE_SPACE, Constants
            .HUGE_SPACE, WindowBox.MEDIUM_SLOT_WIDTH, WindowBox
            .LARGE_SLOT_HEIGHT, {
            content: new Graphic.Text("SETTINGS", { align: Align.Center }),
            padding: WindowBox.SMALL_SLOT_PADDING
        });
        this.windowInformations = new WindowBox(Constants.HUGE_SPACE + WindowBox
            .MEDIUM_SLOT_WIDTH + Constants.LARGE_SPACE, Constants.HUGE_SPACE, ScreenResolution.SCREEN_X - (2 * Constants.HUGE_SPACE) - WindowBox
            .MEDIUM_SLOT_WIDTH - Constants.LARGE_SPACE, WindowBox
            .LARGE_SLOT_HEIGHT, {
            padding: WindowBox.SMALL_SLOT_PADDING
        });
        this.windowChoicesMain = new WindowChoices(Constants.HUGE_SPACE, Constants.HUGE_SPACE + WindowBox.LARGE_SLOT_HEIGHT + Constants
            .LARGE_SPACE, ScreenResolution.SCREEN_X - (2 * Constants.HUGE_SPACE), WindowBox.MEDIUM_SLOT_HEIGHT, Datas.TitlescreenGameover
            .getSettingsCommandsContent(), {
            nbItemsMax: 9,
            listCallbacks: Datas.TitlescreenGameover
                .getSettingsCommandsActions(),
            bordersInsideVisible: false
        });
        this.windowInformations.content = this.windowChoicesMain
            .getCurrentContent();
        this.loading = false;
    }
    /**
     *  Handle scene key pressed.
     *  @param {number} key The key ID
     */
    onKeyPressed(key) {
        this.windowChoicesMain.onKeyPressed(key);
        if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Cancel)
            || Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.controls.MainMenu)) {
            Datas.Systems.soundCancel.playSound();
            Manager.Stack.pop();
        }
    }
    /**
     *  Handle scene pressed and repeat key.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key) {
        this.windowChoicesMain.onKeyPressedAndRepeat(key);
        this.windowInformations.content = this.windowChoicesMain
            .getCurrentContent();
        return true;
    }
    /**
     *  Draw the HUD scene.
     */
    drawHUD() {
        if (Datas.TitlescreenGameover.isTitleBackgroundImage) {
            this.pictureBackground.draw();
        }
        this.windowSettings.draw();
        this.windowInformations.draw();
        this.windowChoicesMain.draw();
    }
}
export { TitleSettings };
