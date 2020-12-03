/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Constants } from "./index.js";
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
    static defaultValue(value, defaultValue) {
        return this.isUndefined(value) ? defaultValue : value;
    }
    /** Check if the value is undefined
    *   @static
    *   @param {any} value The value
    *   @returns {boolean}
    */
    static isUndefined(value) {
        return typeof value === Constants.UNDEFINED;
    }
    /** Check if the value is a number
    *   @static
    *   @param {any} value The value
    *   @returns {boolean}
    */
    static isNumber(value) {
        return typeof value === Constants.NUMBER;
    }
    /** Check if the value is a string
     *   @static
     *   @param {any} value The value
     *   @returns {boolean}
     */
    static isString(value) {
        return typeof value === Constants.STRING;
    }
    /** Convert a number to boolean
     *   @static
     *   @param {number} num The number
     *   @returns {boolean}
     */
    static numToBool(num) {
        return num === Constants.NUM_BOOL_TRUE;
    }
    /** Convert a boolean to number
     *   @static
     *   @param {boolean} b The boolean
     *   @returns {number}
     */
    static boolToNum(b) {
        return b ? Constants.NUM_BOOL_TRUE : Constants.NUM_BOOL_FALSE;
    }
    /** Convert number to string
     *   @static
     *   @param {number} n The number
     *   @returns {string}
     */
    static numToString(n) {
        return "" + n;
    }
    /** Try catch for async functions
     *   @static
     *   @param {function} func The async function to apply
     *   @returns {Promise<any>}
     */
    static async tryCatch(func) {
        try {
            return await func();
        }
        catch (e) {
            window.onerror(null, null, null, null, e);
        }
    }
    /** Return a string of the date by passing all the seconds
     *   @static
     *   @param {number} total Total number of seconds
     *   @returns {string}
     */
    static getStringDate(total) {
        return (this.formatNumber(Math.floor(total / 3600), 4) + Constants
            .STRING_COLON + this.formatNumber(Math.floor((total % 3600) / 60), 2) + Constants.STRING_COLON + this.formatNumber(Math.floor(total % 60), 2));
    }
    /** Return the string of a number and parse with 0 according to a given size
     *   @static
     *   @param {number} num Number
     *   @param {number} size Max number to display
     *   @returns {string}
     */
    static formatNumber(num, size) {
        return ('000000000' + num).substr(-size);
    }
    /** Create a new array list initialed with null everywhere
     *   @static
     *   @param {number} size The list size
     *   @returns {any[]}
     */
    static fillNullList(size) {
        let list = new Array(size);
        for (let i = 0; i < size; i++) {
            list[i] = null;
        }
        return list;
    }
    /**
     *  Read a json list and create a System list sorted by ID.
     *  @static
     *  @param {Object[]} jsonList The json list to read
     *  @param {function} opts.func The function to apply
     *  @param {function} opts.cons The function to apply
     *  @param {boolean} [isConstructor=true] Indicate if the function is a
     *  constructor class
     *  @returns {any[]}
     */
    static readJSONSystemList(jsonList, { cons = undefined, func = undefined }) {
        let jsonElement;
        let l = jsonList.length;
        let list = [];
        for (let i = 0; i < l; i++) {
            jsonElement = jsonList[i];
            list[jsonElement.id] = Utils.isUndefined(cons) ? func.call(null, jsonElement) : new cons(jsonElement);
        }
        return list;
    }
    /**
     *  Read a json list and create a System list sorted by index
     *  @static
     *  @param {Object[]} jsonList The json list to read
     *  @param {function} func The function to apply
     *  @param {boolean} [isConstructor=true] Indicate if the function is a
     *  constructor class
     *  @returns {any[]}
     */
    static readJSONSystemListByIndex(jsonList, cons = undefined, func = undefined) {
        let jsonElement;
        let l = jsonList.length;
        let list = new Array(l);
        for (let i = 0; i < l; i++) {
            jsonElement = jsonList[i];
            list[i] = Utils.isUndefined(cons) ? func.call(null, jsonElement) :
                cons.call(jsonElement);
        }
        return list;
    }
    // -------------------------------------------------------
    /** Read a json list and create a System list by ID and another list by
     *   index (containing IDs), and return the max possible ID
     *   @static
     *   @param {Object[]} jsonList The json list to
     *   @param {any[]} listIDs The System list by ID
     *   @param {number[]} listIndexes The IDs list by index
     *   @param {function} func The function to apply
     *   @param {boolean} [isConstructor=true] Indicate if the function is a
     *   constructor class
     *   @returns {number}
     */
    static readJSONSystemListByIDIndex(jsonList, listIDs, listIndexes, func, isConstructor = true) {
        let l = jsonList.length;
        let maxID = 0;
        let id, jsonElement;
        for (let i = 0; i < l; i++) {
            jsonElement = jsonList[i];
            id = jsonElement.id;
            listIDs[id] = isConstructor ? new func(jsonElement) : func.call(null, jsonElement);
            listIndexes[i] = id;
            maxID = Math.max(id, maxID);
        }
        return maxID;
    }
    // -------------------------------------------------------
    /** Read a json list and create a hash list
     *   @static
     *   @param {Object[]} jsonList The json list to read
     *   @param {function} func The function to apply
     *   @param {boolean} [isConstructor=true] Indicate if the function is a
     *   constructor class
     *   @returns {any[]}
     */
    static readJSONSystemListHash(jsonList, func, isConstructor = true) {
        let list = [];
        let jsonElement;
        for (let i = 0, l = jsonList.length; i < l; i++) {
            jsonElement = jsonList[i];
            list[jsonElement[Constants.JSON_KEY]] = isConstructor ? new func(jsonElement[Constants.JSON_VALUE]) : func.call(null, jsonElement);
        }
        return list;
    }
    /**
     *  Get the number of fields of an object
     *  @static
     *  @param {Object} obj The object to count fields
     *  @returns {number}
     */
    static countFields(obj) {
        if (obj.__count__ !== undefined) { // Old FF
            return obj.__count__;
        }
        if (Object.keys) { // ES5
            return Object.keys(obj).length;
        }
        // Everything else:
        let c = 0;
        for (let p in obj) {
            if (obj.hasOwnProperty(p)) {
                c += 1;
            }
        }
        return c;
    }
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
Utils.createFont = function (fontSize, fontName, bold, italic) {
    return (bold ? "bold " : "") + (italic ? "italic " : "") + fontSize +
        "px " + fontName;
};
