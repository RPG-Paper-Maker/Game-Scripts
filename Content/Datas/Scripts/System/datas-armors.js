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
//  CLASS ARMORSDATAS
//
// -------------------------------------------------------

/** @class
*   All the armors datas.
*   @property {SystemArmor[]} list List of all the armors of the game according
*   to ID.
*/
function DatasArmors(){
    this.read();
}

DatasArmors.prototype = {

    /** Read the JSON file associated to armors.
    */
    read: function(){
        RPM.openFile(this, RPM.FILE_ARMORS, true, function(res){
            var json = JSON.parse(res)["armors"];
            var i, l = json.length;
            this.list = new Array(l+1);

            // Sorting all the armors according to the ID
            for (i = 0; i < l; i++){
                var jsonArmor = json[i];
                var id = jsonArmor["id"];
                var armor = new SystemArmor();
                armor.readJSON(jsonArmor);
                this.list[id] = armor;
            }
        });
    }
}
