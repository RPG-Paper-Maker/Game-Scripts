/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

// -------------------------------------------------------
//
//  CLASS SystemLang
//
// -------------------------------------------------------

/** @class
*/
function SystemLang() {

}

SystemLang.prototype = {

    /** Read the JSON associated to the lang.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        var names = json.names;

        if (names) {
            this.name = names[1];
        } else {
            this.name = json[1];
        }
    }
}
