/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Mathf } from "../Common";

/**
 * The data class who manage Sprite anchor in 2D
 */
class Anchor2D {

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
     * The data class who manage sprite anchor in 2D
     * @param x 
     * @param y 
     */
    constructor(x = 0.5, y = 0) {
        this.x = Mathf.clamp(x, 0, 1);
        this.y = Mathf.clamp(y, 0, 1);
    }

    /**
     * Set the anchors using object format (can also use premade).
     *
     * @param {AnchorStruct} anchors
     * @memberof Anchor2D
     */
    public set(anchors: AnchorStruct) {
        this.x = Mathf.clamp(anchors.x, 0, 1);
        this.y = Mathf.clamp(anchors.y, 0, 1);
    }
}

interface AnchorStruct {
    x: number,
    y: number
}
export {Anchor2D};