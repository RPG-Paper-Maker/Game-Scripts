/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   An item in the inventory
*   @property {ItemKind} k Kind of item (item, weapon, or armor)
*   @property {number} id The ID of the item
*   @property {number} nb The occurence of the item in the inventory
*   @param {ItemKind} kind Kind of item (item, weapon, or armor)
*   @param {number} id The ID of the item
*   @param {number} nb The occurence of the item in the inventory
*/
class GameItem
{
    constructor(kind, id, nb)
    {
        this.k = kind;
        this.id = id;
        this.nb = nb;
    }

    // -------------------------------------------------------
    /** Find an item in the inventory
    *   @static
    *   @param {ItemKind} kind The kind of item
    *   @param {number} id The item ID
    *   @returns {Object}
    */
    static findItem(kind, id)
    {
        let item;
        for (let i = 0, l = RPM.game.items.length; i < l; i++)
        {
            item = RPM.game.items[i];
            if (item.k === kind && item.id === id)
            {
                return item;
            }
        }
        return null;
    }

    // -------------------------------------------------------
    /** Remove item from inventory
    *   @param {number} nb Number of item to remove
    *   @returns {Object}
    */
    remove(nb)
    {
        this.nb -= nb;
        if (this.nb <= 0)
        {
            RPM.game.items.splice(RPM.game.items.indexOf(this), 1);
        }
    }

    // -------------------------------------------------------
    /** Add item in inventory
    *   @param {number} nb Number of item to add
    *   @returns {Object}
    */
    add(nb)
    {
        if (this.nb === 0)
        {
            RPM.game.items.push(this);
        }
        this.nb += nb;
    }

    // -------------------------------------------------------
    /** Get the item informations System
    *   @returns {SystemCommonSkillItem}
    */
    getItemInformations()
    {
        switch (this.k)
        {
        case ItemKind.Item:
            return RPM.datasGame.items.list[this.id];
        case ItemKind.Weapon:
            return RPM.datasGame.weapons.list[this.id];
        case ItemKind.Armor:
            return RPM.datasGame.armors.list[this.id];
        }
        return null;
    }

    // -------------------------------------------------------
    /** Modify items only if already in inventory
    *   @param {function} callback callback function for action
    *   @returns {boolean} Indicates if the item is already inside the
    *   inventory
    */
    modifyItems(callback)
    {
        let item;
        for (let i = 0, l = RPM.game.items.length; i < l; i++)
        {
            item = RPM.game.items[i];
            if (item.k === this.k && item.id === this.id)
            {
                // If the item already is in the inventory...
                callback.call(this, item, i);
                return true;
            }
        }
        return false;
    }

    // -------------------------------------------------------
    /** Modify the number of the item
    */
    equalItems()
    {
        if (!this.modifyItems(function(item, index) {item.nb = this.nb;}))
        {
            RPM.game.items.push(this);
        }
    }

    // -------------------------------------------------------
    /** Add the number of the item
    */
    addItems()
    {
        if (!this.modifyItems(function(item, index) {item.nb += this.nb;}))
        {
            RPM.game.items.push(this);
        }
    }

    // -------------------------------------------------------
    /** Remove the number of the item
    */
    removeItems()
    {
        this.modifyItems(function(item, index) {
            item.nb -= this.nb;
            if (item.nb <= 0) {
                RPM.game.items.splice(index, 1);
            }
        });
    }

    // -------------------------------------------------------
    /** Multiply the number of the item
    */
    multItems()
    {
        this.modifyItems(function(item, index) {
            item.nb *= this.nb;
        });
    }

    // -------------------------------------------------------
    /** Modify the number of the item
    */
    divItems()
    {
        this.modifyItems(function(item, index) {
            item.nb /= this.nb;
        });
    }

    // -------------------------------------------------------
    /** Modulo the number of the item
    */
    moduloItems()
    {
        this.modifyItems(function(item, index) {
            item.nb %= this.nb;
        });
    }

    // -------------------------------------------------------
    /** Use one item and check if there is at least one item left
    *   @returns {boolean}
    */
    use()
    {
        return --this.nb > 0;
    }
}