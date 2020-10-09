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

    static isPointOnRectangle = function(p, x1, x2, y1, y2)
    {
        return p.x >= x1 && p.x <= x2 && p.y >= y1 && p.y <= y2;
    }

    // -------------------------------------------------------

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

    static orthogonalProjection(u, v)
    {
        let lu = u.length();
        let lv = v.length();
        let dot = u.dot(v);
        return (dot / (lu * lv)) * lu;
    }

    // -------------------------------------------------------

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