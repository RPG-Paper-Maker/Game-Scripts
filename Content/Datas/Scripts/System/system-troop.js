/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

// -------------------------------------------------------
//
//  CLASS SystemTroop
//
// -------------------------------------------------------

/** @class
*   A troop of the game.
*   @property {Object[]} list of the monsters (ids,level).
*/
function SystemTroop(){

}

SystemTroop.prototype = {

    /** Read the JSON associated to the troop.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        var jsonList = json.l;
        var i, l = jsonList.length;
        this.list = new Array(l);
        for (i = 0; i < l; i++){
            var jsonMonster = jsonList[i];
            this.list[i] = {
                id: jsonMonster.id,
                level: jsonMonster.l
            };
        }
    }
}
