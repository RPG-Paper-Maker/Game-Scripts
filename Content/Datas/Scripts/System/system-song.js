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
    var folder = isBR ? RPM.PATH_BR : RPM.ROOT_DIRECTORY_LOCAL;
    var folderLocal = isBR ? RPM.PATH_BR : RPM.ROOT_DIRECTORY_LOCAL;
    var dir = SystemSong.getLocalFolder(kind);
    var path = folder + dir;
    var pathLocal = folderLocal + dir;

    return [path, pathLocal];
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
        var paths = SystemSong.getFolder(kind, this.isBR);
        paths[0] += "/" + this.name;
        paths[1] += "/" + this.name;

        return paths;
    },

    // -------------------------------------------------------

    load: function(kind)
    {
        if (this.id !== -1)
        {
            this.song = new Howl({
                src: [this.getPath(kind)[0]],
                loop: kind !== SongKind.MusicEffect
            });
        }
    }
}
