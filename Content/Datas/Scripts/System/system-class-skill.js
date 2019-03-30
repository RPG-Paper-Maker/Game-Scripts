/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
