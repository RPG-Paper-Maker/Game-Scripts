/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *   A property of an object
 *   @property {number} id The ID of the property
 *   @property {SystemValue} initialValue The initial value of the property
 *   @param {Object} [json=undefined] Json object describing the property
 */
class SystemProperty {
    constructor(json) {
        if (json) {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the property
     *   @param {Object} json Json object describing the property
     */
    read(json) {
        this.id = json.id;
        this.initialValue = DynamicValue.readOrNone(json.iv);
    }
}
