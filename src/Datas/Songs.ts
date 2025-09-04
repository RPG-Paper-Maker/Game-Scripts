/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform, SONG_KIND } from '../Common';
import { Datas, System } from '../index';

/** @class
 *   All the songs datas
 *   @static
 */
class Songs {
	private static list: System.Song[][];

	constructor() {
		throw new Error('This is a static class!');
	}

	/**
	 *  Read the JSON file associated to songs
	 */
	static async read() {
		const json = (await Platform.parseFileJSON(Paths.FILE_SONGS)).list as any;
		const l = json.length;
		this.list = new Array(l);
		let i: number,
			j: number,
			m: number,
			n: number,
			jsonHash: Record<string, any>,
			k: SONG_KIND,
			jsonList: Record<string, any>[],
			jsonSong: Record<string, any>,
			id: number,
			list: System.Song[],
			song: System.Song;
		for (i = 0; i < l; i++) {
			jsonHash = json[i];
			k = jsonHash.k;
			jsonList = jsonHash.v;

			// Get the max ID
			m = jsonList.length;
			n = 0;
			for (j = 0; j < m; j++) {
				jsonSong = jsonList[j];
				id = jsonSong.id;
				if (id > n) {
					n = id;
				}
			}

			// Fill the songs list
			list = new Array(n + 1);
			for (j = 0; j < n + 1; j++) {
				jsonSong = jsonList[j];
				if (jsonSong) {
					id = jsonSong.id;
					song = new System.Song(jsonSong, k);
					if (!Platform.IS_DESKTOP && !song.isBR) {
						song.base64 = await Platform.loadFile(
							Platform.ROOT_DIRECTORY.slice(0, -1) +
								System.Song.getLocalFolder(song.kind) +
								'/' +
								song.name
						);
					}
					if (id === -1) {
						id = 0;
					}
					list[id] = song;
				}
			}
			this.list[k] = list;
		}
	}

	/**
	 *  Get the corresponding song.
	 *  @param {SONG_KIND} kind - The song kind
	 *  @param {number} id - The song id
	 *  @returns {System.Song}
	 */
	static get(kind: SONG_KIND, id: number): System.Song {
		return kind === SONG_KIND.NONE || id === -1
			? new System.Song()
			: Datas.Base.get(id, this.list[kind], 'song ' + System.Song.songKindToString(kind));
	}
}

export { Songs };
