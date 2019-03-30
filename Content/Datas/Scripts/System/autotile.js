/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

        return Land.prototype.updateGeometry.call(this, geometry,
            $datasGame.pictures.list[PictureKind.Autotiles][this.autotileID]
            .getCollisionAtIndex(Land.prototype.getIndex.call(this, width /
            $SQUARE_SIZE / 2)), position, width, height, x, y, w, h, i);
    }
}
