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

/**
 * JSON schema for an animation frame effect.
 */
export type AnimationFrameEffectJSON = {
	ise?: boolean;
	se?: Record<string, unknown>;
	c?: ANIMATION_EFFECT_CONDITION_KIND;
};

/**
 * Represents an effect triggered during an animation frame,
 * such as playing a sound effect under specific conditions.
 */
export class AnimationFrameEffect extends Base {
	public se: PlaySong | undefined;
	public condition: number;

	constructor(json?: AnimationFrameEffectJSON) {
		super(json);
	}

	/**
	 * Plays the sound effect if conditions are met.
	 * @param condition - The current animation effect condition.
	 */
	playSE(condition: ANIMATION_EFFECT_CONDITION_KIND): void {
		if (this.se && (this.condition === ANIMATION_EFFECT_CONDITION_KIND.NONE || this.condition === condition)) {
			this.se.playSound();
		}
	}

	/**
	 * Reads the JSON data describing the animation frame effect.
	 */
	read(json: AnimationFrameEffectJSON): void {
		const isSE = Utils.valueOrDefault(json.ise, true);
		if (isSE) {
			this.se = new PlaySong(SONG_KIND.SOUND, json.se ?? {});
		}
		this.condition = Utils.valueOrDefault(json.c, ANIMATION_EFFECT_CONDITION_KIND.NONE);
	}
}
