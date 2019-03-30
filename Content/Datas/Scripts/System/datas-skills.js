/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
