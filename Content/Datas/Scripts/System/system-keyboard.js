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
//  CLASS SystemKeyBoard
//
// -------------------------------------------------------

/** @class
*   A key shortcut of the game.
*   @property {number[][]} sc The shortcut values.
*/
function SystemKeyBoard(){

}

SystemKeyBoard.prototype = {

    /** Read the JSON associated to the key.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        SystemLang.prototype.readJSON.call(this, json);

        this.id = json.id;
        this.sc = json.sc;
    },

    // -------------------------------------------------------

    toString: function() {
        var i, j, l, ll, stringList, subList, originalSubList;

        l = this.sc.length;
        stringList = new Array(l);
        for (i = 0; i < l; i++) {
            originalSubList = this.sc[i];
            ll = originalSubList.length;
            subList = new Array(ll);
            for (j = 0; j < ll; j++) {
                subList[j] = KeyEvent.getKeyString(originalSubList[j]);
            }
            stringList[i] = subList.join(" + ");
        }

        return stringList.join(" | ");
    }
}
