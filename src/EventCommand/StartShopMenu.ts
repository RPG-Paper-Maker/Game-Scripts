/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Manager, Model, Scene } from '..';
import { DYNAMIC_VALUE_KIND, ITEM_KIND } from '../Common';
import { Game, Item, MapObject } from '../Core';
import { Base } from './Base';

/** @class
 *  An event command for sarting shop menu.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class StartShopMenu extends Base {
	public buyOnly: Model.DynamicValue;
	public shopID: Model.DynamicValue;
	public items: Model.ShopItem[];
	public isRestock: boolean;

	constructor(command: any[], isRestock: boolean = false) {
		super();

		this.isRestock = isRestock;
		const iterator = {
			i: 0,
		};
		if (!isRestock) {
			this.buyOnly = Model.DynamicValue.createValueCommand(command, iterator);
		}
		this.shopID = Model.DynamicValue.createValueCommand(command, iterator);
		this.items = [];
		let shopItem: Model.ShopItem;
		while (iterator.i < command.length) {
			shopItem = new Model.ShopItem();
			shopItem.parse(command, iterator);
			this.items.push(shopItem);
		}
	}

	/**
	 *  Initialize the current state.
	 *  @returns {Record<string, any>} The current state
	 */
	initialize(): Record<string, any> {
		// Create or load stock according to first time opening or not
		const shopID = this.shopID.getValue() as number;
		let stocks: Record<string, number>[] = [];
		stocks[ITEM_KIND.ITEM] = {};
		stocks[ITEM_KIND.WEAPON] = {};
		stocks[ITEM_KIND.ARMOR] = {};
		let system: Model.ShopItem;
		const list: Item[] = [];
		let id: number, stock: number, newStock;
		if (Game.current.shops[shopID]) {
			stocks = Game.current.shops[shopID];
			for (let i = 0, l = this.items.length; i < l; i++) {
				system = this.items[i];
				id = system.getItem().id;
				stock = stocks[system.selectionItem][id];
				if (this.isRestock) {
					stock = stock === undefined ? 0 : stock;
					if (stock !== -1) {
						newStock = system.getStock();
						if (newStock === -1) {
							stock = -1;
						} else {
							stock += newStock;
						}
					}
					stocks[system.selectionItem][id] = stock;
				} else {
					if (stock === undefined) {
						stock = system.getStock();
						stocks[system.selectionItem][id] = stock;
					}
				}
				list[i] = new Item(system.selectionItem, id, stock, system);
			}
			if (!this.isRestock) {
				for (const kindStr of Object.keys(stocks)) {
					const kind = parseInt(kindStr) as ITEM_KIND;
					for (const idStr of Object.keys(stocks[kind])) {
						const extraId = parseInt(idStr);
						if (!this.items.some((s) => s.selectionItem === kind && s.getItem().id === extraId)) {
							const shopItem = new Model.ShopItem();
							shopItem.selectionItem = kind;
							const idVal = Model.DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, extraId);
							switch (kind) {
								case ITEM_KIND.ITEM:
									shopItem.itemID = idVal;
									break;
								case ITEM_KIND.WEAPON:
									shopItem.weaponID = idVal;
									break;
								case ITEM_KIND.ARMOR:
									shopItem.armorID = idVal;
									break;
							}
							shopItem.selectionPrice = false;
							shopItem.selectionStock = false;
							list.push(new Item(kind, extraId, stocks[kind][extraId], shopItem));
						}
					}
				}
			}
		} else {
			for (let i = 0, l = this.items.length; i < l; i++) {
				system = this.items[i];
				id = system.getItem().id;
				stock = system.getStock();
				stocks[system.selectionItem][id] = stock;
				if (!this.isRestock) {
					list[i] = new Item(system.selectionItem, id, stock, system);
				}
			}
			Game.current.shops[shopID] = stocks;
		}
		return this.isRestock
			? {
					opened: true,
				}
			: {
					opened: false,
					shopID: shopID,
					buyOnly: this.buyOnly.getValue() as number,
					stock: list,
				};
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		if (currentState.opened) {
			return 1;
		}
		Manager.Stack.push(new Scene.MenuShop(currentState.shopID, currentState.buyOnly, currentState.stock));
		currentState.opened = true;
		return 0;
	}
}

export { StartShopMenu };
