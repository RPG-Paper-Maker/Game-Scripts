/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum } from "../Common/index.js";
var SongKind = Enum.SongKind;
import { Datas } from "../index.js";
import { ProgressionTable } from "../System/index.js";
import { Howl } from "../Globals.js";
/** @class
 *  The manager for songs.
 *  @static
 */
class Songs {
    constructor() {
        throw new Error("This is a static class");
    }
    /**
     *  Initialize all the lists according to SongKind.
     */
    static initialize() {
        this.volumes[SongKind.Music] = 0;
        this.volumes[SongKind.BackgroundSound] = 0;
        this.volumes[SongKind.MusicEffect] = 0;
        this.starts[SongKind.Music] = null;
        this.starts[SongKind.BackgroundSound] = null;
        this.starts[SongKind.MusicEffect] = null;
        this.ends[SongKind.Music] = null;
        this.ends[SongKind.BackgroundSound] = null;
        this.ends[SongKind.MusicEffect] = null;
        this.currentHowl[SongKind.Music] = null;
        this.currentHowl[SongKind.BackgroundSound] = null;
        this.currentHowl[SongKind.MusicEffect] = null;
    }
    /**
     *  Play a music.
     *  @param {SongKind} kind The kind of the song
     *  @param {number} id The id of the song
     *  @param {number} volume The volume of the song
     *  @param {number} start The start of the song
     *  @param {number} end The end of the song
     */
    static playMusic(kind, id, volume, start, end) {
        if (id < 1) {
            switch (kind) {
                case SongKind.Music:
                    this.stopMusic(0);
                    break;
                case SongKind.BackgroundSound:
                    break;
            }
            return;
        }
        switch (kind) {
            case SongKind.Music:
                this.isMusicNone = false;
                break;
            case SongKind.BackgroundSound:
                break;
        }
        if (this.currentHowl[kind] !== null) {
            this.currentHowl[kind].stop();
        }
        let song = Datas.Songs.get(kind, id);
        if (song) {
            let howl = song.howl;
            howl.volume(volume);
            howl.seek(start);
            howl.play();
            this.volumes[kind] = volume;
            this.starts[kind] = start;
            this.ends[kind] = end;
            this.currentHowl[kind] = howl;
        }
    }
    /**
     *  Stop a song.
     *  @static
     *  @param {SongKind} kind The kind of song to stop
     *  @param {number} time The date seconds value in the first call of stop
     *  @param {number} seconds The seconds needed for entirely stop the song
     *  @param {boolean} pause Indicates if the song needs to be paused instead
     *  of stoppped
     *  @returns {boolean} Indicates if the song is stopped
     */
    static stopSong(kind, time, seconds, pause = false) {
        let current = new Date().getTime();
        let ellapsedTime = current - time;
        let currentHowl = this.currentHowl[kind];
        if (currentHowl === null) {
            return true;
        }
        if (ellapsedTime >= (seconds * 1000)) {
            currentHowl.volume(0);
            if (pause) {
                currentHowl.pause();
            }
            else {
                currentHowl.stop();
                this.currentHowl[kind] = null;
            }
            return true;
        }
        else {
            currentHowl.volume((this.volumes[kind] * (100 - ((ellapsedTime /
                (seconds * 1000)) * 100))) / 100);
            return false;
        }
    }
    /**
     *  Unpause a song.
     *  @static
     *  @param {SongKind} kind The kind of song to unpause
     *  @param {number} time The date seconds value in the first call of
     *  unpause
     *  @param {number} seconds The seconds needed for entirely play the song
     *  @returns {boolean} Indicate if the song is played with all volume
     */
    static unpauseSong(kind, time, seconds) {
        let current = new Date().getTime();
        let ellapsedTime = current - time;
        let currentHowl = this.currentHowl[kind];
        if (currentHowl === null) {
            return true;
        }
        if (ellapsedTime >= (seconds * 1000)) {
            currentHowl.volume(this.volumes[kind]);
            return true;
        }
        else {
            currentHowl.volume(this.volumes[kind] * (ellapsedTime / (seconds *
                1000)));
            return false;
        }
    }
    /**
     *  Play a sound.
     *  @static
     *  @param {number} id The id of the sound
     *  @param {number} volume The volume of the sound
     */
    static playSound(id, volume) {
        if (id === -1) {
            return;
        }
        let sound = Datas.Songs.get(SongKind.Sound, id);
        if (sound) {
            let howl = new Howl({
                src: [sound.getPath()],
                volume: volume
            });
            howl.play();
        }
    }
    /**
     *  Play a music effect.
     *  @static
     *  @param {number} id The id of the sound
     *  @param {number} volume The volume of the sound
     *  @param {Record<string, any>} currentState The current state command
     */
    static playMusicEffect(id, volume, currentState) {
        if (id === -1 || currentState.end) {
            return true;
        }
        if (this.musicEffectStep === 0) {
            this.playMusic(SongKind.MusicEffect, id, volume, null, null);
            this.musicEffectStep++;
        }
        if (this.musicEffectStep === 1) {
            if (this.stopSong(SongKind.Music, currentState.timeStop, 0, true)) {
                this.musicEffectStep++;
            }
        }
        if (this.musicEffectStep === 2) {
            if (this.currentHowl[SongKind.MusicEffect] === null || !this
                .currentHowl[SongKind.MusicEffect].playing()) {
                if (this.currentHowl[SongKind.Music] !== null) {
                    this.currentHowl[SongKind.Music].play();
                }
                currentState.timePlay = new Date().getTime();
                this.musicEffectStep++;
            }
        }
        if (this.musicEffectStep === 3) {
            if (this.unpauseSong(SongKind.Music, currentState.timePlay, 0.5)) {
                this.musicEffectStep = 0;
                return true;
            }
        }
        return false;
    }
    /**
     *  Update songs positions or other stuff.
     *  @static
     *  @param {SongKind} kind The song kind
     */
    static updateByKind(kind) {
        let howl = this.currentHowl[kind];
        if (howl !== null && howl.playing()) {
            if (this.ends[kind] && howl.seek() >= this.ends[kind]) {
                howl.seek(this.starts[kind]);
            }
        }
    }
    /**
     *  Update songs positions or other stuffs.
     */
    static update() {
        this.updateByKind(SongKind.Music);
        this.updateByKind(SongKind.BackgroundSound);
        this.updateProgressionMusic();
    }
    /**
     *  Stop the music (with progression).
     *  @param {number} time The time to stop
     */
    static stopMusic(time) {
        this.isMusicNone = true;
        this.stopSong(SongKind.Music, time, 0, false);
        this.initializeProgressionMusic(this.currentHowl[SongKind.Music] ===
            null ? 0 : this.currentHowl[SongKind.Music].volume(), 0, 0, time);
    }
    /**
     *  Initialize progression music (for stop).
     *  @param {number} i The initial volume
     *  @param {number} f The final volume
     *  @param {number} equation The equation kind
     *  @param {number} end The end of the song
     */
    static initializeProgressionMusic(i, f, equation, end) {
        this.progressionMusic = ProgressionTable.createFromNumbers(i, f, equation);
        this.progressionMusicTime = new Date().getTime();
        this.progressionMusicEnd = end;
        this.isProgressionMusicEnd = false;
    }
    /**
     *  Update the progression music
     */
    static updateProgressionMusic() {
        if (!this.isProgressionMusicEnd) {
            let tick = new Date().getTime() - this.progressionMusicTime;
            if (tick >= this.progressionMusicEnd) {
                tick = this.progressionMusicEnd;
                this.isProgressionMusicEnd = true;
            }
            let howl = this.currentHowl[SongKind.Music];
            if (howl) {
                howl.volume(this.progressionMusic.getProgressionAt(tick, this
                    .progressionMusicEnd) / 100);
                if (howl.volume() === 0) {
                    howl.stop();
                }
                else if (!this.isMusicNone && !howl.playing()) {
                    howl.play();
                }
            }
        }
    }
    /**
     *  Stop all the songs
     */
    static stopAll() {
        if (this.currentHowl[SongKind.Music] !== null) {
            this.currentHowl[SongKind.Music].stop();
            this.currentHowl[SongKind.Music] = null;
        }
        if (this.currentHowl[SongKind.BackgroundSound] !== null) {
            this.currentHowl[SongKind.BackgroundSound].stop();
            this.currentHowl[SongKind.BackgroundSound] = null;
        }
        if (this.currentHowl[SongKind.MusicEffect] !== null) {
            this.currentHowl[SongKind.MusicEffect].stop();
            this.currentHowl[SongKind.MusicEffect] = null;
            this.musicEffectStep = 0;
        }
    }
}
Songs.musicEffectStep = 0;
Songs.isProgressionMusicEnd = true;
Songs.isMusicNone = true;
Songs.volumes = [];
Songs.starts = [];
Songs.ends = [];
Songs.currentHowl = [];
Songs.progressionMusic = null;
export { Songs };
