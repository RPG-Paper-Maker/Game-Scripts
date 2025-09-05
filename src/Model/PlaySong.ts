/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { SONG_KIND, Utils } from '../Common';
import { StructIterator } from '../EventCommand';
import { Manager, Model } from '../index';
import { Base } from './Base';

/** @class
 *  A way to play a song.
 *  @extends Model.Base
 *  @param {SONG_KIND} kind - The kind of song to play
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  play song
 */
class PlaySong extends Base {
	static previousMusic: PlaySong = null;
	static currentPlayingMusic: PlaySong = null;

	kind: SONG_KIND;
	songID: Model.DynamicValue;
	volume: Model.DynamicValue;
	isStart: boolean;
	start: Model.DynamicValue;
	isEnd: boolean;
	end: Model.DynamicValue;

	constructor(kind: SONG_KIND, json?: Record<string, any>) {
		super();
		this.kind = kind;
		this.read(json);
	}

	/**
	 *  Create a new value from a command and iterator.
	 *  @static
	 *  @param {any[]} command - The list describing the command
	 *  @param {StructIterator} iterator - The iterator
	 *  @returns {Model.PlaySong}
	 */
	static createValueCommand(command: any[], iterator: StructIterator, kind: SONG_KIND): Model.PlaySong {
		const song = new Model.PlaySong(kind);
		song.parse(command, iterator);
		return song;
	}

	/**
	 *  Read the JSON associated to the play song.
	 *  @param {Record<string, any>} - json Json object describing the play song
	 */
	read(json: Record<string, any>) {
		if (!json) {
			this.setDefault();
			return;
		}
		this.songID = json.isbi ? new Model.DynamicValue(json.vid) : Model.DynamicValue.createNumber(json.id);
		this.volume = new Model.DynamicValue(json.v);
		this.isStart = json.is;
		this.start = this.isStart ? new Model.DynamicValue(json.s) : Model.DynamicValue.createNumber(0);
		this.isEnd = json.ie;
		this.end = this.isEnd ? new Model.DynamicValue(json.e) : Model.DynamicValue.createNumber(0);
	}

	/**
	 *  Parse a play song command.
	 *  @static
	 *  @param {any} command
	 *  @param {StructIterator} iterator
	 */
	parse(command: any[], iterator: StructIterator) {
		const isIDprimitive = Utils.numberToBool(command[iterator.i++]);
		const valueID = Model.DynamicValue.createValueCommand(command, iterator);
		const id = Model.DynamicValue.createNumber(command[iterator.i++]);
		const songID = isIDprimitive ? valueID : id;
		const volume = Model.DynamicValue.createValueCommand(command, iterator);
		const isStart = Utils.numberToBool(command[iterator.i++]);
		let start = Model.DynamicValue.createValueCommand(command, iterator);
		start = isStart ? start : Model.DynamicValue.createNumber(0);
		const isEnd = Utils.numberToBool(command[iterator.i++]);
		let end = Model.DynamicValue.createValueCommand(command, iterator);
		end = isEnd ? end : null;
		this.updateValues(songID, volume, isStart, start, isEnd, end);
	}

	/**
	 *  Get the json value.
	 *  @returns {Record<string, any>}
	 */
	toJson(): Record<string, any> {
		const json: Record<string, any> = {};
		json.isbi = true;
		json.vid = this.songID.toJson();
		json.v = this.volume.toJson();
		json.is = this.isStart;
		if (this.isStart) {
			json.s = this.start.toJson();
		}
		json.ie = this.isEnd;
		if (this.isEnd) {
			json.e = this.end.toJson();
		}
		return json;
	}

	/**
	 *  Set song play to default values.
	 */
	setDefault() {
		this.songID = Model.DynamicValue.createNumber(-1);
		this.volume = Model.DynamicValue.createNumber(100);
		this.isStart = false;
		this.start = Model.DynamicValue.createNumber(0);
		this.isEnd = false;
		this.end = null;
	}

	/**
	 *  Initialize (for music effects).
	 */
	initialize() {
		return this.kind === SONG_KIND.MUSIC_EFFECT
			? {
					parallel: false,
					timeStop: new Date().getTime(),
			  }
			: null;
	}

	/**
	 *  Update all the specified values.
	 *  @param {Model.DynamicValue} songID - The song ID
	 *  @param {Model.DynamicValue} volume - The volume to play
	 *  @param {boolean} isStart - Indicate if there's a start value
	 *  @param {Model.DynamicValue} start - The start of the song to play
	 *  @param {boolean} isEnd - Indicate if there's a end value
	 *  @param {Model.DynamicValue} end - The end of the song to play
	 */
	updateValues(
		songID: Model.DynamicValue,
		volume: Model.DynamicValue,
		isStart: boolean,
		start: Model.DynamicValue,
		isEnd: boolean,
		end: Model.DynamicValue
	) {
		this.songID = songID;
		this.volume = volume;
		this.isStart = isStart;
		this.start = start;
		this.isEnd = isEnd;
		this.end = end;
	}

	/**
	 *  Play the music.
	 *  @param {number} [start=undefined] - The start of the song to play
	 *  @param {number} [volume=undefined] - The volume to play
	 */
	playMusic(start?: number, volume?: number) {
		if (start === undefined) {
			start = this.start ? this.start.getValue() : null;
		}
		if (volume === undefined) {
			volume = this.volume.getValue() / 100;
		}

		// If same music ID and same
		if (
			this.songID.getValue() === PlaySong.currentPlayingMusic.songID.getValue() &&
			start === PlaySong.currentPlayingMusic.start.getValue()
		) {
			// If same, be sure to update volume anyway
			if (Manager.Songs.current[SONG_KIND.MUSIC]) {
				Manager.Songs.current[SONG_KIND.MUSIC].volume(volume);
				Manager.Songs.volumes[SONG_KIND.MUSIC] = volume;
			}
			return 1;
		}

		// Update current and previous played music
		if (this.kind === SONG_KIND.MUSIC) {
			PlaySong.previousMusic = PlaySong.currentPlayingMusic;
			PlaySong.currentPlayingMusic = this;
		}
		Manager.Songs.playMusic(
			this.kind,
			this.songID.getValue(),
			volume,
			start,
			this.end ? this.end.getValue() : null
		);
		return 1;
	}

	/**
	 *  Play the sound.
	 */
	playSound() {
		Manager.Songs.playSound(this.songID.getValue(), this.volume.getValue() / 100);
	}

	/**
	 *  Play the music effect and return the next node value.
	 *  @param {Record<string, any>} - currentState The current state of the
	 *  playing music effect
	 *  @returns {number}
	 */
	playMusicEffect(currentState: Record<string, any>): number {
		if (currentState.parallel) {
			const played = Manager.Songs.playMusicEffect(
				this.songID.getValue(),
				this.volume.getValue() / 100,
				currentState
			);
			currentState.end = played;
			return played ? 1 : 0;
		}
		return 1;
	}
}

export { PlaySong };
