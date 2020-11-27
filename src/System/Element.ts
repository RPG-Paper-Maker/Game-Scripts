/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {DynamicValue, Icon} from ".";
import {RPM} from "../core";

/** @class
 *   An element of the game
 *   @property {SystemValue[]} efficiency The efficiency list
 *   @param {Object} [json=undefined] Json object describing the element
 */
export class Element extends Icon {

    efficiency: DynamicValue[];

    constructor(json) {
        super(json);
    }

    public setup() {
        super.setup();
        this.efficiency = [];
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the element
     *   @param {Object} json Json object describing the element
     */
    read(json) {
        super.read(json);

        this.efficiency = RPM.readJSONSystemListHash(json.e, DynamicValue);
    }
}