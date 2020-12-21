/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas } from "..";
import { Sprite } from "./Sprite";
import { Enum } from "../Common";
var ObjectCollisionKind = Enum.ObjectCollisionKind;
import { Object3D } from "./Object3D";
const THREE = require('./Content/Datas/Scripts/Libs/three.js');
/** @class
 *  A 3D object box in the map.
 *  @extends Object3D
 *  @param {Record<string, any>} json Json object describing the object 3D
 *  custom
 *  @param {System.Object3D} datas The System object 3D
 */
class Object3DBox extends Object3D {
    constructor(json, datas) {
        super();
        this.datas = datas;
        if (json) {
            this.read(json);
        }
    }
    /**
     *  Read the JSON associated to the object 3D box.
     *  @param {Record<string, any>} json Json object describing the object 3D
     *  box
    */
    read(json) {
        super.read(json);
        this.id = this.datas.id;
    }
    /**
     *  Update the geometry of a group of object 3D with the same material.
     *  @param {THREE.Geometry} geometry Geometry of the object 3D
     *  @param {Position} position The position of object 3D
     *  @param {number} count The faces count
     *  @return {[number, StructMapElementCollision[]]}
    */
    updateGeometry(geometry, position, count) {
        let coef = 0.01;
        let localPosition = position.toVector3(false);
        localPosition.setX(localPosition.x + coef);
        localPosition.setY(localPosition.y + coef);
        localPosition.setZ(localPosition.z + coef);
        let angleY = position.angleY;
        let angleX = position.angleX;
        let angleZ = position.angleZ;
        let size = this.datas.getSizeVector();
        let center = new THREE.Vector3(localPosition.x + Math.floor(Datas
            .Systems.SQUARE_SIZE / 2), localPosition.y + (size.y / 2), localPosition.z + Math.floor(Datas.Systems.SQUARE_SIZE / 2));
        let centerReal = new THREE.Vector3(localPosition.x + Math.floor(size.x /
            2), localPosition.y + (size.y / 2), localPosition.z + Math.floor(size.z / 2));
        Sprite.rotateVertex(centerReal, center, angleY, Sprite.Y_AXIS);
        Sprite.rotateVertex(centerReal, center, angleX, Sprite.X_AXIS);
        Sprite.rotateVertex(centerReal, center, angleZ, Sprite.Z_AXIS);
        size.setX(size.x - (2 * coef));
        size.setY(size.y - (2 * coef));
        size.setZ(size.z - (2 * coef));
        let w = this.datas.widthPixels();
        let h = this.datas.heightPixels();
        let d = this.datas.depthPixels();
        // Textures
        let textures = Object3DBox.TEXTURES_VALUES.slice(0);
        if (!this.datas.stretch) {
            let totalX = (d * 2) + (w * 2);
            let totalY = (d * 2) + h;
            textures[1] = d / totalX;
            textures[2] = (d + w) / totalX;
            textures[3] = ((2 * d) + w) / totalX;
            textures[5] = d / totalY;
            textures[6] = (d + h) / totalY;
        }
        // Vertices + faces / indexes
        let vecA, vecB, vecC, vecD, texA, texB, texC, texD, faceA, faceB;
        for (let i = 0; i < Object3DBox.NB_VERTICES; i += 4) {
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
            texA = Object3DBox.TEXTURES[i];
            texB = Object3DBox.TEXTURES[i + 1];
            texC = Object3DBox.TEXTURES[i + 2];
            texD = Object3DBox.TEXTURES[i + 3];
            faceA = [
                new THREE.Vector2(textures[texA[0]], textures[texA[1]]),
                new THREE.Vector2(textures[texB[0]], textures[texB[1]]),
                new THREE.Vector2(textures[texC[0]], textures[texC[1]])
            ];
            faceB = [
                new THREE.Vector2(textures[texA[0]], textures[texA[1]]),
                new THREE.Vector2(textures[texC[0]], textures[texC[1]]),
                new THREE.Vector2(textures[texD[0]], textures[texD[1]])
            ];
            if (angleY !== 0.0) {
                Sprite.rotateSprite(vecA, vecB, vecC, vecD, center, angleY, Sprite.Y_AXIS);
            }
            if (angleX !== 0.0) {
                Sprite.rotateSprite(vecA, vecB, vecC, vecD, center, angleX, Sprite.X_AXIS);
            }
            if (angleZ !== 0.0) {
                Sprite.rotateSprite(vecA, vecB, vecC, vecD, center, angleZ, Sprite.Z_AXIS);
            }
            count = Sprite.addStaticSpriteToGeometry(geometry, vecA, vecB, vecC, vecD, faceA, faceB, count);
        }
        // Collisions
        let objCollision = new Array;
        if (this.datas.collisionKind === ObjectCollisionKind.Perfect) {
            let ws = this.datas.width();
            let hs = this.datas.height();
            let ds = this.datas.depth();
            objCollision.push({
                p: position,
                l: localPosition,
                b: [
                    centerReal.x,
                    centerReal.y,
                    centerReal.z,
                    w,
                    h,
                    d,
                    angleY,
                    angleX,
                    angleZ
                ],
                w: ws,
                h: hs,
                d: ds,
                m: Math.max(Math.max(ws, hs), ds),
                k: true
            });
        }
        return [count, objCollision];
    }
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
    [1, 5],
    [2, 5],
    [2, 6],
    [1, 6],
    // Back
    [3, 5],
    [4, 5],
    [4, 6],
    [3, 6],
    // Left
    [0, 5],
    [1, 5],
    [1, 6],
    [0, 6],
    // Right
    [2, 5],
    [3, 5],
    [3, 6],
    [2, 6],
    // Bottom
    [1, 6],
    [2, 6],
    [2, 7],
    [1, 7],
    // Top
    [1, 0],
    [2, 0],
    [2, 5],
    [1, 5]
];
Object3DBox.TEXTURES_VALUES = [
    0.0, 0.25, 0.5, 0.75, 1.0, 0.333333333333333, 0.666666666666666, 1.0
];
Object3DBox.INDEXES = [
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    8, 9, 10, 8, 10, 11,
    12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19,
    20, 21, 22, 20, 22, 23
];
export { Object3DBox };
