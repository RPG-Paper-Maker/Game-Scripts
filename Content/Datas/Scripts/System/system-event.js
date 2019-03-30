/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

// -------------------------------------------------------
//
//  CLASS SystemEvent
//
// -------------------------------------------------------

/** @class
*   An event that can be called.
*   @property {SystemParameters[]} parameters A list of parameters.
*/
function SystemEvent(){

}

SystemEvent.prototype = {

    /** Read the JSON associated to the event.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        this.parameters = SystemParameter.readParameters(json);
    }
}
