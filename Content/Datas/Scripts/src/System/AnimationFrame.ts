/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { AnimationFrameElement } from "./AnimationFrameElement";
import { AnimationFrameEffect } from "./AnimationFrameEffect";
import { Utils, Enum } from "../Common";
import AnimationEffectConditionKind = Enum.AnimationEffectConditionKind;
import { Picture2D } from "../Core";
const THREE = require('./Content/Datas/Scripts/Libs/three.js');

/** @class
 *  An animation frame.
 *  @property {AnimationFrameElements[]} elements The frame elements by
 *  index
 *  @property {AnimationFrameEffect} effects The frame effects by index
 *  @param {Record<string, any>} [json=undefined] Json object describing the animation frame
 */
class AnimationFrame extends Base {

    public elements: AnimationFrameElement[];
    public effects: AnimationFrameEffect[];

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /**
     *  Read the JSON associated to the animation frame.
     *  @param {Record<string, any>} json Json object describing the animation 
     *  frame
     */
    read(json: Record<string, any>) {
        this.elements = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.e, []), 
            listIndexes: this.elements, cons: AnimationFrameElement });
        this.effects = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.ef, []), 
            listIndexes: this.effects, cons: AnimationFrameEffect });
    }

    /** 
     *  Play the sounds according to condition.
     *  @param {AnimationEffectConditionKind} condition The condition
     */
    playSounds(condition: AnimationEffectConditionKind) {
        for (let i = 0, l = this.effects.length; i < l; i++) {
            this.effects[i].playSE(condition);
        }
    }

    /** 
     *  Draw the animation frame.
     *  @param {Picture2D} picture The picture associated to the animation
     *  @param {THREE.Vector2} position The position on screen for animation
     *  @param {number} rows The number of rows in the animation texture
     *  @param {number} cols The number of columns in the animation texture
     */
    draw(picture: Picture2D, position: typeof THREE.Vector2, rows: number, cols:
        number)
    {
        for (let i = 0, l = this.elements.length; i < l; i++) {
            this.elements[i].draw(picture, position, rows, cols);
        }
    }
}

export { AnimationFrame }