/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas, Model, Scene } from '..';
import { DAMAGES_KIND, ITEM_KIND, Utils } from '../Common';
import { Game, Player } from '../Core';
import { StructIterator } from '../EventCommand';
import { Base } from './Base';

/** @class
 *  A skill learned by a player.
 *  @param {number} id - The ID of the skill
 */
class ShopItem extends Base {
	public selectionItem: ITEM_KIND;
	public itemID: Model.DynamicValue;
	public weaponID: Model.DynamicValue;
	public armorID: Model.DynamicValue;
	public selectionPrice: boolean;
	public specificPrice: Model.Cost[];
	public selectionStock: boolean;
	public specificStock: Model.DynamicValue;
	public stock: number;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Read the JSON associated to the shop item.
	 *  @param {Record<string, any>} json - Json object describing the shop item
	 */
	read(json: Record<string, any>) {}

	/**
	 *  Parse command with iterator.
	 *  @param {any[]} command
	 *  @param {StructIterator} iterator
	 */
	parse(command: any[], iterator: StructIterator) {
		this.selectionItem = command[iterator.i++];
		switch (this.selectionItem) {
			case ITEM_KIND.ITEM:
				this.itemID = Model.DynamicValue.createValueCommand(command, iterator);
				break;
			case ITEM_KIND.WEAPON:
				this.weaponID = Model.DynamicValue.createValueCommand(command, iterator);
				break;
			case ITEM_KIND.ARMOR:
				this.armorID = Model.DynamicValue.createValueCommand(command, iterator);
				break;
		}
		this.selectionPrice = Utils.numberToBool(command[iterator.i++]);
		if (this.selectionPrice) {
			this.specificPrice = [];
			let cost: Model.Cost;
			while (command[iterator.i] != '-') {
				cost = new Model.Cost();
				cost.parse(command, iterator);
				this.specificPrice.push(cost);
			}
			iterator.i++;
		}
		this.selectionStock = Utils.numberToBool(command[iterator.i++]);
		if (this.selectionStock) {
			this.specificStock = Model.DynamicValue.createValueCommand(command, iterator);
		}
	}

	/**
	 *  Get the item system.
	 *  @returns {System.CommonSkillItem}
	 */
	getItem(): Model.CommonSkillItem {
		switch (this.selectionItem) {
			case ITEM_KIND.ITEM:
				return Datas.Items.get(this.itemID.getValue());
			case ITEM_KIND.WEAPON:
				return Datas.Weapons.get(this.weaponID.getValue());
			case ITEM_KIND.ARMOR:
				return Datas.Armors.get(this.armorID.getValue());
		}
	}

	/**
	 *  Get the price.
	 *  @returns {number}
	 */
	getPrice(): Record<string, [DAMAGES_KIND, number]> {
		return this.selectionPrice
			? Model.Cost.getPrice(this.specificPrice)
			: Model.Cost.getPrice(this.getItem().price);
	}

	/**
	 *  Get the initial stock.
	 *  @returns {number}
	 */
	getStock(): number {
		return this.selectionStock ? this.specificStock.getValue() : -1;
	}

	/**
	 *  Get the initial stock.
	 *  @returns {boolean}
	 */
	isPossiblePrice(): boolean {
		const price = this.getPrice();
		const user = Scene.Map.current.user ? Scene.Map.current.user.player : Player.getTemporaryPlayer();
		for (const id in price) {
			const [kind, value] = price[id];
			let currentValue = 0;
			switch (kind) {
				case DAMAGES_KIND.CURRENCY:
					currentValue = Game.current.currencies[id];
					break;
				case DAMAGES_KIND.STAT:
					currentValue = user[Datas.BattleSystems.getStatistic(parseInt(id)).abbreviation];
					break;
				case DAMAGES_KIND.VARIABLE:
					currentValue = Game.current.getVariable(parseInt(id));
					break;
			}
			if (currentValue < value) {
				return false;
			}
		}
		return true;
	}

	/**
	 *  Get the max possible number you can buy.
	 *  @param {number} initial The initial value corresponding to stock.
	 *  @returns {number}
	 */
	getMax(initial: number): number {
		const price = this.getPrice();
		const user = Scene.Map.current.user ? Scene.Map.current.user.player : Player.getTemporaryPlayer();
		let max = initial;
		for (const id in price) {
			const [kind, value] = price[id];
			let currentValue = 0;
			switch (kind) {
				case DAMAGES_KIND.CURRENCY:
					currentValue = Game.current.currencies[id];
					break;
				case DAMAGES_KIND.STAT:
					currentValue = user[Datas.BattleSystems.getStatistic(parseInt(id)).abbreviation];
					break;
				case DAMAGES_KIND.VARIABLE:
					currentValue = Game.current.getVariable(parseInt(id));
					break;
			}
			if (value !== 0) {
				max = Math.min(max, Math.floor(currentValue / value));
			}
		}
		return max;
	}
}

export { ShopItem };
