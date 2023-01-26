/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { SaveLoadGame } from "./SaveLoadGame";
import { Graphic, Datas, Manager, Scene } from "../index";
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
     *  Create scene.
     */
    create() {
        super.create();
    }

    /** 
     *  Load async stuff.
     *  @async
     */
    async load() {
        await super.load();
        this.setContents.call(this, new Graphic.Text(Datas.Languages.extras
            .saveAGame.name(), { align: Align.Center }), new Graphic.Text(
            Datas.Languages.extras.saveAGameDescription.name(), { align: Align.Center }));
        this.loading = false;
    }

    /** 
     *  Save current game in the selected slot.
     */
    async save() {
        await Game.current.save(this.windowChoicesSlots.currentSelectedIndex + 1);
        Manager.Stack.pop();
        Manager.Stack.requestPaintHUD = true;
        this.loading = false;
    }

    /** 
     *  Slot action.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    action(isKey: boolean, options: { key?: number, x?: number, y?: number } = {}) {
        // If action, save in the selected slot
        if (Scene.MenuBase.checkActionMenu(isKey, options)) {
            Datas.Systems.soundConfirmation.playSound();
            Manager.Stack.push(new Scene.Confirm(() => {
                this.save();
            }));
        }
    }

    /** 
     *  Slot move.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    move(isKey: boolean, options: { key?: number, x?: number, y?: number } = {}) {
        super.move(isKey, options);
    }

    /** 
     *  Handle scene key pressed.
     *   @param {number} key - The key ID
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
        super.drawHUD();
    }
}

export { SaveGame }