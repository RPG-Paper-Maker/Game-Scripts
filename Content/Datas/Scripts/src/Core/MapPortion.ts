/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

const THREE = require('./Content/Datas/Scripts/Libs/three.js');
import { Portion } from "./Portion";
import { MapObject } from "./MapObject";
import { Position } from "./Position";
import { System, Datas } from "..";

/** @class
*   A portion of the map
*   @property {THREE.MeshBasicMaterial} BB_MATERIAL
*   @property {number} realX The real x portion
*   @property {number} realY The real y portion
*   @property {number} realZ The real z portion
*   @property {THREE.Mesh} staticFloorsMesh The mesh used for drawing all the
*   floors
*   @property {THREE.Mesh[]} staticSpritesMesh List of all the static sprites in
*   the scene
*   @property {number[][][]} squareNonEmpty List of all y floors according to x 
*   and y square
*   @property {Object[]} boundingBoxesLands Bounding boxes for lands acording 
*   to index
*   @property {Object[]} boundingBoxesSprites Bounding boxes for sprites 
*   acording to index
*   @property {Object[]} boundingBoxesMountains Bounding boxes for mountains 
*   acording to index
*   @property {Object[]} boundingBoxesObjects3D Bounding boxes for 3D objects 
*   acording to index
*   @property {THREE.Mesh[]} staticAutotilesList List of all the static 
*   autotiles in the map portion
*   @property {THREE.Mesh[]} staticMountainsList List of all the static 
*   mountains in the map portion
*   @property {MapObject[]} objectsList List of all the objects in the portion
*   @property {THREE.Mesh[]} faceSpritesList List of all the face sprites in the
*   scene
*   @property {THREE.Mesh[]} staticWallsList List of all the static walls in 
*   the map portion
*   @property {THREE.Mesh[]} staticObjects3DList List of all the static 3D 
*   objects in the map portion
*   @property {number[][]} overflowMountains Position of overflow mountians
*   @property {THREE.Mesh[]} heroID The hero ID if in this portions
*   @param {number} realX The real x portion
*   @param {number} realY The real y portion
*   @param {number} realZ The real z portion
*/
class MapPortion 
{
    static BB_MATERIAL = new THREE.MeshBasicMaterial();

    public objectsList: MapObject[];

    constructor(portion: Portion)
    {
        /*
        this.realX = realX;
        this.realY = realY;
        this.realZ = realZ;
        this.staticFloorsMesh = null;
        this.staticSpritesMesh = null;
        this.squareNonEmpty = new Array(RPM.PORTION_SIZE * RPM.PORTION_SIZE);
        let i, j;
        for (i = 0; i < RPM.PORTION_SIZE; i++)
        {
            this.squareNonEmpty[i] = new Array(RPM.PORTION_SIZE);
            for (j = 0; j < RPM.PORTION_SIZE; j++)
            {
                this.squareNonEmpty[i][j] = new Array;
            }
        }
        let l = RPM.PORTION_SIZE * RPM.PORTION_SIZE * RPM.PORTION_SIZE;
        this.boundingBoxesLands = new Array(l);
        this.boundingBoxesSprites = new Array(l);
        this.boundingBoxesMountains = new Array(l);
        this.boundingBoxesObjects3D = new Array(l);
        for (i = 0; i < l; i++)
        {
            this.boundingBoxesLands[i] = new Array;
            this.boundingBoxesSprites[i] = new Array;
            this.boundingBoxesMountains[i] = new Array;
            this.boundingBoxesObjects3D[i] = new Array;
        }
        this.staticAutotilesList = new Array;
        this.staticMountainsList = new Array;
        this.objectsList = new Array;
        this.faceSpritesList = new Array;
        this.staticWallsList = new Array;
        this.staticObjects3DList = new Array;
        this.overflowMountains = new Array;
        this.heroID = -1;
        */
    }

    /** Read the JSON associated to the map portion
    *   @param {Object} json Json object describing the map portion
    *   @param {boolean} isMapHero Indicates if this map is where the hero is
    *   at the beginning of the game.
    */
    read(json, isMapHero)
    {
        /*
        this.readLands(json.lands);
        this.readSprites(json.sprites);
        if (json.moun)
        {
            this.readMountains(json.moun);
        }
        if (json.objs3d)
        {
            this.readObjects3D(json.objs3d);
        }
        this.readObjects(json.objs.list, isMapHero);
        this.overflow = json.overflow;
        */
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the lands in the portion
    *   @param {Object} json Json object describing the lands
    */
    readLands(json)
    {
        /*
        this.readFloors(json.floors);
        this.readAutotiles(json.autotiles);
        */
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the floors in the portion
    *   @param {Object} json Json object describing the floors
    */
    readFloors(json)
    {
        /*
        let material = RPM.currentMap.textureTileset;
        let width = material.map ? material.map.image.width : 0;
        let height = material.map ? material.map.image.height : 0;
        let geometry = new THREE.Geometry();
        geometry.faceVertexUvs[0] = [];
        let layers = [];
        let count = 0;
        let i, j, l, m, jsonFloor, position, layer, floor, objCollision, index;
        for (i = 0, l = json.length; i < l; i++)
        {
            jsonFloor = json[i];
            position = jsonFloor.k;
            layer = RPM.positionLayer(position);
            floor = new Floor(jsonFloor.v);
            if (layer > 0)
            {
                for (j = 0, m = layers.length; j < m; j++)
                {
                    if (layer <= RPM.positionLayer(layers[j][0]))
                    {
                        layers.splice(j, 0, [position, floor]);
                        break;
                    }
                }
                if (j === m)
                {
                    layers.push([position, floor]);
                }
            } else
            {
                objCollision = floor.updateGeometry(geometry, position, width,
                    height, count);
                index = RPM.positionJSONToIndex(position);
                this.boundingBoxesLands[index].push(objCollision);
                this.addToNonEmpty(position);
                count++;
            }
        }

        // Draw layers separatly
        for (i = 0, l = layers.length; i < l; i++)
        {
            position = layers[i][0];
            floor = layers[i][1];
            objCollision = floor.updateGeometry(geometry, position, width,
                height, count);
            index = RPM.positionJSONToIndex(position);
            if (objCollision !== null)
            {
                this.boundingBoxesLands[index].push(objCollision);
            }
            this.addToNonEmpty(position);
            count++;
        }

        // Creating the plane
        geometry.uvsNeedUpdate = true;
        this.staticFloorsMesh = new THREE.Mesh(geometry, material);
        this.staticFloorsMesh.renderOrder = 0;
        RPM.currentMap.scene.add(this.staticFloorsMesh);
        */
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the autotiles in the portion
    *   @param {Object} json Json object describing the autotiles
    */
    readAutotiles(json)
    {
        /*
        if (!json)
        {
            return;
        }

        let texture = null;
        let autotilesLength = RPM.currentMap.texturesAutotiles.length;

        // Create autotiles according to the textures
        let i;
        for (i = 0; i < autotilesLength; i++)
        {
            this.staticAutotilesList.push(new Autotiles(RPM.currentMap
                .texturesAutotiles[i]));
        }

        // Read and update geometry
        let l, jsonAutotile, position, autotile, indexPos, index, 
            textureAutotile, autotiles, objCollision;
        for (i = 0, l = json.length; i < l; i++)
        {
            jsonAutotile = json[i];
            position = jsonAutotile.k;
            autotile = new Autotile(jsonAutotile.v);
            indexPos = RPM.positionJSONToIndex(position);
            index = 0;
            texture = null;
            for (; index < autotilesLength; index++)
            {
                textureAutotile = RPM.currentMap.texturesAutotiles[index];
                if (textureAutotile.isInTexture(autotile.autotileID, autotile
                    .texture))
                {
                    texture = textureAutotile;
                    autotiles = this.staticAutotilesList[index];
                    break;
                }
            }

            if (texture !== null && texture.texture !== null)
            {
                objCollision = autotiles.updateGeometry(position, autotile);
                if (objCollision !== null)
                {
                    this.boundingBoxesLands[indexPos].push(objCollision);
                }
            }
            this.addToNonEmpty(position);
        }

        // Update all the geometry uvs and put it in the scene
        for (i = 0, l = this.staticAutotilesList.length; i < l; i++)
        {
            autotiles = this.staticAutotilesList[i];
            autotiles.uvsNeedUpdate = true;
            autotiles.createMesh();
            RPM.currentMap.scene.add(autotiles.mesh);
        }
        */
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the sprites in the portion
    *   @param {Object} json Json object describing the sprites
    */
    readSprites(json)
    {
        /*
        this.readSpritesWalls(json.walls);
        this.readSpritesGlobals(json.list);
        */
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the sprites globals in the portion
    *   @param {Object} json Json object describing the sprites globals
    */
    readSpritesGlobals(json)
    {
        /*
        let material = RPM.currentMap.textureTileset;
        let staticGeometry = new THREE.Geometry();
        let count = 0;
        staticGeometry.faceVertexUvs[0] = [];
        if (material && material.map)
        {
            let s, position, sprite, localPosition, result, geometry, collisions
                , plane;
            for (let i = 0, l = json.length; i < l; i++)
            {
                s = json[i];
                position = s.k;
                sprite = new Sprite(s.v);
                localPosition = RPM.positionToVector3(position);
                if (sprite.kind === ElementMapKind.SpritesFace)
                {
                    result = sprite.createGeometry(material.map.image.width,
                        material.map.image.height, true, position);
                    geometry = result[0];
                    collisions = result[1][1];
                    plane = new THREE.Mesh(geometry, material);
                    plane.position.set(localPosition.x, localPosition.y, 
                        localPosition.z);
                    plane.renderOrder = 999;
                    this.faceSpritesList.push(plane);
                    RPM.currentMap.scene.add(plane);
                } else
                {
                    result = sprite.updateGeometry(staticGeometry, material.map
                        .image.width, material.map.image.height, position, count
                        , true, localPosition);
                    count = result[0];
                    collisions = result[1];
                }
                this.updateCollisionSprite(collisions, position);
            }
        }
        staticGeometry.uvsNeedUpdate = true;
        this.staticSpritesMesh = new THREE.Mesh(staticGeometry, material);
        this.staticSpritesMesh.renderOrder = 999;
        RPM.currentMap.scene.add(this.staticSpritesMesh);
        */
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the sprites walls in the portion
    *   @param {Object} json Json object describing the sprites walls
    */
    readSpritesWalls(json)
    {
        /*
        let wallsIds = RPM.currentMap.texturesWalls.length;
        let hash = new Array(wallsIds);

        // Initialize all walls to null
        let i;
        for (i = 0; i < wallsIds; i++)
        {
            hash[i] = null;
        }

        let l, s, position, sprite, obj, geometry, material, count, result;
        for (i = 0, l = json.length; i < l; i++)
        {
            // Getting sprite
            s = json[i];
            position = s.k;
            sprite = new SpriteWall(s.v);

            // Constructing the geometry
            obj = hash[sprite.id];
            // If ID exists in this tileset
            if (!RPM.isUndefined(obj))
            {
                
                if (obj === null)
                {
                    geometry = new THREE.Geometry();
                    geometry.faceVertexUvs[0] = [];
                    material = RPM.currentMap.texturesWalls[sprite.id];
                    count = 0;
                    obj = {
                        geometry: geometry,
                        material: material,
                        c: count
                    };
                    hash[sprite.id] = obj;
                } else
                {
                    geometry = obj.geometry;
                    material = obj.material;
                    count = obj.c;
                }
                if (material && material.map)
                {
                    result = sprite.updateGeometry(geometry, position, material
                        .map.image.width, material.map.image.height, count);
                    obj.c = result[0];
                    this.updateCollisionSprite(result[1], position);
                }
            }
        }

        // Add to scene
        let mesh;
        for (i = 0; i < wallsIds; i++)
        {
            obj = hash[i];
            if (obj !== null)
            {
                geometry = obj.geometry;
                geometry.uvsNeedUpdate = true;
                mesh = new THREE.Mesh(geometry, obj.material);
                this.staticWallsList.push(mesh);
                RPM.gameStack.top.scene.add(mesh);
            }
        }
        */
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the mountains in the portion
    *   @param {Object} json Json object describing the mountains
    */
    readMountains(json)
    {
        /*
        if (!json)
        {
            return;
        }

        let texture = null;
        let mountainsLength = RPM.currentMap.texturesMountains.length;

        // Create mountains according to the textures
        let i;
        for (i = 0; i < mountainsLength; i++)
        {
            this.staticMountainsList.push(new Mountains(RPM.currentMap
                .texturesMountains[i]));
        }

        // Read and update geometry
        let jsonAll = json.a;
        let l, jsonMountain, position, mountain, indexPos, index, 
            textureMountain, mountains, objCollision;
        for (i = 0, l = jsonAll.length; i < l; i++)
        {
            jsonMountain = jsonAll[i];
            position = jsonMountain.k;
            mountain = new Mountain;
            mountain.read(jsonMountain.v);
            indexPos = RPM.positionJSONToIndex(position);
            index = 0;
            for (; index < mountainsLength; index++)
            {
                textureMountain = RPM.currentMap.texturesMountains[index];
                if (textureMountain.isInTexture(mountain.mountainID))
                {
                    texture = textureMountain;
                    mountains = this.staticMountainsList[index];
                    break;
                }
            }
            if (texture !== null && texture.texture !== null)
            {
                objCollision = mountains.updateGeometry(position, mountain);
                this.updateCollision(this.boundingBoxesMountains, objCollision,
                    position, true);
            }
        }

        // Update all the geometry uvs and put it in the scene
        for (i = 0, l = this.staticMountainsList.length; i < l; i++)
        {
            mountains = this.staticMountainsList[i];
            mountains.uvsNeedUpdate = true;
            mountains.createMesh();
            RPM.currentMap.scene.add(mountains.mesh);
        }

        // Handle overflow
        this.overflowMountains = json.o;
        */
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the objects 3D in the portion
    *   @param {Object} json Json object describing the objects 3D
    */
    readObjects3D(json)
    {
        /*
        // Initialize
        let nbTextures = RPM.currentMap.texturesObjects3D.length;
        let hash = new Array(nbTextures);
        let i;
        for (i = 1; i <= nbTextures; i++)
        {
            hash[i] = null;
        }

        // Read all
        let jsonAll = json.a;
        let l = jsonAll.length;
        let o, position, v, datas, obj3D, obj, geometry, material, count, result;
        for (i = 0; i < l; i++)
        {
            // Getting object 3D
            o = jsonAll[i];
            position = o.k;
            v = o.v;
            datas = RPM.datasGame.specialElements.objects[v.did];
            if (datas)
            {
                switch (datas.shapeKind)
                {
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
                obj = hash[obj3D.datas.pictureID];
                if (!RPM.isUndefined(obj))
                {
                    if (obj === null)
                    {
                        geometry = new THREE.Geometry();
                        geometry.faceVertexUvs[0] = [];
                        material = RPM.currentMap.texturesObjects3D[obj3D.datas
                            .pictureID];
                        count = 0;
                        obj = {
                            geometry: geometry,
                            material: material,
                            c: count
                        };
                        hash[obj3D.datas.pictureID] = obj;
                    } else
                    {
                        geometry = obj.geometry;
                        material = obj.material;
                        count = obj.c;
                    }
                    if (material && material.map)
                    {
                        result = obj3D.updateGeometry(geometry, position, count);
                        obj.c = result[0];
                        this.updateCollision(this.boundingBoxesObjects3D, result
                            [1], position, datas.shapeKind === ShapeKind.Custom);
                    }
                }
            }
        }

        // Add meshes
        let mesh;
        for (i = 1; i <= nbTextures; i++)
        {
            obj = hash[i];
            if (obj !== null)
            {
                geometry = obj.geometry;
                geometry.uvsNeedUpdate = true;
                mesh = new THREE.Mesh(geometry, obj.material);
                this.staticObjects3DList.push(mesh);
                mesh.renderOrder = 999;
                RPM.gameStack.top.scene.add(mesh);
            }
        }
        */
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the objects in the portion
    *   @param {Object} json Json object describing the objects
    *   @param {boolean} isMapHero Indicates if this map is where the hero is
    *   at the beginning of the game
    */
    readObjects(json, isMapHero)
    {
        /*
        let datas = RPM.currentMap.getObjectsAtPortion(this.realX, this.realY,
            this.realZ);
        let objectsM = datas.m;
        let objectsR = datas.r;
        let m = objectsM.length;
        let n = objectsR.length;

        // Read
        let i, j, l, jsonObject, position, object, id, index, localPosition,
            mapObject;
        for (i = 0, l = json.length; i < l; i++)
        {
            jsonObject = json[i];
            position = jsonObject.k;
            object = new SystemObject(jsonObject.v);
            id = object.id;

            // Check if the object is moving (so no need to add it to the scene)
            index = -1;
            for (j = 0; j < m; j++)
            {
                if (objectsM[j].system.id === id)
                {
                    index = j;
                    break;
                }
            }
            for (j = 0; j < n; j++)
            {
                if (objectsR[j] === id)
                {
                    index = j;
                    break;
                }
            }

            // If it is the hero, you should not add it to the list of
            // objects to display
            if ((!isMapHero || RPM.datasGame.system.idObjectStartHero !== object
                .id) && index === -1)
            {
                localPosition = RPM.positionToVector3(position);
                position = new THREE.Vector3(localPosition.x, localPosition.y,
                    localPosition.z);
                mapObject = new MapObject(object, position);
                mapObject.changeState();
                this.objectsList.push(mapObject);
            } else
            {
                this.heroID = object.id;
            }
        }

        // Add moved objects to the scene
        let objects = datas.min;
        for (i = 0, l = objects.length; i < l; i++)
        {
            objects[i].addToScene();
        }
        objects = datas.mout;
        for (i = 0, l = objects.length; i < l; i++)
        {
            objects[i].addToScene();
        }
        */
    }

    // -------------------------------------------------------
    /** Remove all the objects from the scene
    */
    cleanAll()
    {
        /*
        let datas = RPM.game.getPotionsDatas(RPM.currentMap.id, this.realX, this
            .realY, this.realZ);

        // Static stuff
        if (this.staticFloorsMesh !== null)
        {
            RPM.currentMap.scene.remove(this.staticFloorsMesh);
        }
        if (this.staticSpritesMesh !== null)
        {
            RPM.currentMap.scene.remove(this.staticSpritesMesh);
        }
        let i, l;
        for (i = 0, l = this.faceSpritesList.length; i < l; i++)
        {
            RPM.currentMap.scene.remove(this.faceSpritesList[i]);
        }
        for (i = 0, l = this.staticWallsList.length; i < l; i++)
        {
            RPM.currentMap.scene.remove(this.staticWallsList[i]);
        }
        for (i = 0, l = this.staticAutotilesList.length; i < l; i++)
        {
            RPM.currentMap.scene.remove(this.staticAutotilesList[i].mesh);
        }
        for (i = 0, l = this.staticMountainsList.length; i < l; i++)
        {
            RPM.currentMap.scene.remove(this.staticMountainsList[i].mesh);
        }
        for (i = 0, l = this.staticObjects3DList.length; i < l; i++)
        {
            RPM.currentMap.scene.remove(this.staticObjects3DList[i]);
        }

        // Objects
        for (i = 0, l = this.objectsList.length; i < l; i++)
        {
            this.objectsList[i].removeFromScene();
        }

        // Remove moved objects from the scene
        let objects = datas.min;
        for (i = 0, l = objects.length; i < l; i++) {
            objects[i].removeFromScene();
        }
        objects = datas.mout;
        for (i = 0, l = objects.length; i < l; i++) {
            objects[i].removeFromScene();
        }
        */
    }

    // -------------------------------------------------------
    /** Search for the object with the ID
    *   @param {Object} json Json object describing the objects
    *   @param {number} id The ID of the object
    *   @returns {MapObject}
    */
    getObjFromID(json, id)
    {
        /*
        if (json.objs && json.objs.list)
        {
            json = json.objs.list;
        } else
        {
            return null;
        }
        let jsonObject, position, jsonObjectValue, object, localPosition, 
            mapObject;
        for (let i = 0, l = json.length; i < l; i++)
        {
            jsonObject = json[i];
            position = jsonObject.k;
            jsonObjectValue = jsonObject.v;
            object = new SystemObject;
            if (jsonObjectValue.id === id)
            {
                object.read(jsonObjectValue);
                localPosition = RPM.positionToVector3(position);
                position = new THREE.Vector3(localPosition.x, localPosition.y,
                    localPosition.z);
                mapObject = new MapObject(object, position);
                mapObject.changeState();
                return mapObject;
            }
        }
        return null;
        */
    }

    /** 
     *  Get hero model
     *  @param {Record<string, any>} json Json object describing the objects
     *  @returns {MapObject}
     */
    getHeroModel(json: Record<string, any>): MapObject
    {
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
        return null;
    }

    /** 
     *  Update the face sprites orientation
     *  @param {number} angle The angle on the Y axis
     */
    updateFaceSprites(angle)
    {
        /*
        let i, l;
        for (i = 0, l = this.faceSpritesList.length; i < l; i++)
        {
            this.faceSpritesList[i].rotation.y = angle;
        }
        for (i = 0, l = this.objectsList.length; i < l; i++)
        {
            this.objectsList[i].update(angle);
        }
        */
    }

    // -------------------------------------------------------
    /** Update the collision sprite
    *   @param {Object[]} collisions The collisions objects
    *   @param {number[]} position The json position of the sprite
    */
    updateCollisionSprite(collisions, position)
    {
        /*
        let i, l, a, b, c, z, objCollision, positionPlus;
        for (i = 0, l = collisions.length; i < l; i++)
        {
            objCollision = collisions[i];
            for (a = -objCollision.w; a <= objCollision.w; a++)
            {
                for (b = -objCollision.h; b <= objCollision.h; b++)
                {
                    z = objCollision.k ? 0 : objCollision.w;
                    for (c = -z; c <= z; c++)
                    {
                        positionPlus = [
                            position[0] + a,
                            position[1] + b,
                            position[3] + c
                        ];
                        if (RPM.currentMap.isInMap(positionPlus) && this
                            .isPositionIn(positionPlus))
                        {
                            this.boundingBoxesSprites[RPM.positionToIndex(
                                positionPlus)].push(objCollision);
                        }
                    }
                }
            }
        }*/
    }

    // -------------------------------------------------------
    /** Update the collision sprite
    *   @param {Object[]} boundingBoxes The bounding boxes list to update 
    *   @param {Object[]} collisions The collisions objects
    *   @param {number[]} position The json position of the sprite
    *   @param {boolean} side Indicate if collision side
    */
    updateCollision(boundingBoxes, collisions, position, side)
    {
        /*
        let i, l, objCollision, centeredPosition, minW, maxW, minH, maxH, minD, 
            maxD, a, b, c, positionPlus, objCollisionPlus;
        for (i = 0, l = collisions.length; i < l; i++)
        {
            objCollision = collisions[i];
            centeredPosition = objCollision.c ? [position[0] + Math.ceil(
                objCollision.c.x / RPM.SQUARE_SIZE), position[1] + Math.ceil(
                objCollision.c.y / RPM.SQUARE_SIZE), position[3] + Math.ceil(
                objCollision.c.z / RPM.SQUARE_SIZE)] : [position[0], position[1]
                , position[3]];
            minW = -objCollision.m;
            maxW = objCollision.m;
            minH = -objCollision.m;
            maxH = objCollision.m;
            minD = -objCollision.m;
            maxD = objCollision.m;
            for (a = minW; a <= maxW; a++)
            {
                for (b = minH; b <= maxH; b++)
                {
                    for (c = minD; c <= maxD; c++)
                    {
                        positionPlus = [
                            centeredPosition[0] + a,
                            centeredPosition[1] + b,
                            centeredPosition[2] + c
                        ];
                        if (RPM.currentMap.isInMap(positionPlus) && this
                            .isPositionIn(positionPlus))
                        {
                            if (side)
                            {
                                objCollisionPlus = {};
                                objCollisionPlus = Object.assign(
                                    objCollisionPlus, objCollision);
                                objCollisionPlus.left = a < 0;
                                objCollisionPlus.right = a > 0;
                                objCollisionPlus.top = c < 0;
                                objCollisionPlus.bot = c > 0;
                            } else
                            {
                                objCollisionPlus = objCollision;
                            }
                            boundingBoxes[RPM.positionToIndex(positionPlus)]
                                .push(objCollisionPlus);
                        }
                    }
                }
            }
        }
        */
    }

    // -------------------------------------------------------
    /** Get the object collision according to position
    *   @param {number[]} positionSource The source json position
    *   @param {number[]} positionTarget The target json position
    *   @param {ElementMapKind} kind The element map kind
    */
    getObjectCollisionAt(positionSource, positionTarget, kind)
    {
        /*
        let result = new Array;
        switch (kind)
        {
        case ElementMapKind.Mountains:
            let a = positionTarget[0] - positionSource[0];
            let c = positionTarget[2] - positionSource[3];
            let collisions = this.boundingBoxesMountains[RPM.positionJSONToIndex
                (positionSource)];
            let w, objCollision;
            for (let i = 0, l = collisions.length; i < l; i++)
            {
                w = collisions[i].w;
                if (a >= -w && a <= w && c >= -w && c <= w)
                {
                    objCollision = {};
                    objCollision = Object.assign(objCollision, collisions[i]);
                    objCollision.left = a < 0;
                    objCollision.right = a > 0;
                    objCollision.top = c < 0;
                    objCollision.bot = c > 0;
                    objCollision.a = a;
                    objCollision.c = c;
                    result.push(objCollision);
                }
            }
            break;
        default:
            break;
        }
        return result;
        */
    }

    // -------------------------------------------------------
    /** Add a position to non empty
    *   @param {number[]} position The position to add
    */
    addToNonEmpty(position)
    {
        /*
        this.squareNonEmpty[position[0] % RPM.PORTION_SIZE][position[3] % RPM
            .PORTION_SIZE].push(RPM.positionTotalY(position));
            */
    }

    // -------------------------------------------------------
    /** Check if position if in this map portion
    *   @param {number[]} position The position to check
    *   @returns {boolean}
    */
    isPositionIn(position)
    {
        /*
        return this.realX === Math.floor(position[0] / RPM.PORTION_SIZE) && this
            .realY === Math.floor(position[1] / RPM.PORTION_SIZE) && this.realZ 
            === Math.floor(position[2] / RPM.PORTION_SIZE);
            */
    }

    // -------------------------------------------------------
    /** Check if there is a collision at this position
    *   @param {number[]} jpositionBefore The json position before collision
    *   @param {number[]} jpositionAfter The json position after collision
    *   @param {THREE.Vector3} positionAfter The position after collision
    *   @param {MapObject} object The map object collision test
    *   @param {THREE.Vector3} direction The direction collision
    *   @param {Object[]} testedCollisions The object collisions that were 
    *   already tested
    *   @returns {boolean}
    */
    checkCollision(jpositionBefore, jpositionAfter, positionAfter, object, 
        direction, testedCollisions)
    {
        /*
        // Check mountain collision first for elevation
        let result = this.checkMountainsCollision(jpositionAfter, positionAfter,
            testedCollisions, object);
        if (result[0])
        {
            return result;
        }

        // Check other tests
        return [(this.checkLandsCollision(jpositionBefore, jpositionAfter,
            object, direction, testedCollisions) || this.checkSpritesCollision(
            jpositionAfter, testedCollisions, object) || this
            .checkObjects3DCollision(jpositionAfter, testedCollisions, object)), 
            result[1]];
            */
    }

    // -------------------------------------------------------
    /** Check if there is a collision with lands at this position
    *   @param {number[]} jpositionBefore The json position before collision
    *   @param {number[]} jpositionAfter The json position after collision
    *   @param {MapObject} object The map object collision test
    *   @param {THREE.Vector3} direction The direction collision
    *   @param {Object[]} testedCollisions The object collisions that were 
    *   already tested
    *   @returns {boolean} 
    */
    checkLandsCollision(jpositionBefore, jpositionAfter, object, direction, 
        testedCollisions)
    {
        /*
        let index = RPM.positionToIndex(jpositionAfter);
        let lands = this.boundingBoxesLands[index];
        if (lands !== null)
        {
            let objCollision, boundingBox, collision;
            for (let i = 0, l = lands.length; i < l; i++)
            {
                objCollision = lands[i];
                if (testedCollisions.indexOf(objCollision) === -1)
                {
                    testedCollisions.push(objCollision);
                    if (objCollision !== null)
                    {
                        boundingBox = objCollision.b;
                        collision = objCollision.c;
                        if (this.checkIntersectionLand(collision, boundingBox,
                            object) || this.checkDirections(jpositionBefore, 
                            jpositionAfter, collision, boundingBox, direction,
                            object))
                        {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
        */
    }

   // -------------------------------------------------------
    /** Check if there is a collision with lands with directions
    *   @param {number[]} jpositionBefore The json position before collision
    *   @param {number[]} jpositionAfter The json position after collision
    *   @param {THREE.Vector3} direction The direction collision
    *   @returns {boolean} 
    */
    checkLandsCollisionInside(jpositionBefore, jpositionAfter, direction)
    {
        /*
        let lands = this.boundingBoxesLands[RPM.positionToIndex(jpositionBefore)];
        if (lands !== null)
        {
            let objCollision, collision;
            for (let i = 0, l = lands.length; i < l; i++)
            {
                objCollision = lands[i];
                if (objCollision !== null)
                {
                    collision = objCollision.c;
                    if (this.checkDirectionsInside(jpositionBefore, 
                        jpositionAfter, collision, direction))
                    {
                        return true;
                    }
                }
            }
        }
        return false;
        */
    }

    // -------------------------------------------------------
    /** Check intersection between ray and an object
    *   @param {Object} collision The collision object
    *   @param {number[]} boundingBox The bounding box values
    *   @param {MapObject} object The map object to check
    *   @returns {boolean}
    */
    checkIntersectionLand(collision, boundingBox, object)
    {
        /*
        if (collision !== null)
        {
            return false;
        }
        MapPortion.applyBoxLandTransforms(RPM.BB_BOX, boundingBox);
        return CollisionsUtilities.obbVSobb(object.currentBoundingBox.geometry,
            RPM.BB_BOX.geometry);
            */
    }

    // -------------------------------------------------------
    /** Check directions
    *   @param {number[]} jpositionBefore The json position before collision
    *   @param {number[]} jpositionAfter The json position after collision
    *   @param {Object} collision The collision object
    *   @param {number[]} boundingBox The bounding box values
    *   @param {THREE.Vector3} direction The direction collision
    *   @param {MapObject} object The map object collision test
    *   @returns {boolean}
    */
    checkDirections(jpositionBefore, jpositionAfter, collision, boundingBox, 
        direction, object)
    {
        /*
        if (collision === null)
        {
            return false;
        }
        if (jpositionBefore[0] !== jpositionAfter[0] || jpositionBefore[1] !== 
            jpositionAfter[1] || jpositionBefore[2] !== jpositionAfter[2])
        {
            if (this.checkIntersectionLand(null, boundingBox, object))
            {
                if (direction.x > 0)
                {
                    return !collision.left;
                }
                if (direction.x < 0)
                {
                    return !collision.right;
                }
                if (direction.z > 0)
                {
                    return !collision.top;
                }
                if (direction.z < 0)
                {
                    return !collision.bot;
                }
            }
        }
        return false;
        */
    }

    // -------------------------------------------------------
    /** Check directions inside
    *   @param {number[]} jpositionBefore The json position before collision
    *   @param {number[]} jpositionAfter The json position after collision
    *   @param {Object} collision The collision object
    *   @param {THREE.Vector3} direction The direction collision
    *   @returns {boolean}
    */
    checkDirectionsInside(jpositionBefore, jpositionAfter, collision, direction)
    {
        /*
        if (collision === null)
        {
            return false;
        }
        if (jpositionBefore[0] !== jpositionAfter[0] || jpositionBefore[1] !== 
            jpositionAfter[1] || jpositionBefore[2] !== jpositionAfter[2])
        {
            if (direction.x > 0)
            {
                return !collision.right;
            }
            if (direction.x < 0)
            {
                return !collision.left;
            }
            if (direction.z > 0)
            {
                return !collision.bot;
            }
            if (direction.z < 0)
            {
                return !collision.top;
            }
        }
        return false;
        */
    }

    // -------------------------------------------------------
    /** Check if there is a collision with sprites at this position
    *   @param {number[]} jpositionAfter The json position after collision
    *   @param {Object[]} testedCollisions The object collisions that were 
    *   already tested
    *   @param {MapObject} object The map object collision test
    *   @returns {boolean}
    */
    checkSpritesCollision(jpositionAfter, testedCollisions, object)
    {
        /*
        let sprites = this.boundingBoxesSprites[RPM.positionToIndex(
            jpositionAfter)];
        if (sprites !== null)
        {
            let objCollision;
            for (let i = 0, l = sprites.length; i < l; i++)
            {
                objCollision = sprites[i];
                if (testedCollisions.indexOf(objCollision) === -1)
                {
                    testedCollisions.push(objCollision);
                    if (this.checkIntersectionSprite(objCollision.b, 
                        objCollision.k, object))
                    {
                        return true;
                    }
                }
            }
        }
        return false;
        */
    }

    // -------------------------------------------------------
    /** Check intersection between ray and an object
    *   @param {number[]} boundingBox The bounding box values
    *   @param {boolean} fix Indicate if the sprite is fix or not
    *   @param {MapObject} object The map object collision test
    *   @returns {boolean}
    */
    checkIntersectionSprite(boundingBox, fix, object)
    {
        /*
        if (boundingBox === null)
        {
            return false;
        }
        if (fix)
        {
            MapPortion.applyBoxSpriteTransforms(RPM.BB_BOX, boundingBox);
            return CollisionsUtilities.obbVSobb(object.currentBoundingBox
                .geometry, RPM.BB_BOX.geometry);
        } else
        {
            MapPortion.applyOrientedBoxTransforms(RPM.BB_ORIENTED_BOX, 
                boundingBox);
            return CollisionsUtilities.obbVSobb(object.currentBoundingBox
                .geometry, RPM.BB_ORIENTED_BOX.geometry);
        }
        */
    }

    // -------------------------------------------------------
    /** Check if there is a collision with sprites at this position
    *   @param {number[]} jpositionAfter The json position after collision
    *   @param {Object[]} testedCollisions The object collisions that were 
    *   already tested
    *   @param {MapObject} object The map object collision test
    *   @returns {boolean}
    */
    checkObjects3DCollision(jpositionAfter, testedCollisions, object)
    {
        /*
        let objects3D = this.boundingBoxesObjects3D[RPM.positionToIndex(
            jpositionAfter)];
        if (objects3D !== null)
        {
            let objCollision;
            for (let i = 0, l = objects3D.length; i < l; i++)
            {
                objCollision = objects3D[i];
                if (testedCollisions.indexOf(objCollision) === -1)
                {
                    testedCollisions.push(objCollision);
                    if (this.checkIntersectionSprite(objCollision.b, 
                        objCollision.k, object))
                    {
                        return true;
                    }
                }
            }
        }
        return false;
        */
    }

    // -------------------------------------------------------
    /** Check if there is a collision with mountains at this position
    *   @param {number[]} jpositionAfter The json position after collision
    *   @param {THREE.Vector3} positionAfter The position after collision
    *   @param {Object[]} testedCollisions The object collisions that were 
    *   already tested
    *   @param {MapObject} object The map object collision test
    *   @returns {boolean}
    */
    checkMountainsCollision(jpositionAfter, positionAfter, testedCollisions, 
        object)
    {
        /*
        let yMountain = null;
        let mountains = this.boundingBoxesMountains[RPM.positionToIndex(
            jpositionAfter)];
        let block = false;
        let i, l, result;
        if (mountains !== null)
        {
            for (i = 0, l = mountains.length; i < l; i++)
            {
                result = this.checkMountainCollision(jpositionAfter, 
                    positionAfter, testedCollisions, object, mountains[i],
                    yMountain, block);
                if (result[0])
                {
                    return [result[1], result[2]];
                } else
                {
                    block = result[1];
                    yMountain = result[2];
                }
            }
        }
        let j, m, objCollision;
        for (i = 0, l = this.overflowMountains.length; i < l; i++)
        {
            objCollision = RPM.currentMap.getMapPortionByPosition(this
                .overflowMountains[i]).getObjectCollisionAt(this
                .overflowMountains[i], jpositionAfter, ElementMapKind.Mountains);
            for (j = 0, m = objCollision.length; j < m; j++)
            {
                result = this.checkMountainCollision(jpositionAfter,
                    positionAfter, testedCollisions, object, objCollision[j],
                    yMountain, block);
                if (result[0])
                {
                    return [result[1], result[2]];
                } else
                {
                    block = result[1];
                    yMountain = result[2];
                }
            }
        }
        return [block && (yMountain === null), yMountain];
        */
    }

    // -------------------------------------------------------
    /** Check if there is a collision with mountains at this position
    *   @param {number[]} jpositionAfter The json position after collision
    *   @param {THREE.Vector3} positionAfter The position after collision
    *   @param {Object[]} testedCollisions The object collisions that were 
    *   already tested
    *   @param {MapObject} object The map object collision test
    *   @param {Object} objCollision The object collision
    *   @param {number} yMountain The y mountain collision
    *   @param {boolean} block The block mountain collision
    *   @returns {boolean}
    */
    checkMountainCollision(jpositionAfter, positionAfter, testedCollisions, 
        object, objCollision, yMountain, block)
    {
        /*
        if (testedCollisions.indexOf(objCollision) === -1)
        {
            testedCollisions.push(objCollision);
            let result = this.checkIntersectionMountain(jpositionAfter,
                positionAfter, objCollision, object);
            if (result[0])
            {
                if (result[1] === null)
                {
                    return [true, result[0], result[1]];
                } else
                {
                    block = true;
                }
            } else if (result[1] !== null)
            {
                if (yMountain === null || yMountain < result[1])
                {
                    yMountain = result[1];
                }
            }
        }
        return [false, block, yMountain]
        */
    }

    // -------------------------------------------------------
    /** Check intersection with a mountain
    *   @param {number[]} jpositionAfter The json position after collision
    *   @param {THREE.Vector3} positionAfter The position after collision
    *   @param {Object} objCollision The object collision
    *   @param {MapObject} object The map object collision test
    *   @returns {boolean}
    */
    checkIntersectionMountain(jpositionAfter, positionAfter, objCollision, 
        object)
    {
        /*
        let mountain = objCollision.t;
        let forceAlways = mountain.getSystem().forceAlways();
        let forceNever = mountain.getSystem().forceNever();
        let point = new THREE.Vector2(positionAfter.x, positionAfter.z);
        let x = objCollision.l.x;
        let y = objCollision.l.y;
        let z = objCollision.l.z;
        let w = objCollision.rw;
        let h = objCollision.rh;

        // if w = 0, check height
        if (objCollision.rw === 0)
        {
            let pass = forceAlways || -(!forceNever && ((y + objCollision.rh) <= 
                (positionAfter.y + RPM.datasGame.system.mountainCollisionHeight
                .getValue())));
            if (CollisionsUtilities.isPointOnRectangle(point, x, x + RPM
                .SQUARE_SIZE, z, z + RPM.SQUARE_SIZE))
            {
                return pass ? [false, y + objCollision.rh] : [true, null];
            } else
            {
                if (!pass)
                {
                    return [this.checkIntersectionSprite([x + (RPM.SQUARE_SIZE / 
                        2), y + (RPM.SQUARE_SIZE / 2), z + (RPM.SQUARE_SIZE / 2)
                        , RPM.SQUARE_SIZE, objCollision.rh, RPM.SQUARE_SIZE, 0, 
                        0, 0], true, object), null];
                }
            }
        } else
        {   // if w > 0, go like a slope
            // Get coplanar points according to side
            let ptA, ptB, ptC, pA, pB, pC;
            if (objCollision.left && !mountain.left)
            {
                if (objCollision.top && !mountain.top)
                {
                    ptA = new THREE.Vector2(x - w, z);
                    ptB = new THREE.Vector2(x, z);
                    ptC = new THREE.Vector2(x, z - w);
                    if (CollisionsUtilities.isPointOnTriangle(point, ptA,
                        ptB, ptC))
                    {
                        pA = new THREE.Vector3(ptA.x, y, ptA.y);
                        pB = new THREE.Vector3(ptB.x, y + h, ptB.y);
                        pC = new THREE.Vector3(ptC.x, y, ptC.y);
                    } else
                    {
                        return [false, null];
                    }
                } else if (objCollision.bot && !mountain.bot)
                {
                    ptA = new THREE.Vector2(x - w, z + RPM.SQUARE_SIZE);
                    ptB = new THREE.Vector2(x, z + RPM.SQUARE_SIZE);
                    ptC = new THREE.Vector2(x, z + RPM.SQUARE_SIZE + w);
                    if (CollisionsUtilities.isPointOnTriangle(point, ptA,
                        ptB, ptC))
                    {
                        pA = new THREE.Vector3(ptA.x, y, ptA.y);
                        pB = new THREE.Vector3(ptB.x, y + h, ptB.y);
                        pC = new THREE.Vector3(ptC.x, y, ptC.y);
                    } else
                    {
                        return [false, null];
                    }
                } else
                {
                    if (CollisionsUtilities.isPointOnRectangle(point, x - w,
                        x, z, z + RPM.SQUARE_SIZE))
                    {
                        pA = new THREE.Vector3(x - w, y, z);
                        pB = new THREE.Vector3(x, y + h, z);
                        pC = new THREE.Vector3(x, y + h, z + RPM.SQUARE_SIZE);
                    } else
                    {
                        return [false, null];
                    }
                }
            } else if (objCollision.right && !mountain.right)
            {
                if (objCollision.top && !mountain.top)
                {
                    ptA = new THREE.Vector2(x + RPM.SQUARE_SIZE, z - w);
                    ptB = new THREE.Vector2(x + RPM.SQUARE_SIZE, z);
                    ptC = new THREE.Vector2(x + RPM.SQUARE_SIZE + w, z);
                    if (CollisionsUtilities.isPointOnTriangle(point, ptA,
                        ptB, ptC))
                    {
                        pA = new THREE.Vector3(ptA.x, y, ptA.y);
                        pB = new THREE.Vector3(ptB.x, y + h, ptB.y);
                        pC = new THREE.Vector3(ptC.x, y, ptC.y);
                    } else
                    {
                        return [false, null];
                    }
                } else if (objCollision.bot && !mountain.bot)
                {
                    ptA = new THREE.Vector2(x + RPM.SQUARE_SIZE, z +
                        RPM.SQUARE_SIZE + w);
                    ptB = new THREE.Vector2(x + RPM.SQUARE_SIZE, z +
                        RPM.SQUARE_SIZE);
                    ptC = new THREE.Vector2(x + RPM.SQUARE_SIZE + w, z +
                        RPM.SQUARE_SIZE);
                    if (CollisionsUtilities.isPointOnTriangle(point, ptA,
                        ptB, ptC))
                    {
                        pA = new THREE.Vector3(ptA.x, y, ptA.y);
                        pB = new THREE.Vector3(ptB.x, y + h, ptB.y);
                        pC = new THREE.Vector3(ptC.x, y, ptC.y);
                    } else
                    {
                        return [false, null];
                    }
                } else
                {
                    if (CollisionsUtilities.isPointOnRectangle(point, x +
                        RPM.SQUARE_SIZE, x + RPM.SQUARE_SIZE + w, z, z +
                        RPM.SQUARE_SIZE))
                    {
                        pA = new THREE.Vector3(x + RPM.SQUARE_SIZE, y + h, z +
                            RPM.SQUARE_SIZE);
                        pB = new THREE.Vector3(x + RPM.SQUARE_SIZE, y + h, z);
                        pC = new THREE.Vector3(x + RPM.SQUARE_SIZE + w, y, z);
                    } else
                    {
                        return [false, null];
                    }
                }
            } else
            {
                if (objCollision.top && !mountain.top)
                {
                    if (CollisionsUtilities.isPointOnRectangle(point, x, x +
                        RPM.SQUARE_SIZE, z - w, z))
                    {
                        pA = new THREE.Vector3(x, y + h, z);
                        pB = new THREE.Vector3(x, y, z - w);
                        pC = new THREE.Vector3(x + RPM.SQUARE_SIZE, y, z - w);
                    } else
                    {
                        return [false, null];
                    }
                } else if (objCollision.bot && !mountain.bot)
                {
                    if (CollisionsUtilities.isPointOnRectangle(point, x, x +
                        RPM.SQUARE_SIZE, z + RPM.SQUARE_SIZE, z + RPM.SQUARE_SIZE + w))
                    {
                        pA = new THREE.Vector3(x + RPM.SQUARE_SIZE, y, z +
                            RPM.SQUARE_SIZE + w);
                        pB = new THREE.Vector3(x, y, z + RPM.SQUARE_SIZE + w);
                        pC = new THREE.Vector3(x, y + h, z + RPM.SQUARE_SIZE);
                    } else
                    {
                        return [false, null];
                    }
                } else
                {
                    return [false, null];
                }
            }
            // Get the intersection point for updating mountain y
            let plane = new THREE.Plane();
            let ray = new THREE.Ray(new THREE.Vector3(positionAfter.x, y,
                positionAfter.z), new THREE.Vector3(0, 1, 0));
            let newPosition = new THREE.Vector3();
            plane.setFromCoplanarPoints(pA, pB, pC);
            ray.intersectPlane(plane, newPosition);

            // If going down, check if there's a blocking floor
            let jposition = (newPosition.y - positionAfter.y) < 0 ? [Math
                .floor(positionAfter.x / RPM.SQUARE_SIZE), Math.ceil(
                positionAfter.y / RPM.SQUARE_SIZE), Math.floor(positionAfter
                .z / RPM.SQUARE_SIZE)] : jpositionAfter;
            let isFloor = this.boundingBoxesLands[RPM.positionToIndex(
                jposition)].length > 0;
            if (isFloor && (newPosition.y - positionAfter.y) < 0)
            {
                return [false, null];
            }

            // If angle limit, block
            if (forceNever || (!forceAlways && mountain.angle > RPM.datasGame
                .system.mountainCollisionAngle.getValue()))
            {
                // Check if floor existing on top of the mountain angle
                isFloor = jposition[1] === jpositionAfter[1] ? false : this
                    .boundingBoxesLands[RPM.positionToIndex(jpositionAfter)]
                    .length > 0;
                return [!isFloor, null];
            }

            return [!forceAlways && (Math.abs(newPosition.y - positionAfter
                .y) > RPM.datasGame.system.mountainCollisionHeight.getValue()),
                newPosition.y];
        }
        return [false, null];
        */
    }

    // -------------------------------------------------------
    /** Check collision with objects
    *   @param {MapObject} object The map object collision test
    *   @returns {boolean}
    */
    checkObjectsCollision(object)
    {
        /*
        let datas = RPM.currentMap.getObjectsAtPortion(this.realX, this.realY,
            this.realZ);
        return this.checkObjectsCollisionList(this.objectsList, object) || this
            .checkObjectsCollisionList(datas.min, object) || this
            .checkObjectsCollisionList(datas.mout, object);
            */
    }

    // -------------------------------------------------------
    /** Check collision with objects
    *   @param {MapObject[]} list The map objects list to test
    *   @param {MapObject} object The map object collision test
    *   @returns {boolean}
    */
    checkObjectsCollisionList(list, object)
    {
        /*
        let obj;
        for (let i = 0, l = list.length; i < l; i++)
        {
            obj = list[i];
            if (obj !== object && object.isInRect(obj))
            {
                if (object.checkCollisionObject(obj))
                {
                    return true;
                }
            }
        }
        return false;
        */
    }
}

export { MapPortion }