/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Bitmap } from "../Core"

/** 
 *  @class
 *  The abstract class who model the Structure of graphics (inside window boxes).
 */
abstract class Base extends Bitmap {

    public datas: Object;

    /** Drawing the stuff behind the window box.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawBehind(x: number, y: number, w: number, h: number) {
        
    }

    /** 
     *  Update the content.
     */
    update() {

    }

    /**
     *  Drawing the graphic.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     *  @param {boolean} positionResize - If checked, resize postion 
     *  according to screen resolution
     */
    abstract drawChoice(x: number, y: number, w: number, h: number) :void;

    /** 
     *  Drawing the graphic in box.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     *  @param {boolean} positionResize - If checked, resize postion 
     *  according to screen resolution
     */
    abstract draw(x: number, y: number, w: number, h: number) :void;
}

export { Base }