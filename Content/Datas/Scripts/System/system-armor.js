/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   An armor of the game
*   @extends SystemCommonSkillItem
*   @property {boolean} hasEffect Indicate if the armor has an effect
*   @property {string} name The name of the armor
*   @property {number} idType The kind of armor (ID)
*   @param {Object} [json=undefined] Json object describing the armor
*/
class SystemArmor extends SystemCommonSkillItem
{
    constructor(json)
    {
        super();

        this.hasEffect = false;
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the armor
    *   @param {Object} json Json object describing the armor
    */
    read(json)
    {
        super.read(json);
    }
    
    // -------------------------------------------------------
    /** Get the armor type
    *   @returns {SystemWeaponArmorKind}
    */
    getType()
    {
        return RPM.datasGame.battleSystem.armorsKind[this.type];
    }
}
