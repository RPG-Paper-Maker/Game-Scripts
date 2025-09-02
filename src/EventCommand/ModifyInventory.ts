/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Item, MapObject } from '../Core';
import { System } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for modifying the inventory.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ModifyInventory extends Base {
	public ITEM_KIND: number;
	public itemID: System.DynamicValue;
	public operation: number;
	public value: System.DynamicValue;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.ITEM_KIND = command[iterator.i++];
		this.itemID = System.DynamicValue.createValueCommand(command, iterator);
		this.operation = command[iterator.i++];
		this.value = System.DynamicValue.createValueCommand(command, iterator);
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		const item = new Item(this.ITEM_KIND, this.itemID.getValue(), this.value.getValue());

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
