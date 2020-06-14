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
            size = new THREE.Vector3(RPM.SQUARE_SIZE, height, 0),
            angle = RPM.positionAngleY(position);
        var i, l, x, y, w, h, coefX, coefY, rect, textureRect, wall, picture;
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
        textureRect = [this.kind, 0, 1, Math.floor(height / RPM.SQUARE_SIZE)];
        x = (textureRect[0] * RPM.SQUARE_SIZE) / width;
        y = textureRect[1];
        w = RPM.SQUARE_SIZE / width;
        h = 1.0;
        coefX = RPM.COEF_TEX / width;
        coefY = RPM.COEF_TEX / height;
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
        var collisions = new Array;
        wall = RPM.datasGame.specialElements.walls[this.id];
        if (wall) {
            picture = RPM.datasGame.pictures.list[PictureKind.Walls][wall.pictureID];
            if (picture) {
                collisions = picture.getSquaresForWall(textureRect);
            }
        }
        for (i = 0, l = collisions.length; i < l; i++) {
            rect = collisions[i];
            objCollision.push({
                p: position,
                l: localPosition,
                b: [
                    localPosition.x,
                    localPosition.y + Math.floor((textureRect[3] * RPM.SQUARE_SIZE
                        - rect[1]) / 2),
                    localPosition.z,
                    rect[2],
                    rect[3],
                    1,
                    angle,
                    0,
                    0
                ],
                w: 0,
                h: textureRect[3],
                k: true
            });
        }

        Sprite.rotateSprite(vecA, vecB, vecC, vecD, center, angle, Sprite.Y_AXIS);
        c = Sprite.addStaticSpriteToGeometry(geometry, vecA, vecB, vecC, vecD,
                                             texFaceA, texFaceB, c);

        return [c, objCollision];
    }
}
