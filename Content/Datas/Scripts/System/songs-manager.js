/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    this.isProgressionMusicEnd = true;
    this.isMusicNone = true;

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

    this.progressionMusic = null;
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
        var song;
        if (id === -1)
            return;

        var player = this.sounds[this.soundIndex++];
        player.stop();
        player.volume = volume;
        song = $datasGame.songs.list[SongKind.Sound][id];
        if (song)
        {
            player.source = song.getPath(SongKind.Sound)[0];
            player.play();
        }
        if (this.soundIndex === 10) {
            this.soundIndex = 0;
        }
    },

    // -------------------------------------------------------

    /** Play a music effect.
    *   @param {number} id The id of the sound.
    *   @param {number} volume The volume of the sound.
    */
    playMusicEffect: function(id, volume, currentState) {
        if (id === -1 || currentState.end)
            return true;

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
        this.updateProgressionMusic();
    },

    // -------------------------------------------------------

    stopMusic: function(time) {
        this.isMusicNone = true;
        this.stopSong(SongKind.Music, time, 0, false);
        this.initializeProgressionMusic(this.musics.volume, 0, 0, time);
    },

    // -------------------------------------------------------

    initializeProgressionMusic: function(i, f, equation, end) {
        this.progressionMusic = SystemProgressionTable.createProgression(i, f,
            equation);
        this.progressionMusicTime = new Date().getTime();
        this.progressionMusicEnd = end;
        this.isProgressionMusicEnd = false;
    },

    // -------------------------------------------------------

    updateProgressionMusic: function() {
        if (!this.isProgressionMusicEnd) {
            var tick = new Date().getTime() - this.progressionMusicTime;
            if (tick >= this.progressionMusicEnd) {
                tick = this.progressionMusicEnd;
                this.isProgressionMusicEnd = true;
            }
            this.musics.volume = this.progressionMusic.getProgressionAt(
                tick, this.progressionMusicEnd) / 100;
            if (this.musics.volume === 0) {
                this.musics.stop();
            } else if (!this.isMusicNone) {
                this.musics.play();
            }
        }
    }
}
