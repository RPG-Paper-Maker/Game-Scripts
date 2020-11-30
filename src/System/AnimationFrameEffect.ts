/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {BaseSystem} from ".";
import {Enum} from "../core";
import AnimationEffectConditionKind = Enum.AnimationEffectConditionKind;
import {RPM} from "../core";
import SongKind = Enum.SongKind;

/** @class
 *   An animation frame effect
 *   @property {boolean} isSE Indicate if the effect is a sound effect
 *   @property {SystemPlaySong} se The sound effect to play
 *   @property {AnimationEffectConditionKind} condition The animation effect
 *   condition
 *   @param {Object} [json=undefined] Json object describing the animation frame effect
 */
export class AnimationFrameEffect extends BaseSystem {
    isSE: boolean;
    se: PlaySong;
    condition: number;

    constructor(json = undefined) {
        super(json);
    }

    public setup() {
        this.isSE = true;
        this.se = null;
        this.condition = AnimationEffectConditionKind.None;
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the animation frame effect
     *   @param {Object} json Json object describing the animation frame effect
     */
    read(json) {
        this.isSE = RPM.defaultValue(json.ise, true);
        if (this.isSE) {
            this.se = new SystemPlaySong(SongKind.Sound, json.se);
        }
        this.condition = RPM.defaultValue(json.c, AnimationEffectConditionKind
            .None);
    }

    // -------------------------------------------------------
    /** Play the sound effect according to a condition
     *   @param {AnimationEffectConditionKind} condition The animation effect
     *   condition kind
     */
    playSE(condition) {
        if (this.isSE && (this.condition === AnimationEffectConditionKind.None
            || this.condition === condition)) {
            this.se.playSound();
        }
    }


}
