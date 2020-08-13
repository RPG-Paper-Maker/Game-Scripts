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
//  CLASS SystemSybox
//
// -------------------------------------------------------

/** @class
*   A skybox of the game.
*/
function SystemSkybox()
{

}

SystemSkybox.prototype = Object.create(SystemCommonSkillItem.prototype);

// -------------------------------------------------------

SystemSkybox.prototype.readJSON = function(json) {
    this.front = RPM.jsonDefault(json.fid, 1);
    this.back = RPM.jsonDefault(json.bid, 1);
    this.top = RPM.jsonDefault(json.tid, 1);
    this.bot = RPM.jsonDefault(json.boid, 1);
    this.left = RPM.jsonDefault(json.lid, 1);
    this.right = RPM.jsonDefault(json.rid, 1);
}

// -------------------------------------------------------

SystemSkybox.prototype.createTextures = function() 
{
    return [
        RPM.createMaterial(RPM.textureLoader.load(RPM.datasGame.pictures.get(
            PictureKind.Skyboxes, this.left).getPath(PictureKind.Skyboxes)[0]), 
            { flipY: true, flipX: true }),
        RPM.createMaterial(RPM.textureLoader.load(RPM.datasGame.pictures.get(
            PictureKind.Skyboxes, this.right).getPath(PictureKind.Skyboxes)[0]), 
            { flipY: true, flipX: true }),
        RPM.createMaterial(RPM.textureLoader.load(RPM.datasGame.pictures.get(
            PictureKind.Skyboxes, this.top).getPath(PictureKind.Skyboxes)[0]), 
            { flipY: true, flipX: true }),
        RPM.createMaterial(RPM.textureLoader.load(RPM.datasGame.pictures.get(
            PictureKind.Skyboxes, this.bot).getPath(PictureKind.Skyboxes)[0]), 
            { flipY: true, flipX: true }),
        RPM.createMaterial(RPM.textureLoader.load(RPM.datasGame.pictures.get(
            PictureKind.Skyboxes, this.front).getPath(PictureKind.Skyboxes)[0]), 
            { flipY: true, flipX: true }),
        RPM.createMaterial(RPM.textureLoader.load(RPM.datasGame.pictures.get(
            PictureKind.Skyboxes, this.back).getPath(PictureKind.Skyboxes)[0]), 
            { flipY: true, flipX: true })
    ];
}
