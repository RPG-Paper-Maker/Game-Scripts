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
//  CLASS SystemLang
//
// -------------------------------------------------------

/** @class
*/
function SystemLang() {
    this.names = [];
}

SystemLang.EMPTY_NAMES = {
    names: ["", ""]
}

SystemLang.prototype = {

    /** Read the JSON associated to the lang.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        this.names = json.names;

        if (this.names) {
            this.name = this.names[1];
        } else {
            this.name = json[1];
        }
    },

    // -------------------------------------------------------

    getCommand: function(command, i) {
        var id, name;

        id = command[i++];
        name = command[i++];

        this.names[id] = name;

        if (id === 1) {
            this.name = this.names[id];
        }

        return i;
    }
}
