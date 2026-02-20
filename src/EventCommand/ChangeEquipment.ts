/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '..';
import { ITEM_KIND, Utils } from '../Common';
import { Game, Item, MapObject, Player } from '../Core';
import { Base } from './Base';

/** @class
 *  An event command for changing a property value.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ChangeEquipment extends Base {
	public equipmentID: Model.DynamicValue;
	public isWeapon: boolean;
	public weaponArmorID: Model.DynamicValue;
	public selection: number;
	public heInstanceID: Model.DynamicValue;
	public groupIndex: number;
	public isApplyInInventory: boolean;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.equipmentID = Model.DynamicValue.createValueCommand(command, iterator);
		this.isWeapon = Utils.numberToBool(command[iterator.i++]);
		this.weaponArmorID = Model.DynamicValue.createValueCommand(command, iterator);

		// Selection
		this.selection = command[iterator.i++];
		switch (this.selection) {
			case 0:
				this.heInstanceID = Model.DynamicValue.createValueCommand(command, iterator);
				break;
			case 1:
				this.groupIndex = command[iterator.i++];
				break;
		}
		this.isApplyInInventory = Utils.numberToBool(command[iterator.i++]);
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		const equipmentID = this.equipmentID.getValue() as number;
		const kind = this.isWeapon ? ITEM_KIND.WEAPON : ITEM_KIND.ARMOR;
		const weaponArmorID = this.weaponArmorID.getValue() as number;
		let targets: Player[];
		switch (this.selection) {
			case 0:
				targets = [Game.current.getHeroByInstanceID(this.heInstanceID.getValue() as number)];
				break;
			case 1:
				targets = Game.current.getTeam(this.groupIndex);
				break;
		}
		let target: Player, item: Item;
		for (let i = 0, l = targets.length; i < l; i++) {
			target = targets[i];
			item = Item.findItem(kind, weaponArmorID);
			if (item === null) {
				if (this.isApplyInInventory) {
					break; // Don't apply because not in inventory
				}
				item = new Item(kind, weaponArmorID, 0);
			}
			const previousEquip = target.equip[equipmentID];
			if (previousEquip !== null && previousEquip.system.id !== weaponArmorID) {
				previousEquip.add(1);
			}
			target.equip[equipmentID] = item;
			if (previousEquip === null || previousEquip.system.id !== weaponArmorID) {
				item.remove(1);
			}
		}
		return 1;
	}
}

export { ChangeEquipment };
