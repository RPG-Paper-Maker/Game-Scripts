/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants } from ".";
import { Platform } from "../Core";
import electron from 'electron';
const remote = electron.remote;
const console = remote.getGlobal('console');

/**
 * The static class containing all the utils functions.
 */
export class Utils {

    constructor() {
        throw new Error("This is a static class!");
    }

    public static defaultValue<T>(value: any, defaultValue: any): T {
        return this.isUndefined(value) ? defaultValue : value;
    }

    public static isUndefined(value: any): boolean {
        return typeof value === Constants.UNDEFINED;
    }

    /** Try catch for async functions
     *   @static
     *   @param {function} func The async function to apply
     *   @returns {any}
     */
    static async tryCatch(func) {
        try {
            return await func;
        } catch (e) {
            window.onerror(null, null, null, null, e);
        }
    }

    /** Return a string of the date by passing all the seconds
     *   @static
     *   @param {number} total Total number of seconds
     *   @returns {string}
     */
    static getStringDate(total) {
        return (this.formatNumber(Math.floor(total / 3600), 4) + Constants.STRING_COLON
            + this.formatNumber(Math.floor((total % 3600) / 60), 2) + Constants
                .STRING_COLON + this.formatNumber(Math.floor(total % 60), 2));
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

    /** Show an error object
     *   @static
     *   @param {Error} e The error message
     */
    static showError(e: Error) {
        Utils.showErrorMessage(e.message + Constants.STRING_NEW_LINE + e.stack);
    }

    /** Show an error message
     *   @static
     *   @param {string} msg The error message
     */
    static showErrorMessage(msg: string) {
        if (Platform.DESKTOP) {
            const dialog = require('electron').remote.dialog;
            dialog.showMessageBoxSync(
                {
                    title: 'Error',
                    type: 'error',
                    message: msg
                }
            );
        } else {
            console.alert(msg);
        }
    }
}