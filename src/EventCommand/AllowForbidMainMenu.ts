/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { System, Scene } from "../index";
import { MapObject } from "../Core";

/** @class
 *  An event command for allowing forbidding main menu.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class AllowForbidMainMenu extends Base {
    
    public allow: System.DynamicValue;

    constructor(command: any[]) {
        super();

        let iterator = {
            i: 0
        };
        this.allow = System.DynamicValue.createValueCommand(command, iterator);
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
        Scene.Map.allowMainMenu = this.allow.getValue();
        return 1;
    }
}

export { AllowForbidMainMenu }