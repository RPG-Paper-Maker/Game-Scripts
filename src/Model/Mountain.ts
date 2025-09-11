/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { MOUNTAIN_COLLISION_KIND, Utils } from '../Common';
import { SpecialElement, SpecialElementJSON } from './SpecialElement';

/**
 * JSON structure describing a mountain.
 */
export type MountainJSON = SpecialElementJSON & {
	id: number;
	mck?: MOUNTAIN_COLLISION_KIND;
};

/**
 * Represents a mountain element.
 */
export class Mountain extends SpecialElement {
	public id: number;
	public collisionKind: number;

	constructor(json?: MountainJSON) {
		super(json);
	}

	/** True if collision is always forced. */
	forceAlways(): boolean {
		return this.collisionKind === MOUNTAIN_COLLISION_KIND.ALWAYS;
	}

	/** True if collision is never forced. */
	forceNever(): boolean {
		return this.collisionKind === MOUNTAIN_COLLISION_KIND.NEVER;
	}

	/** Initialize this mountain from JSON data. */
	read(json: MountainJSON): void {
		super.read(json);
		this.id = json.id;
		this.collisionKind = Utils.valueOrDefault(json.mck, MOUNTAIN_COLLISION_KIND.DEFAULT);
	}
}
