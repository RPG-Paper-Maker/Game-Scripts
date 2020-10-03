/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A class for pictures drawable in HUD
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
class Picture2D extends Bitmap
{
    constructor(path = "", callback = null, x = 0, y = 0, w = 0, h = 0)
    {
        super(x, y, w, h);

        this.zoom = 1.0;
        this.opacity = 1.0;
        this.angle = 0;
        this.cover = false;
        this.stretch = false;
        if (path)
        {
            this.path = path;
            this.callback = callback;
            this.checked = false;
            this.empty = false;
            this.image = new Image();
            this.image.onload = () => {
                this.check();
            }
            this.image.src = this.path;
        } else {
            this.empty = true;
            this.check();
        }
    }

    createCopy()
    {
        var picture = new Picture2D();
    
        picture.empty = this.empty;
        picture.path = this.path;
        picture.callback = this.callback;
        picture.image = this.image;
        picture.checked = true;
        picture.stretch = false;
        picture.setW(picture.image.width, true);
        picture.setH(picture.image.height, true);
    
        return picture;
    }
    
    // -------------------------------------------------------
    
    check() {
        if (this.empty) {
            this.setW(1);
            this.setH(1);
            this.checked = true;
            RPM.requestPaintHUD = true;
            return true;
        } else
        {
            this.oW = this.image.width;
            this.oH = this.image.height;
            if (this.cover)
            {
                this.w = RPM.CANVAS_WIDTH;
                this.h = RPM.CANVAS_HEIGHT;
            } else if (this.stretch)
            {
                this.w = RPM.getScreenX(this.image.width);
                this.h = RPM.getScreenY(this.image.height);
            } else
            {
                this.w = RPM.getScreenMinXY(this.image.width);
                this.h = RPM.getScreenMinXY(this.image.height);
            }
            if (this.callback) {
                this.callback.call(this);
            }
            this.checked = true;
            RPM.requestPaintHUD = true;
            return true;
        }
    }
    
    // -------------------------------------------------------
    
    destroy() {
        Platform.canvasRendering.unloadImage(this.path);
    }
    
    // -------------------------------------------------------
    
    draw (x, y, w, h, sx, sy, sw, sh, positionResize)
    {
        if (!this.checked) {
            this.check();
        }
    
        // Default values
        if (typeof positionResize === 'undefined') {
            positionResize = true;
        }
        if (typeof x === 'undefined') {
            x = this.x;
        } else {
            if (positionResize) {
                x = RPM.getScreenX(x);
            }
        }
        if (typeof y === 'undefined') {
            y = this.y;
        } else {
            if (positionResize) {
                y = RPM.getScreenY(y);
            }
        }
        if (typeof w === 'undefined') {
            w = this.w * this.zoom;
        } else {
            w = this.stretch ? RPM.getScreenX(w) : RPM.getScreenMinXY(w);
        }
        if (typeof h === 'undefined') {
            h = this.h * this.zoom;
        } else {
            h = this.stretch ? RPM.getScreenY(h) : RPM.getScreenMinXY(h)
        }
        if (typeof sx === 'undefined') sx = 0;
        if (typeof sy === 'undefined') sy = 0;
        if (typeof sw === 'undefined') sw = this.oW;
        if (typeof sh === 'undefined') sh = this.oH;
    
        if (sw <= 0 || sh <= 0) {
            return;
        }
    
        // Draw the image
        if (!this.empty) {
            var angle;
    
            angle = this.angle * Math.PI / 180;
            Platform.ctx.save();
            Platform.ctx.globalAlpha = this.opacity;
            if (!this.centered) {
                if (this.reverse) {
                    Platform.ctx.scale(-1, 1);
                    Platform.ctx.translate(-x -w, y);
                } else {
                    Platform.ctx.translate(x, y);
                }
            }
            if (angle !== 0) {
                if (this.centered) {
                    Platform.ctx.translate(x, y);
                }
                Platform.ctx.rotate(angle);
                if (this.centered) {
                    Platform.ctx.translate(-x, -y);
                }
            }
            if (this.centered) {
                if (this.reverse) {
                    Platform.ctx.scale(-1, 1);
                    Platform.ctx.translate(-x -w, y);
                } else {
                    Platform.ctx.translate(x - (w / 2), y - (h / 2));
                }
            }
            Platform.ctx.drawImage(this.image, sx, sy, sw, sh, 0, 0, w, h);
            Platform.ctx.globalAlpha = 1.0;
            Platform.ctx.restore();
        }
    }
}

// -------------------------------------------------------

Picture2D.createImage = function(image, kind, callback, x, y, w, h) {
    return image ? new Picture2D(image.getPath(kind)[1], callback, x, y, w, h) :
        new Picture2D();
}

// -------------------------------------------------------

Picture2D.createImageWithID = function(id, kind, callback, x, y, w, h) {
    return Picture2D.createImage(RPM.datasGame.pictures.get(kind, id), kind,
        callback, x, y, w, h);
}
