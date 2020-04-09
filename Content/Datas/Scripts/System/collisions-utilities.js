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
//  CLASS CollisionsUtilities
//
// -------------------------------------------------------

/** @class
*   Utility class with a functions used for managing special collisions.
*/
function CollisionsUtilities(){

}

// -------------------------------------------------------

CollisionsUtilities.isPointOnRectangle = function(p, x1, x2, y1, y2) {
    return p.x >= x1 && p.x <= x2 && p.y >= y1 && p.y <= y2;
}

// -------------------------------------------------------

CollisionsUtilities.isPointOnTriangle = function(p, p0, p1, p2) {
    var a, sign, s, t;

    a = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1
        .x * p2.y);
    sign = a < 0 ? -1 : 1;
    s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y)
        * sign;
    t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y)
        * sign;

    return s > 0 && t > 0 && (s + t) < 2 * a * sign;
}

// -------------------------------------------------------

CollisionsUtilities.orthogonalProjection = function(u, v) {
    var lu = u.length();
    var lv = v.length();
    var dot = u.dot(v);

    return (dot / (lu * lv)) * lu;
}

// -------------------------------------------------------

CollisionsUtilities.isOverlapping = function(minA, maxA, minB, maxB) {
    var minOverlap = null;
    var maxOverlap = null;

    // If B contain in A
    if (minA <= minB && minB <= maxA) {
        if (minOverlap === null || minB < minOverlap)
            minOverlap = minB;
    }
    if (minA <= maxB && maxB <= maxA) {
        if (maxOverlap === null || maxB > minOverlap)
            maxOverlap = maxB;
    }

    // If A contain in B
    if (minB <= minA && minA <= maxB) {
        if (minOverlap === null || minA < minOverlap)
            minOverlap = minA;
    }
    if (minB <= maxA && maxA <= maxB) {
        if (maxOverlap === null || maxA > minOverlap)
            maxOverlap = maxA;
    }

    return (minOverlap !== null && maxOverlap !== null);
}

// -------------------------------------------------------

CollisionsUtilities.obbVSobb = function(shapeA, shapeB) {
    var facesA, facesB, verticesA, verticesB, normal, overlap;
    var i, l, lA, lB;
    facesA = shapeA.faces;
    facesB = shapeB.faces;
    verticesA = shapeA.vertices;
    verticesB = shapeB.vertices;
    lA = verticesA.length;
    lB = verticesB.length;


    if (!CollisionsUtilities.checkFaces(facesA, verticesA, verticesB, lA, lB))
        return false;
    if (!CollisionsUtilities.checkFaces(facesB, verticesA, verticesB, lA, lB))
        return false;

    return true;
}

// -------------------------------------------------------

CollisionsUtilities.checkFaces = function(faces, verticesA, verticesB, lA, lB)
{
    var normal;

    for (var i = 0, l = faces.length; i < l; i++) {
        normal = faces[i].normal;
        if (!CollisionsUtilities.overlapOnThisNormal(verticesA, verticesB, lA,
                                                     lB, normal))
            return false;
    }

    return true;
}

// -------------------------------------------------------

CollisionsUtilities.overlapOnThisNormal = function(verticesA, verticesB, lA, lB,
                                                   normal)
{
    var vertex;
    var i, buffer;

    // We test each vertex of A
    var minA = null;
    var maxA = null;
    for(i = 0; i < lA; i++) {
        vertex = verticesA[i];
        buffer = CollisionsUtilities.orthogonalProjection(vertex, normal);
        if (minA === null || buffer < minA)
            minA = buffer;
        if (maxA === null || buffer > maxA)
            maxA = buffer;
    }

    // We test each vertex of B
    var minB = null;
    var maxB = null;
    for(i = 0; i < lB; i++) {
        vertex = verticesB[i];
        buffer = CollisionsUtilities.orthogonalProjection(vertex, normal);
        if (minB === null || buffer < minB)
            minB = buffer;
        if (maxB === null || buffer > maxB)
            maxB = buffer;
    }


    //We test if there overlap
    return CollisionsUtilities.isOverlapping(minA, maxA, minB, maxB);
}
