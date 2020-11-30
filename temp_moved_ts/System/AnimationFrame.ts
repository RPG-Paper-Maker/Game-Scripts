/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {BaseSystem, AnimationFrameElements, AnimationFrameEffect} from ".";
import {RPM} from "../Core";

/** @class
 *   An animation frame
 *   @property {AnimationFrameElements[]} elements The frame elements by
 *   index
 *   @property {AnimationFrameEffect} effects The frame effects by index
 *   @param {Object} [json=undefined] Json object describing the animation frame
 */
export class AnimationFrame extends BaseSystem {

    elements: AnimationFrameElements[];
    effects: AnimationFrameEffect[];

    constructor(json = undefined) {
        super(json);
    }

    setup() {
        this.elements = [];
        this.effects = [];
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the animation frame
     *   @param {Object} json Json object describing the animation frame
     */
    read(json) {
        this.elements = RPM.readJSONSystemListByIndex(RPM.defaultValue(json.e,
            []), AnimationFrameElements);
        this.effects = RPM.readJSONSystemListByIndex(RPM.defaultValue(json.ef,
            []), AnimationFrameEffect);
    }

    // -------------------------------------------------------
    /** Play the sounds according to condition
     *   @param {AnimationEffectConditionKind} condition The condition
     */
    playSounds(condition) {
        for (let i = 0, l = this.effects.length; i < l; i++) {
            this.effects[i].playSE(condition);
        }
    }

    // -------------------------------------------------------
    /** Draw the animation frame
     *   @param {Picture2D} picture The picture associated to the animation
     *   @param {THREE.Vector2} position The position on screen for animation
     *   @param {rows} rows The number of rows in the animation texture
     *   @param {number} cols The number of columns in the animation texture
     */
    draw(picture, position, rows, cols) {
        for (let i = 0, l = this.elements.length; i < l; i++) {
            this.elements[i].draw(picture, position, rows, cols);
        }
    }
}
