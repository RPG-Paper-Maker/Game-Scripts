/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

const THREE = require('./Content/Datas/Scripts/Libs/three.js');
import { Constants } from "../Common";
import { Datas } from "..";

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
     *  Create a portion from an array.
     *  @static
     *  @param {number[]} array
     *  @returns {Portion}
     */
    static createFromArray(array: number[]): Portion {
        return new Portion(array[0], array[1], array[2]);
    }

    /**
     *  Create a portion from a three.js Vector3.
     *   @static
     *   @param {number[]} p The array position
     *   @returns {number[]}
     */
    static createFromVector3(position: typeof THREE.Vector3): Portion {
        return new Portion(Math.floor(position.x / Datas.Systems.SQUARE_SIZE / 
            Constants.PORTION_SIZE), Math.floor(position.y / Datas.Systems
            .SQUARE_SIZE / Constants.PORTION_SIZE), Math.floor(position.z / 
            Datas.Systems.SQUARE_SIZE / Constants.PORTION_SIZE));
    }

    /** 
     *  Test if a portion is equal to another.
     *  @returns {boolean}
     */
    equals(portion: Portion): boolean {
        return this.x === portion.x && this.y === portion.y && this.z === 
            portion.z;
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