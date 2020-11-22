/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *   All the tilesets datas
 *   @property {string} [DatasTilesets.PROPERTY_TEXTURES_CHARACTERS="texturesCharacter"]
 *   Property string used for textures characters
 *   @property {string} [DatasTilesets.PROPERTY_TEXTURES_BATTLERS="texturesBattlers"]
 *   Property string used for textures battlers
 *   @property {string} [DatasTilesets.PROPERTY_TEXTURES_OBJECTS_3D="texturesObjects3D"]
 *   Property string used for textures 3D objects
 *   @property {SystemTileset[]} list List of all the tilesets of the game
 *   according to ID
 *   @property {Object} autotiles Tilesets according to string autotiles
 *   @property {Object} walls Tilesets according to string walls
 *   @property {Object} mountains Tilesets according to string mountains
 *   @property {THREE.Material[]} texturesCharacters The textures for character
 *   @property {THREE.Material[]} texturesBattlers The textures for battlers
 *   @property {THREE.Material[]} texturesObjects3D The textures for 3D objects
 */
class DatasTilesets {
    static PROPERTY_TEXTURES_CHARACTERS = "texturesCharacters";
    static PROPERTY_TEXTURES_BATTLERS = "texturesBattlers";
    static PROPERTY_TEXTURES_OBJECTS_3D = "texturesObjects3D";

    constructor() {

    }

    // -------------------------------------------------------
    /** Read the JSON file associated to tilesets
     */
    async read() {
        let json = (await RPM.parseFileJSON(RPM.FILE_TILESETS_DATAS)).list;
        let l = json.length;
        this.list = new Array(l + 1);
        this.autotiles = {};
        this.walls = {};
        this.mountains = {};

        // Sorting all the tilesets according to the ID
        let i, jsonTileset, tileset, idString;
        for (i = 0; i < l; i++) {
            jsonTileset = json[i];
            tileset = new SystemTileset(jsonTileset);
            this.list[jsonTileset.id] = tileset;

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
            await tileset.loadSpecials();
        }
        await this.loadPictures(PictureKind.Characters, DatasTilesets
            .PROPERTY_TEXTURES_CHARACTERS);
        await this.loadPictures(PictureKind.Battlers, DatasTilesets
            .PROPERTY_TEXTURES_BATTLERS);
        await this.loadPictures(PictureKind.Objects3D, DatasTilesets
            .PROPERTY_TEXTURES_OBJECTS_3D);
    }

    // -------------------------------------------------------
    /** Load pictures
     *   @param {PictureKind} pictureKind The picture kind
     *   @param {string} texturesName The field name textures
     */
    async loadPictures(pictureKind, texturesName) {
        let pictures = RPM.datasGame.pictures.list[pictureKind];
        let l = pictures.length;
        let textures = new Array(l);
        textures[0] = RPM.loadTextureEmpty();
        let picture, path;
        for (let i = 1; i < l; i++) {
            picture = pictures[i];
            if (picture) {
                path = picture.getPath();
                textures[i] = path ? (await RPM.loadTexture(path)) : RPM
                    .loadTextureEmpty();
            } else {
                textures[i] = RPM.loadTextureEmpty();
            }
        }
        this[texturesName] = textures;
    }

    // -------------------------------------------------------
    /** Get the autotiles textures
     *   @param {SystemTileset} tileset The tileset
     *   @returns {THREE.Material[]}
     */
    getTexturesAutotiles(tileset) {
        return this.autotiles[tileset.getAutotilesString()].texturesAutotiles;
    }

    // -------------------------------------------------------
    /** Get the mountains textures
     *   @param {SystemTileset} tileset The tileset
     *   @returns {THREE.Material[]}
     */
    getTexturesMountains(tileset) {
        return this.mountains[tileset.getMountainsString()].texturesMountains;
    }

    // -------------------------------------------------------
    /** Get the walls textures
     *   @param {SystemTileset} tileset The tileset
     *   @returns {THREE.Material[]}
     */
    getTexturesWalls(tileset) {
        return this.walls[tileset.getWallsString()].texturesWalls;
    }
}