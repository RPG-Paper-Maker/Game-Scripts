/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { THREE } from "../Globals";
import { Base } from "./Base";
import { Enum, Utils, Constants, IO, Paths } from "../Common";
import Orientation = Enum.Orientation;
import EffectSpecialActionKind = Enum.EffectSpecialActionKind;
import PictureKind = Enum.PictureKind;
import { System, Datas, Scene, Manager } from "../index";
import { Position, Portion, MapPortion, TextureBundle, Camera, ReactionInterpreter, Vector3, Player, Battler, Game } from "../Core";

/** @class
 *  A scene for a local map.
 *  @extends Scene.Base
 *  @param {number} id - The map ID
 *  @param {boolean} [isBattleMap=false] - Indicate if this map is a battle one
 *  @param {boolean} [minimal=false] - Indicate if the map should be partialy 
 *  loaded (only for getting objects infos)
*/
class Map extends Base {

    public static current: Scene.Map;
    public static allowMainMenu = true;
    public static allowSaves = true;

    public id: number;
    public mapName: string;
    public orientation: Orientation;
    public user: Battler;
    public isBattleMap: boolean;
    public tempTargets: any[];
    public targets: Battler[];
    public battleCommandKind: EffectSpecialActionKind;
    public mapProperties: System.MapProperties;
    public scene: THREE.Scene;
    public allObjects: Position[];
    public currentPortion: Portion;
    public mapPortions: MapPortion[];
    public textureTileset: THREE.ShaderMaterial;
    public texturesCharacters: THREE.ShaderMaterial[];
    public texturesAutotiles: TextureBundle[];
    public texturesWalls: THREE.ShaderMaterial[];
    public texturesMountains: TextureBundle[];
    public texturesObjects3D: THREE.ShaderMaterial[];
    public collisions: number[][][][];
    public previousCameraPosition: Vector3;
    public portionsObjectsUpdated: boolean;

    constructor(id: number, isBattleMap: boolean = false, minimal: boolean = 
        false)
    {
        super(false);

        this.id = id;
        this.isBattleMap = isBattleMap;
        this.mapName = Scene.Map.generateMapName(id);
        this.loading = false;
        if (!minimal) {
            this.loading = true;
            Utils.tryCatch(this.load, this);
        }
    }

    /** 
     *  Load async stuff.
     */
    async load() {
        Scene.Map.current = this;
        if (!this.isBattleMap) {
            Game.current.currentMapID = this.id;
        }
        this.scene = new THREE.Scene();

        // Adding meshes for collision
        this.collisions = new Array;
        if (Datas.Systems.showBB) {
            this.scene.add(Manager.Collisions.BB_BOX);
            this.scene.add(Manager.Collisions.BB_ORIENTED_BOX);
            //this.scene.add(Manager.collisions.BB_BOX_DETECTION);
            //this.scene.add(Manager.collisions.BB_BOX_DEFAULT_DETECTION);
        }
        await this.readMapProperties();
        this.initializeCamera();
        this.orientation = this.camera.getMapOrientation();
        await this.initializeObjects();
        this.initializePortionsObjects();
        await this.loadTextures();
        this.loadCollisions();
        await this.initializePortions();
        Manager.Stack.requestPaintHUD = true;
        this.loading = false;
    }

    /** 
     *  Generate the map name according to the ID.
     *  @static
     *  @param {number} id - ID of the map
     *  @returns {string}
     */
    static generateMapName(id: number): string {
        return "MAP" + Utils.formatNumber(id, 4);
    }

    /** 
     *  Read the map properties file.
     */
    async readMapProperties() {
        this.mapProperties = new System.MapProperties();
        let json = await IO.parseFileJSON(Paths.FILE_MAPS + this.mapName + Paths
            .FILE_MAP_INFOS);
        this.mapProperties.read(json);
    }

    /** 
     *  Initialize the map objects.
     */
    initializeCamera() {
        this.camera = new Camera(this.mapProperties.cameraProperties, Game
            .current.hero);
        this.camera.update();
        this.currentPortion = Portion.createFromVector3(this.camera
            .getThreeCamera().position);
        if (this.mapProperties.skyboxGeometry !== null) {
            this.previousCameraPosition = this.camera.getThreeCamera().position
                .clone();
            this.mapProperties.skyboxGeometry.translate(this.camera
                .getThreeCamera().position.x, this.camera.getThreeCamera()
                .position.y, this.camera.getThreeCamera().position.z);
        }
    }

    /** 
     *  Initialize the map objects.
     */
    async initializeObjects() {
        let json = (await IO.parseFileJSON(Paths.FILE_MAPS + this.mapName + 
            Paths.FILE_MAP_OBJECTS)).objs;
        let l = json.length;
        this.allObjects = new Array(l + 1);
        let jsonObject: Record<string, any>;
        for (let i = 0; i < l; i++) {
            jsonObject = json[i];
            this.allObjects[jsonObject.id] = Position.createFromArray(jsonObject
                .p);
        }
    }

    /** 
     *  Initialize all the objects moved or / and with changed states.
     */
    initializePortionsObjects() {
        let mapsDatas = Game.current.mapsDatas[this.id];
        let datas = null;
        let l = Math.ceil(this.mapProperties.length / Constants.PORTION_SIZE);
        let w = Math.ceil(this.mapProperties.width / Constants.PORTION_SIZE);
        let d = Math.ceil(this.mapProperties.depth / Constants.PORTION_SIZE);
        let h = Math.ceil(this.mapProperties.height / Constants.PORTION_SIZE);
        var objectsPortions = new Array(l);
        let i: number, j: number, jp: number, k: number, jabs: number;
        for (i = 0; i < l; i++) {
            objectsPortions[i] = new Array(2);
            objectsPortions[i][0] = new Array(d); // Depth
            objectsPortions[i][1] = new Array(h); // Height
            for (j = -d; j < h; j++) {
                jp = j < 0 ? 0 : 1;
                jabs = Math.abs(j);
                objectsPortions[i][jp][jabs] = new Array(w);
                for (k = 0; k < w; k++) {
                    datas = (mapsDatas) ? mapsDatas[i][jp][jabs][k] : null;
                    objectsPortions[i][jp][jabs][k] = {
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
        Game.current.mapsDatas[this.id] = objectsPortions;
        this.portionsObjectsUpdated = true;
    }

    /** 
     *  Load all the textures of the map.
     */
    async loadTextures() {
        let tileset = this.mapProperties.tileset;
        let path = tileset.getPath();
        this.textureTileset = path ? (await Manager.GL.loadTexture(path)) : 
            Manager.GL.loadTextureEmpty();
        this.texturesAutotiles = Datas.Tilesets.getTexturesAutotiles(tileset);
        this.texturesWalls = Datas.Tilesets.getTexturesWalls(tileset);
        this.texturesMountains = Datas.Tilesets.getTexturesMountains(tileset);
        this.texturesObjects3D = Datas.Tilesets.texturesObjects3D;
        this.texturesCharacters = Datas.Tilesets.texturesCharacters;
    }

    /** 
     *  Load the collisions settings.
     */
    loadCollisions() {
        // Tileset
        let texture = Manager.GL.getMaterialTexture(this.textureTileset);
        if (this.mapProperties.tileset.picture && texture) {
            this.mapProperties.tileset.picture.readCollisionsImage(texture.image);
        }

        // Characters
        let pictures = Datas.Pictures.getListByKind(PictureKind.Characters);
        let l = pictures.length;
        this.collisions[PictureKind.Characters] = new Array(l);
        let material: THREE.ShaderMaterial, image: HTMLImageElement, p: System
            .Picture;
        for (let i = 1; i < l; i++) {
            material = this.texturesCharacters[i];
            let texture = Manager.GL.getMaterialTexture(material);
            if (texture) {
                image = texture.image;
            }
            p = pictures[i];
            if (p) {
                p.readCollisionsImage(image);
                this.collisions[PictureKind.Characters][i] = p
                    .getSquaresForStates(image);
            } else {
                this.collisions[PictureKind.Characters][i] = null;
            }
        }

        // Autotiles
        this.loadSpecialsCollision(this.mapProperties.tileset.autotiles, 
            PictureKind.Autotiles, Datas.SpecialElements.autotiles);

        // Walls
        this.loadSpecialsCollision(this.mapProperties.tileset.walls, PictureKind
            .Walls, Datas.SpecialElements.walls);
    }

    /** 
     *  Initialize the map portions.
     */
    async initializePortions() {
        await this.loadPortions();

        // Hero initialize
        if (!this.isBattleMap) {
            Game.current.hero.changeState();

            // Start music and background sound
            this.mapProperties.music.playMusic();
            this.mapProperties.backgroundSound.playMusic();

            // Background color update
            this.updateBackgroundColor();
        }
    }

    /** 
     *  Get the portion file name.
     *  @param {boolean} noNewPortion - Indicate if the map portions array needs 
     *  to be initialized
     */
    async loadPortions(noNewPortion: boolean = false) {
        this.currentPortion = Portion.createFromVector3(this.camera
            .getThreeCamera().position);
        let limit = this.getMapPortionLimit();
        if (!noNewPortion) {
            this.mapPortions = [];
        }
        let i: number, j: number, k: number;
        for (i = -limit; i <= limit; i++) {
            for (j = -limit; j <= limit; j++) {
                for (k = -limit; k <= limit; k++) {
                    await this.loadPortion(this.currentPortion.x + i, this
                        .currentPortion.y + j, this.currentPortion.z + k, i, j, 
                        k);
                }
            }
        }
    }

    /** 
     *  Load a portion.
     *  @param {number} realX - The global x portion
     *  @param {number} realY - The global y portion
     *  @param {number} realZ - The global z portion
     *  @param {number} x - The local x portion
     *  @param {number} y - The local y portion
     *  @param {number} z - The local z portion
     *  @param {boolean} move - Indicate if the portion was moved or completely 
     *  loaded
     */
    async loadPortion(realX: number, realY: number, realZ: number, x: number, y: 
        number, z: number, move: boolean = false)
    {
        let lx = Math.ceil(this.mapProperties.length / Constants.PORTION_SIZE);
        let lz = Math.ceil(this.mapProperties.width / Constants.PORTION_SIZE);
        let ld = Math.ceil(this.mapProperties.depth / Constants.PORTION_SIZE);
        let lh = Math.ceil(this.mapProperties.height / Constants.PORTION_SIZE);
        let mapPortion = null;
        if (realX >= 0 && realX < lx && realY >= -ld && realY < lh &&
            realZ >= 0 && realZ < lz)
        {
            let portion = new Portion(realX, realY, realZ);
            let json = await IO.parseFileJSON(Paths.FILE_MAPS + this.mapName + 
                Constants.STRING_SLASH + portion.getFileName());
            if (json.hasOwnProperty("lands")) {
                mapPortion = new MapPortion(portion);
                mapPortion.read(json, this.id === Datas.Systems
                    .ID_MAP_START_HERO);
            }
        }
        this.setMapPortion(x, y, z, mapPortion, move);
    }

    /** 
     *  Load a portion from a portion.
     *  @param {Portion} portion - The portion
     *  @param {number} x - The local x portion
     *  @param {number} y - The local y portion
     *  @param {number} z - The local z portion
     *  @param {boolean} move - Indicate if the portion was moved or completely 
     *  loaded
    */
    async loadPortionFromPortion(portion: Portion, x: number, y: number, z: 
        number, move: boolean)
    {
        await this.loadPortion(portion.x + x, portion.y + y, portion.z + z, x, y
            , z, move);
    }

    /** 
     *  Remove a portion.
     *  @param {number} x - The local x portion
     *  @param {number} y - The local y portion
     *  @param {number} z - The local z portion
    */
    removePortion(x: number, y: number, z: number) {
        let mapPortion = this.getMapPortion(new Portion(x, y, z));
        if (mapPortion !== null) {
            mapPortion.cleanAll();
        }
    }

    /** 
     *  Set a portion.
     *  @param {number} i - The previous x portion
     *  @param {number} j - The previous y portion
     *  @param {number} k - The previous z portion
     *  @param {number} m - The new x portion
     *  @param {number} n - The new y portion
     *  @param {number} o - The new z portion
    */
    setPortion(i: number, j: number, k: number, m: number, n: number, o: number) {
        this.setMapPortion(i, j, k, this.getMapPortion(new Portion(m, n, o)), 
            true);
    }

    /** 
     *  Set a portion.
     *  @param {number} x - The local x portion
     *  @param {number} y - The local y portion
     *  @param {number} z - The local z portion
     *  @param {MapPortion} mapPortion - The new map portion
     *  @param {boolean} move - Indicate if the portion was moved or completely 
     *  loaded
    */
    setMapPortion(x: number, y: number, z: number, mapPortion: MapPortion, move: 
        boolean)
    {
        let index = this.getPortionIndex(new Portion(x, y, z));
        let currentMapPortion = this.mapPortions[index];
        if (currentMapPortion && !move) {
            currentMapPortion.cleanAll();
        }
        this.mapPortions[index] = mapPortion;
    }

    /** 
     *  Get the objects at a specific portion.
     *  @param {Portion} portion
     *  @returns {Record<string, any>}
     */
    getObjectsAtPortion(portion: Portion): Record<string, any> {
        return Game.current.getPotionsDatas(this.id, portion);
    }

    /** 
     *  Get a map portion at local postions.
     *  @param {number} x - The local x portion
     *  @param {number} y - The local y portion
     *  @param {number} z - The local z portion
     *  @returns {MapPortion}
    */
    getMapPortion(portion: Portion): MapPortion {
        return this.getBrutMapPortion(this.getPortionIndex(portion));
    }

    /** 
     *  Get a map portion at json position.
     *  @param {Position} position - The position
     *  @returns {MapPortion}
     */
    getMapPortionByPosition(position: Position): MapPortion {
        return this.getMapPortion(this.getLocalPortion(position.getGlobalPortion()));        
    }

    /** 
     *  Get map portion according to portion index.
     *  @param {number} index - The portion index
     *  @returns {MapPortion}
     */
    getBrutMapPortion(index: number): MapPortion {
        return this.mapPortions[index];
    }

    /** 
     *  Get portion index according to local position.
     *  @param {Portion} portion - The local portion
     *  @returns {number}
    */
    getPortionIndex(portion: Portion): number {
        let size = this.getMapPortionSize();
        let limit = this.getMapPortionLimit();
        return ((portion.x + limit) * size * size) + ((portion.y + limit) * size
            ) + (portion.z + limit);
    }

    /** 
     *  Set a local portion with a global portion.
     *  @param {Portion} portion - The global portion
     *  @returns {Portion}
     */
    getLocalPortion(portion: Portion): Portion {
        return new Portion(
            portion.x - this.currentPortion.x,
            portion.y - this.currentPortion.y,
            portion.z - this.currentPortion.z
        );
    }

    /** 
     *  Get the map portion limit.
     *  @returns {number}
     */
    getMapPortionLimit(): number {
        return Datas.Systems.PORTIONS_RAY_NEAR + Constants.PORTIONS_RAY_FAR;
    }

    /** 
     *  Get the map portions size.
     *  @returns {number}
     */
    getMapPortionSize(): number {
        return (this.getMapPortionLimit() * 2) + 1;
    }

    /** 
     *  Get the map portion total size.
     *  @returns {number}
     */
    getMapPortionTotalSize(): number {
        let size = this.getMapPortionSize();
        return size * size * size;
    }

    /** 
     *  Check if a local portion if in the limit
     *  @param {Portion} portion - The local portion
     *  @returns {boolean}
    */
    isInPortion(portion: Portion): boolean {
        let limit = this.getMapPortionLimit();
        return (portion.x >= -limit && portion.x <= limit && portion.y >= -limit 
            && portion.y <= limit && portion.z >= -limit && portion.z <= limit);
    }

    /** 
     *  Check if a position is in the map.
     *  @param {Position} position - The json position
     *  @returns {boolean}
     */
    isInMap(position: Position): boolean {
        return (position.x >= 0 && position.x < this.mapProperties.length &&
            position.z >= 0 && position.z < this.mapProperties.width);
    }

    /** 
     *  Get the hero position according to battle map.
     *  @returns {Vector3} 
     */
    getHeroPosition() {
        return this.isBattleMap ? Game.current.heroBattle.position : 
            Game.current.hero.position;
    }

    /** 
     *  Update the background color.
     */
    updateBackgroundColor() {
        this.mapProperties.updateBackgroundColor();
        Manager.GL.updateBackgroundColor(this.mapProperties.backgroundColor);
    }

    /** 
     *  Load collision for special elements.
     *  @param {number[]} list - The IDs list
     *  @param {PictureKind} kind - The picture kind
     *  @param {SpecialElement[]} specials - The specials list
    */
    loadSpecialsCollision(list: number[], kind: PictureKind, specials: System
        .SpecialElement[])
    {
        let special: System.SpecialElement, picture: System.Picture;
        for (let i = 0, l = list.length; i < l; i++) {
            special = specials[list[i]];
            if (special) {
                picture = Datas.Pictures.get(kind, special.pictureID);
                if (picture) {
                    picture.readCollisions();
                }
            }
        }
    }

    /** 
     *  Update moving portions.
     */
    updateMovingPortions() {
        let newPortion = Portion.createFromVector3(this.camera.getThreeCamera()
            .position);
        if (!newPortion.equals(this.currentPortion)) {
            this.updateMovingPortionsEastWest(newPortion);
            this.updateMovingPortionsNorthSouth(newPortion);
            this.updateMovingPortionsUpDown(newPortion);
        }
        this.currentPortion = newPortion;
    }

    /** 
     *  Update moving portions for east and west.
     */
    updateMovingPortionsEastWest(newPortion: Portion) {
        let r = this.getMapPortionLimit();
        let i: number, j: number, k: number;
        if (newPortion.x > this.currentPortion.x) {
            for (k = -r; k <= r; k++) {
                for (j = -r; j <= r; j++) {
                    i = -r;
                    this.removePortion(i, k, j);
                    for (; i < r; i++) {
                        this.setPortion(i, k, j, i + 1, k, j);
                    }
                    this.loadPortionFromPortion(newPortion, r, k, j, true);
                }
            }
        } else if (newPortion.x < this.currentPortion.x) {
            for (k = -r; k <= r; k++) {
                for (j = -r; j <= r; j++) {
                    i = r;
                    this.removePortion(i, k, j);
                    for (; i > -r; i--) {
                        this.setPortion(i, k, j, i - 1, k, j);
                    }
                    this.loadPortionFromPortion(newPortion, -r, k, j, true);
                }
            }
        }
    }

    /** 
     *  Update moving portions for north and south.
     */
    updateMovingPortionsNorthSouth(newPortion: Portion) {
        let r = this.getMapPortionLimit();
        let i: number, j: number, k: number;
        if (newPortion.z > this.currentPortion.z) {
            for (k = -r; k <= r; k++) {
                for (i = -r; i <= r; i++) {
                    j = -r;
                    this.removePortion(i, k, j);
                    for (; j < r; j++) {
                        this.setPortion(i, k, j, i, k, j + 1);
                    }
                    this.loadPortionFromPortion(newPortion, i, k, r, true);
                }
            }
        } else if (newPortion.z < this.currentPortion.z) {
            for (k = -r; k <= r; k++) {
                for (i = -r; i <= r; i++) {
                    j = r;
                    this.removePortion(i, k, j);
                    for (; j > -r; j--) {
                        this.setPortion(i, k, j, i, k, j - 1);
                    }
                    this.loadPortionFromPortion(newPortion, i, k, -r, true);
                }
            }
        }
    }

    /** 
     *  Update moving portions for up and down
     */
    updateMovingPortionsUpDown(newPortion: Portion) {
        let r = this.getMapPortionLimit();
        let i: number, j: number, k: number;
        if (newPortion.y > this.currentPortion.y) {
            for (i = -r; i <= r; i++) {
                for (j = -r; j <= r; j++) {
                    k = -r;
                    this.removePortion(i, k, j);
                    for (; k < r; k++) {
                        this.setPortion(i, k, j, i, k + 1, j);
                    }
                    this.loadPortionFromPortion(newPortion, i, r, j, true);
                }
            }
        } else if (newPortion.y < this.currentPortion.y) {
            for (i = -r; i <= r; i++) {
                for (j = -r; j <= r; j++) {
                    k = r;
                    this.removePortion(i, k, j);
                    for (; k > -r; k--) {
                        this.setPortion(i, k, j, i, k - 1, j);
                    }
                    this.loadPortionFromPortion(newPortion, i, -r, j, true);
                }
            }
        }
    }

    /** 
     *  Update portions according to a callback.
     */
    updatePortions(base: Object, callback: Function) {
        let limit = this.getMapPortionLimit();
        let lx = Math.ceil(this.mapProperties.length / Constants.PORTION_SIZE);
        let lz = Math.ceil(this.mapProperties.width / Constants.PORTION_SIZE);
        let ld = Math.ceil(this.mapProperties.depth / Constants.PORTION_SIZE);
        let lh = Math.ceil(this.mapProperties.height / Constants.PORTION_SIZE);
        let i: number, j: number, k: number, x: number, y: number, z: number;
        for (i = -limit; i <= limit; i++) {
            for (j = -limit; j <= limit; j++) {
                for (k = -limit; k <= limit; k++) {
                    x = this.currentPortion.x + i;
                    y = this.currentPortion.y + j;
                    z = this.currentPortion.z + k;
                    if (x >= 0 && x < lx && y >= -ld && y < lh && z >= 0 &&
                        z < lz)
                    {
                        callback.call(base, x, y, z, i, j, k);
                    }
                }
            }
        }
    }

    /** 
     *  Update the scene.
     */
    update() {
        this.updateMovingPortions();

        // Update camera
        this.camera.update();

        // Update skybox
        if (this.previousCameraPosition) {
            let posDif = this.camera.getThreeCamera().position.clone().sub(this
                .previousCameraPosition);
            this.mapProperties.skyboxGeometry.translate(posDif.x, posDif.y, 
                posDif.z);
            this.previousCameraPosition = this.camera.getThreeCamera().position
                .clone();
        }

        // Getting the Y angle of the camera
        let vector = new Vector3();
        this.camera.getThreeCamera().getWorldDirection(vector);
        let angle = Math.atan2(vector.x,vector.z) + (180 * Math.PI / 180.0);
        if (!this.isBattleMap) {
            this.mapProperties.startupObject.update();

            // Update the objects
            Game.current.hero.update(angle);
            this.updatePortions(this, function(x: number, y: number, z: number, 
                i: number, j: number, k: number)
            {
                let objects = Game.current.getPotionsDatas(this.id, new 
                    Portion(x, y, z));
                let movedObjects = objects.min;
                let p: number, l: number;
                for (p = 0, l = movedObjects.length; p < l; p++) {
                    movedObjects[p].update(angle);
                }
                movedObjects = objects.mout;
                for (p = 0, l = movedObjects.length; p < l; p++) {
                    movedObjects[p].update(angle);
                }

                // Update face sprites
                let mapPortion = this.getMapPortion(new Portion(i, j, k));
                if (mapPortion) {
                    mapPortion.updateFaceSprites(angle);
                }
            });
        }

        // Update scene game (interpreters)
        super.update();
    }

    /** 
     *  Handle scene key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: number) {
        if (!this.loading) {
            // Send keyPressEvent to all the objects
            if (!ReactionInterpreter.blockingHero && !this.isBattleMap) {
                Manager.Events.sendEvent(null, 0, 1, true, 3, [null,
                    System.DynamicValue.createNumber(key), System.DynamicValue
                    .createSwitch(false), System.DynamicValue.createSwitch(false
                    )], true);
            }
            super.onKeyPressed(key);
        }
    }

    /** 
     *  Handle scene key released.
     *  @param {number} key - The key ID
     */
    onKeyReleased(key: number) {
        if (!this.loading) {
            // Send keyReleaseEvent to all the objects
            if (!ReactionInterpreter.blockingHero && !this.isBattleMap) {
                Manager.Events.sendEvent(null, 0, 1, true, 4, [null,
                    System.DynamicValue.createNumber(key)], true);
            }
            super.onKeyReleased(key);
        }
    }

    /** 
     *  Handle scene pressed repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeat(key: number): boolean {
        if (!this.loading) {
            if (!ReactionInterpreter.blockingHero && !this.isBattleMap) {
                Manager.Events.sendEvent(null, 0, 1, true, 3, [null,
                    System.DynamicValue.createNumber(key), System.DynamicValue
                    .createSwitch(true), System.DynamicValue.createSwitch(true)]
                    , true);
            }
            return super.onKeyPressedRepeat(key);
        }
        return true;
    }

    /** 
     *  Handle scene pressed and repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key: number): boolean {
        if (!this.loading) {
            if (!ReactionInterpreter.blockingHero && !this.isBattleMap) {
                Manager.Events.sendEvent(null, 0, 1, true, 3, [null,
                    System.DynamicValue.createNumber(key), System.DynamicValue
                    .createSwitch(true), System.DynamicValue.createSwitch(false)
                    ], true);
            }
            super.onKeyPressedAndRepeat(key);
        }
        return true;
    }

    /** 
     *  Draw the 3D scene.
     */
    draw3D() {
        Manager.GL.renderer.clear();
        if (this.mapProperties.sceneBackground !== null) {
            Manager.GL.renderer.render(this.mapProperties.sceneBackground, this
                .mapProperties.cameraBackground);
        }
        Manager.GL.renderer.render(this.scene, this.camera.getThreeCamera());
    }

    /** 
     *  Close the map.
     */
    close() {
        let l = Math.ceil(this.mapProperties.length / Constants.PORTION_SIZE);
        let w = Math.ceil(this.mapProperties.width / Constants.PORTION_SIZE);
        let d = Math.ceil(this.mapProperties.depth / Constants.PORTION_SIZE);
        let h = Math.ceil(this.mapProperties.height / Constants.PORTION_SIZE);
        let objectsPortions = Game.current.mapsDatas[this.id];
        let i: number, j: number, k: number, portion: Record<string, any>;
        for (i = 0; i < l; i++) {
            for (j = -d; j < h; j++) {
                for (k = 0; k < w; k++) {
                    portion = objectsPortions[i][j < 0 ? 0 : 1][Math.abs(j)][k];
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

        // Clear bounding boxes
        Manager.Collisions.applyBoxSpriteTransforms(Manager.Collisions.BB_BOX, 
            [0, 0, 0, 1, 1, 1, 0, 0, 0]);
        Manager.Collisions.applyOrientedBoxTransforms(Manager.Collisions
            .BB_ORIENTED_BOX, [0, 0, 0, 2, 1]);
    }
}

export { Map }