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
//  CLASS MapInfos
//
// -------------------------------------------------------

/** @class
*   The properties of a map.
*/
function MapInfos() {
    this.sceneBackground = null;
    this.skyboxGeometry = null;
}

MapInfos.prototype = {

    /** Read the JSON associated to the map infos.
    *   @param {Object} json Json object describing the object.
    */
    read: function(json, map, callback) {
        this.id = json.id;
        this.name = json.name;
        this.length = json.l;
        this.width = json.w;
        this.height = json.h;
        this.depth = json.d;

        // Tileset: if not existing, by default select the first one
        this.tileset = RPM.datasGame.tilesets.list[json.tileset];
        if (!this.tileset) {
            this.tileset = RPM.datasGame.tilesets.list[1];
        }

        this.music = new SystemPlaySong(SongKind.Music);
        this.music.readJSON(json.music);
        this.backgroundSound = new SystemPlaySong(SongKind.BackgroundSound);
        this.backgroundSound.readJSON(json.bgs);
        this.cameraProperties = RPM.datasGame.system.cameraProperties[SystemValue
            .readOrDefaultDatabase(json.cp, 1).getValue()];
        this.isBackgroundColor = json.isky;
        this.isBackgroundImage = json.isi;
        if (this.isBackgroundColor)
        {
            this.backgroundColorID = new SystemValue();
            this.backgroundColorID.read(json.sky);
        } else if (this.isBackgroundImage)
        {
            this.backgroundImageID = json.ipid;
            this.updateBackgroundImage();
        } else  
        {
            this.backgroundSkyboxID = SystemValue.readOrDefaultDatabase(json
                .sbid);
            this.updateBackgroundSkybox();
        }
        this.updateBackgroundColor();
        var startupReactions = new SystemObject();
        startupReactions.readJSON(json.so);
        this.startupObject = new MapObject(startupReactions);
        this.startupObject.changeState();
    },

    updateBackgroundColor: function() 
    {
        this.backgroundColor = RPM.datasGame.system.colors[this
            .isBackgroundColor ? this.backgroundColorID.getValue() : 1];
    },

    updateBackgroundImage: function() 
    {
        let bgMat = RPM.createMaterial(RPM.textureLoader.load(RPM.datasGame
            .pictures.get(PictureKind.Pictures, this.backgroundImageID).getPath(
            PictureKind.Pictures)[0]), { flipY: true });
        bgMat.depthTest = false;
        bgMat.depthWrite = false;
        this.sceneBackground = new Physijs.Scene();
        this.cameraBackground = new THREE.Camera();
        this.sceneBackground.add(new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 
            2), bgMat));
    },

    updateBackgroundSkybox: function() 
    {
        let size = 10000 * RPM.SQUARE_SIZE / RPM.BASIC_SQUARE_SIZE;
        this.skyboxGeometry = new THREE.BoxGeometry(size, size, size);
        let bgMesh = new THREE.Mesh(this.skyboxGeometry, RPM.datasGame.system
            .skyboxes[this.backgroundSkyboxID.getValue()].createTextures());
        RPM.currentMap.scene.add(bgMesh);
    }
}
