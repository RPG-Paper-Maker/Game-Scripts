/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *   A sprite in the map
 *   @extends MapElement
 *   @property {number} id The picture ID of the sprite
 *   @property {SpriteWallKind} kind The kind of wall (border or not)
 *   @param {Object} [json=undefined] Json object describing the wall
 */
import {MapElement, Sprite} from ".";
import * as THREE from "../Vendor/three.js";
import {Enum} from ".";
import SpriteWallKind = Enum.SpriteWallKind;
import PictureKind = Enum.PictureKind;

export class SpriteWall extends MapElement {
    id: number;
    kind: any;

    constructor(json?) {
        super();

        if (json) {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the sprite wall
     *   @param {Object} json Json object describing the wall
     */
    read(json) {
        super.read(json);

        this.id = json.w;
        this.kind = json.k;
    }

    // -------------------------------------------------------
    /** Update the geometry of a group of sprite walls with the same material
     *   @param {THREE.Geometry} geometry The geometry
     *   @param {number[]} position The json position
     *   @param {number} width The total width of the texture
     *   @param {number} height The total height of the texture
     *   @param {number} count The faces count
     *   @return {any[]}
     */
    updateGeometry(geometry, position, width, height, count) {
        let vecA = new THREE.Vector3(-0.5, 1.0, 0.0);
        let vecB = new THREE.Vector3(0.5, 1.0, 0.0);
        let vecC = new THREE.Vector3(0.5, 0.0, 0.0);
        let vecD = new THREE.Vector3(-0.5, 0.0, 0.0)
        let center = new THREE.Vector3();
        let size = new THREE.Vector3(RPM.SQUARE_SIZE, height, 0);
        let angle = RPM.positionAngleY(position);
        let localPosition = RPM.positionToVector3(position);

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
        let textureRect: number[] = [this.kind, 0, 1, Math.floor(height / RPM.SQUARE_SIZE)];
        let x: number = (textureRect[0] * RPM.SQUARE_SIZE) / width;
        let y = textureRect[1];
        let w = RPM.SQUARE_SIZE / width;
        let h = 1.0;
        let coefX: number = RPM.COEF_TEX / width;
        let coefY: number = RPM.COEF_TEX / height;
        x += coefX;
        y += coefY;
        w -= (coefX * 2);
        h -= (coefY * 2);

        // Texture UV coordinates for each triangle faces
        let texFaceA = [
            new THREE.Vector2(x, y),
            new THREE.Vector2(x + w, y),
            new THREE.Vector2(x + w, y + h)
        ];
        let texFaceB = [
            new THREE.Vector2(x, y),
            new THREE.Vector2(x + w, y + h),
            new THREE.Vector2(x, y + h)
        ];

        // Collision
        let objCollision = [];
        let collisions = [];
        let wall = RPM.datasGame.specialElements.walls[this.id];
        if (wall) {
            let picture = RPM.datasGame.pictures.get(PictureKind.Walls, wall
                .pictureID);
            if (picture) {
                collisions = picture.getSquaresForWall(textureRect);
            }
        }
        let rect;
        for (let i = 0, l = collisions.length; i < l; i++) {
            rect = collisions[i];
            objCollision.push({
                p: position,
                l: localPosition,
                b: [
                    localPosition.x,
                    localPosition.y + Math.floor((textureRect[3] * RPM
                        .SQUARE_SIZE - rect[1]) / 2),
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

        // Add sprite to geometry
        Sprite.rotateSprite(vecA, vecB, vecC, vecD, center, angle, Sprite.Y_AXIS);
        count = Sprite.addStaticSpriteToGeometry(geometry, vecA, vecB, vecC,
            vecD, texFaceA, texFaceB, count);
        return [count, objCollision];
    }
}
