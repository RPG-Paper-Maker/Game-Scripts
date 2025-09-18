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
import { Hero } from '../Model';

/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/**
 * JSON structure for Heroes.
 */
export type HeroesJSON = {
	heroes: Record<string, JsonType>[];
};

/**
 * Handles all hero data.
 */
export class Heroes {
	private static list: Map<number, Hero>;

	/**
	 * Read the JSON file associated with heroes.
	 */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_HEROES)) as HeroesJSON;
		this.list = Utils.readJSONMap(json.heroes, Hero);
	}

	/**
	 * Get the hero by ID.
	 */
	static get(id: number): Hero {
		return Data.Base.get(id, this.list, 'hero');
	}
}
