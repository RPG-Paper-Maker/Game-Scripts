/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../Common';
import { Base } from './Base';
import { TroopMonster } from './TroopMonster';
import { TroopReaction } from './TroopReaction';

/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { TroopMonsterJSON } from './TroopMonster';
import { TroopReactionJSON } from './TroopReaction';

/**
 * JSON structure for a troop.
 */
export type TroopJSON = {
	l?: TroopMonsterJSON[];
	reactions?: TroopReactionJSON[];
};

/**
 * A troop definition in the game, containing monsters and reactions.
 */
export class Troop extends Base {
	public list: TroopMonster[];
	public reactions: TroopReaction[];

	constructor(json?: TroopJSON) {
		super(json);
	}

	/**
	 * Read JSON into this troop.
	 */
	read(json: TroopJSON): void {
		this.list = Utils.readJSONList(json.l, TroopMonster);
		this.reactions = Utils.readJSONList(json.reactions, TroopReaction);
	}
}
