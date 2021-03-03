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
 *  A troop reaction conditions of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  troop reaction conditions
 */
class TroopReactionConditions extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the troop reaction conditions.
     *  @param {Record<string, any>} - json Json object describing the troop
     *  reaction conditions
     */
    read(json) {
        this.isNumberOfTurn = Utils.defaultValue(json.isNumberOfTurn, false);
        this.numberOfTurnPlus = System.DynamicValue.readOrDefaultNumber(json
            .numberOfTurnPlus);
        this.numberOfTurnTimes = System.DynamicValue.readOrDefaultNumber(json
            .numberOfTurnTimes);
        this.isHeroesMonsters = Utils.defaultValue(json.isHeroesMonsters, false);
        this.isHeroes = Utils.defaultValue(json.isHeroes, true);
        this.conditionHeroesKind = Utils.defaultValue(json.conditionHeroesKind, Enum.ConditionHeroesKind.AllTheHeroes);
        this.heroInstanceID = System.DynamicValue.readOrDefaultVariable(json
            .heroInstanceID);
        this.isStatusID = Utils.defaultValue(json.isStatusID, false);
        this.statusID = System.DynamicValue.readOrDefaultDatabase(json
            .statusID);
        this.isStatisticID = Utils.defaultValue(json.isStatisticID, false);
        this.statisticID = System.DynamicValue.readOrDefaultDatabase(json
            .statisticID);
        this.statisticOperationKind = Utils.defaultValue(json.isStatisticID, Enum.OperationKind.EqualTo);
        this.statisticCompare = System.DynamicValue.readOrDefaultNumber(json
            .statisticCompare);
        this.statisticCompareUnit = Utils.defaultValue(json.statisticCompareUnit, true);
    }
}
export { TroopReactionConditions };
