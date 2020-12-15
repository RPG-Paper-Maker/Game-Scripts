/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Constants } from "./index.js";
import { Datas } from "../index.js";
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
    static split(array, splitCallback, splitThis) {
        const newArray = [];
        let newGroup = [];
        // forEach is tested to be the fastest among sandboxes including NW.js
        array.forEach((elem, i) => {
            // It's ok to call undefined context with previously bound callbacks
            if (splitCallback.call(splitThis, elem, i, array)) {
                newArray.push(newGroup); // It's ok for 1st group to be empty
                newGroup = [];
            }
            else
                newGroup.push(elem);
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
    static isProperSubsetOf(array1, array2) {
        return this.isSubsetOf(array1, array2) && !this.isSubsetOf(array2, array1);
    }
    ; // isProperSubsetOf
    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to be checked against
     * @param {T[]} array2 - The 2nd array to be checked against
     * @returns {boolean} If array1's a proper superset of array2
     */
    static isProperSupersetOf(array1, array2) {
        return this.isSupersetOf(array1, array2) && !this.isSupersetOf(array2, array1);
    }
    ; // isProperSupersetOf
    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to be checked against
     * @param {T[]} array2 - The 2nd array to be checked against
     * @returns {boolean} If array1's a superset of array2
     */
    static isSupersetOf(array1, array2) {
        return this.isSubsetOf(array2, array1);
    }
    ; // isSupersetOf
    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {[*]} arr - The array to be checked against
     * @param {T[]} array1 - The 1st array to be checked against
     * @param {T[]} array2 - The 2nd array to be checked against
     * @returns {boolean} If array1's a subset of array2
     */
    static isSubsetOf(array1, array2) {
        return this.isEmpty(this.difference(array1, array2));
    }
    ; // isSubsetOf
    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have symmetric difference with
     * @param {T[]} array2 - The 2nd array to have symmetric difference with
     * @returns {T[]} The symmetric difference of array1 and array2
     */
    static symmetricDifference(array1, array2) {
        return this.union(this.difference(array1, array2), this.difference(array2, array1));
    }
    ; // symmetricDifference
    /**
     * This method changes the original array
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have symmetric difference with
     * @param {T[]} array2 - The 2nd array to have symmetric difference with
     * @returns {T[]} The symmetric difference of array1 and array2
     */
    static symmetricDifferenceInPlace(array1, array2) {
        return this.unionInPlace(this.differenceInPlace(array1, array2), this.difference(array2, array1));
    }
    ; // symmetricDifferenceInPlace
    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have union with
     * @param {T[]} array2 - The 2nd array to have union with
     * @returns {T[]} The union of array1 and array2
     */
    static union(array1, array2) {
        return array1.concat(this.difference(array2, array1));
    }
    ; // union
    /**
     * This method changes the original array
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have union with
     * @param {T[]} array2 - The 2nd array to have union with
     * @returns {T[]} The union of array1 and array2
     */
    static unionInPlace(array1, array2) {
        array1.push(...this.difference(array2, array1));
        return array1;
    }
    ; // unionInPlace
    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have difference with
     * @param {T[]} array2 - The 2nd array to have difference with
     * @returns {T[]} The difference of array1 and array2
     */
    static difference(array1, array2) {
        return array1.filter((elem) => this.excludes(array2, elem, 0));
    }
    ; // difference
    /**
     * This method changes the original array
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have difference with
     * @param {T[]} array2 - The 2nd array to have difference with
     * @returns {T[]} The difference of array1 and array2
     */
    static differenceInPlace(array1, array2) {
        for (let i = 0;; i++) {
            while (array1[i] && array2.includes(array1[i]))
                array1.splice(i, 1);
            if (!array1[i])
                return array1;
        }
    }
    ; // differenceInPlace
    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have intersection with
     * @param {T[]} array2 - The 2nd array to have intersection with
     * @returns {T[]} The intersection of array1 and array2
     */
    static intersection(array1, array2) {
        // The 2nd argument of includes doesn't match with that of filter
        return array1.filter((elem) => array2.includes(elem));
        //
    }
    ; // intersection
    /**
     * This method changes the original array
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have intersection with
     * @param {T[]} array2 - The 2nd array to have intersection with
     * @returns {T[]} The intersection of array1 and array2
     */
    static intersectionInPlace(array1, array2) {
        for (let i = 0;; i++) {
            while (array1[i] && this.excludes(array2, array1[i], 0)) {
                array1.splice(i, 1);
            }
            if (!array1[i])
                return array1;
        }
    }
    ; // intersectionInPlace
    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array - The array to be checked against
     * @param {*} elem - The element to be checked against
     * @param {index} fromI - The index in this at which to begin searching
     * @returns {boolean} If array doesn't have elem
     */
    static excludes(array, elem, fromI) {
        return !array.includes(elem, fromI);
    }
    ; // excludes
    /**
     * Potential Hotspot/Idempotent
     * @author DoubleX @interface
     * @param {T[]} array - The array to be cleared
     */
    static clear(array) { array.length = 0; }
    ;
    /** Check if an array is empty.
     *   @static
     *   @param {any[]} array The array to test
     *   @returns {boolean}
     */
    static isEmpty(array) {
        // Edited to fix the bug of nonempty array with 1st element being null
        return array.length === 0;
        //
    }
    /** Get the cos.
     *   @static
     *   @param {number} v The value
     *   @returns {number}
     */
    static cos(v) {
        return parseFloat(Math.cos(v).toFixed(10));
    }
    /** Get the sin.
     *   @static
     *   @param {number} v The value
     *   @returns {number}
     */
    static sin(v) {
        return parseFloat(Math.sin(v).toFixed(10));
    }
    /** Get portion according to a position.
     *   @static
     *   @param {THREE.Vector3} position The position
     *   @returns {number[]}
     */
    static getPortion(position) {
        return this.getPortionArray(this.getPosition(position));
    }
    /** Get portion according to array position.
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
    /** Get an array position according to position.
     *   @static
     *   @param {THREE.Vector3} position The position
     *   @returns {number[]}
     */
    static getPosition(position) {
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
    static mod(x, m) {
        let r = x % m;
        return r < 0 ? r + m : r;
    }
    /** Get the list max ID.
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
    /** Create a random number between min and max.
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
    static clamp(value, min, max) {
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
    /**
     *  Indicate if a point is inside a rectangle.
     *  @static
     *  @param {THREE.Vector2} p The point to test
     *  @param {number} x1 The x left point of the rectangle
     *  @param {number} x2 The x right point of the rectangle
     *  @param {number} y1 The y top point of the rectangle
     *  @param {number} y2 The y bottom point of the rectangle
     *  @returns {boolean}
     */
    static isPointOnRectangle(p, x1, x2, y1, y2) {
        return p.x >= x1 && p.x <= x2 && p.y >= y1 && p.y <= y2;
    }
    /**
     *  Indicate if a point is inside a triangle.
     *  @static
     *  @param {THREE.Vector2} p The point to test
     *  @param {THREE.Vector2} p0 One of the point of the triangle
     *  @param {THREE.Vector2} p1 One of the point of the triangle
     *  @param {THREE.Vector2} p2 One of the point of the triangle
     *  @returns {boolean}
     */
    static isPointOnTriangle(p, p0, p1, p2) {
        let a = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2
            .y) + p1.x * p2.y);
        let sign = a < 0 ? -1 : 1;
        let s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x)
            * p.y) * sign;
        let t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x)
            * p.y) * sign;
        return s > 0 && t > 0 && (s + t) < 2 * a * sign;
    }
    /**
     *  Get the orthogonal projection between two vectors.
     *  @static
     *  @param {THREE.Vector3} u
     *  @param {THREE.Vector3} v
     *  @returns {number}
     */
    static orthogonalProjection(u, v) {
        let lu = u.length();
        let lv = v.length();
        let dot = u.dot(v);
        return (dot / (lu * lv)) * lu;
    }
}
Mathf.OPERATORS_COMPARE = [
    function (a, b) { return a === b; },
    function (a, b) { return a !== b; },
    function (a, b) { return a >= b; },
    function (a, b) { return a <= b; },
    function (a, b) { return a > b; },
    function (a, b) { return a < b; }
];
Mathf.OPERATORS_NUMBERS = [
    function (a, b) { return b; },
    function (a, b) { return a + b; },
    function (a, b) { return a - b; },
    function (a, b) { return a * b; },
    function (a, b) { return a / b; },
    function (a, b) { return a % b; }
];
export { Mathf };
