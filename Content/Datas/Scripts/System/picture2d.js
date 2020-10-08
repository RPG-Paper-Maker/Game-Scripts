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
*   @property {string} path The path to the ressource
*   @property {number} [zoom=1.0] The zoom value of the picture
*   @property {number} [opacity=1.0] The opacity value of the picture
*   @property {number} [angle=0.0] The angle value of the picture
*   @property {boolean} [cover=false] Indicate if the picture cover the entire 
*   canvas
*   @property {boolean} [stretch=false] Indicate if the picture is stretched if 
*   necessary
*   @param {string} path The path to the ressource
*   @param {number} [x=0] Coords of the bitma
*   @param {number} [y=0] Coords of the bitmap
*   @param {number} [w=0] Coords of the bitmap
*   @param {number} [h=0] Coords of the bitmap
*/
class Picture2D extends Bitmap
{
    constructor(path = "", x = 0, y = 0, w = 0, h = 0)
    {
        super(x, y, w, h);

        this.zoom = 1.0;
        this.opacity = 1.0;
        this.angle = 0.0;
        this.cover = false;
        this.stretch = false;
        if (path)
        {
            this.path = path;
            this.loaded = false;
            this.empty = false;
        } else
        {
            this.empty = true;
        }
    }

    // -------------------------------------------------------
    /** Create a picture and then load it
    *   @static
    *   @param {SystemPicture} picture The picture to load
    *   @param {number} x The x position
    *   @param {number} y The y position
    *   @param {number} w The w size
    *   @param {number} h The h size
    */
    static async create(picture, x = 0, y = 0, w = 0, h = 0)
    {
        let pic = picture ? new Picture2D(picture.getPath(), x, y, w, h) : new 
            Picture2D();
        await pic.load();
        return pic;
    }

    // -------------------------------------------------------
    /** Create a picture from kind and id and then load it
    *   @static
    *   @param {number} id The picture id to load
    *   @param {PictureKind} kind The picture kind to load
    *   @param {number} x The x position
    *   @param {number} y The y position
    *   @param {number} w The w size
    *   @param {number} h The h size
    */
    static async createWithID(id, kind, x = 0, y = 0, w = 0, h = 0)
    {
        return (await Picture2D.create(RPM.datasGame.pictures.get(kind, id)
            , x, y, w, h));
    }

    // -------------------------------------------------------
    /** Load the image
    *   @static
    *   @param {string} path The image path
    */
    static async loadImage(path)
    {
        return (await new Promise((resolve, reject) => {
            let image = new Image()
            image.onload = () => resolve(image);
            image.onerror = () => {
                image.empty = true;
                resolve(image);
            }
            image.src = path;
        }));
    }

    // -------------------------------------------------------
    /** Load the picture and then check
    */
    async load()
    {
        if (this.path)
        {
            // Try loading
            this.image = await Picture2D.loadImage(this.path);
            this.empty = this.image.empty;

            // If not empty, configure bitmap size
            if (!this.empty)
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
                RPM.requestPaintHUD = true;
                this.loaded = true;
            }
        }
    }

    // -------------------------------------------------------
    /** Create a copy of a picture2D
    */
    createCopy()
    {
        let picture = new Picture2D();
        picture.empty = this.empty;
        picture.path = this.path;
        picture.image = this.image;
        picture.loaded = true;
        picture.stretch = false;
        picture.setW(picture.image.width, true);
        picture.setH(picture.image.height, true);
        return picture;
    }
    
    // -------------------------------------------------------
    /** Draw the picture on HUD
    */
    draw (x, y, w, h, sx = 0, sy = 0, sw = this.oW, sh = this.oH, positionResize
        = true)
    {
        if (this.loaded && sw > 0 && sh > 0)
        {
            // Default values
            x = RPM.isUndefined(x) ? this.x : (positionResize ? RPM.getScreenX(
                x) : x);
            y = RPM.isUndefined(y) ? this.y : (positionResize ? RPM.getScreenY(
                    y) : y);
            w = RPM.isUndefined(w) ? this.w * this.zoom : (this.stretch ? RPM
                .getScreenX(w) : RPM.getScreenMinXY(w));
            h = RPM.isUndefined(h) ? this.h * this.zoom : (this.stretch ? RPM
                .getScreenY(h) : RPM.getScreenMinXY(h));
        
            // Draw the image according to all parameters
            let angle = this.angle * Math.PI / 180;
            Platform.ctx.save();
            Platform.ctx.globalAlpha = this.opacity;
            if (!this.centered)
            {
                if (this.reverse)
                {
                    Platform.ctx.scale(-1, 1);
                    Platform.ctx.translate(-x -w, y);
                } else
                {
                    Platform.ctx.translate(x, y);
                }
            }
            if (angle !== 0)
            {
                if (this.centered)
                {
                    Platform.ctx.translate(x, y);
                }
                Platform.ctx.rotate(angle);
                if (this.centered)
                {
                    Platform.ctx.translate(-x, -y);
                }
            }
            if (this.centered)
            {
                if (this.reverse)
                {
                    Platform.ctx.scale(-1, 1);
                    Platform.ctx.translate(-x -w, y);
                } else
                {
                    Platform.ctx.translate(x - (w / 2), y - (h / 2));
                }
            }
            Platform.ctx.drawImage(this.image, sx, sy, sw, sh, 0, 0, w, h);
            Platform.ctx.globalAlpha = 1.0;
            Platform.ctx.restore();
        }
    }
}