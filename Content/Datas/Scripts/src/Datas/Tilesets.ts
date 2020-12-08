/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { IO, Paths, Enum } from "../Common";
import { System, Datas, Manager } from "..";
import PictureKind = Enum.PictureKind;
import { THREE } from "../../Libs";
import { TextureBundle } from "../Core";

/** @class
 *  All the tilesets datas.
 *  @property {string} [DatasTilesets.PROPERTY_TEXTURES_CHARACTERS="texturesCharacter"] 
 *  Property string used for textures characters
 *  @property {string} [DatasTilesets.PROPERTY_TEXTURES_BATTLERS="texturesBattlers"] 
 *  Property string used for textures battlers
 *  @property {string} [DatasTilesets.PROPERTY_TEXTURES_OBJECTS_3D="texturesObjects3D"] 
 *  Property string used for textures 3D objects
 *  @property {Tileset[]} list List of all the tilesets of the game
 *  according to ID
 *  @property {Object} autotiles Tilesets according to string autotiles
 *  @property {Object} walls Tilesets according to string walls
 *  @property {Object} mountains Tilesets according to string mountains
 *  @property {THREE.Material[]} texturesCharacters The textures for character
 *  @property {THREE.Material[]} texturesBattlers The textures for battlers
 *  @property {THREE.Material[]} texturesObjects3D The textures for 3D objects
 */
class Tilesets {

    public static PROPERTY_TEXTURES_CHARACTERS = "texturesCharacters";
    public static PROPERTY_TEXTURES_BATTLERS = "texturesBattlers";
    public static PROPERTY_TEXTURES_OBJECTS_3D = "texturesObjects3D";
    private static list: System.Tileset[];
    private static autotiles: Record<string, System.Tileset>;
    private static walls: Record<string, System.Tileset>;
    private static mountains: Record<string, System.Tileset>;

    constructor() {

    }

    /** 
     *  Read the JSON file associated to tilesets.
     */
    static async read() {
        let json = (await IO.parseFileJSON(Paths.FILE_TILESETS)).list;
        let l = json.length;
        this.list = new Array(l+1);
        this.autotiles = {};
        this.walls = {};
        this.mountains = {};

        // Sorting all the tilesets according to the ID
        let i: number, jsonTileset: Record<string, any>, tileset: System.Tileset
            , idString: string;
        for (i = 0; i < l; i++) {
            jsonTileset = json[i];
            tileset = new System.Tileset(jsonTileset);
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
        await this.loadPictures(PictureKind.Characters, Datas.Tilesets
            .PROPERTY_TEXTURES_CHARACTERS);
        await this.loadPictures(PictureKind.Battlers, Datas.Tilesets
            .PROPERTY_TEXTURES_BATTLERS);
        await this.loadPictures(PictureKind.Objects3D, Datas.Tilesets
            .PROPERTY_TEXTURES_OBJECTS_3D);
    }

    /** 
     *  Load pictures.
     *  @param {PictureKind} pictureKind The picture kind
     *  @param {string} texturesName The field name textures
     */
    static async loadPictures(pictureKind: PictureKind, texturesName: string) {
        let pictures = Datas.Pictures.getListByKind(pictureKind);
        let l = pictures.length;
        let textures = new Array(l);
        textures[0] = Manager.GL.loadTextureEmpty();
        let picture: System.Picture, path: string;
        for (let i = 1; i < l; i++) {
            picture = pictures[i];
            if (picture) {
                path = picture.getPath();
                textures[i] = path ? (await Manager.GL.loadTexture(path)) : 
                    Manager.GL.loadTextureEmpty();
            } else {
                textures[i] = Manager.GL.loadTextureEmpty();
            }
        }
        this[texturesName] = textures;
    }

    /** 
     *  Get the autotiles textures.
     *  @param {System.Tileset} tileset The tileset
     *  @returns {TextureBundle[]}
     */
    static getTexturesAutotiles(tileset: System.Tileset): TextureBundle[] {
        return this.autotiles[tileset.getAutotilesString()].texturesAutotiles;
    }

    /**
     *  Get the mountains textures.
     *  @param {System.Tileset} tileset The tileset
     *  @returns {THREE.MeshStandardMaterial[]}
     */
    static getTexturesMountains(tileset: System.Tileset): TextureBundle[] {
        return this.mountains[tileset.getMountainsString()].texturesMountains;
    }

    /** 
     *  Get the walls textures.
     *  @param {System.Tileset} tileset The tileset
     *  @returns {THREE.MeshStandardMaterial[]}
     */
    static getTexturesWalls(tileset: System.Tileset): THREE.MeshStandardMaterial[] {
        return this.walls[tileset.getWallsString()].texturesWalls;
    }
}

export { Tilesets }