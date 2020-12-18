/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base";
import { System } from "..";
/** @class
 *  An event command for displaying text.
 *  @extends EventCommand.Base
 *  @property {number} milliseconds The number of milliseconds to wait
 *  @param {any[]} command Direct JSON command to parse
 */
class Wait extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.milliseconds = System.DynamicValue.createValueCommand(command, iterator);
        this.isDirectNode = false;
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        return {
            milliseconds: this.milliseconds.getValue() * 1000,
            currentTime: new Date().getTime()
        };
    }
    /**
     *  Update and check if the event is finished
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The current object reacting
     *  @param {number} state The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState, object, state) {
        return (currentState.currentTime + currentState.milliseconds <= new Date().getTime()) ? 1 : 0;
    }
}
export { Wait };
