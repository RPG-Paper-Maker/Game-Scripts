/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {BaseSystem} from ".";

/** @class
 *   A skill to learn for a specific class
 *   @property {number} id The ID of the skill
 *   @property {number} level The level to reach to learn this skill
 *   @param {Object} [json=undefined] Json object describing the class skill
 */
export class ClassSkill extends BaseSystem {

    id: number;
    level: number;

    constructor(json) {
        super(json);
    }

    public setup() {
        this.id = 0;
        this.level = 0;
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the class skill
     *   @param {Object} json Json object describing the class skill
     */
    read(json) {
        this.id = json.id;
        this.level = json.l;
    }
}
