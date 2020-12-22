/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Enum, Utils } from "../Common";
import ElementMapKind = Enum.ElementMapKind;
import { MapElement, StructMapElementCollision } from "./MapElement";
import { THREE } from "../Globals";
import { Position } from "./Position";
import { Datas, Manager, Core } from "..";
import { Vector3 } from "./Vector3";
import { Vector2 } from "./Vector2";

/** @class
 *  A sprite in the map.
 *  @extends MapElement
 *  @param {Record<string, any>} [json=undefined] Json object describing the 
 *  sprite
 */
class Sprite extends MapElement {

    public static Y_AXIS = new Vector3(0, 1, 0);
    public static X_AXIS = new Vector3(1, 0, 0);
    public static Z_AXIS = new Vector3(0, 0, 1);

    public kind: ElementMapKind;
    public textureRect: number[];

    constructor(json?: Record<string, any>) {
        super();

        this.front = true;
        if (json) {
            this.read(json);
        }
    }

    /** 
     *  Create a new sprite.
     *  @static
     *  @param {ElementMapKind} kind The element map kind
     *  @param {number[]} texture Texture UV coords
     */
    static create(kind: ElementMapKind, texture: number[]): Sprite {
        let sprite = new Sprite();
        sprite.kind = kind;
        sprite.textureRect = texture;
        return sprite;
    }

    /** 
     *  Rotate a vertex around a specified center.
     *  @static
     *  @param {Vector3} vec The vertex to rotate
     *  @param {Vector3} center The center to rotate around
     *  @param {number} angle The angle in degree
     *  @param {Vector3} axis The vector axis
     */
    static rotateVertex(vec: Vector3, center: Vector3, 
        angle: number, axis: Vector3)
    {
        vec.sub(center);
        vec.applyAxisAngle(axis, angle * Math.PI / 180.0);
        vec.add(center);
    }

    /** Rotate the four vertices of a sprite around a specified center.
     *   @static
     *   @param {Vector3} vecA The A vertex to rotate
     *   @param {Vector3} vecB The B vertex to rotate
     *   @param {Vector3} vecC The C vertex to rotate
     *   @param {Vector3} vecD The D vertex to rotate
     *   @param {Vector3} center The center to rotate around
     *   @param {number} angle The angle in degree
     *   @param {Vector3} axis The vector axis
     */
    static rotateSprite(vecA: Vector3, vecB: Vector3, 
        vecC: Vector3, vecD: Vector3, center: 
        Vector3, angle: number, axis: Vector3)
    {
        Sprite.rotateVertex(vecA, center, angle, axis);
        Sprite.rotateVertex(vecB, center, angle, axis);
        Sprite.rotateVertex(vecC, center, angle, axis);
        Sprite.rotateVertex(vecD, center, angle, axis);
    }

    /** 
     *  Add a static sprite to the geometry.
     *  @static
     *  @param {THREE.Geometry} geometry The geometry
     *  @param {Vector3} vecA The A vertex
     *  @param {Vector3} vecB The B vertex
     *  @param {Vector3} vecC The C vertex
     *  @param {Vector3} vecD The D vertex
     *  @param {Vector2[]} texFaceA The texture face A
     *  @param {Vector2[]} texFaceB The texture face B
     *  @param {number} count The faces count
     *  @returns {number}
     */
    static addStaticSpriteToGeometry(geometry: THREE.Geometry, vecA: Core
        .Vector3, vecB: Vector3, vecC: Vector3, vecD: Vector3, 
        texFaceA: Vector2[], texFaceB: Vector2[], count: number): 
        number
    {
        geometry.vertices.push(vecA);
        geometry.vertices.push(vecB);
        geometry.vertices.push(vecC);
        geometry.vertices.push(vecD);
        geometry.faces.push(new THREE.Face3(count, count + 1, count + 2));
        geometry.faces.push(new THREE.Face3(count, count + 2, count + 3));
        geometry.faceVertexUvs[0].push(texFaceA);
        geometry.faceVertexUvs[0].push(texFaceB);
        return count + 4;
    }

    /** 
     *  Read the JSON associated to the sprite.
     *  @param {Record<string, any>} json Json object describing the sprite
     */
    read(json: Record<string, any>) {
        super.read(json);

        this.front = Utils.defaultValue(json.f, true);
        this.kind = json.k;
        this.textureRect = json.t;
    }

    /** 
     *  Update the geometry associated to this.
     *  @param {THREE.Geometry} geometry The geometry
     *  @param {number} width The total texture width
     *  @param {number} height The total texture height
     *  @param {number[]} position The position
     *  @param {number} count The faces count
     *  @param {boolean} tileset Indicate if the texture is tileset
     *  @param {Vector3} localPosition The local position
     *  @returns {any[]}
     */
    updateGeometry(geometry: THREE.Geometry, width: number, height: 
        number, position: Position, count: number, tileset: boolean, 
        localPosition: Vector3): [number, StructMapElementCollision[]]
    {
        let vecA = new Vector3(-0.5, 1.0, 0.0);
        let vecB = new Vector3(0.5, 1.0, 0.0);
        let vecC = new Vector3(0.5, 0.0, 0.0);
        let vecD = new Vector3(-0.5, 0.0, 0.0);
        let center = new Vector3(0, 0, 0);
        let size = new Vector3(this.textureRect[2] * Datas.Systems
            .SQUARE_SIZE, this.textureRect[3] * Datas.Systems.SQUARE_SIZE, 1.0);

        // For static sprites
        super.scale(vecA, vecB, vecC, vecD, center, position, size, this.kind);
        if (localPosition !== null) {
            vecA.add(localPosition);
            vecB.add(localPosition);
            vecC.add(localPosition);
            vecD.add(localPosition);
            center.add(localPosition);
        } else {
            localPosition = tileset ? position.toVector3() : new Vector3();
        }

        let angleY = position.angleY;
        let angleX = position.angleX;
        let angleZ = position.angleZ;
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
        let x = (this.textureRect[0] * Datas.Systems.SQUARE_SIZE) / width;
        let y = (this.textureRect[1] * Datas.Systems.SQUARE_SIZE) / height;
        let w = (this.textureRect[2] * Datas.Systems.SQUARE_SIZE) / width;
        let h = (this.textureRect[3] * Datas.Systems.SQUARE_SIZE) / height;
        let coefX = MapElement.COEF_TEX / width;
        let coefY = MapElement.COEF_TEX / height;
        x += coefX;
        y += coefY;
        w -= (coefX * 2);
        h -= (coefY * 2);

        // Texture UV coordinates for each triangle faces
        let texFaceA = [
            new Vector2(x, y),
            new Vector2(x + w, y),
            new Vector2(x + w, y + h)
        ];
        let texFaceB = [
            new Vector2(x, y),
            new Vector2(x + w, y + h),
            new Vector2(x, y + h)
        ];

        // Collision
        let objCollision: StructMapElementCollision[] = new Array;
        w = Math.floor(this.textureRect[2] / 2);
        h = Math.floor(this.textureRect[3] / 2);
        if (tileset) {
            let collisions = Manager.Stack.currentMap.mapProperties.tileset.picture
                .getSquaresForTexture(this.textureRect);
            let rect: number[];
            for (let i = 0, l = collisions.length; i < l; i++) {
                rect = collisions[i];
                objCollision.push({
                    p: position,
                    l: localPosition,
                    b: [
                        (localPosition.x - (Math.floor(this.textureRect[2] / 2)
                            * Datas.Systems.SQUARE_SIZE)) - ((this.textureRect[2
                            ] % 2) * Math.round(Datas.Systems.SQUARE_SIZE / 2)) 
                            + rect[0] + Math.round(rect[2] / 2),
                        localPosition.y + (this.textureRect[3] * Datas.Systems
                            .SQUARE_SIZE) - rect[1] - Math.round(rect[3] / 2),
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
        } else {   // Character
            objCollision.push({
                b: null,
                w: w,
                h: h,
                k: this.kind === ElementMapKind.SpritesFix
            });
        }

        // Simple sprite
        let vecSimpleA = vecA.clone();
        let vecSimpleB = vecB.clone();
        let vecSimpleC = vecC.clone();
        let vecSimpleD = vecD.clone();
        count = Sprite.addStaticSpriteToGeometry(geometry, vecSimpleA,
            vecSimpleB, vecSimpleC, vecSimpleD, texFaceA, texFaceB, count);

        // Double sprite
        if (this.kind === ElementMapKind.SpritesDouble || this.kind ===
            ElementMapKind.SpritesQuadra) {
            let vecDoubleA = vecA.clone();
            let vecDoubleB = vecB.clone();
            let vecDoubleC = vecC.clone();
            let vecDoubleD = vecD.clone();
            Sprite.rotateSprite(vecDoubleA, vecDoubleB, vecDoubleC, vecDoubleD,
                center, 90, Sprite.Y_AXIS);
            count = Sprite.addStaticSpriteToGeometry(geometry, vecDoubleA,
                vecDoubleB, vecDoubleC, vecDoubleD, texFaceA, texFaceB, count);

            // Quadra sprite
            if (this.kind === ElementMapKind.SpritesQuadra) {
                let vecQuadra1A = vecA.clone();
                let vecQuadra1B = vecB.clone();
                let vecQuadra1C = vecC.clone();
                let vecQuadra1D = vecD.clone();
                let vecQuadra2A = vecA.clone();
                let vecQuadra2B = vecB.clone();
                let vecQuadra2C = vecC.clone();
                let vecQuadra2D = vecD.clone();
                Sprite.rotateSprite(vecQuadra1A, vecQuadra1B, vecQuadra1C,
                    vecQuadra1D, center, 45, Sprite.Y_AXIS);
                Sprite.rotateSprite(vecQuadra2A, vecQuadra2B, vecQuadra2C,
                    vecQuadra2D, center, -45, Sprite.Y_AXIS);
                count = Sprite.addStaticSpriteToGeometry(geometry, vecQuadra1A,
                    vecQuadra1B, vecQuadra1C, vecQuadra1D, texFaceA, texFaceB,
                    count);
                count = Sprite.addStaticSpriteToGeometry(geometry, vecQuadra2A,
                    vecQuadra2B, vecQuadra2C, vecQuadra2D, texFaceA, texFaceB,
                    count);
            }
        }
        return [count, objCollision];
    }

    /** 
     *  Create the geometry associated to this sprite
     *  @param {number} width The texture total width
     *  @param {number} height The texture total height
     *  @param {boolean} tileset Indicate if the texture is tileset
     *  @param {Position} position The position
     *  @returns {any[]}
     */
    createGeometry(width: number, height: number, tileset: boolean, position: 
        Position): [THREE.Geometry, [number, StructMapElementCollision[]]]
    {
        let geometry = new THREE.Geometry();
        geometry.faceVertexUvs[0] = [];
        geometry.uvsNeedUpdate = true;
        return [geometry, this.updateGeometry(geometry, width, height, position,
            0, tileset, null)];
    }
}

export { Sprite }