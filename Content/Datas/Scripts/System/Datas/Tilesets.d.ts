import { Enum } from "../Common/index.js";
import { System } from "../index.js";
import PictureKind = Enum.PictureKind;
import { TextureBundle } from "../Core/index.js";
/** @class
 *  All the tilesets datas.
 *  @static
 */
declare class Tilesets {
    static PROPERTY_TEXTURES_CHARACTERS: string;
    static PROPERTY_TEXTURES_BATTLERS: string;
    static PROPERTY_TEXTURES_OBJECTS_3D: string;
    private static list;
    private static autotiles;
    private static walls;
    private static mountains;
    static texturesCharacters: THREE.ShaderMaterial[];
    static texturesBattlers: THREE.ShaderMaterial[];
    static texturesObjects3D: THREE.ShaderMaterial[];
    constructor();
    /**
     *  Read the JSON file associated to tilesets.
     */
    static read(): Promise<void>;
    /**
     *  Get the tileset by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Tileset}
     */
    static get(id: number): System.Tileset;
    /**
     *  Load pictures.
     *  @param {PictureKind} pictureKind - The picture kind
     *  @param {string} texturesName - The field name textures
     */
    static loadPictures(pictureKind: PictureKind, texturesName: string): Promise<void>;
    /**
     *  Get the autotiles textures.
     *  @param {System.Tileset} tileset - The tileset
     *  @returns {TextureBundle[]}
     */
    static getTexturesAutotiles(tileset: System.Tileset): TextureBundle[];
    /**
     *  Get the mountains textures.
     *  @param {System.Tileset} tileset - The tileset
     *  @returns {THREE.ShaderMaterial[]}
     */
    static getTexturesMountains(tileset: System.Tileset): TextureBundle[];
    /**
     *  Get the walls textures.
     *  @param {System.Tileset} tileset - The tileset
     *  @returns {THREE.ShaderMaterial[]}
     */
    static getTexturesWalls(tileset: System.Tileset): THREE.ShaderMaterial[];
}
export { Tilesets };
