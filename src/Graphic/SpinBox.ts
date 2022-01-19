/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Graphic, Manager } from "..";
import { Enum, Utils } from "../Common";
import { Base } from "./Base";

/** @class
 *  The graphic displaying spinbox inside.
 *  @extends Graphic.Base
 */
class SpinBox extends Base {

    public graphicTimes: Graphic.Text;
    public graphicValue: Graphic.Text;
    public value: number;
    public times: boolean;

    constructor(value: number, times: boolean = true) {
        super();
        this.times = times;
        this.graphicTimes = new Graphic.Text("x");
        this.setValue(value);
    }

    /** 
     *  Update value.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    setValue(value: number) {
        if (this.value !== value) {
            this.value = value;
            this.graphicValue = new Graphic.Text(Utils.numToString(value), { 
                align: this.times ? Enum.Align.Right : Enum.Align.Center });
            Manager.Stack.requestPaintHUD = true;
        }
    }

    /** 
     *  Drawing the skill or item use informations.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number) {
        this.draw(x, y, w, h);
    }

    /** 
     *  Drawing the skill or item use informations.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number) {
        if (this.times) {
            this.graphicTimes.draw(x, y, w, h);    
        }
        this.graphicValue.draw(x, y, w, h);
    }
}

export { SpinBox }