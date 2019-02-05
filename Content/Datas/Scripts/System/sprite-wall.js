/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

// -------------------------------------------------------
//
//  CLASS SpriteWall
//
// -------------------------------------------------------

/** @class
*   A sprite in the map.
*   @property {number} id The picture ID of the sprite.
*   @property {SpriteWallKind} kind The kind of wall (border or not).
*/
function SpriteWall() {
    MapElement.call(this);
}

SpriteWall.prototype = {

    /** Read the JSON associated to the sprite wall.
    *   @param {Object} json Json object describing the object.
    */
    read: function(json) {
        MapElement.prototype.read.call(this, json);

        this.id = json.w;
        this.kind = json.k;
    },

    /** Update the geometry of a group of sprite walls with the same material.
    *   @param {THREE.Geometry} geometry of the sprites walls.
    *   @param {number[]} position The position of the wall.
    *   @param {number} width The width of the texture.
    *   @param {number} height The height of the texture.
    *   @return {number}
    */
    updateGeometry: function(geometry, position, width, height, c) {
        var vecA = new THREE.Vector3(-0.5, 1.0, 0.0),
            vecB = new THREE.Vector3(0.5, 1.0, 0.0),
            vecC = new THREE.Vector3(0.5, 0.0, 0.0),
            vecD = new THREE.Vector3(-0.5, 0.0, 0.0),
            center = new THREE.Vector3(),
            size = new THREE.Vector3($SQUARE_SIZE, height, 0),
            angle = RPM.positionAngle(position);
        var i, l, x, y, w, h, coefX, coefY, rect, textureRect;
        var texFaceA, texFaceB;
        var localPosition = RPM.positionToVector3(position);

        // Scale
        vecA.multiply(size);
        vecB.multiply(size);
        vecC.multiply(size);
        vecD.multiply(size);

        // Move to coords
        vecA.add(localPosition);
        vecB.add(localPosition);
        vecC.add(localPosition);
        vecD.add(localPosition);
        center.add(localPosition);

        // Getting UV coordinates
        textureRect = [this.kind, 0, 1, height / $SQUARE_SIZE];
        x = (textureRect[0] * $SQUARE_SIZE) / width;
        y = textureRect[1];
        w = $SQUARE_SIZE / width;
        h = 1.0;
        coefX = 0.1 / width;
        coefY = 0.1 / height;
        x += coefX;
        y += coefY;
        w -= (coefX * 2);
        h -= (coefY * 2);

        // Texture UV coordinates for each triangle faces
        texFaceA = [
            new THREE.Vector2(x, y),
            new THREE.Vector2(x + w, y),
            new THREE.Vector2(x + w, y + h)
        ];
        texFaceB = [
            new THREE.Vector2(x,y),
            new THREE.Vector2(x+w,y+h),
            new THREE.Vector2(x,y+h)
        ];

        // Collision
        var objCollision = new Array;
        var lol = $datasGame.pictures.list[PictureKind.Walls];

        var collisions = $datasGame.pictures.list[PictureKind.Walls][this.id]
            .getSquaresForWall(textureRect);
        l = collisions.length;
        for (i = 0; i < l; i++) {
            rect = collisions[i];
            objCollision.push({
                p: position,
                l: localPosition,
                b: [
                    localPosition.x,
                    localPosition.y + Math.floor((textureRect[3] * $SQUARE_SIZE
                        - rect[1]) / 2),
                    localPosition.z,
                    rect[2],
                    rect[3],
                    angle
                ],
                w: 0,
                h: textureRect[3],
                k: true
            });
        }

        Sprite.rotateSprite(vecA, vecB, vecC, vecD, center, angle);
        c = Sprite.addStaticSpriteToGeometry(geometry, vecA, vecB, vecC, vecD,
                                             texFaceA, texFaceB, c);

        return [c, objCollision];
    }
}
