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
//  CLASS SystemBattleMap
//
// -------------------------------------------------------

/** @class
*   A battle map of the game.
*/
function SystemBattleMap(cameraProperties, idMap, position) {
    this.idMap = idMap;
    this.position = position;
}

SystemBattleMap.prototype = {

    /** Read the JSON associated to the element.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        this.cameraPropertiesID = SystemValue.readOrDefaultDatabase(json.cpi, 1);
        this.idMap = json.idm;
        this.position = json.p;
    }
}
