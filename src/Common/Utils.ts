/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants } from ".";

/**
 * The static class containing all the utils functions.
 */
export class Utils {

    constructor() {
        throw new Error("This is a static class!");
    }

    /** 
     *  Return default value if undefined, else the value
     *  @static
     *  @param {any} value The value
     *  @param {any} defaultValue The default value
     *  @returns {any}
     */
    public static defaultValue<T>(value: T, defaultValue: T): T {
        return this.isUndefined(value) ? defaultValue : value;
    }

    /** Check if the value is undefined
    *   @static
    *   @param {any} value The value
    *   @returns {boolean}
    */
    public static isUndefined(value: any): boolean {
        return typeof value === Constants.UNDEFINED;
    }

    /** Check if the value is a number
    *   @static
    *   @param {any} value The value
    *   @returns {boolean}
    */
    static isNumber(value: any): boolean
    {
        return typeof value === Constants.NUMBER;
    }

    /** Check if the value is a string
     *   @static
     *   @param {any} value The value
     *   @returns {boolean}
     */
    static isString(value: any): boolean
    {
        return typeof value === Constants.STRING;
    }

    /** Convert a number to boolean
     *   @static
     *   @param {number} num The number
     *   @returns {boolean}
     */
    static numToBool(num: number): boolean
    {
        return num === Constants.NUM_BOOL_TRUE;
    }

    /** Convert a boolean to number
     *   @static
     *   @param {boolean} b The boolean
     *   @returns {number}
     */
    static boolToNum(b: boolean): number
    {
        return b ? Constants.NUM_BOOL_TRUE : Constants.NUM_BOOL_FALSE;
    }

    /** Convert number to string
     *   @static
     *   @param {number} n The number
     *   @returns {string}
     */
    static numToString(n: number): string
    {
        return Constants.STRING_EMPTY + n;
    }

    /** Try catch for async functions
     *   @static
     *   @param {function} func The async function to apply
     *   @returns {Promise<any>}
     */
    static async tryCatch(func: Function): Promise<any> {
        try {
            return await func();
        } catch (e) {
            window.onerror(null, null, null, null, e);
        }
    }

    /** Return a string of the date by passing all the seconds
     *   @static
     *   @param {number} total Total number of seconds
     *   @returns {string}
     */
    static getStringDate(total: number): string {
        return (this.formatNumber(Math.floor(total / 3600), 4) + Constants
            .STRING_COLON + this.formatNumber(Math.floor((total % 3600) / 60), 2
            ) + Constants.STRING_COLON + this.formatNumber(Math.floor(total % 60
            ), 2));
    }

    /** Return the string of a number and parse with 0 according to a given size
     *   @static
     *   @param {number} num Number
     *   @param {number} size Max number to display
     *   @returns {string}
     */
    static formatNumber(num: number, size: number): string {
        return ('000000000' + num).substr(-size);
    }

    /** Create a new array list initialed with null everywhere
     *   @static
     *   @param {number} size The list size
     *   @returns {any[]}
     */
    static fillNullList(size: number): any[] {
        let list = new Array(size);
        for (let i = 0; i < size; i++) {
            list[i] = null;
        }
        return list;
    }

    /** Link the fontSize and the fontName to a string that can be used by the
    *   canvasHUD
    *   @static
    *   @param {number} fontSize The fontSize
    *   @param {string} fontName The fontName
    *   @param {boolean} bold Indicate if the text is bold
    *   @param {boolean} italic Indicate if the text is italic
    *   @returns {string}
    */
    static createFont = function(fontSize: number, fontName: string, bold: 
        boolean, italic: boolean) {
        return (bold ? "bold " : "") + (italic ? "italic " : "") + fontSize + 
            "px " + fontName;
    }
}