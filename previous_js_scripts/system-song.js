/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A song of the game
*   @property {SongKind} kind The kind of song
*   @property {number} id The song ID
*   @property {string} name The song name
*   @property {boolean} isBR Indicate if the pciture is a BR (Basic Ressource)
*   @property {boolean} isDLC Indicate if the pciture is a DLC
*   @property {Howl} song The loaded Howl song
*   @param {Object} [json=undefined] Json object describing the song
*   @param {SongKind} [kind=SongKind.Music] The kind of song
*/
class SystemSong
{
    constructor(json, kind = SongKind.Music)
    {
        this.kind = kind;
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Get the folder associated to a kind of song
    *   @static
    *   @param {SongKind} kind The kind of song
    *   @param {boolean} isBR Indicate if the pciture is a BR
    *   @param {boolean} isDLC Indicate if the pciture is a DLC
    *   @returns {string}
    */
    static getFolder(kind, isBR, dlc)
    {
        return (isBR ? RPM.PATH_BR : (dlc ? RPM.PATH_DLCS + RPM.STRING_SLASH + 
            dlc : RPM.ROOT_DIRECTORY_LOCAL)) + SystemSong.getLocalFolder(kind);
    }

    // -------------------------------------------------------
    /** Get the local folder associated to a kind of song
    *   @param {SongKind} kind The kind of song
    *   @returns {string}
    */
    static getLocalFolder = function(kind)
    {
        switch(kind)
        {
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
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the song
    *   @param {Object} json Json object describing the song
    */
    read(json)
    {
        this.id = json.id;
        this.name = json.name;
        this.isBR = json.br;
        this.dlc = RPM.defaultValue(json.d, RPM.STRING_EMPTY);
    }

    // -------------------------------------------------------
    /** Get the absolute path associated to this song
    *   @returns {string}
    */
    getPath()
    {
        return SystemSong.getFolder(this.kind, this.isBR, this.dlc) + RPM
            .STRING_SLASH + this.name;
    }

    // -------------------------------------------------------
    /** Load the song
    */
    load()
    {
        if (this.id !== -1)
        {
            this.song = new Howl({
                src: [this.getPath()],
                loop: this.kind !== SongKind.MusicEffect,
                html5: true
            });
        }
    }
}