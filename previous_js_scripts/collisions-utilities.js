/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   Utility class with a functions used for managing special collisions
*/
class CollisionsUtilities
{
    constructor()
    {
        throw new Error("This class is static.")
    }

    // -------------------------------------------------------
    /** Indicate if a point is inside a rectangle
    *   @static
    *   @param {THREE.Vector2} p The point to test
    *   @param {number} x1 The x left point of the rectangle
    *   @param {number} x2 The x right point of the rectangle
    *   @param {number} y1 The y top point of the rectangle
    *   @param {number} y2 The y bottom point of the rectangle
    *   @returns {boolean}
    */
    static isPointOnRectangle = function(p, x1, x2, y1, y2)
    {
        return p.x >= x1 && p.x <= x2 && p.y >= y1 && p.y <= y2;
    }

    // -------------------------------------------------------
    /** Indicate if a point is inside a triangle
    *   @static
    *   @param {THREE.Vector2} p The point to test
    *   @param {number} p0 One of the point of the triangle
    *   @param {number} p1 One of the point of the triangle
    *   @param {number} p2 One of the point of the triangle
    *   @returns {boolean}
    */
    static isPointOnTriangle = function(p, p0, p1, p2)
    {
        let a = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2
            .y) + p1.x * p2.y);
        let sign = a < 0 ? -1 : 1;
        let s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x)
            * p.y) * sign;
        let t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x)
            * p.y) * sign;
        return s > 0 && t > 0 && (s + t) < 2 * a * sign;
    }

    // -------------------------------------------------------
    /** Get the orthogonal projection between two vectors
    *   @static
    *   @param {THREE.Vector2} p The point to test
    *   @param {number} p0 One of the point of the triangle
    *   @param {number} p1 One of the point of the triangle
    *   @param {number} p2 One of the point of the triangle
    *   @returns {number}
    */
    static orthogonalProjection(u, v)
    {
        let lu = u.length();
        let lv = v.length();
        let dot = u.dot(v);
        return (dot / (lu * lv)) * lu;
    }

    // -------------------------------------------------------
    /** Indicate if min and max are overlapping
    *   @static
    *   @param {THREE.Vector2} p The point to test
    *   @param {number} minA
    *   @param {number} maxA
    *   @param {number} minB
    *   @param {number} maxB
    *   @returns {boolean}
    */
    static isOverlapping = function(minA, maxA, minB, maxB)
    {
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
        return (minOverlap !== null && maxOverlap !== null);
    }

    // -------------------------------------------------------
    /** Check collision between two OBB
    *   @static
    *   @param {THREE.Geometry} shapeA First shape
    *   @param {THREE.Geometry} shapeB Second shape
    *   @returns {boolean}
    */
    static obbVSobb(shapeA, shapeB)
    {
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
    }

    // -------------------------------------------------------
    /** Check the faces for OBB collision
    *   @static
    *   @param {THREE.Face3[]} shapes The faces to check
    *   @param {THREE.Vector3[]} verticesA First vertices to check
    *   @param {THREE.Vector3[]} verticesB Second vertices to check
    *   @param {number} lA The first vertices length
    *   @param {number} lB The second vertices length
    *   @returns {boolean}
    */
    static checkFaces(faces, verticesA, verticesB, lA, lB)
    {
        for (let i = 0, l = faces.length; i < l; i++)
        {
            if (!CollisionsUtilities.overlapOnThisNormal(verticesA, verticesB, 
                lA, lB, faces[i].normal))
            {
                return false;
            }
        }
        return true;
    }

    // -------------------------------------------------------
    /** Check if vertices overlap on one of the faces normal
    *   @static
    *   @param {THREE.Vector3[]} verticesA First vertices to check
    *   @param {THREE.Vector3[]} verticesB Second vertices to check
    *   @param {number} lA The first vertices length
    *   @param {number} lB The second vertices length
    *   @param {Vector3} normal The face normal
    *   @returns {boolean}
    */
    static overlapOnThisNormal(verticesA, verticesB, lA, lB, normal)
    {
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
    }
}