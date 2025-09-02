/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { MOUNTAIN_COLLISION_KIND, Utils } from '../Common';
import { SpecialElement } from './SpecialElement';

/** @class
 *  A mountain of the game.
 *  @extends System.SpecialElement
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  mountain
 */
class Mountain extends SpecialElement {
	public id: number;
	public collisionKind: number;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Read the JSON associated to the mountain.
	 *  @param {Record<string, any>} - json Json object describing the mountain
	 */
	read(json: Record<string, any>) {
		super.read(json);

		this.id = json.id;
		this.collisionKind = Utils.defaultValue(json.mck, MOUNTAIN_COLLISION_KIND.DEFAULT);
	}

	/**
	 *  Check if the collision is always forced.
	 *  @returns {boolean}
	 */
	forceAlways(): boolean {
		return this.collisionKind === MOUNTAIN_COLLISION_KIND.ALWAYS;
	}

	/**
	 *  Check if the collision is never forced
	 *  @returns {boolean}
	 */
	forceNever(): boolean {
		return this.collisionKind === MOUNTAIN_COLLISION_KIND.NEVER;
	}
}

export { Mountain };
