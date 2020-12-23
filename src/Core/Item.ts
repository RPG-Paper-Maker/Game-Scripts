/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Enum } from "../Common";
import ItemKind = Enum.ItemKind;
import { Manager, System, Datas } from "../index";

/** @class
 *  An item in the inventory.
 *  @param {ItemKind} kind Kind of item (item, weapon, or armor)
 *  @param {number} id The ID of the item
 *  @param {number} nb The occurence of the item in the inventory
 */
class Item {

    public kind: ItemKind;
    public id: number;
    public nb: number;

    constructor(kind: ItemKind, id: number, nb: number) {
        this.kind = kind;
        this.id = id;
        this.nb = nb;
    }

    /** 
     *  Find an item in the inventory.
     *  @static
     *  @param {ItemKind} kind The kind of item
     *  @param {number} id The item ID
     *  @returns {Item}
     */
    static findItem(kind: ItemKind, id: number): Item {
        let item: Item;
        for (let i = 0, l = Manager.Stack.game.items.length; i < l; i++) {
            item = Manager.Stack.game.items[i];
            if (item.kind === kind && item.id === id) {
                return item;
            }
        }
        return null;
    }

    /** 
     *  Remove item from inventory.
     *  @param {number} nb Number of item to remove
     */
    remove(nb: number) {
        this.nb -= nb;
        if (this.nb <= 0) {
            Manager.Stack.game.items.splice(Manager.Stack.game.items.indexOf(
                this), 1);
        }
    }

    /** 
     *  Add item in inventory.
     *  @param {number} nb Number of item to add
     */
    add(nb: number) {
        if (this.nb === 0) {
            Manager.Stack.game.items.push(this);
        }
        this.nb += nb;
    }

    /** 
     *  Get the item informations System.
     *  @returns {System.CommonSkillItem}
     */
    getItemInformations(): System.CommonSkillItem {
        switch (this.kind) {
            case ItemKind.Item:
                return Datas.Items.get(this.id);
            case ItemKind.Weapon:
                return Datas.Weapons.get(this.id);
            case ItemKind.Armor:
                return Datas.Armors.get(this.id);
        }
    }

    /** 
     *  Modify items only if already in inventory.
     *  @param {Function} callback callback function for action
     *  @returns {boolean} Indicates if the item is already inside the
     *  inventory
     */
    modifyItems(callback: Function): boolean {
        let item: Item;
        for (let i = 0, l = Manager.Stack.game.items.length; i < l; i++) {
            item = Manager.Stack.game.items[i];
            if (item.kind === this.kind && item.id === this.id) {
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
            Manager.Stack.game.items.push(this);
        }
    }

    /** 
     *  Add the number of the item
     */
    addItems() {
        if (!this.modifyItems(function(item: Item) {item.nb += this.nb;})) {
            Manager.Stack.game.items.push(this);
        }
    }

    /** 
     *  Remove the number of the item
     */
    removeItems() {
        this.modifyItems(function(item: Item, index: number) {
            item.nb -= this.nb;
            if (item.nb <= 0) {
                Manager.Stack.game.items.splice(index, 1);
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