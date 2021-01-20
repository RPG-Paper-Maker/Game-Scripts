/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { MapObject } from "../Core";
import { Scene, Manager } from "../index";

/** @class
 *  An event command for opening the main menu.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class OpenMainMenu extends Base {

    constructor(command: any[]) {
        super();

        this.isDirectNode = false;
    }

    /** 
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize(): Record<string, any> {
        return {
            opened: false
        }
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
        if (!Scene.Map.allowMainMenu || currentState.opened)
        {
            return 1;
        }
        Manager.Stack.push(new Scene.Menu());
        currentState.opened = true;
        return 0;
    }
}

export { OpenMainMenu }