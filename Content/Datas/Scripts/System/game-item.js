/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

// -------------------------------------------------------
//
//  CLASS GameItem
//
// -------------------------------------------------------

/** @class
*   An item in the inventory.
*   @property {ItemKind} k Kind of item (item, weapon, or armor).
*   @property {number} id The ID of the item.
*   @property {number} nb The occurence of the item in the inventory.
*   @param {ItemKind} kind Kind of item (item, weapon, or armor).
*   @param {number} id The ID of the item.
*   @param {number} nb The occurence of the item in the inventory.
*/
function GameItem(kind, id, nb){
    this.k = kind;
    this.id = id;
    this.nb = nb;
}

GameItem.prototype = {

    /** Get the item informations system.
    *   @returns {SystemItem|SystemWeapon|SystemArmor}
    */
    getItemInformations: function(){
        switch (this.k){
        case ItemKind.Item:
            return $datasGame.items.list[this.id];
        case ItemKind.Weapon:
            return $datasGame.weapons.list[this.id];
        case ItemKind.Armor:
            return $datasGame.armors.list[this.id];
        }

        return null;
    },

    /** Modify items only if already in inventory
    *   @param {function} callback callback function for action.
    *   @returns {boolean} Indicates if the item is already inside the
    *   inventory.
    */
    modifyItems: function(callback) {
        var i, l = $game.items.length;
        for (i = 0; i < l; i++){
            var item = $game.items[i];
            if (item.k === this.k && item.id === this.id) {
                // If the item already is in the inventory...
                callback.call(this, item, i);
                return true;
            }
        }

        return false;
    },

    // -------------------------------------------------------

    /** Modify the number of the item.
    */
    equalItems: function() {
        var alreadyInInventory = this.modifyItems(function(item, index) {
                item.nb = this.nb;
            });
        if (!alreadyInInventory) {
            $game.items.push(this);
        }
    },

    // -------------------------------------------------------

    /** Add the number of the item.
    */
    addItems: function() {
        var alreadyInInventory = this.modifyItems(function(item, index) {
                item.nb += this.nb;
            });
        if (!alreadyInInventory) {
            $game.items.push(this);
        }
    },

    // -------------------------------------------------------

    /** Remove the number of the item.
    */
    removeItems: function() {
        var alreadyInInventory = this.modifyItems(function(item, index) {
                item.nb -= this.nb;
                if (item.nb <= 0) {
                    $game.items.splice(index, 1);
                }
            });
    },

    // -------------------------------------------------------

    /** Multiply the number of the item.
    */
    multItems: function() {
        this.modifyItems(function(item, index) {
                item.nb *= this.nb;
            });
    },

    // -------------------------------------------------------

    /** Modify the number of the item.
    */
    divItems: function() {
        this.modifyItems(function(item, index) {
                item.nb /= this.nb;
            });
    },

    // -------------------------------------------------------

    /** Modulo the number of the item.
    */
    moduloItems: function() {
        this.modifyItems(function(item, index) {
                item.nb %= this.nb;
            });
    },

    // -------------------------------------------------------

    use: function() {
        this.nb--;

        return this.nb > 0;
    }
}
