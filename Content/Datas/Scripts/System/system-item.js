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
//  CLASS SystemItem
//
// -------------------------------------------------------

/** @class
*   An item of the game.
*   @property {string} name The name of the item.
*   @property {number} idType The id of the item's type.
*   @property {boolean} consumable Indicate if the item is consumable.
*/
function SystemItem() {
    SystemCommonSkillItem.call(this);
}

SystemItem.prototype = Object.create(SystemCommonSkillItem.prototype);

// -------------------------------------------------------

SystemItem.prototype.readJSON = function(json) {
    SystemCommonSkillItem.prototype.readJSON.call(this, json);
}

// -------------------------------------------------------

SystemItem.prototype.getType = function() {
    return $datasGame.system.itemsTypes[this.type];
}
