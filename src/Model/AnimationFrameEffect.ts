/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ANIMATION_EFFECT_CONDITION_KIND, SONG_KIND, Utils } from '../Common';
import { Base } from './Base';
import { PlaySong } from './PlaySong';

/** @class
 *  An animation frame effect.
 *  @extends Model.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  animation frame effect
 */
class AnimationFrameEffect extends Base {
	public isSE: boolean;
	public se: PlaySong;
	public condition: number;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Read the JSON associated to the animation frame effect.
	 *  @param {Record<string, any>} - json Json object describing the animation
	 *  frame effect
	 */
	read(json: Record<string, any>) {
		this.isSE = Utils.defaultValue(json.ise, true);
		if (this.isSE) {
			this.se = new PlaySong(SONG_KIND.SOUND, json.se);
		}
		this.condition = Utils.defaultValue(json.c, ANIMATION_EFFECT_CONDITION_KIND.NONE);
	}

	/**
	 *  Play the sound effect according to a condition.
	 *  @param {ANIMATION_EFFECT_CONDITION_KIND} condition - The animation effect
	 *  condition kind
	 */
	playSE(condition: ANIMATION_EFFECT_CONDITION_KIND) {
		if (this.isSE && (this.condition === ANIMATION_EFFECT_CONDITION_KIND.NONE || this.condition === condition)) {
			this.se.playSound();
		}
	}
}

export { AnimationFrameEffect };
