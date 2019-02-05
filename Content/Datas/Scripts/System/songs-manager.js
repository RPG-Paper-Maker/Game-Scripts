/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

// -------------------------------------------------------
//
//  CLASS SongsManager
//
// -------------------------------------------------------

/** @class
*   The manager for songs.
*/
function SongsManager(musicPlayer, backgroundPlayer, musicEffects,
                      soundsPlayers)
{
    this.musics = musicPlayer;
    this.backgroundSounds = backgroundPlayer;
    this.musicEffects = musicEffects;
    this.sounds = soundsPlayers;
    this.soundIndex = 0;
    this.musicEffectStep = 0;

    var l = RPM.countFields(SongKind) - 1;
    this.volumes = new Array(l);
    this.volumes[SongKind.Music] = 0;
    this.volumes[SongKind.BackgroundSound] = 0;
    this.volumes[SongKind.MusicEffect] = 0;
    this.starts = new Array(l);
    this.starts[SongKind.Music] = null;
    this.starts[SongKind.BackgroundSound] = null;
    this.starts[SongKind.MusicEffect] = null;
    this.ends = new Array(l);
    this.ends[SongKind.Music] = null;
    this.ends[SongKind.BackgroundSound] = null;
    this.ends[SongKind.MusicEffect] = null;
}

SongsManager.prototype = {

    /** Get the player according to the song kind.
    *   @param {SongKind} kind The kind of song.
    *   @returns {Audio}
    */
    getPlayer: function(kind) {
        switch (kind) {
        case SongKind.Music:
            return this.musics;
        case SongKind.BackgroundSound:
            return this.backgroundSounds;
        case SongKind.MusicEffect:
            return this.musicEffects;
        default:
            return null;
        }
    },

    // -------------------------------------------------------

    /** Add songs on the playlist
    *   @param {SongKind} kind The kind of song to add.
    *   @param {SystemSong[]} songs The list of songs to add.
    */
    addSongs: function(kind, songs) {
        var player = this.getPlayer(kind);
        if (!player)
            return;

        var song, i, l = songs.length;
        var paths = new Array(l + 1);
        for (i = 0; i < l; i++) {
            song = songs[i];
            paths[song.id === -1 ? 0 : song.id] = song.getPath(kind)[0];
        }
        player.playlist.addItems(paths);
    },

    // -------------------------------------------------------

    /** Play a song.
    *   @param {SongKind} kind The kind of song to add.
    *   @param {number} id The id of the song.
    */
    playSong: function(kind, id, volume, start, end) {
        var player = this.getPlayer(kind);
        if (!player)
            return;

        this.volumes[kind] = volume;
        player.volume = volume;
        this.starts[kind] = start * 1000;
        this.ends[kind] = end * 1000;
        if (id === -1) {
            player.stop();
        }
        else {
            player.playlist.currentIndex = id;
            player.seek(this.starts[kind]);
            player.play();
        }
    },

    // -------------------------------------------------------

    /** Stop a song.
    *   @param {SongKind} kind The kind of song to stop.
    *   @param {number} time The date seconds value in the first call of stop.
    *   @param {number} seconds The seconds needed for entirely stop the song.
    *   @param {boolean} pause Indicates if the song needs to be paused instead
    *   of stoppped.
    *   @returns {boolean} Indicates if the song is stopped.
    */
    stopSong: function(kind, time, seconds, pause) {
        var player = this.getPlayer(kind);
        if (!player)
            return true;

        var current = new Date().getTime();
        var ellapsedTime = current - time;

        if (ellapsedTime >= (seconds * 1000)) {
            player.volume = 0;
            if (pause) {
                player.pause();
            }
            else {
                player.stop();
            }
            return true;
        }
        else {
            player.volume = (this.volumes[kind] * (100 - ((ellapsedTime /
                (seconds * 1000)) * 100))) / 100;
            return false;
        }
    },

    // -------------------------------------------------------

    /** Unpause a song.
    *   @param {SongKind} kind The kind of song to unpause.
    *   @param {number} time The date seconds value in the first call of
    *   unpause.
    *   @param {number} seconds The seconds needed for entirely play the song.
    *   @returns {boolean} Indicates if the song is played with all volume.
    */
    unpauseSong: function(kind, time, seconds) {
        var player = this.getPlayer(kind);
        if (!player)
            return true;

        var current = new Date().getTime();
        var ellapsedTime = current - time;

        if (ellapsedTime >= (seconds * 1000)) {
            player.volume = this.volumes[kind];
            return true;
        }
        else {
            player.volume = this.volumes[kind] * (ellapsedTime /
                (seconds * 1000));
            return false;
        }
    },

    // -------------------------------------------------------

    /** Play a sound.
    *   @param {number} id The id of the sound.
    *   @param {number} volume The volume of the sound.
    */
    playSound: function(id, volume) {
        if (id === -1)
            return;

        var player = this.sounds[this.soundIndex++];
        player.volume = volume;
        player.source = $datasGame.songs.list[SongKind.Sound][id]
            .getPath(SongKind.Sound)[0];
        player.play();
        if (this.soundIndex === 5)
            this.soundIndex = 0;
    },

    // -------------------------------------------------------

    /** Play a music effect.
    *   @param {number} id The id of the sound.
    *   @param {number} volume The volume of the sound.
    */
    playMusicEffect: function(id, volume, currentState) {
        if (id === -1)
            return;

        if (this.musicEffectStep === 0) {
            this.playSong(SongKind.MusicEffect, id, volume, null, null);
            this.musicEffectStep++;
        }
        if (this.musicEffectStep === 1) {
            if (this.stopSong(SongKind.Music, currentState.timeStop, 0.5,
                              true))
            {
                this.musicEffectStep++;
            }
        }
        if (this.musicEffectStep === 2) {
            if (this.musicEffects.playbackState === Audio.StoppedState) {
                this.musics.play();
                currentState.timePlay = new Date().getTime();
                this.musicEffectStep++;
            }
        }
        if (this.musicEffectStep === 3) {
            if (this.unpauseSong(SongKind.Music, currentState.timePlay,
                                 0.5))
            {
                this.musicEffectStep = 0;
                return true;
            }
        }

        return false;
    },

    // -------------------------------------------------------

    /** Update songs positions or other stuffs.
    */
    updateByKind: function(kind) {
        var player = this.getPlayer(kind);
        if (player.playbackState === Audio.PlayingState) {
            if (this.ends[kind] && player.position >= this.ends[kind]) {
                player.seek(this.starts[kind]);
            }
        }
    },

    // -------------------------------------------------------

    /** Update songs positions or other stuffs.
    */
    update: function() {
        this.updateByKind(SongKind.Music);
        this.updateByKind(SongKind.BackgroundSound);
    }
}
