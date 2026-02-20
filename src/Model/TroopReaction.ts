/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { TROOP_REACTION_FREQUENCY_KIND, Utils } from '../Common';
import { Reaction, ReactionJSON } from './Reaction';
import { TroopReactionConditions, TroopReactionConditionsJSON } from './TroopReactionConditions';

/**
 * JSON structure for a troop reaction.
 */
export type TroopReactionJSON = ReactionJSON & {
	id: number;
	conditions?: TroopReactionConditionsJSON;
	frequency?: TROOP_REACTION_FREQUENCY_KIND;
};

/**
 * A troop reaction definition with conditions and frequency.
 */
export class TroopReaction extends Reaction {
	public id: number;
	public conditions: TroopReactionConditions;
	public frequency: TROOP_REACTION_FREQUENCY_KIND;

	constructor(json?: TroopReactionJSON) {
		super(json);
	}

	/**
	 * Read JSON into this troop reaction.
	 */
	read(json: TroopReactionJSON): void {
		super.read(json);
		this.id = json.id;
		this.conditions = new TroopReactionConditions(json.conditions);
		this.frequency = Utils.valueOrDefault(json.frequency, TROOP_REACTION_FREQUENCY_KIND.ONE_TIME);
	}
}
