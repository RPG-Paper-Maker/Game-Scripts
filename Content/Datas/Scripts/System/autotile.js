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
//  CLASS Autotile
//
// -------------------------------------------------------

/** @class
*   @extends Land
*   An autotile in the map.
*/
function Autotile() {
    Land.call(this);
}

Autotile.prototype = {

    /** Read the JSON associated to the autotile.
    *   @param {Object} json Json object describing the object.
    */
    read: function(json) {
        Land.prototype.read.call(this, json);

        this.autotileID = json.id;
        this.tileID = json.tid;
    },

    /** Update the geometry associated to this land.
    *   @returns {THREE.Geometry}
    */
    updateGeometry: function(geometry, texture, position, width, height, i) {
        var xTile = this.tileID % 64;
        var yTile = Math.floor(this.tileID / 64) +
                (10 * texture.getOffset(this.autotileID, this.texture));

        var x = (xTile * $SQUARE_SIZE) / width;
        var y = (yTile * $SQUARE_SIZE) / height;
        var w = $SQUARE_SIZE / width;
        var h = $SQUARE_SIZE / height;

        return Land.prototype.updateGeometry.call(
                    this, geometry, position, width, height, x, y, w, h, i);
    }
}
