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
 *  All the animations datas.
 *  @static
 */
class Animations {
	private static list: Model.Animation[];

	constructor() {
		throw new Error('This is a static class!');
	}

	/**
	 *  Read the JSON file associated to status.
	 *  @static
	 *  @async
	 */
	static async read() {
		const json = (await Platform.parseFileJSON(Paths.FILE_ANIMATIONS)).animations as any;
		this.list = [];
		Utils.readJSONSystemList({ list: json, listIDs: this.list, cons: Model.Animation });
	}

	/**
	 *  Get the animation by ID.
	 *  @static
	 *  @param {number} id
	 *  @returns {System.Animation}
	 */
	static get(id: number): Model.Animation {
		return Datas.Base.get(id, this.list, 'animation');
	}
}

export { Animations };
