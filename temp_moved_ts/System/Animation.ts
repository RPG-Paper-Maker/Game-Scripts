/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {BaseSystem, AnimationFrame} from ".";
import {Enum, RPM} from "../Core";
import AnimationPositionKind = Enum.AnimationPositionKind;
import PictureKind = Enum.PictureKind;
import * as THREE from "../Vendor/three.js";

/** @class
 *   An animation of a skill / item / weapon or for display animation command
 *   @property {number} pictureID The animation picture ID
 *   @property {AnimationPositionKind} positionKind The animation position kind
 *   @property {SystemAnimationFrame[]} frames The System animation frames by ID
 *   @property {number} rows The number of rows in the animation texture
 *   @property {number} cols The number of columns in the animation texture
 *   @param {Object} [json=undefined] Json object describing the animation
 */
export class Animation extends BaseSystem {
    pictureID: number;
    positionKind: number;
    frames: AnimationFrame[];
    rows: number;
    cols: number;

    constructor(json = undefined) {
        super(json);
    }

    public setup() {
        this.pictureID = 0;
        this.positionKind = AnimationPositionKind.Middle;
        this.frames = [];
        this.rows = 0;
        this.cols = 0;
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the animation
     *   @param {Object} json Json object describing the animation
     */
    read(json) {
        this.pictureID = RPM.defaultValue(json.pid, 1);
        this.positionKind = RPM.defaultValue(json.pk, AnimationPositionKind
            .Middle);
        this.frames = RPM.readJSONSystemList(json.f, AnimationFrame);
        this.rows = RPM.defaultValue(json.r, 5);
        this.cols = RPM.defaultValue(json.c, 5);
    }

    // -------------------------------------------------------
    /** Create an animation picture copy
     *   @returns {Picture2D}
     */
    createPicture() {
        return RPM.datasGame.pictures.getPictureCopy(PictureKind.Animations,
            this.pictureID);
    }

    // -------------------------------------------------------
    /** Play the sounds according to frame and condition
     *   @param {number} frame The frame
     *   @param {AnimationEffectConditionKind} condition The condition
     */
    playSounds(frame, condition) {
        if (frame > 0 && frame < this.frames.length) {
            this.frames[frame].playSounds(condition);
        }
    }

    // -------------------------------------------------------
    /** Draw the animation
     *   @param {Picture2D} picture The picture associated to the animation
     *   @param {number} frame The frame
     *   @param {Battler} battler The battler target
     */
    draw(picture, frame, battler) {
        if (frame > 0 && frame < this.frames.length) {
            // Change position according to kind
            let position;
            switch (this.positionKind) {
                case AnimationPositionKind.Top:
                    position = battler.topPosition;
                    break;
                case AnimationPositionKind.Middle:
                    position = battler.midPosition;
                    break;
                case AnimationPositionKind.Bottom:
                    position = battler.botPosition;
                    break;
                case AnimationPositionKind.ScreenCenter:
                    position = new THREE.Vector2(0, 0);
                    break;
            }

            // Draw
            this.frames[frame].draw(picture, position, this.rows, this.cols);
        }
    }


}
