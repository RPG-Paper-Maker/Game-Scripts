/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '..';
import { Mathf } from '../Common';
import { Game, MapObject } from '../Core';
import { Base } from './Base';

/** @class
 *  An event command for modifying a currency value.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ModifyCurrency extends Base {
	public currencyID: Model.DynamicValue;
	public operation: number;
	public value: Model.DynamicValue;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.currencyID = Model.DynamicValue.createValueCommand(command, iterator);
		this.operation = command[iterator.i++];
		this.value = Model.DynamicValue.createValueCommand(command, iterator);
	}

	/**
	 *  Update and check if the event is finished.
	 *   @param {Record<string, any>} - currentState The current state of the event
	 *   @param {MapObject} object - The current object reacting
	 *   @param {number} state - The state ID
	 *   @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		const currencyID = this.currencyID.getValue() as number;
		const previousCurrency = Game.current.currencies[currencyID];
		Game.current.currencies[currencyID] = Mathf.OPERATORS_NUMBERS[this.operation](
			Game.current.currencies[currencyID],
			this.value.getValue() as number
		);
		const dif = Game.current.currencies[currencyID] - previousCurrency;
		if (dif > 0) {
			Game.current.currenciesEarned[currencyID] += dif;
		} else {
			Game.current.currenciesUsed[currencyID] -= dif;
		}
		return 1;
	}
}

export { ModifyCurrency };
