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
//  CLASS SystemAutotile
//
// -------------------------------------------------------

/** @class
*   An autotile configuration.
*   @property {number} picutreID The picture ID of the autotile.
*/
function SystemAutotile(){

}

SystemAutotile.prototype = {

    /** Read the JSON associated to the autotile.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        this.pictureID = typeof json.pic === 'undefined' ? -1 : json.pic;
    }
}
