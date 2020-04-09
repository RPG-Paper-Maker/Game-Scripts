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
//  CLASS SystemPlaySong
//
// -------------------------------------------------------

/** @class
*/
function SystemPlaySong(kind) {
    this.kind = kind;
}

SystemPlaySong.previousMusic = null;
SystemPlaySong.currentPlayingMusic = null;

// -------------------------------------------------------

SystemPlaySong.prototype = {

    setDefault: function() {
        this.songID = SystemValue.createNumber(-1);
        this.volume = SystemValue.createNumber(100);
        this.isStart = false;
        this.isEnd = false;
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the play song.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        if (!json) {
            this.setDefault();
            return;
        }

        // Parse
        var id = json.id;
        var isSelectedByID = json.isbi;
        if (this.isSelectedByID) {
            this.songID = new SystemValue();
            this.songID.read(json.vid);
        } else {
            this.songID = SystemValue.createNumber(id);
        }

        this.volume = new SystemValue();
        this.volume.read(json.v);
        this.isStart = json.is;
        if (this.isStart) {
            this.start = new SystemValue();
            this.start.read(json.s);
        } else {
            this.start = SystemValue.createNumber(0);
        }
        this.isEnd = json.ie;
        if (this.isEnd) {
            this.end = new SystemValue();
            this.end.read(json.e);
        } else {
            this.end = SystemValue.createNumber(0);
        }
    },

    // -------------------------------------------------------

    initialize: function() {
        return this.kind === SongKind.MusicEffect ? {
            parallel: false,
            timeStop: new Date().getTime()
        } : null;
    },

    // -------------------------------------------------------

    updateValues: function(songID, volume, isStart, start, isEnd, end) {
        this.songID = songID;
        this.volume = volume;
        this.isStart = isStart;
        this.start = start;
        this.isEnd = isEnd;
        this.end = end;
    },

    // -------------------------------------------------------

    playSong: function(start, volume) {
        if (typeof start === 'undefined') {
            start = this.start ? this.start.getValue() : null;
        }
        if (typeof volume === 'undefined') {
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

        if (this.kind === SongKind.Music) {
            SystemPlaySong.previousMusic = SystemPlaySong.currentPlayingMusic;
            SystemPlaySong.currentPlayingMusic = this;
        }

        $songsManager.playSong(this.kind, this.songID.getValue(), volume, start,
            this.end ? this.end.getValue() : null);

        return 1;
    },

    // -------------------------------------------------------

    playSound: function() {
        $songsManager.playSound(this.songID.getValue(), this.volume.getValue() /
            100);
    },

    // -------------------------------------------------------

    playMusicEffect: function(currentState) {
        var played = $songsManager.playMusicEffect(this.songID.getValue(),
            this.volume.getValue() / 100, currentState);
        currentState.end = played;
        return currentState.parallel ? (played ? 1 : 0) : 1;
    }
}
