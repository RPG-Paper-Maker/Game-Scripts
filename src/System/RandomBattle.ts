/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { System } from "..";
import { Utils } from "../Common";
import { Base } from "./Base";

/** @class
 *  A random battle of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the 
 *  random battle
 */
class RandomBattle extends Base {
    public troopID: System.DynamicValue;
    public priority: System.DynamicValue;
    public isEntireMap: boolean;
    public currentPriority: number;

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Read the JSON associated to random battle.
     *  @param {Record<string, any>} - json Json object describing the random 
     *  battle
     */
    read(json: Record<string, any>) {
        this.troopID = System.DynamicValue.readOrDefaultDatabase(json.troopID);
        this.priority = System.DynamicValue.readOrDefaultNumber(json.priority, 10);
        this.isEntireMap = Utils.defaultValue(json.isEntireMap, true);
    }

    /** 
     *  Update the current priority value.
     */
    updateCurrentPriority() {
        this.currentPriority = this.priority.getValue();
    }
}

export { RandomBattle }