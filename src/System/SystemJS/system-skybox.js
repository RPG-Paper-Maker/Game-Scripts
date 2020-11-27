/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *   A skybox of the game
 *   @property {number} front The front picture ID
 *   @property {number} back The back picture ID
 *   @property {number} top The top picture ID
 *   @property {number} bot The bot picture ID
 *   @property {number} left The left picture ID
 *   @property {number} right The right picture ID
 *   @param {Object} [json=undefined] Json object describing the skybox
 */
class SystemSkybox {
    constructor(json) {
        if (json) {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the skybox
     *   @param {Object} json Json object describing the skybox
     */
    read(json) {
        this.front = RPM.defaultValue(json.fid, 1);
        this.back = RPM.defaultValue(json.bid, 1);
        this.top = RPM.defaultValue(json.tid, 1);
        this.bot = RPM.defaultValue(json.boid, 1);
        this.left = RPM.defaultValue(json.lid, 1);
        this.right = RPM.defaultValue(json.rid, 1);
    }

    // -------------------------------------------------------
    /** Create the textures for the background
     *   @returns {THREE.MeshBasicMaterial[]}
     */
    createTextures = function () {
        return [
            RPM.createMaterial(RPM.textureLoader.load(RPM.datasGame.pictures.get
            (PictureKind.Skyboxes, this.left).getPath()), {
                flipY: true,
                flipX: true
            }),
            RPM.createMaterial(RPM.textureLoader.load(RPM.datasGame.pictures.get
            (PictureKind.Skyboxes, this.right).getPath()), {
                flipY: true,
                flipX: true
            }),
            RPM.createMaterial(RPM.textureLoader.load(RPM.datasGame.pictures.get
            (PictureKind.Skyboxes, this.top).getPath()), {
                flipY: true,
                flipX: true
            }),
            RPM.createMaterial(RPM.textureLoader.load(RPM.datasGame.pictures.get
            (PictureKind.Skyboxes, this.bot).getPath()), {
                flipY: true,
                flipX: true
            }),
            RPM.createMaterial(RPM.textureLoader.load(RPM.datasGame.pictures.get
            (PictureKind.Skyboxes, this.front).getPath()), {
                flipY: true,
                flipX: true
            }),
            RPM.createMaterial(RPM.textureLoader.load(RPM.datasGame.pictures.get
            (PictureKind.Skyboxes, this.back).getPath()), {
                flipY: true,
                flipX: true
            })
        ];
    }
}