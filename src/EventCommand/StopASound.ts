/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { EventCommand, System, Manager } from "../index";
import { Enum } from "../Common";
import { MapObject } from "../Core";

/** @class
 *  An event command for stopping a specified sound.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class StopASound extends Base {

    constructor(command: any[]) {
        super();

        EventCommand.StopMusic.parseStopSong(this, command, Enum.SongKind.Sound);
        this.parallel = true;
    }

    /** 
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize(): Record<string, any> {
        return {
            parallel: false,
            time: new Date().getTime()
        };
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
        let stopped = EventCommand.StopMusic.stopSong(this, Enum.SongKind.Sound,
            currentState.time);
        return currentState.parallel ? stopped : 1;
    }
}

export { StopASound }