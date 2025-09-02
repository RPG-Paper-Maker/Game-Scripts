/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Interpreter, INVENTORY_FILTER_KIND, Utils } from '../Common';
import { Item } from '../Core';
import { System } from '../index';
import { Translatable } from './Translatable';

/** @class
 *  An inventory filter used to filter inventory or shops items.
 *  @extends Translatable
 *  @param {Record<string, any>} [json=undefined] - Json object describing the item
 */
class InventoryFilter extends Translatable {
	public kind: INVENTORY_FILTER_KIND;
	public itemTypeID: System.DynamicValue;
	public script: string;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Read the JSON associated to the inventory filter.
	 *  @param {Record<string, any>} - json Json object describing the
	 *  inventory filter
	 */
	read(json: Record<string, any>) {
		super.read(json);
		this.kind = Utils.defaultValue(json.kind, INVENTORY_FILTER_KIND.ALL);
		switch (this.kind) {
			case INVENTORY_FILTER_KIND.CUSTOM:
				this.itemTypeID = System.DynamicValue.readOrDefaultDatabase(json.itemTypeID);
				break;
			case INVENTORY_FILTER_KIND.SCRIPT:
				this.script = Utils.defaultValue(json.script, '');
				break;
		}
	}

	/**
	 *  Get the filter function taking the item to filter and return true if
	 *  pass filter.
	 *  @returns {(item: Core.Item) => boolean}
	 */
	getFilter(): (item: Item) => boolean {
		switch (this.kind) {
			case INVENTORY_FILTER_KIND.ALL:
				return (item: Item): boolean => {
					return true;
				};
			case INVENTORY_FILTER_KIND.CONSUMABLES:
				return (item: Item): boolean => {
					return item.system.consumable;
				};
			case INVENTORY_FILTER_KIND.CUSTOM:
				return (item: Item): boolean => {
					return !item.system.isWeaponArmor() && item.system.type === this.itemTypeID.getValue();
				};
			case INVENTORY_FILTER_KIND.WEAPONS:
				return (item: Item): boolean => {
					return item.system.isWeapon();
				};
			case INVENTORY_FILTER_KIND.ARMORS:
				return (item: Item): boolean => {
					return item.system.isArmor();
				};
			case INVENTORY_FILTER_KIND.WEAPONS_AND_ARMORS:
				return (item: Item): boolean => {
					return item.system.isWeaponArmor();
				};
			case INVENTORY_FILTER_KIND.SCRIPT:
				return (item: Item): boolean => {
					return Interpreter.evaluate(this.script, { additionalName: 'item', additionalValue: item });
				};
			default:
				return null;
		}
	}
}

export { InventoryFilter };
