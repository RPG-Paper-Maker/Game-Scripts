/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Enum, Utils } from "../Common/index.js";
var SongKind = Enum.SongKind;
import { System, Manager } from "../index.js";
/** @class
 *  A way to play a song.
 *  @extends System.Base
 *  @param {SongKind} kind The kind of song to play
 *  @param {Record<string, any>} [json=undefined] Json object describing the
 *  play song
 */
class PlaySong extends Base {
    constructor(kind, json) {
        super(json);
        this.kind = kind;
    }
    /**
     *  Read the JSON associated to the play song.
     *  @param {Record<string, any>} json Json object describing the play song
     */
    read(json) {
        if (!json) {
            this.setDefault();
            return;
        }
        this.songID = json.isbi ? new System.DynamicValue(json.vid) : System
            .DynamicValue.createNumber(json.id);
        this.volume = new System.DynamicValue(json.v);
        this.isStart = json.is;
        this.start = this.isStart ? new System.DynamicValue(json.s) : System
            .DynamicValue.createNumber(0);
        this.isEnd = json.ie;
        this.end = this.isEnd ? new System.DynamicValue(json.e) : System
            .DynamicValue.createNumber(0);
    }
    /**
     *  Set song play to default values.
     */
    setDefault() {
        this.songID = System.DynamicValue.createNumber(-1);
        this.volume = System.DynamicValue.createNumber(100);
        this.isStart = false;
        this.isEnd = false;
    }
    /**
     *  Initialize (for music effects).
     */
    initialize() {
        return this.kind === SongKind.MusicEffect ? {
            parallel: false,
            timeStop: new Date().getTime()
        } : null;
    }
    /**
     *  Update all the specified values.
     *  @param {System.DynamicValue} songID The song ID
     *  @param {System.DynamicValue} volume The volume to play
     *  @param {boolean} isStart Indicate if there's a start value
     *  @param {System.DynamicValue} start The start of the song to play
     *  @param {boolean} isEnd Indicate if there's a end value
     *  @param {System.DynamicValue} end The end of the song to play
     */
    updateValues(songID, volume, isStart, start, isEnd, end) {
        this.songID = songID;
        this.volume = volume;
        this.isStart = isStart;
        this.start = start;
        this.isEnd = isEnd;
        this.end = end;
    }
    /**
     *  Play the music.
     *  @param {number} [start=undefined] The start of the song to play
     *  @param {number} [volume=undefined] The volume to play
     */
    playMusic(start, volume) {
        if (Utils.isUndefined(start)) {
            start = this.start ? this.start.getValue() : null;
        }
        if (Utils.isUndefined(volume)) {
            volume = this.volume.getValue() / 100;
        }
        // If same music ID and same
        if (PlaySong.currentPlayingMusic !== null && this.songID.getValue() ===
            PlaySong.currentPlayingMusic.songID.getValue() && start === PlaySong
            .currentPlayingMusic.start.getValue()) {
            return 1;
        }
        // Update current and previous played music
        if (this.kind === SongKind.Music) {
            PlaySong.previousMusic = PlaySong.currentPlayingMusic;
            PlaySong.currentPlayingMusic = this;
        }
        Manager.Songs.playMusic(this.kind, this.songID.getValue(), volume, start, this.end ? this.end.getValue() : null);
        return 1;
    }
    /**
     *  Play the sound.
     */
    playSound() {
        Manager.Songs.playSound(this.songID.getValue(), this.volume.getValue() /
            100);
    }
    /**
     *  Play the music effect and return the next node value.
     *  @param {Record<string, any>} currentState The current state of the
     *  playing music effect
     *  @returns {number}
     */
    playMusicEffect(currentState) {
        let played = Manager.Songs.playMusicEffect(this.songID.getValue(), this
            .volume.getValue() / 100, currentState);
        currentState.end = played;
        return currentState.parallel ? (played ? 1 : 0) : 1;
    }
}
PlaySong.previousMusic = null;
PlaySong.currentPlayingMusic = null;
export { PlaySong };
