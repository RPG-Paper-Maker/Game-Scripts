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
		this.graphicValue.setFontSize(fontSize);
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
			const barW_design = w > 0 ? w / minXY : naturalW;
			barW_screen = Math.ceil(barW_design * minXY);
			const scale = barW_design / naturalW;
			this.pictureBar.picture.draw({
				x: x,
				y: y,
				sw: naturalW,
				w: barW_design,
			});
			const percent = this.player[this.statistic.abbreviation] / this.player[this.statistic.getMaxAbbreviation()];
			const borderLeft = this.pictureBar.borderLeft;
			const innerW = naturalW - borderLeft - this.pictureBar.borderRight;
			const fillSW = Math.ceil(innerW * percent);
			this.pictureBar.picture.draw({
				x: x + ScreenResolution.getScreenX(borderLeft) * scale,
				y: y,
				sx: naturalW + borderLeft,
				sw: fillSW,
				w: Math.ceil(fillSW * scale),
			});
			height = this.pictureBar.picture.h;
			offset = ScreenResolution.getScreenY(-5);
		}
		y = Math.round(y + height / 2 + offset);
		this.graphicName.draw(x, y, 0, 0);
		if (barW_screen > 0) {
			this.graphicValue.draw(x + barW_screen, y, 0, 0);
		} else {
			this.graphicValue.draw(x + this.maxStatNamesLength + ScreenResolution.getScreenX(10), y, 0, 0);
		}
	}
}

export { Statistic };
