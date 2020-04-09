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
//  CLASS HeroesDatas
//
// -------------------------------------------------------

/** @class
*   All the heroes datas.
*   @property {SystemHero[]} list List of all the heroes of the game according
*   to ID.
*/
function DatasHeroes(){
    this.loaded = false;
}

DatasHeroes.prototype = {

    /** Read the JSON file associated to heroes.
    */
    read: function() {
        if (!this.loaded) {
            RPM.openFile(this, RPM.FILE_HEROES, true, function(res){
                var json = JSON.parse(res).heroes;
                var i, l = json.length;
                this.list = new Array(l+1);

                // Sorting all the heroes according to the ID
                for (i = 0; i < l; i++){
                    var jsonHero = json[i];
                    var id = jsonHero.id;
                    var hero = new SystemHero();
                    hero.readJSON(jsonHero);
                    this.list[id] = hero;
                }

                this.loaded = true;
            });
        }
    }
}
