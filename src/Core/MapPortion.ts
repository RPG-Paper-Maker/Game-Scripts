/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { THREE } from "../Globals";
import { Portion } from "./Portion";
import { MapObject } from "./MapObject";
import { Position } from "./Position";
import { System, Datas, Manager, Scene } from "../index";
import { StructMapElementCollision } from "./MapElement";
import { Constants, Enum, Platform, Utils } from "../Common";
import { Floor } from "./Floor";
import { Autotiles } from "./Autotiles";
import { Autotile } from "./Autotile";
import { TextureBundle } from "./TextureBundle";
import { Sprite } from "./Sprite";
import ElementMapKind = Enum.ElementMapKind;
import ShapeKind = Enum.ShapeKind;
import { SpriteWall } from "./SpriteWall";
import { Mountains } from "./Mountains";
import { Mountain } from "./Mountain";
import { Object3DBox } from "./Object3DBox";
import { Object3DCustom } from "./Object3DCustom";
import { Object3D } from "./Object3D";
import { Vector3 } from "./Vector3";
import { Game } from "./Game";
import { CustomGeometry } from "./CustomGeometry";
import { CustomGeometryFace } from "./CustomGeometryFace";

/** @class
 *  A portion of the map.
 *  @param {Portion} portion
*/
class MapPortion {

    public portion: Portion;
    public staticFloorsMesh: THREE.Mesh;
    public staticSpritesMesh: THREE.Mesh;
    public faceSpritesMesh: THREE.Mesh;
    public squareNonEmpty: number[][][];
    public boundingBoxesLands: StructMapElementCollision[][];
    public boundingBoxesSprites: StructMapElementCollision[][];
    public boundingBoxesMountains: StructMapElementCollision[][];
    public boundingBoxesObjects3D: StructMapElementCollision[][];
    public staticAutotilesList: Autotiles[][];
    public staticMountainsList: Mountains[];
    public objectsList: MapObject[];
    public staticWallsList: THREE.Mesh[];
    public staticObjects3DList: THREE.Mesh[];
    public overflowMountains: Position[];
    public heroID: number;

    constructor(portion: Portion) {
        this.portion = portion;
        this.staticFloorsMesh = null;
        this.staticSpritesMesh = null;
        this.faceSpritesMesh = null;
        this.squareNonEmpty = new Array(Constants.PORTION_SIZE * Constants
            .PORTION_SIZE);
        let i: number, j: number;
        for (i = 0; i < Constants.PORTION_SIZE; i++) {
            this.squareNonEmpty[i] = new Array(Constants.PORTION_SIZE);
            for (j = 0; j < Constants.PORTION_SIZE; j++) {
                this.squareNonEmpty[i][j] = new Array;
            }
        }
        let l = Constants.PORTION_SIZE * Constants.PORTION_SIZE * Constants
            .PORTION_SIZE;
        this.boundingBoxesLands = new Array(l);
        this.boundingBoxesSprites = new Array(l);
        this.boundingBoxesMountains = new Array(l);
        this.boundingBoxesObjects3D = new Array(l);
        for (i = 0; i < l; i++) {
            this.boundingBoxesLands[i] = new Array;
            this.boundingBoxesSprites[i] = new Array;
            this.boundingBoxesMountains[i] = new Array;
            this.boundingBoxesObjects3D[i] = new Array;
        }
        this.staticAutotilesList = new Array;
        this.staticMountainsList = new Array;
        this.objectsList = new Array;
        this.staticWallsList = new Array;
        this.staticObjects3DList = new Array;
        this.overflowMountains = new Array;
        this.heroID = -1;
    }

    /** 
     *  Read the JSON associated to the map portion.
     *  @param {Record<string, any>} json - object describing the map portion
     *  @param {boolean} isMapHero - Indicates if this map is where the hero is
     *  at the beginning of the game.
     */
    read(json: Record<string, any>, isMapHero: boolean) {
        this.readStatic(json);
        this.readObjects(json.objs.list, isMapHero);
    }

    /** 
     *  Read the JSON associated to the map portion, but only the static part.
     *  @param {Record<string, any>} json - object describing the map portion
     */
    readStatic(json: Record<string, any>) {
        this.readLands(json.lands);
        this.readSprites(json.sprites);
        if (json.moun) {
            this.readMountains(json.moun);
        }
        if (json.objs3d) {
            this.readObjects3D(json.objs3d);
        }
    }

    /** 
     *  Read the JSON associated to the lands in the portion.
     *  @param {Record<string, any>} json - object describing the lands
     */
    readLands(json: Record<string, any>) {
        this.readFloors(json.floors);
        this.readAutotiles(json.autotiles);
    }

    /** 
     *  Read the JSON associated to the floors in the portion.
     *  @param {Record<string, any>} json - Json object describing the floors
     */
    readFloors(json: Record<string, any>) {
        const material = Scene.Map.current.textureTileset;
        let texture = Manager.GL.getMaterialTexture(material);
        let width = texture ? texture.image.width : 0;
        let height = texture ? texture.image.height : 0;
        let geometry = new CustomGeometry();
        let layers: [Position, Floor][] = [];
        let count = 0;
        let i: number, j: number, l: number, m: number, jsonFloor: Record<string
            , any>, position: Position, layer: number, floor: Floor, 
            objCollision: StructMapElementCollision, index: number;
        for (i = 0, l = json.length; i < l; i++) {
            jsonFloor = json[i];
            position = Position.createFromArray(jsonFloor.k);
            layer = position.layer;
            floor = new Floor(jsonFloor.v);
            if (layer > 0) {
                for (j = 0, m = layers.length; j < m; j++) {
                    if (layer <= layers[j][0].layer) {
                        layers.splice(j, 0, [position, floor]);
                        break;
                    }
                }
                if (j === m) {
                    layers.push([position, floor]);
                }
            } else {
                objCollision = floor.updateGeometry(geometry, position, width, 
                    height, count);
                index = position.toIndex();
                this.boundingBoxesLands[index].push(objCollision);
                this.addToNonEmpty(position);
                count++;
            }
        }

        // Draw layers separatly
        for (i = 0, l = layers.length; i < l; i++) {
            position = layers[i][0];
            floor = layers[i][1];
            objCollision = floor.updateGeometry(geometry, position, width, 
                height, count);
            index = position.toIndex();
            if (objCollision !== null) {
                this.boundingBoxesLands[index].push(objCollision);
            }
            this.addToNonEmpty(position);
            count++;
        }

        // Creating the plane
        if (!geometry.isEmpty()) {
            geometry.updateAttributes();
            this.staticFloorsMesh = new THREE.Mesh(geometry, material);
            this.staticFloorsMesh.renderOrder = 0;
            if (Scene.Map.current.mapProperties.isSunLight) {
                this.staticFloorsMesh.receiveShadow = true;
                this.staticFloorsMesh.castShadow = true;
                this.staticFloorsMesh.customDepthMaterial = material.userData.customDepthMaterial;
            }
            Scene.Map.current.scene.add(this.staticFloorsMesh);
        }
    }

    /** 
     *  Read the JSON associated to the autotiles in the portion.
     *  @param {Record<string, any>} json - Json object describing the autotiles
     */
    readAutotiles(json: Record<string, any>) {
        if (!json) {
            return;
        }
        let texture: TextureBundle = null;

        // Create autotiles according to the textures
        let i: number, l: number, texturesAutotile: TextureBundle[];
        for (i = 0, l = Scene.Map.current.texturesAutotiles.length; i < l; i++) {
            texturesAutotile = Scene.Map.current.texturesAutotiles[i];
            if (texturesAutotile) {
                for (let textureAutotile of texturesAutotile) {
                    if (!this.staticAutotilesList[i]) {
                        this.staticAutotilesList[i] = new Array;
                    }
                    this.staticAutotilesList[i].push(new Autotiles(textureAutotile));
                }
            }
        }

        // Read and update geometry
        let j: number, m: number, jsonAutotile: Record<string, any>, position: Position, 
            autotile: Autotile, indexPos: number, textureAutotile: TextureBundle, 
            autotiles: Autotiles, objCollision: StructMapElementCollision;
        for (i = 0, l = json.length; i < l; i++) {
            jsonAutotile = json[i];
            position = Position.createFromArray(jsonAutotile.k);
            autotile = new Autotile(jsonAutotile.v);
            let pictureID = Game.current.textures.autotiles[autotile.autotileID];
            if (pictureID === undefined) {
                pictureID = Datas.SpecialElements.getAutotile(autotile.autotileID).pictureID;
            }
            indexPos = position.toIndex();
            texture = null;
            texturesAutotile = Scene.Map.current.texturesAutotiles[autotile.autotileID];
            if (texturesAutotile) {
                for (j = 0, m = texturesAutotile.length; j < m; j++) {
                    textureAutotile = texturesAutotile[j];
                    if (textureAutotile.isInTexture(pictureID, autotile.texture))
                    {
                        texture = textureAutotile;
                        autotiles = this.staticAutotilesList[autotile.autotileID][j];
                        break;
                    }
                }
            }
            if (texture !== null && texture.material !== null) {
                objCollision = autotiles.updateGeometry(position, autotile, pictureID);
                if (objCollision !== null) {
                    this.boundingBoxesLands[indexPos].push(objCollision);
                }
            }
            this.addToNonEmpty(position);
        }

        // Update all the geometry uvs and put it in the scene
        for (let list of this.staticAutotilesList) {
            if (list) {
                for (autotiles of list) {
                    if (autotiles.createMesh()) {
                        if (Scene.Map.current.mapProperties.isSunLight) {
                            autotiles.mesh.receiveShadow = true;
                            autotiles.mesh.castShadow = true;
                            autotiles.mesh.customDepthMaterial = autotiles.bundle
                                .material.userData.customDepthMaterial;
                        }
                        Scene.Map.current.scene.add(autotiles.mesh);
                    }
                }
            }
        }
    }

    /** 
     *  Read the JSON associated to the sprites in the portion.
     *  @param {Record<string, any>} json - Json object describing the sprites
     */
    readSprites(json: Record<string, any>) {
        this.readSpritesWalls(json.walls);
        this.readSpritesGlobals(json.list);
    }

    /** Read the JSON associated to the sprites globals in the portion.
     *  @param {Record<string, any>} json - Json object describing the sprites globals
    */
    readSpritesGlobals(json: Record<string, any>) {
        const material = Scene.Map.current.textureTileset;
        let staticGeometry = new CustomGeometry();
        let faceGeometry = new CustomGeometryFace();
        let staticCount = 0, faceCount = 0;
        let texture = Manager.GL.getMaterialTexture(material);
        if (texture) {
            let s: Record<string, any>, position: Position, sprite: Sprite, 
                localPosition: Vector3, collisions: StructMapElementCollision[],
                resultUpdate: [number, StructMapElementCollision[]];
            for (let i = 0, l = json.length; i < l; i++) {
                s = json[i];
                position = Position.createFromArray(s.k);
                sprite = new Sprite(s.v);
                localPosition = position.toVector3();
                if (sprite.kind === ElementMapKind.SpritesFace) {
                    resultUpdate = sprite.updateGeometry(faceGeometry, texture.image
                        .width, texture.image.height, position, faceCount, true, 
                        localPosition);
                    faceCount = resultUpdate[0];
                    collisions = resultUpdate[1];
                } else {
                    resultUpdate = sprite.updateGeometry(staticGeometry, texture
                        .image.width, texture.image.height, position, staticCount, 
                        true, localPosition);
                    staticCount = resultUpdate[0];
                    collisions = resultUpdate[1];
                }
                position.x += sprite.xOffset;
                position.y += sprite.yOffset;
                position.z += sprite.zOffset;
                this.updateCollisionSprite(collisions, position);
            }
        }
        if (!staticGeometry.isEmpty()) {
            staticGeometry.updateAttributes();
            this.staticSpritesMesh = new THREE.Mesh(staticGeometry, material);
            this.staticSpritesMesh.renderOrder = 999;
            if (Scene.Map.current.mapProperties.isSunLight) {
                this.staticSpritesMesh.receiveShadow = true;
                this.staticSpritesMesh.castShadow = true;
                this.staticSpritesMesh.customDepthMaterial = material.userData.customDepthMaterial;
            }
            Scene.Map.current.scene.add(this.staticSpritesMesh);
        }
        if (!faceGeometry.isEmpty()) {
            faceGeometry.updateAttributes();
            this.faceSpritesMesh = new THREE.Mesh(faceGeometry, material);
            this.faceSpritesMesh.renderOrder = 999;
            if (Scene.Map.current.mapProperties.isSunLight) {
                this.faceSpritesMesh.castShadow = true;
                this.faceSpritesMesh.receiveShadow = true;
                this.faceSpritesMesh.customDepthMaterial = material.userData.customDepthMaterial;
            }
            Scene.Map.current.scene.add(this.faceSpritesMesh);
        }
    }

    /** 
     *  Read the JSON associated to the sprites walls in the portion.
     *  @param {Record<string, any>} json - Json object describing the sprites 
     *  walls
     */
    readSpritesWalls(json: Record<string, any>) {
        let wallsIds = Scene.Map.current.texturesWalls.length;
        let hash = new Array(wallsIds);

        // Initialize all walls to null
        let i: number;
        for (i = 0; i < wallsIds; i++) {
            hash[i] = null;
        }
        let l: number, s: Record<string, any>, position: Position, sprite: 
            SpriteWall, obj: Record<string, any>, geometry: CustomGeometry, 
            material: THREE.MeshPhongMaterial, count: number, result: [number, 
            StructMapElementCollision[]];
        for (i = 0, l = json.length; i < l; i++) {
            // Getting sprite
            s = json[i];
            position = Position.createFromArray(s.k);
            sprite = new SpriteWall(s.v);
            let pictureID = Game.current.textures.walls[sprite.id];
            if (pictureID === undefined) {
                pictureID = Datas.SpecialElements.getWall(sprite.id).pictureID;
            }

            // Constructing the geometry
            obj = hash[sprite.id];
            // If ID exists in this tileset
            if (!Utils.isUndefined(obj)) {
                if (obj === null) {
                    material = Scene.Map.current.texturesWalls[sprite.id];
                    if (material) {
                        geometry = new CustomGeometry();
                        count = 0;
                        obj = {
                            geometry: geometry,
                            material: material,
                            c: count
                        };
                        hash[sprite.id] = obj;
                    }
                } else {
                    geometry = obj.geometry;
                    material = obj.material;
                    count = obj.c;
                }
                let texture = Manager.GL.getMaterialTexture(material);
                if (texture) {
                    result = sprite.updateGeometry(geometry, position, texture
                        .image.width, texture.image.height, pictureID, count);
                    obj.c = result[0];
                    this.updateCollisionSprite(result[1], position);
                }
            }
        }

        // Add to scene
        let mesh: THREE.Mesh;
        for (i = 0; i < wallsIds; i++) {
            obj = hash[i];
            if (obj !== null) {
                geometry = obj.geometry;
                if (!geometry.isEmpty()) {
                    geometry.updateAttributes();
                    mesh = new THREE.Mesh(geometry, obj.material);
                    if (Scene.Map.current.mapProperties.isSunLight) {
                        mesh.receiveShadow = true;
                        mesh.castShadow = true;
                        mesh.customDepthMaterial = obj.material.userData.customDepthMaterial;
                    }
                    mesh.layers.enable(1);
                    this.staticWallsList.push(mesh);
                    Scene.Map.current.scene.add(mesh);
                }
            }
        }
    }

    /** 
     *  Read the JSON associated to the mountains in the portion.
     *  @param {Record<string, any>} json - Json object describing the mountains
     */
    readMountains(json: Record<string, any>) {
        if (!json) {
            return;
        }
        let texture: TextureBundle = null;
        let mountainsLength = Scene.Map.current.texturesMountains.length;

        // Create mountains according to the textures
        let i: number;
        for (i = 0; i < mountainsLength; i++) {
            this.staticMountainsList.push(new Mountains(Scene.Map.current
                .texturesMountains[i]));
        }

        // Read and update geometry
        let jsonAll = json.a;
        let l: number, jsonMountain: Record<string, any>, position: Position, 
            mountain: Mountain, indexPos: number, index: number, textureMountain
            : TextureBundle, mountains: Mountains, objCollision: 
            StructMapElementCollision[];
        for (i = 0, l = jsonAll.length; i < l; i++) {
            jsonMountain = jsonAll[i];
            position = Position.createFromArray(jsonMountain.k);
            mountain = new Mountain;
            mountain.read(jsonMountain.v);
            let pictureID = Game.current.textures.mountains[mountain.mountainID];
            if (pictureID === undefined) {
                pictureID = Datas.SpecialElements.getMountain(mountain.mountainID)
                    .pictureID;
            }
            indexPos = position.toIndex();
            for (index = 0; index < mountainsLength; index++) {
                textureMountain = Scene.Map.current.texturesMountains[index];
                if (textureMountain.isInTexture(pictureID)) {
                    texture = textureMountain;
                    mountains = this.staticMountainsList[index];
                    break;
                }
            }
            if (texture !== null && texture.material !== null) {
                objCollision = mountains.updateGeometry(position, mountain, pictureID);
                this.updateCollision(this.boundingBoxesMountains, objCollision,
                    position, true);
            }
        }

        // Update all the geometry uvs and put it in the scene
        for (i = 0, l = this.staticMountainsList.length; i < l; i++) {
            mountains = this.staticMountainsList[i];
            if (mountains.createMesh()) {
                if (Scene.Map.current.mapProperties.isSunLight) {
                    mountains.mesh.receiveShadow = true;
                    mountains.mesh.castShadow = true;
                    mountains.mesh.customDepthMaterial = mountains.bundle.material
                        .userData.customDepthMaterial;
                }
                mountains.mesh.layers.enable(1);
                Scene.Map.current.scene.add(mountains.mesh);
            }
        }

        // Handle overflow
        jsonMountain = json.o;
        for (i = 0, l = jsonMountain.length; i < l; i++) {
            this.overflowMountains.push(Position.createFromArray(jsonMountain[i]));
        }
    }

    /** 
     *  Read the JSON associated to the objects 3D in the portion.
     *  @param {Record<string, any>} json - Json object describing the objects 3D
    */
    readObjects3D(json: Record<string, any>) {
        // Initialize
        let nbTextures = Scene.Map.current.texturesObjects3D.length;
        let hash: Record<string, any>[] = new Array(nbTextures);
        let i: number;
        for (i = 1; i <= nbTextures; i++) {
            hash[i] = null;
        }

        // Read all
        let jsonAll = json.a;
        let l = jsonAll.length;
        let o: Record<string, any>, position: Position, v: Record<string, any>, 
            datas: System.Object3D, obj3D: Object3D, obj: Record<string, any>, 
            geometry: CustomGeometry, material: THREE.MeshPhongMaterial, count: 
            number, result: [number, StructMapElementCollision[]];
        for (i = 0; i < l; i++) {
            // Getting object 3D
            o = jsonAll[i];
            position = Position.createFromArray(o.k);
            v = o.v;
            datas = Datas.SpecialElements.getObject3D(v.did);
            let pictureID = Game.current.textures.objects3D[datas.id];
            if (pictureID === undefined) {
                pictureID = Datas.SpecialElements.getObject3D(datas.id)
                    .pictureID;
            }
            if (datas) {
                switch (datas.shapeKind) {
                    case ShapeKind.Box:
                        obj3D = new Object3DBox(v, datas);
                        break;
                    case ShapeKind.Sphere:
                        break;
                    case ShapeKind.Cylinder:
                        break;
                    case ShapeKind.Cone:
                        break;
                    case ShapeKind.Capsule:
                        break;
                    case ShapeKind.Custom:
                        obj3D = new Object3DCustom(v, datas);
                        break;
                }

                // Constructing the geometry
                obj = hash[datas.id];
                if (!Utils.isUndefined(obj)) {
                    if (obj === null) {
                        material = Scene.Map.current.texturesObjects3D[datas.id];
                        if (material) {
                            geometry = new CustomGeometry();
                            count = 0;
                            obj = {
                                geometry: geometry,
                                material: material,
                                c: count
                            };
                            hash[datas.id] = obj;
                        }
                    } else {
                        geometry = obj.geometry;
                        material = obj.material;
                        count = obj.c;
                    }
                    if (Manager.GL.getMaterialTexture(material)) {
                        result = obj3D.updateGeometry(geometry, position, count);
                        obj.c = result[0];
                        this.updateCollision(this.boundingBoxesObjects3D, result
                            [1], position, datas.shapeKind === ShapeKind.Custom);
                    }
                }
            }
        }

        // Add meshes
        let mesh: THREE.Mesh;
        for (i = 1; i <= nbTextures; i++) {
            obj = hash[i];
            if (obj !== null) {
                geometry = obj.geometry;
                if (!geometry.isEmpty()) {
                    geometry.updateAttributes();
                    mesh = new THREE.Mesh(geometry, obj.material);
                    this.staticObjects3DList.push(mesh);
                    mesh.renderOrder = 999;
                    if (Scene.Map.current.mapProperties.isSunLight) {
                        mesh.receiveShadow = true;
                        mesh.castShadow = true;
                        mesh.customDepthMaterial = obj.material.userData.customDepthMaterial;
                    }
                    mesh.layers.enable(1);
                    Scene.Map.current.scene.add(mesh);
                }
            }
        }
    }

    /** 
     *  Read the JSON associated to the objects in the portion.
     *  @param {Record<string, any>} json - Json object describing the objects
     *  @param {boolean} isMapHero - Indicates if this map is where the hero is
     *  at the beginning of the game
    */
    readObjects(json: Record<string, any>, isMapHero: boolean) {
        let datas = Scene.Map.current.getObjectsAtPortion(this.portion);
        let objectsM = datas.m;
        let objectsR = datas.r;
        let m = objectsM.length;
        let n = objectsR.length;

        // Read
        let i: number, j: number, l: number, jsonObject: Record<string, any>, 
            position: Position, object: System.MapObject, id: number, index: 
            number, localPosition: Vector3, mapObject: MapObject;
        for (i = 0, l = json.length; i < l; i++) {
            jsonObject = json[i];
            position = Position.createFromArray(jsonObject.k);
            object = new System.MapObject(jsonObject.v);
            id = object.id;

            // Check if the object is moving (so no need to add it to the scene)
            index = -1;
            for (j = 0; j < m; j++) {
                if (objectsM[j].system.id === id) {
                    index = j;
                    break;
                }
            }
            for (j = 0; j < n; j++) {
                if (objectsR[j] === id) {
                    index = j;
                    break;
                }
            }

            /* If it is the hero, you should not add it to the list of
            objects to display */
            if ((!isMapHero || Datas.Systems.ID_OBJECT_START_HERO !== object.id)
                && index === -1)
            {
                localPosition = position.toVector3();
                mapObject = new MapObject(object, localPosition);
                mapObject.changeState();
                this.objectsList.push(mapObject);
            } else {
                this.heroID = object.id;
            }
        }

        // Add moved objects to the scene
        if (!Scene.Map.current.isBattleMap) { // Not in battle to avoid issues if same map as current map
            let objects = datas.min;
            for (i = 0, l = objects.length; i < l; i++) {
                objects[i].changeState();
                objects[i].addToScene();
            }
            objects = datas.mout;
            for (i = 0, l = objects.length; i < l; i++) {
                objects[i].changeState();
                objects[i].addToScene();
            }   
        }
    }

    /** 
     *  Remove all the static stuff from the scene.
     */
    cleanStatic() {
        if (this.staticFloorsMesh !== null) {
            Scene.Map.current.scene.remove(this.staticFloorsMesh);
        }
        if (this.staticSpritesMesh !== null) {
            Scene.Map.current.scene.remove(this.staticSpritesMesh);
        }
        if (this.faceSpritesMesh !== null) {
            Scene.Map.current.scene.remove(this.faceSpritesMesh);
        }
        let i: number, l: number;
        for (i = 0, l = this.staticWallsList.length; i < l; i++) {
            Scene.Map.current.scene.remove(this.staticWallsList[i]);
        }
        this.staticWallsList = [];
        for (let list of this.staticAutotilesList) {
            if (list) {
                for (let autotiles of list) {
                    Scene.Map.current.scene.remove(autotiles.mesh);
                } 
            }
        }
        this.staticAutotilesList = [];
        for (i = 0, l = this.staticMountainsList.length; i < l; i++) {
            Scene.Map.current.scene.remove(this.staticMountainsList[i]
                .mesh);
        }
        this.staticMountainsList = [];
        for (i = 0, l = this.staticObjects3DList.length; i < l; i++) {
            Scene.Map.current.scene.remove(this.staticObjects3DList[i]);
        }
        this.staticObjects3DList = [];
    }    

    /** 
     *  Remove all the objects from the scene.
     */
    cleanAll() {
        // Static stuff
        this.cleanStatic();

        // Objects
        let i: number, l: number;
        for (i = 0, l = this.objectsList.length; i < l; i++) {
            this.objectsList[i].removeFromScene();
        }

        // Remove moved objects from the scene
        let datas = Game.current.getPortionDatas(Scene.Map.current.id, this.portion);
        let objects = datas.min;
        for (i = 0, l = objects.length; i < l; i++) {
            objects[i].removeFromScene();
        }
        objects = datas.mout;
        for (i = 0, l = objects.length; i < l; i++) {
            objects[i].removeFromScene();
        }
    }

    /** 
     *  Search for the object with the ID.
     *  @param {Record<string, any>} json - Json object describing the objects
     *  @param {number} id - The ID of the object
     *  @returns {MapObject}
    */
    getObjFromID(json: Record<string, any>, id: number): MapObject {
        if (json.objs && json.objs.list) {
            json = json.objs.list;
        } else {
            return null;
        }
        let jsonObject: Record<string, any>, position: Position, jsonObjectValue
            : Record<string, any>, object: System.MapObject, localPosition: 
            Vector3, mapObject: MapObject;
        for (let i = 0, l = json.length; i < l; i++) {
            jsonObject = json[i];
            position = Position.createFromArray(jsonObject.k);
            jsonObjectValue = jsonObject.v;
            object = new System.MapObject;
            if (jsonObjectValue.id === id) {
                object.read(jsonObjectValue);
                localPosition = position.toVector3();
                mapObject = new MapObject(object, localPosition);
                mapObject.changeState();
                return mapObject;
            }
        }
        return null;
    }

    /** 
     *  Get hero model.
     *  @param {Record<string, any>} json - Json object describing the objects
     *  @returns {MapObject}
     */
    getHeroModel(json: Record<string, any>): MapObject {
        let obj = json.objs;
        if (!obj) {
            Platform.showErrorMessage("Your hero object seems to be in a non existing map. Please use define as hero in a map to correct it.");
        }
        json = json.objs.list;
        let jsonObject: Record<string, any>, position: Position, jsonObjectValue
            : Record<string, any>, object: System.MapObject;
        for (let i = 0, l = json.length; i < l; i++) {
            jsonObject = json[i];
            position = Position.createFromArray(jsonObject.k);
            jsonObjectValue = jsonObject.v;
            if (Datas.Systems.ID_OBJECT_START_HERO === jsonObjectValue.id) {
                object = new System.MapObject(jsonObjectValue);
                return new MapObject(object, position.toVector3(), true);
            }
        }
        throw "Impossible to get the hero. Please delete your hero from the map and define it again.";
    }

    /** 
     *  Update the face sprites orientation.
     *  @param {number} angle - The angle on the Y axis
     */
    updateFaceSprites(angle: number) {
        if (this.faceSpritesMesh) {
            (<CustomGeometryFace>this.faceSpritesMesh.geometry).rotate(angle, Sprite.Y_AXIS);
        }
        for (let object of this.objectsList) {
            object.update(angle);
        }
    }

    /** 
     *  Update the collision sprite.
     *  @param {StructMapElementCollision[]} collisions - The collisions objects
     *  @param {Position} position - The json position of the sprite
     */
    updateCollisionSprite(collisions: StructMapElementCollision[], position: 
        Position)
    {
        let i: number, l: number, a: number, b: number, c: number, z: number, 
            objCollision: StructMapElementCollision, positionPlus: Position;
        for (i = 0, l = collisions.length; i < l; i++) {
            objCollision = collisions[i];
            for (a = -objCollision.w; a <= objCollision.w; a++) {
                for (b = -objCollision.h; b <= objCollision.h; b++) {
                    z = objCollision.k ? 0 : objCollision.w;
                    for (c = -z; c <= z; c++) {
                        positionPlus = new Position(position.x + a, position.y + 
                            b, position.z + c);
                        if (Scene.Map.current.isInMap(positionPlus) && this
                            .isPositionIn(positionPlus))
                        {
                            this.boundingBoxesSprites[positionPlus.toIndex()]
                                .push(objCollision);
                        }
                    }
                }
            }
        }
    }

    /** Update the collision sprite
     *  @param {Record<string, any>[]} boundingBoxes - The bounding boxes list to update 
     *  @param {StructMapElementCollision[]} collisions - The collisions objects
     *  @param {Position} position - The json position of the sprite
     *  @param {boolean} side - Indicate if collision side
    */
    updateCollision(boundingBoxes: Record<string, any>[], collisions: 
        StructMapElementCollision[], position: Position, side: boolean)
    {
        let i: number, l: number, objCollision: StructMapElementCollision, 
            centeredPosition: Position, minW: number, maxW: number, minH: number
            , maxH: number, minD: number, maxD: number, a: number, b: number, c:
            number, positionPlus: Position, objCollisionPlus: 
            StructMapElementCollision;
        for (i = 0, l = collisions.length; i < l; i++) {
            objCollision = collisions[i];
            centeredPosition = objCollision.c ? new Position(position.x + Math
                .ceil(objCollision.c.x / Datas.Systems.SQUARE_SIZE), position.y 
                + Math.ceil(objCollision.c.y / Datas.Systems.SQUARE_SIZE), 
                position.z + Math.ceil(objCollision.c.z / Datas.Systems
                .SQUARE_SIZE)) : new Position(position.x, position.y, position.z);
            minW = -objCollision.m;
            maxW = objCollision.m;
            minH = -objCollision.m;
            maxH = objCollision.m;
            minD = -objCollision.m;
            maxD = objCollision.m;
            for (a = minW; a <= maxW; a++) {
                for (b = minH; b <= maxH; b++) {
                    for (c = minD; c <= maxD; c++) {
                        positionPlus = new Position(centeredPosition.x + a,
                            centeredPosition.y + b, centeredPosition.z + c);
                        if (Scene.Map.current.isInMap(positionPlus) && 
                            this.isPositionIn(positionPlus))
                        {
                            if (side) {
                                objCollisionPlus = {};
                                objCollisionPlus = Object.assign(
                                    objCollisionPlus, objCollision);
                                objCollisionPlus.left = a < 0;
                                objCollisionPlus.right = a > 0;
                                objCollisionPlus.top = c < 0;
                                objCollisionPlus.bot = c > 0;
                            } else {
                                objCollisionPlus = objCollision;
                            }
                            boundingBoxes[positionPlus.toIndex()].push(
                                objCollisionPlus);
                        }
                    }
                }
            }
        }
    }

    /** 
     *  Get the object collision according to position.
     *  @param {Position} positionSource - The source json position
     *  @param {Position} positionTarget - The target json position
     *  @param {ElementMapKind} kind - The element map kind
     *  @returns {StructMapElementCollision[]}
     */
    getObjectCollisionAt(positionSource: Position, positionTarget: Position, 
        kind: ElementMapKind): StructMapElementCollision[]
    {
        let result: StructMapElementCollision[] = new Array;
        switch (kind) {
            case ElementMapKind.Mountains:
                let a = positionTarget.x - positionSource.x;
                let c = positionTarget.z - positionSource.z;
                let collisions = this.boundingBoxesMountains[positionSource
                    .toIndex()];
                let w: number, objCollision: StructMapElementCollision;
                for (let i = 0, l = collisions.length; i < l; i++) {
                    w = collisions[i].w;
                    if (a >= -w && a <= w && c >= -w && c <= w) {
                        objCollision = {};
                        objCollision = Object.assign(objCollision, collisions[i]);
                        objCollision.left = a < 0;
                        objCollision.right = a > 0;
                        objCollision.top = c < 0;
                        objCollision.bot = c > 0;
                        objCollision.a = a;
                        result.push(objCollision);
                    }
                }
                break;
            default:
                break;
        }
        return result;
    }

    /** 
     *  Add a position to non empty.
     *  @param {Position} position - The position to add
     */
    addToNonEmpty(position: Position) {
        this.squareNonEmpty[position.x % Constants.PORTION_SIZE][position.z % 
            Constants.PORTION_SIZE].push(position.getTotalY());
    }

    /** 
     *  Check if position if in this map portion.
     *  @param {Position} position - The position to check
     *  @returns {boolean}
    */
    isPositionIn(position: Position): boolean {
        return this.portion.x === Math.floor(position.x / Constants.PORTION_SIZE
            ) && this.portion.y === Math.floor(position.y / Constants
            .PORTION_SIZE) && this.portion.z === Math.floor(position.z / 
            Constants.PORTION_SIZE);
    }
}

export { MapPortion }