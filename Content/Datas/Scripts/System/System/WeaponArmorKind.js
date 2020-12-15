/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Translatable } from "./Translatable.js";
/** @class
 *  A weapon/armor kind of the game.
 *  @property {string} name The name of the weapon / armor kind
 *  @property {boolean[]} equipments List of booleans indicating which equipment
 *  is ok
 *  @param {Record<string, any>} [json=undefined] Json object describing the
 *  weapon / armor kind
 */
class WeaponArmorKind extends Translatable {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the weapon / armor kind.
     *  @param {Record<string, any>} json Json object describing the weapon /
     *  armor kind
     */
    read(json) {
        super.read(json);
        this.equipments = json.equipment;
        this.equipments.unshift(false);
    }
}
export { WeaponArmorKind };
