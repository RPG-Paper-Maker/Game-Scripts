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
