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
//  CLASS Autotiles
//
// -------------------------------------------------------

/** @class
*   Autotiles with the same textures.
*/
function Autotiles(texture) {
    this.texture = texture;
    this.width = texture.texture.map.image.width;
    this.height = texture.texture.map.image.height;
    this.geometry = new THREE.Geometry();
    this.geometry.faceVertexUvs[0] = [];
    this.index = 0;
    this.mesh = null;
}

Autotiles.COUNT_LIST = 5;
Autotiles.listA = ["A1", "A2", "A3", "A4", "A5"];
Autotiles.listB = ["B1", "B2", "B3", "B4", "B5"];
Autotiles.listC = ["C1", "C2", "C3", "C4", "C5"];
Autotiles.listD = ["D1", "D2", "D3", "D4", "D5"];

Autotiles.autotileBorder = {
    "A1": 2,
    "B1": 3,
    "C1": 6,
    "D1": 7,
    "A2": 8,
    "B4": 9,
    "A4": 10,
    "B2": 11,
    "C5": 12,
    "D3": 13,
    "C3": 14,
    "D5": 15,
    "A5": 16,
    "B3": 17,
    "A3": 18,
    "B5": 19,
    "C2": 20,
    "D4": 21,
    "C4": 22,
    "D2": 23,
};

Autotiles.prototype = {

    /** Update the geometry of the autotiles according to an autotile.
    */
    updateGeometry : function(position, autotile) {
        return autotile.updateGeometry(this.geometry, this.texture, position,
            this.width, this.height, this.index++);
    },

    /** Create a mesh with material and geometry.
    */
    createMesh : function() {
        this.mesh = new THREE.Mesh(this.geometry, this.texture.texture);
    }
}
