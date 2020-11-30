/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
// TODO : fix the System stuff
import {CommonSkillItem} from ".";
import {RPM} from "../core";

/** @class
 *   An armor of the game
 *   @extends SystemCommonSkillItem
 *   @property {boolean} hasEffect Indicate if the armor has an effect
 *   @property {string} name The name of the armor
 *   @property {number} idType The kind of armor (ID)
 *   @param {Object} [json=undefined] Json object describing the armor
 */
export class Armor extends CommonSkillItem {
    hasEffect: boolean;
    idType: number;

    constructor(json) {
        super(json);
    }

    public setup() {
        super.setup();
        this.hasEffect = false;
        this.idType = 0;
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the armor
     *   @param {Object} json Json object describing the armor
     */
    read(json) {
        super.read(json);
    }

    // -------------------------------------------------------
    /** Get the armor type
     *   @returns {SystemWeaponArmorKind}
     */
    getType() {
        return RPM.datasGame.battleSystem.armorsKind[this.type];
    }
}
