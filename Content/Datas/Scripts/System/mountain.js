/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A mountain in the map
*/
class Mountain extends MapElement
{
    static X_LEFT_OFFSET = 0;
    static X_MID_OFFSET = 1;
    static X_RIGHT_OFFSET = 2;
    static X_MIX_OFFSET = 3;
    static Y_TOP_OFFSET = 0;
    static Y_MID_OFFSET = 1;
    static Y_BOT_OFFSET = 2;
    static Y_MIX_OFFSET = 3;

    constructor(json)
    {
        super();
        if (json)
        {
            this.read(json);
        }
    }

    read(json)
    {
        super.read(json);
        this.mountainID = RPM.defaultValue(json.sid, -1);
        this.widthSquares = RPM.defaultValue(json.ws, 0);
        this.widthPixels = RPM.defaultValue(json.wp, 0);
        this.heightSquares = RPM.defaultValue(json.hs, 1);
        this.heightPixels = RPM.defaultValue(json.hp, 0);
        this.top = RPM.defaultValue(json.t, false);
        this.bot = RPM.defaultValue(json.b, false);
        this.left = RPM.defaultValue(json.l, false);
        this.right = RPM.defaultValue(json.r, false);

        // Calculate angle
        let width = this.getWidthTotalPixels();
        this.angle = width === 0 ? 90 : Math.atan(this.getHeightTotalPixels() /
            width) * 180 / Math.PI;
    }

    // -------------------------------------------------------

    getTotalSquaresWidth()
    {
        return this.widthSquares + (this.getWidthOnlyPixelsPlus() > 0 ? 1 : 0);
    }

    // -------------------------------------------------------

    getTotalSquaresHeight(yPlus)
    {
        return this.heightSquares + (this.getHeightOnlyPixelsPlus() + yPlus > 0
            ? 1 : 0);
    }

    // -------------------------------------------------------

    getWidthOnlyPixelsPlus()
    {
        return Math.round(this.widthPixels * RPM.SQUARE_SIZE / 100);
    }

    // -------------------------------------------------------

    getHeightOnlyPixelsPlus()
    {
        return Math.round(this.heightPixels * RPM.SQUARE_SIZE / 100);
    }

    // -------------------------------------------------------

    getWidthTotalPixels()
    {
        return this.widthSquares * RPM.SQUARE_SIZE + this.getWidthOnlyPixelsPlus();
    }

    // -------------------------------------------------------

    getHeightTotalPixels()
    {
        return this.heightSquares * RPM.SQUARE_SIZE + this
            .getHeightOnlyPixelsPlus();
    }

    // -------------------------------------------------------

    getSystem()
    {
        return RPM.datasGame.specialElements.mountains[this.mountainID];
    }

    // -------------------------------------------------------

    drawEntireFaces(left, right, angle, center, width, height, w, faceHeight, wp
        , xLeft, xRight, yTop, yBot, zFront, zBack, yOffset, vecFrontA, vecBackA
        , vecFrontB, vecBackB, geometry, count)
    {
        let xKind = Mountain.X_LEFT_OFFSET;
        let nbSteps = Math.ceil(faceHeight / RPM.SQUARE_SIZE);
        let vecCenterA = vecFrontA.clone().addScaledVector(vecBackA.clone().sub(
            vecFrontA), 0.5);
        let vecCenterB = vecFrontB.clone().addScaledVector(vecBackB.clone().sub(
            vecFrontB), 0.5);

        // Define x offset according to left / right stuff
        if (!left && right)
        {
            xKind = Mountain.X_LEFT_OFFSET;
        } else if (left && right)
        {
            xKind = Mountain.X_MID_OFFSET;
        } else if (left && !right)
        {
            xKind = Mountain.X_RIGHT_OFFSET;
        } else if (!left && !right)
        {
            xKind = Mountain.X_MIX_OFFSET;
        }

        // Draw all faces
        if (faceHeight === RPM.SQUARE_SIZE)
        {   // 1 Mix sprite
            // Mix
            count = this.drawSideCorner(xKind, Mountain.Y_MIX_OFFSET, angle,
                center, width, height, w, faceHeight, wp, xLeft, xRight,
                vecBackA.x, vecBackB.x, vecFrontA.x, vecBackB.x, yTop, yBot,
                zFront, zBack, vecFrontA.z, vecFrontB.z, vecBackA.z, vecBackB.z,
                yOffset, geometry, count, 0, vecFrontA.distanceTo(vecFrontB));
        } else if (faceHeight <= (2 * RPM.SQUARE_SIZE))
        {   // 2 B / T sprites
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
        } else
        {   // 3 B / M / T sprites
            // Bottom
            let vecStepLeftB = vecFrontA.clone().addScaledVector(vecBackA
                .clone().sub(vecFrontA), 1 / nbSteps);
            let vecStepRightB = vecFrontB.clone().addScaledVector(vecBackB
                .clone().sub(vecFrontB), 1 / nbSteps);
            count = this.drawSideCorner(xKind, Mountain.Y_BOT_OFFSET, angle,
                center, width, height, w, Math.floor(faceHeight / nbSteps), wp,
                xLeft, xRight, vecStepLeftB.x, vecStepRightB.x, vecFrontA.x,
                vecFrontB.x, vecStepRightB.y, yBot, zFront, vecStepRightB.z,
                vecFrontA.z, vecFrontB.z, vecStepLeftB.z, vecStepRightB.z,
                yOffset, geometry, count, vecStepLeftB.distanceTo(vecStepRightB)
                , vecFrontA.distanceTo(vecFrontB));

            // Middle: add as many as middle blocks as possible
            let vecStepLeftA, vecStepRightA;
            for (let i = 2; i <= nbSteps - 1; i++)
            {
                vecStepLeftA = vecStepLeftB;
                vecStepRightA = vecStepRightB;
                vecStepLeftB = vecFrontA.clone().addScaledVector(vecBackA
                    .clone().sub(vecFrontA), i / nbSteps);
                vecStepRightB = vecFrontB.clone().addScaledVector(vecBackB
                    .clone().sub(vecFrontB), i / nbSteps);
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
    }

    // -------------------------------------------------------

    drawSideCorner(xKind, yKind, angle, center, width, height, w, faceHeight, wp
        , xLeft, xRight, xLeftTop, xRightTop, xLeftBot, xRightBot, yTop, yBot, 
        zFront, zBack, zFrontLeft, zFrontRight, zBackLeft, zBackRight, yOffset, 
        geometry, count, xCornerOffsetTop, xCornerOffsetBot)
    {
        count = this.drawFace(xKind, yKind, angle, center, width, height, w,
            faceHeight, xLeft, xRight, xLeft, xRight, yTop, yBot, zFront, zFront
            , zBack, zBack, yOffset, geometry, count, 0, 0, false);

        // Draw corner only if there is a border width
        if (wp > 0)
        {
            count = this.drawFace(xKind, yKind, angle, center, width, height, w,
                faceHeight, xLeftTop, xRightTop, xLeftBot, xRightBot, yTop, yBot
                , zFrontLeft, zFrontRight, zBackLeft, zBackRight, yOffset,
                geometry, count, xCornerOffsetTop, xCornerOffsetBot, true);
        }
        return count;
    }

    // -------------------------------------------------------

    drawFace(xKind, yKind, angle, center, width, height, w, faceHeight, xLeftTop
        , xRightTop, xLeftBot, xRightBot, yTop, yBot, zFrontLeft, zFrontRight, 
        zBackLeft, zBackRight, yOffset, geometry, count, xCornerOffsetTop, 
        xCornerOffsetBot, isCorner)
    {
        // Textures coordinates
        let x = (xKind * RPM.SQUARE_SIZE) / width;
        let y = ((yKind * RPM.SQUARE_SIZE) + (yKind === Mountain.Y_BOT_OFFSET ?
            RPM.SQUARE_SIZE - faceHeight : 0) + yOffset) / height;
        let h = faceHeight / height;
        let coefX = RPM.COEF_TEX / width;
        let coefY = RPM.COEF_TEX / height;
        x += coefX;
        y += coefY;
        w -= (coefX * 2);
        h -= (coefY * 2);

        // Textures and vertices
        let texA, texB, texC, texD;
        if (isCorner)
        {
            texA = new THREE.Vector2(((xKind * RPM.SQUARE_SIZE) + ((RPM
                .SQUARE_SIZE - xCornerOffsetTop) / 2)) / width + coefX, y);
            texB = new THREE.Vector2((((xKind + 1) * RPM.SQUARE_SIZE) - ((RPM
                .SQUARE_SIZE - xCornerOffsetTop) / 2)) / width - coefX, y);
            texC = new THREE.Vector2((((xKind + 1) * RPM.SQUARE_SIZE) - ((RPM
                .SQUARE_SIZE - xCornerOffsetBot) / 2)) / width - coefX, y + h);
            texD = new THREE.Vector2((((xKind) * RPM.SQUARE_SIZE) + ((RPM
                .SQUARE_SIZE - xCornerOffsetBot) / 2)) / width + coefX, y + h);
        } else
        {   // Triangle form for corners
            texA = new THREE.Vector2(x, y);
            texB = new THREE.Vector2(x + w, y);
            texC = new THREE.Vector2(x + w, y + h);
            texD = new THREE.Vector2(x, y + h);
        }
        let texFaceA = [
            new THREE.Vector2(texA.x, texA.y),
            new THREE.Vector2(texB.x, texB.y),
            new THREE.Vector2(texC.x, texC.y)
        ];
        let texFaceB = [
            new THREE.Vector2(texA.x, texA.y),
            new THREE.Vector2(texC.x, texC.y),
            new THREE.Vector2(texD.x, texD.y)
        ];
        let vecA = new THREE.Vector3(xLeftTop, yTop, zBackLeft);
        let vecB = new THREE.Vector3(xRightTop, yTop, zBackRight);
        let vecC = new THREE.Vector3(xRightBot, yBot, zFrontRight);
        let vecD = new THREE.Vector3(xLeftBot, yBot, zFrontLeft);

        // Rotate and draw sprite side
        Sprite.rotateSprite(vecA, vecB, vecC, vecD, center, angle, Sprite.Y_AXIS);
        count = Sprite.addStaticSpriteToGeometry(geometry, vecA, vecB, vecC, 
            vecD, texFaceA, texFaceB, count);
        return count;
    }

    // -------------------------------------------------------
    /** Update the geometry of a group of sprite walls with the same material.
    *   @param {THREE.Geometry} geometry of the sprites walls.
    *   @param {number[]} position The position of the wall.
    *   @return {number}
    */
    updateGeometry(geometry, texture, position, c)
    {
        // General configurations
        let yOffset = texture.getOffset(this.mountainID, null) * 4 * RPM
            .SQUARE_SIZE;
        let wp = this.getWidthTotalPixels();
        let hp = this.getHeightTotalPixels();
        let width = 4 * RPM.SQUARE_SIZE;
        let height = RPM.MAX_PICTURE_SIZE;
        let faceHeight = Math.sqrt((wp * wp) + (hp * hp));
        let w = RPM.SQUARE_SIZE / width;
        let localPosition = RPM.positionToBorderVector3(position);
        let center = new THREE.Vector3(localPosition.x + (RPM.SQUARE_SIZE / 2),
            localPosition.y + (hp / 2), localPosition.z + (RPM.SQUARE_SIZE / 2));
        let xLeft = localPosition.x;
        let xRight = localPosition.x + RPM.SQUARE_SIZE;
        let yTop = localPosition.y + hp;
        let yBot = localPosition.y;
        let zFront = localPosition.z + RPM.SQUARE_SIZE + wp;
        let zBack = zFront - wp;
        let vecFrontB = new THREE.Vector3(xLeft, yBot, zFront);
        let vecBackB = new THREE.Vector3(xLeft, yTop, zBack);
        let vecFrontA = new THREE.Vector3(xLeft - wp, yBot, zBack);
        let vecBackA = new THREE.Vector3(xLeft, yTop, zBack);

        // Bot
        if (!this.bot)
        {
            c = this.drawEntireFaces(this.left, this.right, 0, center, width,
                height, w, faceHeight, wp, xLeft, xRight, yTop, yBot, zFront,
                zBack, yOffset, vecFrontA, vecBackA, vecFrontB, vecBackB,
                geometry, c);
        }
        // Top
        if (!this.top)
        {
            c = this.drawEntireFaces(this.right, this.left, 180, center,width,
                height, w, faceHeight, wp, xLeft, xRight, yTop, yBot, zFront,
                zBack, yOffset, vecFrontA, vecBackA, vecFrontB, vecBackB,
                geometry, c);
        }
        // Left
        if (!this.left)
        {
            c = this.drawEntireFaces(this.top, this.bot, -90, center, width,
                height, w, faceHeight, wp, xLeft, xRight, yTop, yBot, zFront,
                zBack, yOffset, vecFrontA, vecBackA, vecFrontB, vecBackB,
                geometry, c);
        }
        // Right
        if (!this.right)
        {
            c = this.drawEntireFaces(this.bot, this.top, 90, center, width,
                height, w, faceHeight, wp, xLeft, xRight, yTop, yBot, zFront,
                zBack, yOffset, vecFrontA, vecBackA, vecFrontB, vecBackB,
                geometry, c);
        }

        // Collisions
        wp = wp * 2 + RPM.SQUARE_SIZE;
        let objCollision = [
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
                m: Math.max(this.getTotalSquaresWidth(), this
                    .getTotalSquaresHeight(position[2])),
                t: this,
                k: true
            }
        ];
        return [c, objCollision];
    }
}

/** @class
*   Mountains with the same textures
*/
class Mountains
{
    constructor(texture)
    {
        this.texture = texture;
        this.width = texture.texture.map.image.width;
        this.height = texture.texture.map.image.height;
        this.geometry = new THREE.Geometry();
        this.geometry.faceVertexUvs[0] = [];
        this.count = 0;
        this.mesh = null;
    }

    /** Update the geometry of the mountains according to a mountain
    */
    updateGeometry(position, mountain)
    {
        let res = mountain.updateGeometry(this.geometry, this.texture, position,
            this.count);
        this.count = res[0];
        return res[1];
    }

    /** Create a mesh with material and geometry
    */
    createMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.texture.texture);
    }
}