/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {BaseSystem, DynamicValue} from ".";
import {RPM} from "../core";

/** @class
 *   A loot of the game
 *   @property {LootKind} kind The kind of loot
 *   @property {SystemValue} lootID The loot ID value
 *   @property {SystemValue} number The number value
 *   @property {SystemValue} probability The probability value
 *   @property {SystemValue} initial The initial value
 *   @property {SystemValue} final The final value
 *   @param {Object} [json=undefined] Json object describing the loot
 */
export class Loot extends BaseSystem {

    kind: number;
    lootID: DynamicValue;
    number: DynamicValue;
    probability: DynamicValue;
    initial: DynamicValue;
    final: DynamicValue;

    constructor(json = undefined) {
        super(json);
    }

    public setup() {
        this.kind = null;
        this.lootID = null;
        this.number = null;
        this.probability = null;
        this.initial = null;
        this.final = null;
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the loot
     *   @param {Object} json Json object describing the loot
     */
    read(json) {
        this.kind = json.k;
        this.lootID = new DynamicValue(json.lid);
        this.number = new DynamicValue(json.n);
        this.probability = new DynamicValue(json.p);
        this.initial = new DynamicValue(json.i);
        this.final = new DynamicValue(json.f);
    }

    // -------------------------------------------------------
    /** Check if a loot is available at a particular level
     *   @param {number} level The level
     *   @returns {boolean}
     */
    isAvailable(level) {
        return level >= this.initial.getValue() && level <= this.final.getValue();
    }

    // -------------------------------------------------------
    /** Get the current loot at a particular level
     *   @param {number} level The level
     *   @returns {GameItem}
     */
    currenLoot(level) {
        if (!this.isAvailable(level)) {
            return null;
        }

        // Calculate number with proba
        let proba = this.probability.getValue();
        let totalNumber = this.number.getValue();
        let i, rand, number;
        for (i = 0, number = 0; i < totalNumber; i++) {
            rand = RPM.random(0, 100);
            if (rand <= proba) {
                number++;
            }
        }
        return number > 0 ? new GameItem(this.kind, this.lootID.getValue(),
            number) : null;
    }
}