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
//  CLASS SystemPicture
//
// -------------------------------------------------------

/** @class
*   A picture of the game.
*   @property {boolean} isBR Indicate if the pciture is a BR (Basic Ressource).
*/
function SystemPicture(){

}

/** Get the folder associated to a kind of picture.
*   @param {PictureKind} kind The kind of picture.
*   @param {boolean} isBR Indicate if the pciture is a BR.
*   @returns {string}
*/
SystemPicture.getFolder = function(kind, isBR){
    var folder = isBR ? RPM.PATH_BR : $ROOT_DIRECTORY;
    var folderLocal = isBR ? RPM.PATH_BR : $ROOT_DIRECTORY_LOCAL;
    var dir = SystemPicture.getLocalFolder(kind);
    var path = folder + dir;
    var pathLocal = folderLocal + dir;

    return [path, pathLocal];
};

// -------------------------------------------------------

/** Get the local folder associated to a kind of picture.
*   @param {PictureKind} kind The kind of picture.
*   @returns {string}
*/
SystemPicture.getLocalFolder = function(kind){

    switch(kind){
    case PictureKind.Bars:
        return RPM.PATH_BARS;
    case PictureKind.Icons:
        return RPM.PATH_ICONS;
    case PictureKind.Autotiles:
        return RPM.PATH_AUTOTILES;
    case PictureKind.Characters:
        return RPM.PATH_CHARACTERS;
    case PictureKind.Reliefs:
        return RPM.PATH_RELIEFS;
    case PictureKind.Tilesets:
        return RPM.PATH_TILESETS;
    case PictureKind.Walls:
        return RPM.PATH_WALLS;
    case PictureKind.Battlers:
        return RPM.PATH_BATTLERS;
    case PictureKind.Facesets:
        return RPM.PATH_FACESETS;
    case PictureKind.WindowSkins:
        return RPM.PATH_WINDOW_SKINS;
    case PictureKind.TitleScreen:
        return RPM.PATH_TITLE_SCREEN;
    case PictureKind.Objects3D:
        return RPM.PATH_OBJECTS_3D;
    case PictureKind.Mountains:
        return RPM.PATH_MOUNTAINS;
    case PictureKind.Pictures:
        return RPM.PATH_HUD_PICTURES;
    case PictureKind.Animations:
        return RPM.PATH_ANIMATIONS;
    }

    return "";
};

// -------------------------------------------------------

SystemPicture.prototype = {

    /** Read the JSON associated to the picture.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        this.name = json.name;
        this.isBR = json.br;
        this.jsonCollisions = json.col;
        this.collisionsRepeat = json.rcol;

        if (typeof this.jsonCollisions === 'undefined')
            this.jsonCollisions = new Array;
        if (typeof this.collisionsRepeat === 'undefined')
            this.collisionsRepeat = false;
    },

    load: function(pictureKind) {
        this.picture = Picture2D.createImage(this, pictureKind);
    },

    // -------------------------------------------------------

    /** Get the absolute path associated to this picture.
    *   @param {PictureKind} kind The kind of picture.
    *   @returns {string}
    */
    getPath: function(kind) {
        var paths = SystemPicture.getFolder(kind, this.isBR);
        paths[0] += "/" + this.name;
        paths[1] += "/" + this.name;

        return paths;
    },

    // -------------------------------------------------------

    /** Read collisions according to image size.
    */
    readCollisionsImage: function(image) {
        this.width = Math.floor(image.width / $SQUARE_SIZE);
        this.height = Math.floor(image.height / $SQUARE_SIZE);

        this.readCollisions();
    },

    // -------------------------------------------------------

    /** Read collisions. We assume that this.width and this.height had been
    *   edited.
    */
    readCollisions: function() {
        if (!this.jsonCollisions)
            return;

        var i, j, k, l, w, h, index, collision;
        var jsonTab, jsonKey, jsonVal;
        w = this.width / $FRAMES;
        h = this.height / 4;

        // Initialize
        this.collisions = new Array(this.width * this.height);
        for (i = 0; i < this.width * this.height; i++)
            this.collisions[i] = null;

        // Insert collision
        for (i = 0, l = this.jsonCollisions.length; i < l ; i++) {
            jsonTab = this.jsonCollisions[i];
            jsonKey = jsonTab.k;
            jsonVal = jsonTab.v;
            index = jsonKey[0] + (jsonKey[1] * this.width);
            collision = new CollisionSquare;
            collision.readJSON(jsonVal);
            this.collisions[index] = collision;

            if (this.collisionsRepeat) {
                for (j = 0; j < $FRAMES; j++) {
                    for (k = 0; k < 4; k++) {
                        this.collisions[(jsonKey[0] + (j * w)) + ((jsonKey[1] +
                        (k * h)) * this.width)] = collision;
                    }
                }
            }
        }

        this.jsonCollisions = null;
    },

    // -------------------------------------------------------

    /** Get a specific collision square according to texture.
    */
    getCollisionAt: function(texture) {
        return this.getCollisionAtPos(texture[0], texture[1]);
    },

    // -------------------------------------------------------

    /** Get a specific collision square according to texture.
    */
    getCollisionAtPos: function(x, y) {
        return this.collisions[x + y * this.width];
    },


    // -------------------------------------------------------

    /** Get a specific collision square according to index.
    */
    getCollisionAtIndex: function(index) {
        return this.getCollisionAtPos(index % this.width,
                                      Math.floor(index / this.width));
    },

    // -------------------------------------------------------

    /** Get a specific collision for wall.
    */
    getSquaresForWall: function(texture) {
        var i, l, w = texture[2], h = texture[3], x, y;
        var square, leftSquare, rightSquare, fusion;
        l = w * h;
        var squares = new Array(l);
        for (i = 0; i < l; i++) {
            x = texture[0] + (i % w);
            y = texture[1] + Math.floor(i / w);

            if (x === 3) {
                leftSquare = this.getCollisionAtPos(0, y);
                rightSquare = this.getCollisionAtPos(2, y);

                if (leftSquare === null && rightSquare === null) {
                    squares[i] = null;
                }
                else if (leftSquare === null || rightSquare === null) {
                    if (leftSquare === null)
                        square = rightSquare;
                    else
                        square = leftSquare;

                    if (!square) {
                        RPM.showErrorMessage("Your wall image " + this.name +
                            " is not using a correct template. Your image "
                            + "should be this size: WIDTH: 3 * SQUARE_SIZE, "
                            + "HEIGHT: as you wish. There should be left wall, "
                            + "middle wall, and right wall for the 3 width "
                            + "squares.");
                        return;
                    }

                    squares[i] = square.rect;
                }
                else
                    squares[i] = [0, 0, $SQUARE_SIZE, $SQUARE_SIZE];
            }
            else {
                square = this.getCollisionAtPos(x, y);
                if (square)
                    squares[i] = square.rect;
                else
                    squares[i] = null;
            }
        }

        return CollisionSquare.unionSquares(squares, l, w, h);
    },

    // -------------------------------------------------------

    /** Get a specific collision square according to texture.
    */
    getSquaresForTexture: function(texture) {
        var i, l, w = texture[2], h = texture[3];
        var square;
        l = w * h;
        var squares = new Array(l);
        for (i = 0; i < l; i++) {
            square = this.getCollisionAtPos(texture[0] + (i % w), texture[1] +
                     Math.floor(i / w));
            if (square)
                squares[i] = square.rect;
            else
                squares[i] = null;
        }

        return CollisionSquare.unionSquares(squares, l, w, h);
    },

    // -------------------------------------------------------

    /** Get a specific collision square according to texture.
    */
    getSquaresForStates: function(image) {
        var w = Math.floor(image.width / $SQUARE_SIZE / $FRAMES);
        var h = Math.floor(image.height / $SQUARE_SIZE / 4);
        var states = new Array($FRAMES * 4);
        var i, j;

        for (i = 0; i < $FRAMES; i++) {
            for (j = 0; j < 4; j++) {
                states[i + (j * $FRAMES)] = this.getSquaresForTexture(
                    [i * w, j * h, w, h]);
            }
        }

        return states;
    }
}
