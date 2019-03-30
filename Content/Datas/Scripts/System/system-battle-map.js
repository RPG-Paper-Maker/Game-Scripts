/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

// -------------------------------------------------------
//
//  CLASS SystemBattleMap
//
// -------------------------------------------------------

/** @class
*   A battle map of the game.
*/
function SystemBattleMap(idMap, position) {
    this.idMap = idMap;
    this.position = position;
}

SystemBattleMap.prototype = {

    /** Read the JSON associated to the element.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        this.idMap = json.idm;
        this.position = json.p;
    }
}
