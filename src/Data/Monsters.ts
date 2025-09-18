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
import { Monster } from '../Model';

/**
 * JSON structure for Monsters.
 */
export type MonstersJSON = {
	monsters: Record<string, JsonType>[];
};

/**
 * Handles all monster data.
 */
export class Monsters {
	private static list: Map<number, Monster>;

	/**
	 * Read the JSON file associated with monsters.
	 */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_MONSTERS)) as MonstersJSON;
		this.list = Utils.readJSONMap(json.monsters, Monster);
	}

	/**
	 * Get the monster by ID.
	 */
	static get(id: number): Monster {
		return Data.Base.get(id, this.list, 'monster');
	}
}
