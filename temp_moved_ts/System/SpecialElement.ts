/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {BaseSystem} from ".";
import {RPM} from "../Core";

/** @class
 *   A special element (autotile, wall, object3D, mountain) of the game
 *   @property {number} pictureID The picture ID of the special element
 *   @param {Object} [json=undefined] Json object describing the special element
 */
export class SpecialElement extends BaseSystem {

    pictureID: number;

    constructor(json) {
        super(json);
    }

    public setup() {
        this.pictureID = 0;
    }


    // -------------------------------------------------------
    /** Read the JSON associated to the special element
     *   @param {Object} json Json object describing the special element
     */
    read(json) {
        this.pictureID = RPM.defaultValue(json.pic, -1);
    }
}
