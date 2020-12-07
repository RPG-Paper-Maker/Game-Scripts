/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Constants } from "../Common/index.js";
/** @class
 *  The data class for portion.
 *  @property {number} x
 *  @property {number} y
 *  @property {number} z
 */
class Portion {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /**
     *  Create a rectangle from an array.
     *  @static
     *  @param {number[]} array
     *  @returns {Portion}
     */
    static createFromArray(array) {
        return new Portion(array[0], array[1], array[2]);
    }
    /**
     *  Get the portion file name.
     *  @returns {string}
     */
    getFileName() {
        return (this.x + "_" + this.y + "_" + this.z + Constants.EXTENSION_JSON);
    }
}
export { Portion };
