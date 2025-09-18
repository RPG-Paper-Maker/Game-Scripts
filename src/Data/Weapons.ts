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
import { Weapon } from '../Model';

/**
 * JSON structure for Weapons.
 */
export type WeaponsJSON = {
	weapons: Record<string, JsonType>[];
};

/**
 * Handles all weapon data.
 */
export class Weapons {
	private static list: Map<number, Weapon>;

	/**
	 * Read the JSON file associated with weapons.
	 */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_WEAPONS)) as WeaponsJSON;
		this.list = Utils.readJSONMap(json.weapons, Weapon);
	}

	/**
	 * Get the weapon by ID.
	 */
	static get(id: number): Weapon {
		return Data.Base.get(id, this.list, 'weapon');
	}
}
