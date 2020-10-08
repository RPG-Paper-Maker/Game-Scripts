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

    /** Read the JSON associated to the autotile.
    *   @param {Object} json Json object describing the object.
    */
    read(json)
    {
        super.read(json);

        this.autotileID = json.id;
        this.tileID = json.tid;
    }

    /** Update the geometry associated to this land.
    *   @returns {THREE.Geometry}
    */
    updateGeometry(geometry, texture, position, width, height, i)
    {
        let autotile = RPM.datasGame.specialElements.autotiles[this.autotileID];
        let picture = autotile ? RPM.datasGame.pictures.list[PictureKind
            .Autotiles][autotile.pictureID] : null;
        return super.updateGeometry(geometry, picture ? picture
            .getCollisionAtIndex(Land.prototype.getIndex.call(this, picture
            .width)) : null, position, width, height, ((this.tileID % 64) * RPM
            .SQUARE_SIZE) / width, ((Math.floor(this.tileID / 64) + (10 * 
            texture.getOffset(this.autotileID, this.texture))) * RPM.SQUARE_SIZE
            ) / height, RPM.SQUARE_SIZE / width, RPM.SQUARE_SIZE / height, i);
    }
}

/** @class
*   Autotiles with the same textures
*/
class Autotiles
{
    static COUNT_LIST = 5;
    static listA = ["A1", "A2", "A3", "A4", "A5"];
    static listB = ["B1", "B2", "B3", "B4", "B5"];
    static listC = ["C1", "C2", "C3", "C4", "C5"];
    static listD = ["D1", "D2", "D3", "D4", "D5"];
    static autotileBorder = {
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

    constructor(texture)
    {
        this.texture = texture;
        this.width = texture.texture.map ? texture.texture.map.image.width : 0;
        this.height = texture.texture.map ? texture.texture.map.image.height : 0;
        this.geometry = new THREE.Geometry();
        this.geometry.faceVertexUvs[0] = [];
        this.index = 0;
        this.mesh = null;
    }

    /** Update the geometry of the autotiles according to an autotile.
    */
    updateGeometry(position, autotile)
    {
        return this.width === null || this.height === 0 ? null : autotile
            .updateGeometry(this.geometry, this.texture, position, this.width,
            this.height, this.index++);
    }

    /** Create a mesh with material and geometry.
    */
    createMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.texture.texture);
    }
}