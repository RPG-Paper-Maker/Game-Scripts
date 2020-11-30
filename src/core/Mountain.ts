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
 *   @extends MapElement
 *   @property {number} [Mountain.X_LEFT_OFFSET=0] Offset for x left
 *   @property {number} [Mountain.X_MID_OFFSET=1] Offset for x mid
 *   @property {number} [Mountain.X_RIGHT_OFFSET=2] Offset for x right
 *   @property {number} [Mountain.X_MIX_OFFSET=3] Offset for x mix
 *   @property {number} [Mountain.Y_TOP_OFFSET=0] Offset for y top
 *   @property {number} [Mountain.Y_MID_OFFSET=1] Offset for y mid
 *   @property {number} [Mountain.Y_BOT_OFFSET=2] Offset for y bot
 *   @property {number} [Mountain.Y_MIX_OFFSET=3] Offset for y mix
 *   @property {number} mountainID The mountain ID
 *   @property {number} widthSquares The width in squares
 *   @property {number} widthPixels The width in pixels
 *   @property {number} heightSquares The height in squares
 *   @property {number} heightPixels The height in pixels
 *   @property {boolean} top Indicate there's another mountain on top
 *   @property {boolean} bot Indicate there's another mountain on bot
 *   @property {boolean} left Indicate there's another mountain on left
 *   @property {boolean} right Indicate there's another mountain on right
 *   @property {number} angle The angle of the mountain
 *   @param {Object} [json=undefined] Json object describing the mountain
 */

import {MapElement} from ".";
import THREE from "three";
import {RPM} from "./rpm";
import {Sprite} from ".";

export class Mountain extends MapElement {
    static X_LEFT_OFFSET = 0;
    static X_MID_OFFSET = 1;
    static X_RIGHT_OFFSET = 2;
    static X_MIX_OFFSET = 3;
    static Y_TOP_OFFSET = 0;
    static Y_MID_OFFSET = 1;
    static Y_BOT_OFFSET = 2;
    static Y_MIX_OFFSET = 3;

    mountainID: number;
    widthSquares: number;
    widthPixels: number;
    heightSquares: number;
    heightPixels: number;
    top: boolean;
    bot: boolean;
    left: boolean;
    right: boolean;
    angle: number;

    constructor(json) {
        super();
        if (json) {
            this.read(json);
        }
    }


    /** Read the JSON associated to the mountain
     *   @param {Object} json Json object describing the mountain
     */
    read(json) {
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
    /** Get the total squares width
     *   @returns {number}
     */
    getTotalSquaresWidth() {
        return this.widthSquares + (this.getWidthOnlyPixelsPlus() > 0 ? 1 : 0);
    }

    // -------------------------------------------------------
    /** Get the total squares height
     *   @returns {number}
     */
    getTotalSquaresHeight(yPlus) {
        return this.heightSquares + (this.getHeightOnlyPixelsPlus() + yPlus > 0
            ? 1 : 0);
    }

    // -------------------------------------------------------
    /** Get the squares number width with pixels plus
     *   @returns {number}
     */
    getWidthOnlyPixelsPlus() {
        return Math.round(this.widthPixels * RPM.SQUARE_SIZE / 100);
    }

    // -------------------------------------------------------
    /** Get the squares number height with pixels plus
     *   @returns {number}
     */
    getHeightOnlyPixelsPlus() {
        return Math.round(this.heightPixels * RPM.SQUARE_SIZE / 100);
    }

    // -------------------------------------------------------
    /** Get the total width in pixels
     *   @returns {number}
     */
    getWidthTotalPixels() {
        return this.widthSquares * RPM.SQUARE_SIZE + this.getWidthOnlyPixelsPlus();
    }

    // -------------------------------------------------------
    /** Get the total height in pixels
     *   @returns {number}
     */
    getHeightTotalPixels() {
        return this.heightSquares * RPM.SQUARE_SIZE + this
            .getHeightOnlyPixelsPlus();
    }

    // -------------------------------------------------------
    /** Get the System special element mountain
     *   @returns {SystemSpecialElement}
     */
    getSystem() {
        return RPM.datasGame.specialElements.mountains[this.mountainID];
    }

    // -------------------------------------------------------
    /** Draw the entire faces
     *   @param {boolean} left Indicate if left
     *   @param {boolean} right Indicate if right
     *   @param {number} angle The angle
     *   @param {THREE.Vector3} center The position center
     *   @param {number} width The width in squares
     *   @param {number} height The height in squares
     *   @param {number} w The w in coordinates
     *   @param {number} faceHeight The face height
     *   @param {number} wp The width pixels
     *   @param {number} xLeft The x left position
     *   @param {number} xRight The x right position
     *   @param {number} yTop The y top position
     *   @param {number} yBot The y bot position
     *   @param {number} zFront The z front position
     *   @param {number} zBack The z back position
     *   @param {number} yOffset The y offset
     *   @param {THREE.Vector3} vecFrontA The front vector position A
     *   @param {THREE.Vector3} vecBackA The back vector position A
     *   @param {THREE.Vector3} vecFrontB The front vector position B
     *   @param {THREE.Vector3} vecBackB The back vector position B
     *   @param {THREE.geometry} geometry The geometry
     *   @param {number} count The faces count
     */
    drawEntireFaces(left, right, angle, center, width, height, w, faceHeight, wp
        , xLeft, xRight, yTop, yBot, zFront, zBack, yOffset, vecFrontA, vecBackA
        , vecFrontB, vecBackB, geometry, count) {
        let xKind = Mountain.X_LEFT_OFFSET;
        let nbSteps = Math.ceil(faceHeight / RPM.SQUARE_SIZE);
        let vecCenterA = vecFrontA.clone().addScaledVector(vecBackA.clone().sub(
            vecFrontA), 0.5);
        let vecCenterB = vecFrontB.clone().addScaledVector(vecBackB.clone().sub(
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
        if (faceHeight === RPM.SQUARE_SIZE) {   // 1 Mix sprite
            // Mix
            count = this.drawSideCorner(xKind, Mountain.Y_MIX_OFFSET, angle,
                center, width, height, w, faceHeight, wp, xLeft, xRight,
                vecBackA.x, vecBackB.x, vecFrontA.x, vecBackB.x, yTop, yBot,
                zFront, zBack, vecFrontA.z, vecFrontB.z, vecBackA.z, vecBackB.z,
                yOffset, geometry, count, 0, vecFrontA.distanceTo(vecFrontB));
        } else if (faceHeight <= (2 * RPM.SQUARE_SIZE)) {   // 2 B / T sprites
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
        } else {   // 3 B / M / T sprites
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
            for (let i = 2; i <= nbSteps - 1; i++) {
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
    /** Draw the side corner
     *   @param {number} xKind The xKind position
     *   @param {number} yKind The yKind position
     *   @param {number} angle The angle
     *   @param {THREE.Vector3} center The position center
     *   @param {number} width The width in squares
     *   @param {number} height The height in squares
     *   @param {number} w The w in coordinates
     *   @param {number} faceHeight The face height
     *   @param {number} wp The width pixels
     *   @param {number} xLeft The x left position
     *   @param {number} xRight The x right position
     *   @param {number} xLeftTop The x left top position
     *   @param {number} xRightTop The x right top position
     *   @param {number} xLeftBot The x left bot position
     *   @param {number} xRightBot The x right bot position
     *   @param {number} yTop The y top position
     *   @param {number} yBot The y bot position
     *   @param {number} zFront The z front position
     *   @param {number} zBack The z back position
     *   @param {number} zFrontLeft The z front left position
     *   @param {number} zFrontRight The z front right position
     *   @param {number} zBackLeft The z back left position
     *   @param {number} zBackRight The z back right position
     *   @param {number} yOffset The y offset
     *   @param {THREE.geometry} geometry The geometry
     *   @param {number} count The faces count
     *   @param {number} xCornerOffsetTop The x corner offset top
     *   @param {number} xCornerOffsetBot The x corner offset bot
     */
    drawSideCorner(xKind, yKind, angle, center, width, height, w, faceHeight, wp
        , xLeft, xRight, xLeftTop, xRightTop, xLeftBot, xRightBot, yTop, yBot,
                   zFront, zBack, zFrontLeft, zFrontRight, zBackLeft, zBackRight, yOffset,
                   geometry, count, xCornerOffsetTop, xCornerOffsetBot) {
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
    }

    // -------------------------------------------------------
    /** Draw a face
     *   @param {number} xKind The xKind position
     *   @param {number} yKind The yKind position
     *   @param {number} angle The angle
     *   @param {THREE.Vector3} center The position center
     *   @param {number} width The width in squares
     *   @param {number} height The height in squares
     *   @param {number} w The w in coordinates
     *   @param {number} faceHeight The face height
     *   @param {number} xLeftTop The x left top position
     *   @param {number} xRightTop The x right top position
     *   @param {number} xLeftBot The x left bot position
     *   @param {number} xRightBot The x right bot position
     *   @param {number} yTop The y top position
     *   @param {number} yBot The y bot position
     *   @param {number} zFrontLeft The z front left position
     *   @param {number} zFrontRight The z front right position
     *   @param {number} zBackLeft The z back left position
     *   @param {number} zBackRight The z back right position
     *   @param {number} yOffset The y offset
     *   @param {THREE.geometry} geometry The geometry
     *   @param {number} count The faces count
     *   @param {number} xCornerOffsetTop The x corner offset top
     *   @param {number} xCornerOffsetBot The x corner offset bot
     *   @param {boolean} isCorner Indicate if corner
     */
    drawFace(xKind, yKind, angle, center, width, height, w, faceHeight, xLeftTop
        , xRightTop, xLeftBot, xRightBot, yTop, yBot, zFrontLeft, zFrontRight,
             zBackLeft, zBackRight, yOffset, geometry, count, xCornerOffsetTop,
             xCornerOffsetBot, isCorner) {
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
        if (isCorner) {
            texA = new THREE.Vector2(((xKind * RPM.SQUARE_SIZE) + ((RPM
                .SQUARE_SIZE - xCornerOffsetTop) / 2)) / width + coefX, y);
            texB = new THREE.Vector2((((xKind + 1) * RPM.SQUARE_SIZE) - ((RPM
                .SQUARE_SIZE - xCornerOffsetTop) / 2)) / width - coefX, y);
            texC = new THREE.Vector2((((xKind + 1) * RPM.SQUARE_SIZE) - ((RPM
                .SQUARE_SIZE - xCornerOffsetBot) / 2)) / width - coefX, y + h);
            texD = new THREE.Vector2((((xKind) * RPM.SQUARE_SIZE) + ((RPM
                .SQUARE_SIZE - xCornerOffsetBot) / 2)) / width + coefX, y + h);
        } else {   // Triangle form for corners
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
    /** Update the geometry of a group of mountains with the same material
     *   @param {THREE.Geometry} geometry The geometry of mountains
     *   @param {number[]} texture The texture mountain
     *   @param {number[]} position The json position
     *   @param {number} count The faces count
     *   @return {any[]}
     */
    updateGeometry(geometry, texture, position, count) {
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
        if (!this.bot) {
            count = this.drawEntireFaces(this.left, this.right, 0, center, width
                , height, w, faceHeight, wp, xLeft, xRight, yTop, yBot, zFront,
                zBack, yOffset, vecFrontA, vecBackA, vecFrontB, vecBackB,
                geometry, count);
        }
        // Top
        if (!this.top) {
            count = this.drawEntireFaces(this.right, this.left, 180, center,
                width, height, w, faceHeight, wp, xLeft, xRight, yTop, yBot,
                zFront, zBack, yOffset, vecFrontA, vecBackA, vecFrontB, vecBackB
                , geometry, count);
        }
        // Left
        if (!this.left) {
            count = this.drawEntireFaces(this.top, this.bot, -90, center, width,
                height, w, faceHeight, wp, xLeft, xRight, yTop, yBot, zFront,
                zBack, yOffset, vecFrontA, vecBackA, vecFrontB, vecBackB,
                geometry, count);
        }
        // Right
        if (!this.right) {
            count = this.drawEntireFaces(this.bot, this.top, 90, center, width,
                height, w, faceHeight, wp, xLeft, xRight, yTop, yBot, zFront,
                zBack, yOffset, vecFrontA, vecBackA, vecFrontB, vecBackB,
                geometry, count);
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
        return [count, objCollision];
    }
}