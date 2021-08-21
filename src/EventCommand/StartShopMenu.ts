/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Manager, Scene, System } from "..";
import { Enum, Utils } from "../Common";
import { Game, Item, MapObject } from "../Core";
import { Base } from "./Base";

/** @class
 *  An event command for sarting shop menu.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class StartShopMenu extends Base {
    public buyOnly: System.DynamicValue;
    public shopID: System.DynamicValue;
    public items: System.ShopItem[];
    public isRestock: boolean;

    constructor(command: any[], isRestock: boolean = false) {
        super();

        this.isRestock = isRestock;
        let iterator = {
            i: 0
        }
        if (!isRestock) {
            this.buyOnly = System.DynamicValue.createValueCommand(command, iterator);
        }
        this.shopID = System.DynamicValue.createValueCommand(command, iterator);
        this.items = [];
        let shopItem: System.ShopItem;
        while (iterator.i < command.length) {
            shopItem = new System.ShopItem();
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
        let shopID = this.shopID.getValue();
        let stocks: Record<string, number>[] = [];
        stocks[Enum.ItemKind.Item] = {};
        stocks[Enum.ItemKind.Weapon] = {};
        stocks[Enum.ItemKind.Armor] = {};
        let system: System.ShopItem;
        let list: Item[] = [];
        let id: number, stock: number, newStock;
        if (Game.current.shops[shopID]) {
            stocks = Game.current.shops[shopID];
            for (let i = 0, l = this.items.length; i < l; i++) {
                system = this.items[i];
                id = system.getItem().id;
                stock = stocks[system.selectionItem][id];
                if (this.isRestock) {
                    stock = (Utils.isUndefined(stock) ? 0 : stock);
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
                    if (Utils.isUndefined(stock)) {
                        stock = system.getStock();
                        stocks[system.selectionItem][id] = stock;
                    }
                }
                list[i] = new Item(system.selectionItem, id, stock, system);
            }
        } else {
            if (!this.isRestock) {
                for (let i = 0, l = this.items.length; i < l; i++) {
                    system = this.items[i];
                    id = system.getItem().id;
                    stock = system.getStock();
                    stocks[system.selectionItem][id] = stock;
                    list[i] = new Item(system.selectionItem, id, stock, system);
                }
                Game.current.shops[shopID] = stocks;
            }
        }
        return this.isRestock ? {
            opened: true
        } : {
            opened: false,
            shopID: shopID,
            buyOnly: this.buyOnly.getValue(),
            stock: list
        }
    }

    /** 
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState: Record<string, any>, object: MapObject, state: number): 
        number {
        if (currentState.opened) {
            return 1;
        }
        Manager.Stack.push(new Scene.MenuShop(currentState.shopID, currentState
            .buyOnly, currentState.stock));
        currentState.opened = true;
        return 0;
    }
}

export { StartShopMenu }