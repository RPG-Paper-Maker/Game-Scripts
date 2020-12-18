/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { IO, Paths, Enum } from "../Common";
var SongKind = Enum.SongKind;
import { System, Datas } from "..";
/** @class
*   All the songs datas
*   @property {SystemSong[]} list List of all the songs of the game
*   according to ID and SongKind
*/
class Songs {
    constructor() {
        throw new Error("This is a static class!");
    }
    /**
     *  Read the JSON file associated to songs
     */
    static async read() {
        let json = (await IO.parseFileJSON(Paths.FILE_SONGS)).list;
        let l = json.length;
        this.list = new Array(l);
        let i, j, m, n, jsonHash, k, jsonList, jsonSong, id, list, song;
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
                    if (k !== SongKind.Sound) {
                        song.load();
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
     *  @param {SongKind} kind The song kind
     *  @param {number} id The song id
     *  @returns {System.Song}
     */
    static get(kind, id) {
        return kind === SongKind.None ? new System.Song() : Datas.Base.get(id, this.list[kind], "song " + System.Song.songKindToString(kind));
    }
}
export { Songs };
