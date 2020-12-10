/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Manager, Datas } from "../index.js";
import { Picture2D, WindowChoices } from "../Core/index.js";
import { Enum, Platform, ScreenResolution, Constants } from "../Common/index.js";
var PictureKind = Enum.PictureKind;
/** @class
 *  A scene for the title screen.
 *  @extends SceneGame
 *  @property {Picture2D} pictureBackground The title screen background picture
 *  @property {WindowChoices} windowChoicesCommands A window choices for
 *  choosing a command
 */
class TitleScreen extends Base {
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
        }
        else {
            Platform.canvasVideos.classList.remove('hidden');
            Platform.canvasVideos.src = Datas.Videos.get(Datas
                .TitlescreenGameover.titleBackgroundVideoID).getPath();
            await Platform.canvasVideos.play();
        }
        // Windows
        let commandsNb = Datas.TitlescreenGameover.titleCommands.length;
        this.windowChoicesCommands = new WindowChoices(ScreenResolution.SCREEN_X
            / 2 - (Constants.MEDIUM_SLOT_WIDTH / 2), ScreenResolution.SCREEN_Y -
            Constants.HUGE_SPACE - (commandsNb * Constants.MEDIUM_SLOT_HEIGHT), Constants.MEDIUM_SLOT_WIDTH, Constants.MEDIUM_SLOT_HEIGHT, Datas
            .TitlescreenGameover.getCommandsNames(), {
            nbItemsMax: commandsNb,
            listCallbacks: Datas.TitlescreenGameover.getCommandsActions(),
            padding: [0, 0, 0, 0]
        });
        // Play title screen song
        Datas.TitlescreenGameover.titleMusic.playMusic();
        this.loading = false;
    }
    /**
     *  Handle scene key pressed.
     *  @param {number} key The key ID
     */
    onKeyPressed(key) {
        this.windowChoicesCommands.onKeyPressed(key, this.windowChoicesCommands
            .getCurrentContent().datas);
    }
    /**
     *  Handle scene pressed and repeat key.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key) {
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
export { TitleScreen };
