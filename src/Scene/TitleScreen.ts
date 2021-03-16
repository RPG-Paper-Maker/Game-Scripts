/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { Manager, Datas, Graphic } from "../index";
import { Picture2D, WindowChoices, WindowBox } from "../Core";
import { Enum, Platform, ScreenResolution, Constants } from "../Common";
import PictureKind = Enum.PictureKind;

/**
 * the Scene displaying the game title screen.
 *
 * @class TitleScreen
 * @extends {Base}
 */
class TitleScreen extends Base {

    /**
     * The title screen background image.
     *
     * @type {Picture2D}
     * @memberof TitleScreen
     */
    public pictureBackground: Picture2D;

    /**
     * The title screen command window.
     *
     * @type {WindowChoices}
     * @memberof TitleScreen
     */
    public windowChoicesCommands: WindowChoices;


    constructor() {
        super();
    }

    /**
     * @inheritdoc
     *
     * @memberof TitleScreen
     */
    create(): void {
        super.create();
    }

    /**
     * @inheritdoc
     *
     * @memberof TitleScreen
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
                .TitleScreen, { cover: true });
        } else {
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
     *  Translate the scene if possible.
     */
    translate() {
        for (let i = 0, l = this.windowChoicesCommands.listContents.length; i < l; i++) {
            (<Graphic.Text>this.windowChoicesCommands.listContents[i]).setText(
                Datas.TitlescreenGameover.titleCommands[i].name());
        }
    }

    /**
     * @inheritdoc
     *
     * @param {number} key - the key ID
     * @memberof TitleScreen
     */
    onKeyPressed(key: number) {
        this.windowChoicesCommands.onKeyPressed(key, this.windowChoicesCommands
            .getCurrentContent().datas);
    }

    /**
     * @inheritdoc
     *
     * @param {number} key - the key ID
     * @return {*}  {boolean}
     * @memberof TitleScreen
     */
    onKeyPressedAndRepeat(key: number): boolean {
        return this.windowChoicesCommands.onKeyPressedAndRepeat(key);
    }

    /**
     * @inheritdoc
     *
     * @memberof TitleScreen
     */
    drawHUD() {
        if (Datas.TitlescreenGameover.isTitleBackgroundImage) {
            this.pictureBackground.draw();
        }
        this.windowChoicesCommands.draw();
        console.log(this.windowChoicesCommands)
    }
}

export { TitleScreen }
