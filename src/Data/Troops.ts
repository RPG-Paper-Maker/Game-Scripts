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
import { Troop } from '../Model';
import { Base } from './Base';

/**
 * JSON structure for Troops.
 */
export type TroopsJSON = {
	troops: Record<string, JsonType>[];
};

/**
 * Handles all troop data.
 */
export class Troops {
	private static list: Map<number, Troop>;

	/**
	 * Get the troop by ID.
	 */
	static get(id: number): Troop {
		return Base.get(id, this.list, 'troop');
	}

	/**
	 * Read the JSON file associated with troops.
	 */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_TROOPS)) as TroopsJSON;
		this.list = Utils.readJSONMap(json.troops, Troop);
	}
}
