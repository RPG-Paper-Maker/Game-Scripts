/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
