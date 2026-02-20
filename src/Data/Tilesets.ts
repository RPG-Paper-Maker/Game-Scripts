/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform, Utils } from '../Common';
import { Tileset, TilesetJSON } from '../Model';
import { Base } from './Base';

/**
 * JSON structure for tilesets.
 */
export type TilesetsJSON = {
	list: TilesetJSON[];
};

/**
 *  All the tilesets data.
 */
export class Tilesets {
	private static list: Map<number, Tileset>;

	/**
	 * Get the tileset by ID.
	 */
	static get(id: number): Tileset {
		return Base.get(id, this.list, 'tileset');
	}

	/**
	 * Read the JSON file associated to tilesets.
	 */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_TILESETS)) as TilesetsJSON;
		this.list = Utils.readJSONMap(json.list, Tileset);
	}
}
