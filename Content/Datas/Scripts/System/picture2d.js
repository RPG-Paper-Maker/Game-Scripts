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
//  CLASS Picture2D < Bitmap
//
// -------------------------------------------------------

/** @class
*   A class for pictures drawable in HUD.
*   @extends Bitmap
*   @property {string} path The path to the ressource.
*   @property {function} callback Function to call after the image is loaded.
*   @param {string} path The path to the ressource.
*   @param {function} callback Function to call after the image is loaded.
*   @param {number} [x=0] - Coords of the bitmap.
*   @param {number} [y=0] - Coords of the bitmap.
*   @param {number} [w=0] - Coords of the bitmap.
*   @param {number} [h=0] - Coords of the bitmap.
*/
function Picture2D(path, callback, x, y, w, h) {
    Bitmap.call(this, x, y, w, h);

    this.path = path;
    this.callback = callback;

    $picturesLoading.push(this);
    $canvasRendering.loadImage(path);
}

Picture2D.destroyAll = function() {
    for (var i = $picturesLoaded.length - 1; i >= 0; i--)
        $picturesLoaded[i].destroy();
};

Picture2D.prototype = {

    setX: function(x) {
        Bitmap.prototype.setX.call(this, x);
    },

    // -------------------------------------------------------

    setY: function(y) {
        Bitmap.prototype.setY.call(this, y);
    },

    // -------------------------------------------------------

    setW: function(w) {
        Bitmap.prototype.setW.call(this, w);
    },

    // -------------------------------------------------------

    setH: function(h) {
        Bitmap.prototype.setH.call(this, h);
    },

    // -------------------------------------------------------

    check: function() {
        if ($canvasRendering.isImageLoaded(this.path)) {
            $picturesLoading.splice($picturesLoading.indexOf(this), 1);
            $picturesLoaded.push(this);
            this.callback.call(this);

            return true;
        }

        return false;
    },

    // -------------------------------------------------------

    destroy: function() {
        $canvasRendering.unloadImage(this.path);
        $picturesLoaded.splice($picturesLoaded.indexOf(this), 1);
    }
}
