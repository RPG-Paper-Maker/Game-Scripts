/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

// -------------------------------------------------------
//
//  CLASS TextureAutotile
//
// -------------------------------------------------------

/** @class
*   A texture autotile in a single file.
*   @property {THREE.Material} texture The generated texture.
*   @property {number} beginID The begining texture ID.
*   @property {number[]} beginPoint The begining texture point offset.
*   @property {number} endID The ending texture ID.
*   @property {number[]} endPoint The ending texture point offset.
*   @property {number[][]} list List of each offset point.
*/
function TextureAutotile(){
    this.list = new Array;
}

TextureAutotile.prototype = {

    /** Set the begining texture.
    *   @param {number} id The begining texture ID.
    *   @param {number[]} point The begining texture point offset.
    */
    setBegin: function(id, point){
        this.beginID = id;
        this.beginPoint = point;
    },

    // -------------------------------------------------------

    /** Set the ending texture.
    *   @param {number} id The ending texture ID.
    *   @param {number[]} point The ending texture point offset.
    */
    setBegin: function(id, point){
        this.endID = id;
        this.endPoint = point;
    },

    // -------------------------------------------------------

    /** Check which point is on top.
    *   @param {number[]} rect
    *   @param {number[]} point
    */
    isSup: function(rect, point){
        if (rect[1] > point[1])
            return true;
        else if (rect[1] === point[1])
            return rect[0] >= point[0];

        return false;
    },

    // -------------------------------------------------------

    /** Check which point is on bot.
    *   @param {number[]} rect
    *   @param {number[]} point
    */
    isInf: function(rect, point){
        if (rect[1] < point[1])
            return true;
        else if (rect[1] === point[1])
            return rect[0] <= point[0];

        return false;
    },

    // -------------------------------------------------------

    /** Check if a couple (id, rect) is inside this texture.
    *   @param {number} id
    *   @param {number[]} rect
    */
    isInTexture: function(id, rect){
        if (id >= this.beginID && id <= this.endID) {
            if (id == this.beginID) {
                if (id == this.endID) {
                    return this.isSup(rect, this.beginPoint) &&
                           this.isInf(rect, this.endPoint);
                }
                else
                    return this.isSup(rect, this.beginPoint);
            }
            else if (id < this.endID)
                return true;
            else
                return this.isInf(rect, this.endPoint);
        }
        return false;
    },

    // -------------------------------------------------------

    /** Add a couple (id, point) inside the list.
    *   @param {number} id
    *   @param {number[]} point
    */
    addToList: function(id, point){
        this.list.push([id, point]);
    },

    // -------------------------------------------------------

    /** Get the offset of couple (id, rect).
    *   @param {number} id
    *   @param {number[]} rect
    */
    getOffset: function(id, rect){
        var pair, point;

        for (var i = 0, l = this.list.length; i < l; i++) {
            pair = this.list[i];
            point = pair[1];
            if (id === pair[0] && point[0] === rect[0] && point[1] === rect[1])
                return i;
        }

        return -1;
    }
}
