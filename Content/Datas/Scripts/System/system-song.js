/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

/**
*   Enum for the different songs kind.
*   @enum {number}
*   @readonly
*/
var SongKind = {
    None: 0,
    Music: 1,
    BackgroundSound: 2,
    Sound: 3,
    MusicEffect: 4
};
Object.freeze(SongKind);

// -------------------------------------------------------
//
//  CLASS SystemSong
//
// -------------------------------------------------------

/** @class
*   A song of the game.
*   @property {boolean} isBR Indicate if the pciture is a BR (Basic Ressource).
*/
function SystemSong(){

}

/** Get the folder associated to a kind of song.
*   @param {SongKind} kind The kind of song.
*   @param {boolean} isBR Indicate if the pciture is a BR.
*   @returns {string}
*/
SystemSong.getFolder = function(kind, isBR){
    var folder = isBR ? RPM.PATH_BR : $ROOT_DIRECTORY_LOCAL;
    var dir = SystemSong.getLocalFolder(kind);

    return folder + dir;
};

// -------------------------------------------------------

/** Get the local folder associated to a kind of song.
*   @param {SongKind} kind The kind of song.
*   @returns {string}
*/
SystemSong.getLocalFolder = function(kind){

    switch(kind){
    case SongKind.Music:
        return RPM.PATH_MUSICS;
    case SongKind.BackgroundSound:
        return RPM.PATH_BACKGROUND_SOUNDS;
    case SongKind.Sound:
        return RPM.PATH_SOUNDS;
    case SongKind.MusicEffect:
        return RPM.PATH_MUSIC_EFFECTS;
    }

    return "";
};

// -------------------------------------------------------

SystemSong.prototype = {

    /** Read the JSON associated to the song.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        this.id = json.id;
        this.name = json.name;
        this.isBR = json.br;
    },

    // -------------------------------------------------------

    /** Get the absolute path associated to this Song.
    *   @param {SongKind} kind The kind of song.
    *   @returns {string}
    */
    getPath: function(kind) {
        return SystemSong.getFolder(kind, this.isBR) + "/" + this.name;
    }
}
