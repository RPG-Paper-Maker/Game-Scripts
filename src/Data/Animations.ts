/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform, Utils } from '../Common';
import { JsonType } from '../Common/Types';
import { Data } from '../index';
import { Animation } from '../Model';

/**
 * JSON structure for Animations.
 */
export type AnimationsJSON = {
	animations: Record<string, JsonType>[];
};

/**
 * Handles all animation data.
 */
export class Animations {
	private static list: Map<number, Animation>;

	/**
	 * Read the JSON file associated with animations.
	 */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_ANIMATIONS)) as AnimationsJSON;
		this.list = Utils.readJSONMap(json.animations, Animation);
	}

	/**
	 *  Get the animation by ID.
	 */
	static get(id: number): Animation {
		return Data.Base.get(id, this.list, 'animation');
	}
}
