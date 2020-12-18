/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

const THREE = require('./Content/Datas/Scripts/Libs/three.js');

/**
 * The data class who hold 3D coordinates.
 * It's used as an API bridge between the user and Three.js 
 * @author Nio Kasgami
 */
export class Vector3 extends THREE.Vector3 {

    public x: number;
    public y: number;
    public z: number;

    /**
     * The data class who hold 3D Coordinate.
     * @param {number} x the x-axis coordinate in float
     * @param {number} y the y-axis coordinate in float
     * @param {number} z the z-axis coordinate in float
     * @param {boolean} freeze whether or not to freeze the coordinates
     */
    constructor(x = 0, y = 0, z = 0, freeze = false) {
        super(x, y, z);
    }

    public reset() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}