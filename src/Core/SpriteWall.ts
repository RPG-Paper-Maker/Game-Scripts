/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { MapElement, StructMapElementCollision } from "./MapElement";
import { Position } from "./Position";
import { Datas } from "../index";
import { Enum } from "../Common";
import PictureKind = Enum.PictureKind;
import { Sprite } from "./Sprite";
import { Vector3 } from "./Vector3";
import { Vector2 } from "./Vector2";
import { CustomGeometry } from "./CustomGeometry";

/** @class
 *  A sprite in the map.
 *  @extends MapElement
 *  @param {Record<string, any>} - [json=undefined] Json object describing the 
 *  wall
 */
class SpriteWall extends MapElement {

    public id: number;
    public kind: any;

    constructor(json?: Record<string, any>) {
        super();

        if (json) {
            this.read(json);
        }
    }

    /** 
     *  Read the JSON associated to the sprite wall.
     *  @param {Record<string, any>} - json Json object describing the wall
     */
    read(json: Record<string, any>) {
        super.read(json);

        this.id = json.w;
        this.kind = json.k;
    }

    /** 
     *  Update the geometry of a group of sprite walls with the same material.
     *  @param {THREE.Geometry} geometry - The geometry
     *  @param {Position} position - The position
     *  @param {number} width - The total width of the texture
     *  @param {number} height - The total height of the texture
     *  @param {number} count - The faces count
     *  @return {any[]}
     */
    updateGeometry(geometry: CustomGeometry, position: Position, width: 
        number, height: number, pictureID: number, count: number): [number, 
        StructMapElementCollision[]]
    {
        let vecA = new Vector3(-0.5, 1.0, 0.0);
        let vecB = new Vector3(0.5, 1.0, 0.0);
        let vecC = new Vector3(0.5, 0.0, 0.0);
        let vecD = new Vector3(-0.5, 0.0, 0.0)
        let center = new Vector3();
        let size = new Vector3(Datas.Systems.SQUARE_SIZE, height, 0);
        let angle = position.angleY;
        let localPosition = position.toVector3();

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
        let textureRect: number[] = [this.kind, 0, 1, Math.floor(height / Datas
            .Systems.SQUARE_SIZE)];
        let x: number = (textureRect[0] * Datas.Systems.SQUARE_SIZE) / width;
        let y = textureRect[1];
        let w = Datas.Systems.SQUARE_SIZE / width;
        let h = 1.0;
        let coefX: number = MapElement.COEF_TEX / width;
        let coefY: number = MapElement.COEF_TEX / height;
        x += coefX;
        y += coefY;
        w -= (coefX * 2);
        h -= (coefY * 2);
        let texA = new Vector2();
        let texB = new Vector2();
        let texC = new Vector2();
        let texD = new Vector2();
        CustomGeometry.uvsQuadToTex(texA, texB, texC, texD, x, y, w, h);

        // Collision
        let objCollision: StructMapElementCollision[] = [];
        let collisions: number[][] = [];
        let wall = Datas.SpecialElements.getWall(this.id);
        if (wall) {
            let picture = Datas.Pictures.get(PictureKind.Walls, pictureID);
            if (picture) {
                collisions = picture.getSquaresForWall(textureRect);
            }
            let rect: number[];
            for (let i = 0, l = collisions.length; i < l; i++) {
                rect = collisions[i];
                objCollision.push({
                    p: position,
                    l: localPosition,
                    b: [
                        localPosition.x,
                        localPosition.y + Math.floor((textureRect[3] * Datas.Systems
                            .SQUARE_SIZE - rect[1]) / 2),
                        localPosition.z,
                        rect[2],
                        rect[3] - 0.001, // Small offset for climbing collisions stuff
                        1,
                        angle,
                        0,
                        0
                    ],
                    w: 0,
                    h: textureRect[3],
                    k: true
                });
                let climbing = picture.getSquaresClimbing(textureRect);
                for (let [x, y] of climbing) {
                    objCollision.push({
                        p: position,
                        l: localPosition,
                        b: [
                            localPosition.x + x,
                            localPosition.y + Math.floor((textureRect[3] * Datas.Systems
                                .SQUARE_SIZE - y) / 2),
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
                        k: true,
                        cl: true
                    });
                }
            }
        }

        // Add sprite to geometry
        Sprite.rotateSprite(vecA, vecB, vecC, vecD, center, angle, Sprite.Y_AXIS);
        count = Sprite.addStaticSpriteToGeometry(geometry, vecA, vecB, vecC,
            vecD, texA, texB, texC, texD, count);
        return [count, objCollision];
    }
}

export { SpriteWall }