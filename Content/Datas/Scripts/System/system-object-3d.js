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
//  CLASS SystemObject3D
//
// -------------------------------------------------------

/** @class
*   A 3D object of the game.
*   @property {number} picutreID The picture ID of the object 3D.
*/
function SystemObject3D(){

}

SystemObject3D.prototype = {

    /** Read the JSON associated to the object 3D.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        SystemSpecialElement.prototype.readJSON.call(this, json);

        this.id = json.id;
        this.shapeKind = typeof json.sk === 'undefined' ? ShapeKind.Box : json
            .sk;
        this.objID = typeof json.oid === 'undefined' ? -1 : json.oid;
        this.mtlID = typeof json.mid === 'undefined' ? -1 : json.mid;
        this.collisionKind = typeof json.ck === 'undefined' ?
            ObjectCollisionKind.None : json.ck;
        this.collisionCustomID = typeof json.ccid === 'undefined' ? -1 : json
            .ccid;
        this.scale = typeof json.s === 'undefined' ? 1 : json.s;
        this.widthSquare = typeof json.ws === 'undefined' ? 1 : json.ws;
        this.widthPixel = typeof json.wp === 'undefined' ? 0 : json.wp;
        this.heightSquare = typeof json.hs === 'undefined' ? 1 : json.hs;
        this.heightPixel = typeof json.hp === 'undefined' ? 0 : json.hp;
        this.depthSquare = typeof json.ds === 'undefined' ? 1 : json.ds;
        this.depthPixel = typeof json.dp === 'undefined' ? 0 : json.dp;
        this.stretch = typeof json.st === 'undefined' ? false : json.st;
    },

    // -------------------------------------------------------

    widthPixels: function() {
        return (this.widthSquare * RPM.SQUARE_SIZE) + (this.widthPixel *
            RPM.SQUARE_SIZE / 100);
    },

    // -------------------------------------------------------

    heightPixels: function() {
        return (this.heightSquare * RPM.SQUARE_SIZE) + (this.heightPixel *
            RPM.SQUARE_SIZE / 100);
    },

    // -------------------------------------------------------

    depthPixels: function() {
        return (this.depthSquare * RPM.SQUARE_SIZE) + (this.depthPixel *
            RPM.SQUARE_SIZE / 100);
    },

    // -------------------------------------------------------

    width: function() {
        return this.widthSquare + (this.widthPixel > 0 ? 1 : 0);
    },

    // -------------------------------------------------------

    height: function() {
        return this.heightSquare + (this.heightPixel > 0 ? 1 : 0);
    },

    // -------------------------------------------------------

    depth: function() {
        return this.depthSquare + (this.depthPixel > 0 ? 1 : 0);
    },

    // -------------------------------------------------------

    getSizeVector: function() {
        return new THREE.Vector3(this.widthPixels(), this.heightPixels(), this
            .depthPixels());
    },

    // -------------------------------------------------------

    getObj: function() {
        return RPM.datasGame.shapes.get(CustomShapeKind.OBJ, this.objID);
    }
}
