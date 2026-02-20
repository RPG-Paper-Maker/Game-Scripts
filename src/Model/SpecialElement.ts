/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../Common';
import { Base } from './Base';

/**
 * JSON schema for a special element (autotile, wall, object3D, mountain).
 */
export type SpecialElementJSON = {
	pic?: number;
};

/**
 * Represents a special element in the game.
 * A special element is a visual component like an autotile, wall, 3D object, or mountain.
 */
export class SpecialElement extends Base {
	public pictureID: number;

	constructor(json?: SpecialElementJSON) {
		super(json);
	}

	/**
	 * Reads the JSON data describing the special element.
	 */
	read(json: SpecialElementJSON): void {
		this.pictureID = Utils.valueOrDefault(json.pic, -1);
	}
}
