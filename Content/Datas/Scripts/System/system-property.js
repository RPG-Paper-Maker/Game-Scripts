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
//  CLASS SystemProperty
//
// -------------------------------------------------------

/** @class
*   A property of an object.
*   @property {SystemValue} initialValue The initial value of the property.
*/
function SystemProperty() {

}

SystemProperty.prototype = {

    /** Read the JSON associated to the property.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        this.id = json.id
        this.initialValue = SystemValue.readOrNone(json.iv);
    }
}
