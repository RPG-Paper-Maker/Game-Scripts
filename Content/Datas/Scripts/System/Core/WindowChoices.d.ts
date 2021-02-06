import { Bitmap } from "./Bitmap.js";
import { Enum } from "../Common/index.js";
import OrientationWindow = Enum.OrientationWindow;
import { Graphic } from "../index.js";
import { WindowBox } from "./WindowBox.js";
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
     * @type {OrientationWindow}
     * @default OrientationWindow.Vertical
     * @memberof ChoicesOptions
     */
    orientation?: OrientationWindow;
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
}
/**
 * The window class who handle choices.
 *
 * @class WindowChoices
 * @extends {Bitmap}
 */
declare class WindowChoices extends Bitmap {
    static TIME_WAIT_PRESS: number;
    orientation: OrientationWindow;
    nbItemsMax: number;
    padding: number[];
    space: number;
    currentSelectedIndex: number;
    bordersInsideVisible: boolean;
    offsetSelectedIndex: number;
    choiceWidth: number;
    choiceHeight: number;
    startTime: number;
    listContents: Graphic.Base[];
    listWindows: WindowBox[];
    listCallBacks: Function[];
    windowMain: WindowBox;
    size: number;
    constructor(x: number, y: number, w: number, h: number, listContents: any[], options?: ChoicesOptions);
    /**
     *  Set the x value.
     *  @param {number} x - The x value
     */
    setX(x: number): void;
    /**
     *  Set the y value.
     *  @param {number} y - The y value
     */
    setY(y: number): void;
    /**
     *  Get the content at a specific index.
     *  @param {number} i - The index
     *  @returns {Graphic.Base}
     */
    getContent(i: number): Graphic.Base;
    /**
     *  Get the current selected content.
     *  @returns {Graphic.Base}
     */
    getCurrentContent(): Graphic.Base;
    /**
     *  Update content size according to all the current settings.
     *  @param {number} [currentSelectedIndex=0] - The current selected index
     *  position
     */
    updateContentSize(currentSelectedIndex?: number, offsetSelectedIndex?: number): void;
    /**
     *  Set the content at a specific index.
     *  @param {number} i - The index
     *  @param {Graphic.Base} content - The new content
     */
    setContent(i: number, content: Graphic.Base): void;
    /**
     *  Set all the graphic contents.
     *  @param {Graphic.Base[]} contents - All the contents
     */
    setContents(contents: Graphic.Base[]): void;
    /**
     *  Set all the callbacks for each choice.
     *  @param {Function[]} callbacks - All the callbacks functions
     */
    setCallbacks(callbacks: Function[]): void;
    /**
     *  Set all the contents and callbacks.
     *  @param {Graphic.Base[]} contents - All the contents
     *  @param {function[]} [callbacks=null] - All the callbacks functions
     *  @param {number} [currentSelectedIndex=0] - The current selected index
     *  position
     */
    setContentsCallbacks(contents: Graphic.Base[], callbacks?: Function[], currentSelectedIndex?: number): void;
    /**
     *  Unselect a choice.
     */
    unselect(): void;
    /**
     *  Select a choice.
     *  @param {number} i - The index of the choice
     */
    select(i: number): void;
    /**
     *  Select the current choice.
     */
    selectCurrent(): void;
    /**
     *  Remove the current choice.
     */
    removeCurrent(): void;
    /**
     *  Go cursor up.
     */
    goUp(): void;
    /**
     *  Go cursor down.
     */
    goDown(): void;
    /**
     *  First key press handle.
     *  @param {number} key - The key ID pressed
     *  @param {Object} base - The base object to apply with callback
     */
    onKeyPressed(key: number, base?: Object): void;
    /**
     *  Key pressed repeat handle, but with a small wait after the first
     *  pressure (generally used for menus).
     *  @param {number} key - The key ID pressed
     *  @returns {boolean} false if the other keys are blocked after it
     */
    onKeyPressedAndRepeat(key: number): boolean;
    /**
     *  Draw the windows.
     */
    draw(): void;
}
export { WindowChoices, ChoicesOptions };
