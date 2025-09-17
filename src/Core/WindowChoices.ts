/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

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
		let windowBox: WindowBox;
		for (let i = 0; i < this.listWindows.length; i++) {
			windowBox = this.listWindows[i];
			windowBox.setX(
				this.orientation === ORIENTATION_WINDOW.HORIZONTAL
					? this.oX + this.padding[0] + i * this.choiceWidth + i * this.space
					: this.oX + this.padding[0]
			);
			windowBox.setY(
				this.orientation === ORIENTATION_WINDOW.HORIZONTAL
					? this.oY
					: this.oY + i * this.choiceHeight + i * this.space
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
		let boxWidth: number, boxHeight: number;
		if (this.orientation === ORIENTATION_WINDOW.HORIZONTAL) {
			boxWidth =
				(this.choiceWidth + this.space) * this.size -
				this.space +
				(this.bordersInsideVisible ? 0 : this.padding[0] * 3);
			boxHeight = this.choiceHeight;
		} else {
			boxWidth = this.choiceWidth;
			boxHeight = (this.choiceHeight + this.space) * this.size - this.space;
		}
		this.setW(boxWidth);
		this.setH(boxHeight);
		if (!this.bordersInsideVisible) {
			this.windowMain = new WindowBox(this.oX, this.oY, boxWidth, boxHeight);
		}

		// Create a new windowBox for each choice and according to orientation
		this.listWindows = new Array(totalNb);
		let window: WindowBox;
		for (let i = 0; i < totalNb; i++) {
			if (this.orientation === ORIENTATION_WINDOW.HORIZONTAL) {
				window = new WindowBox(
					this.oX + this.padding[0] + i * this.choiceWidth + i * this.space,
					this.oY,
					this.choiceWidth,
					this.choiceHeight,
					{
						content: this.listContents[i],
						padding: this.bordersInsideVisible ? this.padding : WindowBox.NONE_PADDING,
					}
				);
			} else {
				window = new WindowBox(
					this.oX,
					this.oY + i * this.choiceHeight + i * this.space,
					this.choiceWidth,
					this.choiceHeight,
					{
						content: this.listContents[i],
						padding: this.padding,
					}
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
		} else if (index === 0) {
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
		} else if (index === this.listWindows.length - 1) {
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
				index = Math.floor((x - this.x) / ScreenResolution.getScreenX(this.choiceWidth + this.space));
			} else {
				index = Math.floor((y - this.y) / ScreenResolution.getScreenY(this.choiceHeight + this.space));
			}
			// If different index, then change it visually + sound
			if (this.offsetSelectedIndex !== index && index < this.size) {
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
			const arrowWidth = ScreenResolution.getScreenXY(ws.arrowUpDown[2]);
			const arrowHeight = ScreenResolution.getScreenXY(ws.arrowUpDown[3] / 2);
			const arrowX = this.x + this.w / 2 - arrowWidth / 2;

			// If pressing on arrow up
			if (this.currentSelectedIndex - offset > 0) {
				const rect = new Rectangle(arrowX, this.y - arrowHeight - 1, arrowWidth, arrowHeight);
				if (rect.isInside(x, y)) {
					this.isMouseInArrowUp = true;
				}
			}
			// If pressing on arrow down
			if (this.currentSelectedIndex - offset < this.listWindows.length - this.nbItemsMax) {
				const rect = new Rectangle(arrowX, this.y + this.h + 1, arrowWidth, arrowHeight);
				if (rect.isInside(x, y)) {
					this.isMouseInArrowDown = true;
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
		if (this.currentSelectedIndex !== -1 && Inputs.mouseLeftPressed && this.isInside(x, y)) {
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
		for (let i = 0; i < this.size; i++) {
			index = i + this.currentSelectedIndex - offset;
			this.listWindows[index].draw(
				true,
				this.listWindows[i].windowDimension,
				this.listWindows[i].contentDimension
			);
		}

		// Draw arrows
		const ws = Data.Systems.getCurrentWindowSkin();
		const arrowWidth = ws.arrowUpDown[2];
		const arrowHeight = ws.arrowUpDown[3] / 2;
		const arrowX = this.oX + this.oW / 2 - arrowWidth / 2;
		if (this.currentSelectedIndex - offset > 0) {
			ws.drawArrowUp(arrowX, this.oY - arrowHeight - 1);
		}
		if (this.currentSelectedIndex - offset < this.listWindows.length - this.nbItemsMax) {
			ws.drawArrowDown(arrowX, this.oY + this.oH + 1);
		}
	}
}

export { ChoicesOptions, WindowChoices };
