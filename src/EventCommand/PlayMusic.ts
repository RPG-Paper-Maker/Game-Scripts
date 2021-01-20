/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { EventCommand, System } from "../index";
import { Enum, Utils } from "../Common";
import SongKind = Enum.SongKind;
import { MapObject } from "../Core";

/** @class
 *  An event command for playing a music.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class PlayMusic extends Base {

    public song: System.PlaySong;

    constructor(command: any[]) {
        super();

        EventCommand.PlayMusic.parsePlaySong(this, command, SongKind.Music);
    }

    /** 
     *  Parse a play song command.
     *  @static
     *  @param {any} that - The event command to parse
     *  @param {any[]} command - Direct JSON command to parse
     *  @param {SongKind} kind - The song kind
     */
    static parsePlaySong(that: any, command: any[], kind: SongKind) {
        let iterator = {
            i: 0
        }
        let isIDprimitive = Utils.numToBool(command[iterator.i++]);
        let valueID = System.DynamicValue.createValueCommand(command, iterator);
        let id = System.DynamicValue.createNumber(command[iterator.i++]);
        let songID = isIDprimitive ? valueID : id;
        let volume = System.DynamicValue.createValueCommand(command, iterator);
        let isStart = Utils.numToBool(command[iterator.i++]);
        let start = System.DynamicValue.createValueCommand(command, iterator);
        start = isStart ? start : System.DynamicValue.createNumber(0);
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
    initialize(): Record<string, any> {
        return this.song.initialize();
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
        return this.song.playMusic();
    }
}

export { PlayMusic }