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
//  CLASS SystemElement
//
// -------------------------------------------------------

/** @class
*   An element of the game.
*   @property {string} name The name of the element.
*/
function SystemElement() {

}

SystemElement.prototype = Object.create(SystemIcon.prototype);

// -------------------------------------------------------

SystemElement.prototype.readJSON = function(json) {
    SystemIcon.prototype.readJSON.call(this, json);

    var i, l, jsonList, jsonElement, value;

    jsonList = json.e;
    this.efficiency = [];

    for (i = 0, l = jsonList.length; i < l; i++) {
        jsonElement = jsonList[i];
        value = new SystemValue();
        value.read(jsonElement[RPM.JSON_VALUE]);
        this.efficiency[jsonElement[RPM.JSON_KEY]] = value;
    }
}
