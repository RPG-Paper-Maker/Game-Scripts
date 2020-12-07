/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Portion } from "./Portion.js";
import { Constants, Utils } from "../Common/index.js";
import { THREE } from "../../Libs/index.js";
/** @class
 *  The data class for position.
 */
class Position extends Portion {
    constructor(x = 0, y = 0, z = 0, yPixels, layer, centerX, centerZ, angleY, angleX, angleZ) {
        super(x, y, z);
        this.yPixels = Utils.defaultValue(yPixels, 0);
        this.layer = Utils.defaultValue(layer, 0);
        this.centerX = Utils.defaultValue(centerX, 0);
        this.centerZ = Utils.defaultValue(centerZ, 0);
        this.angleY = Utils.defaultValue(angleY, 0);
        this.angleX = Utils.defaultValue(angleX, 0);
        this.angleZ = Utils.defaultValue(angleZ, 0);
    }
    /**
     *  Create a rectangle from an array.
     *  @static
     *  @param {number[]} array
     *  @returns {Position}
     */
    static createFromArray(array) {
        return new Position(array[0], array[1], array[3], array[2], array[4], array[5], array[6], array[7], array[8], array[9]);
    }
    /**
     *  Get the global portion of a json position.
     *  @returns {Portion}
     */
    getGlobalPortion() {
        return new Portion(Math.floor(this.x / Constants.PORTION_SIZE), Math.floor(this.y / Constants.PORTION_SIZE), Math.floor(this.z / Constants.PORTION_SIZE));
    }
    /**
     *  Transform a json position to a THREE.Vector3.
     *  @static
     *  @param {number[]} position The json position
     *  @returns {THREE.Vector3}
     */
    toVector3() {
        return new THREE.Vector3((this.x * Constants.SQUARE_SIZE) + (this.centerX / 100 * Constants
            .SQUARE_SIZE), (this.y * Constants.SQUARE_SIZE) + (this.yPixels * Constants
            .SQUARE_SIZE / 100), (this.z * Constants.SQUARE_SIZE) + (this.centerZ / 100 * Constants
            .SQUARE_SIZE));
    }
}
export { Position };
