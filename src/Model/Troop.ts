/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '..';
import { Utils } from '../Common';
import { Base } from './Base';

/** @class
 *  A troop of the game.
 *  @extends Model.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  troop
 */
class Troop extends Base {
	public list: Model.TroopMonster[];
	public reactions: Model.TroopReaction[];

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Read the JSON associated to the troop.
	 *  @param {Record<string, any>} - json Json object describing the troop
	 */
	read(json: Record<string, any>) {
		this.list = [];
		Utils.readJSONSystemList({
			list: Utils.valueOrDefault(json.l, []),
			listIndexes: this.list,
			cons: Model.TroopMonster,
		});
		this.reactions = [];
		Utils.readJSONSystemList({
			list: Utils.valueOrDefault(json.reactions, []),
			listIndexes: this.reactions,
			cons: Model.TroopReaction,
		});
	}
}

export { Troop };
