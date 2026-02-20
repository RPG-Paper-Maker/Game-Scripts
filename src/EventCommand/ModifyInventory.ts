/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '..';
import { Item, MapObject } from '../Core';
import { Base } from './Base';

/** @class
 *  An event command for modifying the inventory.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ModifyInventory extends Base {
	public ITEM_KIND: number;
	public itemID: Model.DynamicValue;
	public operation: number;
	public value: Model.DynamicValue;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.ITEM_KIND = command[iterator.i++];
		this.itemID = Model.DynamicValue.createValueCommand(command, iterator);
		this.operation = command[iterator.i++];
		this.value = Model.DynamicValue.createValueCommand(command, iterator);
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		const item = new Item(this.ITEM_KIND, this.itemID.getValue() as number, this.value.getValue() as number);

		// Doing the coresponding operation
		switch (this.operation) {
			case 0:
				item.equalItems();
				break;
			case 1:
				item.addItems();
				break;
			case 2:
				item.removeItems();
				break;
			case 3:
				item.multItems();
				break;
			case 4:
				item.divItems();
				break;
			case 5:
				item.moduloItems();
				break;
		}
		return 1;
	}
}

export { ModifyInventory };
