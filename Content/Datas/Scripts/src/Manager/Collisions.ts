/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

const THREE = require('./Content/Datas/Scripts/Libs/three.js');

/** @class
 *  The game stack that is organizing the game scenes.
 *  @property {Scene.Base[]} content The stack content
 *  @property {Scene.Base} top The stack top content
 *  @property {Scene.Base} subTop The stack top - 1 content
 *  @property {Scene.Base} bot The stack bot content
 */
class Collisions {

    public static BB_MATERIAL = new THREE.MeshBasicMaterial();
    public static BB_BOX_DETECTION = new THREE.MeshBasicMaterial();
    public static BB_BOX_DEFAULT_DETECTION = new THREE.MeshBasicMaterial();

    constructor() {
        throw new Error("This is a static class");
    }

    /** Create a box for bounding box
     *  @static
     *  @returns {THREE.Mesh}
     */
    static createBox() {
        /*
        let box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), MapPortion
            .BB_MATERIAL);
        box.previousTranslate = [0, 0, 0];
        box.previousRotate = [0, 0, 0];
        box.previousScale = [1, 1, 1];
        return box;
        */
    }

    // -------------------------------------------------------
    /** Create an oriented box for bounding box
     *  @static
     *  @returns {THREE.Mesh}
     */
    static createOrientedBox()
    {
        /*
        let box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), MapPortion
            .BB_MATERIAL);
        box.previousTranslate = [0, 0, 0];
        box.previousScale = [1, 1, 1];
        box.geometry.rotateY(Math.PI / 4);
        return box;
        */
    }

    /** 
     *  Apply transform for lands bounding box
     *  @static
     *  @param {THREE.Mesh} box The mesh bounding box
     *  @param {number[]} boundingBox The bounding box list parameters
     */
    static applyBoxLandTransforms(box, boundingBox)
    {
        /*
        // Cancel previous geometry transforms
        box.geometry.translate(-box.previousTranslate[0], -box.previousTranslate
            [1], -box.previousTranslate[2]);
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
        */
    }

    // -------------------------------------------------------
    /** Apply transform for sprite bounding box
     *  @static
     *  @param {THREE.Mesh} box The mesh bounding box
     *  @param {number[]} boundingBox The bounding box list parameters
     */
    static applyBoxSpriteTransforms(box, boundingBox)
    {
        /*
        // Cancel previous geometry transforms
        box.geometry.translate(-box.previousTranslate[0], -box.previousTranslate
            [1], -box.previousTranslate[2]);
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
        */
    }

    // -------------------------------------------------------
    /** Apply transform for oriented bounding box
     *  @static
     *  @param {THREE.Mesh} box The mesh bounding box
     *  @param {number[]} boundingBox The bounding box list parameters
     */
    static applyOrientedBoxTransforms(box, boundingBox)
    {
        /*
        let size = Math.floor(boundingBox[3] / Math.sqrt(2));

        // Cancel previous geometry transforms
        box.geometry.translate(-box.previousTranslate[0], -box.previousTranslate
            [1], -box.previousTranslate[2]);
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
        */
    }

    /** 
     *  Indicate if a point is inside a rectangle.
     *  @static
     *  @param {THREE.Vector2} p The point to test
     *  @param {number} x1 The x left point of the rectangle
     *  @param {number} x2 The x right point of the rectangle
     *  @param {number} y1 The y top point of the rectangle
     *  @param {number} y2 The y bottom point of the rectangle
     *  @returns {boolean}
     */
    static isPointOnRectangle(p, x1, x2, y1, y2)
    {
        //return p.x >= x1 && p.x <= x2 && p.y >= y1 && p.y <= y2;
    }

    // -------------------------------------------------------
    /** Indicate if a point is inside a triangle
     *  @static
     *  @param {THREE.Vector2} p The point to test
     *  @param {number} p0 One of the point of the triangle
     *  @param {number} p1 One of the point of the triangle
     *  @param {number} p2 One of the point of the triangle
     *  @returns {boolean}
     */
    static isPointOnTriangle = function(p, p0, p1, p2)
    {
        /*
        let a = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2
            .y) + p1.x * p2.y);
        let sign = a < 0 ? -1 : 1;
        let s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x)
            * p.y) * sign;
        let t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x)
            * p.y) * sign;
        return s > 0 && t > 0 && (s + t) < 2 * a * sign;*/
    }

    // -------------------------------------------------------
    /** Get the orthogonal projection between two vectors
     *  @static
     *  @param {THREE.Vector2} p The point to test
     *  @param {number} p0 One of the point of the triangle
     *  @param {number} p1 One of the point of the triangle
     *  @param {number} p2 One of the point of the triangle
     *  @returns {number}
     */
    static orthogonalProjection(u, v)
    {
        /*
        let lu = u.length();
        let lv = v.length();
        let dot = u.dot(v);
        return (dot / (lu * lv)) * lu;
        */
    }

    // -------------------------------------------------------
    /** Indicate if min and max are overlapping
     *  @static
     *  @param {THREE.Vector2} p The point to test
     *  @param {number} minA
     *  @param {number} maxA
     *  @param {number} minB
     *  @param {number} maxB
     *  @returns {boolean}
     */
    static isOverlapping = function(minA, maxA, minB, maxB)
    {
        /*
        let minOverlap = null;
        let maxOverlap = null;

        // If B contain in A
        if (minA <= minB && minB <= maxA)
        {
            if (minOverlap === null || minB < minOverlap)
            {
                minOverlap = minB;
            }
        }
        if (minA <= maxB && maxB <= maxA)
        {
            if (maxOverlap === null || maxB > minOverlap)
            {
                maxOverlap = maxB;
            }
        }

        // If A contain in B
        if (minB <= minA && minA <= maxB)
        {
            if (minOverlap === null || minA < minOverlap)
            {
                minOverlap = minA;
            }
        }
        if (minB <= maxA && maxA <= maxB)
        {
            if (maxOverlap === null || maxA > minOverlap)
            {
                maxOverlap = maxA;
            }
        }
        return (minOverlap !== null && maxOverlap !== null);*/
    }

    // -------------------------------------------------------
    /** Check collision between two OBB
     *  @static
     *  @param {THREE.Geometry} shapeA First shape
     *  @param {THREE.Geometry} shapeB Second shape
     *  @returns {boolean}
     */
    static obbVSobb(shapeA, shapeB): boolean
    {
        return true; // TEMP NEED REMOVE
        /*
        let facesA = shapeA.faces;
        let facesB = shapeB.faces;
        let verticesA = shapeA.vertices;
        let verticesB = shapeB.vertices;
        let lA = verticesA.length;
        let lB = verticesB.length;
        if (!CollisionsUtilities.checkFaces(facesA, verticesA, verticesB, lA, lB))
        {
            return false;
        }
        if (!CollisionsUtilities.checkFaces(facesB, verticesA, verticesB, lA, lB))
        {
            return false;
        }
        return true;
        */
    }

    // -------------------------------------------------------
    /** Check the faces for OBB collision
     *  @static
     *  @param {THREE.Face3[]} shapes The faces to check
     *  @param {THREE.Vector3[]} verticesA First vertices to check
     *  @param {THREE.Vector3[]} verticesB Second vertices to check
     *  @param {number} lA The first vertices length
     *  @param {number} lB The second vertices length
     *  @returns {boolean}
     */
    static checkFaces(faces, verticesA, verticesB, lA, lB)
    {
        /*
        for (let i = 0, l = faces.length; i < l; i++)
        {
            if (!CollisionsUtilities.overlapOnThisNormal(verticesA, verticesB, 
                lA, lB, faces[i].normal))
            {
                return false;
            }
        }
        return true;
        */
    }

    // -------------------------------------------------------
    /** Check if vertices overlap on one of the faces normal
     *  @static
     *  @param {THREE.Vector3[]} verticesA First vertices to check
     *  @param {THREE.Vector3[]} verticesB Second vertices to check
     *  @param {number} lA The first vertices length
     *  @param {number} lB The second vertices length
     *  @param {Vector3} normal The face normal
     *  @returns {boolean}
     */
    static overlapOnThisNormal(verticesA, verticesB, lA, lB, normal)
    {
        /*
        // We test each vertex of A
        let minA = null;
        let maxA = null;
        let i, vertex, buffer;
        for (i = 0; i < lA; i++)
        {
            vertex = verticesA[i];
            buffer = CollisionsUtilities.orthogonalProjection(vertex, normal);
            if (minA === null || buffer < minA)
            {
                minA = buffer;
            }
            if (maxA === null || buffer > maxA)
            {
                maxA = buffer;
            }
        }

        // We test each vertex of B
        let minB = null;
        let maxB = null;
        for (i = 0; i < lB; i++)
        {
            vertex = verticesB[i];
            buffer = CollisionsUtilities.orthogonalProjection(vertex, normal);
            if (minB === null || buffer < minB)
            {
                minB = buffer;
            }
            if (maxB === null || buffer > maxB)
            {
                maxB = buffer;
            }
        }

        // We test if there is overlaping
        return CollisionsUtilities.isOverlapping(minA, maxA, minB, maxB);
        */
    }

    // -------------------------------------------------------
    /** Check collision ray
    *   @static
    *   @param {THREE.Vector3} positionBefore The position before collision
    *   @param {THREE.Vector3} positionAfter The position after collision
    *   @param {MapObject} object The map object to test collision
    *   @returns {boolean}
    */
    static checkCollisionRay(positionBefore, positionAfter, object): [boolean, number]
    {
        return [true, 0]; // TEMP: REMOVE IT
        /*
        let direction = new THREE.Vector3();
        direction.subVectors(positionAfter, positionBefore).normalize();
        let jpositionBefore = RPM.getPosition(positionBefore);
        let jpositionAfter = RPM.getPosition(positionAfter);
        let positionAfterPlus = new THREE.Vector3();
        let testedCollisions = new Array;
        let yMountain = null;

        // Squares to inspect according to the direction of the object
        let startI, endI, startJ, endJ, startK, endK;
        if (direction.x > 0)
        {
            startI = 0;
            endI = object.boundingBoxSettings.w;
        } else if (direction.x < 0)
        {
            startI = -object.boundingBoxSettings.w;
            endI = 0;
        } else
        {
            startI = -object.boundingBoxSettings.w;
            endI = object.boundingBoxSettings.w;
        }
        if (object.boundingBoxSettings.k)
        {
            startK = 0;
            endK = 0;
        } else if (direction.z > 0)
        {
            startK = 0;
            endK = object.boundingBoxSettings.w;
        } else if (direction.z < 0)
        {
            startK = -object.boundingBoxSettings.w;
            endK = 0;
        } else
        {
            startK = -object.boundingBoxSettings.w;
            endK = object.boundingBoxSettings.w;
        }
        startJ = 0;
        endJ = 0;

        // Check collision outside
        let block = false;
        let i, j, k, portion, mapPortion, result;
        for (i = startI; i <= endI; i++)
        {
            for (j = startJ; j <= endJ; j++)
            {
                for (k = startK; k <= endK; k++)
                {
                    positionAfterPlus.set(positionAfter.x + i * RPM.SQUARE_SIZE,
                        positionAfter.y + j * RPM.SQUARE_SIZE, positionAfter.z + 
                        k * RPM.SQUARE_SIZE);
                    portion = RPM.currentMap.getLocalPortion(RPM.getPortion(
                        positionAfterPlus));
                    mapPortion = RPM.currentMap.getMapPortionByPortion(portion);
                    if (mapPortion !== null)
                    {
                        result = mapPortion.checkCollision(jpositionBefore, [
                            jpositionAfter[0] + i, jpositionAfter[1] + j,
                            jpositionAfter[2] + k], positionAfter, object, 
                            direction, testedCollisions);
                        if (result[0])
                        {
                            block = true;
                        } else if (result[1] !== null)
                        {
                            if (yMountain === null || yMountain < result[1])
                            {
                                yMountain = result[1];
                            }
                        }
                    }
                }
            }
        }
        if (block && (yMountain === null))
        {
            return [true, null];
        }

        // Check collision inside & with other objects
        if (object !== RPM.game.hero && object.checkCollisionObject(RPM.game
            .hero))
            {
            return [true, null];
        }

        // Check objects collisions
        portion = RPM.currentMap.getLocalPortion(RPM.getPortion(positionAfter));
        for (i = 0; i < 2; i++)
        {
            for (j = 0; j < 2; j++)
            {
                mapPortion = RPM.currentMap.getMapPortionByPortion([portion[0] +
                    i, portion[1], portion[2] + j]);
                if (mapPortion !== null && mapPortion.checkObjectsCollision(
                    object))
                {
                    return [true, null];
                }
            }
        }

        // Check empty square or square mountain height possible down
        mapPortion = RPM.currentMap.getMapPortionByPortion(portion);
        let floors;
        if (mapPortion !== null) 
        {
            floors = mapPortion.squareNonEmpty[jpositionAfter[0] % RPM
                .PORTION_SIZE][jpositionAfter[2] % RPM.PORTION_SIZE];
            if (floors.length === 0)
            {
                let otherMapPortion = RPM.currentMap.getMapPortionByPortion([
                    portion[0], portion[1] + 1, portion[2]]);
                if (otherMapPortion)
                {
                    floors = otherMapPortion.squareNonEmpty[jpositionAfter[0] %
                        RPM.PORTION_SIZE][jpositionAfter[2] % RPM.PORTION_SIZE];
                }
            }
            if (yMountain === null && floors.indexOf(positionAfter.y) === -1)
            {
                let l = floors.length;
                if (l === 0)
                {
                    return [true, null];
                } else
                {
                    let maxY = null;
                    let limitY = positionAfter.y - RPM.datasGame.system
                        .mountainCollisionHeight.getValue();
                    let temp;
                    for (i = 0; i < l; i++)
                    {
                        temp = floors[i];
                        if (temp <= (positionAfter.y + RPM.datasGame.system
                            .mountainCollisionHeight.getValue()) && temp >= 
                            limitY)
                        {
                            if (maxY === null)
                            {
                                maxY = temp;
                            } else
                            {
                                if (maxY < temp)
                                {
                                    maxY = temp;
                                }
                            }
                        }
                    }
                    if (maxY === null)
                    {
                        return [true, null];
                    } else
                    {
                        yMountain = maxY;
                    }
                }
            }

            // Check lands inside collisions
            return [mapPortion.checkLandsCollisionInside(jpositionBefore,
                jpositionAfter, direction), yMountain];
        }
        return [true, null];
        */
    }
}

export { Collisions };