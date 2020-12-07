/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Anchor2D } from "./Anchor2D";

/** @class
 *  The data class for anchors.
 *  @property {number} x
 *  @property {number} y
 *  @property {number} width
 *  @property {number} height
 *  @property {Anchor2D} anchor
 *  @param {number} [x=0]
 *  @param {number} [y=0]
 *  @param {number} [width=1]
 *  @param {number} [height=1]
 */
class Rectangle {

    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public anchor: Anchor2D

    constructor(x = 0, y = 0, width = 1, height = 1) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        const anchorX = Anchor2D.MIDDLE_BOTTOM.x;
        const anchorY = Anchor2D.MIDDLE_BOTTOM.y;
        this.anchor = new Anchor2D(anchorX, anchorY);
    }

    /**
     *  Create a rectangle from an array.
     *  @static
     *  @param {number[]} array
     */
    static createFromArray(array: number[]): Rectangle {
        return new Rectangle(array[0], array[1], array[2], array[3]);
    }

    /**
     *  Move rectangle to x, y.
     *  @param {number} x
     *  @param {number} y
     */
    public move(x: number, y: number) {
        this.x = x + (this.width * this.anchor.x);
        this.y = y + (this.height * this.anchor.y);
    }

    /**
     *  Resize rectangle with width and height value.
     *  @param {number} width
     *  @param {number} height
     */
    public resize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    /**
     *  Move and resize rectangle.
     *  @param {number} x
     *  @param {number} y
     *  @param {number} width
     *  @param {number} height
     */
    public set(x: number, y: number, width: number, height: number) {
        this.move(x, y);
        this.resize(width, height);
    }

    /**
     *  Set the anchor x, y.
     *  @param {number} x
     *  @param {number} y
     */
    public setAnchor(x: number, y: number) {
        this.anchor.set({x, y});
    }

    /**
     *  Preset anchor.
     *  @param {{ x: number, y: number }} anchorPreset
     */
    public presetAnchor(anchorPreset: { x: number, y: number }) {
        this.anchor.set(anchorPreset);
    }
}

export { Rectangle }