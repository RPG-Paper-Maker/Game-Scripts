/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { DAMAGES_KIND, ITEM_KIND } from '../Common';
import { Data, Model, Scene } from '../index';
import { Game } from './Game';
import { Player } from './Player';

/** @class
 *  An item in the inventory.
 *  @param {ITEM_KIND} kind - Kind of item (item, weapon, or armor)
 *  @param {number} id - The ID of the item
 *  @param {number} nb - The occurence of the item in the inventory
 */
class Item {
	public kind: ITEM_KIND;
	public system: Model.CommonSkillItem;
	public nb: number;
	public shop: Model.ShopItem;

	constructor(kind: ITEM_KIND, id: number, nb: number, shop?: Model.ShopItem) {
		this.kind = kind;
		switch (this.kind) {
			case ITEM_KIND.ITEM:
				this.system = Data.Items.get(id);
				break;
			case ITEM_KIND.WEAPON:
				this.system = Data.Weapons.get(id);
				break;
			case ITEM_KIND.ARMOR:
				this.system = Data.Armors.get(id);
				break;
		}
		this.nb = nb;
		this.shop = shop;
	}

	/**
	 *  Find an item in the inventory.
	 *  @static
	 *  @param {ITEM_KIND} kind - The kind of item
	 *  @param {number} id - The item ID
	 *  @returns {Item}
	 */
	static findItem(kind: ITEM_KIND, id: number): Item {
		let item: Item;
		for (let i = 0, l = Game.current.items.length; i < l; i++) {
			item = Game.current.items[i];
			if (item.kind === kind && item.system.id === id) {
				return item;
			}
		}
		return null;
	}

	/**
	 *  The json save.
	 */
	getSave(): Record<string, any> {
		return {
			kind: this.kind,
			id: this.system.id,
			nb: this.nb,
		};
	}

	/**
	 *  Remove item from inventory.
	 *  @param {number} nb - Number of item to remove
	 *  @returns {boolean}
	 */
	remove(nb: number): boolean {
		this.nb -= nb;
		if (this.nb <= 0) {
			Game.current.items.splice(Game.current.items.indexOf(this), 1);
			return true;
		}
	}

	/**
	 *  Add item in inventory.
	 *  @param {number} nb - Number of item to add
	 */
	add(nb: number) {
		if (this.nb === 0) {
			Game.current.items.push(this);
		}
		this.nb += nb;
	}

	/**
	 *  Modify items only if already in inventory.
	 *  @param {Function} callback - callback function for action
	 *  @returns {boolean} Indicates if the item is already inside the
	 *  inventory
	 */
	modifyItems(callback: Function): boolean {
		let item: Item;
		for (let i = 0, l = Game.current.items.length; i < l; i++) {
			item = Game.current.items[i];
			if (item.kind === this.kind && item.system.id === this.system.id) {
				// If the item already is in the inventory...
				callback.call(this, item, i);
				return true;
			}
		}
		return false;
	}

	/**
	 *  Modify the number of the item
	 */
	equalItems() {
		if (
			!this.modifyItems(function (item: Item) {
				item.nb = this.nb;
			})
		) {
			Game.current.items.push(this);
		}
	}

	/**
	 *  Add the number of the item
	 */
	addItems() {
		if (
			!this.modifyItems(function (item: Item) {
				item.nb += this.nb;
			})
		) {
			Game.current.items.push(this);
		}
	}

	/**
	 *  Remove the number of the item
	 */
	removeItems() {
		this.modifyItems(function (item: Item, index: number) {
			item.nb -= this.nb;
			if (item.nb <= 0) {
				Game.current.items.splice(index, 1);
			}
		});
	}
	/**
	 *  Multiply the number of the item
	 */
	multItems() {
		this.modifyItems(function (item: Item) {
			item.nb *= this.nb;
		});
	}

	/**
	 *  Modify the number of the item
	 */
	divItems() {
		this.modifyItems(function (item: Item) {
			item.nb /= this.nb;
		});
	}

	/**
	 *  Modulo the number of the item
	 */
	moduloItems() {
		this.modifyItems(function (item: Item) {
			item.nb %= this.nb;
		});
	}

	/**
	 *  Use one item and check if there is at least one item left
	 * @returns {boolean}
	 */
	use(): boolean {
		return --this.nb > 0;
	}

	/**
	 *  Get the max value you could buy from this item shop.
	 *  @returns {number}
	 */
	getMaxBuy(): number {
		return this.shop.getMax(this.nb === -1 ? 9999 : this.nb);
	}

	/**
	 *  Use the currencies to buy this shop item and indicates if the shop item
	 *  need to be removed.
	 *  @param {number} shopID The item shop ID
	 *  @param {number} times The number of items to buy
	 *  @returns {boolean}
	 */
	buy(shopID: number, times: number): boolean {
		const price = this.shop.getPrice();
		const user = Scene.Map.current.user ? Scene.Map.current.user.player : Player.getTemporaryPlayer();

		// Update value
		for (const [id, [kind, value]] of price.entries()) {
			const totalValue = value * times;
			switch (kind) {
				case DAMAGES_KIND.CURRENCY:
					Game.current.currencies.set(id, Game.current.currencies.get(id) - totalValue);
					if (totalValue > 0) {
						Game.current.currenciesUsed.set(id, Game.current.currenciesUsed.get(id) + totalValue);
					} else {
						Game.current.currenciesEarned.set(id, Game.current.currenciesEarned.get(id) - totalValue);
					}
					break;
				case DAMAGES_KIND.STAT:
					user[Data.BattleSystems.getStatistic(id).abbreviation] -= totalValue;
					break;
				case DAMAGES_KIND.VARIABLE:
					Game.current.variables.set(id, (Game.current.getVariable(id) as number) - totalValue);
					break;
			}
		}
		if (this.nb !== -1) {
			this.nb -= times;
		}
		// Add items to inventory
		const item = Item.findItem(this.kind, this.system.id);
		if (item) {
			item.nb += times;
		} else {
			Game.current.items.push(new Item(this.kind, this.system.id, times));
		}
		// Change stock value
		if (Game.current.shops[shopID][this.kind][this.system.id] !== -1) {
			Game.current.shops[shopID][this.kind][this.system.id] -= times;
		}
		return Game.current.shops[shopID][this.kind][this.system.id] === 0;
	}

	/**
	 *  Get the currencies to sell this item and indicates if the item need to
	 *  be removed from list.
	 *  @param {number} shopID The item shop ID
	 *  @param {number} times The number of items to buy
	 *  @returns {boolean}
	 */
	sell(times: number): boolean {
		const price = this.system.getPrice();
		const user = Scene.Map.current.user ? Scene.Map.current.user.player : Player.getTemporaryPlayer();

		// Update currency
		for (const [id, [kind, value]] of price.entries()) {
			const p = Math.round((value * (Data.Systems.priceSoldItem.getValue() as number)) / 100) * times;
			switch (kind) {
				case DAMAGES_KIND.CURRENCY:
					Game.current.currencies.set(id, Game.current.currencies.get(id) + p);
					if (p > 0) {
						Game.current.currenciesEarned.set(id, Game.current.currenciesEarned.get(id) + p);
					} else {
						Game.current.currenciesUsed.set(id, Game.current.currenciesUsed.get(id) + p);
					}
					break;
				case DAMAGES_KIND.STAT:
					user[Data.BattleSystems.getStatistic(id).abbreviation] += p;
					break;
				case DAMAGES_KIND.VARIABLE:
					Game.current.variables.set(id, Game.current.getVariable(id) + p);
					break;
			}
		}
		return this.remove(times);
	}
}

export { Item };
