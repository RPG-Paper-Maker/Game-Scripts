/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from './Base';

/** JSON structure for a ClassSkill */
export type ClassSkillJSON = {
	id: number;
	l: number;
};

/**
 *  Represents a skill that a class can learn at a certain level.
 */
export class ClassSkill extends Base {
	public id: number;
	public level: number;

	constructor(json?: ClassSkillJSON) {
		super(json);
	}

	/** Read the JSON data for the class skill. */
	read(json: ClassSkillJSON) {
		this.id = json.id;
		this.level = json.l;
	}
}
