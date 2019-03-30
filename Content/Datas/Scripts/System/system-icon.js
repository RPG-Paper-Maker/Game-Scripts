/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
