/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
