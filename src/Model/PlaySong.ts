/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { SONG_KIND, Utils } from '../Common';
import { MapObjectCommandType } from '../Common/Types';
import { StructIterator } from '../EventCommand';
import { Manager } from '../index';
import { Base } from './Base';
import { DynamicValue, DynamicValueJSON } from './DynamicValue';

/**
 * JSON schema for PlaySong.
 */
export type PlaySongJSON = {
	isbi?: boolean;
	vid?: DynamicValueJSON;
	id?: number;
	v?: DynamicValueJSON;
	is?: boolean;
	s?: DynamicValueJSON;
	ie?: boolean;
	e?: DynamicValueJSON;
};

/**
 * Represents how to play a song (music, music effect or sound).
 */
export class PlaySong extends Base {
	public static previousMusic: PlaySong | null = null;
	public static currentPlayingMusic: PlaySong | null = null;
	public kind: SONG_KIND;
	public songID: DynamicValue;
	public volume: DynamicValue;
	public isStart: boolean;
	public start: DynamicValue;
	public isEnd: boolean;
	public end: DynamicValue | null;

	constructor(kind: SONG_KIND, json?: PlaySongJSON) {
		super();
		this.kind = kind;
		this.read(json);
	}

	/**
	 * Set default values for the PlaySong instance.
	 */
	public setDefault(): void {
		this.songID = DynamicValue.createNumber(-1);
		this.volume = DynamicValue.createNumber(100);
		this.isStart = false;
		this.start = DynamicValue.createNumber(0);
		this.isEnd = false;
		this.end = null;
	}

	/**
	 * Initialize state for music effects.
	 * @returns An object with music-effect state or `null` for non-music-effect kinds.
	 */
	public initialize(): { parallel: boolean; timeStop: number } | null {
		if (this.kind === SONG_KIND.MUSIC_EFFECT) {
			return {
				parallel: false,
				timeStop: Date.now(),
			};
		}
		return null;
	}

	/**
	 * Create a PlaySong instance from an event command stream.
	 * @param command - The event command array.
	 * @param iterator - The iterator for the command array.
	 * @param kind - The song kind to create.
	 * @returns A new PlaySong instance parsed from the command.
	 */
	public static createValueCommand(
		command: MapObjectCommandType[],
		iterator: StructIterator,
		kind: SONG_KIND,
	): PlaySong {
		const song = new PlaySong(kind);
		song.parse(command, iterator);
		return song;
	}

	/**
	 * Update all internal dynamic values in a single call.
	 * @param songID - The song ID (DynamicValue).
	 * @param volume - The volume value (DynamicValue).
	 * @param isStart - Whether a start is defined.
	 * @param start - The start value (DynamicValue).
	 * @param isEnd - Whether an end is defined.
	 * @param end - The end value (DynamicValue) or null.
	 */
	updateValues(
		songID: DynamicValue,
		volume: DynamicValue,
		isStart: boolean,
		start: DynamicValue,
		isEnd: boolean,
		end: DynamicValue,
	): void {
		this.songID = songID;
		this.volume = volume;
		this.isStart = isStart;
		this.start = start;
		this.isEnd = isEnd;
		this.end = end;
	}

	/**
	 * Play music (non-effect music or background music).
	 * If `start` or `volume` are omitted they are taken from the PlaySong instance.
	 * @param start - Optional start position (in seconds or engine-specific units).
	 * @param volume - Optional volume (0..1).
	 * @returns 1 on success (keeps original behaviour).
	 */
	playMusic(start?: number, volume?: number): number {
		if (start === undefined) {
			start = this.start ? (this.start.getValue() as number) : null;
		}
		if (volume === undefined) {
			volume = (this.volume.getValue() as number) / 100;
		}

		// If same music ID and same
		if (
			(this.songID.getValue() as number) === (PlaySong.currentPlayingMusic.songID.getValue() as number) &&
			start === (PlaySong.currentPlayingMusic.start.getValue() as number)
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
			this.songID.getValue() as number,
			volume,
			start,
			this.end ? (this.end.getValue() as number) : null,
		);
		return 1;
	}

	/**
	 * Play a one-shot sound effect.
	 */
	public playSound(): void {
		Manager.Songs.playSound(this.songID.getValue() as number, (this.volume.getValue() as number) / 100);
	}

	/**
	 * Play a music effect (parallel/non-parallel) and return the next node value.
	 * @param currentState - Current state object for the music effect.
	 * @returns 1 when done / advanced, 0 when not advanced (keeps original behaviour).
	 */
	public playMusicEffect(currentState: Record<string, unknown>): number {
		if (currentState.parallel) {
			const played = Manager.Songs.playMusicEffect(
				this.songID.getValue() as number,
				(this.volume.getValue() as number) / 100,
				currentState,
			);
			currentState.end = played;
			return played ? 1 : 0;
		}
		return 1;
	}

	/**
	 * Parse a PlaySong from an event command stream and update this instance.
	 * @param command - The event command array.
	 * @param iterator - The iterator for the command array.
	 */
	parse(command: MapObjectCommandType[], iterator: StructIterator): void {
		const isIDprimitive = Utils.numberToBool(command[iterator.i++] as number);
		const valueID = DynamicValue.createValueCommand(command, iterator);
		const id = DynamicValue.createNumber(command[iterator.i++] as number);
		const songID = isIDprimitive ? valueID : id;
		const volume = DynamicValue.createValueCommand(command, iterator);
		const isStart = Utils.numberToBool(command[iterator.i++] as number);
		let start = DynamicValue.createValueCommand(command, iterator);
		start = isStart ? start : DynamicValue.createNumber(0);
		const isEnd = Utils.numberToBool(command[iterator.i++] as number);
		let end = DynamicValue.createValueCommand(command, iterator);
		end = isEnd ? end : null;
		this.updateValues(songID, volume, isStart, start, isEnd, end);
	}

	/**
	 * Read the JSON associated to the PlaySong.
	 */
	read(json: PlaySongJSON): void {
		if (!json) {
			this.setDefault();
			return;
		}
		this.songID = json.isbi ? new DynamicValue(json.vid) : DynamicValue.createNumber(json.id);
		this.volume = new DynamicValue(json.v);
		this.isStart = json.is;
		this.start = this.isStart ? new DynamicValue(json.s) : DynamicValue.createNumber(0);
		this.isEnd = json.ie;
		this.end = this.isEnd ? new DynamicValue(json.e) : DynamicValue.createNumber(0);
	}

	/**
	 * Serialize this PlaySong to a JSON-compatible object.
	 */
	toJson(): PlaySongJSON {
		const json: PlaySongJSON = {};
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
}
