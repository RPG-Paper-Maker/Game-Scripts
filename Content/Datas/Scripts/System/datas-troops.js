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
//  CLASS DatasTroops
//
// -------------------------------------------------------

/** @class
*   All the troops datas.
*   @property {SystemTroop[]} list List of all the troops of the game according
*   to ID.
*/
function DatasTroops(){
    this.read();
}

DatasTroops.prototype = {

    /** Read the JSON file associated to troops.
    */
    read: function(){
        RPM.openFile(this, RPM.FILE_TROOPS, true, function(res){
            var json = JSON.parse(res).troops;
            var i, l = json.length;
            this.list = new Array(l+1);

            // Sorting all the troops according to the ID
            for (i = 0; i < l; i++){
                var jsonTroop = json[i];
                var id = jsonTroop.id;
                var troop = new SystemTroop();
                troop.readJSON(jsonTroop);
                this.list[id] = troop;
            }
        });
    }
}
