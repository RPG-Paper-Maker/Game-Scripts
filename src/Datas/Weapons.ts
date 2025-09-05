/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform, Utils } from '../Common';
import { Datas, Model } from '../index';

/** @class
 *  All the weapons datas
 *  @static
 */
class Weapons {
	private static list: Model.Weapon[];

	constructor() {
		throw new Error('This is a static class!');
	}

	/**
	 *  Read the JSON file associated to weapons
	 *  @static
	 *  @async
	 */
	static async read() {
		const json = (await Platform.parseFileJSON(Paths.FILE_WEAPONS)).weapons as any;
		this.list = [];
		Utils.readJSONSystemList({ list: json, listIDs: this.list, cons: Model.Weapon });
	}

	/**
	 *  Get the weapon by ID.
	 *  @static
	 *  @param {number} id
	 *  @returns {System.Weapon}
	 */
	static get(id: number): Model.Weapon {
		return Datas.Base.get(id, this.list, 'weapon');
	}
}

export { Weapons };
