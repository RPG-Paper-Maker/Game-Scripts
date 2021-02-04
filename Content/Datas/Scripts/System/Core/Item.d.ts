import { Enum } from "../Common/index.js";
import ItemKind = Enum.ItemKind;
import { System } from "../index.js";
/** @class
 *  An item in the inventory.
 *  @param {ItemKind} kind - Kind of item (item, weapon, or armor)
 *  @param {number} id - The ID of the item
 *  @param {number} nb - The occurence of the item in the inventory
 */
declare class Item {
    kind: ItemKind;
    system: System.CommonSkillItem;
    nb: number;
    shop: System.ShopItem;
    constructor(kind: ItemKind, id: number, nb: number, shop?: System.ShopItem);
    /**
     *  Find an item in the inventory.
     *  @static
     *  @param {ItemKind} kind - The kind of item
     *  @param {number} id - The item ID
     *  @returns {Item}
     */
    static findItem(kind: ItemKind, id: number): Item;
    /**
     *  Remove item from inventory.
     *  @param {number} nb - Number of item to remove
     */
    remove(nb: number): void;
    /**
     *  Add item in inventory.
     *  @param {number} nb - Number of item to add
     */
    add(nb: number): void;
    /**
     *  Modify items only if already in inventory.
     *  @param {Function} callback - callback function for action
     *  @returns {boolean} Indicates if the item is already inside the
     *  inventory
     */
    modifyItems(callback: Function): boolean;
    /**
     *  Modify the number of the item
     */
    equalItems(): void;
    /**
     *  Add the number of the item
     */
    addItems(): void;
    /**
     *  Remove the number of the item
     */
    removeItems(): void;
    /**
     *  Multiply the number of the item
     */
    multItems(): void;
    /**
     *  Modify the number of the item
     */
    divItems(): void;
    /**
     *  Modulo the number of the item
     */
    moduloItems(): void;
    /**
     *  Use one item and check if there is at least one item left
     * @returns {boolean}
     */
    use(): boolean;
}
export { Item };
