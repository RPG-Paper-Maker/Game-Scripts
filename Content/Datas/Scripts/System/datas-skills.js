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
//  CLASS DatasSkills
//
// -------------------------------------------------------

/** @class
*   All the skills datas.
*   @property {SystemSkill[]} list List of all the skills of the game according
*   to ID.
*/
function DatasSkills(){
    this.read();
}

DatasSkills.prototype = {

    /** Read the JSON file associated to skills.
    */
    read: function(){
        RPM.openFile(this, RPM.FILE_SKILLS, true, function(res){
            var json = JSON.parse(res)["skills"];
            var i, l = json.length;
            this.list = new Array(l+1);

            // Sorting all the skills according to the ID
            for (var i = 0; i < l; i++){
                var jsonSkill = json[i];
                var id = jsonSkill["id"];
                var skill = new SystemSkill();
                skill.readJSON(jsonSkill);
                this.list[id] = skill;
            }
        });
    }
}
