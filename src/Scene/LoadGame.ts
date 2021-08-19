/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { SaveLoadGame } from "./SaveLoadGame";
import { Graphic, Datas, Manager, Scene } from "../index";
import { Enum, Constants, Platform, Inputs } from "../Common";
import Align = Enum.Align;
import PictureKind = Enum.PictureKind;
import { Picture2D, Game } from "../Core";

/** @class
 *  A scene in the menu for loading a game.
 *  @extends Scene.SaveLoadGame
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
                .TitleScreen, { cover: true });
        }
        this.loading = false;
    }

    async loadGame() {
        this.loading = true;
        await Game.current.loadPositions();

        // Initialize properties for hero
        Game.current.hero.initializeProperties();

        // Stop video if existing
        if (!Datas.TitlescreenGameover.isTitleBackgroundImage) {
            Platform.canvasVideos.classList.add(Constants.CLASS_HIDDEN);
            Platform.canvasVideos.pause();
            Platform.canvasVideos.src = "";
        }

        // Pop load and title screen from the stack
        Manager.Stack.pop();
        Manager.Stack.replace(new Scene.Map(Game.current
            .currentMapID));
        this.loading = false;
    }

    /** 
     *  Slot action.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    action(isKey: boolean, options: { key?: number, x?: number, y?: number } = {}) {
        if (Scene.MenuBase.checkActionMenu(isKey, options)) {
            Game.current = (<Graphic.Save> this.windowChoicesSlots.getCurrentContent())
            .game;
            if (Game.current.isEmpty) {
                Game.current = null;
                Datas.Systems.soundImpossible.playSound();
            } else {
                Datas.Systems.soundConfirmation.playSound();
                this.loadGame();
            }
        }
    }

    /** 
     *  Handle scene key pressed
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: number) {
        super.onKeyPressed(key);
        this.action(true, { key: key });
    }

    /** 
     *  @inheritdoc
     */
    onMouseUp(x: number, y: number) {
        super.onMouseUp(x, y);
        this.action(false, { x: x, y: y });
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