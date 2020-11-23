/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   The manager for songs
*   @property {number} musicEffectStep The music effect step
*   @property {boolean} isProgressionMusicEnd Indicate if the progression music 
*   is end
*   @property {boolean} isMusicNone Indicate if music is none
*   @property {number[]} volumes Current volumes according to song kind
*   @property {number[]} starts Current starts time according to song kind
*   @property {number} ends The current ends time according to song kind
*   @property {Howl[]} currentSong The howl current song
*   @property {ProgressionTable} progressionMusic The system progression
*   music
*   @property {number} progressionMusicEnd The progression music end
*/
class SongsManager
{
    constructor()
    {
        this.musicEffectStep = 0;
        this.isProgressionMusicEnd = true;
        this.isMusicNone = true;
        let l = RPM.countFields(SongKind) - 1;
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
        this.currentSong = new Array(l);
        this.currentSong[SongKind.Music] = null;
        this.currentSong[SongKind.BackgroundSound] = null;
        this.currentSong[SongKind.MusicEffect] = null;
        this.progressionMusic = null;
    }

    // -------------------------------------------------------
    /** Play a music
    *   @param {SongKind} kind The kind of the song
    *   @param {number} id The id of the song
    *   @param {number} volume The volume of the song
    *   @param {number} start The start of the song
    *   @param {number} end The end of the song
    */
    playMusic(kind, id, volume, start, end)
    {
        if (id < 1)
        {
            switch (kind)
            {
            case SongKind.Music:
                this.stopMusic(0);
                break;
            case SongKind.BackgroundSound:
                break;
            }
            return;
        }
        switch (kind)
        {
        case SongKind.Music:
            this.isMusicNone = false;
            break;
        case SongKind.BackgroundSound:
            break;
        }
        if (this.currentSong[kind] !== null)
        {
            this.currentSong[kind].stop();
        }
        let song = RPM.datasGame.songs.get(kind, id);
        if (song)
        {
            song = song.song;
            song.volume(volume);
            song.seek(start);
            song.play();
            this.volumes[kind] = volume;
            this.starts[kind] = start;
            this.ends[kind] = end;
            this.currentSong[kind] = song;
        }
    }

    // -------------------------------------------------------
    /** Stop a song
    *   @param {SongKind} kind The kind of song to stop
    *   @param {number} time The date seconds value in the first call of stop
    *   @param {number} seconds The seconds needed for entirely stop the song
    *   @param {boolean} pause Indicates if the song needs to be paused instead
    *   of stoppped
    *   @returns {boolean} Indicates if the song is stopped
    */
    stopSong(kind, time, seconds, pause)
    {
        let current = new Date().getTime();
        let ellapsedTime = current - time;
        let currentSong = this.currentSong[kind];
        if (currentSong === null)
        {
            return true;
        }
        if (ellapsedTime >= (seconds * 1000))
        {
            currentSong.volume(0);
            if (pause)
            {
                currentSong.pause();
            }
            else
            {
                currentSong.stop();
                this.currentSong[kind] = null;
            }
            return true;
        }
        else
        {
            currentSong.volume((this.volumes[kind] * (100 - ((ellapsedTime /
                (seconds * 1000)) * 100))) / 100);
            return false;
        }
    }

    // -------------------------------------------------------
    /** Unpause a song
    *   @param {SongKind} kind The kind of song to unpause
    *   @param {number} time The date seconds value in the first call of
    *   unpause
    *   @param {number} seconds The seconds needed for entirely play the song
    *   @returns {boolean} Indicate if the song is played with all volume
    */
    unpauseSong(kind, time, seconds)
    {
        let current = new Date().getTime();
        let ellapsedTime = current - time;
        let currentSong = this.currentSong[kind];
        if (currentSong === null)
        {
            return true;
        }
        if (ellapsedTime >= (seconds * 1000))
        {
            currentSong.volume(this.volumes[kind]);
            return true;
        }
        else
        {
            currentSong.volume(this.volumes[kind] * (ellapsedTime / (seconds * 
                1000)));
            return false;
        }
    }

    // -------------------------------------------------------
    /** Play a sound
    *   @param {number} id The id of the sound
    *   @param {number} volume The volume of the sound
    */
    playSound(id, volume)
    {
        if (id === -1)
        {
            return;
        }
        let sound = RPM.datasGame.songs.list[SongKind.Sound][id];
        if (sound)
        {
            sound = new Howl({
                src: [sound.getPath()],
                volume: volume
            });
            sound.play();
        }
    }

    // -------------------------------------------------------
    /** Play a music effect
    *   @param {number} id The id of the sound
    *   @param {number} volume The volume of the sound
    *   @param {Object} currentState The current state command
    */
    playMusicEffect(id, volume, currentState)
    {
        if (id === -1 || currentState.end)
        {
            return true;
        }
        if (this.musicEffectStep === 0) 
        {
            this.playMusic(SongKind.MusicEffect, id, volume, null, null);
            this.musicEffectStep++;
        }
        if (this.musicEffectStep === 1) 
        {
            if (this.stopSong(SongKind.Music, currentState.timeStop, 0, true))
            {
                this.musicEffectStep++;
            }
        }
        if (this.musicEffectStep === 2)
        {
            if (this.currentSong[SongKind.MusicEffect] === null || !this
                .currentSong[SongKind.MusicEffect].playing()) 
            {
                if (this.currentSong[SongKind.Music] !== null)
                {
                    this.currentSong[SongKind.Music].play();
                }
                currentState.timePlay = new Date().getTime();
                this.musicEffectStep++;
            }
        }
        if (this.musicEffectStep === 3)
        {
            if (this.unpauseSong(SongKind.Music, currentState.timePlay, 0.5))
            {
                this.musicEffectStep = 0;
                return true;
            }
        }
        return false;
    }

    // -------------------------------------------------------
    /** Update songs positions or other stuff
    *   @param {SongKind} kind The song kind 
    */
    updateByKind(kind) 
    {
        let song = this.currentSong[kind];
        if (song !== null && song.playing()) 
        {
            if (this.ends[kind] && song.seek() >= this.ends[kind])
            {
                song.seek(this.starts[kind]);
            }
        }
    }

    // -------------------------------------------------------
    /** Update songs positions or other stuffs
    */
    update()
    {
        this.updateByKind(SongKind.Music);
        this.updateByKind(SongKind.BackgroundSound);
        this.updateProgressionMusic();
    }

    // -------------------------------------------------------
    /** Stop the music (with progression)
    *   @param {number} time The time to stop
    */
    stopMusic(time)
    {
        this.isMusicNone = true;
        this.stopSong(SongKind.Music, time, 0, false)
        this.initializeProgressionMusic(this.currentSong[SongKind.Music] ===  
            null ? 0 : this.currentSong[SongKind.Music].volume(), 0, 0, time);
    }

    // -------------------------------------------------------
    /** Initialize progression music (for stop)
    *   @param {number} i The initial volume
    *   @param {number} f The final volume
    *   @param {number} equation The equation kind
    *   @param {number} end The end of the song
    */
    initializeProgressionMusic(i, f, equation, end)
    {
        this.progressionMusic = ProgressionTable.create(i, f,
            equation);
        this.progressionMusicTime = new Date().getTime();
        this.progressionMusicEnd = end;
        this.isProgressionMusicEnd = false;
    }

    // -------------------------------------------------------
    /** Update the progression music
    */
    updateProgressionMusic()
    {
        if (!this.isProgressionMusicEnd)
        {
            let tick = new Date().getTime() - this.progressionMusicTime;
            if (tick >= this.progressionMusicEnd)
            {
                tick = this.progressionMusicEnd;
                this.isProgressionMusicEnd = true;
            }
            let song = this.currentSong[SongKind.Music];
            if (song)
            {
                song.volume(this.progressionMusic.getProgressionAt(tick, this
                    .progressionMusicEnd) / 100);
                if (song.volume() === 0) 
                {
                    song.stop();
                } else if (!this.isMusicNone && !song.playing()) 
                {
                    song.play();
                }
            }
        }
    }

    // -------------------------------------------------------
    /** Stop all the songs
    */
    stopAll() 
    {
        if (this.currentSong[SongKind.Music] !== null)
        {
            this.currentSong[SongKind.Music].stop();
            this.currentSong[SongKind.Music] = null;
        }
        if (this.currentSong[SongKind.BackgroundSound] !== null)
        {
            this.currentSong[SongKind.BackgroundSound].stop();
            this.currentSong[SongKind.BackgroundSound] = null;
        }
        if (this.currentSong[SongKind.MusicEffect] !== null)
        {
            this.currentSong[SongKind.MusicEffect].stop();
            this.currentSong[SongKind.MusicEffect] = null;
            this.musicEffectStep = 0;
        }
    }
}