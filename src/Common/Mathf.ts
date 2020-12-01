/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants } from ".";
import * as THREE from "../Vendor/three"

/** @class
 * The static class for Math related function.
 */
export class Mathf {

    constructor() {
        throw new Error("This is a static class!");
    }

    /** Check if an array is empty.
     *   @static
     *   @param {any[]} array The array to test
     *   @returns {boolean}
     */
    static isEmpty<T>(array: T[]): boolean {
        return array[0] == null;
    }

    /** Get the cos.
     *   @static
     *   @param {number} v The value
     *   @returns {number}
     */
    static cos(v: number): number {
        return parseFloat(Math.cos(v).toFixed(10));
    }

    /** Get the sin.
     *   @static
     *   @param {number} v The value
     *   @returns {number}
     */
    static sin(v: number): number {
        return parseFloat(Math.sin(v).toFixed(10));
    }

    /** Get portion according to a position.
     *   @static
     *   @param {THREE.Vector3} position The position
     *   @returns {number[]}
     */
    static getPortion(position: THREE.Vector3): number[] {
        return this.getPortionArray(this.getPosition(position));
    }

    /** Get portion according to array position.
     *   @static
     *   @param {number[]} p The array position
     *   @returns {number[]}
     */
    static getPortionArray(p: number[]): number[] {
        return [
            Math.floor(p[0] / Constants.PORTION_SIZE),
            Math.floor(p[1] / Constants.PORTION_SIZE),
            Math.floor(p[2] / Constants.PORTION_SIZE)
        ];
    }

    /** Get an array position according to position.
     *   @static
     *   @param {THREE.Vector3} position The position
     *   @returns {number[]}
     */
    static getPosition(position: THREE.Vector3): number[] {
        return [
            Math.floor(position.x / Constants.SQUARE_SIZE),
            Math.floor(position.y / Constants.SQUARE_SIZE),
            Math.floor(position.z / Constants.SQUARE_SIZE)
        ];
    }

    /** Give a modulo without negative value.
     *   @static
     *   @param {number} x
     *   @param {number} m
     *   @returns {number}
     */
    static mod(x: number, m: number): number {
        let r = x % m;
        return r < 0 ? r + m : r;
    }

    /** Get the list max ID.
     *   @static
     *   @param {number[]} list A list containing only IDs
     *   @returns {number}
     */
    static getMaxID(list: number[]): number {
        let max = 0;
        for (let i = 0, l = list.length; i < l; i++) {
            max = Math.max(list[i], max);
        }
        return max;
    }

    /** Create a random number between min and max.
     *   @static
     *   @param {number} min
     *   @param {number} max
     *   @returns {number}
     */
    static random(min: number, max: number): number {
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
    static variance(value: number, variance: number): number {
        let v = Math.round(value * variance / 100);
        return this.random(value - v, value + v);
    }
}