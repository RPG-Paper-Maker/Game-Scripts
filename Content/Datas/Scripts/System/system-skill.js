/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

// -------------------------------------------------------
//
//  CLASS SystemSkill
//
// -------------------------------------------------------

/** @class
*   A skill of the game.
*   @property {string} name The name of the skill.
*/
function SystemSkill(){
    SystemCommonSkillItem.call(this);

    this.hasType = false;
}

SystemSkill.prototype = Object.create(SystemCommonSkillItem.prototype);

// -------------------------------------------------------

SystemSkill.prototype.readJSON = function(json) {
    SystemCommonSkillItem.prototype.readJSON.call(this, json);
}

// -------------------------------------------------------

SystemSkill.prototype.getCostString = function() {
    var i, l, result;

    result = "";
    for (i = 0, l = this.costs.length; i < l; i++) {
        result += this.costs[i].toString();
        if (i === l - 1) {
            result += " ";
        }
    }

    return result;
}
