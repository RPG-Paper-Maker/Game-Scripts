/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {Icon} from ".";

/** @class
 *   A currency of the game
 *   @extends SystemIcon
 *   @param {Object} [json=undefined] Json object describing the currency
 */
export class Currency extends Icon {
    constructor(json) {
        super(json);
    }
}
