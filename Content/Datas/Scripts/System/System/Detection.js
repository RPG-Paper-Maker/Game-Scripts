/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Utils, Enum } from "../Common/index.js";
import { Position } from "../Core/index.js";
var Orientation = Enum.Orientation;
import { Datas, Manager } from "../index.js";
/** @class
 *  A detection of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  detection
 */
class Detection extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the detection.
     *  @param {Record<string, any>} - json Json object describing the detection
     */
    read(json) {
        let jsonList = Utils.defaultValue(json.b, []);
        let l = jsonList.length;
        this.boxes = new Array(l);
        let jsonElement;
        for (let i = 0; i < l; i++) {
            jsonElement = jsonList[i];
            this.boxes[i] = [Position.createFromArray(jsonElement.k), Utils
                    .defaultValue(jsonElement.v.bhs, 1), Utils.defaultValue(jsonElement.v.bhp, 0)];
        }
    }
    /**
     *  Check the collision between sender and object.
     *  @param {MapObject} sender - The object that sent test collision
     *  @param {MapObject} object - The object to test the collision
     *  @returns {boolean}
     */
    checkCollision(sender, object) {
        let boundingBoxes = this.getBoundingBoxes(sender);
        for (let i = 0, l = boundingBoxes.length; i < l; i++) {
            Manager.Collisions.applyBoxSpriteTransforms(Manager.Collisions
                .BB_BOX_DETECTION, boundingBoxes[i]);
            if (object.checkCollisionDetection()) {
                return true;
            }
        }
        return false;
    }
    /**
     *  Get the sender bounding box.
     *  @param {MapObject} sender - The object that sent test collision
     *  @returns {number[][]}
     */
    getBoundingBoxes(sender) {
        let orientation = sender.orientationEye;
        let localPosition = sender.position;
        let l = this.boxes.length;
        let list = new Array(l);
        let box, p, x, z;
        for (let i = 0; i < l; i++) {
            box = this.boxes[i];
            p = box[0];
            // Update position according to sender orientation
            switch (orientation) {
                case Orientation.South:
                    x = p.x * Datas.Systems.SQUARE_SIZE;
                    z = p.z * Datas.Systems.SQUARE_SIZE;
                    break;
                case Orientation.West:
                    x = -p.z * Datas.Systems.SQUARE_SIZE;
                    z = p.x * Datas.Systems.SQUARE_SIZE;
                    break;
                case Orientation.North:
                    x = -p.x * Datas.Systems.SQUARE_SIZE;
                    z = -p.z * Datas.Systems.SQUARE_SIZE;
                    break;
                case Orientation.East:
                    x = p.z * Datas.Systems.SQUARE_SIZE;
                    z = -p.x * Datas.Systems.SQUARE_SIZE;
                    break;
            }
            list[i] = [
                localPosition.x + x,
                localPosition.y + p.getTotalY() + (Datas.Systems.SQUARE_SIZE / 2),
                localPosition.z + z,
                Datas.Systems.SQUARE_SIZE,
                (box[1] * Datas.Systems.SQUARE_SIZE) + (box[2] / 100 * Datas
                    .Systems.SQUARE_SIZE),
                Datas.Systems.SQUARE_SIZE,
                0,
                0,
                0
            ];
        }
        return list;
    }
}
export { Detection };
