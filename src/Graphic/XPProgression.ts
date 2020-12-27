/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { Graphic, Manager } from "..";

/** @class
 *  The graphic displaying all the progression for each character.
 *  @extends Graphic.Base
*/
class XPProgression extends Base {

    public graphicCharacters: Graphic.Player[];
    constructor() {
        super();

        let l = Manager.Stack.game.teamHeroes.length;
        this.graphicCharacters = new Array(l);
        for (let i = 0; i < l; i++) {
            this.graphicCharacters[i] = new Graphic.Player(Manager.Stack.game
                .teamHeroes[i]);
        }
    }

    /** 
     *  Update graphics experience.
     */
    updateExperience() {
        for (let i = 0, l = Manager.Stack.game.teamHeroes.length; i < l; i++) {
            this.graphicCharacters[i].updateExperience();
        }
    }

    /** 
     *  Drawing the progression.
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
    */
    drawChoice(x: number, y: number, w: number, h: number) {
        this.draw(x, y, w, h);
    }

    /** 
     *  Drawing the progression.
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
    */
    draw(x: number, y: number, w: number, h: number) {
        for (let i = 0, l = this.graphicCharacters.length; i < l; i++) {
            this.graphicCharacters[i].drawChoice(x, y + (i * 90), w, 85);
        }
    }
}

export { XPProgression }