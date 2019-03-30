/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

// -------------------------------------------------------
//
//  CLASS DatasMonsters
//
// -------------------------------------------------------

/** @class
*   All the monsters datas.
*   @property {SystemMonster[]} list List of all the monsters of the game
*   according to ID.
*/
function DatasMonsters(){

}

DatasMonsters.prototype = {

    /** Read the JSON file associated to monsters.
    */
    read: function(){
        RPM.openFile(this, RPM.FILE_MONSTERS, true, function(res){
            var json = JSON.parse(res).monsters;
            var i, l = json.length;
            this.list = new Array(l+1);

            // Sorting all the monsters according to the ID
            for (i = 0; i < l; i++){
                var jsonMonster = json[i];
                var id = jsonMonster.id;
                var monster = new SystemMonster();
                monster.readJSON(jsonMonster);
                this.list[id] = monster;
            }
        });
    }
}
