/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../Common';
import { SpecialElement, SpecialElementJSON } from './SpecialElement';

/**
 * JSON schema for an autotile element.
 */
export type AutotileJSON = SpecialElementJSON & {
	isAnimated?: boolean;
};

/**
 * Represents an autotile in the game.
 * An autotile is a special kind of tile used for auto-generated patterns (e.g., water, ground),
 * which can optionally be animated.
 */
export class Autotile extends SpecialElement {
	public isAnimated: boolean;

	constructor(json?: AutotileJSON) {
		super(json);
	}

	/**
	 * Reads the JSON data describing the autotile.
	 * @param json - The JSON object containing the autotile data.
	 */
	read(json: AutotileJSON): void {
		super.read(json);
		this.isAnimated = Utils.valueOrDefault(json.isAnimated, false);
	}
}
