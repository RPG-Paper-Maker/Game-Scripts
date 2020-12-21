/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { MapObject } from "../Core";

/** @class
 *  An event command representing one of the choice.
 *  @extends EventCommand.Base
 *  @param {any[]} command Direct JSON command to parse
 */
class Choice extends Base {

    public index: number;

    constructor(command: any[]) {
        super();

        this.index = command[0];
        this.isDirectNode = true;
        this.parallel = false;
    }

    /** 
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The current object reacting
     *  @param {number} state The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState: Record<string, any>, object: MapObject, state: number): 
        number
    {
        return -1;
    }

    /** 
     *  Returns the number of node to pass.
     *  @returns {number}
     */
    goToNextCommand(): number {
        return 1;
    }
}

export { Choice }