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
//  CLASS SystemVideo
//
// -------------------------------------------------------

/** @class
*   A video of the game.
*   @property {boolean} isBR Indicate if the video is a BR (Basic Ressource).
*/
function SystemVideo() {

}

/** Get the folder associated to videos.
*   @param {boolean} isBR Indicate if the video is a BR.
*   @returns {string}
*/
SystemVideo.getFolder = function(isBR) {
    var folder = isBR ? RPM.PATH_BR : RPM.ROOT_DIRECTORY_LOCAL;
    var folderLocal = isBR ? RPM.PATH_BR : RPM.ROOT_DIRECTORY_LOCAL;
    var dir = SystemVideo.getLocalFolder();
    var path = folder + dir;
    var pathLocal = folderLocal + dir;

    return [path, pathLocal];
};

// -------------------------------------------------------

/** Get the local folder associated to videos.
*   @returns {string}
*/
SystemVideo.getLocalFolder = function() {
    return RPM.PATH_VIDEOS;
};

// -------------------------------------------------------

SystemVideo.prototype = {

    /** Read the JSON associated to the video.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        this.name = json.name;
        this.isBR = json.br;
    },

    // -------------------------------------------------------

    /** Get the absolute path associated to this video.
    *   @returns {string}
    */
    getPath: function() {
        var paths = SystemVideo.getFolder(this.isBR);
        paths[0] += "/" + this.name;
        paths[1] += "/" + this.name;

        return paths;
    }
}
