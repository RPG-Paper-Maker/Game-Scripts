/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas, System } from "..";
import { Enum, Utils } from "../Common";
import { StructIterator } from "../EventCommand";
import { Base } from "./Base";

/** @class
 *  A skill learned by a player.
 *  @param {number} id - The ID of the skill
 */
class ShopItem extends Base {

    public selectionItem: Enum.ItemKind;
    public itemID: System.DynamicValue;
    public weaponID: System.DynamicValue;
    public armorID: System.DynamicValue;
    public selectionPrice: boolean;
    public specificPrice: System.Cost[];
    public selectionStock: boolean;
    public specificStock: System.DynamicValue;
    public stock: number;

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Read the JSON associated to the shop item.
     *  @param {Record<string, any>} json - Json object describing the shop item
     */
    read(json: Record<string, any>) {

    }

    /** 
     *  Parse command with iterator.
     *  @param {any[]} command
     *  @param {StructIterator} iterator
     */
    parse(command: any[], iterator: StructIterator) {
        this.selectionItem = command[iterator.i++];
        switch (this.selectionItem) {
            case Enum.ItemKind.Item:
                this.itemID = System.DynamicValue.createValueCommand(command, 
                    iterator);
                break;
            case Enum.ItemKind.Weapon:
                this.weaponID = System.DynamicValue.createValueCommand(command, 
                    iterator);
                break;
            case Enum.ItemKind.Armor:
                this.armorID = System.DynamicValue.createValueCommand(command, 
                    iterator);
                break;
        }
        this.selectionPrice = Utils.numToBool(command[iterator.i++]);
        if (this.selectionPrice) {
            this.specificPrice = [];
            let cost: System.Cost;
            while (command[iterator.i] != "-") {
                cost = new System.Cost();
                cost.parse(command, iterator);
                this.specificPrice.push(cost);
            }
            iterator.i++;
        }
        this.selectionStock = Utils.numToBool(command[iterator.i++]);
        if (this.selectionStock) {
            this.specificStock = System.DynamicValue.createValueCommand(command, 
                iterator);
        }
    }

    /** 
     *  Get the item system.
     */
    getItem(): System.CommonSkillItem {
        switch (this.selectionItem) {
            case Enum.ItemKind.Item:
                return Datas.Items.get(this.itemID.getValue());
            case Enum.ItemKind.Weapon:
                return Datas.Weapons.get(this.weaponID.getValue());
            case Enum.ItemKind.Armor:
                return Datas.Armors.get(this.armorID.getValue());
        }
    }

    /** 
     *  Get the price.
     */
    getPrice(): Record<string, number> {
        return this.selectionPrice ? System.Cost.getPrice(this.specificPrice) : 
            System.Cost.getPrice(this.getItem().price);
    }

    /** 
     *  Get the initial stock.
     */
    getStock(): number {
        return this.selectionStock ? this.specificStock.getValue() : -1;
    }
}

export { ShopItem }