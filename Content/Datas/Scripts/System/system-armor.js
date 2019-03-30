/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
