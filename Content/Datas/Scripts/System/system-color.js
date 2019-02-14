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
//  CLASS SystemColor
//
// -------------------------------------------------------

/** @class
*   An color of the game.
*/
function SystemColor() {

}

SystemColor.createColor = function(r, g, b, a) {
    var color = new SystemColor();
    color.initialize(r, g, b, a);
    return color;
}

SystemColor.prototype = {

    initialize: function(r, g, b, a) {
        // Default values
        if (typeof a === 'undefined') a = 255;

        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = a / 255;

        this.rgb = "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")";
        this.color = new THREE.Color(this.rgb);
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the element.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        this.initialize(json.r, json.g, json.b, json.a);
    },

    // -------------------------------------------------------

    getHex: function() {
        return this.color.getHex();
    }
}
