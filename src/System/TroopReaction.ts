/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { System } from "..";
import { Enum, Utils } from "../Common";
import { Reaction } from "./Reaction";

/** @class
 *  A troop reaction conditions of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the 
 *  troop reaction conditions
 */
class TroopReaction extends Reaction {

    public id: number;
    public conditions: System.TroopReactionConditions;
    public frequency: Enum.TroopReactionFrequencyKind;

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Read the JSON associated to the troop reaction conditions.
     *  @param {Record<string, any>} - json Json object describing the troop 
     *  reaction conditions
     */
    read(json: Record<string, any>) {
        super.read(json);
        this.id = json.id;
        this.conditions = new System.TroopReactionConditions(json.conditions);
        this.frequency = Utils.defaultValue(json.frequency, Enum
            .TroopReactionFrequencyKind.OneTime);
    }
}

export { TroopReaction }