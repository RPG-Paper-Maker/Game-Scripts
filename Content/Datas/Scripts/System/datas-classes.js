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
//  CLASS DatasClasses
//
// -------------------------------------------------------

/** @class
*   All the classes datas.
*   @property {SystemClass[]} list List of all the classes of the game according
*   to ID.
*/
function DatasClasses() {
    this.loaded = false;
    this.read();
}

DatasClasses.prototype = {

    /** Read the JSON file associated to classes.
    */
    read: function(){
        RPM.openFile(this, RPM.FILE_CLASSES, true, function(res){
            var json = JSON.parse(res).classes;
            var i, l = json.length;
            this.list = new Array(l+1);

            // Sorting all the classes according to the ID
            for (i = 0; i < l; i++){
                var jsonClass = json[i];
                var id = jsonClass.id;
                var c = new SystemClass();
                c.readJSON(jsonClass);
                this.list[id] = c;
            }
            this.loaded = true;

            $datasGame.heroes.read();
            $datasGame.monsters.read();
        });
    }
}
