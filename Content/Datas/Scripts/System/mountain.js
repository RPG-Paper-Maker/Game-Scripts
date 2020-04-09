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
//  CLASS Mountain
//
// -------------------------------------------------------

/** @class
*   A mountain in the map.
*/
function Mountain() {
    MapElement.call(this);
}

Mountain.X_LEFT_OFFSET = 0;
Mountain.X_MID_OFFSET = 1;
Mountain.X_RIGHT_OFFSET = 2;
Mountain.X_MIX_OFFSET = 3;
Mountain.Y_TOP_OFFSET = 0;
Mountain.Y_MID_OFFSET = 1;
Mountain.Y_BOT_OFFSET = 2;
Mountain.Y_MIX_OFFSET = 3;

Mountain.prototype = {

    read: function(json) {
        var width;

        MapElement.prototype.read.call(this, json);

        this.mountainID = typeof json.sid === 'undefined' ? -1 : json.sid;
        this.widthSquares = typeof json.ws === 'undefined' ? 0 : json.ws;
        this.widthPixels = typeof json.wp === 'undefined' ? 0 : json.wp;
        this.heightSquares = typeof json.hs === 'undefined' ? 1 : json.hs;
        this.heightPixels = typeof json.hp === 'undefined' ? 0 : json.hp;
        this.top = typeof json.t === 'undefined' ? false : json.t;
        this.bot = typeof json.b === 'undefined' ? false : json.b;
        this.left = typeof json.l === 'undefined' ? false : json.l;
        this.right = typeof json.r === 'undefined' ? false : json.r;

        // Calculate angle
        width = this.getWidthTotalPixels();
        this.angle = width === 0 ? 90 : Math.atan(this.getHeightTotalPixels() /
            width) * 180 / Math.PI;
    },

    // -------------------------------------------------------

    getTotalSquaresWidth: function() {
        return this.widthSquares + (this.getWidthOnlyPixelsPlus() > 0 ? 1 : 0);
    },

    // -------------------------------------------------------

    getTotalSquaresHeight: function(yPlus) {
        return this.heightSquares + (this.getHeightOnlyPixelsPlus() + yPlus > 0
            ? 1 : 0);
    },

    // -------------------------------------------------------

    getWidthOnlyPixelsPlus: function() {
        return Math.round(this.widthPixels * $SQUARE_SIZE / 100);
    },

    // -------------------------------------------------------

    getHeightOnlyPixelsPlus: function() {
        return Math.round(this.heightPixels * $SQUARE_SIZE / 100);
    },

    // -------------------------------------------------------

    getWidthTotalPixels: function() {
        return this.widthSquares * $SQUARE_SIZE + this.getWidthOnlyPixelsPlus();
    },

    // -------------------------------------------------------

    getHeightTotalPixels: function() {
        return this.heightSquares * $SQUARE_SIZE + this.getHeightOnlyPixelsPlus();
    },

    // -------------------------------------------------------

    getSystem: function() {
        return $datasGame.specialElements.mountains[this.mountainID];
    },

    // -------------------------------------------------------

    drawEntireFaces: function(left, right, angle, center, width, height, w,
        faceHeight, wp, xLeft, xRight, yTop, yBot, zFront, zBack, yOffset,
        vecFrontA, vecBackA, vecFrontB, vecBackB, geometry, count)
    {
        var i, vecStepLeftA, vecStepLeftB, vecStepRightA, vecStepRightB,
            vecCenterA, vecCenterB, xKind, nbSteps;

        xKind = Mountain.X_LEFT_OFFSET;
        nbSteps = Math.ceil(faceHeight / $SQUARE_SIZE);
        vecCenterA = vecFrontA.clone().addScaledVector(vecBackA.clone().sub(
            vecFrontA), 0.5);
        vecCenterB = vecFrontB.clone().addScaledVector(vecBackB.clone().sub(
            vecFrontB), 0.5);

        // Define x offset according to left / right stuff
        if (!left && right) {
            xKind = Mountain.X_LEFT_OFFSET;
        } else if (left && right) {
            xKind = Mountain.X_MID_OFFSET;
        } else if (left && !right) {
            xKind = Mountain.X_RIGHT_OFFSET;
        } else if (!left && !right) {
            xKind = Mountain.X_MIX_OFFSET;
        }

        // Draw all faces
        if (faceHeight === $SQUARE_SIZE) { // 1 Mix sprite
            // Mix
            count = this.drawSideCorner(xKind, Mountain.Y_MIX_OFFSET, angle,
                center, width, height, w, faceHeight, wp, xLeft, xRight,
                vecBackA.x, vecBackB.x, vecFrontA.x, vecBackB.x, yTop, yBot,
                zFront, zBack, vecFrontA.z, vecFrontB.z, vecBackA.z, vecBackB.z,
                yOffset, geometry, count, 0, vecFrontA.distanceTo(vecFrontB));
        } else if (faceHeight <= (2 * $SQUARE_SIZE)) { // 2 B / T sprites
            // Bottom
            count = this.drawSideCorner(xKind, Mountain.Y_BOT_OFFSET, angle,
                center, width, height, w, Math.floor(faceHeight / 2), wp, xLeft,
                xRight, vecCenterA.x, vecCenterB.x, vecFrontA.x, vecFrontB.x,
                vecCenterB.y, yBot, zFront, vecCenterB.z, vecFrontA.z, vecFrontB
                .z, vecCenterA.z, vecCenterB.z, yOffset, geometry, count,
                vecCenterA.distanceTo(vecCenterB), vecFrontA.distanceTo(
                vecFrontB));

            // Top
            count = this.drawSideCorner(xKind, Mountain.Y_TOP_OFFSET, angle,
                center, width, height, w, Math.ceil(faceHeight / 2), wp, xLeft,
                xRight, vecBackA.x, vecBackB.x, vecCenterA.x, vecCenterB.x, yTop
                , vecCenterB.y, vecCenterB.z, zBack, vecCenterA.z, vecCenterB.z,
                vecBackA.z, vecBackB.z, yOffset, geometry, count, 0, vecCenterA
                .distanceTo(vecCenterB));
        }
        else { // 3 B / M / T sprites
            // Bottom
            vecStepLeftB = vecFrontA.clone().addScaledVector(vecBackA.clone()
                .sub(vecFrontA), 1 / nbSteps);
            vecStepRightB = vecFrontB.clone().addScaledVector(vecBackB.clone()
                .sub(vecFrontB), 1 / nbSteps);
            count = this.drawSideCorner(xKind, Mountain.Y_BOT_OFFSET, angle,
                center, width, height, w, Math.floor(faceHeight / nbSteps), wp,
                xLeft, xRight, vecStepLeftB.x, vecStepRightB.x, vecFrontA.x,
                vecFrontB.x, vecStepRightB.y, yBot, zFront, vecStepRightB.z,
                vecFrontA.z, vecFrontB.z, vecStepLeftB.z, vecStepRightB.z,
                yOffset, geometry, count, vecStepLeftB.distanceTo(vecStepRightB)
                , vecFrontA.distanceTo(vecFrontB));

            // Middle: add as many as middle blocks as possible
            for (i = 2; i <= nbSteps - 1; i++) {
                vecStepLeftA = vecStepLeftB;
                vecStepRightA = vecStepRightB;
                vecStepLeftB = vecFrontA.clone().addScaledVector(vecBackA.clone()
                    .sub(vecFrontA), i / nbSteps);
                vecStepRightB = vecFrontB.clone().addScaledVector(vecBackB.clone()
                    .sub(vecFrontB), i / nbSteps);

                count = this.drawSideCorner(xKind, Mountain.Y_MID_OFFSET, angle,
                    center, width, height, w, Math.floor(faceHeight / nbSteps),
                    wp, xLeft, xRight, vecStepLeftB.x, vecStepRightB.x,
                    vecStepLeftA.x, vecStepRightA.x, vecStepRightB.y,
                    vecStepRightA.y, vecStepRightA.z, vecStepRightB.z,
                    vecStepLeftA.z, vecStepRightA.z, vecStepLeftB.z,
                    vecStepRightB.z, yOffset, geometry, count, vecStepLeftB
                    .distanceTo(vecStepRightB), vecStepLeftA.distanceTo(
                    vecStepRightA));
            }

            // Top
            count = this.drawSideCorner(xKind, Mountain.Y_TOP_OFFSET, angle,
                center, width, height, w, Math.ceil(faceHeight / nbSteps), wp,
                xLeft, xRight, vecBackA.x, vecBackB.x, vecStepLeftB.x,
                vecStepRightB.x, yTop, vecStepRightB.y, vecStepRightB.z, zBack,
                vecStepLeftB.z, vecStepRightB.z, vecBackA.z, vecBackB.z, yOffset
                , geometry, count, 0, vecStepLeftB.distanceTo(vecStepRightB));
        }

        return count;
    },

    // -------------------------------------------------------

    drawSideCorner: function(xKind, yKind, angle, center, width, height, w,
        faceHeight, wp, xLeft, xRight, xLeftTop, xRightTop, xLeftBot, xRightBot,
        yTop, yBot, zFront, zBack, zFrontLeft, zFrontRight, zBackLeft,
        zBackRight, yOffset, geometry, count, xCornerOffsetTop, xCornerOffsetBot)
    {
        count = this.drawFace(xKind, yKind, angle, center, width, height, w,
            faceHeight, xLeft, xRight, xLeft, xRight, yTop, yBot, zFront, zFront
            , zBack, zBack, yOffset, geometry, count, 0, 0, false);

        // Draw corner only if there is a border width
        if (wp > 0) {
            count = this.drawFace(xKind, yKind, angle, center, width, height, w,
                faceHeight, xLeftTop, xRightTop, xLeftBot, xRightBot, yTop, yBot
                , zFrontLeft, zFrontRight, zBackLeft, zBackRight, yOffset,
                geometry, count, xCornerOffsetTop, xCornerOffsetBot, true);
        }

        return count;
    },

    // -------------------------------------------------------

    drawFace : function(xKind, yKind, angle, center, width, height, w,
        faceHeight, xLeftTop, xRightTop, xLeftBot, xRightBot, yTop, yBot,
        zFrontLeft, zFrontRight, zBackLeft, zBackRight, yOffset, geometry, count
        , xCornerOffsetTop, xCornerOffsetBot, isCorner)
    {
        var vecA, vecB, vecC, vecD, texA, texB, texC, texD, x, y, h, coefX,
            coefY, texFaceA, texFaceB;

        // Textures coordinates
        x = (xKind * $SQUARE_SIZE) / width;
        y = ((yKind * $SQUARE_SIZE) + (yKind === Mountain.Y_BOT_OFFSET ?
            $SQUARE_SIZE - faceHeight : 0) + yOffset) / height;
        h = faceHeight / height;
        coefX = 0.1 / width;
        coefY = 0.1 / height;
        x += coefX;
        y += coefY;
        w -= (coefX * 2);
        h -= (coefY * 2);

        // Textures and vertices
        if (isCorner) {
            texA = new THREE.Vector2(((xKind * $SQUARE_SIZE) + (($SQUARE_SIZE -
                xCornerOffsetTop) / 2)) / width + coefX, y);
            texB = new THREE.Vector2((((xKind + 1) * $SQUARE_SIZE) - ((
                $SQUARE_SIZE - xCornerOffsetTop) / 2)) / width - coefX, y);
            texC = new THREE.Vector2((((xKind + 1) * $SQUARE_SIZE) - ((
                $SQUARE_SIZE - xCornerOffsetBot) / 2)) / width - coefX, y + h);
            texD = new THREE.Vector2((((xKind) * $SQUARE_SIZE) + ((
                $SQUARE_SIZE - xCornerOffsetBot) / 2)) / width + coefX, y + h);
        } else { // Triangle form for corners
            texA = new THREE.Vector2(x, y);
            texB = new THREE.Vector2(x + w, y);
            texC = new THREE.Vector2(x + w, y + h);
            texD = new THREE.Vector2(x, y + h);
        }
        texFaceA = [
            new THREE.Vector2(texA.x, texA.y),
            new THREE.Vector2(texB.x, texB.y),
            new THREE.Vector2(texC.x, texC.y)
        ];
        texFaceB = [
            new THREE.Vector2(texA.x, texA.y),
            new THREE.Vector2(texC.x, texC.y),
            new THREE.Vector2(texD.x, texD.y)
        ];
        vecA = new THREE.Vector3(xLeftTop, yTop, zBackLeft);
        vecB = new THREE.Vector3(xRightTop, yTop, zBackRight);
        vecC = new THREE.Vector3(xRightBot, yBot, zFrontRight);
        vecD = new THREE.Vector3(xLeftBot, yBot, zFrontLeft);

        // Rotate and draw sprite side
        Sprite.rotateSprite(vecA, vecB, vecC, vecD, center, angle, Sprite.Y_AXIS);
        count = Sprite.addStaticSpriteToGeometry(geometry, vecA,
            vecB, vecC, vecD, texFaceA, texFaceB, count);

        return count;
    },

    // -------------------------------------------------------

    /** Update the geometry of a group of sprite walls with the same material.
    *   @param {THREE.Geometry} geometry of the sprites walls.
    *   @param {number[]} position The position of the wall.
    *   @return {number}
    */
    updateGeometry: function(geometry, texture, position, c) {
        var localPosition, center, vecFrontA, vecBackA, vecFrontB, vecBackB,
            width, height, wp, hp, yOffset, w, faceHeight, xLeft, xRight, yTop,
            yBot, zFront, zBack, objCollision;

        // General configurations
        yOffset = texture.getOffset(this.mountainID, null) * 4 * $SQUARE_SIZE;
        wp = this.getWidthTotalPixels();
        hp = this.getHeightTotalPixels();
        width = 4 * $SQUARE_SIZE;
        height = $MAX_PICTURE_SIZE;
        faceHeight = Math.sqrt((wp * wp) + (hp * hp));
        w = $SQUARE_SIZE / width;
        localPosition = RPM.positionToBorderVector3(position);
        center = new THREE.Vector3(localPosition.x + ($SQUARE_SIZE / 2),
            localPosition.y + (hp / 2), localPosition.z + (
            $SQUARE_SIZE / 2));
        xLeft = localPosition.x;
        xRight = localPosition.x + $SQUARE_SIZE;
        yTop = localPosition.y + hp;
        yBot = localPosition.y;
        zFront = localPosition.z + $SQUARE_SIZE + wp;
        zBack = zFront - wp;
        vecFrontB = new THREE.Vector3(xLeft, yBot, zFront);
        vecBackB = new THREE.Vector3(xLeft, yTop, zBack);
        vecFrontA = new THREE.Vector3(xLeft - wp, yBot, zBack);
        vecBackA = new THREE.Vector3(xLeft, yTop, zBack);

        // Bot
        if (!this.bot) {
            c = this.drawEntireFaces(this.left, this.right, 0, center, width,
                height, w, faceHeight, wp, xLeft, xRight, yTop, yBot, zFront,
                zBack, yOffset, vecFrontA, vecBackA, vecFrontB, vecBackB,
                geometry, c);
        }
        // Top
        if (!this.top) {
            c = this.drawEntireFaces(this.right, this.left, 180, center,width,
                height, w, faceHeight, wp, xLeft, xRight, yTop, yBot, zFront,
                zBack, yOffset, vecFrontA, vecBackA, vecFrontB, vecBackB,
                geometry, c);
        }
        // Left
        if (!this.left) {
            c = this.drawEntireFaces(this.top, this.bot, -90, center, width,
                height, w, faceHeight, wp, xLeft, xRight, yTop, yBot, zFront,
                zBack, yOffset, vecFrontA, vecBackA, vecFrontB, vecBackB,
                geometry, c);
        }
        // Right
        if (!this.right) {
            c = this.drawEntireFaces(this.bot, this.top, 90, center, width,
                height, w, faceHeight, wp, xLeft, xRight, yTop, yBot, zFront,
                zBack, yOffset, vecFrontA, vecBackA, vecFrontB, vecBackB,
                geometry, c);
        }

        // Collisions
        wp = wp * 2 + $SQUARE_SIZE;
        objCollision = [
            {
                p: position,
                l: localPosition,
                b: [
                    center.x,
                    center.y,
                    center.z,
                    wp,
                    hp,
                    wp,
                    0,
                    0,
                    0
                ],
                w: this.getTotalSquaresWidth(),
                h: this.getTotalSquaresHeight(position[2]),
                d: this.getTotalSquaresWidth(),
                rw: this.getWidthTotalPixels(),
                rh: this.getHeightTotalPixels(),
                t: this,
                k: true
            }
        ];

        return [c, objCollision];
    }
}

// -------------------------------------------------------
//
//  CLASS Mountains
//
// -------------------------------------------------------

/** @class
*   Mountains with the same textures.
*/
function Mountains(texture) {
    this.texture = texture;
    this.width = texture.texture.map.image.width;
    this.height = texture.texture.map.image.height;
    this.geometry = new THREE.Geometry();
    this.geometry.faceVertexUvs[0] = [];
    this.count = 0;
    this.mesh = null;
}

Mountains.prototype = {

    /** Update the geometry of the mountains according to a mountain.
    */
    updateGeometry : function(position, mountain) {
        var res;

        res = mountain.updateGeometry(this.geometry, this.texture, position,
            this.count);
        this.count = res[0];

        return res[1];
    },

    /** Create a mesh with material and geometry.
    */
    createMesh : function() {
        this.mesh = new THREE.Mesh(this.geometry, this.texture.texture);
    }
}
