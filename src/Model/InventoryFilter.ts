/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Interpreter, INVENTORY_FILTER_KIND, Utils } from '../Common';
import { Item } from '../Core';
import { DynamicValue, DynamicValueJSON } from './DynamicValue';
import { Localization, LocalizationJSON } from './Localization';

/**
 * JSON structure describing an inventory filter.
 */
export type InventoryFilterJSON = LocalizationJSON & {
	kind?: INVENTORY_FILTER_KIND;
	itemTypeID?: DynamicValueJSON;
	script?: string;
};

/**
 * An inventory filter used to filter inventory or shop items.
 */
export class InventoryFilter extends Localization {
	public kind: INVENTORY_FILTER_KIND;
	public itemTypeID: DynamicValue;
	public script: string;

	constructor(json?: InventoryFilterJSON) {
		super(json);
	}

	/**
	 * Get a filtering function for items.
	 */
	getFilter(): (item: Item) => boolean {
		switch (this.kind) {
			case INVENTORY_FILTER_KIND.ALL:
				return () => true;
			case INVENTORY_FILTER_KIND.CONSUMABLES:
				return (item) => item.system.consumable;
			case INVENTORY_FILTER_KIND.CUSTOM: {
				const typeID = this.itemTypeID?.getValue() as number;
				return (item) => !item.system.isWeaponArmor() && item.system.type === typeID;
			}
			case INVENTORY_FILTER_KIND.WEAPONS:
				return (item) => item.system.isWeapon();
			case INVENTORY_FILTER_KIND.ARMORS:
				return (item) => item.system.isArmor();
			case INVENTORY_FILTER_KIND.WEAPONS_AND_ARMORS:
				return (item) => item.system.isWeaponArmor();
			case INVENTORY_FILTER_KIND.SCRIPT: {
				return (item) =>
					(Interpreter.evaluate(this.script, {
						additionalName: 'item',
						additionalValue: item,
					}) as boolean) ?? false;
			}
			default:
				return () => false;
		}
	}

	/**
	 * Read the JSON associated to the inventory filter.
	 */
	read(json: InventoryFilterJSON): void {
		super.read(json);
		this.kind = Utils.valueOrDefault(json.kind, INVENTORY_FILTER_KIND.ALL);
		switch (this.kind) {
			case INVENTORY_FILTER_KIND.CUSTOM:
				this.itemTypeID = DynamicValue.readOrDefaultDatabase(json.itemTypeID);
				break;
			case INVENTORY_FILTER_KIND.SCRIPT:
				this.script = Utils.valueOrDefault(json.script, '');
				break;
		}
	}
}
