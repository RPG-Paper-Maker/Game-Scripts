/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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
//  CLASS SystemProgressionTable
//
// -------------------------------------------------------

/** @class
*   A progression table
*/
function SystemProgressionTable() {

}

SystemProgressionTable.prototype = {

    /** Read the JSON associated to the picture.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        this.initialValue = json.i;
        this.finalValue = json.f;
        this.equation = json.e;
        this.table = {};
        var jsonTable = json.t;
        var i, l;
        if (jsonTable) {
            for (i = 0, l = jsonTable.length; i < l; i++) {
                this.table[jsonTable[i].k] = jsonTable[i].v;
            }
        }
        this.change = this.finalValue - this.initialValue;
        this.duration = this.finalLevel - 1;
    },

    // -------------------------------------------------------

    getProgressionAtLevel: function(level) {
        // Check if specific value
        var table = this.table[level];
        if (table) {
            return table;
        }

        // Check according to equation
        var x = level + 1;
        switch (this.equation) {
        case 0:
            return easingLinear(x);
        case -1:
            return easingQuadraticIn(x);
        case 1:
            return easingQuadraticOut(x);
        case -2:
            return easingCubicIn(x);
        case 2:
            return easingCubicOut(x);
        case -3:
            return easingQuarticIn(x);
        case 3:
            return easingQuarticOut(x);
        case -4:
            return easingQuinticIn(x);
        case 4:
            return easingQuinticOut(x);
        default:
            return 0;
        }
    },

    // -------------------------------------------------------

    easingLinear: function(x) {
        return Math.floor(this.change * x / this.duration + this.initialValue);
    },

    // -------------------------------------------------------

    easingQuadraticIn: function(x) {
        x /= this.duration;
        return Math.floor(this.change * x * x + this.initialValue);
    },

    // -------------------------------------------------------

    easingQuadraticOut: function(x) {
        x /= this.duration;
        return Math.floor(-this.change * x * (x - 2) + this.initialValue);
    },

    // -------------------------------------------------------

    easingCubicIn: function(x) {
        x /= this.duration;
        return Math.floor(this.change * x * x * x + this.initialValue);
    },

    // -------------------------------------------------------

    easingCubicOut: function(x) {
        x /= this.duration;
        x--;
        return Math.floor(this.change * (x * x * x + 1) + this.initialValue);
    },

    // -------------------------------------------------------

    easingQuarticIn: function(x) {
        x /= this.duration;
        return Math.floor(this.change * x * x * x * x + this.initialValue);
    },

    // -------------------------------------------------------

    easingQuarticOut: function(x) {
        x /= this.duration;
        x--;
        return Math.floor(-this.change * (x * x * x * x - 1) + this.initialValue);
    },

    // -------------------------------------------------------

    easingQuinticIn: function(x) {
        x /= this.duration;
        return Math.floor(this.change * x * x * x * x * x + this.initialValue);
    },

    // -------------------------------------------------------

    easingQuinticOut: function(x) {
        x /= this.duration;
        x--;
        return Math.floor(this.change * (x * x * x * x * x + 1) + this.initialValue);
    },

}
