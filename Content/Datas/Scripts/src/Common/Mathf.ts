/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants } from ".";
import { Datas } from "..";
const THREE = require('./Content/Datas/Scripts/Libs/three.js');

/** @class
 * The static class for Math related function.
 */
class Mathf {

    constructor() {
        throw new Error("This is a static class!");
    }

    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {(T, number, T[]): boolean} splitCallback - The callback in the
     *                                                    Array split method
     * @param {any} splitThis? - The context of splitCallback
     * @returns {[T[]]} - The fully splitted array from array
     */
    static split<T>(array: T[], splitCallback: (elem: T, i: number, self: T[]) 
        => boolean, splitThis?: any): T[][]
    {
        const newArray: T[][] = [];
        let newGroup: T[] = [];
        // forEach is tested to be the fastest among sandboxes including NW.js
        array.forEach((elem: T, i: number) => {
            // It's ok to call undefined context with previously bound callbacks
            if (splitCallback.call(splitThis, elem, i, array)) {
                newArray.push(newGroup); // It's ok for 1st group to be empty
                newGroup = [];
            } else newGroup.push(elem);
            //
        });
        newArray.push(newGroup); // It's ok for the last group to be empty
        //
        return newArray;
    } // split

    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to be checked against
     * @param {T[]} array2 - The 2nd array to be checked against
     * @returns {boolean} If array1's a proper subset of array2
     */
    static isProperSubsetOf<T>(array1: T[], array2: T[]): boolean {
        return this.isSubsetOf(array1, array2) && !this.isSubsetOf(array2, array1);
    }; // isProperSubsetOf

    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to be checked against
     * @param {T[]} array2 - The 2nd array to be checked against
     * @returns {boolean} If array1's a proper superset of array2
     */
    static isProperSupersetOf<T>(array1: T[], array2: T[]): boolean {
        return this.isSupersetOf(array1, array2) && !this.isSupersetOf(array2, array1);
    }; // isProperSupersetOf

    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to be checked against
     * @param {T[]} array2 - The 2nd array to be checked against
     * @returns {boolean} If array1's a superset of array2
     */
    static isSupersetOf<T>(array1: T[], array2: T[]): boolean {
        return this.isSubsetOf(array2, array1);
    }; // isSupersetOf

    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {[*]} arr - The array to be checked against
     * @param {T[]} array1 - The 1st array to be checked against
     * @param {T[]} array2 - The 2nd array to be checked against
     * @returns {boolean} If array1's a subset of array2
     */
    static isSubsetOf<T>(array1: T[], array2: T[]): boolean {
        return this.isEmpty(this.difference(array1, array2));
    }; // isSubsetOf

    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have symmetric difference with
     * @param {T[]} array2 - The 2nd array to have symmetric difference with
     * @returns {T[]} The symmetric difference of array1 and array2
     */
    static symmetricDifference<T>(array1: T[], array2: T[]): T[] {
        return this.union(this.difference(array1, array2), this.difference(array2, array1));
    }; // symmetricDifference

    /**
     * This method changes the original array
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have symmetric difference with
     * @param {T[]} array2 - The 2nd array to have symmetric difference with
     * @returns {T[]} The symmetric difference of array1 and array2
     */
    static symmetricDifferenceInPlace<T>(array1: T[], array2: T[]): T[] {
        return this.unionInPlace(this.differenceInPlace(array1, array2), this.difference(array2, array1));
    }; // symmetricDifferenceInPlace

    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have union with
     * @param {T[]} array2 - The 2nd array to have union with
     * @returns {T[]} The union of array1 and array2
     */
    static union<T>(array1: T[], array2: T[]): T[] {
        return array1.concat(this.difference(array2, array1));
    }; // union

    /**
     * This method changes the original array
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have union with
     * @param {T[]} array2 - The 2nd array to have union with
     * @returns {T[]} The union of array1 and array2
     */
    static unionInPlace<T>(array1: T[], array2: T[]): T[] {
        array1.push(...this.difference(array2, array1));
        return array1;
    }; // unionInPlace

    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have difference with
     * @param {T[]} array2 - The 2nd array to have difference with
     * @returns {T[]} The difference of array1 and array2
     */
    static difference<T>(array1: T[], array2: T[]): T[] {
        return array1.filter((elem: T) => this.excludes(array2, elem, 0));
    }; // difference

    /**
     * This method changes the original array
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have difference with
     * @param {T[]} array2 - The 2nd array to have difference with
     * @returns {T[]} The difference of array1 and array2
     */
    static differenceInPlace<T>(array1: T[], array2: T[]): T[] {
        for (let i: number = 0; ; i++) {
            while (array1[i] && array2.includes(array1[i])) array1.splice(i, 1);
            if (!array1[i]) return array1;
        }
    }; // differenceInPlace

    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have intersection with
     * @param {T[]} array2 - The 2nd array to have intersection with
     * @returns {T[]} The intersection of array1 and array2
     */
    static intersection<T>(array1: T[], array2: T[]): T[] {
        // The 2nd argument of includes doesn't match with that of filter
        return array1.filter((elem: T) => array2.includes(elem));
        //
    }; // intersection

    /**
     * This method changes the original array
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have intersection with
     * @param {T[]} array2 - The 2nd array to have intersection with
     * @returns {T[]} The intersection of array1 and array2
     */
    static intersectionInPlace<T>(array1: T[], array2: T[]): T[] {
        for (let i: number = 0; ; i++) {
            while (array1[i] && this.excludes(array2, array1[i], 0)) {
                array1.splice(i, 1);
            }
            if (!array1[i]) return array1;
        }
    }; // intersectionInPlace

    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array - The array to be checked against
     * @param {*} elem - The element to be checked against
     * @param {index} fromI - The index in this at which to begin searching
     * @returns {boolean} If array doesn't have elem
     */
    static excludes<T>(array: T[], elem: T, fromI: number): boolean {
        return !array.includes(elem, fromI);
    }; // excludes

    /**
     * Potential Hotspot/Idempotent
     * @author DoubleX @interface
     * @param {T[]} array - The array to be cleared
     */
    static clear<T>(array: T[]): void { array.length = 0; };

    /** Check if an array is empty.
     *   @static
     *   @param {any[]} array The array to test
     *   @returns {boolean}
     */
    static isEmpty<T>(array: T[]): boolean {
        // Edited to fix the bug of nonempty array with 1st element being null
        return array.length === 0;
        //
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
    static getPortion(position: typeof THREE.Vector3): number[] {
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
    static getPosition(position: typeof THREE.Vector3): number[] {
        return [
            Math.floor(position.x / Datas.Systems.SQUARE_SIZE),
            Math.floor(position.y / Datas.Systems.SQUARE_SIZE),
            Math.floor(position.z / Datas.Systems.SQUARE_SIZE)
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

export { Mathf }
