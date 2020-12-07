/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { THREE } from "../../Libs/index.js";
/**
 * The data class who hold 3D coordinates.
 * @author Nio Kasgami
 */
export class Vector3 extends THREE.Vector3 {
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
    reset() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}
