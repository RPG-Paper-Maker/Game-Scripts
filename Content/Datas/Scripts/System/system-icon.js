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
//  CLASS SystemIcon
//
// -------------------------------------------------------

/** @class
*/
function SystemIcon() {

}

SystemIcon.prototype = {

    /** Read the JSON associated to the currency.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        this.name = json.names[1];
        this.pictureID = json.pid;
    }
}
