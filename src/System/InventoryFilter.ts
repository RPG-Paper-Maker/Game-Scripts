/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas, System } from "../index";
import { Enum, Interpreter, Utils } from "../Common";
import { Translatable } from "./Translatable";
import { Item } from "../Core";

/** @class
 *  An inventory filter used to filter inventory or shops items.
 *  @extends Translatable
 *  @param {Record<string, any>} [json=undefined] - Json object describing the item
 */
class InventoryFilter extends Translatable {

    public kind: Enum.InventoryFilterKind;
    public itemTypeID: System.DynamicValue;
    public script: string;

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Read the JSON associated to the inventory filter.
     *  @param {Record<string, any>} - json Json object describing the 
     *  inventory filter
     */
    read(json: Record<string, any>) {
        super.read(json);
        this.kind = Utils.defaultValue(json.kind, Enum.InventoryFilterKind.All);
        switch (this.kind) {
            case Enum.InventoryFilterKind.Custom:
                this.itemTypeID = System.DynamicValue.readOrDefaultDatabase(json
                    .itemTypeID);
                break;
            case Enum.InventoryFilterKind.Script:
                this.script = Utils.defaultValue(json.script, "");
                break;
        }
    }

    /** 
     *  Get the filter function taking the item to filter and return true if 
     *  pass filter.
     *  @returns {(item: Core.Item) => boolean}
     */
    getFilter(): (item: Item) => boolean {
        switch (this.kind) {
            case Enum.InventoryFilterKind.All:
                return (item: Item): boolean => {
                    return true;
                };
            case Enum.InventoryFilterKind.Consumables:
                return (item: Item): boolean => {
                    return item.system.consumable;
                };
            case Enum.InventoryFilterKind.Custom:
                return (item: Item): boolean => {
                    return !item.system.isWeaponArmor() && item.system.type === 
                        this.itemTypeID.getValue();
                };
            case Enum.InventoryFilterKind.Weapons:
                return (item: Item): boolean => {
                    return item.system.isWeapon();
                };
            case Enum.InventoryFilterKind.Armors:
                return (item: Item): boolean => {
                    return item.system.isArmor();
                };
            case Enum.InventoryFilterKind.WeaponsAndAmors:
                return (item: Item): boolean => {
                    return item.system.isWeaponArmor();
                };
            case Enum.InventoryFilterKind.Script:
                return (item: Item): boolean => {
                    return Interpreter.evaluate(this.script, { additionalName: 
                        "item", additionalValue: item});
                };
            default:
                return null;
        }
    }
}

export { InventoryFilter }