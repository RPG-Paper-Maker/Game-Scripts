import { Base } from "./Base";
import { Player } from "../Core";
import { Graphic } from "..";
/** @class
 *  The graphic displaying all the stats modifications in the equip menu.
 *  @extends Graphic.Base
 *  @param {Player} player The current selected player
 *  @param {number[]} newValues The new values of statistics with the
 *  equipment we are currently trying to equip. This array is empty if we are
 *  not trying to equip something
 */
declare class EquipStats extends Base {
    isChanging: boolean;
    listStatsNames: Graphic.Text[];
    listStats: Graphic.Text[];
    listNewStats: Graphic.Text[];
    nameLength: number;
    valueLength: number;
    graphicArrow: Graphic.Text;
    arrowLength: number;
    constructor(gamePlayer: Player, newValues: number[]);
    /**
     *  Drawing the statistics modifications.
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
    */
    drawChoice(x: number, y: number, w: number, h: number): void;
    /**
     *  Drawing the statistics modifications.
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
    */
    draw(x: number, y: number, w: number, h: number): void;
}
export { EquipStats };
