/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Game } from "../Core";
import { Graphic } from "..";
import { Base } from "./Base";
import { Enum, Utils } from "../Common";
import Align = Enum.Align;

/** @class
 *  The graphic displaying a save.
 *  @property {Game} game The game save
 *  @property {GraphicText} graphicSlot The graphic text slot
 *  @property {GraphicText} graphicEmpty The graphic text empty
 *  @property {GraphicText} graphicTimer The graphic text timer
 *  @property {GraphicPlayer[]} graphicCharacters The graphic players list for 
 *  characters
 */
class Save extends Base {

    public game: Game;
    public graphicSlot: Graphic.Text;
    public graphicEmpty: Graphic.Text;
    public graphicTimer: Graphic.Text;
    public graphicPlayers: Graphic.Player[];

    constructor(game) {
        super();

        this.game = game;
        this.graphicSlot = new Graphic.Text("Slot " + this.game.slot, { align: 
            Align.Center });
        if (this.game.isEmpty) {
            this.graphicEmpty = new Graphic.Text("Empty", { align: Align.Center });
        } else {
            this.graphicTimer = new Graphic.Text(Utils.getStringDate(this.game
                .playTime.getSeconds()), { align: Align.Right });
            let l = this.game.teamHeroes.length;
            this.graphicPlayers = new Array(l);
            let graphic: Graphic.Player;
            for (let i = 0; i < l; i++) {
                graphic = new Graphic.Player(this.game.teamHeroes[i]);
                graphic.initializeCharacter();
                this.graphicPlayers[i] = graphic;
            }
        }
    }

    /** 
     *  Update the battler graphics.
     */
    update() {
        for (let i = 0, l = this.graphicPlayers.length; i < l; i++) {
            this.graphicPlayers[i].updateBattler();
        }
    }

    /** 
     *  Drawing the save slot.
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number) {
        this.graphicSlot.draw(x, y, w, h);
    }

    /** Drawing the save informations.
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number) {
        if (this.game.isEmpty) {
            this.graphicEmpty.draw(x, y, w, h);
        } else {
            this.graphicTimer.draw(x, y, w, 20);
            for (let i = 0, l = this.graphicPlayers.length; i < l; i++) {
                this.graphicPlayers[i].drawCharacter(x + 5 + (i * 115), y + 20, 
                    w, h);
            }
        }
    }
}

export { Save }