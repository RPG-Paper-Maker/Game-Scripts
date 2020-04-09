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
//  CLASS SystemSpecialElement
//
// -------------------------------------------------------

/** @class
*   A special element (autotile, wall, object3D, mountain) of the game.
*   @property {number} picutreID The picture ID of the wall.
*/
function SystemSpecialElement() {

}

SystemSpecialElement.prototype = {

    /** Read the JSON associated to the special element.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        this.pictureID = typeof json.pic === 'undefined' ? -1 : json.pic;
    }
}
