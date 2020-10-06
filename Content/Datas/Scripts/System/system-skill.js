/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A skill of the game
*   @extends SystemCommonSkillItem
*   @property {boolean} hasType Indicate if the skill has a type
*   @property {string} name The name of the skill
*   @param {Object} [json=undefined] Json object describing the skill
*/
class SystemSkill extends SystemCommonSkillItem
{
    constructor(json)
    {
        super();

        this.hasType = false;
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the skill
    *   @param {Object} json Json object describing the skill
    */
    read(json)
    {
        super.read(json);
    }
    
    // -------------------------------------------------------
    /** Get the string representation of costs
    *   @returns {string}
    */
    getCostString()
    {
        let result = RPM.STRING_EMPTY;
        for (let i = 0, l = this.costs.length; i < l; i++)
        {
            result += this.costs[i].toString();
            if (i === l - 1)
            {
                result += RPM.STRING_SPACE;
            }
        }
        return result;
    }    
}