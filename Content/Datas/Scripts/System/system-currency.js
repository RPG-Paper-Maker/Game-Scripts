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
//  CLASS SystemCurrency
//
// -------------------------------------------------------

/** @class
*   A currency of the game.
*   @property {string} name The name of the currency.
*/
function SystemCurrency() {
    SystemIcon.call(this);
}

SystemCurrency.prototype = {

    /** Read the JSON associated to the currency.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        SystemIcon.prototype.readJSON.call(this, json);
    }
}
