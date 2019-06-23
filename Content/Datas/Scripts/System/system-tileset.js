/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
function SystemTileset(){
    this.callback = null;
    this.collisions = null;
}

SystemTileset.prototype = {

    /** Read the JSON associated to the tileset.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        var i, l;
        var jsonAutotiles, jsonWalls, jsonObjects3D;

        this.id = json.id;
        this.picture = $datasGame.pictures.list[PictureKind.Tilesets][json.pic];

        // Special elements
        jsonAutotiles = json.auto;
        l = jsonAutotiles.length;
        this.autotiles = new Array(l);
        for (i = 0; i < l; i++) {
            this.autotiles[i] = jsonAutotiles[i].id;
        }
        jsonWalls = json.walls;
        l = jsonWalls.length;
        this.walls = new Array(l);
        for (i = 0; i < l; i++) {
            this.walls[i] = jsonWalls[i].id;
        }
        jsonObjects3D = json.objs;
        l = jsonObjects3D.length;
        this.objects = new Array(l);
        for (i = 0; i < l; i++) {
            this.objects[i] = jsonObjects3D[i].id;
        }
    },

    // -------------------------------------------------------

    /** Get the path to the picture tileset.
    *   @returns {string}
    */
    getPath: function(){
        return this.picture.getPath(PictureKind.Tilesets);
    },

    // -------------------------------------------------------

    /** Get the string logic for special elements.
    *   @returns {string}
    */
    getSpecialString: function(specials){
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
    getAutotilesString: function(){
        return this.getSpecialString(this.autotiles);
    },

    // -------------------------------------------------------

    /** Get the string logic for walls.
    *   @returns {string}
    */
    getWallsString: function(){
        return this.getSpecialString(this.walls);
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

        // Set callback
        switch (pictureKind) {
        case PictureKind.Walls:
            that = this;
            callback = function(pathLocal, picture) {
                var texture = new THREE.Texture();
                that.loadTextureWall(texture, pathLocal, picture);
                return texture;
            }
            break;
        default:
            callback = null;
            break;
        }

        for (i = 0, l = specialsIDs.length; i < l; i++){
            id = specialsIDs[i];
            special = specials[id];
            pic = $datasGame.pictures.list[pictureKind][special.pictureID];
            paths = pic.getPath(pictureKind);
            textures[id] = RPM.loadTexture(paths, pic, callback);
        }

        this[texturesName] = textures;
    },

    // -------------------------------------------------------

    /** Load all the autotiles with reduced files.
    */
    loadAutotiles: function(){
        var autotiles = $datasGame.specialElements.autotiles;
        var autotilesIDs = this.autotiles;
        var id, i = 0, l = autotiles.length, offset = 0;
        var result = null, paths, autotile, textureAutotile = null, that = this;
        var texture = new THREE.Texture(), picture;
        var context = $canvasRendering.getContext("2d");
        context.clearRect(0, 0, $canvasRendering.width, $canvasRendering.height);
        $canvasRendering.width = 64 * $SQUARE_SIZE;
        $canvasRendering.height = $MAX_PICTURE_SIZE;
        this.texturesAutotiles = new Array;

        var callback = function() {
            if (i < autotilesIDs.length) {
                if (result !== null) {
                    if (result.length < 3) {
                        that.callback = callback;
                        return;
                    }
                    textureAutotile = result[0];
                    texture = result[1];
                    offset = result[2];
                }
                id = autotilesIDs[i];
                autotile = autotiles[id];
                picture = $datasGame.pictures.list[PictureKind.Autotiles]
                            [autotile.pictureID];
                paths = picture.getPath(PictureKind.Autotiles);
                result = this.loadTextureAutotile(textureAutotile, texture,
                                                  picture, context, paths,
                                                  offset, id);
                i++;
                that.callback = callback;
            }
            else {
                if (offset > 0) {
                    that.updateTextureAutotile(textureAutotile, texture);
                    offset = 0;
                    that.callback = callback;
                }

                // Finished loading textures
                that.callback = that.loadWalls;
            }
        }

        callback.call(this);
    },

    // -------------------------------------------------------

    /** Load all the walls.
    */
    loadWalls: function(){
        this.loadSpecialTextures(PictureKind.Walls, "texturesWalls", "walls");
        this.callback = null;
    },

    // -------------------------------------------------------

    /** Load an autotile ID and add it to context rendering.
    */
    loadTextureAutotile: function(textureAutotile, texture, picture, context,
                                  paths, offset, id)
    {
        $filesToLoad++;
        var path = paths[0];
        var pathLocal = paths[1];
        var that = this;
        var result = new Array;

        var callback = function() {
            $loadedFiles++;
            var point, img = context.createImageData(pathLocal);
            var width = Math.floor((img.width / 2) / $SQUARE_SIZE);
            var height = Math.floor((img.height / 3) / $SQUARE_SIZE);
            var size = width * height;

            // Update picture width and height for collisions settings
            picture.width = width;
            picture.height = height;

            for (var i = 0; i < size; i++) {
                point = [i % width, Math.floor(i / width)];

                if (offset === 0 && textureAutotile === null) {
                    textureAutotile = new TextureAutotile();
                    textureAutotile.setBegin(id, point);
                }
                that.paintPictureAutotile(context, pathLocal, img, offset,
                                          point);
                textureAutotile.setEnd(id, point);
                textureAutotile.addToList(id, point);
                offset++;
                if (offset === 6) {
                    that.updateTextureAutotile(textureAutotile, texture);
                    texture = new THREE.Texture();
                    context.clearRect(0, 0, $canvasRendering.width,
                                      $canvasRendering.height);
                    textureAutotile = null;
                    offset = 0;
                }
            }

            result.push(textureAutotile);
            result.push(texture);
            result.push(offset);
        };


        if ($canvasRendering.isImageLoaded(pathLocal))
            callback.call(this);
        else
            var pic = new Picture2D(pathLocal, callback);

        return result;
    },

    // -------------------------------------------------------

    /** Paint the picture in texture.
    */
    paintPictureAutotile: function(context, pathLocal, img, offset, point) {
        var count, lA, lB, lC, lD, row = -1;
        var offsetX = point[0] * 2 * $SQUARE_SIZE;
        var offsetY = point[1] * 3 * $SQUARE_SIZE;
        var sDiv = Math.floor($SQUARE_SIZE / 2);
        var y = offset * Autotiles.COUNT_LIST * 2;

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
    loadTextureWall: function(texture, pathLocal, picture) {
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
            context.drawImage(left, img.width, 0);
            context.drawImage(right, img.width + Math.floor($SQUARE_SIZE / 2), 0);
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
    }
}
