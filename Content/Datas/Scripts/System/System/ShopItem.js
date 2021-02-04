/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { System } from "../index.js";
import { Enum, Utils } from "../Common/index.js";
import { Base } from "./Base.js";
/** @class
 *  A skill learned by a player.
 *  @param {number} id - The ID of the skill
 */
class ShopItem extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the shop item.
     *  @param {Record<string, any>} json - Json object describing the shop item
     */
    read(json) {
    }
    /**
     *  Parse command with iterator.
     *  @param {any[]} command
     *  @param {StructIterator} iterator
     */
    parse(command, iterator) {
        this.selectionItem = command[iterator.i++];
        switch (this.selectionItem) {
            case Enum.ItemKind.Item:
                this.itemID = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case Enum.ItemKind.Weapon:
                this.weaponID = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case Enum.ItemKind.Armor:
                this.armorID = System.DynamicValue.createValueCommand(command, iterator);
                break;
        }
        this.selectionPrice = Utils.numToBool(command[iterator.i++]);
        if (this.selectionPrice) {
            this.specificPrice = [];
            let cost;
            while (command[iterator.i] != "-") {
                cost = new System.Cost();
                cost.parse(command, iterator);
                this.specificPrice.push(cost);
            }
            iterator.i++;
        }
        this.selectionStock = Utils.numToBool(command[iterator.i++]);
        if (this.selectionStock) {
            this.specificStock = System.DynamicValue.createValueCommand(command, iterator);
        }
    }
}
export { ShopItem };
