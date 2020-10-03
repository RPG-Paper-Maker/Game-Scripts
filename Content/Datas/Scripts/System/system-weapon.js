/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A weapon of the game
*   @extends SystemArmor
*/
class SystemWeapon extends SystemCommonSkillItem
{
    constructor()
    {
        super();
    }

    /** Read the JSON associated to the weapon
    *   @param {Object} json Json object describing the weapon
    */
    read(json)
    {
        super.read(json);
    }
    
    // -------------------------------------------------------
    /** Get the weapon kind
    *   @returns {SystemWeaponArmorKind}
    */
    getType()
    {
        return RPM.datasGame.battleSystem.weaponsKind[this.type];
    }
}