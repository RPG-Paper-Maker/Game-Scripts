/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
