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
import { Class } from '../Model';

/**
 * JSON structure for Classes.
 */
export type ClassesJSON = {
	classes: Record<string, JsonType>[];
};

/**
 * Handles all class data.
 */
export class Classes {
	private static list: Map<number, Class>;

	/**
	 * Read the JSON file associated with classes.
	 */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_CLASSES)) as ClassesJSON;
		this.list = Utils.readJSONMap(json.classes, Class);
	}

	/**
	 * Get the class by ID.
	 */
	static get(id: number, errorMessage?: string): Class {
		return Data.Base.get(id, this.list, 'class', true, errorMessage);
	}
}
