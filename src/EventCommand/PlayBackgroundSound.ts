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
import { Enum } from "../Common";
import { MapObject } from "../Core";

/** @class
 *  An event command for playing a backgroundsound.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class PlayBackgroundSound extends Base {

    public song: System.PlaySong;

    constructor(command: any[]) {
        super();

        let iterator = {
            i: 0
        };
        this.song = System.PlaySong.createValueCommand(command, iterator, Enum
            .SongKind.BackgroundSound);
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

export { PlayBackgroundSound }