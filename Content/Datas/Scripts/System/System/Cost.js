/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum, Utils, Interpreter } from "../Common/index.js";
var DamagesKind = Enum.DamagesKind;
import { Base } from "./Base.js";
import { DynamicValue } from "./DynamicValue.js";
import { Manager, Datas } from "../index.js";
import { Player } from "../Core/index.js";
/** @class
 *  A cost of a common skill item.
 *  @extends System.Base
 *  @param {Record<string, any>} [json=undefined] Json object describing the
 *  cost
 */
class Cost extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the cost.
     *  @param {Record<string, any>} json Json object describing the cost
     */
    read(json) {
        this.kind = Utils.defaultValue(json.k, DamagesKind.Stat);
        switch (this.kind) {
            case DamagesKind.Stat:
                this.statisticID = DynamicValue.readOrDefaultDatabase(json.sid);
                break;
            case DamagesKind.Currency:
                this.currencyID = DynamicValue.readOrDefaultDatabase(json.cid);
                break;
            case DamagesKind.Variable:
                this.variableID = Utils.defaultValue(json.vid, 1);
                break;
        }
        this.valueFormula = DynamicValue.readOrDefaultMessage(json.vf);
    }
    /**
     *  Use the cost.
     */
    use() {
        let user = Manager.Stack.currentMap.user ? Manager.Stack.currentMap.user
            .player : Player.getTemporaryPlayer();
        let target = Player.getTemporaryPlayer();
        let value = Interpreter.evaluate(this.valueFormula.getValue(), { user: user, target: target });
        switch (this.kind) {
            case DamagesKind.Stat:
                user[Datas.BattleSystems.getStatistic(this.statisticID
                    .getValue()).abbreviation] -= value;
                break;
            case DamagesKind.Currency:
                Manager.Stack.game.currencies[this.currencyID.getValue()] -=
                    value;
                break;
            case DamagesKind.Variable:
                Manager.Stack.game.variables[this.variableID] -= value;
                break;
        }
    }
    /**
     *  Check if the cost is possible.
     *  @returns {boolean}
     */
    isPossible() {
        let user = Manager.Stack.currentMap.user ? Manager.Stack.currentMap.user
            .player : Player.getTemporaryPlayer();
        let target = Player.getTemporaryPlayer();
        let value = Interpreter.evaluate(this.valueFormula.getValue(), { user: user, target: target });
        let currentValue;
        switch (this.kind) {
            case DamagesKind.Stat:
                currentValue = user[Datas.BattleSystems.getStatistic(this
                    .statisticID.getValue()).abbreviation];
                break;
            case DamagesKind.Currency:
                currentValue = Manager.Stack.game.getCurrency(this.currencyID
                    .getValue());
                break;
            case DamagesKind.Variable:
                currentValue = Manager.Stack.game.getVariable(this.variableID);
                break;
        }
        return (currentValue - value >= 0);
    }
    /**
     *  Get the string representing the cost.
     *  @returns {string}
     */
    toString() {
        let user = Manager.Stack.currentMap.user ? Manager.Stack.currentMap.user
            .player : Player.getTemporaryPlayer();
        let target = Player.getTemporaryPlayer();
        let result = Interpreter.evaluate(this.valueFormula.getValue(), { user: user, target: target }) + " ";
        switch (this.kind) {
            case DamagesKind.Stat:
                result += Datas.BattleSystems.getStatistic(this.statisticID
                    .getValue()).name;
                break;
            case DamagesKind.Currency:
                result += Datas.Systems.getCurrency(this.currencyID.getValue())
                    .name;
                break;
            case DamagesKind.Variable:
                result += Datas.Variables.get(this.variableID);
                break;
        }
        return result;
    }
}
export { Cost };
