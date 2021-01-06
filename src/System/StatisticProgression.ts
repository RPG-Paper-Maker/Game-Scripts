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
import { Player } from "../Core";
import { Utils, Interpreter } from "../Common";
import { Class } from "./Class";

/** @class
 *  A statistic progression of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the 
 *  statistic progression
 */
class StatisticProgression extends Base {

    public id: number;
    public maxValue: DynamicValue;
    public isFix: boolean;
    public table: ProgressionTable;
    public random: DynamicValue;
    public formula: DynamicValue;

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Read the JSON associated to the statistic progression
     *  @param {Record<string, any>} - json Json object describing the statistic 
     *  progression
     */
    read(json: Record<string, any>) {
        this.id = json.id;
        this.maxValue = new DynamicValue(json.m);
        this.isFix = json.if;
        if (this.isFix) {
            this.table = new ProgressionTable(undefined, json.t);
            this.random = new DynamicValue(json.r);
        } else {
            this.formula = new DynamicValue(json.f);
        }
    }

    /** 
     *  Get the value progresion at level
     *  @param {number} level - The level
     *  @param {Player} user - The user
     *  @param {number} [maxLevel=undefined] - The max level
     *  @returns {number}
     */
    getValueAtLevel(level: number, user: Player, maxLevel?: number): number {
        return this.isFix ? this.table.getProgressionAt(level, Utils.isUndefined
            (maxLevel) ? user.system.getProperty(Class.PROPERTY_FINAL_LEVEL) : 
            maxLevel) : Interpreter.evaluate(this.formula.getValue(), { user: 
            user });
    }
}

export { StatisticProgression }