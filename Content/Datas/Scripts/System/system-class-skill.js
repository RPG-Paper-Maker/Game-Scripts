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
//  CLASS SystemClassSkill
//
// -------------------------------------------------------

/** @class
*   A skill to learn for a specific class.
*   @property {number} id The ID of the skill.
*   @property {number} level The level to reach to learn this skill.
*/
function SystemClassSkill(){

}

SystemClassSkill.prototype = {

    /** Read the JSON associated to the class skill.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        this.id = json.id;
        this.level = json.l;
    }
}
