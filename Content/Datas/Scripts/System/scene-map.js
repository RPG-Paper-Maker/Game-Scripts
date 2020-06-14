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
//  CLASS SceneMap : SceneGame
//
// -------------------------------------------------------

/** @class
*   A scene for a local map.
*   @extends SceneGame
*   @property {number} id The ID of the map.
*   @property {string} mapName The map name.
*   @property {THREE.Scene} scene The 3D scene of the map.
*   @property {Camera} camera he camera of the scene.
*   @property {Object} mapInfos General map informations (real name, name,
*   width, height).
*   @property {number[][]} allObjects All the objects portions according to ID.
*   @property {MapPortion[][][]} mapPortions All the portions in the visible ray
*   of the map.
*   @param {number} id The ID of the map.
*/
function SceneMap(id, isBattleMap){
    SceneGame.call(this);

    RPM.currentMap = this;
    this.id = id;
    this.isBattleMap = isBattleMap;

    if (!isBattleMap) {
        RPM.game.currentMapId = id;
    }

    this.mapName = RPM.generateMapName(id);
    this.scene = new THREE.Scene();
    this.readMapInfos();
    this.currentPortion = RPM.getPortion(this.getHeroPosition());
    this.collisions = new Array;

    // Adding meshes for collision
    if (RPM.datasGame.system.showBB) {
        this.scene.add(RPM.BB_BOX);
        this.scene.add(RPM.BB_ORIENTED_BOX);
    }

    this.callBackAfterLoading = this.loadTextures;
}

/** Get the portion file name.
*   @static
*   @param {number} x The global x portion.
*   @param {number} y The global y portion.
*   @param {number} z The global z portion.
*   @returns {string}
*/
SceneMap.getPortionName = function(x, y, z){
    return (x + "_" + y + "_" + z + ".json");
}

// -------------------------------------------------------

SceneMap.getGlobalPortion = function(position) {
    return [
        Math.floor(position[0] / RPM.PORTION_SIZE),
        Math.floor(position[1] / RPM.PORTION_SIZE),
        Math.floor(position[3] / RPM.PORTION_SIZE)
    ];
}

SceneMap.prototype = Object.create(SceneGame.prototype);

// -------------------------------------------------------
/** Get the hero position according to battle map
*/
SceneMap.prototype.getHeroPosition = function() {
    return this.isBattleMap ? RPM.game.heroBattle.position : RPM.game.hero.position;
}

// -------------------------------------------------------

SceneMap.prototype.updateBackgroundColor = function() {
    this.mapInfos.updateBackgroundColor();
    RPM.updateBackgroundColor(this.mapInfos.backgroundColor);
}

/** Read the map infos file.
*/
SceneMap.prototype.readMapInfos = function(){
    RPM.filesToLoad++;
    this.mapInfos = new MapInfos();
    RPM.openFile(this, RPM.FILE_MAPS + this.mapName + RPM.FILE_MAP_INFOS,
        true, function(res)
    {
        var json = JSON.parse(res);
        this.mapInfos.read(json);
        RPM.loadedFiles++;

        // Camera initialization
        if (this.isBattleMap) {
            this.initializeCamera();
        } else {
            this.camera = new Camera(this.mapInfos.cameraProperties, RPM.game
                .hero);
            this.camera.update();
        }
        this.orientation = this.camera.getMapOrientation();

        // Initialize battle
        if (this.isBattleMap) {
            this.initialize();
        }
    });
}

// -------------------------------------------------------

/** Initialize the map portions.
*/
SceneMap.prototype.initializePortions = function(){
    this.loadPortions();

    // Hero initialize
    if (!this.isBattleMap) {
        RPM.game.hero.changeState();

        // Start music and background sound
        this.mapInfos.music.playSong();
        this.mapInfos.backgroundSound.playSong();

        // Background color update
        this.updateBackgroundColor();
    }

    // End callback
    this.callBackAfterLoading = null;
    RPM.requestPaintHUD = true;
}

// -------------------------------------------------------

SceneMap.prototype.loadPortions = function(noNewPortion) {
    this.currentPortion = RPM.getPortion(this.getHeroPosition());

    var limit = this.getMapPortionLimit();
    if (!noNewPortion) {
        this.mapPortions = new Array(this.getMapPortionTotalSize());
    }
    for (var i = -limit; i <= limit; i++) {
        for (var j = -limit; j <= limit; j++) {
            for (var k = -limit; k <= limit; k++) {
                this.loadPortion(this.currentPortion[0] + i,
                                 this.currentPortion[1] + j,
                                 this.currentPortion[2] + k,
                                 i, j, k, true);
            }
        }
    }
}

// -------------------------------------------------------

/** Load a portion.
*   @param {number} realX The global x portion.
*   @param {number} realY The global y portion.
*   @param {number} realZ The global z portion.
*   @param {number} x The local x portion.
*   @param {number} y The local y portion.
*   @param {number} z The local z portion.
*/
SceneMap.prototype.loadPortion = function(realX, realY, realZ, x, y, z, wait, move) {
    var lx = Math.ceil(this.mapInfos.length / RPM.PORTION_SIZE);
    var lz = Math.ceil(this.mapInfos.width / RPM.PORTION_SIZE);
    var ld = Math.ceil(this.mapInfos.depth / RPM.PORTION_SIZE);
    var lh = Math.ceil(this.mapInfos.height / RPM.PORTION_SIZE);

    if (realX >= 0 && realX < lx && realY >= -ld && realY < lh &&
        realZ >= 0 && realZ < lz)
    {
        var fileName = SceneMap.getPortionName(realX, realY, realZ);
        RPM.openFile(this, RPM.FILE_MAPS + this.mapName + "/" +
                       fileName, wait, function(res)
        {
            var json = JSON.parse(res);
            var mapPortion = null;

            if (json.hasOwnProperty("lands")){
                mapPortion = new MapPortion(realX, realY, realZ);
                mapPortion.read(
                        json, this.id === RPM.datasGame.system.idMapStartHero);
            }
            this.setMapPortion(x, y, z, mapPortion, move);
        });
    }
    else
        this.setMapPortion(x, y, z, null, move);
}

// -------------------------------------------------------

SceneMap.prototype.loadPortionFromPortion = function(portion, x, y, z, move) {
    this.loadPortion(portion[0] + x, portion[1] + y, portion[2] + z,
                     x, y, z, false, move);
}

// -------------------------------------------------------

SceneMap.prototype.removePortion = function(i, j, k){
    var mapPortion = this.getMapPortion(i, j, k);

    if (mapPortion !== null)
        mapPortion.cleanAll();
}

// -------------------------------------------------------

SceneMap.prototype.setPortion = function(i, j, k, m, n, o) {
    this.setMapPortion(i, j, k, this.getMapPortion(m, n, o), true);
}

// -------------------------------------------------------

/** Initialize the map objects
*/
SceneMap.prototype.initializeObjects = function(){
    RPM.openFile(this, RPM.FILE_MAPS + this.mapName +
                   RPM.FILE_MAP_OBJECTS, true, function(res)
    {
        var json = JSON.parse(res).objs;
        var i, l;

        var jsonObject;
        l = json.length;
        this.allObjects = new Array(l+1);
        for (i = 0; i < l; i++){
            jsonObject = json[i];
            this.allObjects[jsonObject.id] = jsonObject.p;
        }
        this.initializePortionsObjects();
        this.mapInfos.startupObject.initializeProperties();
    });
    this.callBackAfterLoading = this.initializePortions;
}

// -------------------------------------------------------

/** All the objects moved or/and with changed states.
*/
SceneMap.prototype.initializePortionsObjects = function(){
    var mapsDatas = RPM.game.mapsDatas[this.id];
    var datas = null;

    var l = Math.ceil(this.mapInfos.length / RPM.PORTION_SIZE);
    var w = Math.ceil(this.mapInfos.width / RPM.PORTION_SIZE);
    var d = Math.ceil(this.mapInfos.depth / RPM.PORTION_SIZE);
    var h = Math.ceil(this.mapInfos.height / RPM.PORTION_SIZE);

    var objectsPortions = new Array(l);
    for (var i = 0; i < l; i++){
        objectsPortions[i] = new Array(h);
        for (var j = -d; j < h; j++){
            objectsPortions[i][j] = new Array(w);
            for (var k = 0; k < w; k++){
                datas = (mapsDatas) ? mapsDatas[i][j][k] : null;
                objectsPortions[i][j][k] =
                {
                    min: datas && datas.min ? datas.min : [],
                        // All the moved objects that are in this
                        // portion
                    mout: datas && datas.mout ? datas.mout : [],
                        // All the moved objects that are from another
                        // portion
                    m: datas && datas.m ? datas.m : [],
                        // All the moved objects that are from this
                        // portion
                    si: datas && datas.si ? datas.si : [],
                        // Ids of the objects that have modified states
                    s: datas && datas.s ? datas.s : [],
                        // States of the objects according to id
                    pi: datas && datas.pi ? datas.pi : [],
                        // Ids of the objects that have modified properties
                    p: datas && datas.p ? datas.p : [],
                        // Properties values of the objects according to id
                    r: datas && datas.r ? datas.r : []
                        // Removed objects according to id
                };
            }
        }
    }

    RPM.game.mapsDatas[this.id] = objectsPortions;
}

// -------------------------------------------------------

/** Get the objects at a specific portion.
*/
SceneMap.prototype.getObjectsAtPortion = function(i, j, k){
    return RPM.game.mapsDatas[this.id][i][j][k];
}


// -------------------------------------------------------

/** Load all the textures of the map.
*/
SceneMap.prototype.loadTextures = function(){
    var tileset, paths;

    tileset = this.mapInfos.tileset;
    paths = tileset.getPath();
    this.textureTileset = paths ? RPM.loadTexture(paths, tileset.picture) :
        RPM.loadTextureEmpty();
    this.texturesAutotiles = RPM.datasGame.tilesets.getTexturesAutotiles(tileset);
    this.texturesWalls = RPM.datasGame.tilesets.getTexturesWalls(tileset);
    this.texturesMountains = RPM.datasGame.tilesets.getTexturesMountains(tileset);
    this.texturesObjects3D = RPM.datasGame.tilesets.texturesObjects3D;
    this.texturesCharacters = RPM.datasGame.tilesets.texturesCharacters;

    this.callBackAfterLoading = this.loadCollisions;
}

// -------------------------------------------------------

SceneMap.prototype.loadCollisions = function() {
    var pictures, list, image, picture;
    var i, l, p;

    // Tileset
    if (this.mapInfos.tileset.picture && this.textureTileset.map) {
        this.mapInfos.tileset.picture.readCollisionsImage(this
            .textureTileset.map.image);
    }

    // Characters
    pictures = RPM.datasGame.pictures.list[PictureKind.Characters];
    l = pictures.length;
    this.collisions[PictureKind.Characters] = new Array(l);
    for (i = 1; i < l; i++) {
        picture = this.texturesCharacters[i];
        if (picture.map) {
            image = picture.map.image;
        }
        p = pictures[i];
        if (p) {
            p.readCollisionsImage(image);
            this.collisions[PictureKind.Characters][i] = p.getSquaresForStates(
                image);
        } else {
            this.collisions[PictureKind.Characters][i] = null;
        }
    }

    // Autotiles
    list = this.mapInfos.tileset.autotiles;
    pictures = RPM.datasGame.pictures.list[PictureKind.Autotiles];
    for (i = 0, l = list.length; i < l; i++) {
        p = RPM.datasGame.specialElements.autotiles[list[i]];
        if (p) {
            p = pictures[p.pictureID];
            if (p) {
                p.readCollisions();
            }
        }
    }

    // Walls
    list = this.mapInfos.tileset.walls;
    pictures = RPM.datasGame.pictures.list[PictureKind.Walls];
    for (i = 0, l = list.length; i < l; i++) {
        p = RPM.datasGame.specialElements.walls[list[i]];
        if (p) {
            p = pictures[p.pictureID];
            if (p) {
                p.readCollisions();
            }
        }
    }

    this.callBackAfterLoading = this.initializeObjects;
}

// -------------------------------------------------------

SceneMap.prototype.getMapPortion = function(x, y, z) {
    var index = this.getPortionIndex(x, y, z);

    return this.getBrutMapPortion(index);
}

// -------------------------------------------------------

SceneMap.prototype.getMapPortionByPortion = function(portion) {
    return this.getMapPortion(portion[0], portion[1], portion[2]);
}

// -------------------------------------------------------

SceneMap.prototype.getMapPortionByPosition = function(position) {
    return this.getMapPortionByPortion(this.getLocalPortion(SceneMap
        .getGlobalPortion(position)));
}

// -------------------------------------------------------

SceneMap.prototype.getBrutMapPortion = function(index) {
    return this.mapPortions[index];
}

// -------------------------------------------------------

SceneMap.prototype.getPortionIndex = function(x, y, z) {
    var size = this.getMapPortionSize();
    var limit = this.getMapPortionLimit();

    return ((x + limit) * size * size) + ((y + limit) * size) +
            (z + limit);
}

// -------------------------------------------------------

SceneMap.prototype.setMapPortion = function(x, y, z, mapPortion, move) {
    var index = this.getPortionIndex(x, y, z);
    var currentMapPortion = this.mapPortions[index];
    if (currentMapPortion && !move) {
        currentMapPortion.cleanAll();
    }

    this.mapPortions[index] = mapPortion;
}

// -------------------------------------------------------

SceneMap.prototype.getLocalPortion = function(portion){
    return [
        portion[0] - this.currentPortion[0],
        portion[1] - this.currentPortion[1],
        portion[2] - this.currentPortion[2]
    ];
}

// -------------------------------------------------------

SceneMap.prototype.getMapPortionLimit = function(){
    return RPM.PORTIONS_RAY_NEAR + RPM.PORTIONS_RAY_FAR;
}

// -------------------------------------------------------

SceneMap.prototype.getMapPortionSize = function(){
    return (this.getMapPortionLimit() * 2) + 1;
}

// -------------------------------------------------------

SceneMap.prototype.getMapPortionTotalSize = function(){
    var size = this.getMapPortionSize();

    return size * size * size;
}

// -------------------------------------------------------

SceneMap.prototype.isInPortion = function(portion) {
    var limit = this.getMapPortionLimit();

    return (portion[0] >= -limit && portion[0] <= limit &&
            portion[1] >= -limit && portion[1] <= limit &&
            portion[2] >= -limit && portion[2] <= limit);
}

// -------------------------------------------------------

SceneMap.prototype.isInMap = function(position) {
    return (position[0] >= 0 && position[0] < this.mapInfos.length &&
            position[2] >= 0 && position[2] < this.mapInfos.width);
}

// -------------------------------------------------------

SceneMap.prototype.updateMovingPortions = function() {
    var newPortion = RPM.getPortion(this.getHeroPosition());

    if (!RPM.arePortionEquals(newPortion, this.currentPortion)){
        this.updateMovingPortionsEastWest(newPortion);
        this.updateMovingPortionsNorthSouth(newPortion);
        this.updateMovingPortionsUpDown(newPortion);
    }

    this.currentPortion = newPortion;
}

// -------------------------------------------------------

SceneMap.prototype.updateMovingPortionsEastWest = function(newPortion) {
    var i, j, k;
    var r = this.getMapPortionLimit();
    if (newPortion[0] > this.currentPortion[0]) {
        for (k = -r; k <= r; k++) {
            for (j = -r; j <= r; j++) {
                i = -r;
                this.removePortion(i, k, j);
                for (; i < r; i++)
                    this.setPortion(i, k, j, i + 1, k, j);

                this.loadPortionFromPortion(newPortion, r, k, j, true);
            }
        }
    } else if (newPortion[0] < this.currentPortion[0]){
        for (k = -r; k <= r; k++) {
            for (j = -r; j <= r; j++) {
                i = r;
                this.removePortion(i, k, j);
                for (; i > -r; i--)
                    this.setPortion(i, k, j, i - 1, k, j);

                this.loadPortionFromPortion(newPortion, -r, k, j, true);
            }
        }
    }
}

// -------------------------------------------------------

SceneMap.prototype.updateMovingPortionsNorthSouth = function(newPortion) {
    var i, j, k;
    var r = this.getMapPortionLimit();
    if (newPortion[2] > this.currentPortion[2]){
        for (k = -r; k <= r; k++) {
            for (i = -r; i <= r; i++) {
                j = -r;
                this.removePortion(i, k, j);
                for (; j < r; j++)
                    this.setPortion(i, k, j, i, k, j + 1);

                this.loadPortionFromPortion(newPortion, i, k, r, true);
            }
        }
    }
    else if (newPortion[2] < this.currentPortion[2]){
        for (k = -r; k <= r; k++) {
            for (i = -r; i <= r; i++) {
                j = r;
                this.removePortion(i, k, j);
                for (; j > -r; j--)
                    this.setPortion(i, k, j, i, k, j - 1);

                this.loadPortionFromPortion(newPortion, i, k, -r, true);
            }
        }
    }
}

// -------------------------------------------------------

SceneMap.prototype.updateMovingPortionsUpDown = function(newPortion) {
    var i, j, k;
    var r = this.getMapPortionLimit();
    if (newPortion[1] > this.currentPortion[1]) {
        for (i = -r; i <= r; i++) {
            for (j = -r; j <= r; j++) {
                k = -r;
                this.removePortion(i, k, j);
                for (; k < r; k++)
                    this.setPortion(i, k, j, i, k + 1, j);

                this.loadPortionFromPortion(newPortion, i, r, j, true);
            }
        }
    }
    else if (newPortion[1] < this.currentPortion[1]) {
        for (i = -r; i <= r; i++) {
            for (j = -r; j <= r; j++) {
                k = r;
                this.removePortion(i, k, j);
                for (; k > -r; k--)
                    this.setPortion(i, k, j, i, k - 1, j);

                this.loadPortionFromPortion(newPortion, i, -r, j, true);
            }
        }
    }
}

// -------------------------------------------------------

/** Close the map.
*/
SceneMap.prototype.closeMap = function() {
    var i, j, k;
    var l = Math.ceil(this.mapInfos.length / RPM.PORTION_SIZE);
    var w = Math.ceil(this.mapInfos.width / RPM.PORTION_SIZE);
    var d = Math.ceil(this.mapInfos.depth / RPM.PORTION_SIZE);
    var h = Math.ceil(this.mapInfos.height / RPM.PORTION_SIZE);

    var objectsPortions = RPM.game.mapsDatas[this.id];
    for (i = 0; i < l; i++){
        for (j = -d; j < h; j++){
            for (k = 0; k < w; k++){
                var portion = objectsPortions[i][j][k];
                portion.min = [];
                portion.mout = [];
                portion.m = [];
                portion.r = [];
            }
        }
    }

    // Clear scene
    for (i = this.scene.children.length - 1; i >= 0; i--) {
        this.scene.remove(this.scene.children[i]);
    }

    RPM.currentMap = null;
}

// -------------------------------------------------------

SceneMap.prototype.update = function() {
    this.updateMovingPortions();

    // Update camera
    this.camera.update();

    // Getting the Y angle of the camera
    var vector = new THREE.Vector3();
    this.camera.threeCamera.getWorldDirection(vector);
    var angle = Math.atan2(vector.x,vector.z) + (180 * Math.PI / 180.0);

    if (!this.isBattleMap) {
        this.mapInfos.startupObject.update();

        // Update the objects
        RPM.game.hero.update(angle);
        this.updatePortions(this, function(x, y, z, i, j, k) {
            var objects = RPM.game.mapsDatas[this.id][x][y][z];
            var movedObjects = objects.min;
            var movedObject;
            var p, l;
            for (p = 0, l = movedObjects.length; p < l; p++)
                movedObjects[p].update(angle);
            movedObjects = objects.mout;
            for (p = 0, l = movedObjects.length; p < l; p++)
                movedObjects[p].update(angle);

            // Update face sprites
            var mapPortion = this.getMapPortion(i, j, k);

            if (mapPortion)
                mapPortion.updateFaceSprites(angle);
        });
    }

    // Update
    SceneGame.prototype.update.call(this);
}

// -------------------------------------------------------

SceneMap.prototype.updatePortions = function(base, callback) {
    var limit = this.getMapPortionLimit();
    var i, j, k, p, l, x, y, z;

    var lx = Math.ceil(this.mapInfos.length / RPM.PORTION_SIZE);
    var lz = Math.ceil(this.mapInfos.width / RPM.PORTION_SIZE);
    var ld = Math.ceil(this.mapInfos.depth / RPM.PORTION_SIZE);
    var lh = Math.ceil(this.mapInfos.height / RPM.PORTION_SIZE);

    for (i = -limit; i <= limit; i++) {
        for (j = -limit; j <= limit; j++) {
            for (k = -limit; k <= limit; k++) {
                x = this.currentPortion[0] + i;
                y = this.currentPortion[1] + j;
                z = this.currentPortion[2] + k;
                if (x >= 0 && x < lx && y >= -ld && y < lh && z >= 0 &&
                    z < lz)
                {
                    callback.call(base, x, y, z, i, j, k);
                }
            }
        }
    }
}

// -------------------------------------------------------

SceneMap.prototype.onKeyPressed = function(key){

    // Send keyPressEvent to all the objects
    if (!RPM.blockingHero){
        EventCommandSendEvent.sendEvent(null, 0, 1, true, 3,
                                        [null,
                                        SystemValue.createNumber(key),
                                        SystemValue.createSwitch(false),
                                        SystemValue.createSwitch(false)], true);
    }

    SceneGame.prototype.onKeyPressed.call(this, key);
}

// -------------------------------------------------------

SceneMap.prototype.onKeyReleased = function(key){
    SceneGame.prototype.onKeyReleased.call(this, key);
}

// -------------------------------------------------------

SceneMap.prototype.onKeyPressedRepeat = function(key){
    if (!RPM.blockingHero){
        EventCommandSendEvent.sendEvent(null, 0, 1, true, 3,
                                        [null,
                                        SystemValue.createNumber(key),
                                        SystemValue.createSwitch(true),
                                        SystemValue.createSwitch(true)], true);
    }

    var block = SceneGame.prototype.onKeyPressedRepeat.call(this, key);

    return block;
}

// -------------------------------------------------------

SceneMap.prototype.onKeyPressedAndRepeat = function(key){
    if (!RPM.blockingHero){
        EventCommandSendEvent.sendEvent(null, 0, 1, true, 3,
                                        [null,
                                        SystemValue.createNumber(key),
                                        SystemValue.createSwitch(true),
                                        SystemValue.createSwitch(false)], true);
    }

    SceneGame.prototype.onKeyPressedAndRepeat.call(this, key);
}

// -------------------------------------------------------

SceneMap.prototype.draw3D = function(canvas){
    RPM.renderer.render(this.scene, this.camera.threeCamera);
}

// -------------------------------------------------------

SceneMap.prototype.drawHUD = function(){
    SceneGame.prototype.drawHUD.call(this);
}
