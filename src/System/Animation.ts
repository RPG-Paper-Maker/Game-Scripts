/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { ANIMATION_EFFECT_CONDITION_KIND, ANIMATION_POSITION_KIND, Utils } from '../Common';
import { Battler, Picture2D } from '../Core';
import { AnimationFrame } from './AnimationFrame';
import { Base } from './Base';

/** @class
 *  An animation of a skill / item / weapon or for display animation command.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  animation
 */
class Animation extends Base {
	public pictureID: number;
	public positionKind: number;
	public frames: AnimationFrame[];
	public rows: number;
	public cols: number;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Read the JSON associated to the animation
	 *  @param {Record<string, any>} - json Json object describing the animation
	 */
	read(json: Record<string, any>) {
		this.pictureID = Utils.defaultValue(json.pid, 1);
		this.positionKind = Utils.defaultValue(json.pk, ANIMATION_POSITION_KIND.MIDDLE);
		this.frames = [];
		Utils.readJSONSystemList({ list: json.f, listIDs: this.frames, cons: AnimationFrame });
		this.rows = Utils.defaultValue(json.r, 5);
		this.cols = Utils.defaultValue(json.c, 5);
	}

	/**
	 *  Play the sounds according to frame and condition.
	 *  @param {number} frame - The frame
	 *  @param {ANIMATION_EFFECT_CONDITION_KIND} condition - The condition
	 */
	playSounds(frame: number, condition: ANIMATION_EFFECT_CONDITION_KIND) {
		if (frame > 0 && frame < this.frames.length) {
			this.frames[frame].playSounds(condition);
		}
	}

	/**
	 *  Draw the animation.
	 *  @param {Picture2D} picture - The picture associated to the animation
	 *  @param {number} frame - The frame
	 *  @param {Battler} battler - The battler target
	 */
	draw(picture: Picture2D, frame: number, battler: Battler) {
		if (frame > 0 && frame < this.frames.length) {
			// Change position according to kind
			let position: THREE.Vector2;
			switch (this.positionKind) {
				case ANIMATION_POSITION_KIND.TOP:
					position = battler.topPosition;
					break;
				case ANIMATION_POSITION_KIND.MIDDLE:
					position = battler.midPosition;
					break;
				case ANIMATION_POSITION_KIND.BOTTOM:
					position = battler.botPosition;
					break;
				case ANIMATION_POSITION_KIND.SCREEN_CENTER:
					position = new THREE.Vector2(0, 0);
					break;
			}

			// Draw
			this.frames[frame].draw(picture, position, this.rows, this.cols);
		}
	}
}

export { Animation };
