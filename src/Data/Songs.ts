/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform, SONG_KIND } from '../Common';
import { Song, SongJSON } from '../Model';
import { Base } from './Base';

/**
 * JSON structure for Songs.
 */
export type SongsJSON = {
	list: {
		k: SONG_KIND;
		v: SongJSON[];
	}[];
};

/**
 * Handles all song data.
 */
export class Songs {
	private static list: Map<SONG_KIND, Map<number, Song>>;

	/**
	 * Get a song by kind and ID.
	 */
	static get(kind: SONG_KIND, id: number, errorMessage?: string): Song {
		if (kind === SONG_KIND.NONE || id === -1) {
			return new Song();
		}
		return Base.get(id, this.list.get(kind), `song ${Song.songKindToString(kind)}`, true, errorMessage);
	}

	/**
	 * Read the JSON file associated with songs.
	 */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_SONGS)) as SongsJSON;
		this.list = new Map();
		for (const jsonHash of json.list) {
			const k = jsonHash.k;
			const jsonList = jsonHash.v;
			const list = new Map<number, Song>();
			for (const jsonSong of jsonList) {
				const id = jsonSong.id ?? 0;
				const song = new Song(jsonSong);
				song.kind = k;
				await song.checkBase64();
				list.set(id, song);
			}
			this.list.set(k, list);
		}
	}
}
