/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {BaseSystem} from ".";
import {RPM} from "../Core";

/** @class
 *   An animation frame element
 *   @property {number} x The x position
 *   @property {number} y The y postion
 *   @property {number} texRow The texture row
 *   @property {number} texCol The texture column
 *   @property {number} zoom The zoom value
 *   @property {number} angle The angle value
 *   @property {boolean} flip Indicate if the texture if flipped
 *   @property {number} opacity The opacity value
 */
export class AnimationFrameElements extends BaseSystem {
    x: number;
    y: number;
    texRow: number;
    texCol: number;
    zoom: number
    angle: number;
    flip: boolean;
    opacity: number;

    constructor(json = undefined) {
        super(json)
    }

    public setup() {
        this.x = 0;
        this.y = 0;
        this.texRow = 0;
        this.texCol = 0;
        this.zoom = 0;
        this.angle = 0;
        this.flip = false;
        this.opacity = 100;
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the animation frame element
     *   @param {Object} json Json object describing the animation frame element
     */
    read(json) {
        this.x = RPM.defaultValue(json.x, 0);
        this.y = RPM.defaultValue(json.y, 0);
        this.texRow = RPM.defaultValue(json.tr, 0);
        this.texCol = RPM.defaultValue(json.tc, 0);
        this.zoom = RPM.defaultValue(json.z, 100) / 100;
        this.angle = RPM.defaultValue(json.a, 0);
        this.flip = RPM.defaultValue(json.fv, false);
        this.opacity = RPM.defaultValue(json.o, 100) / 100;
    }

    // -------------------------------------------------------
    /** Draw the animation element
     *   @param {Picture2D} picture The picture associated to the animation
     *   @param {THREE.Vector2} position The position on screen for animation
     *   @param {rows} rows The number of rows in the animation texture
     *   @param {number} cols The number of columns in the animation texture
     */
    draw(picture, position, rows, cols) {
        picture.zoom = this.zoom;
        picture.opacity = this.opacity;
        picture.angle = this.angle;
        picture.centered = true;
        picture.reverse = this.flip;
        let w = picture.oW / cols;
        let h = picture.oH / rows;
        picture.draw(position.x + this.x, position.y + this.y, w * this.zoom, h
            * this.zoom, w * this.texCol, h * this.texRow, w, h, false);
    }


}