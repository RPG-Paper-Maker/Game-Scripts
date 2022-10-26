/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Enum, Utils } from "../Common";
import ElementMapKind = Enum.ElementMapKind;
import { Position } from "./Position";
import { Datas } from "../index";
import { CollisionSquare } from "./CollisionSquare";
import { Vector3 } from "./Vector3";

interface StructMapElementCollision {
    b?: number[],
    p?: Position,
    l?: Vector3,
    c?: Vector3,
    cs?: CollisionSquare,
    w?: number,
    h?: number,
    d?: number,
    rw?: number,
    rh?: number,
    m?: number,
    t?: MapElement,
    k?: boolean,
    left?: boolean,
    right?: boolean,
    top?: boolean,
    bot?: boolean,
    a?: number,
    id?: number,
    cl?: boolean
}

/** @class
 *  An element in the map.
 */
class MapElement {

    public static readonly COEF_TEX = 0.2;

    public xOffset: number;
    public yOffset: number;
    public zOffset: number;
    public front: boolean;

    constructor() {
        this.xOffset = 0;
        this.yOffset = 0;
        this.zOffset = 0;
    }

    /** 
     *  Read the JSON associated to the map element.
     *  @param {Record<string, any>} json - Json object describing the map element
     */
    read(json: Record<string, any>) {
        this.xOffset = Utils.defaultValue(json.xOff, 0);
        this.yOffset = Utils.defaultValue(json.yOff, 0);
        this.zOffset = Utils.defaultValue(json.zOff, 0);
    }

    /** 
     *  Scale the vertices correctly.
     *  @param {Vector3} vecA - The A vertex to rotate
     *  @param {Vector3} vecB - The B vertex to rotate
     *  @param {Vector3} vecC - The C vertex to rotate
     *  @param {Vector3} vecD - The D vertex to rotate
     *  @param {Vector3} center - The center to rotate around
     *  @param {Position} position - The json position
     *  @param {Vector3} size - The scale size
     *  @param {ElementMapKind} kind - The element map kind
     */
    scale(vecA: Vector3, vecB: Vector3, vecC: Vector3, vecD: Vector3, center: 
        Vector3, position: Position, size: Vector3, kind: ElementMapKind)
    {
        let zPlus =  position.layer * 0.05;

        // Apply an offset according to layer position
        if (kind !== Enum.ElementMapKind.SpritesFace && !this.front) {
            zPlus *= -1;
        }
        let offset = new Vector3(0, 0, zPlus);

        // Center
        center.setX(this.xOffset * Datas.Systems.SQUARE_SIZE);
        center.setY(this.yOffset * Datas.Systems.SQUARE_SIZE);
        center.setZ(this.zOffset * Datas.Systems.SQUARE_SIZE);

        // Position
        let pos = center.clone();
        pos.add(offset);
        center.setY(center.y + (size.y / 2));
        vecA.multiply(size);
        vecB.multiply(size);
        vecC.multiply(size);
        vecD.multiply(size);
        vecA.add(pos);
        vecB.add(pos);
        vecC.add(pos);
        vecD.add(pos);
    }
}

export { StructMapElementCollision, MapElement }