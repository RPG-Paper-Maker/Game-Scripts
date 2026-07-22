/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform, SONG_KIND } from '../Common';
import { PlaySong, Song, SongJSON } from '../Model';
import { Data } from '../index';
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
	 * Create every Howl object and wait for all audio to fully decode.
	 */
	static async preload(): Promise<void> {
		const promises: Promise<void>[] = [];
		for (const kindList of this.list.values()) {
			for (const song of kindList.values()) {
				song.load();
				const howl = song.howl;
				if (!howl || howl.state() === 'loaded') {
					continue;
				}
				promises.push(
					new Promise<void>((resolve) => {
						howl.once('load', () => resolve());
						howl.once('loaderror', () => resolve());
					}),
				);
			}
		}
		await Promise.all(promises);
	}

	/**
	 * Read the JSON file associated with songs.
	 */
	static async read(): Promise<void> {
		await this.readSelected();
	}

	/** Read only the title music and title-screen sound effects during boot. */
	static async readTitleScreen(): Promise<void> {
		const selected = new Map<SONG_KIND, Set<number>>();
		const add = (song: PlaySong, kind: SONG_KIND) => {
			const id = song?.songID?.getValue() as number;
			if (id !== undefined && id !== -1) {
				if (!selected.has(kind)) selected.set(kind, new Set());
				selected.get(kind).add(id);
			}
		};
		add(Data.TitlescreenGameover.titleMusic, SONG_KIND.MUSIC);
		add(Data.Systems.soundCursor, SONG_KIND.SOUND);
		add(Data.Systems.soundConfirmation, SONG_KIND.SOUND);
		add(Data.Systems.soundCancel, SONG_KIND.SOUND);
		add(Data.Systems.soundImpossible, SONG_KIND.SOUND);
		await this.readSelected(selected);
	}

	private static async readSelected(selected?: Map<SONG_KIND, Set<number>>): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_SONGS)) as SongsJSON;
		this.list = new Map();
		for (const jsonHash of json.list) {
			const k = jsonHash.k;
			const jsonList = jsonHash.v;
			const list = new Map<number, Song>();
			for (const jsonSong of jsonList) {
				const id = jsonSong.id ?? 0;
				if (selected && !selected.get(k)?.has(id)) continue;
				const song = new Song(jsonSong);
				song.kind = k;
				await song.checkBase64();
				list.set(id, song);
			}
			this.list.set(k, list);
		}
	}
}
