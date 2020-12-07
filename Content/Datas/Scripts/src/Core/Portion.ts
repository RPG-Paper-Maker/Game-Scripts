/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants } from "../Common";

/** @class
 *  The data class for portion.
 *  @property {number} x
 *  @property {number} y
 *  @property {number} z
 */
class Portion {

    public x: number;
    public y: number;
    public z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0)
    {
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
    static createFromArray(array: number[]): Portion {
        return new Portion(array[0], array[1], array[2]);
    }

    /** 
     *  Get the portion file name.
     *  @returns {string}
     */
    getFileName(): string {
        return (this.x + "_" + this.y + "_" + this.z + Constants.EXTENSION_JSON);
    }
}

export { Portion }