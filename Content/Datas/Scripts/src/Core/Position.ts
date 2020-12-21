/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Portion } from "./Portion";
import { Constants, Utils, Mathf } from "../Common";
import { Datas } from "..";
const THREE = require('./Content/Datas/Scripts/Libs/three.js');

/** @class
 *  The data class for position.
 *  @extends Portion
 *  @param {number} x The x position square
 *  @param {number} y The y position square
 *  @param {number} z The z position square
 *  @param {number} yPixels The y position pixels to add to the square y
 *  @param {number} layer The layer position
 *  @param {number} centerX The center X position on the square in %
 *  @param {number} centerZ The center Z position on the square in %
 *  @param {number} angleY The angle on Y axis in degree
 *  @param {number} angleX The angle on X axis in degree
 *  @param {number} angleZ The angle on Z axis in degree
 */
class Position extends Portion {

    public yPixels: number;
    public layer: number;
    public centerX: number;
    public centerZ: number;
    public angleY: number;
    public angleX: number;
    public angleZ: number;

    constructor(x: number = 0, y: number = 0, z: number = 0, yPixels: number = 0
        , layer: number = 0, centerX: number = 50, centerZ: number = 50, angleY: 
        number = 0, angleX: number = 0, angleZ: number = 0)
    {
        super(x, y, z);

        this.yPixels = yPixels;
        this.layer = layer;
        this.centerX = centerX;
        this.centerZ = centerZ;
        this.angleY = angleY;
        this.angleX = angleX;
        this.angleZ = angleZ;
    }

    /**
     *  Create a position from an array.
     *  @static
     *  @param {number[]} array
     *  @returns {Position}
     */
    static createFromArray(array: number[]): Position {
        return new Position(array[0], array[1], array[3], array[2], array[4], 
            array[5], array[6], array[7], array[8], array[9]);
    }

    /**
     *  Create a position from a three.js vector3.
     *  @static
     *  @param {THREE.Vector3} position
     *  @returns {Position}
     */
    static createFromVector3(position: typeof THREE.Vector3): Position {
        return new Position(Math.floor(position.x / Datas.Systems.SQUARE_SIZE),
            Math.floor(position.y / Datas.Systems.SQUARE_SIZE), Math.floor(
            position.z / Datas.Systems.SQUARE_SIZE));
    }

    /** 
     *  Test if a position is equal to another.
     *  @returns {boolean}
     */
    equals(position: Position): boolean {
        return super.equals(position) && this.yPixels === position.yPixels && 
            this.layer === position.layer && this.centerX === position.centerX 
            && this.centerZ === position.centerZ && this.angleY === position
            .angleY && this.angleX === position.angleX && this.angleZ === 
            position.angleZ;
    }

    /** 
     *  Get the complete number of Y of a position.
     *   @returns {number}
     */
    getTotalY(): number {
        return (this.y * Datas.Systems.SQUARE_SIZE) + (this.yPixels * Datas
            .Systems.SQUARE_SIZE / 100);
    }

    /** 
     *  Get the global portion of a json position.
     *  @returns {Portion}
     */
    getGlobalPortion(): Portion {
        return new Portion(
            Math.floor(this.x / Constants.PORTION_SIZE),
            Math.floor(this.y / Constants.PORTION_SIZE),
            Math.floor(this.z / Constants.PORTION_SIZE)
        );
    }

    /** 
     *  Transform a position to a THREE.Vector3.
     *  @returns {THREE.Vector3}
     */
    toVector3(center: boolean = true): typeof THREE.Vector3 {
        return new THREE.Vector3(
            (this.x * Datas.Systems.SQUARE_SIZE) + (center ? (this.centerX / 100 
                * Datas.Systems.SQUARE_SIZE) : 0), 
            (this.y * Datas.Systems.SQUARE_SIZE) + (this.yPixels * Datas.Systems
                .SQUARE_SIZE / 100), 
            (this.z * Datas.Systems.SQUARE_SIZE) + (center ? (this.centerZ / 100
                * Datas.Systems.SQUARE_SIZE) : 0)
        );
    }

    /** 
     *  Transform a position to index position on X/Z axis (used for map 
     *  portion bounding boxes).
     *  @returns {number}
     */
    toIndex(): number {
        return (this.x % Constants.PORTION_SIZE) + (Mathf.mod(this.y, Constants
            .PORTION_SIZE) * Constants.PORTION_SIZE) + ((this.z % Constants
            .PORTION_SIZE) * Constants.PORTION_SIZE * Constants.PORTION_SIZE);
    }
}

export { Position }