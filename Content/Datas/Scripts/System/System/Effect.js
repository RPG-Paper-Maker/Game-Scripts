/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Utils, Enum, Constants, Interpreter, Mathf } from "../Common/index.js";
var EffectKind = Enum.EffectKind;
var DamagesKind = Enum.DamagesKind;
var EffectSpecialActionKind = Enum.EffectSpecialActionKind;
var CharacterKind = Enum.CharacterKind;
import { System, Manager, Datas } from "../index.js";
import { Player, ReactionInterpreter } from "../Core/index.js";
/** @class
 *  An effect of a common skill item.
 *  @property {EffectKind} kind The kind of effect
 *  @property {DamageKind} damageKind The damage kind
 *  @property {SystemValue} damageStatisticID The damage statistic ID value
 *  @property {SystemValue} damageCurrencyID The damage currency ID value
 *  @property {SystemValue} damageVariableID The damage variable ID value
 *  @property {SystemValue} damageFormula The damage formula value
 *  @property {boolean} isDamagesMinimum Indicate if damages minimum exists
 *  @property {SystemValue} damagesMinimumFormula The damage minimum formula
 *  value
 *  @property {boolean} isDamagesMaximum Indicate if damages maximum exists
 *  @property {SystemValue} damagesMaximumFormula The damage maximum formula
 *  value
 *  @property {boolean} isDamageElement Indicate if damages element exists
 *  @property {SystemValue} damageElementID The damage element ID value
 *  @property {boolean} isDamageVariance Indicate if damages variance exists
 *  @property {SystemValue} damageVarianceFormula The damage variance formula
 *  value
 *  @property {boolean} isDamageCritical Indicate if damages critical exists
 *  @property {SystemValue} damageCriticalFormula The damage critical formula
 *  value
 *  @property {boolean} isDamagePrecision Indicate if damages precision exists
 *  @property {SystemValue} damagePrecisionFormula The damage precision formula
 *  value
 *  @property {boolean} isDamageStockVariableID Indicate if damages stock
 *  variable ID exists
 *  @property {SystemValue} damageStockVariableID The damage stock variable ID
 *  value
 *  @property {boolean} isAddStatus Indicate if add status exists
 *  @property {SystemValue} statusID The status ID value
 *  @property {SystemValue} statusPrecisionFormula The status precision formula
 *  value
 *  @property {boolean} isAddSkill Indicate if add skill exists
 *  @property {SystemValue} addSkillID The add skill ID value
 *  @property {SystemValue} performSkillID The perform skill ID value
 *  @property {EventCommand} commonReaction The common reaction to execute
 *  @property {EffectSpecialActionKind} specialActionKind The special action
 *  kind
 *  @property {SystemValue} scriptFormula The script formula value
 *  @property {boolean} isTemporarilyChangeTarget Indicate if temporarily
 *  change target exists
 *  @property {SystemValue} temporarilyChangeTargetFormula The temporarily
 *  change target formula value
 *  @param {Record<string, any>} [json=undefined] Json object describing the effect
 */
class Effect extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the effect.
     *  @param {Record<string, any>} json Json object describing the effect
     */
    read(json) {
        this.kind = Utils.defaultValue(json.k, EffectKind.Damages);
        switch (this.kind) {
            case EffectKind.Damages: {
                this.damageKind = Utils.defaultValue(json.dk, DamagesKind.Stat);
                switch (this.damageKind) {
                    case DamagesKind.Stat:
                        this.damageStatisticID = System.DynamicValue
                            .readOrDefaultDatabase(json.dsid);
                        break;
                    case DamagesKind.Currency:
                        this.damageCurrencyID = System.DynamicValue
                            .readOrDefaultDatabase(json.dcid);
                        break;
                    case DamagesKind.Variable:
                        this.damageVariableID = Utils.defaultValue(json.dvid, 1);
                        break;
                }
                this.damageFormula = System.DynamicValue.readOrDefaultMessage(json.df);
                this.isDamagesMinimum = Utils.defaultValue(json.idmin, true);
                this.damagesMinimumFormula = System.DynamicValue
                    .readOrDefaultMessage(json.dmin, Constants.STRING_ZERO);
                this.isDamagesMaximum = Utils.defaultValue(json.idmax, false);
                this.damagesMaximumFormula = System.DynamicValue
                    .readOrDefaultMessage(json.dmax, Constants.STRING_ZERO);
                this.isDamageElement = Utils.defaultValue(json.ide, false);
                this.damageElementID = System.DynamicValue.readOrDefaultDatabase(json.deid);
                this.isDamageVariance = Utils.defaultValue(json.idv, false);
                this.damageVarianceFormula = System.DynamicValue
                    .readOrDefaultMessage(json.dvf, Constants.STRING_ZERO);
                this.isDamageCritical = Utils.defaultValue(json.idc, false);
                this.damageCriticalFormula = System.DynamicValue
                    .readOrDefaultMessage(json.dcf, Constants.STRING_ZERO);
                this.isDamagePrecision = Utils.defaultValue(json.idp, false);
                this.damagePrecisionFormula = System.DynamicValue
                    .readOrDefaultMessage(json.dpf, Utils.numToString(100));
                this.isDamageStockVariableID = Utils.defaultValue(json.idsv, false);
                this.damageStockVariableID = Utils.defaultValue(json.dsv, 1);
                break;
            }
            case EffectKind.Status:
                this.isAddStatus = Utils.defaultValue(json.iast, true);
                this.statusID = System.DynamicValue.readOrDefaultDatabase(json
                    .sid);
                this.statusPrecisionFormula = System.DynamicValue
                    .readOrDefaultMessage(json.spf, Utils.numToString(100));
                break;
            case EffectKind.AddRemoveSkill:
                this.isAddSkill = Utils.defaultValue(json.iask, true);
                this.addSkillID = System.DynamicValue.readOrDefaultDatabase(json
                    .asid);
                break;
            case EffectKind.PerformSkill:
                this.performSkillID = System.DynamicValue.readOrDefaultDatabase(json.psid);
                break;
            case EffectKind.CommonReaction:
                this.commonReaction = (Utils
                    .isUndefined(json.cr) ? null : Manager.Events
                    .getEventCommand(json.cr));
                break;
            case EffectKind.SpecialActions:
                this.specialActionKind = Utils.defaultValue(json.sak, EffectSpecialActionKind.ApplyWeapons);
                break;
            case EffectKind.Script:
                this.scriptFormula = System.DynamicValue.readOrDefaultMessage(json.sf);
                break;
        }
        this.isTemporarilyChangeTarget = Utils.defaultValue(json.itct, false);
        this.temporarilyChangeTargetFormula = System.DynamicValue
            .readOrDefaultMessage(json.tctf);
    }
    /**
     *  Execute the effect.
     *  @returns {boolean}
     */
    execute() {
        let user = Manager.Stack.currentMap.user ? (Manager.Stack.currentMap
            .isBattleMap ? Manager.Stack.currentMap.user.character : Manager
            .Stack.currentMap.user) : Player.getTemporaryPlayer();
        Manager.Stack.currentMap.tempTargets = Manager.Stack.currentMap.targets;
        if (this.isTemporarilyChangeTarget) {
            Manager.Stack.currentMap.targets = Interpreter.evaluate(this
                .temporarilyChangeTargetFormula.getValue(), { user: user });
        }
        let targets = Manager.Stack.currentMap.targets;
        let result = false;
        switch (this.kind) {
            case EffectKind.Damages: {
                let l = targets.length;
                Manager.Stack.currentMap.damages = new Array(l);
                let damage, miss, crit, target, precision, random, variance, fixRes, percentRes, element, critical, stat, abbreviation, max, before, currencyID;
                for (let i = 0; i < l; i++) {
                    damage = 0;
                    miss = false;
                    crit = false;
                    target = Manager.Stack.currentMap.isBattleMap ? targets[i]
                        .character : targets[i];
                    // Calculate damages
                    if (this.isDamagePrecision) {
                        precision = Interpreter.evaluate(this
                            .damagePrecisionFormula.getValue(), { user: user,
                            target: target });
                        random = Mathf.random(0, 100);
                        if (precision < random) {
                            damage = null;
                            miss = true;
                        }
                    }
                    if (damage !== null) {
                        damage = Interpreter.evaluate(this.damageFormula
                            .getValue(), { user: user, target: target });
                        if (this.isDamageVariance) {
                            variance = Math.round(damage * Interpreter.evaluate(this.damageVarianceFormula.getValue(), { user: user, target: target }) / 100);
                            damage = Mathf.random(damage - variance, damage +
                                variance);
                        }
                        if (this.isDamageElement) {
                            element = this.damageElementID.getValue();
                            fixRes = target[Datas.BattleSystems.getStatistic(Datas.BattleSystems.statisticsElements[element])
                                .abbreviation];
                            percentRes = target[Datas.BattleSystems.getStatistic(Datas.BattleSystems.statisticsElementsPercent[element]).abbreviation];
                            damage -= (damage * percentRes / 100);
                            damage -= fixRes;
                        }
                        if (this.isDamageCritical) {
                            critical = Interpreter.evaluate(this
                                .damageCriticalFormula.getValue(), { user: user,
                                target: target });
                            random = Mathf.random(0, 100);
                            if (random <= critical) {
                                damage = Interpreter.evaluate(Interpreter
                                    .evaluate(Datas.BattleSystems.formulaCrit
                                    .getValue(), { user: user, target: target,
                                    damage: damage }));
                                crit = true;
                            }
                        }
                        if (this.isDamagesMinimum) {
                            damage = Math.max(damage, Interpreter.evaluate(this
                                .damagesMinimumFormula.getValue(), { user: user,
                                target: target }));
                        }
                        if (this.isDamagesMaximum) {
                            damage = Math.min(damage, Interpreter.evaluate(this
                                .damagesMaximumFormula.getValue(), { user: user,
                                target: target }));
                        }
                        damage = Math.round(damage);
                    }
                    if (this.isDamageStockVariableID) {
                        Manager.Stack.game.variables[this.damageStockVariableID]
                            = damage === null ? 0 : damage;
                    }
                    // For diplaying result in HUD
                    if (Manager.Stack.currentMap.isBattleMap) {
                        Manager.Stack.currentMap.damages[i] = [damage, crit,
                            miss];
                    }
                    // Result accoring to damage kind
                    switch (this.damageKind) {
                        case DamagesKind.Stat:
                            stat = Datas.BattleSystems.getStatistic(this
                                .damageStatisticID.getValue());
                            abbreviation = stat.abbreviation;
                            max = target[stat.getMaxAbbreviation()];
                            before = target[abbreviation];
                            target[abbreviation] -= damage;
                            if (target[abbreviation] < 0) {
                                target[abbreviation] = 0;
                            }
                            if (!stat.isFix) {
                                target[abbreviation] = Math.min(target[abbreviation], max);
                            }
                            result = result || (before !== max && damage !== 0);
                            break;
                        case DamagesKind.Currency:
                            currencyID = this.damageCurrencyID.getValue();
                            if (target.kind === CharacterKind.Hero) {
                                before = Manager.Stack.game.currencies[currencyID];
                                Manager.Stack.game.currencies[currencyID] -=
                                    damage;
                                if (Manager.Stack.game.currencies[currencyID] <
                                    0) {
                                    Manager.Stack.game.currencies[currencyID] =
                                        0;
                                }
                                result = result || (before !== Manager.Stack
                                    .game.currencies[currencyID] && damage !== 0);
                            }
                            break;
                        case DamagesKind.Variable:
                            before = Manager.Stack.game.variables[this
                                .damageVariableID];
                            Manager.Stack.game.variables[this.damageVariableID]
                                -= damage;
                            if (Manager.Stack.game.variables[this
                                .damageVariableID] < 0) {
                                Manager.Stack.game.variables[this
                                    .damageVariableID] = 0;
                            }
                            result = result || (before !== Manager.Stack.game
                                .variables[this.damageVariableID] && damage !==
                                0);
                            break;
                    }
                }
                break;
            }
            case EffectKind.Status:
                break;
            case EffectKind.AddRemoveSkill:
                break;
            case EffectKind.PerformSkill:
                break;
            case EffectKind.CommonReaction:
                Manager.Stack.currentMap.reactionInterpreters.push(new ReactionInterpreter(null, Datas.CommonEvents
                    .getCommonReaction(this.commonReaction.commonReactionID), null, null, this.commonReaction.parameters));
                break;
            case EffectKind.SpecialActions:
                Manager.Stack.currentMap.battleCommandKind = this
                    .specialActionKind;
                break;
            case EffectKind.Script:
                break;
        }
        return result;
    }
    /**
     *  Check if the effect is animated.
     *  @returns {boolean}
     */
    isAnimated() {
        return this.kind === EffectKind.Damages || this.kind === EffectKind
            .Status || this.kind === EffectKind.CommonReaction;
    }
    /**
     *  Get the string representation of the effect.
     *  @returns {string}
     */
    toString() {
        let user = Manager.Stack.currentMap.user ? (Manager.Stack.currentMap
            .isBattleMap ? Manager.Stack.currentMap.user.character : Manager
            .Stack.currentMap.user) : Player.getTemporaryPlayer();
        let target = Player.getTemporaryPlayer();
        switch (this.kind) {
            case EffectKind.Damages:
                let damage = Interpreter.evaluate(this.damageFormula.getValue(), { user: user, target: target });
                if (damage === 0) {
                    return "";
                }
                let precision = 100;
                let critical = 0;
                let variance = 0;
                if (this.isDamageVariance) {
                    variance = Math.round(damage * Interpreter.evaluate(this
                        .damageVarianceFormula.getValue(), { user: user, target: target }) / 100);
                }
                let min = damage - variance;
                let max = damage + variance;
                if (damage < 0) {
                    let temp = min;
                    min = -max;
                    max = -temp;
                }
                let options = [];
                if (this.isDamagePrecision) {
                    precision = Interpreter.evaluate(this.damagePrecisionFormula
                        .getValue(), { user: user, target: target });
                    options.push("precision: " + precision + "%");
                }
                if (this.isDamageCritical) {
                    critical = Interpreter.evaluate(this.damageCriticalFormula
                        .getValue(), { user: user, target: target });
                    options.push("critical: " + critical + "%");
                }
                let damageName = "";
                switch (this.damageKind) {
                    case DamagesKind.Stat:
                        damageName = Datas.BattleSystems.getStatistic(this
                            .damageStatisticID.getValue()).name;
                        break;
                    case DamagesKind.Currency:
                        damageName = Datas.Systems.getCurrency(this
                            .damageCurrencyID.getValue()).name();
                        break;
                    case DamagesKind.Variable:
                        damageName = Datas.Variables.get(this.damageVariableID);
                        break;
                }
                return (damage > 0 ? "Damage" : "Heal") + " " + damageName +
                    ": " + (min === max ? min : min + " - " + max) + (options
                    .length > 0 ? " [" + options.join(" - ") + "]" : "");
            case EffectKind.Status:
                return (this.isAddStatus ? "Add" : "Remove") + " " +
                    " [precision: " + Interpreter.evaluate(this
                    .statusPrecisionFormula.getValue(), { user: user, target: target }) + "%]";
            case EffectKind.AddRemoveSkill:
                return (this.isAddSkill ? "Add" : "Remove") + " skill " + Datas
                    .Skills.get(this.addSkillID.getValue()).name;
            case EffectKind.PerformSkill:
                return "Perform skill " + Datas.Skills.get(this.performSkillID
                    .getValue()).name;
            default:
                return "";
        }
    }
}
export { Effect };
