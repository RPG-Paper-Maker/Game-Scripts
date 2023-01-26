/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { System } from "../index";
import { MapObject } from "../Core";

/** @class
 *  An event command for jumping to a label node.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class JumpToLabel extends Base {

    public label: System.DynamicValue;

    constructor(command: any[]) {
        super();

        let iterator = {
            i: 0
        }
        this.label = System.DynamicValue.createValueCommand(command, iterator);
    }

    /** 
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState: Record<string, any>, object: MapObject, state: number): 
        number
    {
        return this.label.getValue();
    }
}

export { JumpToLabel }
