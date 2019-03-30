/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

// -------------------------------------------------------
//
//  CLASS SystemElement
//
// -------------------------------------------------------

/** @class
*   An element of the game.
*   @property {string} name The name of the element.
*   @property {number[]} efficiency The list of efficiency according.
*   to each element.
*/
function SystemElement(){

}

SystemElement.prototype = {

    /** Read the JSON associated to the element.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        this.name = json.names[1];
        this.efficiency = json.efficiency;
    }
}
