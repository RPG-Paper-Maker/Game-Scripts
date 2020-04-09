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
