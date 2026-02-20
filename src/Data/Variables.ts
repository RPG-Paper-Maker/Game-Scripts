/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform } from '../Common';
import { Base } from './Base';

/**
 * JSON structure for Variables.
 */
export type VariablesJSON = {
	variables: {
		list: { id: number; name: string }[];
	}[];
};

/**
 * Handles all variable data.
 */
export class Variables {
	static readonly VARIABLES_PER_PAGE = 25;
	public static names: Map<number, string>;

	/**
	 * Get the variable name by ID.
	 */
	static get(id: number): string {
		return Base.get(id, this.names, 'variable name');
	}

	/**
	 * Read the JSON file associated with variables.
	 */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_VARIABLES)) as VariablesJSON;
		this.names = new Map();
		for (const page of json.variables) {
			for (const variable of page.list) {
				this.names.set(variable.id, variable.name);
			}
		}
	}
}
