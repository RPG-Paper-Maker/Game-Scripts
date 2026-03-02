/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three/webgpu';
import { ANIMATION_EFFECT_CONDITION_KIND, Utils } from '../Common';
import { Picture2D } from '../Core';
import { AnimationFrameEffect, AnimationFrameEffectJSON } from './AnimationFrameEffect';
import { AnimationFrameElement, AnimationFrameElementJSON } from './AnimationFrameElement';
import { Base } from './Base';

/**
 * JSON schema for an animation frame.
 */
export type AnimationFrameJSON = {
	e?: AnimationFrameElementJSON[];
	ef?: AnimationFrameEffectJSON[];
};

/**
 * Represents a single frame in an animation, containing
 * drawable elements and associated effects.
 */
export class AnimationFrame extends Base {
	public elements: AnimationFrameElement[];
	public effects: AnimationFrameEffect[];

	constructor(json?: AnimationFrameJSON) {
		super(json);
	}

	/**
	 * Plays the sound effects associated with this frame,
	 * if their conditions are met.
	 * @param condition - The current animation effect condition.
	 */
	playSounds(condition: ANIMATION_EFFECT_CONDITION_KIND): void {
		for (const effect of this.effects) {
			effect.playSE(condition);
		}
	}

	/**
	 * Draws the animation frame elements.
	 * @param picture - The picture associated with the animation.
	 * @param position - The position on screen for the animation.
	 * @param rows - The number of rows in the animation texture.
	 * @param cols - The number of columns in the animation texture.
	 */
	draw(picture: Picture2D, position: THREE.Vector2, rows: number, cols: number): void {
		for (const element of this.elements) {
			element?.draw(picture, position, rows, cols);
		}
	}

	/**
	 * Reads the JSON data describing the animation frame.
	 */
	read(json: AnimationFrameJSON): void {
		this.elements = Utils.readJSONList(json.e, AnimationFrameElement);
		this.effects = Utils.readJSONList(json.ef, AnimationFrameEffect, true);
	}
}
