/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { CommonSkillItem } from "./CommonSkillItem";
import { WeaponArmorKind } from "./WeaponArmorKind";
import { Datas } from "..";

/** @class
 *  An armor of the game.
 *  @extends System.CommonSkillItem
 *  @param {Record<string, any>} [json=undefined] Json object describing the 
 *  armor
 */
class Armor extends CommonSkillItem {

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Read the JSON associated to the armor.
     *  @param {Record<string, any>} json Json object describing the armor
     */
    read(json: Record<string, any>) {
        super.read(json);
    }

    /** Get the armor type.
     *  @returns {System.WeaponArmorKind}
     */
    getType(): WeaponArmorKind {
        return Datas.BattleSystems.getArmorKind(this.type);
    }
}

export { Armor }
