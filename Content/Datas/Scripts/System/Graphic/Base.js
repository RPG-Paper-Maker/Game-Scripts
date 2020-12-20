/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Bitmap } from "../Core";
/**
 *  @class
 *  The abstract class who model the Structure of graphics (inside window boxes).
 */
class Base extends Bitmap {
    /** Drawing the stuff behind the window box.
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
     */
    drawBehind(x, y, w, h) {
    }
    /**
     *  Update the content.
     */
    update() {
    }
}
export { Base };
