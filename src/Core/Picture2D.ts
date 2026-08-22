/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { PICTURE_KIND, Platform, ScreenResolution } from '../Common';
import { Data, Model } from '../index';
import { Stack } from '../Manager';
import { Bitmap } from './Bitmap';

/** @class
 *   A class for pictures drawable in HUD.
 *   @extends Bitmap
 *   @param {string} [path=""] - The path to the ressource
 *   @param {number} [x=0] - Coords of the bitmap
 *   @param {number} [y=0] - Coords of the bitmap
 *   @param {number} [w=0] - Coords of the bitmap
 *   @param {number} [h=0] - Coords of the bitmap
 */
class Picture2D extends Bitmap {
	public zoom: number;
	public opacity: number;
	public angle: number;
	public cover: boolean;
	public stretch: boolean;
	public path: string;
	public loaded: boolean;
	public empty: boolean;
	public image: HTMLImageElement;
	public centered: boolean;
	public minPositionOffsetX: number = 0;
	public minPositionOffsetY: number = 0;
	public reverse: boolean;
	public sx: number;
	public sy: number;

	constructor(
		path: string = '',
		{
			x = 0,
			y = 0,
			w = 0,
			h = 0,
			zoom = 1.0,
			opacity = 1.0,
			angle = 0.0,
			cover = false,
			stretch = false,
			sx = 0,
			sy = 0,
		} = {},
	) {
		super(x, y, w, h);

		this.zoom = zoom;
		this.opacity = opacity;
		this.angle = angle;
		this.cover = cover;
		this.stretch = stretch;
		this.sx = sx;
		this.sy = sy;
		if (path) {
			this.path = path;
			this.loaded = false;
			this.empty = false;
		} else {
			this.empty = true;
		}
	}

	/**
	 *  Create a picture and then load it
	 *  @static
	 *  @param {System.Picture} picture - The picture to load
	 */
	static async create(
		picture: Model.Picture,
		opts: {
			x?: number;
			y?: number;
			w?: number;
			h?: number;
			zoom?: number;
			opacity?: number;
			angle?: number;
			cover?: boolean;
			stretch?: boolean;
		} = {},
	) {
		const pic = picture ? new Picture2D(picture.getPath(), opts) : new Picture2D();
		await pic.load();
		return pic;
	}

	/*
	 *  Create a picture from kind and id and then load it
	 *  @static
	 *  @param {number} id - The picture id to load
	 *  @param {PICTURE_KIND} kind - The picture kind to load
	 *  @param {number} x - The x position
	 *  @param {number} y - The y position
	 *  @param {number} w - The w size
	 *  @param {number} h - The h size
	 */
	/**
	 * Create a picture from kind and id and then load it
	 *
	 * @static
	 * @param {number} id - The picture id to load
	 * @param {PICTURE_KIND} kind - The picture kind to load
	 * @param {pictureOptions} [opts={}]
	 * @return {*}
	 * @memberof Picture2D
	 */
	static async createWithID(id: number, kind: PICTURE_KIND, opts: pictureOptions = {}) {
		return await Picture2D.create(Data.Pictures.get(kind, id), opts);
	}

	/**
	 *  Load the image.
	 *  @static
	 *  @param {string} path - The image path
	 *  @returns {Promise<HTMLImageElement>}
	 */
	static async loadImage(path: string): Promise<HTMLImageElement> {
		return await new Promise((resolve, reject) => {
			const image: any = new Image();
			image.onload = () => {
				resolve(image);
			};
			image.onerror = () => {
				image.width = 0;
				image.height = 0;
				resolve(image);
			};
			image.src = path;
		});
	}

	/**
	 *  Load the picture and then check.
	 *  @async
	 */
	async load() {
		if (this.path) {
			// Try loading
			this.image = await Picture2D.loadImage(this.path);
			this.empty = this.image.width == 0;

			// If not empty, configure bitmap size
			if (!this.empty) {
				this.oW = this.image.width;
				this.oH = this.image.height;
				if (this.cover) {
					this.w = ScreenResolution.CANVAS_WIDTH;
					this.h = ScreenResolution.CANVAS_HEIGHT;
				} else if (this.stretch) {
					this.w = ScreenResolution.getScreenX(this.image.width);
					this.h = ScreenResolution.getScreenY(this.image.height);
				} else {
					this.w = ScreenResolution.getScreenMinXY(this.image.width);
					this.h = ScreenResolution.getScreenMinXY(this.image.height);
				}
				Stack.requestPaintHUD = true;
				this.loaded = true;
			}
		}
	}

	resize() {
		this.x = ScreenResolution.getScreenX(this.oX) + ScreenResolution.getScreenMinXY(this.minPositionOffsetX);
		this.y = ScreenResolution.getScreenY(this.oY) + ScreenResolution.getScreenMinXY(this.minPositionOffsetY);
		if (!this.empty && this.loaded) {
			if (this.cover) {
				this.w = ScreenResolution.CANVAS_WIDTH;
				this.h = ScreenResolution.CANVAS_HEIGHT;
			} else if (this.stretch) {
				this.w = ScreenResolution.CANVAS_WIDTH;
				this.h = ScreenResolution.CANVAS_HEIGHT;
			} else {
				this.w = ScreenResolution.getScreenMinXY(this.oW);
				this.h = ScreenResolution.getScreenMinXY(this.oH);
			}
		}
	}

	/**
	 *  Create a copy of a picture2D.
	 *  @returns {Picture2D}
	 */
	createCopy(): Picture2D {
		const picture = new Picture2D();
		picture.empty = this.empty;
		picture.path = this.path;
		picture.image = this.image;
		picture.loaded = true;
		picture.stretch = false;
		picture.setW(picture.image.width, true);
		picture.setH(picture.image.height, true);
		return picture;
	}

	/**
	 *  Draw the picture on HUD
	 *  @param {number} [x=undefined] - The x position
	 *  @param {number} [y=undefined] - The y position
	 *  @param {number} [w=undefined] - The w position
	 *  @param {number} [h=undefined] - The h position
	 *  @param {number} [sx=0] - The source x position
	 *  @param {number} [sy=0] - The source x position
	 *  @param {number} [sw=this.oW] - The source width size
	 *  @param {number} [sh=this.oH] - The source height size
	 *  @param {boolean} [positionResize=true] - Indicate if the position resize
	 *  (screen resolution)
	 */
	draw({
		x = null,
		y = null,
		w = null,
		h = null,
		sx = this.sx,
		sy = this.sy,
		sw = this.oW,
		sh = this.oH,
		positionResize = false,
		ctx = Platform.ctx,
	}: {
		x?: number;
		y?: number;
		w?: number;
		h?: number;
		sx?: number;
		sy?: number;
		sw?: number;
		sh?: number;
		positionResize?: boolean;
		ctx?: CanvasRenderingContext2D;
	} = {}) {
		if (!this.empty && this.loaded && sw > 0 && sh > 0) {
			// Default values
			x = x === null ? this.x : positionResize ? ScreenResolution.getScreenX(x) : x;
			y = y === null ? this.y : positionResize ? ScreenResolution.getScreenY(y) : y;
			w =
				w === null
					? this.w * this.zoom
					: this.stretch
						? ScreenResolution.getScreenX(w)
						: ScreenResolution.getScreenMinXY(w);
			h =
				h === null
					? this.h * this.zoom
					: this.stretch
						? ScreenResolution.getScreenY(h)
						: ScreenResolution.getScreenMinXY(h);

			// Round to integer pixels to prevent sub-pixel bleeding artifacts
			x = Math.round(x);
			y = Math.round(y);
			w = Math.round(w);
			h = Math.round(h);
			sx = Math.round(sx);
			sy = Math.round(sy);
			sw = Math.round(sw);
			sh = Math.round(sh);

			// Draw the image according to all parameters
			const angle = (this.angle * Math.PI) / 180;
			ctx.save();
			ctx.globalAlpha = this.opacity;
			if (!this.centered) {
				if (this.reverse) {
					ctx.scale(-1, 1);
					ctx.translate(-x - w, y);
				} else {
					ctx.translate(x, y);
				}
			}
			if (angle !== 0) {
				if (this.centered) {
					ctx.translate(x, y);
				}
				ctx.rotate(angle);
				if (this.centered) {
					ctx.translate(-x, -y);
				}
			}
			if (this.centered) {
				if (this.reverse) {
					ctx.scale(-1, 1);
					ctx.translate(-x - w / 2, y - h / 2);
				} else {
					ctx.translate(x - w / 2, y - h / 2);
				}
			}
			ctx.drawImage(this.image, sx, sy, sw, sh, 0, 0, w, h);
			ctx.globalAlpha = 1.0;
			ctx.restore();
		}
	}
}
interface pictureOptions {
	x?: number;
	y?: number;
	w?: number;
	h?: number;
	zoom?: number;
	opacity?: number;
	angle?: number;
	cover?: boolean;
	stretch?: boolean;
}

export { Picture2D };
