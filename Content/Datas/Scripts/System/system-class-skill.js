/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A skill to learn for a specific class
*   @property {number} id The ID of the skill
*   @property {number} level The level to reach to learn this skill
*/
class SystemClassSkill
{
    constructor(json)
    {
        if (json)
        {
            this.read(json);
        }
    }

    /** Read the JSON associated to the class skill.
    *   @param {Object} json Json object describing the object.
    */
    read(json)
    {
        this.id = json.id;
        this.level = json.l;
    }
}
