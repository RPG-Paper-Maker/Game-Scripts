/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

// -------------------------------------------------------
//
//  CLASS MapInfos
//
// -------------------------------------------------------

/** @class
*   The properties of a map.
*/
function MapInfos() {

}

MapInfos.prototype = {

    /** Read the JSON associated to the map infos.
    *   @param {Object} json Json object describing the object.
    */
    read: function(json, map, callback) {
        this.name = json.name;
        this.length = json.l;
        this.width = json.w;
        this.height = json.h;
        this.depth = json.d;
        this.tileset = $datasGame.tilesets.list[json.tileset];
        this.music = new SystemPlaySong(SongKind.Music);
        this.music.readJSON(json.music);
        this.backgroundSound = new SystemPlaySong(SongKind.BackgroundSound);
        this.backgroundSound.readJSON(json.bgs);
        this.backgroundColorID = new SystemValue();
        this.backgroundColorID.read(json.sky);
        this.updateBackgroundColor();
    },

    updateBackgroundColor: function() {
        this.backgroundColor = $datasGame.system.colors[this.backgroundColorID
            .getValue()];
    }
}
