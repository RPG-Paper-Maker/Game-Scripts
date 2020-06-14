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
//  CLASS SystemWeapon : SystemArmor
//
//  A weapon of the game.
//
// -------------------------------------------------------

/** @class
*   A weapon of the game.
*   @extends SystemArmor
*/
function SystemWeapon() {
    SystemCommonSkillItem.call(this);
}


SystemWeapon.prototype = Object.create(SystemCommonSkillItem.prototype);

// -------------------------------------------------------

SystemWeapon.prototype.readJSON = function(json) {
    SystemCommonSkillItem.prototype.readJSON.call(this, json);
}

// -------------------------------------------------------

SystemWeapon.prototype.getType = function() {
    return RPM.datasGame.battleSystem.weaponsKind[this.type];
}
