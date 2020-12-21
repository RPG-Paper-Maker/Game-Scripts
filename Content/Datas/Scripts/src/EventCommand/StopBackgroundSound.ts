/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { EventCommand } from "..";
import { MapObject } from "../Core";
import { Enum } from "../Common";
import SongKind = Enum.SongKind;

/** @class
 *  An event command for stopping the background sound.
 *  @extends EventCommand.Base
 *  @param {any[]} command Direct JSON command to parse
 */
class StopBackgroundSound extends Base {
    
    constructor(command: any[]) {
        super();

        EventCommand.StopMusic.parseStopSong(this, command);
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
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The current object reacting
     *  @param {number} state The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState: Record<string, any>, object: MapObject, state: number): 
        number
    {
        let stopped = EventCommand.StopMusic.stopSong(this, SongKind
            .BackgroundSound, currentState.time);
        return currentState.parallel ? stopped : 1;
    }
}

export { StopBackgroundSound }