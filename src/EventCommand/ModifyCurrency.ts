/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { System, Manager } from "..";
import { MapObject } from "../Core";
import { Mathf } from "../Common";

/** @class
 *  An event command for modifying a currency value.
 *  @extends EventCommand.Base
 *  @param {any[]} command Direct JSON command to parse
 */
class ModifyCurrency extends Base {

    public currencyID: System.DynamicValue;
    public operation: number;
    public value: System.DynamicValue;

    constructor(command: any[]) {
        super();

        let iterator = {
            i: 0
        };
        this.currencyID = System.DynamicValue.createValueCommand(command, 
            iterator);
        this.operation = command[iterator.i++];
        this.value = System.DynamicValue.createValueCommand(command, iterator);
    }

    /** 
     *  Update and check if the event is finished.
    *   @param {Record<string, any>} currentState The current state of the event
    *   @param {MapObject} object The current object reacting
    *   @param {number} state The state ID
    *   @returns {number} The number of node to pass
    */
    update(currentState: Record<string, any>, object: MapObject, state: number): 
        number
    {
        let currencyID = this.currencyID.getValue();
        Manager.Stack.game.currencies[currencyID] = Mathf.OPERATORS_NUMBERS[this
            .operation](Manager.Stack.game.currencies[currencyID], this.value
            .getValue());
        return 1;
    }
}

export { ModifyCurrency }
