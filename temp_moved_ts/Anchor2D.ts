/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Mathf } from "../Common";

/** @class
 *  The data class for anchors.
 *  @property {{x: number, y: number}} [MIDDLE_TOP={x: 0, y: 1}]
 *  @property {{x: number, y: number}} [MIDDLE={x: 0.5, y: 0.5}]
 *  @property {{x: number, y: number}} [MIDDLE_BOTTOM={x: 0.5, y: 0}]
 *  @property {{x: number, y: number}} [LEFT_TOP={x: 0, y: 1}]
 *  @property {{x: number, y: number}} [LEFT_MIDDLE={x: 0, y: 0.5}]
 *  @property {{x: number, y: number}} [LEFT_BOTTOM={x: 0, y: 0}]
 *  @property {{x: number, y: number}} [RIGHT_TOP={x: 1, y: 1}]
 *  @property {{x: number, y: number}} [RIGHT_MIDDLE={x: 1, y: 0.5}]
 *  @property {{x: number, y: number}} [RIGHT_BOTTOM={x: 1, y: 0}]
 *  @property {number} x the x anchors (capped from 0 to 1)
 *  @property {number} y the y anchors (capped from 0 to 1)
 *  @param {number} x the x anchors (capped from 0 to 1)
 *  @param {number} y the y anchors (capped from 0 to 1)
 */
export class Anchor2D {

    public static readonly MIDDLE_TOP = {x: 0, y: 1};
    public static readonly MIDDLE = {x: 0.5, y: 0.5};
    public static readonly MIDDLE_BOTTOM = {x: 0.5, y: 0};
    public static readonly LEFT_TOP = {x: 0, y: 1};
    public static readonly LEFT_MIDDLE = {x: 0, y: 0.5};
    public static readonly LEFT_BOTTOM = {x: 0, y: 0};
    public static readonly RIGHT_TOP = {x: 1, y: 1};
    public static readonly RIGHT_MIDDLE = {x: 1, y: 0.5};
    public static readonly RIGHT_BOTTOM = {x: 1, y: 0};

    public x: number;
    public y: number;

    /**
     * The system
     * @param x 
     * @param y 
     */
    constructor(x = 0.5, y = 0) {
        this.x = Mathf.clamp(x, 0, 1);
        this.y = Mathf.clamp(y, 0, 1);
    }

    /**
     *  Set the anchors using object format (can also use premade).
     *  @param {{x: number, y: number}} anchors
     */
    public set(anchors: { x: number, y: number }) {
        this.x = Mathf.clamp(anchors.x, 0, 1);
        this.y = Mathf.clamp(anchors.y, 0, 1);
    }
}