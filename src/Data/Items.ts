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
import { Item } from '../Model';
import { Base } from './Base';

/**
 * JSON structure for Items.
 */
export type ItemsJSON = {
	items: Record<string, JsonType>[];
};

/**
 * Handles all item data.
 */
export class Items {
	private static list: Map<number, Item>;

	/**
	 * Get the item by ID.
	 */
	static get(id: number): Item {
		return Base.get(id, this.list, 'item');
	}

	/**
	 * Read the JSON file associated with items.
	 */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_ITEMS)) as ItemsJSON;
		this.list = Utils.readJSONMap(json.items, Item);
	}
}
