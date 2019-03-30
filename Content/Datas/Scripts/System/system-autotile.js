/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
        this.pictureID = json.pic;
    }
}
