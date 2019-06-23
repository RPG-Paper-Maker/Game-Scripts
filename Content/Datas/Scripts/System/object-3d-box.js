/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

// -------------------------------------------------------
//
//  CLASS Object3DBox
//
// -------------------------------------------------------

/** @class
*   A 3D object box in the map.
*/
function Object3DBox() {
    MapElement.call(this);
}

Object3DBox.VERTICES = [
    // Front
    new THREE.Vector3(0.0, 1.0, 1.0),
    new THREE.Vector3(1.0, 1.0, 1.0),
    new THREE.Vector3(1.0, 0.0, 1.0),
    new THREE.Vector3(0.0, 0.0, 1.0),

    // Back
    new THREE.Vector3(1.0, 1.0, 0.0),
    new THREE.Vector3(0.0, 1.0, 0.0),
    new THREE.Vector3(0.0, 0.0, 0.0),
    new THREE.Vector3(1.0, 0.0, 0.0),

    // Left
    new THREE.Vector3(0.0, 1.0, 0.0),
    new THREE.Vector3(0.0, 1.0, 1.0),
    new THREE.Vector3(0.0, 0.0, 1.0),
    new THREE.Vector3(0.0, 0.0, 0.0),

    // Right
    new THREE.Vector3(1.0, 1.0, 1.0),
    new THREE.Vector3(1.0, 1.0, 0.0),
    new THREE.Vector3(1.0, 0.0, 0.0),
    new THREE.Vector3(1.0, 0.0, 1.0),

    // Bottom
    new THREE.Vector3(0.0, 0.0, 1.0),
    new THREE.Vector3(1.0, 0.0, 1.0),
    new THREE.Vector3(1.0, 0.0, 0.0),
    new THREE.Vector3(0.0, 0.0, 0.0),

    // Top
    new THREE.Vector3(0.0, 1.0, 0.0),
    new THREE.Vector3(1.0, 1.0, 0.0),
    new THREE.Vector3(1.0, 1.0, 1.0),
    new THREE.Vector3(0.0, 1.0, 1.0)
];

Object3DBox.NB_VERTICES = 24;

Object3DBox.TEXTURES = [
    // Front
    new THREE.Vector2(0.25, 0.333333333333333),
    new THREE.Vector2(0.5, 0.333333333333333),
    new THREE.Vector2(0.5, 0.666666666666666),
    new THREE.Vector2(0.25, 0.666666666666666),

    // Back
    new THREE.Vector2(0.75, 0.333333333333333),
    new THREE.Vector2(1.0, 0.333333333333333),
    new THREE.Vector2(1.0, 0.666666666666666),
    new THREE.Vector2(0.75, 0.666666666666666),

    // Left
    new THREE.Vector2(0.0, 0.333333333333333),
    new THREE.Vector2(0.25, 0.333333333333333),
    new THREE.Vector2(0.25, 0.666666666666666),
    new THREE.Vector2(0.0, 0.666666666666666),

    // Right
    new THREE.Vector2(0.5, 0.333333333333333),
    new THREE.Vector2(0.75, 0.333333333333333),
    new THREE.Vector2(0.75, 0.666666666666666),
    new THREE.Vector2(0.5, 0.666666666666666),

    // Bottom
    new THREE.Vector2(0.25, 0.666666666666666),
    new THREE.Vector2(0.5, 0.666666666666666),
    new THREE.Vector2(0.5, 1.0),
    new THREE.Vector2(0.25, 1.0),

    // Top
    new THREE.Vector2(0.25, 0.0),
    new THREE.Vector2(0.5, 0.0),
    new THREE.Vector2(0.5, 0.333333333333333),
    new THREE.Vector2(0.25, 0.333333333333333)
];

Object3DBox.INDEXES = [
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    8, 9, 10, 8, 10, 11,
    12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19,
    20, 21, 22, 20, 22, 23
];

Object3DBox.prototype = {

    read: function(json, datas) {
        MapElement.prototype.read.call(this, json);

        this.id = datas.id;
        this.datas = datas;
    },

    /** Update the geometry of a group of sprite walls with the same material.
    *   @param {THREE.Geometry} geometry of the sprites walls.
    *   @param {number[]} position The position of the wall.
    *   @return {number}
    */
    updateGeometry: function(geometry, position, c) {
        var i, l, vecA, vecB, vecC, vecD, faceA, faceB, localPosition, size;

        localPosition = RPM.positionToVector3(position);
        size = this.datas.getSizeVector();
        for (i = 0; i < Object3DBox.NB_VERTICES; i += 4) {
            vecA = Object3DBox.VERTICES[i].clone();
            vecB = Object3DBox.VERTICES[i + 1].clone();
            vecC = Object3DBox.VERTICES[i + 2].clone();
            vecD = Object3DBox.VERTICES[i + 3].clone();
            vecA.multiply(size);
            vecB.multiply(size);
            vecC.multiply(size);
            vecD.multiply(size);
            vecA.add(localPosition);
            vecB.add(localPosition);
            vecC.add(localPosition);
            vecD.add(localPosition);
            faceA = [
                Object3DBox.TEXTURES[i],
                Object3DBox.TEXTURES[i + 1],
                Object3DBox.TEXTURES[i + 2]
            ];
            faceB = [
                Object3DBox.TEXTURES[i],
                Object3DBox.TEXTURES[i + 2],
                Object3DBox.TEXTURES[i + 3]
            ];
            c = Sprite.addStaticSpriteToGeometry(geometry, vecA, vecB, vecC,
                vecD, faceA, faceB, c);
        }

        return [c];
    }
}
