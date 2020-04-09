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
        this.id = json.id;
        this.name = json.name;
        this.length = json.l;
        this.width = json.w;
        this.height = json.h;
        this.depth = json.d;

        // Tileset: if not existing, by default select the first one
        this.tileset = $datasGame.tilesets.list[json.tileset];
        if (!this.tileset) {
            this.tileset = $datasGame.tilesets.list[1];
        }

        this.music = new SystemPlaySong(SongKind.Music);
        this.music.readJSON(json.music);
        this.backgroundSound = new SystemPlaySong(SongKind.BackgroundSound);
        this.backgroundSound.readJSON(json.bgs);
        this.cameraProperties = $datasGame.system.cameraProperties[SystemValue
            .readOrDefaultDatabase(json.cpi, 1).getValue()];
        this.backgroundColorID = new SystemValue();
        this.backgroundColorID.read(json.sky);
        this.updateBackgroundColor();
        var startupReactions = new SystemObject();
        startupReactions.readJSON(json.so);
        this.startupObject = new MapObject(startupReactions);
        this.startupObject.changeState();
    },

    updateBackgroundColor: function() {
        this.backgroundColor = $datasGame.system.colors[this.backgroundColorID
            .getValue()];
    }
}
