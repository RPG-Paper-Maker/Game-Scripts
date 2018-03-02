/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
*   Enum for the different map elements kind.
*   @enum {number}
*   @readonly
*/
var ElementMapKind = {
    None: 0,
    Floors: 1,
    Autotiles: 2,
    Water: 3,
    SpritesFace: 4,
    SpritesFix: 5,
    SpritesDouble: 6,
    SpritesQuadra: 7,
    SpritesWall: 8,
    Object: 9
};
Object.freeze(ElementMapKind);

// -------------------------------------------------------
//
//  [CLASS MapPortion]
//
//  A portion of the map.
//
//  @positionOrigin          -> The position of the origin of the portion.
//  @staticFloorsList        -> List of all the sprites in the scene.
//  @staticSpritesList       -> List of all the sprites in the scene.
//  @objectsList             -> List of all the objects in the portion.
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
function MapPortion(realX, realY, realZ){
    var i, l;

    this.realX = realX;
    this.realY = realY;
    this.realZ = realZ;
    this.staticFloorsMesh = null;
    this.staticSpritesMesh = null;
    l = $PORTION_SIZE * $PORTION_SIZE;
    this.boundingBoxesLands = new Array($PORTION_SIZE * $PORTION_SIZE);
    this.boundingBoxesSprites = new Array($PORTION_SIZE * $PORTION_SIZE);
    for (i = 0; i < l; i++) {
        this.boundingBoxesLands[i] = new Array;
        this.boundingBoxesSprites[i] = new Array;
    }
    this.staticAutotilesMesh = new Array;
    this.objectsList = new Array;
    this.faceSpritesList = new Array;
    this.staticWallsList = new Array;
}

MapPortion.checkCollisionRay = function(positionBefore, positionAfter, object) {
    var portion, mapPortion;
    var direction = new THREE.Vector3();
    direction.subVectors(positionAfter, positionBefore).normalize();
    var ray = new THREE.Ray(positionBefore, direction);
    portion = $currentMap.getLocalPortion(RPM.getPortion(positionAfter));
    mapPortion = $currentMap.getMapPortionByPortion(portion);
    var jpositionBefore = RPM.getPosition(positionBefore);
    var jpositionAfter = RPM.getPosition(positionAfter);

    // Check collision outside
    if (mapPortion.checkCollision(jpositionBefore, jpositionAfter,
                                  positionBefore, positionAfter, object,
                                  direction))
    {
        return true;
    }

    // Check collision inside
    portion = $currentMap.getLocalPortion(RPM.getPortion(positionAfter));
    mapPortion = $currentMap.getMapPortionByPortion(portion);

    return mapPortion.checkLandsCollisionInside(jpositionBefore, jpositionAfter,
                                                direction);
}

MapPortion.prototype = {

    /** Read the JSON associated to the map portion.
    *   @param {Object} json Json object describing the object.
    *   @param {boolean} isMapHero Indicates if this map is where the hero is
    *   at the beginning of the game.
    */
    read: function(json, isMapHero){
        this.readLands(json.lands);
        this.readSprites(json.sprites);
        this.readObjects(json.objs.list, isMapHero);
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
        var tilesetCollisions = $currentMap.mapInfos.tileset.collisions;
        var material = $currentMap.textureTileset;
        var width = material.map.image.width;
        var height = material.map.image.height;
        var geometry = new THREE.Geometry();
        geometry.faceVertexUvs[0] = [];

        for (var i = 0, length = json.length; i < length; i++){
            jsonFloor = json[i];
            position = jsonFloor.k;
            floor = new Floor();
            floor.read(jsonFloor.v);
            objCollision = floor.updateGeometry(geometry, position, width,
                                               height, i);
            if (objCollision !== null) {
                this.boundingBoxesLands[RPM.positionJSONToIndex(position)]
                .push(objCollision);
            }
        }

        geometry.uvsNeedUpdate = true;

        // Creating the plane
        this.staticFloorsMesh = new THREE.Mesh(geometry, material);
        $currentMap.scene.add(this.staticFloorsMesh);
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the autotiles in the portion.
    *   @param {Object} json Json object describing the object.
    */
    readAutotiles: function(json){
        if (!json)
            return;

        var jsonAutotile;
        var autotile, autotiles, textureAutotile, texture = null;
        var i, l, index, autotilesLength = $currentMap.texturesAutotiles.length;

        // Create autotiles according to the textures
        for (i = 0; i < autotilesLength; i++) {
            this.staticAutotilesMesh.push(
                 new Autotiles($currentMap.texturesAutotiles[i]));
        }

        // Read and update geometry
        for (i = 0, l = json.length; i < l; i++) {
            jsonAutotile = json[i];
            autotile = new Autotile;
            autotile.read(jsonAutotile.v);

            index = 0;
            for (; index < autotilesLength; index++) {

                textureAutotile = $currentMap.texturesAutotiles[index];
                if (textureAutotile.isInTexture(autotile.autotileID,
                                                autotile.texture))
                {
                    texture = textureAutotile;
                    autotiles = this.staticAutotilesMesh[index];
                    break;
                }
            }

            if (texture !== null && texture.texture !== null)
                autotiles.updateGeometry(jsonAutotile.k, autotile);
        }

        // Update all the geometry uvs and put it in the scene
        for (i = 0, l = this.staticAutotilesMesh.length; i < l; i++) {
            autotiles = this.staticAutotilesMesh[i];
            autotiles.uvsNeedUpdate = true;
            autotiles.createMesh();
            $currentMap.scene.add(autotiles.mesh);
        }
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the sprites in the portion.
    *   @param {Object} json Json object describing the object.
    */
    readSprites: function(json){
        this.readSpritesGlobals(json.list);
        this.readSpritesWalls(json.walls);
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the sprites in the portion.
    *   @param {Object} json Json object describing the object.
    */
    readSpritesGlobals: function(json){
        var localPosition, plane, s, position, ss, sprite, objCollision, result;
        var collisions, positionPlus;
        var material = $currentMap.textureTileset;
        var i, c = 0, l, j, ll, a, b;
        var staticGeometry = new THREE.Geometry(), geometry;
        staticGeometry.faceVertexUvs[0] = [];

        for (i = 0, l = json.length; i < l; i++) {
            s = json[i];
            position = s.k;
            ss = s.v;
            sprite = new Sprite();
            sprite.read(ss);
            localPosition = RPM.positionToVector3(position);
            if (sprite.kind === ElementMapKind.SpritesFace) {
                objCollision = null;
                geometry = sprite.createGeometry(material.map.image.width,
                                                 material.map.image.height,
                                                 true, position);
                plane = new THREE.Mesh(geometry, material);
                plane.position.set(localPosition.x, localPosition.y,
                                   localPosition.z);
                this.faceSpritesList.push(plane);
                $currentMap.scene.add(plane);
            }
            else {
                result = sprite.updateGeometry(
                                staticGeometry, material.map.image.width,
                                material.map.image.height, position, c, true,
                                localPosition);
                c = result[0];
                collisions = result[1];
                for (j = 0, ll = collisions.length; j < ll; j++) {
                    objCollision = collisions[j];
                    for (a = -objCollision.w; a <= objCollision.w; a++)
                    {
                        for (b = -objCollision.h; b < objCollision.h;
                             b++)
                        {
                            positionPlus = [
                                position[0] + a,
                                position[1],
                                position[3] + b
                            ];
                            if ($currentMap.isInMap(positionPlus)) {
                                this.boundingBoxesSprites[
                                    RPM.positionToIndex(positionPlus)
                                ] = objCollision;
                            }
                        }
                    }
                }
            }
        }

        staticGeometry.uvsNeedUpdate = true;
        this.staticSpritesMesh = new THREE.Mesh(staticGeometry, material);
        $currentMap.scene.add(this.staticSpritesMesh);
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the sprites in the portion.
    *   @param {Object} json Json object describing the object.
    */
    readSpritesWalls: function(json) {
        var i, l, wallsIds, c;
        var hash, geometry, material, obj, mesh;
        wallsIds = $currentMap.texturesWalls.length;
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
            if (obj === null) {
                obj = {};
                geometry = new THREE.Geometry();
                geometry.faceVertexUvs[0] = [];
                material = $currentMap.texturesWalls[sprite.id];
                c = 0;
                obj.geometry = geometry;
                obj.material = material;
                obj.c = c;
                hash[sprite.id] = obj;
            }
            else {
                geometry = obj.geometry;
                material = obj.material;
                c = obj.c;
            }

            obj.c = sprite.updateGeometry(geometry, position,
                                          material.map.image.width,
                                          material.map.image.height, c);
        }

        for (i = 0; i < wallsIds; i++) {
            obj = hash[i];
            if (obj !== null) {
                geometry = obj.geometry;
                geometry.uvsNeedUpdate = true;
                mesh = new THREE.Mesh(geometry, obj.material);
                this.staticWallsList.push(mesh);
                $gameStack.top().scene.add(mesh);
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
        var datas, objects, index, i, l, j, ll;
        datas = $game.mapsDatas
                [$currentMap.id][this.realX][this.realY][this.realZ];
        objects = datas.m;
        ll = objects.length;

        for (i = 0, l = json.length; i < l; i++){
            var jsonObject = json[i];
            var position = jsonObject.k;
            var jsonObjectValue = jsonObject.v;
            var object = new SystemObject;
            object.readJSON(jsonObjectValue);

            // Check if the object is moving (so no need to add it to the scene)
            index = -1;
            for (j = 0; j < ll; j++) {
                if (objects[j].system.id === object.id) {
                    index = j;
                    break;
                }
            }

            /* If it is the hero, you should not add it to the list of
            objects to display */
            if ((!isMapHero ||
                $datasGame.system.idObjectStartHero !== object.id) &&
                index === -1)
            {
                var localPosition = RPM.positionToVector3(position);
                position = new THREE.Vector3(localPosition.x,
                                             localPosition.y,
                                             localPosition.z);
                var mapObject = new MapObject(object, position);
                mapObject.changeState();
                this.objectsList.push(mapObject);
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

    /** Get the THREE mesh for a sprite.
    *   @param {number[]} position The position of the mesh.
    *   @param {Three.material} material The material used for this mesh.
    *   @param {Sprite} sprite The sprite.
    */
    getSpriteMesh: function(position, material, sprite){
        var localPosition = RPM.positionToVector3(position);
        var geometry = sprite.createGeometry(material.map.image.width,
                                             material.map.image.height,
                                             false, position);
        var plane = new THREE.Mesh(geometry, material);
        plane.position.set(localPosition.x,
                           localPosition.y,
                           localPosition.z);

        return plane;
    },

    // -------------------------------------------------------

    /** Remove all the objects from the scene.
    */
    cleanAll: function(){
        var i, l, datas, objects, object, index;
        datas = $game.mapsDatas
                [$currentMap.id][this.realX][this.realY][this.realZ];

        // Static stuff
        $currentMap.scene.remove(this.staticFloorsMesh);
        $currentMap.scene.remove(this.staticSpritesMesh);
        for (i = 0, l = this.faceSpritesList.length; i < l; i++)
            $currentMap.scene.remove(this.faceSpritesList[i]);
        for (i = 0, l = this.staticWallsList.length; i < l; i++)
            $currentMap.scene.remove(this.staticWallsList[i]);

        // Objects
        for (i = 0, l = this.objectsList.length; i < l; i++)
            $currentMap.scene.remove(this.objectsList[i].mesh);

        // Remove moved objects from the scene
        objects = datas.min;
        for (i = 0, l = objects.length; i < l; i++)
            objects[i].removeFromScene();
        objects = datas.mout;
        for (i = 0, l = objects.length; i < l; i++)
            objects[i].removeFromScene();
    },

    // -------------------------------------------------------

    /** Search for the object with the ID.
    *   @param {number} id The ID of the object.
    *   @returns {MapObject}
    */
    getObjFromID: function(json, id){
        for (var i = 0, l = json.length; i < l; i++){
            var jsonTextures = json[i];
            var texture = jsonTextures.k;
            var jsonObjects = jsonTextures.v;
            for (var j = 0, ll = jsonObjects.length; j < ll; j++){
                var jsonObject = jsonObjects[j];
                var position = jsonObject.k;
                var jsonObjectValue = jsonObject.v;
                var object = new SystemObject;
                if (jsonObjectValue.id === id){
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

            if ($datasGame.system.idObjectStartHero === jsonObjectValue.id){
                var object = new SystemObject;
                object.readJSON(jsonObjectValue);
                var localPosition = RPM.positionToVector3(position);
                position = new THREE.Vector3(localPosition.x,
                                             localPosition.y,
                                             localPosition.z);
                return new MapObject(object, position);
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

    /** Check if there is a collision at this position.
    *   @returns {boolean}
    */
    checkCollision: function(jpositionBefore, jpositionAfter, positionBefore,
                             positionAfter, object, direction)
    {
        if (this.checkLandsCollision(jpositionBefore, jpositionAfter,
                                     positionBefore, positionAfter, object,
                                     direction))
        {
            return true;
        }

        return false;
    },

    // -------------------------------------------------------

    /** Check if there is a collision with floors at this position.
    *   @returns {boolean}
    */
    checkLandsCollision: function(jpositionBefore, jpositionAfter,
                                  positionBefore, positionAfter, object,
                                  direction)
    {
        var lands = this.boundingBoxesLands[
                    RPM.positionToIndex(jpositionAfter)];
        var i, l, objCollision, positionCollision, boundingBox, collision;

        if (lands !== null) {
            for (i = 0, l = lands.length; i < l; i++) {
                objCollision = lands[i];
                boundingBox = objCollision.b;
                collision = objCollision.c;
                if (this.checkIntersectionObject(positionBefore,
                                                 positionAfter, boundingBox,
                                                 object, direction) ||
                    this.checkDirections(jpositionBefore, jpositionAfter,
                                         collision, direction))
                {
                    return true;
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
                         direction))
                {
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
    checkIntersectionObject: function(positionBefore, positionAfter,
                                      boundingBox, object, direction)
    {
        if (boundingBox === null)
            return false;

        var objectVertices = object.geometry.vertices;

        // Apply geometry transforms to bounding box
        $BB_BOX.position.set(boundingBox[0], boundingBox[1], boundingBox[2]);
        $BB_BOX.geometry.scale(boundingBox[3] / $BB_BOX.previousScale[0], 1,
                           boundingBox[4] / $BB_BOX.previousScale[2]);
        $BB_BOX.previousScale = [boundingBox[3], 1, boundingBox[4]];
        $BB_BOX.updateMatrixWorld();
        var boundingBoxVertices = $BB_BOX.geometry.vertices;

        var p = new THREE.Vector3(), ray = new THREE.Raycaster();
        var collisionResults;
        var simpleTest = false;
        var i, j, l, ll;
        for (i = 0, l = objectVertices.length; i < l; i++) {
            p.set(positionBefore.x + objectVertices[i].x,
                  positionBefore.y + objectVertices[i].y,
                  positionBefore.z + objectVertices[i].z);
            ray.set(p, direction);
            collisionResults = ray.intersectObject($BB_BOX, true);
            if (collisionResults.length > 0) {
                var invertDirection = direction.clone();
                invertDirection.negate();
                for (j = 0, ll = objectVertices.length; j < ll; j++) {
                    p.set(positionAfter.x + objectVertices[j].x,
                          positionAfter.y + objectVertices[j].y,
                          positionAfter.z + objectVertices[j].z);
                    ray.set(p, invertDirection);
                    collisionResults = ray.intersectObject($BB_BOX, true);
                    if (collisionResults.length > 0)
                        return true;
                }
            }
        }
        object.position.set(positionAfter.x, positionAfter.y, positionAfter.z);
        object.updateMatrixWorld();
        for (j = 0, ll = boundingBoxVertices.length; j < ll; j++) {
            p.set(boundingBox[0] + boundingBoxVertices[j].x,
                  boundingBox[1] + boundingBoxVertices[j].y,
                  boundingBox[2] + boundingBoxVertices[j].z);
            ray.set(p, direction);
            collisionResults = ray.intersectObject(object, true);
            if (collisionResults.length > 0) {
                object.position.set(positionBefore.x, positionBefore.y,
                                    positionBefore.z);
                object.updateMatrixWorld();
                return true;
            }
        }
        object.position.set(positionBefore.x, positionBefore.y,
                            positionBefore.z);
        object.updateMatrixWorld();

        return false;
    },

    // -------------------------------------------------------

    /** Check directions.
    *   @returns {boolean}
    */
    checkDirections: function(jpositionBefore, jpositionAfter, collision,
                              direction)
    {
        if (collision === null)
            return false;

        if (jpositionBefore[0] !== jpositionAfter[0] ||
            jpositionBefore[1] !== jpositionAfter[1] ||
            jpositionBefore[2] !== jpositionAfter[2])
        {
            if (direction.x > 0)
                return !collision.left;
            if (direction.x < 0)
                return !collision.right;
            if (direction.z > 0)
                return !collision.top;
            if (direction.z < 0)
                return !collision.bot;
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
    }
}
