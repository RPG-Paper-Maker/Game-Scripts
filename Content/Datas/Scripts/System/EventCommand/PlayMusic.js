/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { EventCommand, System } from "../index.js";
import { Enum, Utils } from "../Common/index.js";
var SongKind = Enum.SongKind;
/** @class
 *  An event command for playing a music.
 *  @extends EventCommand.Base
 *  @property {System.PlaySong} song The play song
 *  @param {any[]} command Direct JSON command to parse
 */
class PlayMusic extends Base {
    constructor(command) {
        super();
        EventCommand.PlayMusic.parsePlaySong(this, command, SongKind.Music);
    }
    /**
     *  Parse a play song command.
     *  @static
     *  @param {any} that The event command to parse
     *  @param {any[]} command Direct JSON command to parse
     *  @param {SongKind} kind The song kind
     */
    static parsePlaySong(that, command, kind) {
        let iterator = {
            i: 0
        };
        let isIDprimitive = Utils.numToBool(command[iterator.i++]);
        let valueID = System.DynamicValue.createValueCommand(command, iterator);
        let id = System.DynamicValue.createNumber(command[iterator.i++]);
        let songID = isIDprimitive ? valueID : id;
        let volume = System.DynamicValue.createValueCommand(command, iterator);
        let isStart = Utils.numToBool(command[iterator.i++]);
        let start = System.DynamicValue.createValueCommand(command, iterator);
        start = isStart ? start : null;
        let isEnd = Utils.numToBool(command[iterator.i++]);
        let end = System.DynamicValue.createValueCommand(command, iterator);
        end = isEnd ? end : null;
        that.song = new System.PlaySong(kind);
        that.song.updateValues(songID, volume, isStart, start, isEnd, end);
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        return this.song.initialize();
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The current object reacting
     *  @param {number} state The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState, object, state) {
        return this.song.playMusic();
    }
}
export { PlayMusic };
