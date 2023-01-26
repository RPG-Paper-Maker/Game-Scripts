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
import { Game, MapObject } from "../Core";

/** @class
 *  An event command for changing battle music.
 *  @extends EventCommand.Base
 */
class ChangeBattleMusic extends Base {

    public song: System.PlaySong;

    constructor(command: any[]) {
        super();
        let iterator = {
            i: 0
        };
        this.song = System.PlaySong.createValueCommand(command, iterator, Enum
            .SongKind.Music);
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
        Game.current.battleMusic = this.song;
        return 1;
    }
}

export { ChangeBattleMusic }