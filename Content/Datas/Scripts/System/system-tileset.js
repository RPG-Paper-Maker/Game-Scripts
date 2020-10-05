/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A tileset of the game
*   @property {SystemPicture} picture The picture used for this tileset
*   @property {number} width
*   @property {number} height
*   @property {number[]} autotiles All the IDs of used autotiles for this
*   tileset
*   @property {number[]} mountains All the IDs of used mountains for this
*   tileset
*   @property {number[]} walls All the IDs of used walls for this tileset
*   @property {CollisionSquare[]} collisions List of all the collisions
*   according to the position on the texture
*/
class SystemTileset
{
    constructor(json)
    {
        this.collisions = null;
        this.ownsAutotiles = false;
        this.ownsMountains = false;
        this.ownsWalls = false;
        if (json)
        {
            this.read(json);
        }
    }

    /** Read the JSON associated to the tileset
    *   @param {Object} json Json object describing the tileset
    */
    read(json)
    {
        this.id = json.id;
        this.picture = RPM.datasGame.pictures.get(PictureKind.Tilesets, json.pic);

        // Special elements
        let jsonSpecials = json.auto;
        let l = jsonSpecials.length;
        this.autotiles = new Array(l);
        let i;
        for (i = 0; i < l; i++)
        {
            this.autotiles[i] = jsonSpecials[i].id;
        }
        jsonSpecials = json.walls;
        l = jsonSpecials.length;
        this.walls = new Array(l);
        for (i = 0; i < l; i++)
        {
            this.walls[i] = jsonSpecials[i].id;
        }
        jsonSpecials = json.moun;
        l = jsonSpecials.length;
        this.mountains = new Array(l);
        for (i = 0; i < l; i++)
        {
            this.mountains[i] = jsonSpecials[i].id;
        }
        jsonSpecials = json.objs;
        l = jsonSpecials.length;
        this.objects = new Array(l);
        for (i = 0; i < l; i++)
        {
            this.objects[i] = jsonSpecials[i].id;
        }
    }

    // -------------------------------------------------------
    /** Get the path to the picture tileset
    *   @returns {string}
    */
    getPath()
    {
        return this.picture ? this.picture.getPath() : null;
    }

    // -------------------------------------------------------
    /** Get the string logic for special elements
    *   @param {string[]} specials Special elements
    *   @returns {string}
    */
    getSpecialString(specials)
    {
        let result = RPM.STRING_EMPTY;
        for (let i = 0, l = specials.length; i < l; i++)
        {
            result += specials[i] + RPM.STRING_COLON;
        }
        return result;
    }

    // -------------------------------------------------------
    /** Get the string logic for autotiles
    *   @returns {string}
    */
    getAutotilesString()
    {
        return this.getSpecialString(this.autotiles);
    }

    // -------------------------------------------------------
    /** Get the string logic for walls
    *   @returns {string}
    */
    getWallsString()
    {
        return this.getSpecialString(this.walls);
    }

    // -------------------------------------------------------
    /** Get the string logic for mountains
    *   @returns {string}
    */
    getMountainsString()
    {
        return this.getSpecialString(this.mountains);
    }

    // -------------------------------------------------------
    /** Get the max possible offset of an autotile texture
    */
    getMaxAutotilesOffsetTexture()
    {
        return Math.floor(RPM.MAX_PICTURE_SIZE / (9 * RPM.SQUARE_SIZE));
    }

    // -------------------------------------------------------
    /** Get the max possible offset of a mountain texture
    */
    getMaxMountainOffsetTexture()
    {
        return Math.floor(RPM.MAX_PICTURE_SIZE / (4 * RPM.SQUARE_SIZE));
    }

    // -------------------------------------------------------
    /** Load all the specials
    */
    async loadSpecials()
    {
        if (!this.ownsAutotiles)
        {
            await this.loadAutotiles();
        }
        if (!this.ownsMountains)
        {
            await this.loadMountains();
        }
        if (!this.ownsWalls)
        {
            await this.loadWalls();
        }
    }

    // -------------------------------------------------------
    /** Load all the autotiles with reduced files
    */
    async loadAutotiles()
    {
        let autotiles = RPM.datasGame.specialElements.autotiles;
        let autotilesIDs = this.autotiles;
        let offset = 0;
        let result = null;
        let textureAutotile = null;
        let texture = new THREE.Texture();
        Platform.ctxr.clearRect(0, 0, Platform.canvasRendering.width, Platform
            .canvasRendering.height);
        Platform.canvasRendering.width = 64 * RPM.SQUARE_SIZE;
        Platform.canvasRendering.height = RPM.MAX_PICTURE_SIZE;
        this.texturesAutotiles = new Array;
        let id, autotile, picture;
        for (let i = 0, l = autotilesIDs.length; i < l; i++)
        {
            if (result !== null)
            {
                textureAutotile = result[0];
                texture = result[1];
                offset = result[2];
            }
            id = autotilesIDs[i];
            autotile = autotiles[id];
            if (autotile)
            {
                picture = RPM.datasGame.pictures.get(PictureKind.Autotiles,
                    autotile.pictureID);
                if (picture)
                {
                    result = await this.loadTextureAutotile(textureAutotile, 
                        texture, picture, offset, id);
                } else
                {
                    result = null;
                }
            } else
            {
                result = null;
            }
        }
        if (offset > 0)
        {
            await this.updateTextureAutotile(textureAutotile, texture);
        }
    }

    // -------------------------------------------------------
    /** Load an autotile ID and add it to context rendering
    *   @param {TextureSeveral} textureAutotile The autotile several texture
    *   @param {THREE.Texture} texture The texture to paint on
    *   @param {SystemPicture} picture The picture to paint
    *   @param {number} offset The offset
    *   @param {number} id The picture id
    */
    async loadTextureAutotile(textureAutotile, texture, picture, offset, id)
    {
        let picture2D = await Picture2D.create(picture);
        let width = Math.floor((picture2D.image.width / 2) / RPM.SQUARE_SIZE);
        let height = Math.floor((picture2D.image.height / 3) / RPM.SQUARE_SIZE);
        let size = width * height;

        // Update picture width and height for collisions settings
        picture.width = width;
        picture.height = height;

        let point;
        for (let i = 0; i < size; i++)
        {
            point = [i % width, Math.floor(i / width)];
            if (offset === 0 && textureAutotile === null)
            {
                textureAutotile = new TextureSeveral();
                textureAutotile.setBegin(id, point);
            }
            this.paintPictureAutotile(picture2D.image, offset, point, id);
            textureAutotile.setEnd(id, point);
            textureAutotile.addToList(id, point);
            offset++;
            if (offset === this.getMaxAutotilesOffsetTexture())
            {
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

    // -------------------------------------------------------
    /** Paint the picture in texture
    *   @param {Image} img The image to draw
    *   @param {number} offset The offset
    *   @param {number[]} point The in several texture
    *   @param {number} id The picture id
    */
    paintPictureAutotile(img, offset, point, id)
    {
        let row = -1;
        let offsetX = point[0] * 2 * RPM.SQUARE_SIZE;
        let offsetY = point[1] * 3 * RPM.SQUARE_SIZE;
        let sDiv = Math.floor(RPM.SQUARE_SIZE / 2);
        let y = offset * Autotiles.COUNT_LIST * 2;
        try
        {
            let a, b, c, d, count, lA, lB, lC, lD;
            for (a = 0; a < Autotiles.COUNT_LIST; a++)
            {
                lA = Autotiles.autotileBorder[Autotiles.listA[a]];
                count = 0;
                row++;
                for (b = 0; b < Autotiles.COUNT_LIST; b++)
                {
                    lB = Autotiles.autotileBorder[Autotiles.listB[b]];
                    for (c = 0; c < Autotiles.COUNT_LIST; c++)
                    {
                        lC = Autotiles.autotileBorder[Autotiles.listC[c]];
                        for (d = 0; d < Autotiles.COUNT_LIST; d++)
                        {
                            lD = Autotiles.autotileBorder[Autotiles.listD[d]];

                            // Draw
                            Platform.ctxr.drawImage(img, (lA % 4 * sDiv) + 
                                offsetX, (Math.floor(lA / 4) * sDiv) + offsetY, 
                                sDiv, sDiv, count * RPM.SQUARE_SIZE, (row + y) *
                                RPM.SQUARE_SIZE, sDiv, sDiv);
                            Platform.ctxr.drawImage(img, (lB % 4 * sDiv) + 
                                offsetX, (Math.floor(lB / 4) * sDiv) + offsetY, 
                                sDiv, sDiv, count * RPM.SQUARE_SIZE + sDiv, (row 
                                + y) * RPM.SQUARE_SIZE, sDiv, sDiv);
                            Platform.ctxr.drawImage(img, (lC % 4 * sDiv) + 
                                offsetX, (Math.floor(lC / 4) * sDiv) + offsetY, 
                                sDiv, sDiv, count * RPM.SQUARE_SIZE, (row + y) *
                                RPM.SQUARE_SIZE + sDiv, sDiv, sDiv);
                            Platform.ctxr.drawImage(img, (lD % 4 * sDiv) + 
                                offsetX, (Math.floor(lD / 4) * sDiv) + offsetY, 
                                sDiv, sDiv, count * RPM.SQUARE_SIZE + sDiv, (row
                                + y) * RPM.SQUARE_SIZE + sDiv, sDiv, sDiv);
                            count++;
                            if (count === 64)
                            {
                                count = 0;
                                row++;
                            }
                        }
                    }
                }
            }
        } catch (e)
        {
            RPM.showErrorMessage("Error: Wrong autotile (with ID:" + id + ") parsing. Please verify that you have a 2 x 3 picture (for each individual autotile).");
        }
    }

    // -------------------------------------------------------
    /** Update texture of a TextureAutotile
    *   @param {TextureSeveral} textureAutotile The autotile several texture
    *   @param {THREE.Texture} texture The texture to paint on
    */
    async updateTextureAutotile(textureAutotile, texture)
    {
        texture.image = RPM.createMaterial(await Picture2D.loadImage(Platform
            .canvasRendering.toDataURL()));
        texture.needsUpdate = true;
        textureAutotile.texture = RPM.createMaterial(texture);
        this.texturesAutotiles.push(textureAutotile);
    }

    // -------------------------------------------------------
    /** Load all the mountains with reduced files
    */
    async loadMountains()
    {
        let mountains = RPM.datasGame.specialElements.mountains;
        let mountainsIDs = this.mountains;
        let offset = 0;
        let result = null;
        let textureMountain = null;
        let texture = new THREE.Texture();
        Platform.ctxr.clearRect(0, 0, Platform.canvasRendering.width, Platform
            .canvasRendering.height);
        Platform.canvasRendering.width = 4 * RPM.SQUARE_SIZE;
        Platform.canvasRendering.height = RPM.MAX_PICTURE_SIZE;
        this.texturesMountains = new Array;
        let id, mountain, picture;
        for (let i = 0, l = mountainsIDs.length; i < l; i++)
        {
            if (result !== null)
            {
                textureMountain = result[0];
                texture = result[1];
                offset = result[2];
            }
            id = mountainsIDs[i];
            mountain = mountains[id];
            if (mountain)
            {
                picture = RPM.datasGame.pictures.get(PictureKind.Mountains,
                    mountain.pictureID);
            } else
            {
                picture = null;
            }
            result = await this.loadTextureMountain(textureMountain, texture, 
                picture, offset, id);
        }
        if (offset > 0) 
        {
            await this.updateTextureMountain(textureMountain, texture);
        }
    }

    // -------------------------------------------------------
    /** Load a mountain ID and add it to context rendering
    *   @param {TextureSeveral} textureMountain The mountain several texture
    *   @param {THREE.Texture} texture The texture to paint on
    *   @param {SystemPicture} picture The picture to paint
    *   @param {number} offset The offset
    *   @param {number} id The picture id
    */
    async loadTextureMountain(textureMountain, texture, picture, offset, id)
    {
        let picture2D = await Picture2D.create(picture);
        let width = 3;
        let height = 3;
        let size = 9;

        // Update picture width and height for collisions settings
        if (picture)
        {
            picture.width = width;
            picture.height = height;
        }

        let point;
        for (let i = 0; i < size; i++)
        {
            point = [i % width, Math.floor(i / width)];
            if (offset === 0 && textureMountain === null) {
                textureMountain = new TextureSeveral();
                textureMountain.setBegin(id, point);
            }
            if (picture)
            {
                this.paintPictureMountain(picture2D.image, offset, point, id);
            }
            textureMountain.setEnd(id, point);
            textureMountain.addToList(id, point);
            offset++;
            if (offset === this.getMaxMountainOffsetTexture())
            {
                await this.updateTextureMountain(textureMountain, texture);
                texture = new THREE.Texture();
                Platform.ctxr.clearRect(0, 0, Platform.canvasRendering.width,
                    canvasRendering.height);
                textureMountain = null;
                offset = 0;
            }
        }
        return [textureMountain, texture, offset];
    }

    // -------------------------------------------------------
    /** Paint the picture in texture
    *   @param {Image} img The image to draw
    *   @param {number} offset The offset
    *   @param {number} id The picture id
    */
    paintPictureMountain(img, offset, id)
    {
        let y = offset * 4 * RPM.SQUARE_SIZE;
        let sourceSize = 3 * RPM.SQUARE_SIZE;
        let sDiv = Math.round(RPM.SQUARE_SIZE / 2);

        // Draw original image
        Platform.ctxr.drawImage(img, 0, y);

        // Add left/right autos
        try {
            let i, l;

            for (i = 0, l = 3; i < l; i++)
            {
                Platform.ctxr.drawImage(img, 0, (i * RPM.SQUARE_SIZE), sDiv, RPM
                    .SQUARE_SIZE, sourceSize, y + (i * RPM.SQUARE_SIZE), sDiv,
                    RPM.SQUARE_SIZE);
                Platform.ctxr.drawImage(img, sourceSize - sDiv, (i * RPM
                    .SQUARE_SIZE), sDiv, RPM.SQUARE_SIZE, sourceSize + sDiv, y +
                    (i * RPM.SQUARE_SIZE), sDiv, RPM.SQUARE_SIZE);
            }

            // Add top/bot autos
            for (i = 0, l = 3; i < l; i++) {
                Platform.ctxr.drawImage(img, i * RPM.SQUARE_SIZE, 0, RPM
                    .SQUARE_SIZE, sDiv, i * RPM.SQUARE_SIZE, y + sourceSize, RPM
                    .SQUARE_SIZE, sDiv);
                Platform.ctxr.drawImage(img, i * RPM.SQUARE_SIZE, sourceSize - 
                    sDiv, RPM.SQUARE_SIZE, sDiv, i * RPM.SQUARE_SIZE, y + 
                    sourceSize + sDiv, RPM.SQUARE_SIZE, sDiv);
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
        } catch (e)
        {
            RPM.showErrorMessage("Error: Wrong mountain (with ID:" + id + ") parsing. Please verify that you have a 3 x 3 picture.");
        }
    }

    // -------------------------------------------------------

    /** Update texture of a TextureSeveral
    *   @param {TextureSeveral} textureMountain The mountain several texture
    *   @param {THREE.Texture} texture The texture to paint on
    */
    async updateTextureMountain(textureMountain, texture)
    {
        texture.image = RPM.createMaterial(await Picture2D.loadImage(Platform
            .canvasRendering.toDataURL()));
        texture.needsUpdate = true;
        textureMountain.texture = RPM.createMaterial(texture);
        this.texturesMountains.push(textureMountain);
    }

    // -------------------------------------------------------
    /** Load all the walls
    */
    async loadWalls()
    {
        let specials = RPM.datasGame.specialElements.walls;
        let specialsIDs = this.walls;
        let l = specials.length;
        this.texturesWalls = new Array(l);
        l = specialsIDs.length;
        let id, special, picture;
        for (let i = 0; i < l; i++)
        {
            id = specialsIDs[i];
            special = specials[id];
            if (special)
            {
                picture = RPM.datasGame.pictures.get(PictureKind.Walls, special
                    .pictureID);
                if (picture)
                {
                    this.texturesWalls[id] = await this.loadTextureWall(picture, 
                        id);
                } else
                {
                    this.texturesWalls[id] = RPM.loadTextureEmpty();
                }
            } else {
                this.texturesWalls[id] = RPM.loadTextureEmpty();
            }
        }
    }

    // -------------------------------------------------------
    /** Load a wall texture
    *   @param {SystemPicture} picture The picture to load
    *   @param {number} id The picture id
    */
    async loadTextureWall(picture, id)
    {
        let picture2D = await Picture2D.create(picture);
        let texture = new THREE.Texture();
        let w = picture2D.image.width;
        let h = picture2D.image.height;

        // Update picture infos for collisions
        picture.width = Math.floor(w / RPM.SQUARE_SIZE);
        picture.height = Math.floor(h / RPM.SQUARE_SIZE);
        Platform.ctxr.clearRect(0, 0, Platform.canvasRendering.width, Platform
            .canvasRendering.height);
        Platform.canvasRendering.width = w + RPM.SQUARE_SIZE;
        Platform.canvasRendering.height = h;
        Platform.ctxr.drawImage(picture2D.image, 0, 0);
        let left = Platform.ctxr.getImageData(0, 0, Math.floor(RPM.SQUARE_SIZE /
            2), h);
        let right = Platform.ctxr.getImageData(w - Math.floor(RPM.SQUARE_SIZE / 
            2), 0, Math.floor(RPM.SQUARE_SIZE / 2), picture2D.image.height);
        try
        {
            Platform.ctxr.putImageData(left, w, 0);
            Platform.ctxr.putImageData(right, w + Math.floor(RPM.SQUARE_SIZE / 2
                ), 0);
        } catch (e)
        {
            RPM.showErrorMessage("Error: Wrong wall (with ID:" + id + ") parsing. Please verify that you have a 3 x 3 picture.");
        }
        texture.image = await Picture2D.loadImage(Platform.canvasRendering
            .toDataURL());
        texture.needsUpdate = true;
    }
}
