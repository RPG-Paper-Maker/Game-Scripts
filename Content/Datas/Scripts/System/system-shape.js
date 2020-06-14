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
//  CLASS SystemShape
//
// -------------------------------------------------------

/** @class
*   A shape of the game.
*   @property {boolean} isBR Indicate if the shape is a BR (Basic Ressource).
*/
function SystemShape() {

}

/** Get the folder associated to a kind of custom shape.
*   @param {CustomShapeKind} kind The kind of custom shape.
*   @param {boolean} isBR Indicate if the shape is a BR.
*   @returns {string}
*/
SystemShape.getFolder = function(kind, isBR) {
    var folder = isBR ? RPM.PATH_BR : RPM.ROOT_DIRECTORY_LOCAL;
    var folderLocal = isBR ? RPM.PATH_BR : RPM.ROOT_DIRECTORY_LOCAL;
    var dir = SystemShape.getLocalFolder(kind);
    var path = folder + dir;
    var pathLocal = folderLocal + dir;

    return [path, pathLocal];
};

// -------------------------------------------------------

/** Get the local folder associated to a kind of custom shape.
*   @param {CustomShapeKind} kind The kind of custom shape.
*   @returns {string}
*/
SystemShape.getLocalFolder = function(kind) {
    switch(kind) {
    case CustomShapeKind.OBJ:
        return RPM.PATH_OBJ;
    case CustomShapeKind.MTL:
        return RPM.PATH_MTL;
    case CustomShapeKind.Collisions:
        return RPM.PATH_OBJ_COLLISIONS;
    }

    return "";
};

// -------------------------------------------------------

SystemShape.prototype = {

    /** Read the JSON associated to the shape.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        this.id = json.id;
        this.name = json.name;
        this.isBR = json.br;
    },

    // -------------------------------------------------------

    loadObjectCustom: function() {
        if (this.id === -1)
        {
            this.geometry = RPM.OBJ_LOADER.parse("");
        } else 
        {
            var that;

            that = this;
            RPM.filesToLoad++;
            RPM.LOL++;
            console.log(RPM.LOL)
            RPM.OBJ_LOADER.load(this.getPath(CustomShapeKind.OBJ)[0], function(
                geometry)
            {
                that.geometry = geometry;
                RPM.loadedFiles++;
                RPM.LOL++;
            console.log(RPM.LOL)
            });
        }
    },

    // -------------------------------------------------------

    /** Get the absolute path associated to this picture.
    *   @param {PictureKind} kind The kind of picture.
    *   @returns {string}
    */
    getPath: function(kind) {
        var paths = SystemShape.getFolder(kind, this.isBR);
        paths[0] += "/" + this.name;
        paths[1] += "/" + this.name;

        return paths;
    }
}
