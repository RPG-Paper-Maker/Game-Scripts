/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Mathf, Constants, Enum } from "../Common";
import { Position, Portion } from "../Core";
import { Datas, Manager } from "..";
var ElementMapKind = Enum.ElementMapKind;
const THREE = require('./Content/Datas/Scripts/Libs/three.js');
/** @class
 *  The collisions manager.
 *  @static
 */
class Collisions {
    constructor() {
        throw new Error("This is a static class");
    }
    /**
     *  Create a box for bounding box.
     *  @static
     *  @returns {THREE.Mesh}
     */
    static createBox() {
        let box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), this
            .BB_MATERIAL);
        box.previousTranslate = [0, 0, 0];
        box.previousRotate = [0, 0, 0];
        box.previousScale = [1, 1, 1];
        return box;
    }
    /**
     *  Create an oriented box for bounding box.
     *  @static
     *  @returns {THREE.Mesh}
     */
    static createOrientedBox() {
        let box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), this
            .BB_MATERIAL);
        box.previousTranslate = [0, 0, 0];
        box.previousScale = [1, 1, 1];
        box.geometry.rotateY(Math.PI / 4);
        return box;
    }
    /**
     *  Apply transform for lands bounding box.
     *  @static
     *  @param {THREE.Mesh} box The mesh bounding box
     *  @param {number[]} boundingBox The bounding box list parameters
     */
    static applyBoxLandTransforms(box, boundingBox) {
        // Cancel previous geometry transforms
        box.geometry.translate(-box.previousTranslate[0], -box.previousTranslate[1], -box.previousTranslate[2]);
        box.geometry.rotateZ(-box.previousRotate[2] * Math.PI / 180.0);
        box.geometry.rotateX(-box.previousRotate[1] * Math.PI / 180.0);
        box.geometry.rotateY(-box.previousRotate[0] * Math.PI / 180.0);
        box.geometry.scale(1 / box.previousScale[0], 1 / box.previousScale[1], 1
            / box.previousScale[2]);
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
    /**
     *  Apply transform for sprite bounding box.
     *  @static
     *  @param {THREE.Mesh} box The mesh bounding box
     *  @param {number[]} boundingBox The bounding box list parameters
     */
    static applyBoxSpriteTransforms(box, boundingBox) {
        // Cancel previous geometry transforms
        box.geometry.translate(-box.previousTranslate[0], -box.previousTranslate[1], -box.previousTranslate[2]);
        box.geometry.rotateZ(-box.previousRotate[2] * Math.PI / 180.0);
        box.geometry.rotateX(-box.previousRotate[1] * Math.PI / 180.0);
        box.geometry.rotateY(-box.previousRotate[0] * Math.PI / 180.0);
        box.geometry.scale(1 / box.previousScale[0], 1 / box.previousScale[1], 1
            / box.previousScale[2]);
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
    /**
     *  Apply transform for oriented bounding box.
     *  @static
     *  @param {THREE.Mesh} box The mesh bounding box
     *  @param {number[]} boundingBox The bounding box list parameters
     */
    static applyOrientedBoxTransforms(box, boundingBox) {
        let size = Math.floor(boundingBox[3] / Math.sqrt(2));
        // Cancel previous geometry transforms
        box.geometry.translate(-box.previousTranslate[0], -box.previousTranslate[1], -box.previousTranslate[2]);
        box.geometry.rotateY(-Math.PI / 4);
        box.geometry.scale(1 / box.previousScale[0], 1 / box.previousScale[1], 1
            / box.previousScale[2]);
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
    /**
     *  Indicate if min and max are overlapping.
     *  @static
     *  @param {number} minA
     *  @param {number} maxA
     *  @param {number} minB
     *  @param {number} maxB
     *  @returns {boolean}
     */
    static isOverlapping(minA, maxA, minB, maxB) {
        let minOverlap = null;
        let maxOverlap = null;
        // If B contain in A
        if (minA <= minB && minB <= maxA) {
            if (minOverlap === null || minB < minOverlap) {
                minOverlap = minB;
            }
        }
        if (minA <= maxB && maxB <= maxA) {
            if (maxOverlap === null || maxB > minOverlap) {
                maxOverlap = maxB;
            }
        }
        // If A contain in B
        if (minB <= minA && minA <= maxB) {
            if (minOverlap === null || minA < minOverlap) {
                minOverlap = minA;
            }
        }
        if (minB <= maxA && maxA <= maxB) {
            if (maxOverlap === null || maxA > minOverlap) {
                maxOverlap = maxA;
            }
        }
        return (minOverlap !== null && maxOverlap !== null);
    }
    /**
     *  Check collision between two OBB.
     *  @static
     *  @param {THREE.Geometry} shapeA First shape
     *  @param {THREE.Geometry} shapeB Second shape
     *  @returns {boolean}
     */
    static obbVSobb(shapeA, shapeB) {
        let facesA = shapeA.faces;
        let facesB = shapeB.faces;
        let verticesA = shapeA.vertices;
        let verticesB = shapeB.vertices;
        let lA = verticesA.length;
        let lB = verticesB.length;
        if (!this.checkFaces(facesA, verticesA, verticesB, lA, lB)) {
            return false;
        }
        if (!this.checkFaces(facesB, verticesA, verticesB, lA, lB)) {
            return false;
        }
        return true;
    }
    /**
     *  Check the faces for OBB collision.
     *  @static
     *  @param {THREE.Face3[]} shapes The faces to check
     *  @param {THREE.Vector3[]} verticesA First vertices to check
     *  @param {THREE.Vector3[]} verticesB Second vertices to check
     *  @param {number} lA The first vertices length
     *  @param {number} lB The second vertices length
     *  @returns {boolean}
     */
    static checkFaces(faces, verticesA, verticesB, lA, lB) {
        for (let i = 0, l = faces.length; i < l; i++) {
            if (!this.overlapOnThisNormal(verticesA, verticesB, lA, lB, faces[i]
                .normal)) {
                return false;
            }
        }
        return true;
    }
    /**
     *  Check if vertices overlap on one of the faces normal.
     *  @static
     *  @param {THREE.Vector3[]} verticesA First vertices to check
     *  @param {THREE.Vector3[]} verticesB Second vertices to check
     *  @param {number} lA The first vertices length
     *  @param {number} lB The second vertices length
     *  @param {THREE.Vector3} normal The face normal
     *  @returns {boolean}
     */
    static overlapOnThisNormal(verticesA, verticesB, lA, lB, normal) {
        // We test each vertex of A
        let minA = null;
        let maxA = null;
        let i, vertex, buffer;
        for (i = 0; i < lA; i++) {
            vertex = verticesA[i];
            buffer = Mathf.orthogonalProjection(vertex, normal);
            if (minA === null || buffer < minA) {
                minA = buffer;
            }
            if (maxA === null || buffer > maxA) {
                maxA = buffer;
            }
        }
        // We test each vertex of B
        let minB = null;
        let maxB = null;
        for (i = 0; i < lB; i++) {
            vertex = verticesB[i];
            buffer = Mathf.orthogonalProjection(vertex, normal);
            if (minB === null || buffer < minB) {
                minB = buffer;
            }
            if (maxB === null || buffer > maxB) {
                maxB = buffer;
            }
        }
        // We test if there is overlaping
        return this.isOverlapping(minA, maxA, minB, maxB);
    }
    /**
     *  Check collision ray.
     *  @static
     *  @param {THREE.Vector3} positionBefore The position before collision
     *  @param {THREE.Vector3} positionAfter The position after collision
     *  @param {MapObject} object The map object to test collision
     *  @returns {boolean}
     */
    static checkRay(positionBefore, positionAfter, object) {
        let direction = new THREE.Vector3();
        direction.subVectors(positionAfter, positionBefore).normalize();
        let jpositionBefore = Position.createFromVector3(positionBefore);
        let jpositionAfter = Position.createFromVector3(positionAfter);
        let positionAfterPlus = new THREE.Vector3();
        let testedCollisions = [];
        let yMountain = null;
        // Squares to inspect according to the direction of the object
        let startI, endI, startJ, endJ, startK, endK;
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
        let block = false;
        let i, j, k, portion, mapPortion, result;
        for (i = startI; i <= endI; i++) {
            for (j = startJ; j <= endJ; j++) {
                for (k = startK; k <= endK; k++) {
                    positionAfterPlus.set(positionAfter.x + i * Datas.Systems
                        .SQUARE_SIZE, positionAfter.y + j * Datas.Systems
                        .SQUARE_SIZE, positionAfter.z + k * Datas.Systems
                        .SQUARE_SIZE);
                    portion = Manager.Stack.currentMap.getLocalPortion(Portion
                        .createFromVector3(positionAfterPlus));
                    mapPortion = Manager.Stack.currentMap.getMapPortion(portion);
                    if (mapPortion !== null) {
                        result = this.check(mapPortion, jpositionBefore, new Position(jpositionAfter.x + i, jpositionAfter
                            .y + j, jpositionAfter.z + k), positionAfter, object, direction, testedCollisions);
                        if (result[0]) {
                            block = true;
                        }
                        else if (result[1] !== null) {
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
        if (object !== Manager.Stack.game.hero && object.checkCollisionObject(Manager.Stack.game.hero)) {
            return [true, null];
        }
        // Check objects collisions
        portion = Manager.Stack.currentMap.getLocalPortion(Portion
            .createFromVector3(positionAfter));
        for (i = 0; i < 2; i++) {
            for (j = 0; j < 2; j++) {
                mapPortion = Manager.Stack.currentMap.getMapPortion(new Portion(portion.x + i, portion.y, portion.z + j));
                if (mapPortion !== null && this.checkObjects(mapPortion, object)) {
                    return [true, null];
                }
            }
        }
        // Check empty square or square mountain height possible down
        mapPortion = Manager.Stack.currentMap.getMapPortion(portion);
        let floors;
        if (mapPortion !== null) {
            floors = mapPortion.squareNonEmpty[jpositionAfter.x % Constants
                .PORTION_SIZE][jpositionAfter.z % Constants.PORTION_SIZE];
            if (floors.length === 0) {
                let otherMapPortion = Manager.Stack.currentMap.getMapPortion(new Portion(portion.x, portion.y + 1, portion.z));
                if (otherMapPortion) {
                    floors = otherMapPortion.squareNonEmpty[jpositionAfter.x %
                        Constants.PORTION_SIZE][jpositionAfter.z % Constants
                        .PORTION_SIZE];
                }
            }
            if (yMountain === null && floors.indexOf(positionAfter.y) === -1) {
                let l = floors.length;
                if (l === 0) {
                    return [true, null];
                }
                else {
                    let maxY = null;
                    let limitY = positionAfter.y - Datas.Systems
                        .mountainCollisionHeight.getValue();
                    let temp;
                    for (i = 0; i < l; i++) {
                        temp = floors[i];
                        if (temp <= (positionAfter.y + Datas.Systems
                            .mountainCollisionHeight.getValue()) && temp >=
                            limitY) {
                            if (maxY === null) {
                                maxY = temp;
                            }
                            else {
                                if (maxY < temp) {
                                    maxY = temp;
                                }
                            }
                        }
                    }
                    if (maxY === null) {
                        return [true, null];
                    }
                    else {
                        yMountain = maxY;
                    }
                }
            }
            // Check lands inside collisions
            return [this.checkLandsInside(mapPortion, jpositionBefore, jpositionAfter, direction), yMountain];
        }
        return [true, null];
    }
    /**
     *  Check if there is a collision at this position.
     *  @static
     *  @param {MapPortion} mapPortion The map portion to check
     *  @param {Position} jpositionBefore The json position before collision
     *  @param {Position} jpositionAfter The json position after collision
     *  @param {THREE.Vector3} positionAfter The position after collision
     *  @param {MapObject} object The map object collision test
     *  @param {THREE.Vector3} direction The direction collision
     *  @param {StructMapElementCollision[]} testedCollisions The object
     *  collisions that were already tested
     *  @returns {boolean}
     */
    static check(mapPortion, jpositionBefore, jpositionAfter, positionAfter, object, direction, testedCollisions) {
        // Check mountain collision first for elevation
        let result = this.checkMountains(mapPortion, jpositionAfter, positionAfter, testedCollisions, object);
        if (result[0]) {
            return result;
        }
        // Check other tests
        return [(this.checkLands(mapPortion, jpositionBefore, jpositionAfter, object, direction, testedCollisions) || this.checkSprites(mapPortion, jpositionAfter, testedCollisions, object) || this.checkObjects3D(mapPortion, jpositionAfter, testedCollisions, object)), result[1]];
    }
    /**
     *  Check if there is a collision with lands at this position.
     *  @static
     *  @param {MapPortion} mapPortion The map portion to check
     *  @param {Position} jpositionBefore The json position before collision
     *  @param {Position} jpositionAfter The json position after collision
     *  @param {MapObject} object The map object collision test
     *  @param {THREE.Vector3} direction The direction collision
     *  @param {StructMapElementCollision[]} testedCollisions The object
     *  collisions that were already tested
     *  @returns {boolean}
     */
    static checkLands(mapPortion, jpositionBefore, jpositionAfter, object, direction, testedCollisions) {
        let index = jpositionAfter.toIndex();
        let lands = mapPortion.boundingBoxesLands[index];
        if (lands !== null) {
            let objCollision, boundingBox, collision;
            for (let i = 0, l = lands.length; i < l; i++) {
                objCollision = lands[i];
                if (testedCollisions.indexOf(objCollision) === -1) {
                    testedCollisions.push(objCollision);
                    if (objCollision !== null) {
                        boundingBox = objCollision.b;
                        collision = objCollision.cs;
                        if (this.checkIntersectionLand(collision, boundingBox, object) || this.checkDirections(jpositionBefore, jpositionAfter, collision, boundingBox, direction, object)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    /**
     *  Check if there is a collision with lands with directions.
     *  @static
     *  @param {MapPortion} mapPortion The map portion to check
     *  @param {Position} jpositionBefore The json position before collision
     *  @param {Position} jpositionAfter The json position after collision
     *  @param {THREE.Vector3} direction The direction collision
     *  @returns {boolean}
    */
    static checkLandsInside(mapPortion, jpositionBefore, jpositionAfter, direction) {
        let lands = mapPortion.boundingBoxesLands[jpositionBefore.toIndex()];
        if (lands !== null) {
            let objCollision, collision;
            for (let i = 0, l = lands.length; i < l; i++) {
                objCollision = lands[i];
                if (objCollision !== null) {
                    collision = objCollision.cs;
                    if (this.checkDirectionsInside(jpositionBefore, jpositionAfter, collision, direction)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /**
     *  Check intersection between ray and an object.
     *  @static
     *  @param {StructMapElementCollision} collision The collision object
     *  @param {number[]} boundingBox The bounding box values
     *  @param {MapObject} object The map object to check
     *  @returns {boolean}
    */
    static checkIntersectionLand(collision, boundingBox, object) {
        if (collision !== null) {
            return false;
        }
        this.applyBoxLandTransforms(this.BB_BOX, boundingBox);
        return this.obbVSobb(object.currentBoundingBox.geometry, this.BB_BOX
            .geometry);
    }
    /**
     *  Check directions
     *  @static
     *  @param {Position} jpositionBefore The json position before collision
     *  @param {Position} jpositionAfter The json position after collision
     *  @param {StructMapElementCollision} collision The collision object
     *  @param {number[]} boundingBox The bounding box values
     *  @param {THREE.Vector3} direction The direction collision
     *  @param {MapObject} object The map object collision test
     *  @returns {boolean}
    */
    static checkDirections(jpositionBefore, jpositionAfter, collision, boundingBox, direction, object) {
        if (collision === null) {
            return false;
        }
        if (!jpositionBefore.equals(jpositionAfter)) {
            if (this.checkIntersectionLand(null, boundingBox, object)) {
                if (direction.x > 0) {
                    return !collision.left;
                }
                if (direction.x < 0) {
                    return !collision.right;
                }
                if (direction.z > 0) {
                    return !collision.top;
                }
                if (direction.z < 0) {
                    return !collision.bot;
                }
            }
        }
        return false;
    }
    /**
     *  Check directions inside.
     *  @static
     *  @param {Position} jpositionBefore The json position before collision
     *  @param {Position} jpositionAfter The json position after collision
     *  @param {StructMapElementCollision} collision The collision object
     *  @param {THREE.Vector3} direction The direction collision
     *  @returns {boolean}
    */
    static checkDirectionsInside(jpositionBefore, jpositionAfter, collision, direction) {
        if (collision === null) {
            return false;
        }
        if (!jpositionBefore.equals(jpositionAfter)) {
            if (direction.x > 0) {
                return !collision.right;
            }
            if (direction.x < 0) {
                return !collision.left;
            }
            if (direction.z > 0) {
                return !collision.bot;
            }
            if (direction.z < 0) {
                return !collision.top;
            }
        }
        return false;
    }
    /**
     *  Check if there is a collision with sprites at this position.
     *  @static
     *  @param {MapPortion} mapPortion The map portion to check
     *  @param {Position} jpositionAfter The json position after collision
     *  @param {StructMapElementCollision[]} testedCollisions The object
     *  collisions that were already tested
     *  @param {MapObject} object The map object collision test
     *  @returns {boolean}
    */
    static checkSprites(mapPortion, jpositionAfter, testedCollisions, object) {
        let sprites = mapPortion.boundingBoxesSprites[jpositionAfter.toIndex()];
        if (sprites !== null) {
            let objCollision;
            for (let i = 0, l = sprites.length; i < l; i++) {
                objCollision = sprites[i];
                if (testedCollisions.indexOf(objCollision) === -1) {
                    testedCollisions.push(objCollision);
                    if (this.checkIntersectionSprite(objCollision.b, objCollision.k, object)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /**
     *  Check intersection between ray and an object.
     *  @static
     *  @param {number[]} boundingBox The bounding box values
     *  @param {boolean} fix Indicate if the sprite is fix or not
     *  @param {MapObject} object The map object collision test
     *  @returns {boolean}
    */
    static checkIntersectionSprite(boundingBox, fix, object) {
        if (boundingBox === null) {
            return false;
        }
        if (fix) {
            this.applyBoxSpriteTransforms(this.BB_BOX, boundingBox);
            return this.obbVSobb(object.currentBoundingBox.geometry, this.BB_BOX
                .geometry);
        }
        else {
            this.applyOrientedBoxTransforms(this.BB_ORIENTED_BOX, boundingBox);
            return this.obbVSobb(object.currentBoundingBox.geometry, this
                .BB_ORIENTED_BOX.geometry);
        }
    }
    /**
     *  Check if there is a collision with sprites at this position.
     *  @static
     *  @param {MapPortion} mapPortion The map portion to check
     *  @param {Position} jpositionAfter The json position after collision
     *  @param {StructMapElementCollision[]} testedCollisions The object
     *  collisions that were already tested
     *  @param {MapObject} object The map object collision test
     *  @returns {boolean}
    */
    static checkObjects3D(mapPortion, jpositionAfter, testedCollisions, object) {
        let objects3D = mapPortion.boundingBoxesObjects3D[jpositionAfter.toIndex()];
        if (objects3D !== null) {
            let objCollision;
            for (let i = 0, l = objects3D.length; i < l; i++) {
                objCollision = objects3D[i];
                if (testedCollisions.indexOf(objCollision) === -1) {
                    testedCollisions.push(objCollision);
                    if (this.checkIntersectionSprite(objCollision.b, objCollision.k, object)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /**
     *  Check if there is a collision with mountains at this position.
     *  @static
     *  @param {MapPortion} mapPortion The map portion to check
     *  @param {Position} jpositionAfter The json position after collision
     *  @param {THREE.Vector3} positionAfter The position after collision
     *  @param {StructMapElementCollision[]} testedCollisions The object collisions that were
     *  already tested
     *  @param {MapObject} object The map object collision test
     *  @returns {boolean}
    */
    static checkMountains(mapPortion, jpositionAfter, positionAfter, testedCollisions, object) {
        let yMountain = null;
        let mountains = mapPortion.boundingBoxesMountains[jpositionAfter.toIndex()];
        let block = false;
        let i, l, result;
        if (mountains !== null) {
            for (i = 0, l = mountains.length; i < l; i++) {
                result = this.checkMountain(mapPortion, jpositionAfter, positionAfter, testedCollisions, object, mountains[i], yMountain, block);
                if (result[0]) {
                    return [result[1], result[2]];
                }
                else {
                    block = result[1];
                    yMountain = result[2];
                }
            }
        }
        let j, m, objCollision, position;
        for (i = 0, l = mapPortion.overflowMountains.length; i < l; i++) {
            position = mapPortion.overflowMountains[i];
            objCollision = Manager.Stack.currentMap.getMapPortion(Manager.Stack
                .currentMap.getLocalPortion(position.getGlobalPortion()))
                .getObjectCollisionAt(position, jpositionAfter, ElementMapKind
                .Mountains);
            for (j = 0, m = objCollision.length; j < m; j++) {
                result = this.checkMountain(mapPortion, jpositionAfter, positionAfter, testedCollisions, object, objCollision[j], yMountain, block);
                if (result[0]) {
                    return [result[1], result[2]];
                }
                else {
                    block = result[1];
                    yMountain = result[2];
                }
            }
        }
        return [block && (yMountain === null), yMountain];
    }
    /**
     *  Check if there is a collision with mountains at this position.
     *  @static
     *  @param {MapPortion} mapPortion The map portion to check
     *  @param {Position} jpositionAfter The json position after collision
     *  @param {THREE.Vector3} positionAfter The position after collision
     *  @param {StructMapElementCollision[]} testedCollisions The object
     *  collisions that were already tested
     *  @param {MapObject} object The map object collision test
     *  @param {StructMapElementCollision} objCollision The object collision
     *  @param {number} yMountain The y mountain collision
     *  @param {boolean} block The block mountain collision
     *  @returns {[boolean, boolean, number]}
    */
    static checkMountain(mapPortion, jpositionAfter, positionAfter, testedCollisions, object, objCollision, yMountain, block) {
        if (testedCollisions.indexOf(objCollision) === -1) {
            testedCollisions.push(objCollision);
            let result = this.checkIntersectionMountain(mapPortion, jpositionAfter, positionAfter, objCollision, object);
            if (result[0]) {
                if (result[1] === null) {
                    return [true, result[0], result[1]];
                }
                else {
                    block = true;
                }
            }
            else if (result[1] !== null) {
                if (yMountain === null || yMountain < result[1]) {
                    yMountain = result[1];
                }
            }
        }
        return [false, block, yMountain];
    }
    /**
     *  Check intersection with a mountain.
     *  @static
     *  @param {MapPortion} mapPortion The map portion to check
     *  @param {Position} jpositionAfter The json position after collision
     *  @param {THREE.Vector3} positionAfter The position after collision
     *  @param {StructMapElementCollision} objCollision The object collision
     *  @param {MapObject} object The map object collision test
     *  @returns {[boolean, number]}
    */
    static checkIntersectionMountain(mapPortion, jpositionAfter, positionAfter, objCollision, object) {
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
        if (objCollision.rw === 0) {
            let pass = forceAlways || -(!forceNever && ((y + objCollision.rh) <=
                (positionAfter.y + Datas.Systems.mountainCollisionHeight
                    .getValue())));
            if (Mathf.isPointOnRectangle(point, x, x + Datas.Systems.SQUARE_SIZE, z, z + Datas.Systems.SQUARE_SIZE)) {
                return pass ? [false, y + objCollision.rh] : [true, null];
            }
            else {
                if (!pass) {
                    return [this.checkIntersectionSprite([x + (Datas.Systems
                                .SQUARE_SIZE / 2), y + (Datas.Systems.SQUARE_SIZE / 2),
                            z + (Datas.Systems.SQUARE_SIZE / 2), Datas.Systems
                                .SQUARE_SIZE, objCollision.rh, Datas.Systems.SQUARE_SIZE,
                            0, 0, 0], true, object), null];
                }
            }
        }
        else {
            // if w > 0, go like a slope
            // Get coplanar points according to side
            let ptA, ptB, ptC, pA, pB, pC;
            if (objCollision.left && !mountain.left) {
                if (objCollision.top && !mountain.top) {
                    ptA = new THREE.Vector2(x - w, z);
                    ptB = new THREE.Vector2(x, z);
                    ptC = new THREE.Vector2(x, z - w);
                    if (Mathf.isPointOnTriangle(point, ptA, ptB, ptC)) {
                        pA = new THREE.Vector3(ptA.x, y, ptA.y);
                        pB = new THREE.Vector3(ptB.x, y + h, ptB.y);
                        pC = new THREE.Vector3(ptC.x, y, ptC.y);
                    }
                    else {
                        return [false, null];
                    }
                }
                else if (objCollision.bot && !mountain.bot) {
                    ptA = new THREE.Vector2(x - w, z + Datas.Systems.SQUARE_SIZE);
                    ptB = new THREE.Vector2(x, z + Datas.Systems.SQUARE_SIZE);
                    ptC = new THREE.Vector2(x, z + Datas.Systems.SQUARE_SIZE + w);
                    if (Mathf.isPointOnTriangle(point, ptA, ptB, ptC)) {
                        pA = new THREE.Vector3(ptA.x, y, ptA.y);
                        pB = new THREE.Vector3(ptB.x, y + h, ptB.y);
                        pC = new THREE.Vector3(ptC.x, y, ptC.y);
                    }
                    else {
                        return [false, null];
                    }
                }
                else {
                    if (Mathf.isPointOnRectangle(point, x - w, x, z, z + Datas
                        .Systems.SQUARE_SIZE)) {
                        pA = new THREE.Vector3(x - w, y, z);
                        pB = new THREE.Vector3(x, y + h, z);
                        pC = new THREE.Vector3(x, y + h, z + Datas.Systems.SQUARE_SIZE);
                    }
                    else {
                        return [false, null];
                    }
                }
            }
            else if (objCollision.right && !mountain.right) {
                if (objCollision.top && !mountain.top) {
                    ptA = new THREE.Vector2(x + Datas.Systems.SQUARE_SIZE, z - w);
                    ptB = new THREE.Vector2(x + Datas.Systems.SQUARE_SIZE, z);
                    ptC = new THREE.Vector2(x + Datas.Systems.SQUARE_SIZE + w, z);
                    if (Mathf.isPointOnTriangle(point, ptA, ptB, ptC)) {
                        pA = new THREE.Vector3(ptA.x, y, ptA.y);
                        pB = new THREE.Vector3(ptB.x, y + h, ptB.y);
                        pC = new THREE.Vector3(ptC.x, y, ptC.y);
                    }
                    else {
                        return [false, null];
                    }
                }
                else if (objCollision.bot && !mountain.bot) {
                    ptA = new THREE.Vector2(x + Datas.Systems.SQUARE_SIZE, z +
                        Datas.Systems.SQUARE_SIZE + w);
                    ptB = new THREE.Vector2(x + Datas.Systems.SQUARE_SIZE, z +
                        Datas.Systems.SQUARE_SIZE);
                    ptC = new THREE.Vector2(x + Datas.Systems.SQUARE_SIZE + w, z
                        + Datas.Systems.SQUARE_SIZE);
                    if (Mathf.isPointOnTriangle(point, ptA, ptB, ptC)) {
                        pA = new THREE.Vector3(ptA.x, y, ptA.y);
                        pB = new THREE.Vector3(ptB.x, y + h, ptB.y);
                        pC = new THREE.Vector3(ptC.x, y, ptC.y);
                    }
                    else {
                        return [false, null];
                    }
                }
                else {
                    if (Mathf.isPointOnRectangle(point, x + Datas.Systems
                        .SQUARE_SIZE, x + Datas.Systems.SQUARE_SIZE + w, z, z +
                        Datas.Systems.SQUARE_SIZE)) {
                        pA = new THREE.Vector3(x + Datas.Systems.SQUARE_SIZE, y
                            + h, z + Datas.Systems.SQUARE_SIZE);
                        pB = new THREE.Vector3(x + Datas.Systems.SQUARE_SIZE, y
                            + h, z);
                        pC = new THREE.Vector3(x + Datas.Systems.SQUARE_SIZE + w, y, z);
                    }
                    else {
                        return [false, null];
                    }
                }
            }
            else {
                if (objCollision.top && !mountain.top) {
                    if (Mathf.isPointOnRectangle(point, x, x + Datas.Systems
                        .SQUARE_SIZE, z - w, z)) {
                        pA = new THREE.Vector3(x, y + h, z);
                        pB = new THREE.Vector3(x, y, z - w);
                        pC = new THREE.Vector3(x + Datas.Systems.SQUARE_SIZE, y, z - w);
                    }
                    else {
                        return [false, null];
                    }
                }
                else if (objCollision.bot && !mountain.bot) {
                    if (Mathf.isPointOnRectangle(point, x, x + Datas.Systems
                        .SQUARE_SIZE, z + Datas.Systems.SQUARE_SIZE, z + Datas
                        .Systems.SQUARE_SIZE + w)) {
                        pA = new THREE.Vector3(x + Datas.Systems.SQUARE_SIZE, y, z + Datas.Systems.SQUARE_SIZE + w);
                        pB = new THREE.Vector3(x, y, z + Datas.Systems
                            .SQUARE_SIZE + w);
                        pC = new THREE.Vector3(x, y + h, z + Datas.Systems
                            .SQUARE_SIZE);
                    }
                    else {
                        return [false, null];
                    }
                }
                else {
                    return [false, null];
                }
            }
            // Get the intersection point for updating mountain y
            let plane = new THREE.Plane();
            let ray = new THREE.Ray(new THREE.Vector3(positionAfter.x, y, positionAfter.z), new THREE.Vector3(0, 1, 0));
            let newPosition = new THREE.Vector3();
            plane.setFromCoplanarPoints(pA, pB, pC);
            ray.intersectPlane(plane, newPosition);
            // If going down, check if there's a blocking floor
            let jposition = (newPosition.y - positionAfter.y) < 0 ? new Position(Math.floor(positionAfter.x / Datas.Systems.SQUARE_SIZE), Math
                .ceil(positionAfter.y / Datas.Systems.SQUARE_SIZE), Math.floor(positionAfter.z / Datas.Systems.SQUARE_SIZE)) : jpositionAfter;
            let isFloor = mapPortion.boundingBoxesLands[jposition.toIndex()]
                .length > 0;
            if (isFloor && (newPosition.y - positionAfter.y) < 0) {
                return [false, null];
            }
            // If angle limit, block
            if (forceNever || (!forceAlways && mountain.angle > Datas.Systems
                .mountainCollisionAngle.getValue())) {
                // Check if floor existing on top of the mountain angle
                isFloor = jposition[1] === jpositionAfter[1] ? false :
                    mapPortion.boundingBoxesLands[jpositionAfter.toIndex()]
                        .length > 0;
                return [!isFloor, null];
            }
            return [!forceAlways && (Math.abs(newPosition.y - positionAfter.y) >
                    Datas.Systems.mountainCollisionHeight.getValue()), newPosition.y];
        }
        return [false, null];
    }
    /**
     *  Check collision with objects.
     *  @static
     *  @param {MapPortion} mapPortion The map portion to check
     *  @param {MapObject} object The map object collision test
     *  @returns {boolean}
     */
    static checkObjects(mapPortion, object) {
        let datas = Manager.Stack.currentMap.getObjectsAtPortion(mapPortion
            .portion);
        return this.checkObjectsList(mapPortion.objectsList, object) || this
            .checkObjectsList(datas.min, object) || this
            .checkObjectsList(datas.mout, object);
    }
    /**
     *  Check collision with objects.
     *  @static
     *  @param {MapObject[]} list The map objects list to test
     *  @param {MapObject} object The map object collision test
     *  @returns {boolean}
    */
    static checkObjectsList(list, object) {
        let obj;
        for (let i = 0, l = list.length; i < l; i++) {
            obj = list[i];
            if (obj !== object && object.isInRect(obj)) {
                if (object.checkCollisionObject(obj)) {
                    return true;
                }
            }
        }
        return false;
    }
}
Collisions.BB_MATERIAL = new THREE.MeshBasicMaterial();
Collisions.BB_BOX = Collisions.createBox();
Collisions.BB_ORIENTED_BOX = Collisions.createOrientedBox();
Collisions.BB_BOX_DETECTION = Collisions.createBox();
Collisions.BB_BOX_DEFAULT_DETECTION = Collisions.createBox();
export { Collisions };
