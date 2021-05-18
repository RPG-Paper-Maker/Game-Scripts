import { Base } from "./Base.js";
import { CollisionSquare, TextureBundle } from "../Core/index.js";
import { System } from "../index.js";
/** @class
 *  A tileset of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - json Json object describing the tileset
 */
declare class Tileset extends Base {
    collisions: CollisionSquare[];
    ownsAutotiles: boolean;
    ownsMountains: boolean;
    ownsWalls: boolean;
    id: number;
    picture: System.Picture;
    autotiles: number[];
    walls: number[];
    mountains: number[];
    objects: number[];
    texturesAutotiles: TextureBundle[];
    texturesMountains: TextureBundle[];
    texturesWalls: THREE.ShaderMaterial[];
    constructor(json?: Record<string, any>);
    /**
     *  Assign the default members.
     */
    setup(): void;
    /**
     *  Read the JSON associated to the tileset.
     *  @param {Record<string, any>} - json Json object describing the tileset
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the path to the picture tileset.
     *  @returns {string}
     */
    getPath(): string;
    /**
     *  Get the string logic for special elements.
     *  @param {number[]} specials - Special elements
     *  @returns {string}
     */
    getSpecialString(specials: number[]): string;
    /**
     *  Get the string logic for autotiles.
     *  @returns {string}
     */
    getAutotilesString(): string;
    /**
     *  Get the string logic for walls.
     *  @returns {string}
     */
    getWallsString(): string;
    /**
     *  Get the string logic for mountains.
     *  @returns {string}
     */
    getMountainsString(): string;
    /**
     *  Get the max possible offset of an autotile texture.
     *  @returns {number}
     */
    getMaxAutotilesOffsetTexture(): number;
    /**
     *  Get the max possible offset of a mountain texture.
     *  @returns {number}
     */
    getMaxMountainOffsetTexture(): number;
    /**
     *  Load all the specials
     */
    loadSpecials(): Promise<void>;
    /**
     *  Load all the autotiles with reduced files.
     */
    loadAutotiles(): Promise<void>;
    /**
     *  Load an autotile ID and add it to context rendering.
     *  @param {TextureBundle} textureAutotile - The autotile several texture
     *  @param {THREE.Texture} texture - The texture to paint on
     *  @param {System.Picture} picture - The picture to paint
     *  @param {number} offset - The offset
     *  @param {number} id - The picture id
     *  @param {boolean} isAnimated
     *  @returns {any[]}
     */
    loadTextureAutotile(textureAutotile: TextureBundle, texture: THREE.Texture, picture: System.Picture, offset: number, id: number, isAnimated: boolean): Promise<any[]>;
    /**
     *  Paint the picture in texture.
     *  @param {Image} img - The image to draw
     *  @param {number} offset - The offset
     *  @param {number[]} point - The in several texture
     *  @param {number} id - The picture id
     */
    paintPictureAutotile(img: HTMLImageElement, offset: number, point: number[], id: number): void;
    /**
     *  Update texture of a TextureAutotile.
     *  @param {TextureBundle} textureAutotile - The autotile several texture
     *  @param {THREE.Texture} texture - The texture to paint on
     */
    updateTextureAutotile(textureAutotile: TextureBundle, texture: THREE.Texture): Promise<void>;
    /**
     *  Load all the mountains with reduced files
     */
    loadMountains(): Promise<void>;
    /**
     *  Load a mountain ID and add it to context rendering
     *  @param {TextureBundle} textureMountain - The mountain several texture
     *  @param {THREE.Texture} texture - The texture to paint on
     *  @param {System.Picture} picture - The picture to paint
     *  @param {number} offset - The offset
     *  @param {number} id - The picture id
     *  @returns {any[]}
     */
    loadTextureMountain(textureMountain: TextureBundle, texture: THREE.Texture, picture: System.Picture, offset: number, id: number): Promise<any[]>;
    /**
     *  Paint the picture in texture.
     *  @param {HTMLImageElement} img - The image to draw
     *  @param {number} offset - The offset
     *  @param {number} id - The picture id
     */
    paintPictureMountain(img: HTMLImageElement, offset: number, id: number): void;
    /**
     *  Update texture of a TextureSeveral.
     *  @param {TextureBundle} textureMountain - The mountain several texture
     *  @param {THREE.Texture} texture - The texture to paint on
     */
    updateTextureMountain(textureMountain: TextureBundle, texture: THREE.Texture): Promise<void>;
    /**
     *  Load all the walls
     */
    loadWalls(): Promise<void>;
    /**
     *  Load a wall texture.
     *  @param {System.Picture} picture - The picture to load
     *  @param {number} id - The picture id
     *  @returns {THREE.ShaderMaterial}
     */
    loadTextureWall(picture: System.Picture, id: number): Promise<THREE.ShaderMaterial>;
}
export { Tileset };
