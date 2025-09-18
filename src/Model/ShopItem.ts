/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Data, Scene } from '..';
import { DAMAGES_KIND, ITEM_KIND, Utils } from '../Common';
import { JsonType, MapObjectCommandType } from '../Common/Types';
import { Game, Player } from '../Core';
import { StructIterator } from '../EventCommand';
import { Base } from './Base';
import { CommonSkillItem } from './CommonSkillItem';
import { Cost } from './Cost';
import { DynamicValue } from './DynamicValue';

/**
 * A shop item available for purchase by the player.
 */
export class ShopItem extends Base {
	public selectionItem: ITEM_KIND;
	public itemID: DynamicValue;
	public weaponID: DynamicValue;
	public armorID: DynamicValue;
	public selectionPrice: boolean;
	public specificPrice: Cost[];
	public selectionStock: boolean;
	public specificStock: DynamicValue;
	public stock: number;

	/**
	 * Get the system item associated with this shop entry.
	 */
	getItem(): CommonSkillItem {
		switch (this.selectionItem) {
			case ITEM_KIND.ITEM:
				return Data.Items.get(this.itemID.getValue() as number);
			case ITEM_KIND.WEAPON:
				return Data.Weapons.get(this.weaponID.getValue() as number);
			case ITEM_KIND.ARMOR:
				return Data.Armors.get(this.armorID.getValue() as number);
		}
	}

	/**
	 * Get the price of this item.
	 */
	getPrice(): Map<number, [DAMAGES_KIND, number]> {
		return this.selectionPrice ? Cost.getPrice(this.specificPrice) : Cost.getPrice(this.getItem().price);
	}

	/**
	 * Get the initial stock of this item.
	 */
	getStock(): number {
		return this.selectionStock ? (this.specificStock.getValue() as number) : -1;
	}

	/**
	 * Check if the player has enough resources to afford this item.
	 */
	isPossiblePrice(): boolean {
		const price = this.getPrice();
		const user = Scene.Map.current.user?.player ?? Player.getTemporaryPlayer();
		for (const [id, [kind, value]] of price.entries()) {
			let currentValue = 0;
			switch (kind) {
				case DAMAGES_KIND.CURRENCY:
					currentValue = Game.current.getCurrency(id);
					break;
				case DAMAGES_KIND.STAT:
					currentValue = user[Data.BattleSystems.getStatistic(id).abbreviation];
					break;
				case DAMAGES_KIND.VARIABLE:
					currentValue = Game.current.getVariable(id);
					break;
			}
			if (currentValue < value) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Get the maximum number of this item the player can buy.
	 * @param initial - Initial stock count.
	 */
	getMax(initial: number): number {
		const price = this.getPrice();
		const user = Scene.Map.current.user?.player ?? Player.getTemporaryPlayer();
		let max = initial;
		for (const [id, [kind, value]] of price.entries()) {
			let currentValue = 0;
			switch (kind) {
				case DAMAGES_KIND.CURRENCY:
					currentValue = Game.current.getCurrency(id);
					break;
				case DAMAGES_KIND.STAT:
					currentValue = user[Data.BattleSystems.getStatistic(id).abbreviation];
					break;
				case DAMAGES_KIND.VARIABLE:
					currentValue = Game.current.getVariable(id);
					break;
			}
			if (value !== 0) {
				max = Math.min(max, Math.floor(currentValue / value));
			}
		}
		return max;
	}

	/**
	 * Parse a shop item from command structure.
	 */
	parse(command: MapObjectCommandType[], iterator: StructIterator): void {
		this.selectionItem = command[iterator.i++] as ITEM_KIND;
		switch (this.selectionItem) {
			case ITEM_KIND.ITEM:
				this.itemID = DynamicValue.createValueCommand(command, iterator);
				break;
			case ITEM_KIND.WEAPON:
				this.weaponID = DynamicValue.createValueCommand(command, iterator);
				break;
			case ITEM_KIND.ARMOR:
				this.armorID = DynamicValue.createValueCommand(command, iterator);
				break;
		}
		this.selectionPrice = Utils.numberToBool(command[iterator.i++] as number);
		if (this.selectionPrice) {
			this.specificPrice = [];
			while (command[iterator.i] !== '-') {
				const cost = new Cost();
				cost.parse(command, iterator);
				this.specificPrice.push(cost);
			}
			iterator.i++;
		}
		this.selectionStock = Utils.numberToBool(command[iterator.i++] as number);
		if (this.selectionStock) {
			this.specificStock = DynamicValue.createValueCommand(command, iterator);
		}
	}

	/**
	 * No proper read for it since everything in in parsing from command.
	 */
	read(_json: JsonType): void {}
}
