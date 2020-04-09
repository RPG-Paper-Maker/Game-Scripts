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
//  CLASS DatasTilesets
//
// -------------------------------------------------------

/** @class
*   All the tilesets datas.
*   @property {SystemTileset[]} list List of all the tilesets of the game
*   according to ID.
*/
function DatasTilesets(){

}

DatasTilesets.prototype = {

    /** Read the JSON file associated to tilesets.
    */
    read: function(){
        RPM.openFile(this, RPM.FILE_TILESETS_DATAS, true, function(res){
            var json = JSON.parse(res).list;
            var i, l = json.length, idString, tileset;
            this.list = new Array(l+1);
            this.autotiles = {};
            this.walls = {};
            this.mountains = {};
            this.loading = [];

            // Sorting all the tilesets according to the ID
            for (i = 0; i < l; i++){
                var jsonTileset = json[i];
                var id = jsonTileset.id;
                tileset = new SystemTileset();
                tileset.readJSON(jsonTileset);
                this.list[id] = tileset;

                // Autotiles, walls
                idString = tileset.getAutotilesString();
                tileset.ownsAutotiles = this.autotiles.hasOwnProperty(idString);
                if (!tileset.ownsAutotiles) {
                    this.autotiles[idString] = tileset;
                }
                idString = tileset.getMountainsString();
                tileset.ownsMountains = this.mountains.hasOwnProperty(idString);
                if (!tileset.ownsMountains) {
                    this.mountains[idString] = tileset;
                }
                idString = tileset.getWallsString();
                tileset.ownsWalls = this.walls.hasOwnProperty(idString);
                if (!tileset.ownsWalls) {
                    this.walls[idString] = tileset;
                }
                if (!tileset.ownsAutotiles || !tileset.ownsMountains ||!tileset
                    .ownsWalls)
                {
                    this.loading.push(tileset);
                }

                tileset.callback = tileset.loadSpecials;
            }

            // Load characters textures
            this.loadPictures(PictureKind.Characters, "texturesCharacters");
            this.loadPictures(PictureKind.Battlers, "texturesBattlers");
            this.loadPictures(PictureKind.Objects3D, "texturesObjects3D");
        });
    },

    // -------------------------------------------------------

    /** Load pictures.
    *   @param {PictureKind} pictureKind The picure kind.
    *   @param {string} texturesName The field name textures.
    */
    loadPictures: function(pictureKind, texturesName){
        var pictures = $datasGame.pictures.list[pictureKind], picture;
        var l = pictures.length;
        var textures = new Array(l);
        var paths;

        textures[0] = RPM.loadTextureEmpty();
        for (var i = 1; i < l; i++){
            picture = pictures[i];
            if (picture) {
                paths = picture.getPath(pictureKind);
                if (paths) {
                    textures[i] = RPM.loadTexture(paths, picture);
                } else {
                    textures[i] = RPM.loadTextureEmpty();
                }
            } else {
                textures[i] = RPM.loadTextureEmpty();
            }
        }

        this[texturesName] = textures;
    },

    // -------------------------------------------------------

    getTexturesAutotiles: function(tileset) {
        return this.autotiles[tileset.getAutotilesString()].texturesAutotiles;
    },

    // -------------------------------------------------------

    getTexturesMountains: function(tileset) {
        return this.mountains[tileset.getMountainsString()].texturesMountains;
    },

    // -------------------------------------------------------

    getTexturesWalls: function(tileset){
        return this.walls[tileset.getWallsString()].texturesWalls;
    }
}
