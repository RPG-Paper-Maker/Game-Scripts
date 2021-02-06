/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum, Utils } from "../Common/index.js";
var TargetKind = Enum.TargetKind;
var AvailableKind = Enum.AvailableKind;
var SongKind = Enum.SongKind;
import { Icon } from "./Icon.js";
import { Translatable } from "./Translatable.js";
import { DynamicValue } from "./DynamicValue.js";
import { PlaySong } from "./PlaySong.js";
import { Cost } from "./Cost.js";
import { Characteristic } from "./Characteristic.js";
import { Effect } from "./Effect.js";
import { System } from "../index.js";
/** @class
 *  A common class for skills, items, weapons, armors.
 *  @extends System.Icon
 *  @param {Record<string, any>} - [json=undefined] Json object describing the common
 */
class CommonSkillItem extends Icon {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the common.
     *  @param {Record<string, any>} - json Json object describing the common
     */
    read(json) {
        super.read(json);
        this.id = json.id;
        this.type = Utils.defaultValue(json.t, 1);
        this.consumable = Utils.defaultValue(json.con, false);
        this.oneHand = Utils.defaultValue(json.oh, true);
        this.description = new Translatable(Utils.defaultValue(json.d, Translatable.EMPTY_NAMES));
        this.targetKind = Utils.defaultValue(json.tk, TargetKind.None);
        this.targetConditionFormula = DynamicValue.readOrNone(json.tcf);
        this.conditionFormula = DynamicValue.readOrNone(json.cf);
        this.availableKind = Utils.defaultValue(json.ak, AvailableKind.Never);
        this.sound = new PlaySong(SongKind.Sound, json.s);
        this.animationUserID = DynamicValue.readOrNone(json.auid);
        this.animationTargetID = DynamicValue.readOrNone(json.atid);
        this.price = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.p, []),
            listIndexes: this.price, cons: Cost });
        this.costs = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.cos, []),
            listIndexes: this.costs, cons: Cost });
        this.effects = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.e, []),
            listIndexes: this.effects, cons: Effect });
        this.characteristics = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.car, []),
            listIndexes: this.characteristics, cons: Characteristic });
    }
    /**
     *  Use the command if possible.
     *  @returns {boolean}
     */
    useCommand() {
        let possible = this.isPossible();
        if (possible) {
            this.use();
        }
        return possible;
    }
    /**
     *  Execute the effects and costs.
     *  @returns {boolean}
     */
    use() {
        let isDoingSomething = false;
        let i, l;
        for (i = 0, l = this.effects.length; i < l; i++) {
            isDoingSomething = isDoingSomething || this.effects[i].execute();
        }
        if (isDoingSomething) {
            for (i = 0, l = this.costs.length; i < l; i++) {
                this.costs[i].use();
            }
        }
        return isDoingSomething;
    }
    /**
     *  Use the costs.
     */
    cost() {
        for (let i = 0, l = this.costs.length; i < l; i++) {
            this.costs[i].use();
        }
    }
    /** Check if the costs are possible.
     *  @returns {boolean}
     */
    isPossible() {
        for (let i = 0, l = this.costs.length; i < l; i++) {
            if (!this.costs[i].isPossible()) {
                return false;
            }
        }
        return true;
    }
    /**
     *  Get the target kind string.
     *  @returns {string}
     */
    getTargetKindString() {
        switch (this.targetKind) {
            case TargetKind.None:
                return "None";
            case TargetKind.User:
                return "The user";
            case TargetKind.Enemy:
                return "An enemy";
            case TargetKind.Ally:
                return "An ally";
            case TargetKind.AllEnemies:
                return "All enemies";
            case TargetKind.AllAllies:
                return "All allies";
        }
        return "";
    }
    /**
     *  Get the weapon kind.
     *  @returns {System/WeaponArmorKind}
     */
    getType() {
        return null;
    }
    /**
     *  Get the price.
     *  @returns {number}
     */
    getPrice() {
        return System.Cost.getPrice(this.price);
    }
    /**
     *  Get the item kind.
     *  @returns {Enum.ItemKind}
     */
    getKind() {
        return null;
    }
    /**
     *  Check if is weapon or armor.
     *  @returns {boolean}
     */
    isWeaponArmor() {
        return this.getKind() === Enum.ItemKind.Weapon || this.getKind() ===
            Enum.ItemKind.Armor;
    }
}
export { CommonSkillItem };
