/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { Manager, Datas } from "..";
import { Picture2D, WindowChoices, WindowBox } from "../Core";
import { Enum, Platform, ScreenResolution, Constants } from "../Common";
import PictureKind = Enum.PictureKind;

/** @class
 *  A scene for the title screen.
 *  @extends Scene.Base
 */
class TitleScreen extends Base {

    public pictureBackground: Picture2D;
    public windowChoicesCommands: WindowChoices;

    constructor() {
        super();
    }

    /** 
     *  Load async stuff.
     */
    async load() {
        // Stop all songs
        Manager.Songs.stopAll();

        // Destroy pictures
        Manager.Stack.displayedPictures = [];

        // Creating background
        if (Datas.TitlescreenGameover.isTitleBackgroundImage) {
            this.pictureBackground = await Picture2D.createWithID(Datas
                .TitlescreenGameover.titleBackgroundImageID, PictureKind
                .TitleScreen);
            this.pictureBackground.cover = true;
        } else
        {
            Platform.canvasVideos.classList.remove('hidden');
            Platform.canvasVideos.src = Datas.Videos.get(Datas
                .TitlescreenGameover.titleBackgroundVideoID).getPath();
            await Platform.canvasVideos.play();
        }

        // Windows
        let commandsNb = Datas.TitlescreenGameover.titleCommands.length;
        this.windowChoicesCommands = new WindowChoices(ScreenResolution.SCREEN_X
            / 2 - (WindowBox.MEDIUM_SLOT_WIDTH / 2), ScreenResolution.SCREEN_Y -
            Constants.HUGE_SPACE - (commandsNb * WindowBox.MEDIUM_SLOT_HEIGHT), 
            WindowBox.MEDIUM_SLOT_WIDTH, WindowBox.MEDIUM_SLOT_HEIGHT, Datas
            .TitlescreenGameover.getCommandsNames(),
            {
                nbItemsMax: commandsNb,
                listCallbacks: Datas.TitlescreenGameover.getCommandsActions(),
                padding: [0, 0, 0, 0]
            }
        );

        // Play title screen song
        Datas.TitlescreenGameover.titleMusic.playMusic();

        this.loading = false;
    }

    /** 
     *  Handle scene key pressed.
     *  @param {number} key The key ID
     */
    onKeyPressed(key: number) {
        this.windowChoicesCommands.onKeyPressed(key, this.windowChoicesCommands
            .getCurrentContent().datas);
    }

    /** 
     *  Handle scene pressed and repeat key.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key: number): boolean {
        return this.windowChoicesCommands.onKeyPressedAndRepeat(key);
    }

    /** 
     *  Draw the HUD scene.
     */
    drawHUD() {
        if (Datas.TitlescreenGameover.isTitleBackgroundImage) {
            this.pictureBackground.draw();
        }
        this.windowChoicesCommands.draw();
    }
}

export { TitleScreen }