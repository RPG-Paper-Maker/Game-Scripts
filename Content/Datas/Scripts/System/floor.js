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
//  CLASS Floor
//
// -------------------------------------------------------

/** @class
*   @extends Land
*   A floor in the map.
*/
function Floor() {
    Land.call(this);
}

Floor.prototype = {

    /** Read the JSON associated to the floor.
    *   @param {Object} json Json object describing the object.
    */
    read: function(json) {
        Land.prototype.read.call(this, json);
    },

    /** Update the geometry associated to this floor.
    *   @returns {THREE.Geometry}
    */
    updateGeometry: function(geometry, position, width, height, i) {
        var x = (this.texture[0] * $SQUARE_SIZE) / width;
        var y = (this.texture[1] * $SQUARE_SIZE) / height;
        var w = (this.texture[2] * $SQUARE_SIZE) / width;
        var h = (this.texture[3] * $SQUARE_SIZE) / height;

        return Land.prototype.updateGeometry.call(this, geometry,
            $currentMap.mapInfos.tileset.picture.getCollisionAt(this.texture),
            position, width, height, x, y, w, h, i);
    }
}
