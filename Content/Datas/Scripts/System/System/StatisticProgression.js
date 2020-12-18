/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base";
import { DynamicValue } from "./DynamicValue";
import { ProgressionTable } from "./ProgressionTable";
import { Utils, Interpreter } from "../Common";
import { Class } from "./Class";
/** @class
 *  A statistic progression of the game.
 *  @extends System.Base
 *  @property {number} id The id of the statistic
 *  @property {SystemValue} maxValue The max value
 *  @property {boolean} isFix Indicate if the statistic progression is fix
 *  @property {SystemProgressionTable} table The System progression table
 *  @property {SystemValue} random The random value
 *  @property {SystemValue} formula The formula
 *  @param {Record<string, any>} [json=undefined] Json object describing the statistic
 *  progression
 */
class StatisticProgression extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the statistic progression
     *  @param {Record<string, any>} json Json object describing the statistic
     *  progression
     */
    read(json) {
        this.id = json.id;
        this.maxValue = new DynamicValue(json.m);
        this.isFix = json.if;
        if (this.isFix) {
            this.table = new ProgressionTable(undefined, json.t);
            this.random = new DynamicValue(json.r);
        }
        else {
            this.formula = new DynamicValue(json.f);
        }
    }
    /**
     *  Get the value progresion at level
     *  @param {number} level The level
     *  @param {Player} user The user
     *  @param {number} [maxLevel=undefined] The max level
     *  @returns {number}
     */
    getValueAtLevel(level, user, maxLevel) {
        return this.isFix ? this.table.getProgressionAt(level, Utils.isUndefined(maxLevel) ? user.system.getProperty(Class.PROPERTY_FINAL_LEVEL) :
            maxLevel) : Interpreter.evaluate(this.formula.getValue(), { user: user });
    }
}
export { StatisticProgression };
