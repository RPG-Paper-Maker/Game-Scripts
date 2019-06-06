/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

    $currentMap = this;
    this.id = id;
    this.isBattleMap = isBattleMap;
    this.mapName = RPM.generateMapName(id);
    this.scene = new THREE.Scene();
    this.camera = new Camera(250, -90, 55, isBattleMap ? $game.heroBattle :
        $game.hero);
    this.camera.update();
    this.orientation = this.camera.getMapOrientation();
    this.readMapInfos();
    this.currentPortion = RPM.getPortion(this.getHeroPosition());
    this.collisions = new Array;

    // Adding meshes for collision
    if ($datasGame.system.showBB) {
        this.scene.add($BB_BOX);
        this.scene.add($BB_ORIENTED_BOX);
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
        Math.floor(position[0] / $PORTION_SIZE),
        Math.floor(position[1] / $PORTION_SIZE),
        Math.floor(position[3] / $PORTION_SIZE)
    ];
}

// -------------------------------------------------------

SceneMap.prototype = {

    /** Get the hero position according to battle map
    */
    getHeroPosition: function() {
        return this.isBattleMap ? $game.heroBattle.position : $game.hero.position;
    },

    // -------------------------------------------------------

    updateBackgroundColor: function() {
        this.mapInfos.updateBackgroundColor();
        RPM.updateBackgroundColor(this.mapInfos.backgroundColor);
    },

    /** Read the map infos file.
    */
    readMapInfos: function(){
        $filesToLoad++;
        this.mapInfos = new MapInfos();
        RPM.openFile(this, RPM.FILE_MAPS + this.mapName +
                       RPM.FILE_MAP_INFOS, true, function(res)
        {
            var json = JSON.parse(res);
            this.mapInfos.read(json);
            $loadedFiles++;

            // Now that we have map dimensions, we can initialize object portion
            this.initializePortionsObjects();
        });
    },

    // -------------------------------------------------------

    /** Initialize the map portions.
    */
    initializePortions: function(){
        this.loadPortions();

        // Hero initialize
        if (!this.isBattleMap) {
            $game.hero.changeState();

            // Start music and background sound
            this.mapInfos.music.playSong();
            this.mapInfos.backgroundSound.playSong();

            // Background color update
            this.updateBackgroundColor();
        }

        // End callback
        this.callBackAfterLoading = null;
        $requestPaintHUD = true;
    },

    // -------------------------------------------------------

    loadPortions: function(noNewPortion) {
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
    },

    // -------------------------------------------------------

    /** Load a portion.
    *   @param {number} realX The global x portion.
    *   @param {number} realY The global y portion.
    *   @param {number} realZ The global z portion.
    *   @param {number} x The local x portion.
    *   @param {number} y The local y portion.
    *   @param {number} z The local z portion.
    */
    loadPortion: function(realX, realY, realZ, x, y, z, wait) {
        var lx = Math.floor((this.mapInfos.length - 1) / $PORTION_SIZE);
        var ly = Math.floor((this.mapInfos.depth + this.mapInfos.height - 1) /
                $PORTION_SIZE);
        var lz = Math.floor((this.mapInfos.width - 1) / $PORTION_SIZE);

        if (realX >= 0 && realX <= lx && realY >= 0 && realY <= ly &&
            realZ >= 0 && realZ <= lz)
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
                            json, this.id === $datasGame.system.idMapStartHero);
                }
                this.setMapPortion(x, y, z, mapPortion);
            });
        }
        else
            this.setMapPortion(x, y, z, null);
    },

    // -------------------------------------------------------

    loadPortionFromPortion: function(portion, x, y, z) {
        this.loadPortion(portion[0] + x, portion[1] + y, portion[2] + z,
                         x, y, z, false);
    },

    // -------------------------------------------------------

    removePortion: function(i, j, k){
        var mapPortion = this.getMapPortion(i, j, k);

        if (mapPortion !== null)
            mapPortion.cleanAll();
    },

    // -------------------------------------------------------

    setPortion: function(i, j, k, m, n, o) {
        this.setMapPortion(i, j, k, this.getMapPortion(m, n, o), true);
    },

    // -------------------------------------------------------

    /** Initialize the map objects
    */
    initializeObjects: function(){
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
            this.callBackAfterLoading = this.initializePortions;
        });
    },

    // -------------------------------------------------------

    /** All the objects moved or/and with changed states.
    */
    initializePortionsObjects: function(){
        var mapsDatas = $game.mapsDatas[this.id];
        var datas = null;

        var l = Math.ceil(this.mapInfos.length / $PORTION_SIZE);
        var w = Math.ceil(this.mapInfos.width / $PORTION_SIZE);
        var h = Math.ceil(this.mapInfos.height / $PORTION_SIZE) +
                Math.ceil(this.mapInfos.depth / $PORTION_SIZE);

        var objectsPortions = new Array(l);
        for (var i = 0; i < l; i++){
            objectsPortions[i] = new Array(h);
            for (var j = 0; j < h; j++){
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
                        s: datas && datas.s ? datas.s : []
                            // States of the objects according to id
                    };
                }
            }
        }

        $game.mapsDatas[this.id] = objectsPortions;
    },

    // -------------------------------------------------------

    /** Get the objects at a specific portion.
    */
    getObjectsAtPortion: function(i, j, k){
        return $game.mapsDatas[this.id][i][j][k];
    },


    // -------------------------------------------------------

    /** Load all the textures of the map.
    */
    loadTextures: function(){
        var tileset = this.mapInfos.tileset;
        this.textureTileset = RPM.loadTexture(tileset.getPath(), tileset.picture);
        this.texturesAutotiles = $datasGame.tilesets.getTexturesAutotiles(tileset);
        this.texturesWalls = $datasGame.tilesets.getTexturesWalls(tileset);
        this.texturesCharacters = $datasGame.tilesets.texturesCharacters;

        this.callBackAfterLoading = this.loadCollisions;
    },

    // -------------------------------------------------------

    loadCollisions: function() {
        var pictures, list, image;
        var i, l, p;

        // Tileset
        this.mapInfos.tileset.picture.readCollisionsImage(
            this.textureTileset.map.image);

        // Characters
        pictures = $datasGame.pictures.list[PictureKind.Characters];
        l = pictures.length;
        this.collisions[PictureKind.Characters] = new Array(l);
        for (i = 1; i < l; i++) {
            image = this.texturesCharacters[i].map.image;
            p = pictures[i];
            p.readCollisionsImage(image);
            this.collisions[PictureKind.Characters][i] = p.getSquaresForStates(
                image);
        }

        // Autotiles
        list = this.mapInfos.tileset.autotiles;
        pictures = $datasGame.pictures.list[PictureKind.Autotiles];
        for (i = 0, l = list.length; i < l; i++)
            pictures[list[i]].readCollisions();

        // Walls
        list = this.mapInfos.tileset.walls;
        pictures = $datasGame.pictures.list[PictureKind.Walls];
        for (i = 0, l = list.length; i < l; i++)
            pictures[list[i]].readCollisions();

        this.callBackAfterLoading = this.initializeObjects();
    },

    // -------------------------------------------------------

    getMapPortion: function(x, y, z) {
        var index = this.getPortionIndex(x, y, z);

        return this.getBrutMapPortion(index);
    },

    // -------------------------------------------------------

    getMapPortionByPortion: function(portion) {
        return this.getMapPortion(portion[0], portion[1], portion[2]);
    },

    // -------------------------------------------------------

    getBrutMapPortion: function(index) {
        return this.mapPortions[index];
    },

    // -------------------------------------------------------

    getPortionIndex: function(x, y, z) {
        var size = this.getMapPortionSize();
        var limit = this.getMapPortionLimit();

        return ((x + limit) * size * size) + ((y + limit) * size) +
                (z + limit);
    },

    // -------------------------------------------------------

    setMapPortion: function(x, y, z, mapPortion, move) {
        var index = this.getPortionIndex(x, y, z);
        var currentMapPortion = this.mapPortions[index];
        if (currentMapPortion && !move) {
            currentMapPortion.cleanAll();
        }

        this.mapPortions[index] = mapPortion;
    },

    // -------------------------------------------------------

    getLocalPortion: function(portion){
        return [
            portion[0] - this.currentPortion[0],
            portion[1] - this.currentPortion[1],
            portion[2] - this.currentPortion[2]
        ];
    },

    // -------------------------------------------------------

    getMapPortionLimit: function(){
        return $PORTIONS_RAY_NEAR + $PORTIONS_RAY_FAR;
    },

    // -------------------------------------------------------

    getMapPortionSize: function(){
        return (this.getMapPortionLimit() * 2) + 1;
    },

    // -------------------------------------------------------

    getMapPortionTotalSize: function(){
        var size = this.getMapPortionSize();

        return size * size * size;
    },

    // -------------------------------------------------------

    isInPortion: function(portion) {
        var limit = this.getMapPortionLimit();

        return (portion[0] >= -limit && portion[0] <= limit &&
                portion[1] >= -limit && portion[1] <= limit &&
                portion[2] >= -limit && portion[2] <= limit);
    },

    // -------------------------------------------------------

    isInMap: function(position) {
        return (position[0] >= 0 && position[0] < this.mapInfos.length &&
                position[2] >= 0 && position[2] < this.mapInfos.width);
    },

    // -------------------------------------------------------

    updateMovingPortions: function() {
        var newPortion = RPM.getPortion(this.getHeroPosition());

        if (!RPM.arePortionEquals(newPortion, this.currentPortion)){
            this.updateMovingPortionsEastWest(newPortion);
            this.updateMovingPortionsNorthSouth(newPortion);
            this.updateMovingPortionsUpDown(newPortion);
        }

        this.currentPortion = newPortion;
    },

    // -------------------------------------------------------

    updateMovingPortionsEastWest: function(newPortion) {
        var i, j, k;
        var r = this.getMapPortionLimit();
        if (newPortion[0] > this.currentPortion[0]) {
            k = 0;
            for (j = -r; j <= r; j++) {
                i = -r;
                this.removePortion(i, k, j);
                for (; i < r; i++)
                    this.setPortion(i, k, j, i + 1, k, j);

                this.loadPortionFromPortion(newPortion, r, k, j);
            }
        }
        else if (newPortion[0] < this.currentPortion[0]){
            k = 0;
            for (j = -r; j <= r; j++){
                i = r;
                this.removePortion(i, k, j);
                for (; i > -r; i--)
                    this.setPortion(i, k, j, i - 1, k, j);

                this.loadPortionFromPortion(newPortion, -r, k, j);
            }
        }
    },

    // -------------------------------------------------------

    updateMovingPortionsNorthSouth: function(newPortion) {
        var i, j, k;
        var r = this.getMapPortionLimit();
        if (newPortion[2] > this.currentPortion[2]){
            k = 0;
            for (i = -r; i <= r; i++){
                j = -r;
                this.removePortion(i, k, j);
                for (; j < r; j++)
                    this.setPortion(i, k, j, i, k, j + 1);

                this.loadPortionFromPortion(newPortion, i, k, r);
            }
        }
        else if (newPortion[2] < this.currentPortion[2]){
            k = 0;
            for (i = -r; i <= r; i++){
                j = r;
                this.removePortion(i, k, j);
                for (; j > -r; j--)
                    this.setPortion(i, k, j, i, k, j - 1);

                this.loadPortionFromPortion(newPortion, i, k, -r);
            }
        }
    },

    // -------------------------------------------------------

    updateMovingPortionsUpDown: function(newPortion) {
        // TODO
    },

    // -------------------------------------------------------

    /** Close the map.
    */
    closeMap: function() {
        var i, j, k;
        var l = Math.ceil(this.mapInfos.length / $PORTION_SIZE);
        var w = Math.ceil(this.mapInfos.width / $PORTION_SIZE);
        var h = Math.ceil(this.mapInfos.height / $PORTION_SIZE) +
                Math.ceil(this.mapInfos.depth / $PORTION_SIZE);

        var objectsPortions = $game.mapsDatas[this.id];
        for (i = 0; i < l; i++){
            for (j = 0; j < h; j++){
                for (k = 0; k < w; k++){
                    var portion = objectsPortions[i][j][k];
                    portion.mr = [];
                    portion.ma = [];
                    portion.m = [];
                }
            }
        }

        // Clear scene
        for (i = this.scene.children.length - 1; i >= 0; i--) {
            this.scene.remove(this.scene.children[i]);
        }

        $currentMap = null;
    },

    // -------------------------------------------------------

    update: function() {
        this.updateMovingPortions();

        // Update camera
        this.camera.update();

        // Getting the Y angle of the camera
        var vector = new THREE.Vector3();
        this.camera.threeCamera.getWorldDirection(vector);
        var angle = Math.atan2(vector.x,vector.z) + (180 * Math.PI / 180.0);

        if (!this.isBattleMap) {
            // Update the objects
            $game.hero.update(angle);
            this.updatePortions(this, function(x, y, z, i, j, k) {
                var objects = $game.mapsDatas[this.id][x][y][z];
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

            // Update
            SceneGame.prototype.update.call(this);
        }
    },

    // -------------------------------------------------------

    updatePortions: function(base, callback) {
        var limit = this.getMapPortionLimit();
        var i, j, k, p, l, x, y, z;
        var lx = Math.floor((this.mapInfos.length - 1) / $PORTION_SIZE);
        var ly = Math.floor((this.mapInfos.depth + this.mapInfos.height - 1) /
                $PORTION_SIZE);
        var lz = Math.floor((this.mapInfos.width - 1) / $PORTION_SIZE);
        for (i = -limit; i <= limit; i++) {
            for (j = -limit; j <= limit; j++) {
                for (k = -limit; k <= limit; k++) {
                    x = this.currentPortion[0] + i;
                    y = this.currentPortion[1] + j;
                    z = this.currentPortion[2] + k;
                    if (x >= 0 && x <= lx && y >= 0 && y <= ly && z >= 0 &&
                        z <= lz)
                    {
                        callback.call(base, x, y, z, i, j, k);
                    }
                }
            }
        }
    },

    // -------------------------------------------------------

    onKeyPressed: function(key){

        // Send keyPressEvent to all the objects
        if (!$blockingHero){
            EventCommandSendEvent.sendEvent(null, 0, 1, true, 3,
                                            [null,
                                            SystemValue.createNumber(key),
                                            SystemValue.createSwitch(false),
                                            SystemValue.createSwitch(false)]);
        }

        SceneGame.prototype.onKeyPressed.call(this, key);
    },

    // -------------------------------------------------------

    onKeyReleased: function(key){
        SceneGame.prototype.onKeyReleased.call(this, key);
    },

    // -------------------------------------------------------

    onKeyPressedRepeat: function(key){
        if (!$blockingHero){
            EventCommandSendEvent.sendEvent(null, 0, 1, true, 3,
                                            [null,
                                            SystemValue.createNumber(key),
                                            SystemValue.createSwitch(true),
                                            SystemValue.createSwitch(true)]);
        }

        var block = SceneGame.prototype.onKeyPressedRepeat.call(this, key);

        return block;
    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key){
        if (!$blockingHero){
            EventCommandSendEvent.sendEvent(null, 0, 1, true, 3,
                                            [null,
                                            SystemValue.createNumber(key),
                                            SystemValue.createSwitch(true),
                                            SystemValue.createSwitch(false)]);
        }

        SceneGame.prototype.onKeyPressedAndRepeat.call(this, key);
    },

    // -------------------------------------------------------

    draw3D: function(canvas){
        $renderer.render(this.scene, this.camera.threeCamera);
    },

    // -------------------------------------------------------

    drawHUD: function(){
        SceneGame.prototype.drawHUD.call(this);
    }
}
