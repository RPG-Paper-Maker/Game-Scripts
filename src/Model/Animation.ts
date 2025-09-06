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

/**
 * JSON schema for an animation.
 */
export type AnimationJSON = {
	pid?: number;
	pk?: number;
	f?: Record<string, unknown>[];
	r?: number;
	c?: number;
};

/**
 * Represents an animation of a skill, item, weapon, or display command.
 */
export class Animation extends Base {
	/** The picture ID associated with this animation. */
	public pictureID: number;

	/** The kind of position where the animation is drawn. */
	public positionKind: ANIMATION_POSITION_KIND;

	/** The frames composing the animation. */
	public frames: Map<number, AnimationFrame>;

	/** The max frame ID in the list of frames. */
	public maxFrameID: number;

	/** Number of rows in the animation texture. */
	public rows: number;

	/** Number of columns in the animation texture. */
	public cols: number;

	constructor(json?: AnimationJSON) {
		super(json);
	}

	/**
	 * Reads the JSON data describing the animation.
	 * @param json - The JSON object describing the animation.
	 */
	read(json: AnimationJSON): void {
		this.pictureID = Utils.valueOrDefault(json.pid, 1);
		this.positionKind = Utils.valueOrDefault(json.pk, ANIMATION_POSITION_KIND.MIDDLE);
		this.frames = Utils.readJSONMap(json.f, AnimationFrame);
		this.maxFrameID = Utils.getMapMaxID(this.frames);
		this.rows = Utils.valueOrDefault(json.r, 5);
		this.cols = Utils.valueOrDefault(json.c, 5);
	}

	/**
	 * Plays the sound effects for a given frame according to the condition.
	 * @param frame - The frame index to play sounds for.
	 * @param condition - The current animation effect condition.
	 */
	playSounds(frame: number, condition: ANIMATION_EFFECT_CONDITION_KIND): void {
		this.frames.get(frame)?.playSounds(condition);
	}

	/**
	 * Draws the animation for a specific frame and battler target.
	 * @param picture - The picture associated with the animation.
	 * @param frame - The frame index to draw.
	 * @param battler - The target battler for the animation.
	 */
	draw(picture: Picture2D, frame: number, battler: Battler): void {
		const animationFrame = this.frames.get(frame);
		if (!animationFrame) {
			return;
		}

		// Determine position based on position kind
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
			default:
				position = battler.midPosition;
				break;
		}

		// Draw the frame
		animationFrame.draw(picture, position, this.rows, this.cols);
	}
}
