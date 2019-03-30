/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    readJSON: function(json){
        this.sc = json.sc;
    }
}
