/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Reaction } from "./Reaction";

/** @class
*   A common reaction
*   @extends System.Reaction
*   @property {Parameter[]} parameters
*   @param {Object} [json=undefined] Json object describing the common reaction
*/
class CommonReaction extends Reaction
{
    constructor(json)
    {
        super();
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the common reaction
    *   @param {Object} json Json object describing the common reaction
    */
    read(json)
    {
        super.read(json);

        this.parameters = Parameter.readParameters(json);
    }
}
