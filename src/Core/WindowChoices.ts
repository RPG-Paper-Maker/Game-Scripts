/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Inputs, ORIENTATION_WINDOW, ScreenResolution, Utils } from '../Common';
import { Data, Graphic, Manager } from '../index';
import { Bitmap } from './Bitmap';
import { Rectangle } from './Rectangle';
import { WindowBox } from './WindowBox';

/**
 * the choices options used for the window initialization
 *
 * @interface ChoicesOptions
 */
interface ChoicesOptions {
	/**
	 * The choices callbacks
	 *
	 * @type {Function[]}
	 * @default null
	 * @memberof ChoicesOptions
	 */
	listCallbacks?: Function[];
	/**
	 * The choices list orientation
	 *
	 * @type {ORIENTATION_WINDOW}
	 * @default ORIENTATION_WINDOW.Vertical
	 * @memberof ChoicesOptions
	 */
	orientation?: ORIENTATION_WINDOW;

	/**
	 * The max number of choices displayed
	 *
	 * @type {number}
	 * @default 4
	 * @memberof ChoicesOptions
	 */
	nbItemsMax?: number;
	/**
	 * The window padding
	 *
	 * @type {number[]}
	 * @default [0,0,0,0]
	 * @memberof ChoicesOptions
	 */
	padding?: number[];
	/**
	 * the space in between choices.
	 *
	 * @type {number}
	 * @default 0
	 * @memberof ChoicesOptions
	 */
	space?: number;
	/**
	 * Per-item widths for horizontal orientation. When set, each slot uses its
	 * own width instead of the uniform choiceWidth.
	 *
	 * @type {number[]}
	 * @memberof ChoicesOptions
	 */
	choiceWidths?: number[];
	/**
	 * The current selected choices index.
	 *
	 * @type {number}
	 * @default -1
	 * @memberof ChoicesOptions
	 */
	currentSelectedIndex?: number;

	/**
	 * If enabled the inside border will be visible.
	 *
	 * @type {boolean}
	 * @default true
	 * @memberof ChoicesOptions
	 */
	bordersInsideVisible?: boolean;

	/**
	 * If enabled the inside border will be visible.
	 *
	 * @type {boolean}
	 * @default true
	 * @memberof ChoicesOptions
	 */
	bordersVisible?: boolean;
}

/**
 * The window class who handle choices.
 *
 * @class WindowChoices
 * @extends {Bitmap}
 */
class WindowChoices extends Bitmap {
	public static TIME_WAIT_PRESS = 50;
	public static TIME_WAIT_MOUSE_ARROW = 200;

	public orientation: ORIENTATION_WINDOW;
	public nbItemsMax: number;
	public padding: number[];
	public space: number;
	public currentSelectedIndex: number;
	public bordersInsideVisible: boolean;
	public bordersVisible: boolean;
	public offsetSelectedIndex: number;
	public choiceWidth: number;
	public choiceHeight: number;
	public choiceWidths: number[] | null;
	public startTime: number;
	public mouseArrowTime: number;
	public listContents: Graphic.Base[];
	public listWindows: WindowBox[];
	public listCallBacks: Function[];
	public windowMain: WindowBox;
	public size: number;
	public isMouseInArrowUp: boolean = false;
	public isMouseInArrowDown: boolean = false;

	constructor(x: number, y: number, w: number, h: number, listContents: any[], options: ChoicesOptions = {}) {
		super(x, y, w, h);

		// Parameters
		this.orientation = Utils.valueOrDefault(options.orientation, ORIENTATION_WINDOW.VERTICAL);
		this.nbItemsMax = Utils.valueOrDefault(options.nbItemsMax, 4);
		this.padding = Utils.valueOrDefault(options.padding, WindowBox.SMALL_PADDING_BOX);
		this.space = Utils.valueOrDefault(options.space, 0);
		this.currentSelectedIndex = Utils.valueOrDefault(options.currentSelectedIndex, -1);
		this.bordersInsideVisible = Utils.valueOrDefault(options.bordersInsideVisible, true);
		this.bordersVisible = Utils.valueOrDefault(options.bordersVisible, true);
		this.choiceWidths = Utils.valueOrDefault(options.choiceWidths, null);

		// Auto-calculate nbItemsMax to fit the available width when choiceWidths is provided
		if (this.choiceWidths && this.orientation === ORIENTATION_WINDOW.HORIZONTAL && w > 0) {
			let count = 0;
			let sumW = 0;
			for (let j = 0; j < this.choiceWidths.length; j++) {
				sumW += (j > 0 ? this.space : 0) + this.choiceWidths[j];
				if (sumW <= w) {
					count++;
				} else {
					break;
				}
			}
			this.nbItemsMax = Math.max(1, count);
		}

		// Initialize values
		this.offsetSelectedIndex = 0;
		this.choiceWidth = w;
		this.choiceHeight = h;
		this.startTime = new Date().getTime();
		this.mouseArrowTime = new Date().getTime();

		// Initialize contents choices and callbacks
		this.setContentsCallbacks(listContents, options.listCallbacks, options.currentSelectedIndex);
	}

	/**
	 *  Set the x value.
	 *  @param {number} x - The x value
	 */
	setX(x: number) {
		super.setX(x);
		if (this.listContents) {
			this.updatePosition();
		}
	}

	/**
	 *  Set the y value.
	 *  @param {number} y - The y value
	 */
	setY(y: number) {
		super.setY(y);
		if (this.listContents) {
			this.updatePosition();
		}
	}

	updatePosition() {
		let borderLeft = 0,
			borderTop = 0;
		if (!this.bordersInsideVisible) {
			const ws = Data.Systems.getCurrentWindowSkin();
			borderLeft = ws.borderTopLeft.width;
			borderTop = ws.borderTopLeft.height;
		}
		const slotX = !this.bordersInsideVisible
			? this.oX + borderLeft
			: this.orientation === ORIENTATION_WINDOW.HORIZONTAL
				? this.oX + this.padding[0]
				: this.oX;
		const slotY0 = this.oY + borderTop;
		if (this.choiceWidths && this.orientation === ORIENTATION_WINDOW.HORIZONTAL) {
			let xOffset = slotX;
			for (let i = 0; i < this.listWindows.length; i++) {
				this.listWindows[i].setX(xOffset);
				this.listWindows[i].setY(slotY0);
				xOffset += this.choiceWidths[i] + this.space;
			}
			return;
		}
		let windowBox: WindowBox;
		for (let i = 0; i < this.listWindows.length; i++) {
			windowBox = this.listWindows[i];
			windowBox.setX(
				this.orientation === ORIENTATION_WINDOW.HORIZONTAL
					? slotX + i * (this.choiceWidth + this.space)
					: slotX,
			);
			windowBox.setY(
				slotY0 +
					(this.orientation === ORIENTATION_WINDOW.HORIZONTAL ? 0 : i * (this.choiceHeight + this.space)),
			);
		}
	}

	/**
	 *  Get the content at a specific index.
	 *  @param {number} i - The index
	 *  @returns {Graphic.Base}
	 */
	getContent(i: number): Graphic.Base {
		const window = this.listWindows[i];
		return window ? window.content : null;
	}

	/**
	 *  Get the current selected content.
	 *  @returns {Graphic.Base}
	 */
	getCurrentContent(): Graphic.Base {
		return this.getContent(this.currentSelectedIndex);
	}

	/**
	 *  Update content size according to all the current settings.
	 *  @param {number} [currentSelectedIndex=0] - The current selected index
	 *  position
	 */
	updateContentSize(currentSelectedIndex: number = 0, offsetSelectedIndex: number = 0) {
		// Getting the main box size
		const totalNb = this.listContents.length;
		this.size = totalNb > this.nbItemsMax ? this.nbItemsMax : totalNb;

		let borderLeft = 0,
			borderTop = 0,
			borderRight = 0,
			borderBot = 0;
		if (!this.bordersInsideVisible) {
			const ws = Data.Systems.getCurrentWindowSkin();
			borderLeft = ws.borderTopLeft.width;
			borderTop = ws.borderTopLeft.height;
			borderRight = ws.borderTopRight.width;
			borderBot = ws.borderBotLeft.height;
		}

		let boxWidth: number, boxHeight: number;
		if (this.orientation === ORIENTATION_WINDOW.HORIZONTAL) {
			if (this.choiceWidths) {
				let sumWidths = 0;
				for (let j = 0; j < this.size; j++) {
					sumWidths += this.choiceWidths[j];
				}
				boxWidth = sumWidths + this.space * Math.max(0, this.size - 1) + borderLeft + borderRight;
			} else {
				boxWidth = (this.choiceWidth + this.space) * this.size - this.space + borderLeft + borderRight;
			}
			boxHeight = this.choiceHeight + borderTop + borderBot;
		} else {
			boxWidth = this.choiceWidth;
			boxHeight = (this.choiceHeight + this.space) * this.size - this.space + borderTop + borderBot;
		}
		this.setW(boxWidth);
		this.setH(boxHeight);
		if (!this.bordersInsideVisible) {
			this.windowMain = new WindowBox(this.oX, this.oY, boxWidth, boxHeight);
		}

		const slotX0 = !this.bordersInsideVisible
			? this.oX + borderLeft
			: this.orientation === ORIENTATION_WINDOW.HORIZONTAL
				? this.oX + this.padding[0]
				: this.oX;
		const slotY0 = this.oY + borderTop;
		const slotW = this.choiceWidth - borderLeft - borderRight;

		// Create a new windowBox for each choice and according to orientation
		this.listWindows = new Array(totalNb);
		let window: WindowBox;
		let xOffsetHoriz = slotX0;
		for (let i = 0; i < totalNb; i++) {
			if (this.orientation === ORIENTATION_WINDOW.HORIZONTAL) {
				const itemWidth = this.choiceWidths ? this.choiceWidths[i] : this.choiceWidth;
				const itemX = this.choiceWidths ? xOffsetHoriz : slotX0 + i * this.choiceWidth + i * this.space;
				window = new WindowBox(itemX, slotY0, itemWidth, this.choiceHeight, {
					content: this.listContents[i],
					padding: this.bordersInsideVisible ? this.padding : WindowBox.NONE_PADDING,
				});
				if (this.choiceWidths) {
					xOffsetHoriz += itemWidth + this.space;
				}
			} else {
				window = new WindowBox(
					slotX0,
					slotY0 + i * (this.choiceHeight + this.space),
					slotW,
					this.choiceHeight,
					{
						content: this.listContents[i],
						padding: this.padding,
					},
				);
			}
			window.bordersVisible = this.bordersInsideVisible && this.bordersVisible;
			this.listWindows[i] = window;
		}
		// Select current selected index if number of choices > 0
		if (this.size > 0) {
			this.currentSelectedIndex = currentSelectedIndex;
			if (this.currentSelectedIndex !== -1) {
				this.listWindows[this.currentSelectedIndex].selected = true;
			}
		} else {
			this.currentSelectedIndex = -1;
		}
		this.offsetSelectedIndex = offsetSelectedIndex;

		// Update HUD
		Manager.Stack.requestPaintHUD = true;
	}

	/**
	 *  Set the content at a specific index.
	 *  @param {number} i - The index
	 *  @param {Graphic.Base} content - The new content
	 */
	setContent(i: number, content: Graphic.Base) {
		this.listWindows[i].content = content;
	}

	/**
	 *  Set all the graphic contents.
	 *  @param {Graphic.Base[]} contents - All the contents
	 */
	setContents(contents: Graphic.Base[]) {
		for (let i = 0, l = this.listWindows.length; i < l; i++) {
			this.setContent(i, contents[i]);
		}
	}

	/**
	 *  Set all the callbacks for each choice.
	 *  @param {Function[]} callbacks - All the callbacks functions
	 */
	setCallbacks(callbacks: Function[]) {
		if (callbacks === null) {
			// Create a complete empty list according to contents length
			const l = this.listContents.length;
			this.listCallBacks = new Array(l);
			for (let i = 0; i < l; i++) {
				this.listCallBacks[i] = null;
			}
		} else {
			this.listCallBacks = callbacks;
		}
	}

	/**
	 *  Set all the contents and callbacks.
	 *  @param {Graphic.Base[]} contents - All the contents
	 *  @param {function[]} [callbacks=null] - All the callbacks functions
	 *  @param {number} [currentSelectedIndex=0] - The current selected index
	 *  position
	 */
	setContentsCallbacks(contents: Graphic.Base[], callbacks: Function[] = null, currentSelectedIndex: number = 0) {
		this.listContents = contents;
		this.updateContentSize(currentSelectedIndex);
		this.setCallbacks(callbacks);
	}

	/**
	 *  Unselect a choice.
	 */
	unselect() {
		if (this.currentSelectedIndex !== -1 && this.listWindows.length > 0) {
			this.listWindows[this.currentSelectedIndex].selected = false;
			this.currentSelectedIndex = -1;
			this.offsetSelectedIndex = 0;
			Manager.Stack.requestPaintHUD = true;
		}
	}

	/**
	 *  Select a choice.
	 *  @param {number} i - The index of the choice
	 */
	select(i: number) {
		if (this.listWindows.length > 0) {
			if (i >= this.listWindows.length) {
				i = this.listWindows.length - 1;
				this.offsetSelectedIndex = this.size - 1;
			} else if (this.listWindows.length <= this.size) {
				this.offsetSelectedIndex = i;
			} else {
				const minOffset = i + this.size - this.listWindows.length;
				if (this.offsetSelectedIndex < minOffset) {
					this.offsetSelectedIndex = minOffset;
				}
			}
			this.currentSelectedIndex = i;
			this.listWindows[this.currentSelectedIndex].selected = true;
			Manager.Stack.requestPaintHUD = true;
		}
	}

	/**
	 *  Select the current choice.
	 */
	selectCurrent() {
		this.select(this.currentSelectedIndex);
	}

	/**
	 *  Remove the current choice.
	 */
	removeCurrent() {
		this.listContents.splice(this.currentSelectedIndex, 1);
		if (this.currentSelectedIndex === this.listContents.length) {
			this.currentSelectedIndex--;
			this.offsetSelectedIndex--;
		}
		if (this.currentSelectedIndex >= 0) {
			const newTotalNb = this.listContents.length;
			const newSize = Math.min(newTotalNb, this.nbItemsMax);
			const minOffset = this.currentSelectedIndex + newSize - newTotalNb;
			if (minOffset > 0 && this.offsetSelectedIndex < minOffset) {
				this.offsetSelectedIndex = minOffset;
			}
		}
		this.updateContentSize(this.currentSelectedIndex, this.offsetSelectedIndex);
	}

	/**
	 *  Go cursor up.
	 */
	goUp() {
		const index = this.currentSelectedIndex;
		if (index > 0) {
			this.currentSelectedIndex--;
			if (this.offsetSelectedIndex > 0) {
				this.offsetSelectedIndex--;
			}
		} else if (index === 0 && this.orientation !== ORIENTATION_WINDOW.HORIZONTAL) {
			this.currentSelectedIndex = this.listWindows.length - 1;
			this.offsetSelectedIndex = this.size - 1;
		}
		if (index !== this.currentSelectedIndex) {
			Data.Systems.soundCursor.playSound();
			Manager.Stack.requestPaintHUD = true;
		}
	}

	/**
	 *  Go cursor down.
	 */
	goDown() {
		const index = this.currentSelectedIndex;
		if (index < this.listWindows.length - 1 && index >= 0) {
			this.currentSelectedIndex++;
			if (this.offsetSelectedIndex < this.size - 1) {
				this.offsetSelectedIndex++;
			}
		} else if (index === this.listWindows.length - 1 && this.orientation !== ORIENTATION_WINDOW.HORIZONTAL) {
			this.currentSelectedIndex = 0;
			this.offsetSelectedIndex = 0;
		}
		if (index !== this.currentSelectedIndex) {
			Data.Systems.soundCursor.playSound();
			Manager.Stack.requestPaintHUD = true;
		}
	}

	/**
	 *  Go arrow up.
	 */
	goArrowUp() {
		this.offsetSelectedIndex++;
		Data.Systems.soundCursor.playSound();
		Manager.Stack.requestPaintHUD = true;
	}

	/**
	 *  Go arrow down.
	 */
	goArrowDown() {
		this.offsetSelectedIndex--;
		Data.Systems.soundCursor.playSound();
		Manager.Stack.requestPaintHUD = true;
	}

	/**
	 *  A widget move.
	 *  @param {boolean} isKey
	 *  @param {{ key?: string, x?: number, y?: number }} [options={}]
	 */
	move(isKey: boolean, options: { key?: string; x?: number; y?: number } = {}) {
		if (isKey) {
			this.onKeyPressedAndRepeat(options.key);
		} else {
			this.onMouseMove(options.x, options.y);
		}
	}

	/**
	 *  Update the widget.
	 */
	update() {
		const t = new Date().getTime();
		if (t - this.mouseArrowTime >= WindowChoices.TIME_WAIT_MOUSE_ARROW) {
			this.mouseArrowTime = t;
			const offset = this.currentSelectedIndex === -1 ? -1 : this.offsetSelectedIndex;
			// If pressing on arrow up
			if (this.isMouseInArrowUp && this.currentSelectedIndex - offset > 0) {
				this.goArrowUp();
			}
			// If pressing on arrow down
			if (
				this.isMouseInArrowDown &&
				this.currentSelectedIndex - offset < this.listWindows.length - this.nbItemsMax
			) {
				this.goArrowDown();
			}
		}
	}

	/**
	 *  First key press handle.
	 *  @param {number} key - The key ID pressed
	 *  @param {Object} base - The base object to apply with callback
	 */
	onKeyPressed(key: string, base?: object) {
		if (this.currentSelectedIndex !== -1) {
			if (Data.Keyboards.isKeyEqual(key, Data.Keyboards.menuControls.Action)) {
				const callback = this.listCallBacks[this.currentSelectedIndex];
				if (callback !== null) {
					// Play a sound according to callback result
					if (callback.call(base)) {
						Data.Systems.soundConfirmation.playSound();
					} else {
						Data.Systems.soundImpossible.playSound();
					}
				} else {
					Data.Systems.soundImpossible.playSound();
				}
			}
		}
	}

	/**
	 *  Key pressed repeat handle, but with a small wait after the first
	 *  pressure (generally used for menus).
	 *  @param {number} key - The key ID pressed
	 *  @returns {boolean} false if the other keys are blocked after it
	 */
	onKeyPressedAndRepeat(key: string): boolean {
		// Wait for a slower update
		const t = new Date().getTime();
		if (t - this.startTime >= WindowChoices.TIME_WAIT_PRESS) {
			this.startTime = t;
			if (this.currentSelectedIndex !== -1) {
				this.listWindows[this.currentSelectedIndex].selected = false;

				// Go up or go down according to key and orientation
				if (this.orientation === ORIENTATION_WINDOW.VERTICAL) {
					if (Data.Keyboards.isKeyEqual(key, Data.Keyboards.menuControls.Down)) {
						this.goDown();
					} else if (Data.Keyboards.isKeyEqual(key, Data.Keyboards.menuControls.Up)) {
						this.goUp();
					}
				} else {
					if (Data.Keyboards.isKeyEqual(key, Data.Keyboards.menuControls.Right)) {
						this.goDown();
					} else if (Data.Keyboards.isKeyEqual(key, Data.Keyboards.menuControls.Left)) {
						this.goUp();
					}
				}
				this.selectCurrent();
			}
		}
		return true;
	}

	/**
	 *  Mouse move handle for the current stack.
	 *  @param {number} x - The x mouse position on screen
	 *  @param {number} y - The y mouse position on screen
	 */
	onMouseMove(x: number, y: number) {
		this.isMouseInArrowDown = false;
		this.isMouseInArrowUp = false;
		// If inside the main window
		if (this.currentSelectedIndex !== -1 && this.isInside(x, y)) {
			let index: number;
			// Check which window
			if (this.orientation === ORIENTATION_WINDOW.HORIZONTAL) {
				if (this.choiceWidths) {
					index = this.size - 1;
					for (let j = 0; j < this.size; j++) {
						if (x < this.listWindows[j].x + this.listWindows[j].w) {
							index = j;
							break;
						}
					}
				} else {
					index = Math.floor((x - this.x) / ScreenResolution.getScreenX(this.choiceWidth + this.space));
				}
			} else {
				const borderTopScreen = this.bordersInsideVisible
					? 0
					: ScreenResolution.getScreenY(Data.Systems.getCurrentWindowSkin().borderTopLeft.height);
				index = Math.floor(
					(y - this.y - borderTopScreen) / ScreenResolution.getScreenY(this.choiceHeight + this.space),
				);
			}
			// If different index, then change it visually + sound
			if (this.offsetSelectedIndex !== index && index >= 0 && index < this.size) {
				Data.Systems.soundCursor.playSound();
				this.listWindows[this.currentSelectedIndex].selected = false;
				this.currentSelectedIndex += index - this.offsetSelectedIndex;
				this.offsetSelectedIndex = index;
				this.listWindows[this.currentSelectedIndex].selected = true;
				Manager.Stack.requestPaintHUD = true;
			}
		} else {
			// If on arrow
			const offset = this.currentSelectedIndex === -1 ? -1 : this.offsetSelectedIndex;
			const ws = Data.Systems.getCurrentWindowSkin();
			const arrowW = ScreenResolution.getScreenXY(ws.arrowUpDown.width);
			const arrowH = ScreenResolution.getScreenXY(ws.arrowUpDown.height / 2);

			if (this.orientation === ORIENTATION_WINDOW.HORIZONTAL) {
				// After rotation, each arrow's bounding box is (arrowH wide × arrowW tall)
				// Arrows sit inside the tab bar at its left/right edges
				const arrowHScreen = ScreenResolution.getScreenXY(ws.arrowUpDown.height / 2);
				const arrowWScreen = ScreenResolution.getScreenXY(ws.arrowUpDown.width);
				const arrowY = this.y + (this.h - arrowWScreen) / 2;
				const leftEdge = this.x + ScreenResolution.getScreenX(this.padding[0]);
				if (this.currentSelectedIndex - offset > 0) {
					const rect = new Rectangle(leftEdge - arrowHScreen, arrowY, arrowHScreen, arrowWScreen);
					if (rect.isInside(x, y)) {
						this.isMouseInArrowUp = true;
					}
				}
				if (this.currentSelectedIndex - offset < this.listWindows.length - this.nbItemsMax) {
					const rect = new Rectangle(this.x + this.w, arrowY, arrowHScreen, arrowWScreen);
					if (rect.isInside(x, y)) {
						this.isMouseInArrowDown = true;
					}
				}
			} else {
				const arrowX = this.x + this.w / 2 - arrowW / 2;
				if (this.currentSelectedIndex - offset > 0) {
					const rect = new Rectangle(arrowX, this.y - arrowH - 1, arrowW, arrowH);
					if (rect.isInside(x, y)) {
						this.isMouseInArrowUp = true;
					}
				}
				if (this.currentSelectedIndex - offset < this.listWindows.length - this.nbItemsMax) {
					const rect = new Rectangle(arrowX, this.y + this.h + 1, arrowW, arrowH);
					if (rect.isInside(x, y)) {
						this.isMouseInArrowDown = true;
					}
				}
			}
		}
	}

	/**
	 *  Mouse up handle for the current stack.
	 *  @param {number} x - The x mouse position on screen
	 *  @param {number} y - The y mouse position on screen
	 *  @param {Object} base - The base object to apply with callback
	 */
	onMouseUp(x: number, y: number, base?: object) {
		if (this.currentSelectedIndex !== -1 && Inputs.mouseLeftPressed) {
			const callback = this.listCallBacks[this.currentSelectedIndex];
			if (callback !== null) {
				// Play a sound according to callback result
				if (callback.call(base)) {
					Data.Systems.soundConfirmation.playSound();
				} else {
					Data.Systems.soundImpossible.playSound();
				}
			} else {
				Data.Systems.soundImpossible.playSound();
			}
		}
	}

	/**
	 *  Draw the windows.
	 */
	draw() {
		// Draw windows
		if (!this.bordersInsideVisible && this.bordersVisible) {
			this.windowMain.draw();
		}
		const offset = this.currentSelectedIndex === -1 ? -1 : this.offsetSelectedIndex;
		let index: number;
		// Right edge of the last visible item in game units (used for horizontal arrow placement)
		let visibleRightX = this.oX + this.oW;

		if (this.orientation === ORIENTATION_WINDOW.HORIZONTAL && this.choiceWidths) {
			// For variable-width horizontal items, recalculate positions dynamically
			// based on the currently visible items (offset may have shifted the view)
			let xOff = this.oX + this.padding[0];
			for (let i = 0; i < this.size; i++) {
				index = i + this.currentSelectedIndex - offset;
				const iw = this.choiceWidths[index];
				const wp = this.listWindows[index].padding;
				const wDim = [xOff, this.oY, iw, this.choiceHeight];
				const cDim = [
					ScreenResolution.getScreenX(xOff + wp[0]),
					ScreenResolution.getScreenY(this.oY + wp[1]),
					ScreenResolution.getScreenX(iw - 2 * wp[2]),
					ScreenResolution.getScreenY(this.choiceHeight - 2 * wp[3]),
				];
				this.listWindows[index].draw(true, wDim, cDim);
				xOff += iw + this.space;
			}
			visibleRightX = xOff - this.space;
		} else {
			for (let i = 0; i < this.size; i++) {
				index = i + this.currentSelectedIndex - offset;
				this.listWindows[index].draw(
					true,
					this.listWindows[i].windowDimension,
					this.listWindows[i].contentDimension,
				);
			}
		}

		// Draw arrows
		const ws = Data.Systems.getCurrentWindowSkin();
		const arrowW = ws.arrowUpDown.width;
		const arrowH = ws.arrowUpDown.height / 2;
		if (this.orientation === ORIENTATION_WINDOW.HORIZONTAL) {
			// Left/right arrows sit inside the tab bar at its edges
			// After -90° rotation the bounding box is (arrowH wide × arrowW tall)
			const arrowY = this.oY + (this.oH - arrowW) / 2;
			const leftEdge = this.oX + this.padding[0];
			if (this.currentSelectedIndex - offset > 0) {
				ws.drawArrowLeft(leftEdge - arrowH, arrowY);
			}
			if (this.currentSelectedIndex - offset < this.listWindows.length - this.nbItemsMax) {
				ws.drawArrowRight(visibleRightX, arrowY);
			}
		} else {
			const arrowX = this.oX + (this.oW + this.padding[0] * 2 - arrowW) / 2;
			if (this.currentSelectedIndex - offset > 0) {
				ws.drawArrowUp(arrowX, this.oY - arrowH - 1);
			}
			if (this.currentSelectedIndex - offset < this.listWindows.length - this.nbItemsMax) {
				ws.drawArrowDown(arrowX, this.oY + this.oH + 1);
			}
		}
	}
}

export { ChoicesOptions, WindowChoices };
