/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum, Utils, Interpreter } from "../Common";
var CharacteristicKind = Enum.CharacteristicKind;
var IncreaseDecreaseKind = Enum.IncreaseDecreaseKind;
import { Base } from "./Base";
import { DynamicValue } from "./DynamicValue";
import { Player } from "../Core";
import { Datas, Manager } from "..";
/** @class
 *  A characteristic of a common skill item.
 *  @extends System.Base
 *  @param {Record<string, any>} [json=undefined] Json object describing the
 *  characteristic
 */
class Characteristic extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the characteristic.
     *  @param {Record<string, any>} json Json object describing the
     *  characteristic
     */
    read(json) {
        this.kind = Utils.defaultValue(json.k, CharacteristicKind
            .IncreaseDecrease);
        switch (this.kind) {
            case CharacteristicKind.IncreaseDecrease:
                this.isIncreaseDecrease = Utils.defaultValue(json.iid, true);
                this.increaseDecreaseKind = Utils.defaultValue(json.idk, IncreaseDecreaseKind.StatValue);
                switch (this.increaseDecreaseKind) {
                    case IncreaseDecreaseKind.StatValue:
                        this.statisticValueID = DynamicValue
                            .readOrDefaultDatabase(json.svid);
                        break;
                    case IncreaseDecreaseKind.ElementRes:
                        this.elementResID = DynamicValue.readOrDefaultDatabase(json.erid);
                        break;
                    case IncreaseDecreaseKind.StatusRes:
                        this.statusResID = DynamicValue.readOrDefaultDatabase(json.strid);
                        break;
                    case IncreaseDecreaseKind.CurrencyGain:
                        this.currencyGainID = DynamicValue.readOrDefaultDatabase(json.cgid);
                        break;
                    case IncreaseDecreaseKind.SkillCost:
                        this.skillCostID = DynamicValue.readOrDefaultDatabase(json.scid);
                        this.isAllSkillCost = Utils.defaultValue(json.iasc, true);
                        break;
                    case IncreaseDecreaseKind.Variable:
                        this.variableID = Utils.defaultValue(json.vid, 1);
                        break;
                }
                this.operation = Utils.defaultValue(json.o, true);
                this.value = DynamicValue.readOrDefaultNumber(json.v);
                this.unit = Utils.defaultValue(json.u, true);
                break;
            case CharacteristicKind.Script:
                this.script = DynamicValue.readOrDefaultMessage(json.s);
                break;
            case CharacteristicKind.AllowForbidEquip:
                this.isAllowEquip = Utils.defaultValue(json.iae, true);
                this.isAllowEquipWeapon = Utils.defaultValue(json.iaew, true);
                this.equipWeaponTypeID = DynamicValue.readOrDefaultDatabase(json
                    .ewtid);
                this.equipArmorTypeID = DynamicValue.readOrDefaultDatabase(json
                    .eatid);
                break;
            case CharacteristicKind.AllowForbidChange:
                this.isAllowChangeEquipment = Utils.defaultValue(json.iace, true);
                this.changeEquipmentID = DynamicValue.readOrDefaultDatabase(json
                    .ceid);
                break;
            case CharacteristicKind.BeginEquipment:
                this.beginEquipmentID = DynamicValue.readOrDefaultDatabase(json
                    .beid);
                this.isBeginWeapon = Utils.defaultValue(json.ibw, true);
                this.beginWeaponArmorID = DynamicValue.readOrDefaultDatabase(json.bwaid);
                break;
        }
    }
    /**
     *  Get the new stat value of a player with this characteristic bonus.
     *  @param {Player} gamePlayer the player
     *  @returns {number[]}
     */
    getNewStatValue(gamePlayer) {
        let statID, stat, value, baseStatValue;
        switch (this.kind) {
            case CharacteristicKind.IncreaseDecrease:
                switch (this.increaseDecreaseKind) {
                    case IncreaseDecreaseKind.StatValue:
                        statID = this.statisticValueID.getValue();
                        stat = Datas.BattleSystems.getStatistic(statID);
                        value = this.value.getValue() * (this.isIncreaseDecrease
                            ? 1 : -1);
                        baseStatValue = gamePlayer[stat.getAbbreviationNext()] -
                            gamePlayer[stat.getBonusAbbreviation()];
                        if (this.operation) { // *
                            value = this.unit ? baseStatValue * Math.round(baseStatValue * value / 100) : baseStatValue *
                                value; // % / Fix
                        }
                        else { // +
                            value = this.unit ? Math.round(baseStatValue * value
                                / 100) : value; // % / Fix
                        }
                        return [statID, value];
                    case IncreaseDecreaseKind.ElementRes:
                        statID = this.unit ? Datas.BattleSystems
                            .statisticsElementsPercent[this.elementResID
                            .getValue()] : Datas.BattleSystems
                            .statisticsElements[this.elementResID.getValue()];
                        stat = Datas.BattleSystems.getStatistic(statID);
                        value = this.value.getValue() * (this.isIncreaseDecrease
                            ? 1 : -1);
                        if (this.operation) { // *
                            value *= gamePlayer[stat.getAbbreviationNext()] -
                                gamePlayer[stat.getBonusAbbreviation()];
                        }
                        return [statID, value];
                    default:
                        return null;
                }
            default:
                return null;
        }
    }
    /**
     *  Get the string representation of the characteristic.
     *  @returns {string}
     */
    toString() {
        let user = Manager.Stack.currentMap.user ? (Manager.Stack.currentMap
            .isBattleMap ? Manager.Stack.currentMap.user.character : Manager
            .Stack.currentMap.user) : Player.getTemporaryPlayer();
        let target = Player.getTemporaryPlayer();
        let result = "";
        switch (this.kind) {
            case CharacteristicKind.IncreaseDecrease:
                switch (this.increaseDecreaseKind) {
                    case IncreaseDecreaseKind.StatValue:
                        result += Datas.BattleSystems.getStatistic(Interpreter
                            .evaluate(this.statisticValueID.getValue(), { user: user, target: target })).name;
                        break;
                    case IncreaseDecreaseKind.ElementRes:
                        result += Datas.BattleSystems.getElement(this
                            .elementResID.getValue()).name + " res.";
                        break;
                    case IncreaseDecreaseKind.StatusRes:
                        break;
                    case IncreaseDecreaseKind.ExperienceGain:
                        result += Datas.BattleSystems.getExpStatistic().name +
                            " gain";
                        break;
                    case IncreaseDecreaseKind.CurrencyGain:
                        result += Datas.Systems.getCurrency(this.currencyGainID
                            .getValue()).name + " gain";
                        break;
                    case IncreaseDecreaseKind.SkillCost:
                        if (this.isAllSkillCost) {
                            result += "All skills cost";
                        }
                        else {
                            result += Datas.Skills.get(this.skillCostID
                                .getValue()).name + " skill cost";
                        }
                        break;
                    case IncreaseDecreaseKind.Variable:
                        result += Datas.Variables.get(this.variableID);
                        break;
                }
                result += " ";
                let sign = this.isIncreaseDecrease ? 1 : -1;
                let value = this.value.getValue();
                sign *= Math.sign(value);
                if (this.operation) {
                    result += "x";
                    if (sign === -1) {
                        result += "-";
                    }
                }
                else {
                    if (sign === 1) {
                        result += "+";
                    }
                    else if (sign === -1) {
                        result += "-";
                    }
                }
                result += Math.abs(value);
                if (this.unit) {
                    result += "%";
                }
                break;
            case CharacteristicKind.Script:
            case CharacteristicKind.AllowForbidEquip:
            case CharacteristicKind.AllowForbidChange:
            case CharacteristicKind.BeginEquipment:
                break;
        }
        return result;
    }
}
export { Characteristic };
