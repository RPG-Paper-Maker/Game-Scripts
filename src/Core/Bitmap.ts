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
import { ScreenResolution } from "../Common/index.js"
import { Stack } from "../Manager/index.js"

export class Bitmap {

    public oX: number;
    public oY: number;
    public oW: number;
    public oH: number;
    public x: number;
    public y: number;
    public w: number;
    public h: number;

    constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
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
    setX(x: number, min: boolean = false) {
        this.oX = x;
        this.x = min ? ScreenResolution.getScreenMinXY(x) : ScreenResolution
            .getScreenX(x);
        Stack.requestPaintHUD = true;
    }

    // -------------------------------------------------------
    /** Set the y value
     *   @param {number} y The y value
     *   @param {boolean} [min=false] If checked, transform screen value with min
     *   x y
     */
    setY(y: number, min: boolean = false) {
        this.oY = y;
        this.y = min ? ScreenResolution.getScreenMinXY(y) : ScreenResolution
            .getScreenY(y);
        Stack.requestPaintHUD = true;
    }

    // -------------------------------------------------------
    /** Set the w value
     *   @param {number} w The w value
     *   @param {boolean} [min=false] If checked, transform screen value with min
     *   x y
     */
    setW(w: number, min: boolean = false) {
        this.oW = w;
        this.w = min ? ScreenResolution.getScreenMinXY(w) : ScreenResolution
            .getScreenX(w);
        Stack.requestPaintHUD = true;
    }

    // -------------------------------------------------------
    /** Set the h value
     *   @param {number} h The h value
     *   @param {boolean} [min=false] If checked, transform screen value with min
     *   x y
     */
    setH(h: number, min: boolean = false) {
        this.oH = h;
        this.h = min ? ScreenResolution.getScreenMinXY(h) : ScreenResolution
            .getScreenY(h);
        Stack.requestPaintHUD = true;
    }

    // -------------------------------------------------------
    /** Set the position to the left
     */
    setLeft() {
        this.oX = 0;
        this.x = 0;
        Stack.requestPaintHUD = true;
    }

    // -------------------------------------------------------
    /** Set the position to the top
     */
    setTop() {
        this.oY = 0;
        this.y = 0;
        Stack.requestPaintHUD = true;
    }

    // -------------------------------------------------------

    /** Set the position to the right
     */
    setRight(offset: number) {
        this.setX(ScreenResolution.SCREEN_X - this.oW - (offset ? offset : 0));
    }

    // -------------------------------------------------------
    /** Set the position to the bot
     */
    setBot(offset: number) {
        this.setY(ScreenResolution.SCREEN_Y - this.oH - (offset ? offset : 0));
    }

    // -------------------------------------------------------
    /** Set all the coords values
     *   @param {number} x The x value
     *   @param {number} y The y value
     *   @param {number} w The w value
     *   @param {number} h The h value
     */
    setCoords(x: number, y: number, w: number, h: number) {
        this.setX(x);
        this.setY(y);
        this.setW(w);
        this.setH(h);
    }
}
