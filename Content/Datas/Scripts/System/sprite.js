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
//  CLASS Sprite
//
// -------------------------------------------------------

/** @class
*   A sprite in the map.
*   @property {number[]} textureRect Texture UV coords.
*/
function Sprite(kind, texture) {
    MapElement.call(this);

    this.kind = kind;
    this.textureRect = texture;
    this.front = true;
}

Sprite.Y_AXIS = new THREE.Vector3(0, 1, 0);
Sprite.X_AXIS = new THREE.Vector3(1, 0, 0);
Sprite.Z_AXIS = new THREE.Vector3(0, 0, 1);

/** @static
*   Rotate a vertex around a specified center.
*   @param {THREE.Vector3} vec The vertex to rotate.
*   @param {THREE.Vector3} center The center to rotate around.
*   @param {number} angle The angle in degree.
*/
Sprite.rotateVertex = function(vec, center, angle, axis) {
    vec.sub(center);
    vec.applyAxisAngle(axis, angle * Math.PI / 180.0);
    vec.add(center);
}

/** @static
*   Rotate the four vertices of a sprite around a specified center.
*   @param {THREE.Vector3} vecA The A vertex to rotate.
*   @param {THREE.Vector3} vecB The B vertex to rotate.
*   @param {THREE.Vector3} vecC The C vertex to rotate.
*   @param {THREE.Vector3} vecD The D vertex to rotate.
*   @param {THREE.Vector3} center The center to rotate around.
*   @param {number} angle The angle in degree.
*/
Sprite.rotateSprite = function(vecA, vecB, vecC, vecD, center, angle, axis) {
    Sprite.rotateVertex(vecA, center, angle, axis);
    Sprite.rotateVertex(vecB, center, angle, axis);
    Sprite.rotateVertex(vecC, center, angle, axis);
    Sprite.rotateVertex(vecD, center, angle, axis);
}

/** @static
*   Rotate the four vertices of a sprite around a specified center.
*   @param {THREE.Vector3} vecA The A vertex to rotate.
*   @param {THREE.Vector3} vecB The B vertex to rotate.
*   @param {THREE.Vector3} vecC The C vertex to rotate.
*   @param {THREE.Vector3} vecD The D vertex to rotate.
*   @param {THREE.Vector3} center The center to rotate around.
*   @param {number} angle The angle in degree.
*   @returns {number} Offset for index buffer.
*/
Sprite.addStaticSpriteToGeometry = function(geometry, vecA, vecB, vecC, vecD,
                                            texFaceA, texFaceB, c)
{
    geometry.vertices.push(vecA);
    geometry.vertices.push(vecB);
    geometry.vertices.push(vecC);
    geometry.vertices.push(vecD);
    geometry.faces.push(new THREE.Face3(c, c + 1, c + 2));
    geometry.faces.push(new THREE.Face3(c, c + 2, c + 3));
    geometry.faceVertexUvs[0].push(texFaceA);
    geometry.faceVertexUvs[0].push(texFaceB);

    return c + 4;
}

Sprite.prototype = {

    /** Read the JSON associated to the sprite.
    *   @param {Object} json Json object describing the object.
    */
    read: function(json) {
        MapElement.prototype.read.call(this, json);

        var front = json.f;
        this.kind = json.k;
        this.textureRect = json.t;

        if (typeof(front) !== 'undefined')
            this.front = front;
    },

    /** Update the geometry associated to this land.
    *   @returns {THREE.Geometry}
    */
    updateGeometry: function(geometry, width, height, position, c, tileset,
                             localPosition)
    {
        var vecA = new THREE.Vector3(-0.5, 1.0, 0.0),
            vecB = new THREE.Vector3(0.5, 1.0, 0.0),
            vecC = new THREE.Vector3(0.5, 0.0, 0.0),
            vecD = new THREE.Vector3(-0.5, 0.0, 0.0),
            center = new THREE.Vector3(0, 0, 0),
            size = new THREE.Vector3(this.textureRect[2] * RPM.SQUARE_SIZE,
                                     this.textureRect[3] * RPM.SQUARE_SIZE, 1.0);
        var x, y, w, h, i, l, coefX, coefY, rect, angleY, angleX, angleZ;
        var texFaceA, texFaceB;

        // For static sprites
        MapElement.prototype.scale.call(this, vecA, vecB, vecC, vecD, center,
                                        position, size, this.kind);
        if (localPosition !== null) {
            vecA.add(localPosition);
            vecB.add(localPosition);
            vecC.add(localPosition);
            vecD.add(localPosition);
            center.add(localPosition);
        }
        else {
            if (tileset)
                localPosition = RPM.positionToVector3(position);
            else
                localPosition = new THREE.Vector3();
        }
        angleY = RPM.positionAngleY(position);
        angleX = RPM.positionAngleX(position);
        angleZ = RPM.positionAngleZ(position);
        if (this.kind !== ElementMapKind.SpritesFace) {
            if (angleY !== 0.0) {
                Sprite.rotateSprite(vecA, vecB, vecC, vecD, center, angleY,
                    Sprite.Y_AXIS);
            }
            if (angleX !== 0.0) {
                Sprite.rotateSprite(vecA, vecB, vecC, vecD, center, angleX,
                    Sprite.X_AXIS);
            }
            if (angleZ !== 0.0) {
                Sprite.rotateSprite(vecA, vecB, vecC, vecD, center, angleZ,
                    Sprite.Z_AXIS);
            }
        }

        // Getting UV coordinates
        x = (this.textureRect[0] * RPM.SQUARE_SIZE) / width;
        y = (this.textureRect[1] * RPM.SQUARE_SIZE) / height;
        w = (this.textureRect[2] * RPM.SQUARE_SIZE) / width;
        h = (this.textureRect[3] * RPM.SQUARE_SIZE) / height;
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
        w = Math.floor(this.textureRect[2] / 2);
        h = Math.floor(this.textureRect[3] / 2);

        if (tileset) {
            var collisions = RPM.currentMap.mapInfos.tileset.picture
                .getSquaresForTexture(this.textureRect);
            l = collisions.length;
            for (i = 0; i < l; i++) {
                rect = collisions[i];
                objCollision.push({
                    p: position,
                    l: localPosition,
                    b: [
                        (localPosition.x - (Math.floor(this.textureRect[2] / 2)
                            * RPM.SQUARE_SIZE)) - ((this.textureRect[2] % 2) * Math
                            .round(RPM.SQUARE_SIZE / 2)) + rect[0] + Math.round(
                            rect[2] / 2),
                        localPosition.y + (this.textureRect[3] * RPM.SQUARE_SIZE) -
                            rect[1] - Math.round(rect[3] / 2),
                        localPosition.z,
                        rect[2],
                        rect[3],
                        1,
                        angleY,
                        angleX,
                        angleZ
                    ],
                    w: w,
                    h: h,
                    k: this.kind === ElementMapKind.SpritesFix
                });
            }
        }
        // Character
        else {
            objCollision.push({
                b: null,
                w: w,
                h: h,
                k: this.kind === ElementMapKind.SpritesFix
            });
        }

        // Simple sprite
        var vecSimpleA = vecA.clone(),
            vecSimpleB = vecB.clone(),
            vecSimpleC = vecC.clone(),
            vecSimpleD = vecD.clone();
        c = Sprite.addStaticSpriteToGeometry(geometry, vecSimpleA, vecSimpleB,
                                             vecSimpleC, vecSimpleD, texFaceA,
                                             texFaceB, c);

        // Double sprite
        if (this.kind === ElementMapKind.SpritesDouble ||
            this.kind === ElementMapKind.SpritesQuadra)
        {
            var vecDoubleA = vecA.clone(),
                vecDoubleB = vecB.clone(),
                vecDoubleC = vecC.clone(),
                vecDoubleD = vecD.clone();
            Sprite.rotateSprite(vecDoubleA, vecDoubleB, vecDoubleC, vecDoubleD,
                center, 90, Sprite.Y_AXIS);

            c = Sprite.addStaticSpriteToGeometry(geometry, vecDoubleA,
                                                 vecDoubleB, vecDoubleC,
                                                 vecDoubleD, texFaceA, texFaceB,
                                                 c);

            // Quadra sprite
            if (this.kind === ElementMapKind.SpritesQuadra) {
                var vecQuadra1A = vecA.clone(),
                    vecQuadra1B = vecB.clone(),
                    vecQuadra1C = vecC.clone(),
                    vecQuadra1D = vecD.clone(),
                    vecQuadra2A = vecA.clone(),
                    vecQuadra2B = vecB.clone(),
                    vecQuadra2C = vecC.clone(),
                    vecQuadra2D = vecD.clone();
                Sprite.rotateSprite(vecQuadra1A, vecQuadra1B, vecQuadra1C,
                    vecQuadra1D, center, 45, Sprite.Y_AXIS);
                Sprite.rotateSprite(vecQuadra2A, vecQuadra2B, vecQuadra2C,
                    vecQuadra2D, center, -45, Sprite.Y_AXIS);
                c = Sprite.addStaticSpriteToGeometry(geometry, vecQuadra1A,
                                                     vecQuadra1B, vecQuadra1C,
                                                     vecQuadra1D, texFaceA,
                                                     texFaceB, c);
                c = Sprite.addStaticSpriteToGeometry(geometry, vecQuadra2A,
                                                     vecQuadra2B, vecQuadra2C,
                                                     vecQuadra2D, texFaceA,
                                                     texFaceB, c);
            }
        }

        return [c, objCollision];
    },

    /** Create the geometry associated to this sprite.
    *   @param {number} width The texture total width.
    *   @param {number} height The texture total height.
    *   @param {number[]} position The position of the sprite.
    *   @returns {THREE.Geometry}
    */
    createGeometry: function(width, height, tileset, position) {
        var geometry = new THREE.Geometry();
        var objCollision;
        geometry.faceVertexUvs[0] = [];
        objCollision = this.updateGeometry(geometry, width, height, position, 0,
                                           tileset, null);
        geometry.uvsNeedUpdate = true;

        return [geometry, objCollision];
    }
}
