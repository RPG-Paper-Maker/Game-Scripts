/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   @extends Land
*   An autotile in the map
*   @property {number} autotileID The autotile ID
*   @property {number} tileID The tile ID kind to draw according to other 
*   autotiles outside
*   @param {Object} [json=undefined] Json object describing the autotile
*/
class Autotile extends Land
{
    constructor(json)
    {
        super();
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the autotile
    *   @param {Object} json Json object describing the autotile
    */
    read(json)
    {
        super.read(json);

        this.autotileID = json.id;
        this.tileID = json.tid;
    }

    // -------------------------------------------------------
    /** Update the geometry associated to this autotile and return the 
    *   collision result
    *   @param {THREE.Geometry} geometry The geometry asoociated to the 
    *   autotiles
    *   @param {TextureSeveral} texure The several texture used for this 
    *   geometry
    *   @param {number[]} position The json position
    *   @param {number} width The texture total width
    *   @param {number} height The texture total height
    *   @param {number} count The faces count
    *   @returns {Object}
    */
    updateGeometry(geometry, texture, position, width, height, count)
    {
        let autotile = RPM.datasGame.specialElements.autotiles[this.autotileID];
        let picture = autotile ? RPM.datasGame.pictures.list[PictureKind
            .Autotiles][autotile.pictureID] : null;
        return super.updateGeometry(geometry, picture ? picture
            .getCollisionAtIndex(Land.prototype.getIndex.call(this, picture
            .width)) : null, position, width, height, ((this.tileID % 64) * RPM
            .SQUARE_SIZE) / width, ((Math.floor(this.tileID / 64) + (10 * 
            texture.getOffset(this.autotileID, this.texture))) * RPM.SQUARE_SIZE
            ) / height, RPM.SQUARE_SIZE / width, RPM.SQUARE_SIZE / height, count);
    }
}