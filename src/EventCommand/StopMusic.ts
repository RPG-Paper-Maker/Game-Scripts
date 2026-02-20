/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { SONG_KIND } from '../Common';
import { MapObject } from '../Core';
import { EventCommand, Manager, Model } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for stopping the music.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class StopMusic extends Base {
	constructor(command: any[]) {
		super();

		EventCommand.StopMusic.parseStopSong(this, command, SONG_KIND.MUSIC);
		this.parallel = true;
	}

	/**
	 *  Parse a stop song command.
	 *  @static
	 *  @param {any} that - The event command to parse
	 *  @param {any[]} command - Direct JSON command to parse
	 */
	static parseStopSong(that: any, command: any[], kind: SONG_KIND) {
		const iterator = {
			i: 0,
		};
		that.seconds = Model.DynamicValue.createValueCommand(command, iterator);
		if (kind === SONG_KIND.SOUND) {
			that.soundID = Model.DynamicValue.createValueCommand(command, iterator);
		}
	}

	/**
	 *  Stop the song.
	 *  @static
	 *  @param {any} that - The event command to parse
	 *  @param {SONG_KIND} kind - The song kind
	 *  @param {number} time - The date seconds value in the first call of stop
	 */
	static stopSong(that: any, kind: SONG_KIND, time: number): number {
		return Manager.Songs.stopSong(
			kind,
			time,
			that.seconds.getValue() as number,
			kind === SONG_KIND.SOUND ? (that.soundID.getValue() as number) : -1,
		)
			? 1
			: 0;
	}

	/**
	 *  Initialize the current state.
	 *  @returns {Record<string, any>} The current state
	 */
	initialize(): Record<string, any> {
		return {
			parallel: false,
			time: new Date().getTime(),
		};
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		const stopped = EventCommand.StopMusic.stopSong(this, SONG_KIND.MUSIC, currentState.time);
		return currentState.parallel ? stopped : 1;
	}
}

export { StopMusic };
