/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    return $datasGame.battleSystem.weaponsKind[this.type];
}
