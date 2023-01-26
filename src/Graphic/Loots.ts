/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { Enum, ScreenResolution } from "../Common";
import LootKind = Enum.LootKind;
import { Graphic } from "..";
import { Item } from "../Core";

/** @class
 *  The graphic displaying all the items dropped at the end of a battle.
 *  @extends Graphic.Base
 */
class Loots extends Base {

    public graphicsLoots: Graphic.Item[];

    constructor(loots: Record<string, Item>[], nb: number) {
        super();

        let order = [LootKind.Weapon, LootKind.Armor, LootKind.Item];
        this.graphicsLoots = new Array(nb);
        let list: Record<string, Item>, id: string;
        for (let i = 0, j = 0, l = order.length; i < l; i++) {
            list = loots[order[i]];
            for (id in list) {
                this.graphicsLoots[j] = new Graphic.Item(list[id]);
                j++;
            }
        }
    }

    /** 
     *  Drawing the loots.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x: number = this.oX, y: number = this.oY, w: number = this.oW, h: 
        number = this.oH) {
        this.draw(x, y, w, h);
    }

    /** 
     *  Drawing the loots.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number) {
        for (let i = 0, l = this.graphicsLoots.length; i < l; i++) {
            this.graphicsLoots[i].drawChoice(x, y + (i * ScreenResolution
                .getScreenMinXY(30)), w, ScreenResolution.getScreenMinXY(30));
        }
    }
}

export { Loots }