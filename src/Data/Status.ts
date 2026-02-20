/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform, Utils } from '../Common';
import { JsonType } from '../Common/Types';
import { Status as ModelStatus } from '../Model';
import { Base } from './Base';

/**
 * JSON structure for Status.
 */
export type StatusJSON = {
	status: Record<string, JsonType>[];
};

/**
 * Handles all status data.
 */
export class Status {
	private static list: Map<number, ModelStatus>;

	/**
	 * Get the status by ID.
	 */
	static get(id: number): ModelStatus {
		return Base.get(id, this.list, 'status');
	}

	/**
	 * Read the JSON file associated with status.
	 */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_STATUS)) as StatusJSON;
		this.list = Utils.readJSONMap(json.status, ModelStatus);
	}
}
