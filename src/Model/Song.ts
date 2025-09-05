/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform, SONG_KIND, Utils } from '../Common';
import { Datas } from '../index';
import { Base } from './Base';

/** @class
 *  A song of the game.
 *  @extends Model.Base
 *  @param {Record<string ,any>} - [json=undefined] Json object describing the
 *  song
 *  @param {SONG_KIND} [kind=SONG_KIND.Music] - The kind of song
 */
class Song extends Base {
	public id: number;
	public kind: SONG_KIND;
	public name: string;
	public isBR: boolean;
	public dlc: string;
	public base64: string;
	public howl: typeof Howl;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Get string of song kind.
	 *  @param {SONG_KIND} kind - The song kind
	 *  @returns {string}
	 */
	static songKindToString(kind: SONG_KIND): string {
		switch (kind) {
			case SONG_KIND.MUSIC:
				return 'music';
			case SONG_KIND.BACKGROUND_SOUND:
				return 'background music';
			case SONG_KIND.MUSIC_EFFECT:
				return 'music effect';
			case SONG_KIND.SOUND:
				return 'sound';
		}
		return '';
	}

	/**
	 *  Get the folder associated to a kind of song.
	 *  @static
	 *  @param {SONG_KIND} kind - The kind of song
	 *  @param {boolean} isBR - Indicate if the pciture is a BR
	 *  @param {string} isDLC - Indicate if the pciture is a DLC
	 *  @returns {string}
	 */
	static getFolder(kind: SONG_KIND, isBR: boolean, dlc: string): string {
		return (
			(isBR ? Datas.Systems.PATH_BR : dlc ? Datas.Systems.PATH_DLCS + '/' + dlc : Platform.ROOT_DIRECTORY) +
			this.getLocalFolder(kind)
		);
	}

	/**
	 *  Get the local folder associated to a kind of song.
	 *  @param {SONG_KIND} kind - The kind of song
	 *  @returns {string}
	 */
	static getLocalFolder(kind: SONG_KIND): string {
		switch (kind) {
			case SONG_KIND.MUSIC:
				return Paths.MUSICS;
			case SONG_KIND.BACKGROUND_SOUND:
				return Paths.BACKGROUND_SOUNDS;
			case SONG_KIND.SOUND:
				return Paths.SOUNDS;
			case SONG_KIND.MUSIC_EFFECT:
				return Paths.MUSIC_EFFECTS;
		}
		return '';
	}

	/**
	 *  Read the JSON associated to the song.
	 *  @param {Record<string, any>} - json Json object describing the song
	 */
	read(json: Record<string, any>) {
		this.id = json.id;
		this.name = json.name;
		this.isBR = json.br;
		this.dlc = Utils.defaultValue(json.d, '');
		this.base64 = json.base64;
	}

	/**
	 *  Get the absolute path associated to this song.
	 *  @returns {string}
	 */
	getPath(): string {
		if (this.base64) {
			return this.base64;
		}
		if (this.howl) {
			return this.howl._src;
		}
		return Song.getFolder(this.kind, this.isBR, this.dlc) + '/' + this.name;
	}

	/**
	 *  Load the song.
	 */
	load() {
		if (this.id !== -1 && !this.howl) {
			this.howl = new Howl({
				src: [this.getPath()],
				loop: this.kind !== SONG_KIND.MUSIC_EFFECT,
				html5: true,
				pool: 10,
			});
			if (this.base64) {
				this.base64 = '';
			}
		}
	}
}

export { Song };
