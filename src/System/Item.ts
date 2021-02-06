/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { CommonSkillItem } from "./CommonSkillItem";
import { Datas } from "../index";
import { Enum } from "../Common";

/** @class
 *  An item of the game.
 *  @extends CommonSkillItem
 *  @param {Record<string, any>} - [json=undefined] Json object describing the item
 */
class Item extends CommonSkillItem {

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Read the JSON associated to the item.
     *  @param {Record<string, any>} - json Json object describing the item
     */
    read(json: Record<string, any>) {
        super.read(json);
    }

    /** Get the item type.
     *  @returns {string}
     */
    getStringType(): string {
        return Datas.Systems.getItemType(this.type);
    }

    /** 
     *  Get the item kind.
     *  @returns {Enum.ItemKind}
     */
    getKind(): Enum.ItemKind {
        return Enum.ItemKind.Item;
    }
}

export { Item }