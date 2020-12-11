/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { SaveLoadGame } from "./SaveLoadGame";
import { Graphic, Datas, Manager, Scene } from "..";
import { Enum, Constants, Platform } from "../Common";
import Align = Enum.Align;
import PictureKind = Enum.PictureKind;
import { Picture2D } from "../Core";

/** @class
 *  @extends SceneSaveLoadGame
 *  A scene in the menu for loading a game
 *  @property {Picture2D} pictureBackground The title screen background picture
 */
class LoadGame extends SaveLoadGame {

    public pictureBackground: Picture2D;

    constructor()
    {
        super();
    }

    /** 
     *  Load async stuff.
     */
    async load() {
        await super.load();

        this.setContents(new Graphic.Text("Load a game", { align: Align.Center }
            ), new Graphic.Text("Select a slot you want to load.", { align: 
            Align.Center }));
        if (Datas.TitlescreenGameover.isTitleBackgroundImage) {
            this.pictureBackground = await Picture2D.createWithID(Datas
                .TitlescreenGameover.titleBackgroundImageID, PictureKind
                .TitleScreen);
            this.pictureBackground.cover = true;
        }

        this.loading = false;
    }

    /** 
     *  Handle scene key pressed
     *  @param {number} key The key ID
     */
    onKeyPressed(key: number) {
        super.onKeyPressed(key);

        // If action, load the selected slot
        if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Action)) {
            Manager.Stack.game = (<Graphic.Save> this.windowChoicesSlots
                .getCurrentContent()).game;
            if (Manager.Stack.game.isEmpty) {
                Manager.Stack.game = null;
                Datas.Systems.soundImpossible.playSound();
            } else {
                Datas.Systems.soundConfirmation.playSound();

                // Initialize properties for hero
                Manager.Stack.game.hero.initializeProperties();

                // Stop video if existing
                if (!Datas.TitlescreenGameover.isTitleBackgroundImage) {
                    Platform.canvasVideos.classList.add(Constants.CLASS_HIDDEN);
                    Platform.canvasVideos.pause();
                    Platform.canvasVideos.src = "";
                }

                // Pop load and title screen from the stack
                Manager.Stack.pop();
                Manager.Stack.replace(new Scene.Map(Manager.Stack.game
                    .currentMapID));
            }
        }
    }

    /** 
     *  Draw the HUD scene
     */
    drawHUD() {
        if (Datas.TitlescreenGameover.isTitleBackgroundImage) {
            this.pictureBackground.draw();
        }
        super.drawHUD();
    }
}

export { LoadGame }