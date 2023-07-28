/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { System, Datas } from '../index';
import { Platform, Paths, Utils } from '../Common';

/** @class
 *  All the monsters datas.
 *  @static
 */
class Monsters {
	private static list: System.Monster[];

	constructor() {
		throw new Error('This is a static class!');
	}

	/**
	 *  Read the JSON file associated to monsters.
	 *  @static
	 *  @async
	 */
	static async read() {
		let json = (await Platform.parseFileJSON(Paths.FILE_MONSTERS)).monsters;
		this.list = [];
		Utils.readJSONSystemList({ list: json, listIDs: this.list, cons: System.Monster });
	}

	/**
	 *  Get the monster by ID.
	 *  @static
	 *  @param {number} id
	 *  @returns {System.Monster}
	 */
	static get(id: number): System.Monster {
		return Datas.Base.get(id, this.list, 'monster');
	}
}

export { Monsters };
