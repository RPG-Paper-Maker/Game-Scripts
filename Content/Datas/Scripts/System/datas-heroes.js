/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

}

DatasHeroes.prototype = {

    /** Read the JSON file associated to heroes.
    */
    read: function(){
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
        });
    }
}
