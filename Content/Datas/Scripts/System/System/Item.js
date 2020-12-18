/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { CommonSkillItem } from "./CommonSkillItem";
import { Datas } from "..";
/** @class
 *  An item of the game.
 *  @extends CommonSkillItem
 *  @param {Record<string, any>} [json=undefined] Json object describing the item
 */
class Item extends CommonSkillItem {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the item.
     *  @param {Record<string, any>} json Json object describing the item
     */
    read(json) {
        super.read(json);
    }
    /** Get the item type.
     *  @returns {string}
     */
    getType() {
        return Datas.Systems.getItemType(this.type);
    }
}
export { Item };
