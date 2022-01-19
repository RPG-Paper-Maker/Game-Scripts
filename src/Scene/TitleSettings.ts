/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { Datas, Graphic, Manager } from "../index";
import { Picture2D, WindowBox, WindowChoices } from "../Core";
import { Enum, Constants, ScreenResolution, Inputs } from "../Common";
import PictureKind = Enum.PictureKind;
import Align = Enum.Align;

/** @class
 *  A scene for the title screen settings.
 *  @extends Scene.Base
 */
class TitleSettings extends Base {

    public pictureBackground: Picture2D;
    public windowSettings: WindowBox
    public windowInformations: WindowBox;
    public windowChoicesMain: WindowChoices;

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
                .TitleScreen, { cover: true });
        }

        // Creating windows
        this.windowSettings = new WindowBox(Constants.HUGE_SPACE, Constants
            .HUGE_SPACE, WindowBox.MEDIUM_SLOT_WIDTH, WindowBox
            .LARGE_SLOT_HEIGHT,
            {
                content: new Graphic.Text("SETTINGS", { align: Align.Center }),
                padding: WindowBox.SMALL_SLOT_PADDING
            }
        );
        this.windowInformations = new WindowBox(Constants.HUGE_SPACE + WindowBox
            .MEDIUM_SLOT_WIDTH + Constants.LARGE_SPACE, Constants.HUGE_SPACE, 
            ScreenResolution.SCREEN_X - (2 * Constants.HUGE_SPACE) - WindowBox
            .MEDIUM_SLOT_WIDTH - Constants.LARGE_SPACE, WindowBox
            .LARGE_SLOT_HEIGHT,
            {
                padding: WindowBox.SMALL_SLOT_PADDING
            }
        );
        this.windowChoicesMain = new WindowChoices(Constants.HUGE_SPACE, 
            Constants.HUGE_SPACE + WindowBox.LARGE_SLOT_HEIGHT + Constants
            .LARGE_SPACE, ScreenResolution.SCREEN_X - (2 * Constants.HUGE_SPACE)
            , WindowBox.MEDIUM_SLOT_HEIGHT, Datas.TitlescreenGameover
            .getTitleSettingsCommandsContent(), 
            {
                nbItemsMax: 9,
                listCallbacks: Datas.TitlescreenGameover.getTitleSettingsCommandsActions(),
                bordersInsideVisible: false
            }
        );
        this.windowInformations.content = this.windowChoicesMain
            .getCurrentContent();

        this.loading = false;
    }

    /** 
     *  Cancel the scene.
     */
    cancel() {
        Datas.Systems.soundCancel.playSound();
        Manager.Stack.pop();
    }

    /** 
     *  Translate the scene if possible.
     */
    translate() {
        
    }

    /**
     *  @inheritdoc
     */
    update() {
        this.windowChoicesMain.update();
    }

    /** 
     *  Handle scene key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: number) {
        this.windowChoicesMain.onKeyPressed(key);
        if (Datas.Keyboards.checkCancelMenu(key)) {
            this.cancel();
        }
    }

    /** 
     *  Handle scene pressed and repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key: number): boolean {
        this.windowChoicesMain.onKeyPressedAndRepeat(key);
        this.windowInformations.content = this.windowChoicesMain
            .getCurrentContent();
        return true;
    }

    /** 
     *  @inheritdoc
     */
    onMouseMove(x: number, y: number) {
        this.windowChoicesMain.onMouseMove(x, y);
    }

    /** 
     *  @inheritdoc
     */
    onMouseUp(x: number, y: number) {
        this.windowChoicesMain.onMouseUp(x, y);
        if (Inputs.mouseRightPressed) {
            this.cancel();
        }
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

export { TitleSettings }