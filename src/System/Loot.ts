/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { DynamicValue } from "./DynamicValue";
import { Item } from "../Core";
import { Mathf } from "../Common";

/** @class
 *  A loot of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the 
 *  loot
 */
class Loot extends Base {

    public kind: number;
    public lootID: DynamicValue;
    public number: DynamicValue;
    public probability: DynamicValue;
    public initial: DynamicValue;
    public final: DynamicValue;

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Read the JSON associated to the loot.
     *  @param {Record<string, any>} - json Json object describing the loot
     */
    read(json: Record<string, any>) {
        this.kind = json.k;
        this.lootID = new DynamicValue(json.lid);
        this.number = new DynamicValue(json.n);
        this.probability = new DynamicValue(json.p);
        this.initial = new DynamicValue(json.i);
        this.final = new DynamicValue(json.f);
    }

    /** 
     *  Check if a loot is available at a particular level.
     *  @param {number} level - The level
     *  @returns {boolean}
     */
    isAvailable(level: number): boolean {
        return level >= this.initial.getValue() && level <= this.final.getValue();
    }

    /** 
     *  Get the current loot at a particular level.
     *  @param {number} level - The level
     *  @returns {Item}
     */
    currenLoot(level: number): Item {
        if (!this.isAvailable(level)) {
            return null;
        }

        // Calculate number with proba
        let proba = this.probability.getValue();
        let totalNumber = this.number.getValue();
        let i: number, rand: number, nb: number;
        for (i = 0, nb = 0; i < totalNumber; i++) {
            rand = Mathf.random(0, 100);
            if (rand <= proba) {
                nb++;
            }
        }
        return nb > 0 ? new Item(this.kind, this.lootID.getValue(), nb) : null;
    }
}

export { Loot }