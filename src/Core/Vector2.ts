/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from "../Vendor/three.js";

/**
 * The data class who hold 2D coordinates.
 * @author Nio Kasgami
 */
export class Vector2 extends THREE.Vector2 {

    public x: number;
    public y: number;

    /**
     * The data class who hold 2D coordinates.
     * @param x the x axis
     * @param y the y axis
     */
    constructor(x = 0, y = 0) {
        super(x, y);
    }
}
