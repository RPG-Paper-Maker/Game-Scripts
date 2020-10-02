/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A bitmap is something that can be drawn on the HUD. It can be a window,
*   a text, an image...
*   @property {number} x x coord of the bitmap
*   @property {number} y y coord of the bitmap
*   @property {number} w w coord of the bitmap
*   @property {number} h h coord of the bitmap
*   @param {number} [x=0] x coord of the bitmap
*   @param {number} [y=0] y coord of the bitmap
*   @param {number} [w=0] w coord of the bitmap
*   @param {number} [h=0] h coord of the bitmap
*/
class Bitmap
{
    constructor(x = 0, y = 0, w = 0, h = 0)
    {
        this.setX(x);
        this.setY(y);
        this.setW(w);
        this.setH(h);
    }

    // -------------------------------------------------------
    /** Set the x value
    *   @param {number} x The x value
    *   @param {boolean} [min=false] If checked, transform screen value with min 
    *   x y
    */
    setX(x, min = false)
    {
        this.oX = x;
        this.x = min ? RPM.getScreenMinXY(x) : RPM.getScreenX(x);
        RPM.requestPaintHUD = true;
    }

    // -------------------------------------------------------
    /** Set the y value
    *   @param {number} y The y value
    *   @param {boolean} [min=false] If checked, transform screen value with min 
    *   x y
    */
    setY(y, min)
    {
        this.oY = y;
        this.y = min ? RPM.getScreenMinXY(y) : RPM.getScreenY(y);
        RPM.requestPaintHUD = true;
    }

    // -------------------------------------------------------
    /** Set the w value
    *   @param {number} w The w value
    *   @param {boolean} [min=false] If checked, transform screen value with min 
    *   x y
    */
    setW(w, min)
    {
        this.oW = w;
        this.w = min ? RPM.getScreenMinXY(w) : RPM.getScreenX(w);
        RPM.requestPaintHUD = true;
    }

    // -------------------------------------------------------
    /** Set the h value
    *   @param {number} h The h value
    *   @param {boolean} [min=false] If checked, transform screen value with min 
    *   x y
    */
    setH(h, min)
    {
        this.oH = h;
        this.h = min ? RPM.getScreenMinXY(h) : RPM.getScreenY(h);
        RPM.requestPaintHUD = true;
    }

    // -------------------------------------------------------
    /** Set the position to the top
    */
    setLeft()
    {
        this.oX = 0;
        this.x = 0;
        RPM.requestPaintHUD = true;
    }

    // -------------------------------------------------------
    /** Set the position to the top
    */
    setTop()
    {
        this.oY = 0;
        this.y = 0;
        RPM.requestPaintHUD = true;
    }

    // -------------------------------------------------------

    /** Set the position to the right
    */
    setRight(offset)
    {
        this.setX(RPM.SCREEN_X - this.oW - (offset ? offset : 0));
    }

    // -------------------------------------------------------
    /** Set the position to the bot
    */
    setBot(offset)
    {
        this.setY(RPM.SCREEN_Y - this.oH - (offset ? offset : 0));
    }

    // -------------------------------------------------------
    /** Set all the coords values
    *   @param {number} x The x value
    *   @param {number} y The y value
    *   @param {number} w The w value
    *   @param {number} h The h value
    */
    setCoords(x, y, w, h)
    {
        this.setX(x);
        this.setY(y);
        this.setW(w);
        this.setH(h);
    }
}
