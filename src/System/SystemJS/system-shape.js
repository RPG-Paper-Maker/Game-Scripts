/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *   A shape of the game
 *   @property {number} id The shape ID
 *   @property {string} name The shape name
 *   @property {boolean} isBR Indicate if the shape is a BR (Basic Ressource)
 *   @property {boolean} dlc Indicate if the shape is a DLC
 *   @param {Object} [json=undefined] Json object describing the shape
 *   @param {CustomShapeKind} [kind=CustomShapeKin] The kind of custom shape
 */
class SystemShape {
    constructor(json, kind = CustomShapeKind.OBJ) {
        this.kind = kind;
        if (json) {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Get the folder associated to a kind of custom shape
     *   @static
     *   @param {CustomShapeKind} kind The kind of custom shape
     *   @param {boolean} isBR Indicate if the shape is a BR
     *   @param {boolean} dlc Indicate if the shape is a DLC
     *   @returns {string}
     */
    static getFolder(kind, isBR, dlc) {
        return (isBR ? RPM.PATH_BR : (dlc ? RPM.PATH_DLCS + RPM.STRING_SLASH +
            dlc : RPM.ROOT_DIRECTORY_LOCAL)) + SystemShape.getLocalFolder(kind);
    }

    // -------------------------------------------------------
    /** Get the local folder associated to a kind of custom shape
     *   @param {CustomShapeKind} kind The kind of custom shape
     *   @returns {string}
     */
    static getLocalFolder(kind) {
        switch (kind) {
            case CustomShapeKind.OBJ:
                return RPM.PATH_OBJ;
            case CustomShapeKind.MTL:
                return RPM.PATH_MTL;
            case CustomShapeKind.Collisions:
                return RPM.PATH_OBJ_COLLISIONS;
        }
        return RPM.STRING_EMPTY;
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the shape
     *   @param {Object} json Json object describing the shape
     */
    read(json) {
        this.id = json.id;
        this.name = json.name;
        this.isBR = json.br;
        this.dlc = RPM.defaultValue(json.d, RPM.STRING_EMPTY);
    }

    // -------------------------------------------------------
    /** Load the .obj
     */
    async loadObjectCustom() {
        this.geometry = this.id === -1 ? RPM.OBJ_LOADER.parse(RPM.STRING_EMPTY)
            : await RPM.OBJ_LOADER.load(this.getPath(CustomShapeKind.OBJ));
    }

    // -------------------------------------------------------
    /** Get the absolute path associated to this picture
     *   @returns {string}
     */
    getPath() {
        return SystemShape.getFolder(this.kind, this.isBR, this.dlc) + RPM
            .STRING_SLASH + this.name;
    }
}