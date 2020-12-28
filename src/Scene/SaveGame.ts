/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { SaveLoadGame } from "./SaveLoadGame";
import { Graphic, Datas, Manager } from "../index";
import { Enum } from "../Common";
import Align = Enum.Align;
import { Game } from "../Core";

/** @class
 *  A scene in the menu for saving a game.
 *  @extends Scene.SaveLoadGame
 */
class SaveGame extends SaveLoadGame {

    constructor() {
        super();
    }

    /** 
     *  Load async stuff.
     *  @async
     */
    async load() {
        await super.load();

        this.setContents.call(this, new Graphic.Text("Save a game", { align: 
            Align.Center }), new Graphic.Text(
            "Select a slot where you want to save.", { align: Align.Center }));
        this.loading = false;
    }

    /** 
     *  Save current game in the selected slot.
     */
    async save() {
        Datas.Systems.soundConfirmation.playSound();
        await Game.current.save(this.windowChoicesSlots
            .currentSelectedIndex + 1);
        Manager.Stack.pop();
        this.loading = false;
    }

    /** 
     *  Handle scene key pressed.
     *   @param {number} key The key ID
     */
    onKeyPressed(key: number) {
        super.onKeyPressed(key);

        // If action, save in the selected slot
        if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Action)) {
            this.loading = true;
            this.save();
        }
    }
}

export { SaveGame }