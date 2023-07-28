/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Platform, Paths } from '../Common';
import { Datas } from '../index';

/** @class
 *  All the variables datas.
 *  @static
 */
class Variables {
	public static VARIABLES_PER_PAGE = 25;
	public static variablesNumbers: number;
	public static variablesNames: string[];

	constructor() {
		throw new Error('This is a static class!');
	}

	/**
	 *  Read the JSON file associated to variables.
	 *  @static
	 *  @async
	 */
	static async read() {
		let json = (await Platform.parseFileJSON(Paths.FILE_VARIABLES)).variables;
		this.variablesNumbers = json.length * this.VARIABLES_PER_PAGE + 1;
		this.variablesNames = new Array(this.variablesNumbers);
		let i: number, j: number, l: number, m: number, variable: Record<string, any>;
		for (i = 0, l = json.length; i < l; i++) {
			for (j = 0, m = this.VARIABLES_PER_PAGE; j < m; j++) {
				variable = json[i].list[j];
				this.variablesNames[variable.id] = variable.name;
			}
		}
	}

	/**
	 *  Get the variable name by ID.
	 *  @param {number} id
	 *  @returns {string}
	 */
	static get(id: number): string {
		return Datas.Base.get(id, this.variablesNames, 'variable name');
	}
}

export { Variables };
