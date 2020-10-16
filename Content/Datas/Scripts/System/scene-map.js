/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A scene for a local map
*   @extends SceneGame
*   @property {number} id The ID of the map
*   @property {string} mapName The map name
*   @property {THREE.Scene} scene The 3D scene of the map
*   @property {Camera} camera he camera of the scene
*   @property {Object} mapProperties General map informations (real name, name,
*   width, height)
*   @property {number[][]} allObjects All the objects portions according to ID
*   @property {MapPortion[][][]} mapPortions All the portions in the visible ray
*   of the map
*   @param {number} id The ID of the map
*/
class SceneMap extends SceneGame
{
    constructor(id, isBattleMap, minimal)
    {
        super(false);

        this.id = id;
        this.isBattleMap = isBattleMap;
        this.mapName = RPM.generateMapName(id);
        this.loading = false;
        if (!minimal)
        {
            this.loading = true;
            RPM.tryCatch(this.load());
        }
    }

    /** Get the portion file name
    *   @static
    *   @param {number} x The global x portion
    *   @param {number} y The global y portion
    *   @param {number} z The global z portion
    *   @returns {string}
    */
    static getPortionName(x, y, z)
    {
        return (x + "_" + y + "_" + z + RPM.EXTENSION_JSON);
    }

    // -------------------------------------------------------

    static getGlobalPortion(position)
    {
        return [
            Math.floor(position[0] / RPM.PORTION_SIZE),
            Math.floor(position[1] / RPM.PORTION_SIZE),
            Math.floor(position[3] / RPM.PORTION_SIZE)
        ];
    }

    async load()
    {
        RPM.currentMap = this;
        if (!this.isBattleMap)
        {
            RPM.game.currentMapID = this.id;
        }
        this.scene = new Physijs.Scene();

        // Adding meshes for collision
        this.collisions = new Array;
        if (RPM.datasGame.system.showBB)
        {
            this.scene.add(RPM.BB_BOX);
            this.scene.add(RPM.BB_ORIENTED_BOX);
            //this.scene.add(RPM.BB_BOX_DETECTION);
            //this.scene.add(RPM.BB_BOX_DEFAULT_DETECTION);
        }
        await this.readMapProperties();
        await this.initializeObjects();
        this.initializePortionsObjects();
        await this.loadTextures();
        this.loadCollisions();
        await this.initializePortions();

        RPM.requestPaintHUD = true;
        this.loading = false;
    }

    /** Read the map infos file
    */
    async readMapProperties()
    {
        this.mapProperties = new MapProperties();
        let json = await RPM.parseFileJSON(RPM.FILE_MAPS + this.mapName + RPM
            .FILE_MAP_INFOS);
        this.mapProperties.read(json);

        // Camera initialization
        if (this.isBattleMap)
        {
            this.initializeCamera();
        } else
        {
            this.camera = new Camera(this.mapProperties.cameraProperties, RPM
                .game.hero);
            this.camera.update();
            this.currentPortion = RPM.getPortion(this.camera.threeCamera
                .position);
            if (this.mapProperties.skyboxGeometry !== null)
            {
                this.previousCameraPosition = this.camera.threeCamera.position
                    .clone();
                this.mapProperties.skyboxGeometry.translate(this.camera.threeCamera
                    .position.x, this.camera.threeCamera.position.y, this.camera
                    .threeCamera.position.z);
            }
        }
        this.orientation = this.camera.getMapOrientation();
    }

    // -------------------------------------------------------
    /** Initialize the map objects
    */
    async initializeObjects()
    {
        let json = (await RPM.parseFileJSON(RPM.FILE_MAPS + this.mapName + RPM
            .FILE_MAP_OBJECTS)).objs;
        let l = json.length;
        this.allObjects = new Array(l + 1);
        let jsonObject;
        for (let i = 0; i < l; i++)
        {
            jsonObject = json[i];
            this.allObjects[jsonObject.id] = jsonObject.p;
        }
    }

    // -------------------------------------------------------
    /** All the objects moved or/and with changed states.
    */
    initializePortionsObjects()
    {
        let mapsDatas = RPM.game.mapsDatas[this.id];
        let datas = null;
        let l = Math.ceil(this.mapProperties.length / RPM.PORTION_SIZE);
        let w = Math.ceil(this.mapProperties.width / RPM.PORTION_SIZE);
        let d = Math.ceil(this.mapProperties.depth / RPM.PORTION_SIZE);
        let h = Math.ceil(this.mapProperties.height / RPM.PORTION_SIZE);
        var objectsPortions = new Array(l);
        let i, j, jp, k, jabs;
        for (i = 0; i < l; i++)
        {
            objectsPortions[i] = new Array(2);
            objectsPortions[i][0] = new Array(d); // Depth
            objectsPortions[i][1] = new Array(h); // Height
            for (j = -d; j < h; j++)
            {
                jp = j < 0 ? 0 : 1;
                jabs = Math.abs(j);
                objectsPortions[i][jp][jabs] = new Array(w);
                for (k = 0; k < w; k++)
                {
                    datas = (mapsDatas) ? mapsDatas[i][jp][jabs][k] : null;
                    objectsPortions[i][jp][jabs][k] =
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
                        r: datas && datas.r ? datas.r : [],
                            // Removed objects according to id
                        soi: datas && datas.soi ? datas.soi : [],
                            // Ids of the objects that have modified states options
                        so: datas && datas.so ? datas.so : [],
                            // States options of the objects according to id
                    };
                }
            }
        }
        RPM.game.mapsDatas[this.id] = objectsPortions;
        this.portionsObjectsUpdated = true;
    }

    // -------------------------------------------------------
    /** Load all the textures of the map
    */
    async loadTextures()
    {
        let tileset = this.mapProperties.tileset;
        let path = tileset.getPath();
        this.textureTileset = path ? (await RPM.loadTexture(path)) : RPM
            .loadTextureEmpty();
        this.texturesAutotiles = RPM.datasGame.tilesets.getTexturesAutotiles(
            tileset);
        this.texturesWalls = RPM.datasGame.tilesets.getTexturesWalls(tileset);
        this.texturesMountains = RPM.datasGame.tilesets.getTexturesMountains(
            tileset);
        this.texturesObjects3D = RPM.datasGame.tilesets.texturesObjects3D;
        this.texturesCharacters = RPM.datasGame.tilesets.texturesCharacters;
    }

    // -------------------------------------------------------

    loadCollisions()
    {
        // Tileset
        if (this.mapProperties.tileset.picture && this.textureTileset.map)
        {
            this.mapProperties.tileset.picture.readCollisionsImage(this
                .textureTileset.map.image);
        }

        // Characters
        let pictures = RPM.datasGame.pictures.list[PictureKind.Characters];
        let l = pictures.length;
        this.collisions[PictureKind.Characters] = new Array(l);
        let picture, image, p;
        for (let i = 1; i < l; i++)
        {
            picture = this.texturesCharacters[i];
            if (picture.map)
            {
                image = picture.map.image;
            }
            p = pictures[i];
            if (p)
            {
                p.readCollisionsImage(image);
                this.collisions[PictureKind.Characters][i] = p
                    .getSquaresForStates(image);
            } else
            {
                this.collisions[PictureKind.Characters][i] = null;
            }
        }

        // Autotiles
        this.loadSpecialsCollision(this.mapProperties.tileset.autotiles, PictureKind
            .Autotiles, RPM.datasGame.specialElements.autotiles);

        // Walls
        this.loadSpecialsCollision(this.mapProperties.tileset.walls, PictureKind
            .Walls, RPM.datasGame.specialElements.walls);
    }

    // -------------------------------------------------------
    /** Initialize the map portions
    */
    async initializePortions()
    {
        await this.loadPortions();

        // Hero initialize
        if (!this.isBattleMap)
        {
            RPM.game.hero.changeState();

            // Start music and background sound
            this.mapProperties.music.playMusic();
            this.mapProperties.backgroundSound.playMusic();

            // Background color update
            this.updateBackgroundColor();
        }
    }

    async loadPortions(noNewPortion)
    {
        this.currentPortion = RPM.getPortion(this.camera.threeCamera.position);
        let limit = this.getMapPortionLimit();
        if (!noNewPortion)
        {
            this.mapPortions = new Array(this.getMapPortionTotalSize());
        }
        let i, j, k;
        for (i = -limit; i <= limit; i++)
        {
            for (j = -limit; j <= limit; j++)
            {
                for (k = -limit; k <= limit; k++)
                {
                    await this.loadPortion(this.currentPortion[0] + i, this
                        .currentPortion[1] + j, this.currentPortion[2] + k, i, j
                        , k, true);
                }
            }
        }
    }

    // -------------------------------------------------------
    /** Load a portion
    *   @param {number} realX The global x portion.
    *   @param {number} realY The global y portion.
    *   @param {number} realZ The global z portion.
    *   @param {number} x The local x portion.
    *   @param {number} y The local y portion.
    *   @param {number} z The local z portion.
    */
    async loadPortion(realX, realY, realZ, x, y, z, wait, move)
    {
        let lx = Math.ceil(this.mapProperties.length / RPM.PORTION_SIZE);
        let lz = Math.ceil(this.mapProperties.width / RPM.PORTION_SIZE);
        let ld = Math.ceil(this.mapProperties.depth / RPM.PORTION_SIZE);
        let lh = Math.ceil(this.mapProperties.height / RPM.PORTION_SIZE);
        let mapPortion = null;
        if (realX >= 0 && realX < lx && realY >= -ld && realY < lh &&
            realZ >= 0 && realZ < lz)
        {
            let json = await RPM.parseFileJSON(RPM.FILE_MAPS + this.mapName + 
                RPM.STRING_SLASH + SceneMap.getPortionName(realX, realY, realZ));
            if (json.hasOwnProperty("lands"))
            {
                mapPortion = new MapPortion(realX, realY, realZ);
                mapPortion.read(json, this.id === RPM.datasGame.system
                    .idMapStartHero);
            }
        }
        this.setMapPortion(x, y, z, mapPortion, move);
    }

    // -------------------------------------------------------

    async loadPortionFromPortion(portion, x, y, z, move)
    {
        await this.loadPortion(portion[0] + x, portion[1] + y, portion[2] + z,
            x, y, z, false, move);
    }

    // -------------------------------------------------------

    removePortion(i, j, k)
    {
        let mapPortion = this.getMapPortion(i, j, k);
        if (mapPortion !== null)
        {
            mapPortion.cleanAll();
        }
    }

    // -------------------------------------------------------

    setPortion(i, j, k, m, n, o)
    {
        this.setMapPortion(i, j, k, this.getMapPortion(m, n, o), true);
    }

    // -------------------------------------------------------
    /** Get the objects at a specific portion.
     */
    getObjectsAtPortion(i, j, k)
    {
        return RPM.game.getPotionsDatas(this.id, i, j, k);
    }

    // -------------------------------------------------------

    getMapPortion(x, y, z)
    {
        return this.getBrutMapPortion(this.getPortionIndex(x, y, z));
    }

    // -------------------------------------------------------

    getMapPortionByPortion(portion)
    {
        return this.getMapPortion(portion[0], portion[1], portion[2]);
    }

    // -------------------------------------------------------

    getMapPortionByPosition(position)
    {
        return this.getMapPortionByPortion(this.getLocalPortion(SceneMap
            .getGlobalPortion(position)));
    }

    // -------------------------------------------------------

    getBrutMapPortion(index)
    {
        return this.mapPortions[index];
    }

    // -------------------------------------------------------

    getPortionIndex(x, y, z)
    {
        let size = this.getMapPortionSize();
        let limit = this.getMapPortionLimit();

        return ((x + limit) * size * size) + ((y + limit) * size) + (z + limit);
    }

    // -------------------------------------------------------

    setMapPortion(x, y, z, mapPortion, move)
    {
        let index = this.getPortionIndex(x, y, z);
        let currentMapPortion = this.mapPortions[index];
        if (currentMapPortion && !move) {
            currentMapPortion.cleanAll();
        }
        this.mapPortions[index] = mapPortion;
    }

    // -------------------------------------------------------

    getLocalPortion(portion)
    {
        return [
            portion[0] - this.currentPortion[0],
            portion[1] - this.currentPortion[1],
            portion[2] - this.currentPortion[2]
        ];
    }

    // -------------------------------------------------------

    getMapPortionLimit()
    {
        return RPM.PORTIONS_RAY_NEAR + RPM.PORTIONS_RAY_FAR;
    }

    // -------------------------------------------------------

    getMapPortionSize()
    {
        return (this.getMapPortionLimit() * 2) + 1;
    }

    // -------------------------------------------------------

    getMapPortionTotalSize()
    {
        let size = this.getMapPortionSize();
        return size * size * size;
    }

    // -------------------------------------------------------

    isInPortion(portion)
    {
        let limit = this.getMapPortionLimit();
        return (portion[0] >= -limit && portion[0] <= limit &&
                portion[1] >= -limit && portion[1] <= limit &&
                portion[2] >= -limit && portion[2] <= limit);
    }

    // -------------------------------------------------------

    isInMap(position)
    {
        return (position[0] >= 0 && position[0] < this.mapProperties.length &&
                position[2] >= 0 && position[2] < this.mapProperties.width);
    }

    // -------------------------------------------------------
    /** Get the hero position according to battle map
    */
    getHeroPosition()
    {
        return this.isBattleMap ? RPM.game.heroBattle.position : RPM.game.hero
            .position;
    }

    // -------------------------------------------------------

    updateBackgroundColor()
    {
        this.mapProperties.updateBackgroundColor();
        RPM.updateBackgroundColor(this.mapProperties.backgroundColor);
    }

    loadSpecialsCollision(list, kind, specials)
    {
        let pictures = RPM.datasGame.pictures.list[kind];
        let p;
        for (let i = 0, l = list.length; i < l; i++)
        {
            p = specials[list[i]];
            if (p)
            {
                p = pictures[p.pictureID];
                if (p)
                {
                    p.readCollisions();
                }
            }
        }
    }

    // -------------------------------------------------------

    updateMovingPortions()
    {
        let newPortion = RPM.getPortion(this.camera.threeCamera.position);
        if (!RPM.arePortionEquals(newPortion, this.currentPortion))
        {
            this.updateMovingPortionsEastWest(newPortion);
            this.updateMovingPortionsNorthSouth(newPortion);
            this.updateMovingPortionsUpDown(newPortion);
        }
        this.currentPortion = newPortion;
    }

    // -------------------------------------------------------

    updateMovingPortionsEastWest(newPortion)
    {
        let r = this.getMapPortionLimit();
        let i, j, k;
        if (newPortion[0] > this.currentPortion[0])
        {
            for (k = -r; k <= r; k++)
            {
                for (j = -r; j <= r; j++)
                {
                    i = -r;
                    this.removePortion(i, k, j);
                    for (; i < r; i++)
                    {
                        this.setPortion(i, k, j, i + 1, k, j);
                    }
                    this.loadPortionFromPortion(newPortion, r, k, j, true);
                }
            }
        } else if (newPortion[0] < this.currentPortion[0])
        {
            for (k = -r; k <= r; k++)
            {
                for (j = -r; j <= r; j++)
                {
                    i = r;
                    this.removePortion(i, k, j);
                    for (; i > -r; i--)
                    {
                        this.setPortion(i, k, j, i - 1, k, j);
                    }
                    this.loadPortionFromPortion(newPortion, -r, k, j, true);
                }
            }
        }
    }

    // -------------------------------------------------------

    updateMovingPortionsNorthSouth(newPortion)
    {
        let r = this.getMapPortionLimit();
        let i, j, k;
        if (newPortion[2] > this.currentPortion[2])
        {
            for (k = -r; k <= r; k++)
            {
                for (i = -r; i <= r; i++)
                {
                    j = -r;
                    this.removePortion(i, k, j);
                    for (; j < r; j++)
                    {
                        this.setPortion(i, k, j, i, k, j + 1);
                    }
                    this.loadPortionFromPortion(newPortion, i, k, r, true);
                }
            }
        } else if (newPortion[2] < this.currentPortion[2])
        {
            for (k = -r; k <= r; k++)
            {
                for (i = -r; i <= r; i++)
                {
                    j = r;
                    this.removePortion(i, k, j);
                    for (; j > -r; j--)
                    {
                        this.setPortion(i, k, j, i, k, j - 1);
                    }
                    this.loadPortionFromPortion(newPortion, i, k, -r, true);
                }
            }
        }
    }

    // -------------------------------------------------------

    updateMovingPortionsUpDown(newPortion)
    {
        let r = this.getMapPortionLimit();
        let i, j, k;
        if (newPortion[1] > this.currentPortion[1])
        {
            for (i = -r; i <= r; i++)
            {
                for (j = -r; j <= r; j++)
                {
                    k = -r;
                    this.removePortion(i, k, j);
                    for (; k < r; k++)
                    {
                        this.setPortion(i, k, j, i, k + 1, j);
                    }
                    this.loadPortionFromPortion(newPortion, i, r, j, true);
                }
            }
        } else if (newPortion[1] < this.currentPortion[1])
        {
            for (i = -r; i <= r; i++)
            {
                for (j = -r; j <= r; j++)
                {
                    k = r;
                    this.removePortion(i, k, j);
                    for (; k > -r; k--)
                    {
                        this.setPortion(i, k, j, i, k - 1, j);
                    }
                    this.loadPortionFromPortion(newPortion, i, -r, j, true);
                }
            }
        }
    }

    // -------------------------------------------------------

    updatePortions(base, callback)
    {
        let limit = this.getMapPortionLimit();
        let lx = Math.ceil(this.mapProperties.length / RPM.PORTION_SIZE);
        let lz = Math.ceil(this.mapProperties.width / RPM.PORTION_SIZE);
        let ld = Math.ceil(this.mapProperties.depth / RPM.PORTION_SIZE);
        let lh = Math.ceil(this.mapProperties.height / RPM.PORTION_SIZE);
        let i, j, k, x, y, z;
        for (i = -limit; i <= limit; i++)
        {
            for (j = -limit; j <= limit; j++)
            {
                for (k = -limit; k <= limit; k++)
                {
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

    update()
    {
        this.updateMovingPortions();

        // Update camera
        this.camera.update();

        // Update skybox
        if (this.previousCameraPosition)
        {
            let posDif = this.camera.threeCamera.position.clone().sub(this
                .previousCameraPosition);
            this.mapProperties.skyboxGeometry.translate(posDif.x, posDif.y, posDif.z);
            this.previousCameraPosition = this.camera.threeCamera.position.clone();
        }

        // Getting the Y angle of the camera
        let vector = new THREE.Vector3();
        this.camera.threeCamera.getWorldDirection(vector);
        let angle = Math.atan2(vector.x,vector.z) + (180 * Math.PI / 180.0);

        if (!this.isBattleMap) 
        {
            this.mapProperties.startupObject.update();

            // Update the objects
            RPM.game.hero.update(angle);
            this.updatePortions(this, function(x, y, z, i, j, k)
            {
                let objects = RPM.game.getPotionsDatas(this.id, x, y, z);
                let movedObjects = objects.min;
                let p, l;
                for (p = 0, l = movedObjects.length; p < l; p++)
                {
                    movedObjects[p].update(angle);
                }
                movedObjects = objects.mout;
                for (p = 0, l = movedObjects.length; p < l; p++)
                {
                    movedObjects[p].update(angle);
                }

                // Update face sprites
                let mapPortion = this.getMapPortion(i, j, k);
                if (mapPortion)
                {
                    mapPortion.updateFaceSprites(angle);
                }
            });
        }

        // Update scene game (interpreters)
        super.update(this);
    }

    // -------------------------------------------------------

    onKeyPressed(key)
    {
        if (!this.loading)
        {
            // Send keyPressEvent to all the objects
            if (!RPM.blockingHero && !this.isBattleMap)
            {
                EventCommandSendEvent.sendEvent(null, 0, 1, true, 3, [null,
                    SystemValue.createNumber(key), SystemValue.createSwitch(
                    false), SystemValue.createSwitch(false)], true);
            }
            super.onKeyPressed(key);
        }
    }

    // -------------------------------------------------------

    onKeyReleased(key)
    {
        if (!this.loading)
        {
            // Send keyReleaseEvent to all the objects
            if (!RPM.blockingHero && !this.isBattleMap)
            {
                EventCommandSendEvent.sendEvent(null, 0, 1, true, 4, [null,
                    SystemValue.createNumber(key)], true);
            }
            super.onKeyReleased(key);
        }
    }

    // -------------------------------------------------------

    onKeyPressedRepeat(key)
    {
        if (!this.loading)
        {
            if (!RPM.blockingHero && !this.isBattleMap)
            {
                EventCommandSendEvent.sendEvent(null, 0, 1, true, 3, [null,
                    SystemValue.createNumber(key), SystemValue.createSwitch(
                    true), SystemValue.createSwitch(true)], true);
            }
            return super.onKeyPressedRepeat(key);
        }
        return true;
    }

    // -------------------------------------------------------

    onKeyPressedAndRepeat(key)
    {
        if (!this.loading)
        {
            if (!RPM.blockingHero && !this.isBattleMap)
            {
                EventCommandSendEvent.sendEvent(null, 0, 1, true, 3, [null,
                    SystemValue.createNumber(key), SystemValue.createSwitch(true
                    ), SystemValue.createSwitch(false)], true);
            }
            super.onKeyPressedAndRepeat(key);
        }
    }

    // -------------------------------------------------------

    draw3D()
    {
        RPM.renderer.clear();
        if (this.mapProperties.sceneBackground !== null)
        {
            RPM.renderer.render(this.mapProperties.sceneBackground, this
                .mapProperties.cameraBackground);
        }
        RPM.renderer.render(this.scene, this.camera.threeCamera);
    }

    // -------------------------------------------------------
    /** Close the map
    */
    close()
    {
        let l = Math.ceil(this.mapProperties.length / RPM.PORTION_SIZE);
        let w = Math.ceil(this.mapProperties.width / RPM.PORTION_SIZE);
        let d = Math.ceil(this.mapProperties.depth / RPM.PORTION_SIZE);
        let h = Math.ceil(this.mapProperties.height / RPM.PORTION_SIZE);
        let objectsPortions = RPM.game.mapsDatas[this.id];
        let i, j, k, portion;
        for (i = 0; i < l; i++)
        {
            for (j = -d; j < h; j++)
            {
                for (k = 0; k < w; k++)
                {
                    portion = objectsPortions[i][j < 0 ? 0 : 1][Math.abs(j)][k];
                    portion.min = [];
                    portion.mout = [];
                    portion.m = [];
                    portion.r = [];
                }
            }
        }

        // Clear scene
        for (i = this.scene.children.length - 1; i >= 0; i--)
        {
            this.scene.remove(this.scene.children[i]);
        }
    }
}