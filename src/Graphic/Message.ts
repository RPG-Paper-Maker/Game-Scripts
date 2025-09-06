/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ALIGN, Constants, PICTURE_KIND, ScreenResolution, TAG_KIND, Utils } from '../Common';
import { Bitmap, Game, Node, Picture2D, Tree } from '../Core';
import { Datas, Graphic, Model } from '../index';

/** @class
 *  A class for message show text command.
 *  @extends Graphic.Base
 *  @param {string} message - The complete text to parse
 *  @param {number} facesetID - The faceset picture ID
 */
class Message extends Graphic.Base {
	public static readonly TAG_BOLD = 'b';
	public static readonly TAG_ITALIC = 'i';
	public static readonly TAG_LEFT = 'l';
	public static readonly TAG_CENTER = 'c';
	public static readonly TAG_RIGHT = 'r';
	public static readonly TAG_SIZE = 'size';
	public static readonly TAG_FONT = 'font';
	public static readonly TAG_TEXT_COLOR = 'textcolor';
	public static readonly TAG_BACK_COLOR = 'backcolor';
	public static readonly TAG_STROKE_COLOR = 'strokecolor';
	public static readonly TAG_VARIABLE = 'var';
	public static readonly TAG_PARAMETER = 'par';
	public static readonly TAG_PROPERTY = 'pro';
	public static readonly TAG_HERO_NAME = 'hname';
	public static readonly TAG_ICON = 'ico';

	public message: string;
	public faceset: Picture2D;
	public facesetIndexX: number;
	public facesetIndexY: number;
	public graphics: Bitmap[];
	public positions: number[];
	public tree: Tree;
	public heights: number[];
	public aligns: ALIGN[];
	public totalWidths: number[];

	constructor(message: string, facesetID: number, facesetIndexX: number, facesetIndexY: number) {
		super();

		this.message = message;
		this.faceset = Datas.Pictures.getPictureCopy(PICTURE_KIND.FACESETS, facesetID);
		this.facesetIndexX = facesetIndexX;
		this.facesetIndexY = facesetIndexY;
		this.graphics = [];
		this.positions = [];
		this.setMessage(this.message);
	}

	/**
	 *  Set message (parse).
	 *  @param {string} message - The message to parse
	 */
	setMessage(message: string) {
		this.tree = new Tree(null);
		const root = this.tree.root;
		let currentNode = root;
		let lastC = 0;
		const notClosed = [];
		let c: number,
			l: number,
			ch: string,
			open: boolean,
			cr: number,
			tag: string,
			tagKind: TAG_KIND,
			split: string[];
		for (c = 0, l = message.length; c < l; c++) {
			ch = message.charAt(c);
			if (ch === '\n') {
				// If text before..
				if (c > lastC) {
					currentNode = this.updateTag(
						currentNode,
						TAG_KIND.TEXT,
						message.substring(lastC, c),
						true,
						notClosed
					);
				}
				lastC = c + 1;
				currentNode = this.updateTag(currentNode, TAG_KIND.NEW_LINE, null, true, notClosed);
			} else if (ch === '[') {
				open = message.charAt(c + 1) !== '/';

				// If text before..
				if (c > lastC) {
					currentNode = this.updateTag(
						currentNode,
						TAG_KIND.TEXT,
						message.substring(lastC, c),
						true,
						notClosed
					);
				}
				cr = c;
				do {
					cr++;
					ch = message.charAt(cr);
				} while (cr < l && ch !== ']');
				tag = message.substring(c + (open ? 1 : 2), cr);
				if (tag === Message.TAG_BOLD) {
					tagKind = TAG_KIND.BOLD;
				} else if (tag === Message.TAG_ITALIC) {
					tagKind = TAG_KIND.ITALIC;
				} else if (tag === Message.TAG_LEFT) {
					tagKind = TAG_KIND.LEFT;
				} else if (tag === Message.TAG_CENTER) {
					tagKind = TAG_KIND.CENTER;
				} else if (tag === Message.TAG_RIGHT) {
					tagKind = TAG_KIND.RIGHT;
				} else if (tag.includes(Message.TAG_SIZE)) {
					tagKind = TAG_KIND.SIZE;
				} else if (tag.includes(Message.TAG_FONT)) {
					tagKind = TAG_KIND.FONT;
				} else if (tag.includes(Message.TAG_TEXT_COLOR)) {
					tagKind = TAG_KIND.TEXT_COLOR;
				} else if (tag.includes(Message.TAG_BACK_COLOR)) {
					tagKind = TAG_KIND.BACK_COLOR;
				} else if (tag.includes(Message.TAG_STROKE_COLOR)) {
					tagKind = TAG_KIND.STROKE_COLOR;
				} else if (tag.includes(Message.TAG_VARIABLE)) {
					tagKind = TAG_KIND.VARIABLE;
				} else if (tag.includes(Message.TAG_PARAMETER)) {
					tagKind = TAG_KIND.PARAMETER;
				} else if (tag.includes(Message.TAG_PROPERTY)) {
					tagKind = TAG_KIND.PROPERTY;
				} else if (tag.includes(Message.TAG_HERO_NAME)) {
					tagKind = TAG_KIND.HERO_NAME;
				} else if (tag.includes(Message.TAG_ICON)) {
					tagKind = TAG_KIND.ICON;
				} else {
					tagKind = TAG_KIND.TEXT;
				}
				if (tagKind === TAG_KIND.TEXT) {
					currentNode = this.updateTag(
						currentNode,
						TAG_KIND.TEXT,
						message.substring(c, cr + 1),
						true,
						notClosed
					);
				} else {
					split = tag.split('=');
					currentNode = this.updateTag(
						currentNode,
						tagKind,
						open && split.length > 1 ? split[1] : null,
						open,
						notClosed
					);
				}
				lastC = cr + 1;
				c = cr;
			}
		}
		if (l === 0 || c > lastC) {
			currentNode = this.updateTag(currentNode, TAG_KIND.TEXT, message.substring(lastC, c), true, notClosed);
		}
	}

	/**
	 *  Update tag.
	 *  @param {Node} currentNode - The current node
	 *  @param {TAG_KIND} tag - The tag kind
	 *  @param {string} value - The tag value
	 *  @param {boolean} open - Indicate if open tag
	 *  @param {Node[]} notClosed - List of unclosed nodes
	 *  @returns {Node}
	 */
	updateTag(currentNode: Node, tag: TAG_KIND, value: string, open: boolean, notClosed: Node[]): Node {
		if (open) {
			for (let i = notClosed.length - 1; i >= 0; i--) {
				currentNode = currentNode.add(notClosed[i]);
				notClosed.splice(i, 1);
			}
			let nodeValue = <any>value;
			switch (tag) {
				case TAG_KIND.VARIABLE:
				case TAG_KIND.HERO_NAME:
					nodeValue = Model.DynamicValue.createVariable(parseInt(value));
					break;
				case TAG_KIND.PARAMETER:
					nodeValue = Model.DynamicValue.createParameter(parseInt(value));
					break;
				case TAG_KIND.PROPERTY:
					nodeValue = Model.DynamicValue.createProperty(parseInt(value));
					break;
			}
			currentNode.add([tag, nodeValue]);
			if (
				tag !== TAG_KIND.TEXT &&
				tag !== TAG_KIND.NEW_LINE &&
				tag !== TAG_KIND.VARIABLE &&
				tag !== TAG_KIND.ICON &&
				tag !== TAG_KIND.PROPERTY &&
				tag !== TAG_KIND.PARAMETER &&
				tag !== TAG_KIND.HERO_NAME
			) {
				currentNode = currentNode.lastChild;
			}
		} else {
			while (currentNode !== null && currentNode.data !== null && currentNode.data[0] !== tag) {
				notClosed.push(currentNode.data);
				currentNode = currentNode.parent;
			}
			currentNode = currentNode.parent;
		}
		return currentNode;
	}

	/**
	 *  Update all.
	 */
	update() {
		this.graphics = [];
		this.positions = [];
		this.heights = [];
		this.aligns = [];
		this.heights.push(0);
		const result = {
			g: this.graphics,
			p: this.positions,
			a: this.aligns,
			h: this.heights,
			ca: ALIGN.LEFT,
			cb: false,
			ci: false,
			cs: Utils.valueOrDefault(Datas.Systems.dbOptions.v_tSize, Constants.DEFAULT_FONT_SIZE),
			cf: Utils.valueOrDefault(Datas.Systems.dbOptions.v_tFont, Constants.DEFAULT_FONT_NAME),
			ctc: Utils.valueOrDefault(Datas.Systems.dbOptions.v_tcText, Model.Color.WHITE),
			cbc: Utils.valueOrDefault(Datas.Systems.dbOptions.v_tcBackground, null),
			csc: Utils.valueOrDefault(Datas.Systems.dbOptions.v_tOutline, false)
				? Utils.valueOrDefault(Datas.Systems.dbOptions.v_tcOutline, null)
				: null,
		};

		// Update nodes
		this.updateNodes(this.tree.root.firstChild, result);

		// Calculate width of align blocks for aligns settings
		this.totalWidths = [];
		let currentAlign: ALIGN, c: number, width: number, align: ALIGN;
		for (let i = 0, l = this.graphics.length; i < l; i++) {
			currentAlign = this.aligns[i];
			c = i;
			width = 0;
			while (c < l) {
				align = this.aligns[c];
				if (align !== currentAlign) {
					break;
				}
				width += this.positions[c];
				c++;
			}
			this.totalWidths.push(width);
			i = c - 1;
		}
	}

	/**
	 *  Update the nodes.
	 *  @param {Node} node - The current node
	 *  @param {Record<string, any>} - result The result object
	 */
	updateNodes(node: Node, result: Record<string, any>) {
		const tag = node.data[0];
		const value = node.data[1];
		let bold: boolean,
			italic: boolean,
			align: ALIGN,
			size: number,
			font: string,
			textColor: Model.Color,
			backColor: Model.Color,
			strokeColor: Model.Color;
		switch (tag) {
			case TAG_KIND.NEW_LINE:
				result.g.push(null);
				result.p.push(0);
				result.a.push(-1);
				if (result.h[0] === 0) {
					result.h[0] = result.cs;
				}
				result.h.unshift(0);
				break;
			case TAG_KIND.TEXT:
			case TAG_KIND.VARIABLE:
			case TAG_KIND.PARAMETER:
			case TAG_KIND.PROPERTY:
			case TAG_KIND.HERO_NAME: {
				let text: string;
				switch (node.data[0]) {
					case TAG_KIND.TEXT:
						text = value;
						break;
					case TAG_KIND.VARIABLE:
						text = String(value.getValue());
						break;
					case TAG_KIND.PARAMETER:
						text = String(value.getValue());
						break;
					case TAG_KIND.PROPERTY:
						text = String(value.getValue());
						break;
					case TAG_KIND.HERO_NAME:
						text = Game.current.getHeroByInstanceID(value.getValue()).name;
						break;
				}
				const graphic = new Graphic.Text(text, {
					bold: result.cb,
					italic: result.ci,
					fontSize: result.cs,
					fontName: result.cf,
					color: result.ctc,
					backColor: result.cbc,
					strokeColor: result.csc,
				});
				result.g.push(graphic);
				graphic.measureText();
				result.p.push(graphic.textWidth);
				result.a.push(result.ca);
				if (graphic.fontSize > result.h[0]) {
					result.h[0] = graphic.fontSize;
				}
				break;
			}
			case TAG_KIND.ICON: {
				const args = value.split(';');
				const graphic = Datas.Pictures.getPictureCopy(PICTURE_KIND.ICONS, parseInt(args[0]));
				graphic.sx = parseInt(args[1]) * Datas.Systems.iconsSize;
				if (isNaN(graphic.sx)) {
					graphic.sx = 0;
				}
				graphic.sy = parseInt(args[2]) * Datas.Systems.iconsSize;
				if (isNaN(graphic.sy)) {
					graphic.sy = 0;
				}
				result.g.push(graphic);
				result.p.push(ScreenResolution.getScreenMinXY(Datas.Systems.iconsSize));
				result.a.push(result.ca);
				if (Constants.DEFAULT_FONT_SIZE > result.h[0]) {
					result.h[0] = Constants.DEFAULT_FONT_SIZE;
				}
				break;
			}
			case TAG_KIND.BOLD:
				bold = result.cb;
				result.cb = true;
				break;
			case TAG_KIND.ITALIC:
				italic = result.ci;
				result.ci = true;
				break;
			case TAG_KIND.LEFT:
				align = result.ca;
				result.ca = ALIGN.LEFT;
				break;
			case TAG_KIND.CENTER:
				align = result.ca;
				result.ca = ALIGN.CENTER;
				break;
			case TAG_KIND.RIGHT:
				align = result.ca;
				result.ca = ALIGN.RIGHT;
				break;
			case TAG_KIND.SIZE:
				size = result.cs;
				result.cs = Datas.Systems.getFontSize(value).getValue();
				break;
			case TAG_KIND.FONT:
				font = result.cf;
				result.cf = Datas.Systems.getFontName(value).getName();
				break;
			case TAG_KIND.TEXT_COLOR:
				textColor = result.ctc;
				result.ctc = Datas.Systems.getColor(value);
				break;
			case TAG_KIND.BACK_COLOR:
				backColor = result.cbc;
				result.cbc = Datas.Systems.getColor(value);
				break;
			case TAG_KIND.STROKE_COLOR:
				strokeColor = result.csc;
				result.csc = Datas.Systems.getColor(value);
				break;
		}
		if (node.firstChild !== null) {
			this.updateNodes(node.firstChild, result);
		}
		// Handle closures
		switch (node.data[0]) {
			case TAG_KIND.BOLD:
				result.cb = bold;
				break;
			case TAG_KIND.ITALIC:
				result.ci = italic;
				break;
			case TAG_KIND.LEFT:
			case TAG_KIND.CENTER:
			case TAG_KIND.RIGHT:
				result.ca = align;
				break;
			case TAG_KIND.SIZE:
				result.cs = size;
				break;
			case TAG_KIND.FONT:
				result.cf = font;
				break;
			case TAG_KIND.TEXT_COLOR:
				result.ctc = textColor;
				break;
			case TAG_KIND.BACK_COLOR:
				result.cbc = backColor;
				break;
			case TAG_KIND.STROKE_COLOR:
				result.csc = strokeColor;
				break;
		}
		// Go next if possible
		if (node.next !== null) {
			this.updateNodes(node.next, result);
		}
	}

	/**
	 *  Drawing the faceset behind.
	 *  @param {number} x - The x position to draw graphic
	 *  @param {number} y - The y position to draw graphic
	 *  @param {number} w - The width dimention to draw graphic
	 *  @param {number} h - The height dimention to draw graphic
	 */
	drawBehind(x: number, y: number, w: number, h: number) {
		if (!Datas.Systems.dbOptions.v_fPosAbove) {
			this.drawFaceset(x, y, w, h);
		}
	}

	/**
	 *  Drawing the faceset.
	 *  @param {number} x - The x position to draw graphic
	 *  @param {number} y - The y position to draw graphic
	 *  @param {number} w - The width dimention to draw graphic
	 *  @param {number} h - The height dimention to draw graphic
	 */
	drawFaceset(x: number, y: number, w: number, h: number) {
		this.faceset.draw({
			x: x + Utils.valueOrDefault(ScreenResolution.getScreenMinXY(Datas.Systems.dbOptions.v_fX), 0),
			y:
				y -
				(ScreenResolution.getScreenMinXY(Datas.Systems.facesetScalingHeight) - h) / 2 +
				Utils.valueOrDefault(ScreenResolution.getScreenMinXY(Datas.Systems.dbOptions.v_fY), 0),
			w: Datas.Systems.facesetScalingWidth,
			h: Datas.Systems.facesetScalingHeight,
			sx: this.facesetIndexX * Datas.Systems.facesetsSize,
			sy: this.facesetIndexY * Datas.Systems.facesetsSize,
			sw: Datas.Systems.facesetsSize,
			sh: Datas.Systems.facesetsSize,
		});
	}

	/**
	 *  Drawing the message box.
	 *  @param {number} x - The x position to draw graphic
	 *  @param {number} y - The y position to draw graphic
	 *  @param {number} w - The width dimention to draw graphic
	 *  @param {number} h - The height dimention to draw graphic
	 */
	drawChoice(x: number = this.oX, y: number = this.oY, w: number = this.oW, h: number = this.oH) {
		this.draw(x, y, w, h);
	}

	/**
	 *  Drawing the message.
	 *  @param {number} [x=this.oX] - The x position to draw graphic
	 *  @param {number} [y=this.oY] - The y position to draw graphic
	 *  @param {number} [w=this.oW] - The width dimention to draw graphic
	 *  @param {number} [h=this.oH] - The height dimention to draw graphic
	 *  @param {boolean} [positionResize=true] - If checked, resize postion
	 *  according to screen resolution
	 */
	draw(x: number = this.oX, y: number = this.oY, w: number = this.oW, h: number = this.oH) {
		if (Datas.Systems.dbOptions.v_fPosAbove) {
			this.drawFaceset(x, y, w, h);
		}
		const newX = x + (this.faceset.empty ? 0 : ScreenResolution.getScreenX(Datas.Systems.facesetScalingWidth));
		const newY = y + ScreenResolution.getScreenMinXY(Constants.HUGE_SPACE);
		let offsetY = 0;
		let align = ALIGN.NONE;
		let c = this.heights.length - 1;

		// Draw each graphics
		let offsetX = 0;
		let graphic: Bitmap;
		for (let i = 0, j = 0, l = this.graphics.length; i < l; i++) {
			graphic = this.graphics[i];

			// New line
			if (graphic === null) {
				offsetY += this.heights[c--] * 2;
				align = ALIGN.NONE;
				j++;
			} else {
				if (align !== this.aligns[i]) {
					align = this.aligns[i];
					switch (align) {
						case ALIGN.LEFT:
							offsetX = 0;
							break;
						case ALIGN.CENTER:
							offsetX = (w - this.totalWidths[j]) / 2;
							break;
						case ALIGN.RIGHT:
							offsetX = w - this.totalWidths[j];
							break;
					}
					j++;
				}
				if (graphic instanceof Picture2D) {
					graphic.draw({
						x: newX + offsetX,
						y: newY - ScreenResolution.getScreenMinXY(Datas.Systems.iconsSize) / 2 + offsetY,
						sw: Datas.Systems.iconsSize,
						sh: Datas.Systems.iconsSize,
						w: Datas.Systems.iconsSize,
						h: Datas.Systems.iconsSize,
					});
				} else {
					(<Graphic.Base>graphic).draw(newX + offsetX, newY + offsetY, graphic.oW, graphic.oH);
				}
				offsetX += this.positions[i];
			}
		}
	}
}

export { Message };
