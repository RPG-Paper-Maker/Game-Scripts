/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
                if (!this.autotiles.hasOwnProperty(idString)) {
                    this.autotiles[idString] = tileset;
                    this.loading.push(tileset);
                    tileset.loadAutotiles();
                }
                idString = tileset.getWallsString();
                if (!this.walls.hasOwnProperty(idString)) {
                    this.walls[idString] = tileset;
                    tileset.loadWalls();
                }
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
            paths = picture.getPath(pictureKind);
            textures[i] = RPM.loadTexture(paths, picture);
        }

        this[texturesName] = textures;
    },

    // -------------------------------------------------------

    getTexturesAutotiles: function(tileset){
        return this.autotiles[tileset.getAutotilesString()].texturesAutotiles;
    },

    // -------------------------------------------------------

    getTexturesWalls: function(tileset){
        return this.walls[tileset.getWallsString()].texturesWalls;
    }
}
