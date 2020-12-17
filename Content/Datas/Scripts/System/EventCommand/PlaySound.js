/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { EventCommand } from "../index.js";
import { Enum } from "../Common/index.js";
var SongKind = Enum.SongKind;
/** @class
 *  An event command for playing a backgroundsound.
 *  @extends EventCommand.Base
 *  @param {any[]} command Direct JSON command to parse
 */
class PlaySound extends Base {
    constructor(command) {
        super();
        EventCommand.PlayMusic.parsePlaySong(this, command, SongKind.Sound);
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
        this.song.playSound();
        return 1;
    }
}
export { PlaySound };
