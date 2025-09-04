/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform, Utils } from '../Common';
import { Datas, System } from '../index';

/** @class
 *  All the armors datas.
 *  @static
 */
class Armors {
	private static list: System.Armor[];

	constructor() {
		throw new Error('This is a static class!');
	}

	/**
	 *  Read the JSON file associated to armors.
	 *  @static
	 *  @async
	 */
	static async read() {
		const json = (await Platform.parseFileJSON(Paths.FILE_ARMORS)).armors as any;
		this.list = [];
		Utils.readJSONSystemList({ list: json, listIDs: this.list, cons: System.Armor });
	}

	/**
	 *  Get the armor by ID.
	 *  @static
	 *  @param {number} id
	 *  @returns {System.Armor}
	 */
	static get(id: number): System.Armor {
		return Datas.Base.get(id, this.list, 'armor');
	}
}

export { Armors };
