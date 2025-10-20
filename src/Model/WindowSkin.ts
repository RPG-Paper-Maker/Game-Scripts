/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { PICTURE_KIND, ScreenResolution } from '../Common';
import { Picture2D, Rectangle } from '../Core';
import { Data } from '../index';
import { Base } from './Base';

/**
 * JSON structure for a window skin.
 */
export type WindowSkinJSON = {
	pid: number;
	tl: number[];
	tr: number[];
	bl: number[];
	br: number[];
	l: number[];
	r: number[];
	t: number[];
	b: number[];
	back: number[];
	backs: number[];
	backr: boolean;
	aem: number[];
	ats: number[];
	aud: number[];
	tn: number[];
	tc: number[];
	th: number[];
	tm: number[];
};

/**
 * A window skin in the game.
 */
export class WindowSkin extends Base {
	public pictureID: number;
	public borderTopLeft: Rectangle;
	public borderTopRight: Rectangle;
	public borderBotLeft: Rectangle;
	public borderBotRight: Rectangle;
	public borderLeft: Rectangle;
	public borderRight: Rectangle;
	public borderTop: Rectangle;
	public borderBot: Rectangle;
	public background: Rectangle;
	public backgroundSelection: Rectangle;
	public backgroundRepeat: boolean;
	public arrowEndMessage: Rectangle;
	public arrowTargetSelection: Rectangle;
	public arrowUpDown: Rectangle;
	public textNormal: Rectangle;
	public textCritical: Rectangle;
	public textHeal: Rectangle;
	public textMiss: Rectangle;
	public picture: Picture2D;

	constructor(json?: WindowSkinJSON) {
		super(json);
	}

	/**
	 * Update the window skin picture.
	 */
	async updatePicture(): Promise<void> {
		this.picture = await Picture2D.create(Data.Pictures.get(PICTURE_KIND.WINDOW_SKINS, this.pictureID), {
			stretch: true,
		});
	}

	/**
	 * Draw any element of the window skin box.
	 */
	drawElement(
		r: Rectangle,
		x: number,
		y: number,
		w = r.width,
		h = r.height,
		zoom = 1.0,
		positionResize = true
	): void {
		this.picture.draw({
			x,
			y,
			w: w * zoom,
			h: h * zoom,
			sx: r.x,
			sy: r.y,
			sw: r.width,
			sh: r.height,
			positionResize: positionResize,
		});
	}

	/**
	 * Draw the background box.
	 */
	drawBoxBackground(background: Rectangle, rect: Rectangle): void {
		if (this.backgroundRepeat) {
			for (
				let x = rect.x + this.borderTopLeft.width, l = rect.x + rect.width - this.borderTopRight.width - 1;
				x < l;
				x += background.width
			) {
				for (
					let y = rect.y + this.borderTopLeft.height,
						m = rect.y + rect.height - this.borderBotLeft.height - 1;
					y < m;
					y += background.height
				) {
					const w = x + background.width < l ? background.width : l - x + 1;
					const h = y + background.height < m ? background.height : m - y + 1;
					this.drawElement(background, x, y, w, h);
				}
			}
		} else {
			this.drawElement(
				background,
				rect.x + this.borderTopLeft.width,
				rect.y + this.borderTopLeft.height,
				rect.width - this.borderTopLeft.width - this.borderBotRight.width,
				rect.height - this.borderTopLeft.height - this.borderBotRight.height
			);
		}
	}

	/**
	 * Draw the full box including borders and background.
	 */
	drawBox(rect: Rectangle, selected: boolean, bordersVisible: boolean): void {
		if (bordersVisible) {
			// Corners
			this.drawElement(this.borderTopLeft, rect.x, rect.y);
			this.drawElement(this.borderTopRight, rect.x + rect.width - this.borderTopRight.width, rect.y);
			this.drawElement(this.borderBotLeft, rect.x, rect.y + rect.height - this.borderBotLeft.height);
			this.drawElement(
				this.borderBotRight,
				rect.x + rect.width - this.borderBotRight.width,
				rect.y + rect.height - this.borderBotRight.height
			);

			// Borders
			let x = rect.x;
			for (
				let y = rect.y + this.borderTopLeft.height, l = rect.y + rect.height - this.borderBotLeft.height - 1;
				y < l;
				y += this.borderLeft.height
			) {
				if (y + this.borderLeft.height < l) {
					this.drawElement(this.borderLeft, x, y);
				} else {
					this.drawElement(this.borderLeft, x, y, this.borderLeft.width, l - y + 1);
				}
			}
			x = rect.x + rect.width - this.borderTopRight.width;
			for (
				let y = rect.y + this.borderTopLeft.height, l = rect.y + rect.height - this.borderBotLeft.height - 1;
				y < l;
				y += this.borderRight.height
			) {
				if (y + this.borderRight.height < l) {
					this.drawElement(this.borderRight, x, y);
				} else {
					this.drawElement(this.borderRight, x, y, this.borderRight.width, l - y + 1);
				}
			}
			let y = rect.y;
			for (
				let x = rect.x + this.borderTopLeft.width, l = rect.x + rect.width - this.borderTopRight.width - 1;
				x < l;
				x += this.borderTop.width
			) {
				if (x + this.borderTop.width < l) {
					this.drawElement(this.borderTop, x, y);
				} else {
					this.drawElement(this.borderTop, x, y, l - x + 1, this.borderTop.height);
				}
			}
			y = rect.y + rect.height - this.borderBotLeft.height;
			for (
				let x = rect.x + this.borderBotLeft.width, l = rect.x + rect.width - this.borderBotRight.width - 1;
				x < l;
				x += this.borderBot.width
			) {
				if (x + this.borderBot.width < l) {
					this.drawElement(this.borderBot, x, y);
				} else {
					this.drawElement(this.borderBot, x, y, l - x + 1, this.borderBot.height);
				}
			}
		}

		// Background
		this.drawBoxBackground(this.background, rect);
		if (selected) {
			this.drawBoxBackground(this.backgroundSelection, rect);
		}
	}

	/**
	 *  Draw the arrow for targets.
	 */
	drawArrowTarget(frame: number, x: number, y: number, positionResize: boolean = false): void {
		const width = this.arrowTargetSelection.width / Data.Systems.FRAMES;
		this.picture.draw({
			x: x - width / 2,
			y,
			w: width,
			h: this.arrowTargetSelection.height,
			sx: this.arrowTargetSelection.x + frame * width,
			sy: this.arrowTargetSelection.y,
			sw: width,
			sh: this.arrowTargetSelection.height,
			positionResize,
		});
	}

	/**
	 *  Draw the arrow for end of messages.
	 */
	drawArrowMessage(frame: number, x: number, y: number): void {
		const width = this.arrowEndMessage.width / Data.Systems.FRAMES;
		this.picture.draw({
			x: x - width / 2,
			y,
			w: width,
			h: this.arrowEndMessage.height,
			sx: this.arrowEndMessage.x + frame * width,
			sy: this.arrowEndMessage.y,
			sw: width,
			sh: this.arrowEndMessage.height,
			positionResize: true,
		});
	}

	/**
	 *  Draw the arrow up for spinbox.
	 */
	drawArrowUp(x: number, y: number): void {
		this.picture.draw({
			x,
			y,
			w: this.arrowUpDown.width,
			h: this.arrowUpDown.height / 2,
			sx: this.arrowUpDown.x,
			sy: this.arrowUpDown.y,
			sw: this.arrowUpDown.width,
			sh: this.arrowUpDown.height / 2,
			positionResize: true,
		});
	}

	/**
	 *  Draw the arrow up for spinbox.
	 */
	drawArrowDown(x: number, y: number): void {
		this.picture.draw({
			x,
			y,
			w: this.arrowUpDown.width,
			h: this.arrowUpDown.height / 2,
			sx: this.arrowUpDown.x,
			sy: this.arrowUpDown.y + this.arrowUpDown.height / 2,
			sw: this.arrowUpDown.width,
			sh: this.arrowUpDown.height / 2,
			positionResize: true,
		});
	}

	/**
	 *  Draw a damage number.
	 */
	drawDamagesNumber(damage: number, x: number, y: number, rect: Rectangle, zoom: number): [number, number] {
		const digits = String(damage).split('').map(Number);
		const width = rect.width / 10;
		const height = rect.height;
		this.picture.stretch = false;
		for (let i = 0, l = digits.length; i < l; i++) {
			this.picture.draw({
				x: x + (i - (l - 1) / 2) * (ScreenResolution.getScreenMinXY(width) * zoom),
				y,
				w: width * zoom,
				h: height * zoom,
				sx: rect.x + digits[i] * width,
				sy: rect.y,
				sw: width,
				sh: height,
				positionResize: false,
			});
		}
		this.picture.stretch = true;
		return [
			x + (digits.length - (digits.length - 1) / 2) * (ScreenResolution.getScreenMinXY(width) * zoom),
			height * zoom,
		];
	}

	/**
	 * Draw damage numbers according to type.
	 */
	drawDamages(
		damage: number,
		x: number,
		y: number,
		isCrit: boolean,
		isMiss: boolean,
		zoom: number
	): [number, number] {
		if (isMiss) {
			this.drawElement(
				this.textMiss,
				x - ScreenResolution.getScreenX(this.textMiss.width / 2),
				y,
				this.textMiss.width,
				this.textMiss.height,
				zoom,
				false
			);
			return [0, 0];
		} else if (damage < 0) {
			return this.drawDamagesNumber(damage, x, y, this.textHeal, zoom);
		} else if (isCrit) {
			return this.drawDamagesNumber(damage, x, y, this.textCritical, zoom);
		} else {
			return this.drawDamagesNumber(damage, x, y, this.textNormal, zoom);
		}
	}

	/**
	 *  Read the JSON associated to the window skin.
	 */
	read(json: WindowSkinJSON) {
		this.pictureID = json.pid;
		this.borderTopLeft = Rectangle.createFromArray(json.tl);
		this.borderTopRight = Rectangle.createFromArray(json.tr);
		this.borderBotLeft = Rectangle.createFromArray(json.bl);
		this.borderBotRight = Rectangle.createFromArray(json.br);
		this.borderLeft = Rectangle.createFromArray(json.l);
		this.borderRight = Rectangle.createFromArray(json.r);
		this.borderTop = Rectangle.createFromArray(json.t);
		this.borderBot = Rectangle.createFromArray(json.b);
		this.background = Rectangle.createFromArray(json.back);
		this.backgroundSelection = Rectangle.createFromArray(json.backs);
		this.backgroundRepeat = json.backr;
		this.arrowEndMessage = Rectangle.createFromArray(json.aem);
		this.arrowTargetSelection = Rectangle.createFromArray(json.ats);
		this.arrowUpDown = Rectangle.createFromArray(json.aud);
		this.textNormal = Rectangle.createFromArray(json.tn);
		this.textCritical = Rectangle.createFromArray(json.tc);
		this.textHeal = Rectangle.createFromArray(json.th);
		this.textMiss = Rectangle.createFromArray(json.tm);
	}
}
