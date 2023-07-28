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
 *  All the classes datas.
 *  @static
 */
class Classes {
	private static list: System.Class[];

	constructor() {
		throw new Error('This is a static class!');
	}

	/**
	 *  Read the JSON file associated to classes
	 *  @static
	 *  @async
	 */
	static async read() {
		let json = (await Platform.parseFileJSON(Paths.FILE_CLASSES)).classes;
		this.list = [];
		Utils.readJSONSystemList({ list: json, listIDs: this.list, cons: System.Class });
	}

	/**
	 *  Get the class by ID.
	 *  @static
	 *  @param {number} id
	 *  @param {string} errorMessage
	 *  @returns {System.Class}
	 */
	static get(id: number, errorMessage: string = ''): System.Class {
		return Datas.Base.get(id, this.list, 'class', true, errorMessage);
	}
}

export { Classes };
