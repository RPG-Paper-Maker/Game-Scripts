/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ALIGN, PICTURE_KIND, ScreenResolution } from '../Common';
import { Core, Data, Graphic, Model } from '../index';
import { Base } from './Base';

/** @class
 *  The graphic displaying the player minimal stats informations.
 *  @extends Graphic.Base
 *  @param {Player} player - The current selected player
 *  @param {boolean} [reverse=false] - Indicate if the faceset should be reversed
 */
class Statistic extends Base {
	public player: Core.Player;
	public statistic: Model.Statistic;
	public graphicName: Graphic.Text;
	public graphicValue: Graphic.Text;
	public pictureBar: Model.Picture;
	public maxStatNamesLength: number;

	constructor(player: Core.Player, statistic: Model.Statistic, offsetStat?: number) {
		super();
		this.player = player;
		this.statistic = statistic;
		this.graphicName = new Graphic.Text(statistic.name());
		this.maxStatNamesLength = 0;
		if (offsetStat === undefined) {
			this.graphicName.measureText();
			if (this.graphicName.textWidth > this.maxStatNamesLength) {
				this.maxStatNamesLength = this.graphicName.textWidth;
			}
		} else {
			this.maxStatNamesLength = offsetStat;
		}
		let txt = String(this.player[statistic.abbreviation]);
		if (!statistic.isFix) {
			txt += '/' + this.player[statistic.getMaxAbbreviation()];
			this.pictureBar = Data.Pictures.get(PICTURE_KIND.BARS, this.statistic.pictureBarID);
		}
		this.graphicValue = new Graphic.Text(txt, { align: ALIGN.RIGHT });
	}

	/**
	 *  Set the font size and the final font.
	 *  @param {number} fontSize - The new font size
	 */
	setFontSize(fontSize: number) {
		this.graphicName.setFontSize(fontSize);
		this.graphicName.measureText();
		this.graphicValue.setFontSize(fontSize);
		this.graphicValue.measureText();
	}

	/**
	 *  Update the graphics
	 */
	update() {
		let txt = String(this.player[this.statistic.abbreviation]);
		if (!this.statistic.isFix) {
			txt += '/' + this.player[this.statistic.getMaxAbbreviation()];
		}
		this.graphicValue.setText(txt);
	}

	/**
	 *  Drawing statistic bar.
	 *  @param {number} x - The x position to draw graphic
	 *  @param {number} y - The y position to draw graphic
	 *  @param {number} w - The width dimention to draw graphic
	 *  @param {number} h - The height dimention to draw graphic
	 */
	drawChoice(x: number, y: number, w: number, h: number) {
		this.draw(x, y, w, h);
	}

	/**
	 *  Drawing statistic bar.
	 *  @param {number} x - The x position to draw graphic
	 *  @param {number} y - The y position to draw graphic
	 *  @param {number} w - The width dimention to draw graphic
	 *  @param {number} h - The height dimention to draw graphic
	 */
	draw(x: number, y: number, w: number, h: number) {
		let height = 0;
		let offset = 0;
		let barW_screen = 0;
		if (this.pictureBar && this.pictureBar.picture) {
			const naturalW = this.pictureBar.picture.oW / 2;
			const minXY = Math.min(ScreenResolution.WINDOW_X, ScreenResolution.WINDOW_Y);
			barW_screen = w > 0 ? Math.round(w) : Math.round(naturalW * minXY);
			const cap = Math.floor(naturalW / 3);
			const borderLeft = this.pictureBar.borderLeft;
			const borderRight = this.pictureBar.borderRight;
			this.drawBarSlices(0, naturalW, cap, cap, x, y, barW_screen);
			const percent = this.player[this.statistic.abbreviation] / this.player[this.statistic.getMaxAbbreviation()];
			const xFill = Math.round(borderLeft * minXY);
			const fillW = barW_screen - xFill - Math.round(borderRight * minXY);
			this.drawBarSlices(
				naturalW + borderLeft,
				naturalW - borderLeft - borderRight,
				Math.max(cap - borderLeft, 0),
				Math.max(cap - borderRight, 0),
				x + xFill,
				y,
				fillW,
				Math.round(fillW * percent),
			);
			height = this.pictureBar.picture.h;
			offset = ScreenResolution.getScreenY(-5);
		}
		y = Math.round(y + height / 2 + offset);
		this.graphicName.draw(x, y, 0, 0);
		if (barW_screen > 0) {
			const rightEdge = x + Math.max(barW_screen, this.graphicName.textWidth + this.graphicValue.textWidth + ScreenResolution.getScreenX(5));
			this.graphicValue.draw(rightEdge, y, 0, 0);
		} else {
			this.graphicValue.draw(x + this.maxStatNamesLength + ScreenResolution.getScreenX(10), y, 0, 0);
		}
	}

	/**
	 *  Draw a horizontal part of the bar texture cut in 3 slices: left and
	 *  right caps are drawn once, the middle slice is repeated to fill width.
	 *  @param {number} sx - The source x position
	 *  @param {number} sw - The source width
	 *  @param {number} capL - The source left cap width
	 *  @param {number} capR - The source right cap width
	 *  @param {number} x - The screen x position
	 *  @param {number} y - The screen y position
	 *  @param {number} w - The screen width
	 *  @param {number} [clipW=w] - The screen width to clip drawing to
	 */
	drawBarSlices(
		sx: number,
		sw: number,
		capL: number,
		capR: number,
		x: number,
		y: number,
		w: number,
		clipW: number = w,
	) {
		if (w <= 0 || clipW <= 0) {
			return;
		}
		const picture = this.pictureBar.picture;
		const minXY = Math.min(ScreenResolution.WINDOW_X, ScreenResolution.WINDOW_Y);
		let wL = Math.round(capL * minXY);
		let wR = Math.round(capR * minXY);
		if (wL + wR > w) {
			wL = Math.round((w * capL) / (capL + capR));
			wR = w - wL;
		}
		const drawPart = (srcX: number, dstX: number, dstW: number) => {
			dstW = Math.min(dstW, clipW - dstX);
			if (dstW > 0) {
				picture.draw({ x: x + dstX, y: y, sx: srcX, sw: dstW / minXY, w: dstW / minXY });
			}
		};
		drawPart(sx, 0, wL);
		const tileW = Math.round((sw - capL - capR) * minXY);
		if (tileW > 0) {
			for (let dx = wL; dx < w - wR; dx += tileW) {
				drawPart(sx + capL, dx, Math.min(tileW, w - wR - dx));
			}
		}
		drawPart(sx + sw - wR / minXY, w - wR, wR);
	}
}

export { Statistic };
