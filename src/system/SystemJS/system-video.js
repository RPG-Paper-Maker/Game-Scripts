/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *   A video of the game
 *   @property {string} name The video name
 *   @property {boolean} isBR Indicate if the video is a BR (Basic Ressource)
 *   @property {boolean} dlc Indicate if the video is a DLC
 *   @param {Object} [json=undefined] Json object describing the video
 */
class SystemVideo {
    constructor(json) {
        if (json) {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Get the folder associated to videos
     *   @static
     *   @param {boolean} isBR Indicate if the video is a BR
     *   @param {boolean} dlc Indicate if the video is a DLC
     *   @returns {string}
     */
    static getFolder(isBR, dlc) {
        return (isBR ? RPM.PATH_BR : (dlc ? RPM.PATH_DLCS + RPM.STRING_SLASH +
            dlc : RPM.ROOT_DIRECTORY_LOCAL)) + SystemVideo.getLocalFolder();
    }

    // -------------------------------------------------------
    /** Get the local folder associated to videos
     *   @static
     *   @returns {string}
     */
    static getLocalFolder() {
        return RPM.PATH_VIDEOS;
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the video
     *   @param {Object} json Json object describing the video
     */
    read(json) {
        this.name = json.name;
        this.isBR = json.br;
        this.dlc = RPM.defaultValue(json.d, RPM.STRING_EMPTY);
    }

    // -------------------------------------------------------
    /** Get the absolute path associated to this video
     *   @returns {string}
     */
    getPath() {
        return SystemVideo.getFolder(this.isBR, this.dlc) + RPM.STRING_SLASH +
            this.name;
    }
}