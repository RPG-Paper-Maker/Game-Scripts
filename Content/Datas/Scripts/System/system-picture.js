/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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
                    squares[i] = square.rect;
                }
                else
                    squares[i] = [0, 0, $SQUARE_SIZE, $SQUARE_SIZE];
            }
            else {
                square = this.getCollisionAtPos(x, y);
                if (square === null)
                    squares[i] = null;
                else
                    squares[i] = square.rect;
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
            if (square === null)
                squares[i] = null;
            else
                squares[i] = square.rect;
        }

        return CollisionSquare.unionSquares(squares, l, w, h);
    },

    // -------------------------------------------------------

    /** Get a specific collision square according to texture.
    */
    getSquaresForStates: function(image) {
        var w = image.width / $SQUARE_SIZE / $FRAMES;
        var h = image.height / $SQUARE_SIZE / 4;
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
