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
import { Armor } from '../Model';

/**
 * JSON structure for Armors.
 */
export type ArmorsJSON = {
	armors: Record<string, JsonType>[];
};

/**
 * Handles all armor data.
 */
export class Armors {
	private static list: Map<number, Armor>;

	/**
	 * Read the JSON file associated with armors.
	 */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_ARMORS)) as ArmorsJSON;
		this.list = Utils.readJSONMap(json.armors, Armor);
	}

	/**
	 * Get the armor by ID.
	 */
	static get(id: number): Armor {
		return Data.Base.get(id, this.list, 'armor');
	}
}
