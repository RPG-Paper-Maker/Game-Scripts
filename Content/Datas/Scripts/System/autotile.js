/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
        var autotile = $datasGame.specialElements.autotiles[this.autotileID];
        var picture = autotile ? $datasGame.pictures.list[PictureKind.Autotiles]
            [autotile.pictureID] : null;
        var collison = picture ? picture.getCollisionAtIndex(Land.prototype
            .getIndex.call(this, picture.width)) : null;

        return Land.prototype.updateGeometry.call(this, geometry, collison,
            position, width, height, x, y, w, h, i);
    }
}

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
    this.width = texture.texture.map ? texture.texture.map.image.width : 0;
    this.height = texture.texture.map ? texture.texture.map.image.height : 0;
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
        return this.width === null || this.height === 0 ? null : autotile
            .updateGeometry(this.geometry, this.texture, position, this.width,
            this.height, this.index++);
    },

    /** Create a mesh with material and geometry.
    */
    createMesh : function() {
        this.mesh = new THREE.Mesh(this.geometry, this.texture.texture);
    }
}
