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
//  CLASS SystemPlaySong
//
// -------------------------------------------------------

/** @class
*/
function SystemPlaySong(kind) {
    this.kind = kind;
}

SystemPlaySong.previousMusicStopped = null;
SystemPlaySong.previousMusic = null;
SystemPlaySong.currentPlayingMusic = null;
SystemPlaySong.previousMusicStoppedTime = 0;

// -------------------------------------------------------

SystemPlaySong.prototype = {

    /** Read the JSON associated to the play song.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
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

    playSong: function(previous, start, volume) {
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
            if (previous) {
                SystemPlaySong.previousMusicStoppedTime = $songsManager
                    .getPlayer(this.kind).position / 1000;
                SystemPlaySong.previousMusicStopped = SystemPlaySong
                    .currentPlayingMusic;
            }
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
