/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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
    this.checked = false;

    $picturesLoading.push(this);
    $canvasRendering.loadImage(path);
}

// -------------------------------------------------------

Picture2D.createImage = function(image, kind, callback, x, y, w, h) {
    return new Picture2D(image.getPath(kind)[1], callback, x, y, w, h);
}

// -------------------------------------------------------

Picture2D.createImageWithID = function(id, kind, callback, x, y, w, h) {
    return Picture2D.createImage($datasGame.pictures.get(kind, id), kind,
        callback, x, y, w, h);
}

// -------------------------------------------------------

Picture2D.prototype = Object.create(Bitmap.prototype);

// -------------------------------------------------------

Picture2D.prototype.check = function() {
    if ($canvasRendering.isImageLoaded(this.path)) {
        var context = $canvasRendering.getContext('2d');
        $picturesLoading.splice($picturesLoading.indexOf(this), 1);
        $picturesLoaded.push(this);
        this.image = context.createImageData(this.path);
        this.w = this.image.width;
        this.h = this.image.height;

        if (this.callback) {
            this.callback.call(this);
        }
        this.checked = true;
        $requestPaintHUD = true;

        return true;
    }

    return false;
};

// -------------------------------------------------------

Picture2D.prototype.destroy = function() {
    $canvasRendering.unloadImage(this.path);
};

// -------------------------------------------------------

Picture2D.prototype.draw = function(x, y, w, h, sx, sy, sw, sh) {
    if (!this.checked) {
        this.check();
    }

    // Default values
    if (typeof x === 'undefined') x = this.x;
    if (typeof y === 'undefined') y = this.y;
    if (typeof w === 'undefined') w = this.w;
    if (typeof h === 'undefined') h = this.h;
    if (typeof sx === 'undefined') sx = 0;
    if (typeof sy === 'undefined') sy = 0;
    if (typeof sw === 'undefined') sw = this.w;
    if (typeof sh === 'undefined') sh = this.h;

    if (sw <= 0 || sh <= 0) {
        return;
    }

    x = RPM.getScreenX(x);
    y = RPM.getScreenY(y);
    w = RPM.getScreenX(w);
    h = RPM.getScreenY(h);

    // Draw the image
    if (this.reverse) {
        $context.save();
        $context.scale(-1,1);
        $context.drawImage(this.path, sx, sy, sw, sh, -x - w, y, w, h);
        $context.restore();
    } else {
        $context.drawImage(this.path, sx, sy, sw, sh, x, y, w, h);
    }
};
