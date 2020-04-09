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
//  CLASS SystemArmor
//
// -------------------------------------------------------

/** @class
*   An armor of the game.
*   @property {string} name The name of the armor.
*   @property {number} idType The kind of armor (ID).
*/
function SystemArmor() {
    SystemCommonSkillItem.call(this);

    this.hasEffect = false;
}

SystemArmor.prototype = Object.create(SystemCommonSkillItem.prototype);

// -------------------------------------------------------

SystemArmor.prototype.readJSON = function(json) {
    SystemCommonSkillItem.prototype.readJSON.call(this, json);
}

// -------------------------------------------------------

SystemArmor.prototype.getType = function() {
    return $datasGame.battleSystem.armorsKind[this.type];
}
