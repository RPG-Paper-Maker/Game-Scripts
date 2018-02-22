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
//  CLASS CollisionSquare
//
// -------------------------------------------------------

/** @class
*   A collision settings in a texture square.
*   @property {number[]} rect Percentage of the rect limitation.
*   @property {boolean} left
*   @property {boolean} right
*   @property {boolean} top
*   @property {boolean} bot
*/
function CollisionSquare(){
    this.rect = [0, 0, $SQUARE_SIZE, $SQUARE_SIZE];
    this.left = true;
    this.right = true;
    this.top = true;
    this.bot = true;
}

CollisionSquare.prototype = {

    /** Read the JSON associated to the collision square.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        var rect = json.rec;
        var left = json.l;
        var right = json.r;
        var top = json.t;
        var bot = json.b;

        if (typeof rect !== 'undefined') {
            if (rect === null)
                this.rect = null;
            else {
                this.rect = [
                    Math.floor(rect[0] * $SQUARE_SIZE / 100),
                    Math.floor(rect[1] * $SQUARE_SIZE / 100),
                    Math.floor(rect[2] * $SQUARE_SIZE / 100),
                    Math.floor(rect[3] * $SQUARE_SIZE / 100)
                ];
            }
        }
        if (typeof left !== 'undefined')
            this.left = left;
        if (typeof right !== 'undefined')
            this.right = right;
        if (typeof top !== 'undefined')
            this.top = top;
        if (typeof bot !== 'undefined')
            this.bot = bot;
    },

    hasAllDirections: function(){
        return this.left && this.right && this.top && this.bot;
    }
}
