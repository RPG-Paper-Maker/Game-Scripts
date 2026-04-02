/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ALIGN, ALIGN_VERTICAL, Constants, Platform, ScreenResolution, Utils } from '../Common';
import { Data, Model } from '../index';
import { Stack } from '../Manager';
import { Base } from './Base';

/** @class
 *  A class for all the texts to display in HUD.
 *  @extends Bitmap
 *  @param {string} [text=""] - The brut text to display
 *  @param {Object} [opts={}] - Options
 *  @param {number} [opts.x=0] - The x coords of the text
 *  @param {number} [opts.y=0] - The y coords of the text
 *  @param {number} [opts.w=0] - The w coords of the text
 *  @param {number} [opts.h=0] - The h coords of the text
 *  @param {Align} [opts.align=ALIGN.LEFT] - Alignement of the text
 *  @param {number} [opts.fontSize=RPM.defaultValue(RPM.datasGame.System.dbOptions.vtSize, - RPM.fontSize)]
 *  The font height used for the text
 *  @param {string} [opts.fontName=RPM.defaultValue(RPM.datasGame.System.dbOptions.vtFont, - RPM.fontName)]
 *  The font name used for the text
 *  @param {ALIGN_VERTICAL} [opts.verticalAlign=ALIGN_VERTICAL.Center] - Vertical
 *  alignement of the text
 *  @param {SystemColor} [opts.color=RPM.defaultValue(RPM.datasGame.System.dbOptions.vtcText]
 *  The color used for the text
 *  @param {boolean} [opts.bold=false] - If checked, make the text bold
 *  @param {boolean} [opts.italic=false] - If checked, make the text italic
 *  @param {SystemColor} [opts.backColor=RPM.defaultValue(RPM.datasGame.System.dbOptions.vtcBackground, - null)]
 *  The background color behind the text
 *  @param {SystemColor} [opts.strokeColor=RPM.defaultValue(RPM.datasGame.System.dbOptions.tOutline, - false)? RPM.defaultValue(RPM.datasGame.System.dbOptions.vtcOutline, null) : null]
 *  The stroke color of the text
 */
class Text extends Base {
	public text: string;
	public lines: string[];
	public align: ALIGN;
	public fontSize: number;
	public oFontSize: number;
	public fontName: string;
	public verticalAlign: ALIGN_VERTICAL;
	public color: Model.Color;
	public bold: boolean;
	public italic: boolean;
	public backColor: Model.Color;
	public strokeColor: Model.Color;
	public font: string;
	public textWidth: number;
	public textHeight: number;
	public lastW: number = 0;
	public lastWFull: number = 0;
	public lastLineWidth: number = 0;
	public zoom: number = 1;
	public ellipsis: boolean = false;

	constructor(
		text = '',
		{
			x = 0,
			y = 0,
			w = 0,
			h = 0,
			align = ALIGN.LEFT,
			fontSize = Utils.valueOrDefault(Data.Systems.dbOptions.v_tSize, Constants.DEFAULT_FONT_SIZE),
			fontName = Utils.valueOrDefault(Data.Systems.dbOptions.v_tFont, Constants.DEFAULT_FONT_NAME),
			verticalAlign = ALIGN_VERTICAL.CENTER,
			color = Utils.valueOrDefault(Data.Systems.dbOptions.v_tcText, Model.Color.WHITE),
			bold = false,
			italic = false,
			backColor = Utils.valueOrDefault(Data.Systems.dbOptions.v_tcBackground, null),
			strokeColor = Utils.valueOrDefault(Data.Systems.dbOptions.tOutline, false)
				? Utils.valueOrDefault(Data.Systems.dbOptions.v_tcOutline, null)
				: null,
		} = {},
	) {
		super(x, y, w, h);

		this.align = align;
		this.fontName = fontName;
		this.verticalAlign = verticalAlign;
		this.color = color;
		this.bold = bold;
		this.italic = italic;
		this.backColor = backColor;
		this.strokeColor = strokeColor;
		this.setFontSize(fontSize);
		this.setText(Utils.valueOrDefault(text, ''));
	}

	wrapText(maxWidth: number, firstLineMaxWidth: number = maxWidth) {
		const text = this.text.replace('\\n', '\n');
		const lines = text.split('\n');
		const words: string[] = [];
		let i: number, j: number, l: number, m: number, tempWords: string[];
		for (i = 0, l = lines.length; i < l; i++) {
			tempWords = lines[i].split(' ');
			for (j = 0, m = tempWords.length; j < m; j++) {
				words.push(tempWords[j]);
			}
			if (i < l - 1) {
				words.push('\n');
			}
		}
		this.lines = [];
		let currentLine = words[0];
		let isFirstLine = true;
		for (let i = 1, l = words.length; i < l; i++) {
			const word = words[i];
			if (word === '\n') {
				this.lines.push(currentLine);
				currentLine = words[++i];
				isFirstLine = false;
				continue;
			}
			const limit = isFirstLine ? firstLineMaxWidth : maxWidth;
			const width =
				Platform.ctx.measureText(currentLine + ' ' + word).width + (this.strokeColor === null ? 0 : 2);
			if (width < limit) {
				currentLine += ' ' + word;
			} else {
				this.lines.push(currentLine);
				currentLine = word;
				isFirstLine = false;
			}
		}
		this.lines.push(currentLine);
		this.measureText();
	}

	/**
	 *  Set the font size and the final font.
	 *  @param {number} fontSize - The new font size
	 */
	setFontSize(fontSize: number) {
		this.oFontSize = fontSize;
		this.fontSize = ScreenResolution.getScreenMinXY(fontSize);
		this.updateFont();
	}

	/**
	 *  Set the final font.
	 */
	updateFont() {
		this.font = Utils.createFont(this.fontSize, this.fontName, this.bold, this.italic);
	}

	/**
	 *  Set the current displayed text.
	 *  @param {string} text - The new text
	 */
	setText(text: string) {
		text += ''; // Be sure that it's string type
		if (this.text !== text) {
			this.text = text;
			this.lines = this.text.split('\n');
			this.measureText();
			Stack.requestPaintHUD = true;
		}
	}

	/**
	 *  Update the context font with resizing.
	 */
	updateContextFont() {
		Platform.ctx.font = this.font;
	}

	/**
	 *  Measure text width and stock results in the instance.
	 */
	measureText() {
		this.updateContextFont();
		this.textWidth = 0;
		const l = this.lines.length;
		let size: number;
		for (let i = 0; i < l; i++) {
			size =
				Platform.ctx.measureText(this.lines[i]).width +
				(this.strokeColor === null ? 0 : ScreenResolution.getScreenMinXY(2));
			if (size > this.textWidth) {
				this.textWidth = size;
			}
		}
		this.lastLineWidth = l > 0
			? Platform.ctx.measureText(this.lines[l - 1]).width +
			  (this.strokeColor === null ? 0 : ScreenResolution.getScreenMinXY(2))
			: 0;
		this.textHeight = this.fontSize * 2 * l;
	}

	/**
	 *  Get the text truncated to fit within maxWidth, appending ellipsis if needed.
	 *  @param {string} text - The text to truncate
	 *  @param {number} maxWidth - The maximum pixel width
	 *  @returns {string}
	 */
	getEllipsisText(text: string, maxWidth: number): string {
		if (Platform.ctx.measureText(text).width <= maxWidth) {
			return text;
		}
		const ellipsis = '...';
		const ellipsisWidth = Platform.ctx.measureText(ellipsis).width;
		let truncated = text;
		while (truncated.length > 0 && Platform.ctx.measureText(truncated).width + ellipsisWidth > maxWidth) {
			truncated = truncated.slice(0, -1);
		}
		return truncated + ellipsis;
	}

	/**
	 *  Drawing the text in choice box.
	 *  @param {number} [x=this.x] - The x position to draw graphic
	 *  @param {number} [y=this.y] - The y position to draw graphic
	 *  @param {number} [w=this.w] - The width dimention to draw graphic
	 *  @param {number} [h=this.h] - The height dimention to draw graphic
	 */
	drawChoice(x: number = this.x, y: number = this.y, w: number = this.w, h: number = this.h, continuationX?: number, wFull?: number): void {
		// Correcting x and y according to alignment
		let xBack = x;
		if (this.zoom !== 1) {
			this.fontSize *= this.zoom;
			this.updateFont();
			this.measureText();
		}
		const effectiveWFull = wFull ?? w;
		if (this.ellipsis && w !== 0) {
			this.updateContextFont();
			// Ellipsis mode: single line truncated with "..."
			const rawText = this.text.replace('\\n', '\n').split('\n')[0];
			const ellipsized = this.getEllipsisText(rawText, w);
			this.lines = [ellipsized];
			this.textWidth = Platform.ctx.measureText(ellipsized).width
				+ (this.strokeColor === null ? 0 : ScreenResolution.getScreenMinXY(2));
			this.lastLineWidth = this.textWidth;
			this.textHeight = this.fontSize * 2;
		} else if (!this.ellipsis && w !== 0) {
			this.updateContextFont();
			if (this.lastW !== w || this.lastWFull !== effectiveWFull) {
				// Wrap text
				this.lastW = w;
				this.lastWFull = effectiveWFull;
				this.wrapText(effectiveWFull, w);
			}
		}
		const textWidth = this.textWidth;
		const textHeight = this.fontSize + ScreenResolution.getScreenMinXY(this.strokeColor === null ? 0 : 2);
		switch (this.align) {
			case ALIGN.LEFT:
				x += ScreenResolution.getScreenMinXY(1);
				if (continuationX !== undefined) {
					continuationX += ScreenResolution.getScreenMinXY(1);
				}
				break;
			case ALIGN.RIGHT:
				x += w - ScreenResolution.getScreenMinXY(1);
				xBack = x - textWidth;
				if (continuationX !== undefined) {
					continuationX += effectiveWFull - ScreenResolution.getScreenMinXY(1);
				}
				break;
			case ALIGN.CENTER:
				x += w / 2;
				xBack = x - textWidth / 2;
				if (continuationX !== undefined) {
					continuationX += effectiveWFull / 2;
				}
				break;
		}
		switch (this.verticalAlign) {
			case ALIGN_VERTICAL.BOT:
				y += this.fontSize / 3 + h;
				break;
			case ALIGN_VERTICAL.TOP:
				y += this.fontSize;
				break;
			case ALIGN_VERTICAL.CENTER:
				y += this.fontSize / 3 + h / 2;
				break;
		}

		// Draw background color
		if (this.backColor !== null) {
			Platform.ctx.fillStyle = this.backColor.rgb;
			Platform.ctx.fillRect(xBack, y - textHeight, textWidth, textHeight);
		}

		// Set context options
		Platform.ctx.font = this.font;
		Platform.ctx.textAlign = <CanvasTextAlign>this.align;
		const lineHeight = this.fontSize * 2;
		let i: number,
			l = this.lines.length;

		// Stroke text
		let yOffset: number;
		if (this.strokeColor !== null) {
			Platform.ctx.strokeStyle = this.strokeColor.rgb;
			yOffset = 0;
			for (i = 0; i < l; i++) {
				const cx = i === 0 || continuationX === undefined ? x : continuationX;
				Platform.ctx.strokeText(this.lines[i], cx - 1, y - 1 + yOffset);
				Platform.ctx.strokeText(this.lines[i], cx - 1, y + 1 + yOffset);
				Platform.ctx.strokeText(this.lines[i], cx + 1, y - 1 + yOffset);
				Platform.ctx.strokeText(this.lines[i], cx + 1, y + 1 + yOffset);
				yOffset += lineHeight;
			}
		}

		// Drawing the text
		Platform.ctx.fillStyle = this.color.rgb;
		yOffset = 0;
		for (i = 0; i < l; i++) {
			const cx = i === 0 || continuationX === undefined ? x : continuationX;
			Platform.ctx.fillText(this.lines[i], cx, y + yOffset);
			yOffset += lineHeight;
		}

		// Fix font back
		if (this.zoom !== 1) {
			this.setFontSize(this.oFontSize);
			this.measureText();
		}
	}

	/**
	 *  Drawing the text in box (duplicate of drawChoice).
	 *  @param {number} [x=this.oX] - The x position to draw graphic
	 *  @param {number} [y=this.oY] - The y position to draw graphic
	 *  @param {number} [w=this.oW] - The width dimention to draw graphic
	 *  @param {number} [h=this.oH] - The height dimention to draw graphic
	 */
	draw(x: number = this.x, y: number = this.y, w: number = this.w, h: number = this.h, continuationX?: number, wFull?: number) {
		this.drawChoice(x, y, w, h, continuationX, wFull);
	}
}

export { Text };
