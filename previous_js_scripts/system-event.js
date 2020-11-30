/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   An event that can be called
*   @property {SystemParameters[]} parameters The parameters list
*   @param {Object} [json=undefined] json object describing the event
*/
class SystemEvent
{
    constructor(json)
    {
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the event
    *   @param {Object} json Json object describing the event
    */
    read(json)
    {
        this.parameters = Parameter.readParameters(json);
    }
}
