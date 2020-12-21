/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Enum, Constants, Platform } from "../Common";
import PictureKind = Enum.PictureKind;
import { Base } from "./Base";
import { CollisionSquare, TextureBundle, Picture2D, Autotiles } from "../Core";
import { System, Datas, Manager } from "..";
const THREE = require('./Content/Datas/Scripts/Libs/three.js');

/** @class
 *  A tileset of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} json Json object describing the tileset
 */
class Tileset extends Base {

    public collisions: CollisionSquare[];
    public ownsAutotiles: boolean;
    public ownsMountains: boolean;
    public ownsWalls: boolean;
    public id: number;
    public picture: System.Picture;
    public autotiles: number[];
    public walls: number[];
    public mountains: number[];
    public objects: number[];
    public texturesAutotiles: TextureBundle[];
    public texturesMountains: TextureBundle[];
    public texturesWalls: typeof THREE.MeshStandardMaterial[];

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Assign the default members.
     */
    public setup() {
        this.collisions = null;
        this.ownsAutotiles = false;
        this.ownsMountains = false;
        this.ownsWalls = false;
    }

    /** 
     *  Read the JSON associated to the tileset.
     *  @param {Record<string, any>} json Json object describing the tileset
     */
    read(json: Record<string, any>) {
        this.id = json.id;
        this.picture = Datas.Pictures.get(PictureKind.Tilesets, json.pic);

        // Special elements
        let jsonSpecials = json.auto;
        let l = jsonSpecials.length;
        this.autotiles = new Array(l);
        let i: number;
        for (i = 0; i < l; i++) {
            this.autotiles[i] = jsonSpecials[i].id;
        }
        jsonSpecials = json.walls;
        l = jsonSpecials.length;
        this.walls = new Array(l);
        for (i = 0; i < l; i++) {
            this.walls[i] = jsonSpecials[i].id;
        }
        jsonSpecials = json.moun;
        l = jsonSpecials.length;
        this.mountains = new Array(l);
        for (i = 0; i < l; i++) {
            this.mountains[i] = jsonSpecials[i].id;
        }
        jsonSpecials = json.objs;
        l = jsonSpecials.length;
        this.objects = new Array(l);
        for (i = 0; i < l; i++) {
            this.objects[i] = jsonSpecials[i].id;
        }
    }

    /** 
     *  Get the path to the picture tileset.
     *  @returns {string}
     */
    getPath(): string {
        return this.picture ? this.picture.getPath() : null;
    }

    /** 
     *  Get the string logic for special elements.
     *  @param {number[]} specials Special elements
     *  @returns {string}
     */
    getSpecialString(specials: number[]): string {
        let result = "";
        for (let i = 0, l = specials.length; i < l; i++) {
            result += specials[i] + Constants.STRING_COLON;
        }
        return result;
    }

    /** 
     *  Get the string logic for autotiles.
     *  @returns {string}
     */
    getAutotilesString(): string {
        return this.getSpecialString(this.autotiles);
    }

    /** 
     *  Get the string logic for walls.
     *  @returns {string}
     */
    getWallsString(): string {
        return this.getSpecialString(this.walls);
    }

    /** 
     *  Get the string logic for mountains.
     *  @returns {string}
     */
    getMountainsString(): string {
        return this.getSpecialString(this.mountains);
    }

    /** 
     *  Get the max possible offset of an autotile texture.
     *  @returns {number}
     */
    getMaxAutotilesOffsetTexture(): number {
        return Math.floor(Constants.MAX_PICTURE_SIZE / (9 * Datas.Systems
            .SQUARE_SIZE));
    }

    /** 
     *  Get the max possible offset of a mountain texture.
     *  @returns {number}
     */
    getMaxMountainOffsetTexture(): number {
        return Math.floor(Constants.MAX_PICTURE_SIZE / (4 * Datas.Systems
            .SQUARE_SIZE));
    }

    /**
     *  Load all the specials
     */
    async loadSpecials() {
        if (!this.ownsAutotiles) {
            await this.loadAutotiles();
        }
        if (!this.ownsMountains) {
            await this.loadMountains();
        }
        if (!this.ownsWalls) {
            await this.loadWalls();
        }
    }

    /** 
     *  Load all the autotiles with reduced files.
     */
    async loadAutotiles() {
        let autotiles = Datas.SpecialElements.autotiles;
        let autotilesIDs = this.autotiles;
        let offset = 0;
        let result = null;
        let textureAutotile = null;
        let texture = new THREE.Texture();
        Platform.ctxr.clearRect(0, 0, Platform.canvasRendering.width, Platform
            .canvasRendering.height);
        Platform.canvasRendering.width = 64 * Datas.Systems.SQUARE_SIZE;
        Platform.canvasRendering.height = Constants.MAX_PICTURE_SIZE;
        this.texturesAutotiles = new Array;
        let id: number, autotile: System.SpecialElement, picture: System.Picture;
        for (let i = 0, l = autotiles.length; i < l; i++) {
            id = autotilesIDs[i];
            autotile = autotiles[id];
            if (autotile) {
                picture = Datas.Pictures.get(PictureKind.Autotiles, autotile
                    .pictureID);
                if (picture) {
                    result = await this.loadTextureAutotile(textureAutotile,
                        texture, picture, offset, id);
                } else {
                    result = null;
                }
            } else {
                result = null;
            }
            if (result !== null) {
                textureAutotile = result[0];
                texture = result[1];
                offset = result[2];
            }
        }
        if (offset > 0) {
            await this.updateTextureAutotile(textureAutotile, texture);
        }
    }

    /** 
     *  Load an autotile ID and add it to context rendering.
     *  @param {TextureBundle} textureAutotile The autotile several texture
     *  @param {THREE.Texture} texture The texture to paint on
     *  @param {System.Picture} picture The picture to paint
     *  @param {number} offset The offset
     *  @param {number} id The picture id
     *  @returns {any[]}
     */
    async loadTextureAutotile(textureAutotile: TextureBundle, texture: typeof 
        THREE.Texture, picture: System.Picture, offset: number, id: number): 
        Promise<any[]>
    {
        let picture2D = await Picture2D.create(picture);
        let width = Math.floor((picture2D.image.width / 2) / Datas.Systems
            .SQUARE_SIZE);
        let height = Math.floor((picture2D.image.height / 3) / Datas.Systems
            .SQUARE_SIZE);
        let size = width * height;

        // Update picture width and height for collisions settings
        picture.width = width;
        picture.height = height;
        let point: number[];
        for (let i = 0; i < size; i++) {
            point = [i % width, Math.floor(i / width)];
            if (offset === 0 && textureAutotile === null) {
                textureAutotile = new TextureBundle();
                textureAutotile.setBegin(id, point);
            }
            this.paintPictureAutotile(picture2D.image, offset, point, id);
            textureAutotile.setEnd(id, point);
            textureAutotile.addToList(id, point);
            offset++;
            if (offset === this.getMaxAutotilesOffsetTexture()) {
                await this.updateTextureAutotile(textureAutotile, texture);
                texture = new THREE.Texture();
                Platform.ctxr.clearRect(0, 0, Platform.canvasRendering.width,
                    Platform.canvasRendering.height);
                textureAutotile = null;
                offset = 0;
            }
        }
        return [textureAutotile, texture, offset];
    }

    /** 
     *  Paint the picture in texture.
     *  @param {Image} img The image to draw
     *  @param {number} offset The offset
     *  @param {number[]} point The in several texture
     *  @param {number} id The picture id
     */
    paintPictureAutotile(img: HTMLImageElement, offset: number, point: number[], 
        id: number)
    {
        let row = -1;
        let offsetX = point[0] * 2 * Datas.Systems.SQUARE_SIZE;
        let offsetY = point[1] * 3 * Datas.Systems.SQUARE_SIZE;
        let sDiv = Math.floor(Datas.Systems.SQUARE_SIZE / 2);
        let y = offset * Autotiles.COUNT_LIST * 2;
        try {
            let a: number, b: number, c: number, d: number, count: number, lA: 
                number, lB: number, lC: number, lD: number;
            for (a = 0; a < Autotiles.COUNT_LIST; a++) {
                lA = Autotiles.AUTOTILE_BORDER[Autotiles.LIST_A[a]];
                count = 0;
                row++;
                for (b = 0; b < Autotiles.COUNT_LIST; b++) {
                    lB = Autotiles.AUTOTILE_BORDER[Autotiles.LIST_B[b]];
                    for (c = 0; c < Autotiles.COUNT_LIST; c++) {
                        lC = Autotiles.AUTOTILE_BORDER[Autotiles.LIST_C[c]];
                        for (d = 0; d < Autotiles.COUNT_LIST; d++) {
                            lD = Autotiles.AUTOTILE_BORDER[Autotiles.LIST_D[d]];

                            // Draw
                            Platform.ctxr.drawImage(img, (lA % 4 * sDiv) +
                                offsetX, (Math.floor(lA / 4) * sDiv) + offsetY,
                                sDiv, sDiv, count * Datas.Systems.SQUARE_SIZE, (
                                row + y) * Datas.Systems.SQUARE_SIZE, sDiv, sDiv);
                            Platform.ctxr.drawImage(img, (lB % 4 * sDiv) +
                                offsetX, (Math.floor(lB / 4) * sDiv) + offsetY,
                                sDiv, sDiv, count * Datas.Systems.SQUARE_SIZE + 
                                sDiv, (row + y) * Datas.Systems.SQUARE_SIZE, 
                                sDiv, sDiv);
                            Platform.ctxr.drawImage(img, (lC % 4 * sDiv) +
                                offsetX, (Math.floor(lC / 4) * sDiv) + offsetY,
                                sDiv, sDiv, count * Datas.Systems.SQUARE_SIZE, (
                                row + y) * Datas.Systems.SQUARE_SIZE + sDiv, 
                                sDiv, sDiv);
                            Platform.ctxr.drawImage(img, (lD % 4 * sDiv) +
                                offsetX, (Math.floor(lD / 4) * sDiv) + offsetY,
                                sDiv, sDiv, count * Datas.Systems.SQUARE_SIZE + 
                                sDiv, (row + y) * Datas.Systems.SQUARE_SIZE + 
                                sDiv, sDiv, sDiv);
                            count++;
                            if (count === 64) {
                                count = 0;
                                row++;
                            }
                        }
                    }
                }
            }
        } catch (e) {
            Platform.showErrorMessage("Error: Wrong autotile (with ID:" + id + 
                ") parsing. Please verify that you have a 2 x 3 picture (for each individual autotile).");
        }
    }

    /** 
     *  Update texture of a TextureAutotile.
     *  @param {TextureBundle} textureAutotile The autotile several texture
     *  @param {THREE.Texture} texture The texture to paint on
     */
    async updateTextureAutotile(textureAutotile: TextureBundle, texture: typeof 
        THREE.Texture)
    {
        texture.image = await Picture2D.loadImage(Platform.canvasRendering
            .toDataURL());
        texture.needsUpdate = true;
        textureAutotile.texture = Manager.GL.createMaterial(texture);
        this.texturesAutotiles.push(textureAutotile);
    }

    /** 
     *  Load all the mountains with reduced files
     */
    async loadMountains() {
        let mountains = Datas.SpecialElements.mountains;
        let mountainsIDs = this.mountains;
        let offset = 0;
        let result = null;
        let textureMountain = null;
        let texture = new THREE.Texture();
        Platform.ctxr.clearRect(0, 0, Platform.canvasRendering.width, Platform
            .canvasRendering.height);
        Platform.canvasRendering.width = 4 * Datas.Systems.SQUARE_SIZE;
        Platform.canvasRendering.height = Constants.MAX_PICTURE_SIZE;
        this.texturesMountains = new Array;
        let id: number, mountain: System.Mountain, picture: System.Picture;
        for (let i = 0, l = mountainsIDs.length; i < l; i++) {
            id = mountainsIDs[i];
            mountain = mountains[id];
            if (mountain) {
                picture = Datas.Pictures.get(PictureKind.Mountains, mountain
                    .pictureID);
            } else {
                picture = null;
            }
            result = await this.loadTextureMountain(textureMountain, texture,
                picture, offset, id);
            if (result !== null) {
                textureMountain = result[0];
                texture = result[1];
                offset = result[2];
            }
        }
        if (offset > 0) {
            await this.updateTextureMountain(textureMountain, texture);
        }
    }

    /** 
     *  Load a mountain ID and add it to context rendering
     *  @param {TextureBundle} textureMountain The mountain several texture
     *  @param {THREE.Texture} texture The texture to paint on
     *  @param {System.Picture} picture The picture to paint
     *  @param {number} offset The offset
     *  @param {number} id The picture id
     *  @returns {any[]}
     */
    async loadTextureMountain(textureMountain: TextureBundle, texture: typeof 
        THREE.Texture, picture: System.Picture, offset: number, id: number): 
        Promise<any[]>
    {
        let picture2D = await Picture2D.create(picture);
        let width = 3;
        let height = 3;
        let size = 9;

        // Update picture width and height for collisions settings
        if (picture) {
            picture.width = width;
            picture.height = height;
        }
        let point: number[];
        for (let i = 0; i < size; i++) {
            point = [i % width, Math.floor(i / width)];
            if (offset === 0 && textureMountain === null) {
                textureMountain = new TextureBundle();
                textureMountain.setBegin(id, point);
            }
            if (picture) {
                this.paintPictureMountain(picture2D.image, offset, id);
            }
            textureMountain.setEnd(id, point);
            textureMountain.addToList(id, point);
            offset++;
            if (offset === this.getMaxMountainOffsetTexture()) {
                await this.updateTextureMountain(textureMountain, texture);
                texture = new THREE.Texture();
                Platform.ctxr.clearRect(0, 0, Platform.canvasRendering.width,
                    Platform.canvasRendering.height);
                textureMountain = null;
                offset = 0;
            }
        }
        return [textureMountain, texture, offset];
    }

    /** 
     *  Paint the picture in texture.
     *  @param {HTMLImageElement} img The image to draw
     *  @param {number} offset The offset
     *  @param {number} id The picture id
     */
    paintPictureMountain(img: HTMLImageElement, offset: number, id: number) {
        let y = offset * 4 * Datas.Systems.SQUARE_SIZE;
        let sourceSize = 3 * Datas.Systems.SQUARE_SIZE;
        let sDiv = Math.round(Datas.Systems.SQUARE_SIZE / 2);

        // Draw original image
        Platform.ctxr.drawImage(img, 0, y);

        // Add left/right autos
        try {
            let i: number, l: number;
            for (i = 0, l = 3; i < l; i++) {
                Platform.ctxr.drawImage(img, 0, (i * Datas.Systems.SQUARE_SIZE), 
                    sDiv, Datas.Systems.SQUARE_SIZE, sourceSize, y + (i * Datas
                    .Systems.SQUARE_SIZE), sDiv, Datas.Systems.SQUARE_SIZE);
                Platform.ctxr.drawImage(img, sourceSize - sDiv, (i * Datas
                    .Systems.SQUARE_SIZE), sDiv, Datas.Systems.SQUARE_SIZE, 
                    sourceSize + sDiv, y + (i * Datas.Systems.SQUARE_SIZE), sDiv
                    , Datas.Systems.SQUARE_SIZE);
            }

            // Add top/bot autos
            for (i = 0, l = 3; i < l; i++) {
                Platform.ctxr.drawImage(img, i * Datas.Systems.SQUARE_SIZE, 0, 
                    Datas.Systems.SQUARE_SIZE, sDiv, i * Datas.Systems
                    .SQUARE_SIZE, y + sourceSize, Datas.Systems.SQUARE_SIZE, 
                    sDiv);
                Platform.ctxr.drawImage(img, i * Datas.Systems.SQUARE_SIZE, 
                    sourceSize - sDiv, Datas.Systems.SQUARE_SIZE, sDiv, i * 
                    Datas.Systems.SQUARE_SIZE, y + sourceSize + sDiv, Datas
                    .Systems.SQUARE_SIZE, sDiv);
            }

            // Add all sides autos
            Platform.ctxr.drawImage(img, 0, 0, sDiv, sDiv, sourceSize, y +
                sourceSize, sDiv, sDiv);
            Platform.ctxr.drawImage(img, sourceSize - sDiv, 0, sDiv, sDiv,
                sourceSize + sDiv, y + sourceSize, sDiv, sDiv);
            Platform.ctxr.drawImage(img, 0, sourceSize - sDiv, sDiv, sDiv,
                sourceSize, y + sourceSize + sDiv, sDiv, sDiv);
            Platform.ctxr.drawImage(img, sourceSize - sDiv, sourceSize - sDiv,
                sDiv, sDiv, sourceSize + sDiv, y + sourceSize + sDiv, sDiv, sDiv);
        } catch (e) {
            Platform.showErrorMessage("Error: Wrong mountain (with ID:" + id + 
                ") parsing. Please verify that you have a 3 x 3 picture.");
        }
    }

    /** 
     *  Update texture of a TextureSeveral.
     *  @param {TextureBundle} textureMountain The mountain several texture
     *  @param {THREE.Texture} texture The texture to paint on
     */
    async updateTextureMountain(textureMountain: TextureBundle, texture: typeof 
        THREE.Texture)
    {
        texture.image = await Picture2D.loadImage(Platform.canvasRendering
            .toDataURL());
        texture.needsUpdate = true;
        textureMountain.texture = Manager.GL.createMaterial(texture);
        this.texturesMountains.push(textureMountain);
    }

    /** 
     *  Load all the walls
     */
    async loadWalls() {
        let specials = Datas.SpecialElements.walls;
        let specialsIDs = this.walls;
        let l = specialsIDs.length;
        this.texturesWalls = new Array(l);
        let id: number, special: System.SpecialElement, picture: System.Picture;
        for (let i = 0; i < l; i++) {
            id = specialsIDs[i];
            special = specials[id];
            if (special) {
                picture = Datas.Pictures.get(PictureKind.Walls, special
                    .pictureID);
                if (picture) {
                    this.texturesWalls[id] = await this.loadTextureWall(picture,
                        id);
                } else {
                    this.texturesWalls[id] = Manager.GL.loadTextureEmpty();
                }
            } else {
                this.texturesWalls[id] = Manager.GL.loadTextureEmpty();
            }
        }
    }

    /** 
     *  Load a wall texture.
     *  @param {System.Picture} picture The picture to load
     *  @param {number} id The picture id
     *  @returns {THREE.ShaderMaterial}
     */
    async loadTextureWall(picture: System.Picture, id: number): Promise<typeof 
        THREE.MeshStandardMaterial>
    {
        let picture2D = await Picture2D.create(picture);
        let texture = new THREE.Texture();
        let w = picture2D.image.width;
        let h = picture2D.image.height;

        // Update picture infos for collisions
        picture.width = Math.floor(w / Datas.Systems.SQUARE_SIZE);
        picture.height = Math.floor(h / Datas.Systems.SQUARE_SIZE);
        Platform.ctxr.clearRect(0, 0, Platform.canvasRendering.width, Platform
            .canvasRendering.height);
        Platform.canvasRendering.width = w + Datas.Systems.SQUARE_SIZE;
        Platform.canvasRendering.height = h;
        Platform.ctxr.drawImage(picture2D.image, 0, 0);
        let left = Platform.ctxr.getImageData(0, 0, Math.floor(Datas.Systems
            .SQUARE_SIZE / 2), h);
        let right = Platform.ctxr.getImageData(w - Math.floor(Datas.Systems
            .SQUARE_SIZE / 2), 0, Math.floor(Datas.Systems.SQUARE_SIZE / 2), 
            picture2D.image.height);
        try {
            Platform.ctxr.putImageData(left, w, 0);
            Platform.ctxr.putImageData(right, w + Math.floor(Datas.Systems
                .SQUARE_SIZE / 2), 0);
        } catch (e) {
            Platform.showErrorMessage("Error: Wrong wall (with ID:" + id + 
                ") parsing. Please verify that you have a 3 x 3 picture.");
        }
        texture.image = await Picture2D.loadImage(Platform.canvasRendering
            .toDataURL());
        texture.needsUpdate = true;
        return Manager.GL.createMaterial(texture);
    }
}

export { Tileset }