/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants, Globals } from ".";

/**
 * The static class for Math related function
 */
export class Mathf {

    constructor() {
        throw new Error("This is a static class!");
    }


    // -------------------------------------------------------
    /** Check if an array is empty
     *   @static
     *   @param {any[]} array The array to test
     *   @returns {boolean}
     */
    static isEmpty(array) {
        return array[0] == null;
    }

    // -------------------------------------------------------
    /** Get the cos
     *   @static
     *   @param {number} w The value
     *   @returns {number}
     */
    static cos(w) {
        return parseFloat(Math.cos(w).toFixed(10));
    }

    /** Get the sin
     *   @static
     *   @param {number} w The value
     *   @returns {number}
     */
    static sin(w) {
        return parseFloat(Math.sin(w).toFixed(10));
    }

    /** Get portion according to a position
     *   @static
     *   @param {THREE.Vector3} position The position
     *   @returns {number[]}
     */
    static getPortion(position) {
        return this.getPortionArray(this.getPosition(position));
    }

    /** Get portion according to array position
     *   @static
     *   @param {number[]} p The array position
     *   @returns {number[]}
     */
    static getPortionArray(p) {
        return [
            Math.floor(p[0] / Constants.PORTION_SIZE),
            Math.floor(p[1] / Constants.PORTION_SIZE),
            Math.floor(p[2] / Constants.PORTION_SIZE)
        ];
    }

    /** Get an array position according to position
     *   @static
     *   @param {THREE.Vector3} position The position
     *   @returns {number[]}
     */
    static getPosition(position) {
        return [
            Math.floor(position.x / Constants.SQUARE_SIZE),
            Math.floor(position.y / Constants.SQUARE_SIZE),
            Math.floor(position.z / Constants.SQUARE_SIZE)
        ];
    }

    /** Give a modulo without negative value
     *   @static
     *   @param {number} x
     *   @param {number} m
     *   @returns {number}
     */
    static mod(x, m) {
        let r = x % m;
        return r < 0 ? r + m : r;
    }

    /** Get the list max ID
     *   @static
     *   @param {number[]} list A list containing only IDs
     *   @returns {number}
     */
    static getMaxID(list) {
        let max = 0;
        for (let i = 0, l = list.length; i < l; i++) {
            max = Math.max(list[i], max);
        }
        return max;
    }

    /** Create a random number between min and max
     *   @static
     *   @param {number} min
     *   @param {number} max
     *   @returns {number}
     */
    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Clamp a number between two values.
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @author Nio Kasgami
     */
    static clamp(value: number, min: number, max: number): number {
        return value <= min ? min : value >= max ? max : value;
    }

    /** Get random value according to value and variance
     *   @static
     *   @param {number} value
     *   @param {number} variance
     *   @returns {number}
     */
    static variance(value, variance) {
        let v = Math.round(value * variance / 100);
        return this.random(value - v, value + v);
    }

    // -------------------------------------------------------
    /** Get the pixel position transformation according to screen size
     *   @static
     *   @param {number} x The position on screen
     *   @returns {number}
     */
    static getScreenX(x) {
        return Math.ceil(Mathf.getDoubleScreenX(x));
    }

    // -------------------------------------------------------
    /** Get the pixel position transformation according to screen size
     *   @static
     *   @param {number} y The position on screen
     *   @returns {number}
     */
    static getScreenY(y) {
        return Math.ceil(Mathf.getDoubleScreenY(y));
    }

    // -------------------------------------------------------
    /** Get the pixel position transformation according to screen size
     *   @static
     *   @param {number} xy The position on screen
     *   @returns {number}
     */
    static getScreenXY(xy) {
        return Math.ceil((Globals.WINDOW_X + Globals.WINDOW_Y) / 2 * xy);
    }

    // -------------------------------------------------------
    /** Get the min pixel position transformation according to screen size
     *   @static
     *   @param {number} xy The position on screen
     *   @returns {number}
     */
    static getScreenMinXY(xy) {
        return Math.ceil(xy * Math.min(Globals.WINDOW_X, Globals.WINDOW_Y));
    }

    // -------------------------------------------------------
    /** Get the pixel position transformation according to screen size, but
     *   without rounding it
     *   @static
     *   @param {number} x The position on screen
     *   @returns {number}
     */
    static getDoubleScreenX(x) {
        return Globals.WINDOW_X * x;
    }

    // -------------------------------------------------------
    /** Get the pixel position transformation according to screen size, but
     *   without rounding it
     *   @static
     *   @param {number} y The position on screen
     *   @returns {number}
     */
    static getDoubleScreenY(y) {
        return Globals.WINDOW_Y * y;
    }
}