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
*   @property {SystemTileset[]} list List of all the tilesets of the game
*   according to ID
*/
class DatasTilesets
{
    constructor()
    {

    }

    // -------------------------------------------------------
    /** Read the JSON file associated to tilesets.
    */
    async read()
    {
        let json = (await RPM.parseFileJSON(RPM.FILE_TILESETS_DATAS)).list;
        let l = json.length;
        this.list = new Array(l+1);
        this.autotiles = {};
        this.walls = {};
        this.mountains = {};

        // Sorting all the tilesets according to the ID
        let i, jsonTileset, tileset, idString;
        for (i = 0; i < l; i++)
        {
            jsonTileset = json[i];
            tileset = new SystemTileset(jsonTileset);
            this.list[jsonTileset.id] = tileset;

            // Autotiles, walls
            idString = tileset.getAutotilesString();
            tileset.ownsAutotiles = this.autotiles.hasOwnProperty(idString);
            if (!tileset.ownsAutotiles)
            {
                this.autotiles[idString] = tileset;
            }
            idString = tileset.getMountainsString();
            tileset.ownsMountains = this.mountains.hasOwnProperty(idString);
            if (!tileset.ownsMountains)
            {
                this.mountains[idString] = tileset;
            }
            idString = tileset.getWallsString();
            tileset.ownsWalls = this.walls.hasOwnProperty(idString);
            if (!tileset.ownsWalls)
            {
                this.walls[idString] = tileset;
            }
            await tileset.loadSpecials();
        }

        // Load characters textures
        await this.loadPictures(PictureKind.Characters, "texturesCharacters");
        await this.loadPictures(PictureKind.Battlers, "texturesBattlers");
        await this.loadPictures(PictureKind.Objects3D, "texturesObjects3D");
    }

    // -------------------------------------------------------
    /** Load pictures
    *   @param {PictureKind} pictureKind The picture kind
    *   @param {string} texturesName The field name textures
    */
    async loadPictures(pictureKind, texturesName)
    {
        let pictures = RPM.datasGame.pictures.list[pictureKind];
        let l = pictures.length;
        let textures = new Array(l);
        textures[0] = RPM.loadTextureEmpty();
        let picture, path;
        for (let i = 1; i < l; i++)
        {
            picture = pictures[i];
            if (picture)
            {
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
    getTexturesAutotiles(tileset)
    {
        return this.autotiles[tileset.getAutotilesString()].texturesAutotiles;
    }

    // -------------------------------------------------------
    /** Get the mountains textures
    *   @param {SystemTileset} tileset The tileset
    *   @returns {THREE.Material[]}
    */
    getTexturesMountains(tileset)
    {
        return this.mountains[tileset.getMountainsString()].texturesMountains;
    }

    // -------------------------------------------------------
    /** Get the walls textures
    *   @param {SystemTileset} tileset The tileset
    *   @returns {THREE.Material[]}
    */
    getTexturesWalls(tileset)
    {
        return this.walls[tileset.getWallsString()].texturesWalls;
    }
}