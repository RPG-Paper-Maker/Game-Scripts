/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A way to play a song
*   @param {SongKind} kind The kind of song to play
*   @param {Object} [json=undefined] Json object describing the play song
*/
class SystemPlaySong
{
    /** The music that was previously played (before the current)
    *   @member {number} [SystemPlaySong.previousMusic=null]
    */
    static previousMusic = null;
    /** The current playing music
    *   @member {number} [SystemPlaySong.currentPlayingMusic=null]
    */
    static currentPlayingMusic = null;

    constructor(kind, json)
    {
        this.kind = kind;
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the play song
    *   @param {Object} json Json object describing the play song
    */
    read(json)
    {
        if (!json)
        {
            this.setDefault();
            return;
        }
        this.songID = json.isbi ? SystemValue.create(json.vid) : 
        this.volume = SystemValue.create(json.v);
        this.isStart = json.is;
        this.start = this.isStart ? SystemValue.create(json.s) : SystemValue
            .createNumber(0);
        this.isEnd = json.ie;
        this.end = this.isEnd ? SystemValue.create(json.e) : SystemValue
            .createNumber(0);
    }

    // -------------------------------------------------------
    /** Set song play to default values
    */
    setDefault()
    {
        this.songID = SystemValue.createNumber(-1);
        this.volume = SystemValue.createNumber(100);
        this.isStart = false;
        this.isEnd = false;
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the play song
    *   @returns {Object}
    */
    initialize()
    {
        return this.kind === SongKind.MusicEffect ? {
            parallel: false,
            timeStop: new Date().getTime()
        } : null;
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the play song
    *   @param {SystemValue} songID The song ID
    *   @param {SystemValue} volume The volume to play
    *   @param {boolean} isStart Indicate if there's a start value
    *   @param {SystemValue} start The start of the song to play
    *   @param {boolean} isEnd Indicate if there's a end value
    *   @param {SystemValue} end The end of the song to play
    */
    updateValues(songID, volume, isStart, start, isEnd, end)
    {
        this.songID = songID;
        this.volume = volume;
        this.isStart = isStart;
        this.start = start;
        this.isEnd = isEnd;
        this.end = end;
    }

    // -------------------------------------------------------
    /** Play the music
    *   @param {number} [start=undefined] The start of the song to play
    *   @param {number} [volume=undefined] The volume to play
    */
    playMusic(start, volume)
    {
        if (RPM.isUndefined(start))
        {
            start = this.start ? this.start.getValue() : null;
        }
        if (RPM.isUndefined(volume))
        {
            volume = this.volume.getValue() / 100;
        }

        // If same music ID and same
        if (SystemPlaySong.currentPlayingMusic !== null && this.songID
            .getValue() === SystemPlaySong.currentPlayingMusic.songID
            .getValue() && start === SystemPlaySong.currentPlayingMusic.start
            .getValue())
        {
            return 1;
        }
        // Update current and previous played music
        if (this.kind === SongKind.Music)
        {
            SystemPlaySong.previousMusic = SystemPlaySong.currentPlayingMusic;
            SystemPlaySong.currentPlayingMusic = this;
        }
        RPM.songsManager.playMusic(this.kind, this.songID.getValue(), volume, 
            start, this.end ? this.end.getValue() : null);
        return 1;
    }

    // -------------------------------------------------------
    /** Play the sound
    */
    playSound()
    {
        RPM.songsManager.playSound(this.songID.getValue(), this.volume
            .getValue() / 100);
    }

    // -------------------------------------------------------
    /** Play the music effect and return the next node value
    *   @param {Object} currentState The current state of the playing music 
    *   effect
    *   @returns {number}
    */
    playMusicEffect(currentState)
    {
        let played = RPM.songsManager.playMusicEffect(this.songID.getValue(),
            this.volume.getValue() / 100, currentState);
        currentState.end = played;
        return currentState.parallel ? (played ? 1 : 0) : 1;
    }
}