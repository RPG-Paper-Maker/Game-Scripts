/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Battler } from '../Core';
import { CommonSkillItem } from './CommonSkillItem';

/**
 * Represents a skill in the game.
 * Skills share most of their behavior with items and weapons,
 * and are modeled as {@link CommonSkillItem}.
 */
export class Skill extends CommonSkillItem {
	/**
	 * Builds a human-readable string representing this skill's costs
	 * (e.g., "10 MP 5 TP").
	 * @returns {string} The formatted cost string.
	 */
	getCostString(): string {
		return this.costs.map((cost) => cost.toString()).join(' ') + (this.costs.length > 0 ? ' ' : '');
	}

	/**
	 * Builds the battle message shown when this skill is used.
	 * Replaces placeholders `[user]` and `[skill]` in the template.
	 * @param {Battler} user - The battler using the skill.
	 * @returns {string} The formatted battle message.
	 */
	getMessage(user: Battler): string {
		return this.battleMessage.name().replace('[user]', user.player.name).replace('[skill]', this.name());
	}
}
