/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas, Scene, System } from "..";
import { Enum, Mathf, Utils } from "../Common";
import { Game, Player } from "../Core";
import { Base } from "./Base";

/** @class
 *  A troop reaction conditions of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the 
 *  troop reaction conditions
 */
class TroopReactionConditions extends Base {

    public isNumberOfTurn: boolean;
    public numberOfTurnPlus: System.DynamicValue;
    public numberOfTurnTimes: System.DynamicValue;
    public isHeroesMonsters: boolean;
    public isHeroes: boolean;
    public conditionHeroesKind: Enum.ConditionHeroesKind;
    public heroInstanceID: System.DynamicValue;
    public isStatusID: boolean;
    public statusID: System.DynamicValue;
    public isStatisticID: boolean;
    public statisticID: System.DynamicValue;
    public statisticOperationKind: Enum.OperationKind;
    public statisticCompare: System.DynamicValue;
    public statisticCompareUnit: boolean;

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Read the JSON associated to the troop reaction conditions.
     *  @param {Record<string, any>} - json Json object describing the troop 
     *  reaction conditions
     */
    read(json: Record<string, any>) {
        this.isNumberOfTurn = Utils.defaultValue(json.isNumberOfTurn, false);
        this.numberOfTurnPlus = System.DynamicValue.readOrDefaultNumber(json
            .numberOfTurnPlus, 1);
        this.numberOfTurnTimes = System.DynamicValue.readOrDefaultNumber(json
            .numberOfTurnTimes, 1);
        this.isHeroesMonsters = Utils.defaultValue(json.isHeroesMonsters, false);
        this.isHeroes = Utils.defaultValue(json.isHeroes, true);
        this.conditionHeroesKind = Utils.defaultValue(json.conditionHeroesKind, 
            Enum.ConditionHeroesKind.AllTheHeroes);
        this.heroInstanceID = System.DynamicValue.readOrDefaultVariable(json
            .heroInstanceID);
        this.isStatusID = Utils.defaultValue(json.isStatusID, false);
        this.statusID = System.DynamicValue.readOrDefaultDatabase(json
            .statusID);
        this.isStatisticID = Utils.defaultValue(json.isStatisticID, false);
        this.statisticID = System.DynamicValue.readOrDefaultDatabase(json
            .statisticID);
        this.statisticOperationKind = Utils.defaultValue(json.statisticOperationKind, 
            Enum.OperationKind.EqualTo);
        this.statisticCompare = System.DynamicValue.readOrDefaultNumber(json
            .statisticCompare);
        this.statisticCompareUnit = Utils.defaultValue(json.statisticCompareUnit, 
            true);
    }

    /** 
     *  Check if conditions are valid.
     *  @returns {boolean}
     */
    isValid(): boolean {
        let sceneBattle = <Scene.Battle>Scene.Map.current;
        if (this.isNumberOfTurn) {
            let plus = this.numberOfTurnPlus.getValue();
            let times = this.numberOfTurnTimes.getValue();
            if (times === 1) {
                if (sceneBattle.turn < plus) {
                    return false;
                }
            } else {
                if (Mathf.mod(sceneBattle.turn - plus, times) !== 0) {
                    return false;
                }
            }
        }
        if (this.isHeroesMonsters) {
            return Player.applySelection(this.conditionHeroesKind, sceneBattle
                .players[this.isHeroes ? Enum.CharacterKind.Hero : Enum
                .CharacterKind.Monster], this.heroInstanceID.getValue(), (player: 
                Player) => {
                    let test = false;
                    let id: number;
                    if (this.isStatusID) {
                        id = this.statusID.getValue();
                        for (let i = 0, l = player.status.length; i < l; i++) {
                            if (id === player.status[i].system.id) {
                                test = true;
                                break;
                            }
                        }
                        if (!test) {
                            return test;
                        }
                    }
                    if (this.isStatisticID) {
                        id = this.statisticID.getValue();
                        const stat = Datas.BattleSystems.getStatistic(this
                            .statisticID.getValue());
                        const statValue = player[stat.abbreviation];
                        const statValueMax = player[stat.getMaxAbbreviation()];
                        if (Utils.isUndefined(statValueMax)) {
                            throw new Error("No max value for stat " + stat.name());
                        }
                        const compareValue = this.statisticCompare.getValue();
                        return Mathf.OPERATORS_COMPARE[this.statisticOperationKind](
                            this.statisticCompareUnit ? statValue / statValueMax 
                            : statValue, this.statisticCompareUnit ? 
                            compareValue / 100 : compareValue);
                    }
                    return true;
                }
            );
        }
        return true;
    }
}

export { TroopReactionConditions }