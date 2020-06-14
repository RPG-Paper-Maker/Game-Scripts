/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    return RPM.datasGame.system.itemsTypes[this.type];
}
