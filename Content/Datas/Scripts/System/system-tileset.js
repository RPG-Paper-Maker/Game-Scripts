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
//  CLASS SystemTileset
//
// -------------------------------------------------------

/** @class
*   A tileset of the game.
*   @property {SystemPicture} picture The picture used for this tileset.
*   @property {number} width
*   @property {number} height
*   @property {number[]} autotiles All the IDs of used autotiles for this
*   tileset.
*   @property {number[]} walls All the IDs of used walls for this tileset.
*   @property {CollisionSquare[]} collisions List of all the collisions
*   according to the position on the texture.
*/
function SystemTileset() {
    this.callback = null;
    this.collisions = null;
    this.ownsAutotiles = false;
    this.ownsWalls = false;
}

SystemTileset.prototype = {

    /** Read the JSON associated to the tileset.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        var i, l;
        var jsonSpecials;

        this.id = json.id;
        this.picture = $datasGame.pictures.list[PictureKind.Tilesets][json.pic];

        // Special elements
        jsonSpecials = json.auto;
        l = jsonSpecials.length;
        this.autotiles = new Array(l);
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
    },

    // -------------------------------------------------------

    /** Get the path to the picture tileset.
    *   @returns {string}
    */
    getPath: function() {
        return this.picture ? this.picture.getPath(PictureKind.Tilesets) : null;
    },

    // -------------------------------------------------------

    /** Get the string logic for special elements.
    *   @returns {string}
    */
    getSpecialString: function(specials) {
        var result = "";

        for (var i = 0, l = specials.length; i < l; i++) {
            result += specials[i] + ":";
        }

        return result;
    },

    // -------------------------------------------------------

    /** Get the string logic for autotiles.
    *   @returns {string}
    */
    getAutotilesString: function() {
        return this.getSpecialString(this.autotiles);
    },

    // -------------------------------------------------------

    /** Get the string logic for walls.
    *   @returns {string}
    */
    getWallsString: function() {
        return this.getSpecialString(this.walls);
    },

    // -------------------------------------------------------

    /** Get the string logic for mountains.
    *   @returns {string}
    */
    getMountainsString: function() {
        return this.getSpecialString(this.mountains);
    },

    // -------------------------------------------------------

    /** Load a special texture
    *   @param {PictureKind} pictureKind The picure kind of the special
    *   textures.
    *   @param {string} texturesName The field name textures.
    *   @param {string} specialField The field name for special.
    */
    loadSpecialTextures: function(pictureKind, texturesName, specialField)
    {
        var specials = $datasGame.specialElements[specialField];
        var specialsIDs = this[specialField];
        var id, i, l = specials.length;
        var textures = new Array(l);
        var paths, special, pic, callback, that;

        for (i = 0, l = specialsIDs.length; i < l; i++){
            id = specialsIDs[i];
            special = specials[id];
            if (special) {
                pic = $datasGame.pictures.list[pictureKind][special.pictureID];
                if (pic) {
                    paths = pic.getPath(pictureKind);
                    // Set callback
                    switch (pictureKind) {
                    case PictureKind.Walls:
                        that = this;
                        callback = function(pathLocal, picture) {
                            var texture = new THREE.Texture();
                            that.loadTextureWall(texture, pathLocal, picture, id);
                            return texture;
                        }
                        break;
                    default:
                        callback = null;
                        break;
                    }

                    textures[id] = RPM.loadTexture(paths, pic, callback);
                } else {
                    textures[id] = RPM.loadTextureEmpty();
                }
            } else {
                textures[id] = RPM.loadTextureEmpty();
            }
        }

        this[texturesName] = textures;
    },

    // -------------------------------------------------------

    loadSpecials: function() {
        if (!this.ownsAutotiles) {
            this.loadAutotiles();
        } else {
            if (!this.ownsMountains) {
                this.loadMountains();
            } else {
                if (!this.ownsWalls) {
                    this.loadWalls();
                }
            }
        }
    },

    // -------------------------------------------------------

    /** Load all the autotiles with reduced files.
    */
    loadAutotiles: function() {
        var i, l, autotiles, autotilesIDs, id, offset, result, paths, autotile,
            textureAutotile, that, texture, context, picture, callback;

        autotiles = $datasGame.specialElements.autotiles;
        autotilesIDs = this.autotiles;
        i = 0;
        l = autotiles.length;
        offset = 0;
        result = null;
        textureAutotile = null;
        that = this;
        texture = new THREE.Texture();
        context = $canvasRendering.getContext("2d");
        context.clearRect(0, 0, $canvasRendering.width, $canvasRendering.height);
        $canvasRendering.width = 64 * $SQUARE_SIZE;
        $canvasRendering.height = $MAX_PICTURE_SIZE;
        this.texturesAutotiles = new Array;

        callback = function() {
            if (result !== null) {
                if (result.length < 3) {
                    that.callback = callback;
                    return;
                }
                textureAutotile = result[0];
                texture = result[1];
                offset = result[2];
            }
            if (i < l) {
                id = autotilesIDs[i];
                autotile = autotiles[id];
                if (autotile) {
                    picture = $datasGame.pictures.list[PictureKind.Autotiles][
                        autotile.pictureID];
                    if (picture) {
                        paths = picture.getPath(PictureKind.Autotiles);
                        result = this.loadTextureAutotile(textureAutotile,
                            texture, picture, context, paths, offset, id);
                    } else {
                        result = null;
                    }
                } else {
                    result = null;
                }

                i++;
                that.callback = callback;
            } else {
                if (offset > 0) {
                    that.updateTextureAutotile(textureAutotile, texture);
                    offset = 0;
                    that.callback = callback;
                }

                // Finished loading textures
                if (!that.ownsMountains) {
                    that.callback = that.loadMountains;
                } else {
                    if (!that.ownsWalls) {
                        that.callback = that.loadWalls;
                    } else {
                        that.callback = null;
                    }
                }
            }
        }

        callback.call(this);
    },

    // -------------------------------------------------------

    /** Load all the walls.
    */
    loadWalls: function() {
        this.loadSpecialTextures(PictureKind.Walls, "texturesWalls", "walls");
        this.callback = null;
    },

    // -------------------------------------------------------

    /** Load an autotile ID and add it to context rendering.
    */
    loadTextureAutotile: function(textureAutotile, texture, picture, context,
        paths, offset, id)
    {
        var i, path, pathLocal, that, result, callback, point, img, width,
            height, size, pic;

        $filesToLoad++;
        path = paths[0];
        pathLocal = paths[1];
        that = this;
        result = new Array;

        callback = function() {
            $loadedFiles++;
            img = context.createImageData(pathLocal);
            width = Math.floor((img.width / 2) / $SQUARE_SIZE);
            height = Math.floor((img.height / 3) / $SQUARE_SIZE);
            size = width * height;

            // Update picture width and height for collisions settings
            picture.width = width;
            picture.height = height;

            for (var i = 0; i < size; i++) {
                point = [i % width, Math.floor(i / width)];

                if (offset === 0 && textureAutotile === null) {
                    textureAutotile = new TextureSeveral();
                    textureAutotile.setBegin(id, point);
                }
                that.paintPictureAutotile(context, pathLocal, img, offset,
                    point, id);
                textureAutotile.setEnd(id, point);
                textureAutotile.addToList(id, point);
                offset++;
                if (offset === that.getMaxAutotilesOffsetTexture()) {
                    that.updateTextureAutotile(textureAutotile, texture);
                    texture = new THREE.Texture();
                    context.clearRect(0, 0, $canvasRendering.width,
                        canvasRendering.height);
                    textureAutotile = null;
                    offset = 0;
                }
            }

            result.push(textureAutotile);
            result.push(texture);
            result.push(offset);
        };


        if ($canvasRendering.isImageLoaded(pathLocal)) {
            callback.call(this);
        } else {
            pic = new Picture2D(pathLocal, callback);
        }

        return result;
    },

    // -------------------------------------------------------

    /** Paint the picture in texture.
    */
    paintPictureAutotile: function(context, pathLocal, img, offset, point, id) {
        var count, lA, lB, lC, lD, row = -1;
        var offsetX = point[0] * 2 * $SQUARE_SIZE;
        var offsetY = point[1] * 3 * $SQUARE_SIZE;
        var sDiv = Math.floor($SQUARE_SIZE / 2);
        var y = offset * Autotiles.COUNT_LIST * 2;

        try
        {
            for (var a = 0; a < Autotiles.COUNT_LIST; a++) {
                lA = Autotiles.autotileBorder[Autotiles.listA[a]];
                count = 0;
                row++;
                for (var b = 0; b < Autotiles.COUNT_LIST; b++) {
                    lB = Autotiles.autotileBorder[Autotiles.listB[b]];
                    for (var c = 0; c < Autotiles.COUNT_LIST; c++) {
                        lC = Autotiles.autotileBorder[Autotiles.listC[c]];
                        for (var d = 0; d < Autotiles.COUNT_LIST; d++) {
                            lD = Autotiles.autotileBorder[Autotiles.listD[d]];

                            // Draw
                            context.drawImage(pathLocal, (lA % 4 * sDiv) + offsetX,
                                              (Math.floor(lA / 4) * sDiv) + offsetY,
                                              sDiv, sDiv, count * $SQUARE_SIZE,
                                              (row + y) * $SQUARE_SIZE, sDiv, sDiv);
                            context.drawImage(pathLocal, (lB % 4 * sDiv) + offsetX,
                                              (Math.floor(lB / 4) * sDiv) + offsetY,
                                              sDiv, sDiv,
                                              count * $SQUARE_SIZE + sDiv,
                                              (row + y) * $SQUARE_SIZE, sDiv, sDiv);
                            context.drawImage(pathLocal, (lC % 4 * sDiv) + offsetX,
                                              (Math.floor(lC / 4) * sDiv) + offsetY,
                                              sDiv, sDiv, count * $SQUARE_SIZE,
                                              (row + y) * $SQUARE_SIZE + sDiv,
                                              sDiv, sDiv);
                            context.drawImage(pathLocal, (lD % 4 * sDiv) + offsetX,
                                              (Math.floor(lD / 4) * sDiv) + offsetY,
                                              sDiv, sDiv,
                                              count * $SQUARE_SIZE + sDiv,
                                              (row + y) * $SQUARE_SIZE + sDiv,
                                              sDiv, sDiv);
                            count++;
                            if (count === 64) {
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
    },

    // -------------------------------------------------------

    /** Update texture of a TextureAutotile.
    */
    updateTextureAutotile: function(textureAutotile, texture) {
        var image = new Image();
        $filesToLoad++;
        image.addEventListener('load', function() {
            texture.image = image;
            texture.needsUpdate = true;
            $loadedFiles++;
        }, false);
        image.src = $canvasRendering.toDataURL();

        textureAutotile.texture = RPM.createMaterial(texture);
        this.texturesAutotiles.push(textureAutotile);
    },

    // -------------------------------------------------------

    /** Load a wall texture.
    *   @param {THREE.Texture} texture The final texture reference.
    *   @param {string} pathLocal The path of the texture.
    */
    loadTextureWall: function(texture, pathLocal, picture, id) {
        var callback = function() {
            var context = $canvasRendering.getContext("2d");
            var img = context.createImageData(pathLocal);

            // Update picture infos for collisions
            picture.width = Math.floor(img.width / $SQUARE_SIZE);
            picture.height = Math.floor(img.height / $SQUARE_SIZE);

            context.clearRect(0, 0, $canvasRendering.width,
                              $canvasRendering.height);
            $canvasRendering.width = img.width + $SQUARE_SIZE;
            $canvasRendering.height = img.height;
            context.drawImage(pathLocal, 0, 0);
            var left = context.getImageData(0, 0, Math.floor($SQUARE_SIZE / 2),
                img.height);
            var right = context.getImageData(img.width - Math.floor(
                $SQUARE_SIZE / 2), 0, Math.floor($SQUARE_SIZE / 2), img.height);
            try
            {
                context.drawImage(left, img.width, 0);
                context.drawImage(right, img.width + Math.floor($SQUARE_SIZE / 2
                    ), 0);
            } catch (e)
            {
                RPM.showErrorMessage("Error: Wrong wall (with ID:" + id + ") parsing. Please verify that you have a 3 x 3 picture.");
            }
            var image = new Image();
            image.addEventListener('load', function() {
                texture.image = image;
                texture.needsUpdate = true;
                $loadedFiles++;
            }, false);
            image.src = $canvasRendering.toDataURL();
        };

        if ($canvasRendering.isImageLoaded(pathLocal))
            callback.call(this);
        else
            var pic = new Picture2D(pathLocal, callback);
    },

    // -------------------------------------------------------

    /** Load all the mountains with reduced files.
    */
    loadMountains: function() {
        var i, l, mountains, mountainsIDs, id, offset, result, paths, mountain,
            textureMountain, that, texture, context, picture, callback;

        mountains = $datasGame.specialElements.mountains;
        mountainsIDs = this.mountains;
        i = 0;
        l = mountains.length;
        offset = 0;
        result = null;
        textureMountain = null;
        that = this;
        texture = new THREE.Texture();
        context = $canvasRendering.getContext("2d");
        context.clearRect(0, 0, $canvasRendering.width, $canvasRendering.height);
        $canvasRendering.width = 4 * $SQUARE_SIZE;
        $canvasRendering.height = $MAX_PICTURE_SIZE;
        this.texturesMountains = new Array;

        callback = function() {
            if (result !== null) {
                if (result.length < 3) {
                    that.callback = callback;
                    return;
                }
                textureMountain = result[0];
                texture = result[1];
                offset = result[2];
            }
            if (i < mountainsIDs.length) {
                id = mountainsIDs[i];
                mountain = mountains[id];
                if (mountain) {
                    picture = $datasGame.pictures.list[PictureKind.Mountains][
                        mountain.pictureID];
                } else {
                    picture = null;
                }
                result = this.loadTextureMountain(textureMountain, texture,
                    picture, context, offset, id);
                i++;
                that.callback = callback;
            }
            else {
                if (offset > 0) {
                    that.updateTextureMountain(textureMountain, texture);
                    offset = 0;
                    that.callback = callback;
                }

                // Finished loading textures
                if (!that.ownsWalls) {
                    that.callback = that.loadWalls;
                } else {
                    that.callback = null;
                }
            }
        }

        callback.call(this);
    },

    // -------------------------------------------------------

    /** Load a mountain ID and add it to context rendering.
    */
    loadTextureMountain: function(textureMountain, texture, picture, context,
        offset, id)
    {
        var i, paths, path, pathLocal, that, result, callback, point, img, width,
            height, size, pic;

        $filesToLoad++;
        if (picture) {
            paths = picture.getPath(PictureKind.Mountains);
            path = paths[0];
            pathLocal = paths[1];
        }
        that = this;
        result = new Array;

        callback = function() {
            $loadedFiles++;
            if (picture) {
                img = context.createImageData(pathLocal);
            }
            width = 3;
            height = 3;
            size = 9;

            // Update picture width and height for collisions settings
            if (picture) {
                picture.width = width;
                picture.height = height;
            }

            for (var i = 0; i < size; i++) {
                point = [i % width, Math.floor(i / width)];

                if (offset === 0 && textureMountain === null) {
                    textureMountain = new TextureSeveral();
                    textureMountain.setBegin(id, point);
                }
                if (picture) {
                    that.paintPictureMountain(context, pathLocal, img, offset,
                        point, id);
                }

                textureMountain.setEnd(id, point);
                textureMountain.addToList(id, point);
                offset++;
                if (offset === that.getMaxMountainOffsetTexture()) {
                    that.updateTextureMountain(textureMountain, texture);
                    texture = new THREE.Texture();
                    context.clearRect(0, 0, $canvasRendering.width,
                        canvasRendering.height);
                    textureMountain = null;
                    offset = 0;
                }
            }

            result.push(textureMountain);
            result.push(texture);
            result.push(offset);
        };

        if (!picture || $canvasRendering.isImageLoaded(pathLocal)) {
            callback.call(this);
        } else {
            pic = new Picture2D(pathLocal, callback);
        }

        return result;
    },

    // -------------------------------------------------------

    /** Paint the picture in texture.
    */
    paintPictureMountain: function(context, pathLocal, img, offset, point, id) {
        var i, l, y, sourceSize, sDiv;

        y = offset * 4 * $SQUARE_SIZE;
        sourceSize = 3 * $SQUARE_SIZE;
        sDiv = Math.round($SQUARE_SIZE / 2);

        // Draw original image
        context.drawImage(pathLocal, 0, y);

        // Add left/right autos
        try {
            for (i = 0, l = 3; i < l; i++) {
                context.drawImage(pathLocal, 0, (i * $SQUARE_SIZE), sDiv,
                    $SQUARE_SIZE, sourceSize, y + (i * $SQUARE_SIZE), sDiv,
                    $SQUARE_SIZE);
                context.drawImage(pathLocal, sourceSize - sDiv, (i * $SQUARE_SIZE),
                    sDiv, $SQUARE_SIZE, sourceSize + sDiv, y + (i * $SQUARE_SIZE),
                    sDiv, $SQUARE_SIZE);
            }

            // Add top/bot autos
            for (i = 0, l = 3; i < l; i++) {
                context.drawImage(pathLocal, i * $SQUARE_SIZE, 0, $SQUARE_SIZE, sDiv
                    , i * $SQUARE_SIZE, y + sourceSize, $SQUARE_SIZE, sDiv);
                context.drawImage(pathLocal, i * $SQUARE_SIZE, sourceSize - sDiv,
                    $SQUARE_SIZE, sDiv, i * $SQUARE_SIZE, y + sourceSize + sDiv,
                    $SQUARE_SIZE, sDiv);
            }

            // Add all sides autos
            context.drawImage(pathLocal, 0, 0, sDiv, sDiv, sourceSize, y +
                sourceSize, sDiv, sDiv);
            context.drawImage(pathLocal, sourceSize - sDiv, 0, sDiv, sDiv,
                sourceSize + sDiv, y + sourceSize, sDiv, sDiv);
            context.drawImage(pathLocal, 0, sourceSize - sDiv, sDiv, sDiv,
                sourceSize, y + sourceSize + sDiv, sDiv, sDiv);
            context.drawImage(pathLocal, sourceSize - sDiv, sourceSize - sDiv, sDiv,
                sDiv, sourceSize + sDiv, y + sourceSize + sDiv, sDiv, sDiv);
        } catch (e)
        {
            RPM.showErrorMessage("Error: Wrong mountain (with ID:" + id + ") parsing. Please verify that you have a 3 x 3 picture.");
        }
    },

    // -------------------------------------------------------

    /** Update texture of a TextureSeveral.
    */
    updateTextureMountain: function(textureMountain, texture) {
        var image = new Image();
        $filesToLoad++;
        image.addEventListener('load', function() {
            texture.image = image;
            texture.needsUpdate = true;
            $loadedFiles++;
        }, false);
        image.src = $canvasRendering.toDataURL();

        textureMountain.texture = RPM.createMaterial(texture);
        this.texturesMountains.push(textureMountain);
    },

    // -------------------------------------------------------

    getMaxMountainOffsetTexture: function() {
        return Math.floor($MAX_PICTURE_SIZE / (4 * $SQUARE_SIZE));
    },

    // -------------------------------------------------------

    getMaxAutotilesOffsetTexture: function() {
        return Math.floor($MAX_PICTURE_SIZE / (9 * $SQUARE_SIZE));
    }
}
