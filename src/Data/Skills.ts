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
import { Skill } from '../Model';
import { Base } from './Base';

/**
 * JSON structure for Skills.
 */
export type SkillsJSON = {
	skills: Record<string, JsonType>[];
};

/**
 * Handles all skill data.
 */
export class Skills {
	private static list: Map<number, Skill>;

	/**
	 * Get the skill by ID.
	 */
	static get(id: number): Skill {
		return Base.get(id, this.list, 'skill');
	}

	/**
	 * Read the JSON file associated with skills.
	 */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_SKILLS)) as SkillsJSON;
		this.list = Utils.readJSONMap(json.skills, Skill);
	}
}
