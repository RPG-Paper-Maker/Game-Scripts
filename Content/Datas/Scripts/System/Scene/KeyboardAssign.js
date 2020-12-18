/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base";
import { Datas, Graphic, Scene, Manager } from "..";
import { Picture2D, WindowBox, WindowChoices } from "../Core";
import { Enum, Constants, ScreenResolution } from "../Common";
var PictureKind = Enum.PictureKind;
var Align = Enum.Align;
/** @class
 *  A scene for the keyboard assign setting.
 *  @extends Scene.Base
 *  @property {number} [SceneKeyboardAssign.WINDOW_PRESS_WIDTH=300] The window
 *  press width
 *  @property {number} [SceneKeyboardAssign.WINDOW_PRESS_HEIGHT=200] The window
 *  press height
 *  @property {number} [SceneKeyboardAssign.MAX_WAIT_TIME_FIRST=3000] The max
 *  wait time in milliseconds first
 *  @property {number} [SceneKeyboardAssign.MAX_WAIT_TIME=1000] The max wait
 *  time in milliseconds
 *  @property {Picture2D} pictureBackground The title screen background picture
 *  @property {WindowBox} windowKeyboard The window box used for keyboard
 *  @property {WindowBox} windowInformations The window box used for
 *  informations
 *  @property {WindowChoices} windowChoicesMain The main window choices
 *  @property {WindowBox} windowPress The window box for pressing a new key
 *  @property {boolean} showPress Indicate if the HUD should display press box
 *  @property {number[][]} currentSC The current pressed shortcut
 *  @property {number[]} keysPressed The current key pressed
 *  @property {number} compareWait Wait time in milliseconds;
 */
class KeyboardAssign extends Base {
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
        this.windowKeyboard = new WindowBox(Constants.HUGE_SPACE, Constants
            .HUGE_SPACE, WindowBox.MEDIUM_SLOT_WIDTH, WindowBox
            .LARGE_SLOT_HEIGHT, {
            content: new Graphic.Text("KEYBOARD", { align: Align.Center }),
            padding: WindowBox.SMALL_SLOT_PADDING
        });
        this.windowInformations = new WindowBox(Constants.HUGE_SPACE + WindowBox
            .MEDIUM_SLOT_WIDTH + Constants.LARGE_SPACE, Constants.HUGE_SPACE, ScreenResolution.SCREEN_X - (2 * Constants.HUGE_SPACE) - WindowBox
            .MEDIUM_SLOT_WIDTH - Constants.LARGE_SPACE, WindowBox
            .LARGE_SLOT_HEIGHT, {
            content: new Graphic.Text("Select a keyboard shortcut to edit.", { align: Align.Center }),
            padding: WindowBox.SMALL_SLOT_PADDING
        });
        this.windowChoicesMain = new WindowChoices(Constants.HUGE_SPACE, Constants.HUGE_SPACE + WindowBox.LARGE_SLOT_HEIGHT + Constants
            .LARGE_SPACE, ScreenResolution.SCREEN_X - (2 * Constants.HUGE_SPACE), WindowBox.MEDIUM_SLOT_HEIGHT, Datas.Keyboards.getCommandsGraphics(), {
            nbItemsMax: 9,
            listCallbacks: Datas.Keyboards.getCommandsActions(),
            bordersInsideVisible: false
        });
        this.windowPress = new WindowBox((ScreenResolution.SCREEN_X / 2) - (Scene.KeyboardAssign.WINDOW_PRESS_WIDTH / 2), (ScreenResolution
            .SCREEN_Y / 2) - (Scene.KeyboardAssign.WINDOW_PRESS_HEIGHT / 2), Scene.KeyboardAssign.WINDOW_PRESS_WIDTH, Scene.KeyboardAssign
            .WINDOW_PRESS_HEIGHT, {
            content: this.windowChoicesMain.getCurrentContent(),
            padding: WindowBox.DIALOG_PADDING_BOX
        });
        // Initialize
        this.showPress = false;
        this.currentSC = [];
        this.keysPressed = [];
        this.compareWait = Scene.KeyboardAssign.MAX_WAIT_TIME_FIRST;
        this.loading = false;
    }
    /**
     *  Update the key.
     */
    updateKey() {
        this.compareWait = Scene.KeyboardAssign.MAX_WAIT_TIME_FIRST;
        this.waitTime = new Date().getTime();
        this.showPress = true;
        let graphic = this.windowChoicesMain
            .getCurrentContent();
        this.originalSC = graphic.kb.sc;
        this.currentSC = [];
        graphic.updateShort(this.currentSC);
        this.nextOR = true;
        return true;
    }
    /**
     *  Update the scene.
     */
    update() {
        if (this.showPress) {
            if (this.keysPressed.length === 0 && new Date().getTime() - this
                .waitTime >= this.compareWait) {
                this.showPress = false;
                // If nothing, go back to previous sc
                let graphic = this.windowChoicesMain
                    .getCurrentContent();
                if (this.currentSC.length === 0) {
                    graphic.updateShort(this.originalSC);
                }
                else {
                    Datas.Settings.updateKeyboard(graphic.kb.id, this.currentSC);
                }
                Manager.Stack.requestPaintHUD = true;
            }
        }
    }
    /**
     *  Handle scene key pressed.
     *  @param {number} key The key ID
     */
    onKeyPressed(key) {
        if (this.showPress) {
            this.keysPressed.push(key);
            if (this.nextOR) {
                this.currentSC.push([]);
                this.nextOR = false;
            }
            let current = this.currentSC[this.currentSC.length - 1];
            if (current.indexOf(key) === -1) {
                this.compareWait = Scene.KeyboardAssign.MAX_WAIT_TIME_FIRST;
                this.currentSC[this.currentSC.length - 1].push(key);
                this.windowChoicesMain.getCurrentContent()
                    .updateShort(this.currentSC);
            }
        }
        else {
            this.windowChoicesMain.onKeyPressed(key, this);
            if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                .Cancel) || Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                .controls.MainMenu)) {
                Datas.Systems.soundCancel.playSound();
                Manager.Stack.pop();
            }
        }
    }
    /**
     *  Handle scene key released.
     *  @param {number} key The key ID
     */
    onKeyReleased(key) {
        this.keysPressed.splice(this.keysPressed.indexOf(key), 1);
        if (this.keysPressed.length === 0 && this.currentSC.length > 0) {
            this.compareWait = Scene.KeyboardAssign.MAX_WAIT_TIME;
            this.nextOR = true;
            this.waitTime = new Date().getTime();
        }
    }
    /**
     *  Handle scene pressed and repeat key.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key) {
        if (!this.showPress) {
            this.windowChoicesMain.onKeyPressedAndRepeat(key);
            this.windowPress.content = this.windowChoicesMain.getCurrentContent();
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
        this.windowKeyboard.draw();
        this.windowInformations.draw();
        this.windowChoicesMain.draw();
        if (this.showPress) {
            this.windowPress.draw();
        }
    }
}
KeyboardAssign.WINDOW_PRESS_WIDTH = 300;
KeyboardAssign.WINDOW_PRESS_HEIGHT = 200;
KeyboardAssign.MAX_WAIT_TIME_FIRST = 3000;
KeyboardAssign.MAX_WAIT_TIME = 1000;
export { KeyboardAssign };
