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
*   @param {Object} [json=undefined] Json object describing the skybox
*/
class SystemSkybox
{
    constructor(json)
    {
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the skybox
    *   @param {Object} json Json object describing the skybox
    */
    read(json)
    {
        this.front = RPM.jsonDefault(json.fid, 1);
        this.back = RPM.jsonDefault(json.bid, 1);
        this.top = RPM.jsonDefault(json.tid, 1);
        this.bot = RPM.jsonDefault(json.boid, 1);
        this.left = RPM.jsonDefault(json.lid, 1);
        this.right = RPM.jsonDefault(json.rid, 1);
    }
    
    // -------------------------------------------------------
    /** Create the textures for the background
    *   @returns {THREE.Material[]} 
    */
    createTextures = function() 
    {
        return [
            RPM.createMaterial(RPM.textureLoader.load(RPM.datasGame.pictures.get
                (PictureKind.Skyboxes, this.left).getPath(PictureKind.Skyboxes)
                [0]), { flipY: true, flipX: true }),
            RPM.createMaterial(RPM.textureLoader.load(RPM.datasGame.pictures.get
                (PictureKind.Skyboxes, this.right).getPath(PictureKind.Skyboxes)
                [0]), { flipY: true, flipX: true }),
            RPM.createMaterial(RPM.textureLoader.load(RPM.datasGame.pictures.get
                (PictureKind.Skyboxes, this.top).getPath(PictureKind.Skyboxes)
                [0]), { flipY: true, flipX: true }),
            RPM.createMaterial(RPM.textureLoader.load(RPM.datasGame.pictures.get
                (PictureKind.Skyboxes, this.bot).getPath(PictureKind.Skyboxes)
                [0]), { flipY: true, flipX: true }),
            RPM.createMaterial(RPM.textureLoader.load(RPM.datasGame.pictures.get
                (PictureKind.Skyboxes, this.front).getPath(PictureKind.Skyboxes)
                [0]), { flipY: true, flipX: true }),
            RPM.createMaterial(RPM.textureLoader.load(RPM.datasGame.pictures.get
                (PictureKind.Skyboxes, this.back).getPath(PictureKind.Skyboxes)
                [0]), { flipY: true, flipX: true })
        ];
    }
}