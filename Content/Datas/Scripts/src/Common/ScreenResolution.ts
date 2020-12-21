/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *  @static
 *  A static class for having a quick access to screen resolution variables and 
 *  functions;
 */
class ScreenResolution {
    public static readonly SCREEN_X: number = 640;
    public static readonly SCREEN_Y: number = 480;
    public static CANVAS_WIDTH: number;
    public static CANVAS_HEIGHT: number;
    public static WINDOW_X: number;
    public static WINDOW_Y: number;

    constructor() {
        throw new Error("This is a static class");
    }

    /** Get the pixel position transformation according to screen size
     *   @static
     *   @param {number} x The position on screen
     *   @returns {number}
     */
    static getScreenX(x: number): number {
        return Math.ceil(ScreenResolution.getDoubleScreenX(x));
    }

    /** Get the pixel position transformation according to screen size
     *   @static
     *   @param {number} y The position on screen
     *   @returns {number}
     */
    static getScreenY(y: number): number {
        return Math.ceil(ScreenResolution.getDoubleScreenY(y));
    }

    /** Get the pixel position transformation according to screen size
     *   @static
     *   @param {number} xy The position on screen
     *   @returns {number}
     */
    static getScreenXY(xy: number): number {
        return Math.ceil((ScreenResolution.WINDOW_X + ScreenResolution.WINDOW_Y)
            / 2 * xy);
    }

    /** Get the min pixel position transformation according to screen size
     *   @static
     *   @param {number} xy The position on screen
     *   @returns {number}
     */
    static getScreenMinXY(xy: number): number {
        return Math.ceil(xy * Math.min(ScreenResolution.WINDOW_X, 
            ScreenResolution.WINDOW_Y));
    }

    /** Get the pixel position transformation according to screen size, but
     *   without rounding it
     *   @static
     *   @param {number} x The position on screen
     *   @returns {number}
     */
    static getDoubleScreenX(x: number): number {
        return ScreenResolution.WINDOW_X * x;
    }

    /** Get the pixel position transformation according to screen size, but
     *   without rounding it
     *   @static
     *   @param {number} y The position on screen
     *   @returns {number}
     */
    static getDoubleScreenY(y: number): number {
        return ScreenResolution.WINDOW_Y * y;
    }
}

export { ScreenResolution }