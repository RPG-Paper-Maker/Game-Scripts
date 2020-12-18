/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base";
import { EventCommand, System, Manager } from "..";
import { Enum } from "../Common";
var SongKind = Enum.SongKind;
/** @class
 *  An event command for stopping the music.
 *  @extends EventCommand.Base
 *  @property {System.DynamicValue} seconds The time in seconds value
 *  @param {any[]} command Direct JSON command to parse
 */
class StopMusic extends Base {
    constructor(command) {
        super();
        EventCommand.StopMusic.parseStopSong(this, command);
        this.isDirectNode = true;
        this.parallel = true;
    }
    /**
     *  Parse a stop song command.
     *  @static
     *  @param {any} that The event command to parse
     *  @param {any[]} command Direct JSON command to parse
     */
    static parseStopSong(that, command) {
        let iterator = {
            i: 0
        };
        that.seconds = System.DynamicValue.createValueCommand(command, iterator);
    }
    /**
     *  Stop the song.
     *  @static
     *  @param {any} that The event command to parse
     *  @param {SongKind} kind The song kind
     *  @param {number} time The date seconds value in the first call of stop
     */
    static stopSong(that, kind, time) {
        return Manager.Songs.stopSong(kind, time, that.seconds.getValue()) ? 1 :
            0;
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
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
    update(currentState, object, state) {
        let stopped = EventCommand.StopMusic.stopSong(this, SongKind.Music, currentState.time);
        return currentState.parallel ? stopped : 1;
    }
}
export { StopMusic };
