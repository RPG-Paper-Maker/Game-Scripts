/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum, Utils } from "../Common/index.js";
import { THREE } from "../../Libs/index.js";
import { Datas } from "../index.js";
/** @class
 *  An element in the map.
 *  @property {number} xOffset The x offset of the object according to layer
 *  @property {number} yOffset The y offset of the object according to layer
 *  @property {number} zOffset The z offset of the object according to layer
 *  @property {Orientation} orientation The orientation according to layer
 *  @property {CameraUpDown} upDown The camera up down orientation according to
 *  layer
 */
class MapElement {
    constructor() {
        this.xOffset = 0;
        this.yOffset = 0;
        this.zOffset = 0;
    }
    /**
     *  Read the JSON associated to the map element.
     *  @param {Record<string, any>} json Json object describing the map element
     */
    read(json) {
        this.xOffset = Utils.defaultValue(json.xOff, 0);
        this.yOffset = Utils.defaultValue(json.yOff, 0);
        this.zOffset = Utils.defaultValue(json.zOff, 0);
    }
    /**
     *  Scale the vertices correctly.
     *  @param {THREE.Vector3} vecA The A vertex to rotate
     *  @param {THREE.Vector3} vecB The B vertex to rotate
     *  @param {THREE.Vector3} vecC The C vertex to rotate
     *  @param {THREE.Vector3} vecD The D vertex to rotate
     *  @param {THREE.Vector3} center The center to rotate around
     *  @param {Position} position The json position
     *  @param {THREE.Vector3} size The scale size
     *  @param {ElementMapKind} kind The element map kind
     */
    scale(vecA, vecB, vecC, vecD, center, position, size, kind) {
        let zPlus = position.layer * 0.05;
        // Apply an offset according to layer position
        if (kind !== Enum.ElementMapKind.SpritesFace && !this.front) {
            zPlus *= -1;
        }
        let offset = new THREE.Vector3(0, 0, zPlus);
        // Center
        center.setX(this.xOffset * Datas.Systems.SQUARE_SIZE);
        center.setY(this.yOffset * Datas.Systems.SQUARE_SIZE);
        center.setZ(this.zOffset * Datas.Systems.SQUARE_SIZE);
        // Position
        let pos = center.clone();
        pos.add(offset);
        center.setY(center.y + (size.y / 2));
        // @ts-ignore
        vecA.multiply(size);
        // @ts-ignore
        vecB.multiply(size);
        // @ts-ignore
        vecC.multiply(size);
        // @ts-ignore
        vecD.multiply(size);
        // @ts-ignore
        vecA.add(pos);
        // @ts-ignore
        vecB.add(pos);
        // @ts-ignore
        vecC.add(pos);
        // @ts-ignore
        vecD.add(pos);
    }
}
export { MapElement };
