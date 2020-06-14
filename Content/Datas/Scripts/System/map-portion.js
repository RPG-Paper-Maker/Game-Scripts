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
//  [CLASS MapPortion]
//
// -------------------------------------------------------

/** @class
*   A portion of the map.
*   @property {THREE.Vector3} positionOrigin The position of the origin of the
*   portion.
*   @property {THREE.Mesh} staticFloorsMesh The mesh used for drawing all the
*   floors.
*   @property {THREE.Mesh[]} staticSpritesList List of all the static sprites in
*   the scene.
*   @property {MapObject[]} objectsList List of all the objects in the portion.
*   @property {THREE.Mesh[]} faceSpritesList List of all the face sprites in the
*   scene.
*   @param {number} realX The real x portion.
*   @param {number} realY The real y portion.
*   @param {number} realZ The real z portion.
*/
function MapPortion(realX, realY, realZ) {
    var i, j, l;

    this.realX = realX;
    this.realY = realY;
    this.realZ = realZ;
    this.staticFloorsMesh = null;
    this.staticSpritesMesh = null;
    l = RPM.PORTION_SIZE * RPM.PORTION_SIZE * RPM.PORTION_SIZE;
    this.squareNonEmpty = new Array(RPM.PORTION_SIZE * RPM.PORTION_SIZE);
    for (i = 0; i < RPM.PORTION_SIZE; i++) {
        this.squareNonEmpty[i] = new Array(RPM.PORTION_SIZE);
        for (j = 0; j < RPM.PORTION_SIZE; j++) {
            this.squareNonEmpty[i][j] = new Array;
        }
    }
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
    this.faceSpritesList = new Array;
    this.staticWallsList = new Array;
    this.staticObjects3DList = new Array;
    this.overflowMountains = new Array;
    this.heroID = -1;
}

// -------------------------------------------------------

MapPortion.checkCollisionRay = function(positionBefore, positionAfter, object) {
    var portion, mapPortion;
    var direction = new THREE.Vector3();
    direction.subVectors(positionAfter, positionBefore).normalize();
    var jpositionBefore = RPM.getPosition(positionBefore);
    var jpositionAfter = RPM.getPosition(positionAfter);
    var i, j, k, l;
    var startI, endI, startJ, endJ, startK, endK;
    var positionAfterPlus = new THREE.Vector3();
    var testedCollisions = new Array;
    var result, yMountain, floors, maxY, limitY, temp, block;

    yMountain = null;

    // Squares to inspect according to the direction of the object
    if (direction.x > 0) {
        startI = 0;
        endI = object.boundingBoxSettings.w;
    }
    else if (direction.x < 0) {
        startI = -object.boundingBoxSettings.w;
        endI = 0;
    }
    else {
        startI = -object.boundingBoxSettings.w;
        endI = object.boundingBoxSettings.w;
    }
    if (object.boundingBoxSettings.k) {
        startK = 0;
        endK = 0;
    }
    else if (direction.z > 0) {
        startK = 0;
        endK = object.boundingBoxSettings.w;
    }
    else if (direction.z < 0) {
        startK = -object.boundingBoxSettings.w;
        endK = 0;
    }
    else {
        startK = -object.boundingBoxSettings.w;
        endK = object.boundingBoxSettings.w;
    }
    startJ = 0;
    endJ = 0;

    // Check collision outside
    block = false;
    for (i = startI; i <= endI; i++) {
        for (j = startJ; j <= endJ; j++) {
            for (k = startK; k <= endK; k++) {
                positionAfterPlus.set(positionAfter.x + i * RPM.SQUARE_SIZE,
                                      positionAfter.y + j * RPM.SQUARE_SIZE,
                                      positionAfter.z + k * RPM.SQUARE_SIZE);
                portion = RPM.currentMap.getLocalPortion(RPM.getPortion(
                                                          positionAfterPlus));
                mapPortion = RPM.currentMap.getMapPortionByPortion(portion);
                if (mapPortion !== null) {
                    result = mapPortion.checkCollision(jpositionBefore, [
                        jpositionAfter[0] + i, jpositionAfter[1] + j,
                        jpositionAfter[2] + k], positionBefore, positionAfter,
                        object, direction, testedCollisions);
                    if (result[0]) {
                        block = true;
                    } else if (result[1] !== null) {
                        if (yMountain === null || yMountain < result[1]) {
                            yMountain = result[1];
                        }
                    }
                }
            }
        }
    }
    if (block && (yMountain === null)) {
        return [true, null];
    }

    // Check collision inside & with other objects
    if (object !== RPM.game.hero && object.checkCollisionObject(RPM.game.hero,
                                                             positionAfter)) {
        return [true, null];
    }

    // Check objects collisions
    portion = RPM.currentMap.getLocalPortion(RPM.getPortion(positionAfter));
    for (i = 0; i < 2; i++) {
        for (j = 0; j < 2; j++) {
            mapPortion = RPM.currentMap.getMapPortionByPortion([portion[0] + i,
                portion[1], portion[2] + j]);
            if (mapPortion !== null &&
                mapPortion.checkObjectsCollision(object, positionAfter)) {
                return [true, null];
            }
        }
    }

    // Check empty square or square mountain height possible down
    mapPortion = RPM.currentMap.getMapPortionByPortion(portion);
    if (mapPortion !== null) {
        floors = mapPortion.squareNonEmpty[jpositionAfter[0] % RPM.PORTION_SIZE]
            [jpositionAfter[2] % RPM.PORTION_SIZE];
        if (yMountain === null && floors.indexOf(positionAfter.y) === -1) {
            l = floors.length;
            if (l === 0) {
                return [true, null];
            } else {
                maxY = null;
                limitY = positionAfter.y - RPM.datasGame.system
                    .mountainCollisionHeight.getValue();
                for (i = 0; i < l; i++) {
                    temp = floors[i];

                    if (temp <= (positionAfter.y + RPM.datasGame.system
                        .mountainCollisionHeight.getValue()) && temp >= limitY)
                    {
                        if (maxY === null) {
                            maxY = temp;
                        } else {
                            if (maxY < temp) {
                                maxY = temp;
                            }
                        }
                    }
                }

                if (maxY === null) {
                    return [true, null];
                } else {
                    yMountain = maxY;
                }
            }
        }

        // Check lands inside collisions
        return [mapPortion.checkLandsCollisionInside(jpositionBefore,
            jpositionAfter, direction), yMountain];
    }

    return [true, null];
}

// -------------------------------------------------------

MapPortion.applyBoxLandTransforms = function(box, boundingBox) {

    // Cancel previous geometry transforms
    box.geometry.translate(-box.previousTranslate[0],
                           -box.previousTranslate[1],
                           -box.previousTranslate[2]);
    box.geometry.rotateZ(-box.previousRotate[2] * Math.PI / 180.0);
    box.geometry.rotateX(-box.previousRotate[1] * Math.PI / 180.0);
    box.geometry.rotateY(-box.previousRotate[0] * Math.PI / 180.0);
    box.geometry.scale(1 / box.previousScale[0],
                       1 / box.previousScale[1],
                       1 / box.previousScale[2]);

    // Update to the new ones
    box.geometry.scale(boundingBox[3], 1, boundingBox[4]);
    box.geometry.translate(boundingBox[0], boundingBox[1], boundingBox[2]);

    // Register previous transforms to current
    box.previousTranslate = [boundingBox[0], boundingBox[1], boundingBox[2]];
    box.previousRotate = [0, 0, 0];
    box.previousScale = [boundingBox[3], 1, boundingBox[4]];

    // Update geometry now
    box.updateMatrixWorld();
}

// -------------------------------------------------------

MapPortion.applyBoxSpriteTransforms = function(box, boundingBox) {

    // Cancel previous geometry transforms
    box.geometry.translate(-box.previousTranslate[0],
                           -box.previousTranslate[1],
                           -box.previousTranslate[2]);
    box.geometry.rotateZ(-box.previousRotate[2] * Math.PI / 180.0);
    box.geometry.rotateX(-box.previousRotate[1] * Math.PI / 180.0);
    box.geometry.rotateY(-box.previousRotate[0] * Math.PI / 180.0);
    box.geometry.scale(1 / box.previousScale[0],
                       1 / box.previousScale[1],
                       1 / box.previousScale[2]);

    // Update to the new ones
    box.geometry.scale(boundingBox[3], boundingBox[4], boundingBox[5]);
    box.geometry.rotateY(boundingBox[6] * Math.PI / 180.0);
    box.geometry.rotateX(boundingBox[7] * Math.PI / 180.0);
    box.geometry.rotateZ(boundingBox[8] * Math.PI / 180.0);
    box.geometry.translate(boundingBox[0], boundingBox[1], boundingBox[2]);

    // Register previous transforms to current
    box.previousTranslate = [boundingBox[0], boundingBox[1], boundingBox[2]];
    box.previousRotate = [boundingBox[6], boundingBox[7], boundingBox[8]];
    box.previousScale = [boundingBox[3], boundingBox[4], boundingBox[5]];

    // Update geometry now
    box.updateMatrixWorld();
}

// -------------------------------------------------------

MapPortion.applyOrientedBoxTransforms = function(box, boundingBox) {
    var size = Math.floor(boundingBox[3] / Math.sqrt(2));

    // Cancel previous geometry transforms
    box.geometry.translate(-box.previousTranslate[0],
                           -box.previousTranslate[1],
                           -box.previousTranslate[2]);

    box.geometry.rotateY(-Math.PI / 4);
    box.geometry.scale(1 / box.previousScale[0],
                       1 / box.previousScale[1],
                       1 / box.previousScale[2]);

    // Update to the new ones
    box.geometry.scale(size, boundingBox[4], size);
    box.geometry.rotateY(Math.PI / 4);
    box.geometry.translate(boundingBox[0], boundingBox[1], boundingBox[2]);

    // Register previous transforms to current
    box.previousTranslate = [boundingBox[0], boundingBox[1], boundingBox[2]];
    box.previousScale = [size, boundingBox[4], size];

    // Update geometry now
    box.updateMatrixWorld();
}

// -------------------------------------------------------

MapPortion.createBox = function() {
    var box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), RPM.BB_MATERIAL);
    box.previousTranslate = [0, 0, 0];
    box.previousRotate = [0, 0, 0];
    box.previousScale = [1, 1, 1];

    return box;
}

// -------------------------------------------------------

MapPortion.createOrientedBox = function() {
    var box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), RPM.BB_MATERIAL);
    box.previousTranslate = [0, 0, 0];
    box.previousScale = [1, 1, 1];
    box.geometry.rotateY(Math.PI / 4);

    return box;
}

// -------------------------------------------------------

MapPortion.prototype = {

    /** Read the JSON associated to the map portion.
    *   @param {Object} json Json object describing the object.
    *   @param {boolean} isMapHero Indicates if this map is where the hero is
    *   at the beginning of the game.
    */
    read: function(json, isMapHero){
        this.readLands(json.lands);
        this.readSprites(json.sprites);
        if (json.moun) {
            this.readMountains(json.moun);
        }
        if (json.objs3d) {
            this.readObjects3D(json.objs3d);
        }
        this.readObjects(json.objs.list, isMapHero);
        this.overflow = json.overflow;
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the lands in the portion.
    *   @param {Object} json Json object describing the object.
    */
    readLands: function(json){
        this.readFloors(json.floors);
        this.readAutotiles(json.autotiles);
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the floors in the portion.
    *   @param {Object} json Json object describing the object.
    */
    readFloors: function(json){
        var jsonFloor, floor, collision, objCollision, position, boundingBox;
        var material = RPM.currentMap.textureTileset;
        var width = material.map ? material.map.image.width : 0;
        var height = material.map ? material.map.image.height : 0;
        var geometry = new THREE.Geometry();
        var i, j, l, ll, index, count, layers, layer;

        geometry.faceVertexUvs[0] = [];
        layers = [];
        count = 0;
        for (i = 0, l = json.length; i < l; i++) {
            jsonFloor = json[i];
            position = jsonFloor.k;
            layer = RPM.positionLayer(position);
            floor = new Floor();
            floor.read(jsonFloor.v);
            if (layer > 0) {
                for (j = 0, ll = layers.length; j < ll; j++) {
                    if (layer <= RPM.positionLayer(layers[j][0])) {
                        layers.splice(j, 0, [position, floor]);
                        break;
                    }
                }
                if (j === ll) {
                    layers.push([position, floor]);
                }
            } else {
                objCollision = floor.updateGeometry(geometry, position, width,
                    height, count);
                index = RPM.positionJSONToIndex(position);
                if (objCollision !== null) {
                    this.boundingBoxesLands[index].push(objCollision);
                }
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
            index = RPM.positionJSONToIndex(position);
            if (objCollision !== null) {
                this.boundingBoxesLands[index].push(objCollision);
            }
            this.addToNonEmpty(position);
            count++;
        }

        // Creating the plane
        geometry.uvsNeedUpdate = true;
        this.staticFloorsMesh = new THREE.Mesh(geometry, material);
        RPM.currentMap.scene.add(this.staticFloorsMesh);
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the autotiles in the portion.
    *   @param {Object} json Json object describing the object.
    */
    readAutotiles: function(json){
        if (!json)
            return;

        var jsonAutotile;
        var autotile, autotiles, textureAutotile, texture = null, objCollision;
        var i, l, index, autotilesLength = RPM.currentMap.texturesAutotiles.length;
        var position, indexPos;

        // Create autotiles according to the textures
        for (i = 0; i < autotilesLength; i++) {
            this.staticAutotilesList.push(
                 new Autotiles(RPM.currentMap.texturesAutotiles[i]));
        }

        // Read and update geometry
        for (i = 0, l = json.length; i < l; i++) {
            jsonAutotile = json[i];
            position = jsonAutotile.k;
            autotile = new Autotile;
            autotile.read(jsonAutotile.v);
            indexPos = RPM.positionJSONToIndex(position);
            index = 0;
            texture = null;
            for (; index < autotilesLength; index++) {

                textureAutotile = RPM.currentMap.texturesAutotiles[index];
                if (textureAutotile.isInTexture(autotile.autotileID, autotile
                    .texture))
                {
                    texture = textureAutotile;
                    autotiles = this.staticAutotilesList[index];
                    break;
                }
            }

            if (texture !== null && texture.texture !== null) {
                objCollision = autotiles.updateGeometry(position, autotile);
                if (objCollision !== null) {
                    this.boundingBoxesLands[indexPos].push(objCollision);
                }
            }
            this.addToNonEmpty(position);
        }

        // Update all the geometry uvs and put it in the scene
        for (i = 0, l = this.staticAutotilesList.length; i < l; i++) {
            autotiles = this.staticAutotilesList[i];
            autotiles.uvsNeedUpdate = true;
            autotiles.createMesh();
            RPM.currentMap.scene.add(autotiles.mesh);
        }
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the sprites in the portion.
    *   @param {Object} json Json object describing the object.
    */
    readSprites: function(json){
        this.readSpritesWalls(json.walls);
        this.readSpritesGlobals(json.list);
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the sprites in the portion.
    *   @param {Object} json Json object describing the object.
    */
    readSpritesGlobals: function(json){
        var localPosition, plane, s, position, ss, sprite, result;
        var collisions, positionPlus;
        var material = RPM.currentMap.textureTileset;
        var i, count = 0, l;
        var staticGeometry = new THREE.Geometry(), geometry;
        staticGeometry.faceVertexUvs[0] = [];

        if (material && material.map) {
            for (i = 0, l = json.length; i < l; i++) {
                s = json[i];
                position = s.k;
                ss = s.v;
                sprite = new Sprite();
                sprite.read(ss);
                localPosition = RPM.positionToVector3(position);
                if (sprite.kind === ElementMapKind.SpritesFace) {
                    result = sprite.createGeometry(
                                material.map.image.width,
                                material.map.image.height,
                                true, position);
                    geometry = result[0];
                    collisions = result[1][1];
                    plane = new THREE.Mesh(geometry, material);
                    plane.position.set(localPosition.x, localPosition.y,
                                       localPosition.z);
                    this.faceSpritesList.push(plane);
                    RPM.currentMap.scene.add(plane);
                }
                else {
                    result = sprite.updateGeometry(
                                staticGeometry, material.map.image.width,
                                material.map.image.height, position, count,
                                true, localPosition);
                    count = result[0];
                    collisions = result[1];
                }
                this.updateCollisionSprite(collisions, position);
            }
        }

        staticGeometry.uvsNeedUpdate = true;
        this.staticSpritesMesh = new THREE.Mesh(staticGeometry, material);
        RPM.currentMap.scene.add(this.staticSpritesMesh);
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the sprites in the portion.
    *   @param {Object} json Json object describing the object.
    */
    readSpritesWalls: function(json) {
        var i, l, wallsIds, count;
        var hash, geometry, material, obj, mesh, result, collisions;
        wallsIds = RPM.currentMap.texturesWalls.length;
        hash = new Array(wallsIds);
        for (i = 0; i < wallsIds; i++)
            hash[i] = null;

        for (i = 0, l = json.length; i < l; i++) {

            // Getting sprite
            var s = json[i];
            var position = s.k;
            var ss = s.v;
            var sprite = new SpriteWall();
            sprite.read(ss);

            // Constructing the geometry
            obj = hash[sprite.id];
            // If ID exists in this tileset
            if (typeof obj !== 'undefined') {
                if (obj === null) {
                    obj = {};
                    geometry = new THREE.Geometry();
                    geometry.faceVertexUvs[0] = [];
                    material = RPM.currentMap.texturesWalls[sprite.id];
                    count = 0;
                    obj.geometry = geometry;
                    obj.material = material;
                    obj.c = count;
                    hash[sprite.id] = obj;
                } else {
                    geometry = obj.geometry;
                    material = obj.material;
                    count = obj.c;
                }

                if (material && material.map) {
                    result = sprite.updateGeometry(geometry, position, material
                        .map.image.width, material.map.image.height, count);
                    obj.c = result[0];
                    this.updateCollisionSprite(result[1], position);
                }
            }
        }

        for (i = 0; i < wallsIds; i++) {
            obj = hash[i];
            if (obj !== null) {
                geometry = obj.geometry;
                geometry.uvsNeedUpdate = true;
                mesh = new THREE.Mesh(geometry, obj.material);
                this.staticWallsList.push(mesh);
                RPM.gameStack.top().scene.add(mesh);
            }
        }
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the mountains in the portion.
    *   @param {Object} json Json object describing the object.
    */
    readMountains: function(json) {
        if (!json)
            return;

        var i, l, jsonAll, jsonMountain, mountain, mountains, textureMountain,
            texture, objCollision, index, mountainsLength, position, indexPos,
            geometry;

        texture = null;
        mountainsLength = RPM.currentMap.texturesMountains.length;
        jsonAll = json.a;

        // Create mountains according to the textures
        for (i = 0; i < mountainsLength; i++) {
            this.staticMountainsList.push(new Mountains(RPM.currentMap
                .texturesMountains[i]));
        }

        // Read and update geometry
        for (i = 0, l = jsonAll.length; i < l; i++) {
            jsonMountain = jsonAll[i];
            position = jsonMountain.k;
            mountain = new Mountain;
            mountain.read(jsonMountain.v);
            indexPos = RPM.positionJSONToIndex(position);

            index = 0;
            for (; index < mountainsLength; index++) {

                textureMountain = RPM.currentMap.texturesMountains[index];
                if (textureMountain.isInTexture(mountain.mountainID)) {
                    texture = textureMountain;
                    mountains = this.staticMountainsList[index];
                    break;
                }
            }

            if (texture !== null && texture.texture !== null) {
                objCollision = mountains.updateGeometry(position, mountain);
                this.updateCollision(this.boundingBoxesMountains, objCollision,
                    position, true);
            }
        }

        // Update all the geometry uvs and put it in the scene
        for (i = 0, l = this.staticMountainsList.length; i < l; i++) {
            mountains = this.staticMountainsList[i];
            mountains.uvsNeedUpdate = true;
            mountains.createMesh();
            RPM.currentMap.scene.add(mountains.mesh);
        }

        // Handle overflow
        this.overflowMountains = json.o;
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the objects 3D in the portion.
    *   @param {Object} json Json object describing the object.
    */
    readObjects3D: function(json) {
        var i, l, objectsIds, count, o, position, v, obj3D, jsonAll, datas;
        var hash, geometry, material, obj, mesh, result, collisions;

        jsonAll = json.a;
        objectsIds = RPM.currentMap.texturesObjects3D.length;
        hash = new Array(objectsIds);
        for (i = 1; i <= objectsIds; i++) {
            hash[i] = null;
        }
        for (i = 0, l = jsonAll.length; i < l; i++) {

            // Getting object 3D
            o = jsonAll[i];
            position = o.k;
            v = o.v;
            datas = RPM.datasGame.specialElements.objects[v.did];

            if (datas) {
                switch (datas.shapeKind) {
                case ShapeKind.Box:
                    obj3D = new Object3DBox();
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
                    obj3D = new Object3DCustom();
                    break;
                }
                obj3D.read(v, datas);

                // Constructing the geometry
                obj = hash[obj3D.datas.pictureID];
                if (typeof obj !== 'undefined') {
                    if (obj === null) {
                        obj = {};
                        geometry = new THREE.Geometry();
                        geometry.faceVertexUvs[0] = [];
                        material = RPM.currentMap.texturesObjects3D[obj3D.datas
                            .pictureID];
                        count = 0;
                        obj.geometry = geometry;
                        obj.material = material;
                        obj.c = count;
                        hash[obj3D.datas.pictureID] = obj;
                    }
                    else {
                        geometry = obj.geometry;
                        material = obj.material;
                        count = obj.c;
                    }

                    if (material && material.map) {
                        result = obj3D.updateGeometry(geometry, position, count);
                        obj.c = result[0];
                        this.updateCollision(this.boundingBoxesObjects3D, result[1],
                            position);
                    }
                }
            }
        }

        for (i = 1; i <= objectsIds; i++) {
            obj = hash[i];
            if (obj !== null) {
                geometry = obj.geometry;
                geometry.uvsNeedUpdate = true;
                mesh = new THREE.Mesh(geometry, obj.material);
                this.staticObjects3DList.push(mesh);
                RPM.gameStack.top().scene.add(mesh);
            }
        }
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the objects in the portion.
    *   @param {Object} json Json object describing the object.
    *   @param {boolean} isMapHero Indicates if this map is where the hero is
    *   at the beginning of the game.
    */
    readObjects: function(json, isMapHero){
        var datas, objects, objectsM, objectsR, index, i, l, j, ll, lll, id;
        datas = RPM.currentMap.getObjectsAtPortion(this.realX, this.realY,
                                                this.realZ);
        objectsM = datas.m;
        objectsR = datas.r;
        ll = objectsM.length;
        lll = objectsR.length;

        for (i = 0, l = json.length; i < l; i++){
            var jsonObject = json[i];
            var position = jsonObject.k;
            var jsonObjectValue = jsonObject.v;
            var object = new SystemObject;
            object.readJSON(jsonObjectValue);
            id = object.id;

            // Check if the object is moving (so no need to add it to the scene)
            index = -1;
            for (j = 0; j < ll; j++) {
                if (objectsM[j].system.id === id) {
                    index = j;
                    break;
                }
            }
            for (j = 0; j < lll; j++) {
                if (objectsR[j] === id) {
                    index = j;
                    break;
                }
            }

            /* If it is the hero, you should not add it to the list of
            objects to display */
            if ((!isMapHero ||
                RPM.datasGame.system.idObjectStartHero !== object.id) &&
                index === -1)
            {
                var localPosition = RPM.positionToVector3(position);
                position = new THREE.Vector3(localPosition.x,
                                             localPosition.y,
                                             localPosition.z);
                var mapObject = new MapObject(object, position);
                mapObject.changeState();
                this.objectsList.push(mapObject);
            } else {
                this.heroID = object.id;
            }
        }

        // Add moved objects to the scene
        objects = datas.min;
        for (i = 0, l = objects.length; i < l; i++)
            objects[i].addToScene();
        objects = datas.mout;
        for (i = 0, l = objects.length; i < l; i++)
            objects[i].addToScene();
    },

    // -------------------------------------------------------

    /** Remove all the objects from the scene.
    */
    cleanAll: function() {
        var i, l, datas, objects, object, index;
        datas = RPM.game.mapsDatas[RPM.currentMap.id][this.realX][this.realY][this
            .realZ];

        // Static stuff
        RPM.currentMap.scene.remove(this.staticFloorsMesh);
        RPM.currentMap.scene.remove(this.staticSpritesMesh);
        for (i = 0, l = this.faceSpritesList.length; i < l; i++) {
            RPM.currentMap.scene.remove(this.faceSpritesList[i]);
        }
        for (i = 0, l = this.staticWallsList.length; i < l; i++) {
            RPM.currentMap.scene.remove(this.staticWallsList[i]);
        }
        for (i = 0, l = this.staticAutotilesList.length; i < l; i++) {
            RPM.currentMap.scene.remove(this.staticAutotilesList[i].mesh);
        }
        for (i = 0, l = this.staticMountainsList.length; i < l; i++) {
            RPM.currentMap.scene.remove(this.staticMountainsList[i].mesh);
        }
        for (i = 0, l = this.staticObjects3DList.length; i < l; i++) {
            RPM.currentMap.scene.remove(this.staticObjects3DList[i]);
        }

        // Objects
        for (i = 0, l = this.objectsList.length; i < l; i++) {
            RPM.currentMap.scene.remove(this.objectsList[i].mesh);
        }

        // Remove moved objects from the scene
        objects = datas.min;
        for (i = 0, l = objects.length; i < l; i++) {
            objects[i].removeFromScene();
        }
        objects = datas.mout;
        for (i = 0, l = objects.length; i < l; i++) {
            objects[i].removeFromScene();
        }
    },

    // -------------------------------------------------------

    /** Search for the object with the ID.
    *   @param {number} id The ID of the object.
    *   @returns {MapObject}
    */
    getObjFromID: function(json, id) {
        if (json.objs && json.objs.list) {
            json = json.objs.list;
        } else {
            return null;
        }

        for (var i = 0, l = json.length; i < l; i++){
            var jsonObject = json[i];
            var position = jsonObject.k;
            var jsonObjectValue = jsonObject.v;
            var object = new SystemObject;
            if (jsonObjectValue.id === id) {
                object.readJSON(jsonObjectValue);
                var localPosition = RPM.positionToVector3(position);
                position = new THREE.Vector3(localPosition.x,
                                             localPosition.y,
                                             localPosition.z);
                var mapObject = new MapObject(object, position);
                mapObject.changeState();

                return mapObject;
            }
        }

        return null;
    },

    // -------------------------------------------------------

    /** Get hero model.
    *   @param {Object} json Json object describing the object.
    *   @returns {MapObject}
    */
    getHeroModel: function(json){
        json = json.objs.list;
        for (var i = 0, l = json.length; i < l; i++){
            var jsonObject = json[i];
            var position = jsonObject.k;
            var jsonObjectValue = jsonObject.v;

            if (RPM.datasGame.system.idObjectStartHero === jsonObjectValue.id){
                var object = new SystemObject;
                object.readJSON(jsonObjectValue);
                var localPosition = RPM.positionToVector3(position);
                position = new THREE.Vector3(localPosition.x,
                                             localPosition.y,
                                             localPosition.z);
                return new MapObject(object, position, true);
            }
        }

        return null;
    },

    // -------------------------------------------------------

    /** Update the face sprites orientation.
    *   @param {number} angle The angle on the Y axis.
    */
    updateFaceSprites: function(angle){
        var i, l;

        for (i = 0, l = this.faceSpritesList.length; i < l; i++)
            this.faceSpritesList[i].rotation.y = angle;

        for (i = 0, l = this.objectsList.length; i < l; i++)
            this.objectsList[i].update(angle);
    },

    // -------------------------------------------------------

    /** Update the face sprites orientation.
    *   @param {number} angle The angle on the Y axis.
    */
    updateCollisionSprite: function(collisions, position) {
        var objCollision, positionPlus, z;

        for (var i = 0, l = collisions.length; i < l; i++) {
            objCollision = collisions[i];
            for (var a = -objCollision.w; a <= objCollision.w; a++)
            {
                for (var b = -objCollision.h; b <= objCollision.h; b++)
                {
                    z = objCollision.k ? 0 : objCollision.w;
                    for (var c = -z; c <= z; c++)
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
        }
    },

    // -------------------------------------------------------

    updateCollision: function(boundingBoxes, collisions, position, side) {
        var i, l, a, b, c, minW, maxW, minH, maxH, minD, maxD, objCollision,
            positionPlus, objCollisionPlus;

        for (i = 0, l = collisions.length; i < l; i++) {
            objCollision = collisions[i];
            if (side) {
                minW = -objCollision.w;
                maxW = objCollision.w;
                minH = -objCollision.h;
                maxH = objCollision.h;
                minD = -objCollision.d;
                maxD = objCollision.d;

            } else {
                minW = 0;
                maxW = objCollision.m;
                minH = 0;
                maxH = objCollision.m;
                minD = 0;
                maxD = objCollision.m;
            }
            for (a = minW; a <= maxW; a++) {
                for (b = minH; b <= maxH; b++) {
                    for (c = minD; c <= maxD; c++) {
                        positionPlus = [
                            position[0] + a,
                            position[1] + b,
                            position[3] + c
                        ];
                        if (RPM.currentMap.isInMap(positionPlus) && this
                            .isPositionIn(positionPlus))
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

                            boundingBoxes[RPM.positionToIndex(positionPlus)]
                                .push(objCollisionPlus);
                        }
                    }
                }
            }
        }
    },

    // -------------------------------------------------------

    getObjectCollisionAt: function(positionSource, positionTarget, kind) {
        var i, l, objCollision, index, a, c, result, collisions, w;

        result = new Array;
        switch (kind) {
        case ElementMapKind.Mountains:
            a = positionTarget[0] - positionSource[0];
            c = positionTarget[2] - positionSource[3];
            collisions = this.boundingBoxesMountains[RPM.positionJSONToIndex(
                positionSource)];
            for (i = 0, l = collisions.length; i < l; i++) {
                w = collisions[i].w;
                if (a >= -w && a <= w && c >= -w && c <= w) {
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
    },

    // -------------------------------------------------------

    addToNonEmpty: function(position) {
        this.squareNonEmpty[position[0] % RPM.PORTION_SIZE][position[3] %
            RPM.PORTION_SIZE].push(RPM.positionTotalY(position));
    },

    // -------------------------------------------------------

    isPositionIn: function(position) {
        return this.realX === Math.floor(position[0] / RPM.PORTION_SIZE) && this
            .realY === Math.floor(position[1] / RPM.PORTION_SIZE) && this.realZ ===
            Math.floor(position[2] / RPM.PORTION_SIZE);
    },

    // -------------------------------------------------------

    /** Check if there is a collision at this position.
    *   @returns {boolean}
    */
    checkCollision: function(jpositionBefore, jpositionAfter, positionBefore,
                             positionAfter, object, direction, testedCollisions)
    {
        var result;

        // Check mountain collision first for elevation
        result = this.checkMountainsCollision(jpositionAfter, positionAfter,
                                                  testedCollisions, object);
        if (result[0]) {
            return result;
        }

        // Check other tests
        return [(this.checkLandsCollision(jpositionBefore, jpositionAfter,
                                     positionBefore, positionAfter, object,
                                     direction, testedCollisions) ||
                this.checkSpritesCollision(jpositionAfter, testedCollisions,
                                           object) ||
                this.checkObjects3DCollision(jpositionAfter, testedCollisions,
                                           object)), result[1]];
    },

    // -------------------------------------------------------

    /** Check if there is a collision with floors at this position.
    *   @returns {boolean}
    */
    checkLandsCollision: function(jpositionBefore, jpositionAfter,
                                  positionBefore, positionAfter, object,
                                  direction, testedCollisions)
    {
        var objCollision, positionCollision, boundingBox, collision, lands;
        var i, l, index;

        index = RPM.positionToIndex(jpositionAfter);
        lands = this.boundingBoxesLands[index];
        if (lands !== null) {
            for (i = 0, l = lands.length; i < l; i++) {
                objCollision = lands[i];
                if (testedCollisions.indexOf(objCollision) === -1) {
                    testedCollisions.push(objCollision);
                    boundingBox = objCollision.b;
                    collision = objCollision.c;

                    if (this.checkIntersectionLand(collision, boundingBox,
                                                   object) ||
                        this.checkDirections(jpositionBefore, jpositionAfter,
                                             collision, boundingBox, direction,
                                             object)) {
                        return true;
                    }
                }
            }
        }

        return false;
    },

    // -------------------------------------------------------

    /** Check if there is a collision with floors at this position.
    *   @returns {boolean}
    */
    checkLandsCollisionInside: function(jpositionBefore, jpositionAfter,
                                        direction)
    {
        var lands = this.boundingBoxesLands[
                    RPM.positionToIndex(jpositionBefore)];
        var i, l, objCollision, positionCollision, collision;

        if (lands !== null) {
            for (i = 0, l = lands.length; i < l; i++) {
                objCollision = lands[i];
                collision = objCollision.c;
                if (this.checkDirectionsInside(
                         jpositionBefore, jpositionAfter, collision,
                         direction)) {
                    return true;
                }
            }
        }

        return false;
    },

    // -------------------------------------------------------

    /** Check intersection between ray and an object.
    *   @returns {boolean}
    */
    checkIntersectionLand: function(collision, boundingBox, object) {
        if (collision !== null)
            return false;

        MapPortion.applyBoxLandTransforms(RPM.BB_BOX, boundingBox);

        return CollisionsUtilities.obbVSobb(object.currentBoundingBox.geometry,
                                            RPM.BB_BOX.geometry);
    },

    // -------------------------------------------------------

    /** Check directions.
    *   @returns {boolean}
    */
    checkDirections: function(jpositionBefore, jpositionAfter, collision,
                              boundingBox, direction, object)
    {
        if (collision === null)
            return false;

        if (jpositionBefore[0] !== jpositionAfter[0] ||
            jpositionBefore[1] !== jpositionAfter[1] ||
            jpositionBefore[2] !== jpositionAfter[2])
        {
            if (this.checkIntersectionLand(null, boundingBox, object)) {
                if (direction.x > 0)
                    return !collision.left;
                if (direction.x < 0)
                    return !collision.right;
                if (direction.z > 0)
                    return !collision.top;
                if (direction.z < 0)
                    return !collision.bot;
           }
        }

        return false;
    },

    // -------------------------------------------------------

    /** Check directions.
    *   @returns {boolean}
    */
    checkDirectionsInside: function(jpositionBefore, jpositionAfter, collision,
                                    direction)
    {
        if (collision === null)
            return false;

        if (jpositionBefore[0] !== jpositionAfter[0] ||
            jpositionBefore[1] !== jpositionAfter[1] ||
            jpositionBefore[2] !== jpositionAfter[2])
        {
            if (direction.x > 0)
                return !collision.right;
            if (direction.x < 0)
                return !collision.left;
            if (direction.z > 0)
                return !collision.bot;
            if (direction.z < 0)
                return !collision.top;
        }

        return false;
    },

    // -------------------------------------------------------

    /** Check if there is a collision with sprites at this position.
    *   @returns {boolean}
    */
    checkSpritesCollision: function(jpositionAfter, testedCollisions, object)
    {
        var sprites = this.boundingBoxesSprites[
                      RPM.positionToIndex(jpositionAfter)];
        var i, l, objCollision;

        if (sprites !== null) {
            for (i = 0, l = sprites.length; i < l; i++) {
                objCollision = sprites[i];
                if (testedCollisions.indexOf(objCollision) === -1) {
                    testedCollisions.push(objCollision);

                    if (this.checkIntersectionSprite(objCollision.b,
                                                     objCollision.k, object)) {
                        return true;
                    }
                }
            }
        }

        return false;
    },

    // -------------------------------------------------------

    /** Check intersection between ray and an object.
    *   @returns {boolean}
    */
    checkIntersectionSprite: function(boundingBox, fix, object) {
        if (boundingBox === null)
            return false;

        if (fix) {
            MapPortion.applyBoxSpriteTransforms(RPM.BB_BOX, boundingBox);
            return CollisionsUtilities.obbVSobb(
                   object.currentBoundingBox.geometry, RPM.BB_BOX.geometry);
        }
        else {
            MapPortion.applyOrientedBoxTransforms(RPM.BB_ORIENTED_BOX,
                                                  boundingBox);
            return CollisionsUtilities.obbVSobb(
                   object.currentBoundingBox.geometry,
                   RPM.BB_ORIENTED_BOX.geometry);
        }
    },

    // -------------------------------------------------------

    /** Check if there is a collision with sprites at this position.
    *   @returns {boolean}
    */
    checkObjects3DCollision: function(jpositionAfter, testedCollisions, object)
    {
        var objects3D;
        var i, l, objCollision;

        objects3D = this.boundingBoxesObjects3D[RPM.positionToIndex(
            jpositionAfter)];
        if (objects3D !== null) {
            for (i = 0, l = objects3D.length; i < l; i++) {
                objCollision = objects3D[i];
                if (testedCollisions.indexOf(objCollision) === -1) {
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
    },

    // -------------------------------------------------------

    /** Check if there is a collision with mountains at this position.
    *   @returns {boolean}
    */
    checkMountainsCollision: function(jpositionAfter, positionAfter,
        testedCollisions, object)
    {
        var i, j, l, ll, mountains, result, yMountain, block, overflow,
            positionOverflow, mapPortion, objCollision;

        yMountain = null;
        mountains = this.boundingBoxesMountains[RPM.positionToIndex(
            jpositionAfter)];
        block = false;
        if (mountains !== null) {
            for (i = 0, l = mountains.length; i < l; i++) {
                result = this.checkMountainCollision(jpositionAfter,
                    positionAfter, testedCollisions, object, mountains[i],
                    yMountain, block);
                if (result[0]) {
                    return [result[1], result[2]];
                } else {
                    block = result[1];
                    yMountain = result[2];
                }
            }
        }
        for (i = 0, l = this.overflowMountains.length; i < l; i++) {
            positionOverflow = this.overflowMountains[i];
            mapPortion = RPM.currentMap.getMapPortionByPosition(positionOverflow);
            objCollision = mapPortion.getObjectCollisionAt(positionOverflow,
                jpositionAfter, ElementMapKind.Mountains);
            for (j = 0, ll = objCollision.length; j < ll; j++) {
                result = this.checkMountainCollision(jpositionAfter,
                    positionAfter, testedCollisions, object, objCollision[j],
                    yMountain, block);
                if (result[0]) {
                    return [result[1], result[2]];
                } else {
                    block = result[1];
                    yMountain = result[2];
                }
            }
        }

        return [block && (yMountain === null), yMountain];
    },

    // -------------------------------------------------------

    /** Check if there is a collision with mountains at this position.
    *   @returns {boolean}
    */
    checkMountainCollision: function(jpositionAfter, positionAfter,
        testedCollisions, object, objCollision, yMountain, block)
    {
        var result;

        if (testedCollisions.indexOf(objCollision) === -1) {
            testedCollisions.push(objCollision);
            result = this.checkIntersectionMountain(jpositionAfter,
                positionAfter, objCollision, object);
            if (result[0]) {
                if (result[1] === null) {
                    return [true, result[0], result[1]];
                } else {
                    block = true;
                }
            } else if (result[1] !== null) {
                if (yMountain === null || yMountain < result[1]) {
                    yMountain = result[1];
                }
            }
        }

        return [false, block, yMountain]
    },

    // -------------------------------------------------------

    checkIntersectionMountain: function(jpositionAfter, positionAfter,
        objCollision, object) {
        var point, result, x, y, z, w, h, plane, ray, pA, pB, pC, ptA, ptB, ptC,
            newPosition, mountain, forceAlways, forceNever;

        mountain = objCollision.t;
        forceAlways = mountain.getSystem().forceAlways();
        forceNever = mountain.getSystem().forceNever();
        point = new THREE.Vector2(positionAfter.x, positionAfter.z);
        x = objCollision.l.x;
        y = objCollision.l.y;
        z = objCollision.l.z;
        w = objCollision.rw;
        h = objCollision.rh;

        if (positionAfter.y <= (y + objCollision.rh)) {
            // if w = 0, check height
            if (objCollision.rw === 0) {
                if (CollisionsUtilities.isPointOnRectangle(point, x, x +
                    RPM.SQUARE_SIZE, z, z + RPM.SQUARE_SIZE))
                {
                    return forceAlways || -(!forceNever && ((y + objCollision.rh
                        ) <= (positionAfter.y + RPM.datasGame.system
                        .mountainCollisionHeight.getValue()))) ? [false, y +
                        objCollision.rh] : [true, null];
                }
            } else { // if w > 0, go like a slope
                // Create a plane and ray for calculatin intersection
                plane = new THREE.Plane();
                ray = new THREE.Ray(new THREE.Vector3(positionAfter.x, y,
                    positionAfter.z), new THREE.Vector3(0, 1, 0));
                newPosition = new THREE.Vector3();

                // Get coplanar points according to side
                if (objCollision.left && !mountain.left) {
                    if (objCollision.top && !mountain.top) {
                        ptA = new THREE.Vector2(x - w, z);
                        ptB = new THREE.Vector2(x, z);
                        ptC = new THREE.Vector2(x, z - w);
                        if (CollisionsUtilities.isPointOnTriangle(point, ptA,
                            ptB, ptC))
                        {
                            pA = new THREE.Vector3(ptA.x, y, ptA.y);
                            pB = new THREE.Vector3(ptB.x, y + h, ptB.y);
                            pC = new THREE.Vector3(ptC.x, y, ptC.y);
                        } else {
                            return [false, null];
                        }
                    } else if (objCollision.bot && !mountain.bot) {
                        ptA = new THREE.Vector2(x - w, z + RPM.SQUARE_SIZE);
                        ptB = new THREE.Vector2(x, z + RPM.SQUARE_SIZE);
                        ptC = new THREE.Vector2(x, z + RPM.SQUARE_SIZE + w);
                        if (CollisionsUtilities.isPointOnTriangle(point, ptA,
                            ptB, ptC))
                        {
                            pA = new THREE.Vector3(ptA.x, y, ptA.y);
                            pB = new THREE.Vector3(ptB.x, y + h, ptB.y);
                            pC = new THREE.Vector3(ptC.x, y, ptC.y);
                        } else {
                            return [false, null];
                        }
                    } else {
                        if (CollisionsUtilities.isPointOnRectangle(point, x - w,
                            x, z, z + RPM.SQUARE_SIZE))
                        {
                            pA = new THREE.Vector3(x - w, y, z);
                            pB = new THREE.Vector3(x, y + h, z);
                            pC = new THREE.Vector3(x, y + h, z + RPM.SQUARE_SIZE);
                        } else {
                            return [false, null];
                        }
                    }
                } else if (objCollision.right && !mountain.right) {
                    if (objCollision.top && !mountain.top) {
                        ptA = new THREE.Vector2(x + RPM.SQUARE_SIZE, z - w);
                        ptB = new THREE.Vector2(x + RPM.SQUARE_SIZE, z);
                        ptC = new THREE.Vector2(x + RPM.SQUARE_SIZE + w, z);
                        if (CollisionsUtilities.isPointOnTriangle(point, ptA,
                            ptB, ptC))
                        {
                            pA = new THREE.Vector3(ptA.x, y, ptA.y);
                            pB = new THREE.Vector3(ptB.x, y + h, ptB.y);
                            pC = new THREE.Vector3(ptC.x, y, ptC.y);
                        } else {
                            return [false, null];
                        }
                    } else if (objCollision.bot && !mountain.bot) {
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
                        } else {
                            return [false, null];
                        }
                    } else {
                        if (CollisionsUtilities.isPointOnRectangle(point, x +
                            RPM.SQUARE_SIZE, x + RPM.SQUARE_SIZE + w, z, z +
                            RPM.SQUARE_SIZE))
                        {
                            pA = new THREE.Vector3(x + RPM.SQUARE_SIZE, y + h, z +
                                RPM.SQUARE_SIZE);
                            pB = new THREE.Vector3(x + RPM.SQUARE_SIZE, y + h, z);
                            pC = new THREE.Vector3(x + RPM.SQUARE_SIZE + w, y, z);
                        } else {
                            return [false, null];
                        }
                    }
                } else {
                    if (objCollision.top && !mountain.top) {
                        if (CollisionsUtilities.isPointOnRectangle(point, x, x +
                            RPM.SQUARE_SIZE, z - w, z))
                        {
                            pA = new THREE.Vector3(x, y + h, z);
                            pB = new THREE.Vector3(x, y, z - w);
                            pC = new THREE.Vector3(x + RPM.SQUARE_SIZE, y, z - w);
                        } else {
                            return [false, null];
                        }
                    } else if (objCollision.bot && !mountain.bot) {
                        if (CollisionsUtilities.isPointOnRectangle(point, x, x +
                            RPM.SQUARE_SIZE, z + RPM.SQUARE_SIZE, z + RPM.SQUARE_SIZE + w))
                        {
                            pA = new THREE.Vector3(x + RPM.SQUARE_SIZE, y, z +
                                RPM.SQUARE_SIZE + w);
                            pB = new THREE.Vector3(x, y, z + RPM.SQUARE_SIZE + w);
                            pC = new THREE.Vector3(x, y + h, z + RPM.SQUARE_SIZE);
                        } else {
                            return [false, null];
                        }
                    } else {
                        return [false, null];
                    }
                }

                // If angle limit, block
                if (forceNever || (!forceAlways && mountain.angle > RPM.datasGame
                    .system.mountainCollisionAngle.getValue()))
                {
                    return [true, null];
                }

                // get the intersection point for updating mountain y
                plane.setFromCoplanarPoints(pA, pB, pC);
                ray.intersectPlane(plane, newPosition);

                return [!forceAlways && (Math.abs(newPosition.y - positionAfter
                    .y) > RPM.datasGame.system.mountainCollisionHeight.getValue()),
                    newPosition.y];
            }
        }

        return [false, null];
    },

    // -------------------------------------------------------

    /** Check collision with objects.
    *   @returns {boolean}
    */
    checkObjectsCollision: function(object, position) {
        var datas = RPM.currentMap.getObjectsAtPortion(this.realX, this.realY,
                                                    this.realZ);

        return this.checkObjectsCollisionList(this.objectsList, object,
                                              position) ||
               this.checkObjectsCollisionList(datas.min, object, position) ||
               this.checkObjectsCollisionList(datas.mout, object, position);
    },

    // -------------------------------------------------------

    /** Check collision with objects.
    *   @returns {boolean}
    */
    checkObjectsCollisionList: function(list, object, position) {
        var obj;

        for (var i = 0, l = list.length; i < l; i++) {
            obj = list[i];
            if (obj !== object && object.isInRect(obj)) {
                if (object.checkCollisionObject(obj, position))
                    return true;
            }
        }

        return false;
    }
}
