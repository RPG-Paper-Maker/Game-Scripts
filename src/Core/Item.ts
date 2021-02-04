/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Enum } from "../Common";
import ItemKind = Enum.ItemKind;
import { System, Datas } from "../index";
import { Game } from "./Game";

/** @class
 *  An item in the inventory.
 *  @param {ItemKind} kind - Kind of item (item, weapon, or armor)
 *  @param {number} id - The ID of the item
 *  @param {number} nb - The occurence of the item in the inventory
 */
class Item {

    public kind: ItemKind;
    public system: System.CommonSkillItem;
    public nb: number;
    public shop: System.ShopItem;

    constructor(kind: ItemKind, id: number, nb: number, shop?: System.ShopItem) {
        this.kind = kind;
        switch (this.kind) {
            case ItemKind.Item:
                this.system = Datas.Items.get(id);
                break;
            case ItemKind.Weapon:
                this.system = Datas.Weapons.get(id);
                break;
            case ItemKind.Armor:
                this.system = Datas.Armors.get(id);
                break;
        }
        this.nb = nb;
        this.shop = shop;
    }

    /** 
     *  Find an item in the inventory.
     *  @static
     *  @param {ItemKind} kind - The kind of item
     *  @param {number} id - The item ID
     *  @returns {Item}
     */
    static findItem(kind: ItemKind, id: number): Item {
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
     *  Remove item from inventory.
     *  @param {number} nb - Number of item to remove
     */
    remove(nb: number) {
        this.nb -= nb;
        if (this.nb <= 0) {
            Game.current.items.splice(Game.current.items.indexOf(
                this), 1);
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
        if (!this.modifyItems(function(item: Item) {item.nb = this.nb;})) {
            Game.current.items.push(this);
        }
    }

    /** 
     *  Add the number of the item
     */
    addItems() {
        if (!this.modifyItems(function(item: Item) {item.nb += this.nb;})) {
            Game.current.items.push(this);
        }
    }

    /** 
     *  Remove the number of the item
     */
    removeItems() {
        this.modifyItems(function(item: Item, index: number) {
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
        this.modifyItems(function(item: Item) {
            item.nb *= this.nb;
        });
    }

    /** 
     *  Modify the number of the item
     */
    divItems() {
        this.modifyItems(function(item: Item) {
            item.nb /= this.nb;
        });
    }

    /** 
     *  Modulo the number of the item
     */
    moduloItems() {
        this.modifyItems(function(item: Item) {
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
}

export { Item }