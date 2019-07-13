/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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
    readJSON: function(json){
        this.sc = json.sc;
    }
}
