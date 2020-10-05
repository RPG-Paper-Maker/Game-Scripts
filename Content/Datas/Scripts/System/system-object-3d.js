/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A 3D object of the game
*   @extends SystemSpecialElement
*   @property {number} id The object 3D id
*   @property {ShapeKind} shapeKind The shape kind of the 3D object
*   @param {Object} [json=undefined] Json object describing the object 3D
*/
class SystemObject3D extends SystemSpecialElement
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
    /** Read the JSON associated to the object 3D
    *   @param {Object} json Json object describing the object 3D
    */
    read(json)
    {
        super.read(json);

        this.id = json.id;
        this.shapeKind = RPM.defaultValue(json.sk, ShapeKind.Box);
        this.objID = RPM.defaultValue(json.oid, -1);
        this.mtlID = RPM.defaultValue(json.mid, -1);
        this.collisionKind = RPM.defaultValue(json.ck, ObjectCollisionKind.None);
        this.collisionCustomID = RPM.defaultValue(json.ccid, -1);
        this.scale = RPM.defaultValue(json.s, 1);
        this.widthSquare = RPM.defaultValue(json.ws, 1);
        this.widthPixel = RPM.defaultValue(json.wp, 0);
        this.heightSquare = RPM.defaultValue(json.hs, 1);
        this.heightPixel = RPM.defaultValue(json.hp, 0);
        this.depthSquare = RPM.defaultValue(json.ds, 1);
        this.depthPixel = RPM.defaultValue(json.dp, 0);
        this.stretch = RPM.defaultValue(json.st, false);
    }

    // -------------------------------------------------------
    /** Get the width in pixels
    *   @returns {number}
    */
    widthPixels()
    {
        return (this.widthSquare * RPM.SQUARE_SIZE) + (this.widthPixel *
            RPM.SQUARE_SIZE / 100);
    }

    // -------------------------------------------------------
    /** Get the height in pixels
    *   @returns {number}
    */
    heightPixels()
    {
        return (this.heightSquare * RPM.SQUARE_SIZE) + (this.heightPixel *
            RPM.SQUARE_SIZE / 100);
    }

    // -------------------------------------------------------
    /** Get the depth in pixels
    *   @returns {number}
    */
    depthPixels()
    {
        return (this.depthSquare * RPM.SQUARE_SIZE) + (this.depthPixel *
            RPM.SQUARE_SIZE / 100);
    }

    // -------------------------------------------------------
    /** Get the width in squares
    *   @returns {number}
    */
    width()
    {
        return this.widthSquare + (this.widthPixel > 0 ? 1 : 0);
    }

    // -------------------------------------------------------
    /** Get the height in squares
    *   @returns {number}
    */
    height()
    {
        return this.heightSquare + (this.heightPixel > 0 ? 1 : 0);
    }

    // -------------------------------------------------------
    /** Get the depth in squares
    *   @returns {number}
    */
    depth()
    {
        return this.depthSquare + (this.depthPixel > 0 ? 1 : 0);
    }

    // -------------------------------------------------------
    /** Get the width in squares
    *   @returns {THREE.Vector3}
    */
    getSizeVector()
    {
        return new THREE.Vector3(this.widthPixels(), this.heightPixels(), this
            .depthPixels());
    }

    // -------------------------------------------------------
    /** Get the shape obj
    *   @returns {SystemShape}
    */
    getObj()
    {
        return RPM.datasGame.shapes.get(CustomShapeKind.OBJ, this.objID);
    }
}