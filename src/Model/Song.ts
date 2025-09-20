/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform, SONG_KIND, Utils } from '../Common';
import { Data } from '../index';
import { Base } from './Base';

/**
 * JSON structure describing a song.
 */
export type SongJSON = {
	id: number;
	name: string;
	br?: boolean;
	d?: string;
	base64?: string;
};

/**
 * A song of the game.
 */
export class Song extends Base {
	public id: number;
	public kind: SONG_KIND;
	public name: string;
	public isBR: boolean;
	public dlc: string;
	public base64: string;
	public howl: typeof Howl;

	constructor(json?: SongJSON) {
		super(json);
	}

	/**
	 * Convert a song kind to its string label.
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
	 * Get the folder path for a given song kind.
	 */
	static getFolder(kind: SONG_KIND, isBR: boolean, dlc: string): string {
		return (
			(isBR ? Data.Systems.PATH_BR : dlc ? `${Data.Systems.PATH_DLCS}/${dlc}` : Platform.ROOT_DIRECTORY) +
			this.getLocalFolder(kind)
		);
	}

	/**
	 * Get the local subfolder name for a given song kind.
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
	 * Get the absolute path of the song.
	 */
	getPath(): string {
		if (this.base64) {
			return this.base64;
		}
		if (this.howl) {
			return this.howl._src;
		}
		return `${Song.getFolder(this.kind, this.isBR, this.dlc)}/${this.name}`;
	}

	/**
	 * Load the song into memory.
	 */
	load(): void {
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

	/**
	 * Load the song as a base64 string when not on desktop and not br.
	 */
	async checkBase64(): Promise<void> {
		if (!Platform.IS_DESKTOP && !this.isBR) {
			this.base64 = await Platform.loadFile(
				`${Platform.ROOT_DIRECTORY.slice(0, -1)}${Song.getLocalFolder(this.kind)}/${this.name}`
			);
		}
	}

	/**
	 * Read the JSON data into this song.
	 */
	read(json: SongJSON): void {
		this.id = json.id;
		this.name = json.name;
		this.isBR = json.br;
		this.dlc = Utils.valueOrDefault(json.d, '');
		this.base64 = json.base64;
	}
}
