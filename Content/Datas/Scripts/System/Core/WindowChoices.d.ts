import { Bitmap } from "./Bitmap";
import { Enum } from "../Common";
import OrientationWindow = Enum.OrientationWindow;
import { Graphic } from "..";
import { WindowBox } from "./WindowBox";
/** @class
 *  A class for window choices.
 *  @extends Bitmap
 *  @param {number} x The x coords
 *  @param {number} y The y coords
 *  @param {number} w The w coords
 *  @param {number} h The h coords
 *  @param {Object[]} listContents List of all the contents to display
 *  @param {Object} [opts={}] Options
 *  @param {function[]} [opts.listCallbacks=null] List of all the callback
 *  functions to excecute when pressed.
 *  @param {OrientationWindow} [opts.orientation=OrientationWindow.Vertical] The
 *  orientation of the window (horizontal or vertical)
 *  @param {number} [opts.nbItemsMax = listContents.length] Max number of items
 *  to display on the choice box
 *  @param {number[]} [opts.padding=RPM.SMALL_SLOT_PADDING] Padding of the box
 *  @param {number} [opts.space=0] Space between each choice in the box
 *  @param {number} [opts.currentSelectedIndex=0] The current selected index
 *  position in the choice box
 *  @param {boolean} [opts.bordersInsideVisible=true] If checked, each choice
 *  will have an individual window box
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
    constructor(x: number, y: number, w: number, h: number, listContents: any, { listCallbacks, orientation, nbItemsMax, padding, space, currentSelectedIndex, bordersInsideVisible }?: {
        listCallbacks?: Function[];
        orientation?: OrientationWindow;
        nbItemsMax?: number;
        padding?: number[];
        space?: number;
        currentSelectedIndex?: number;
        bordersInsideVisible?: boolean;
    });
    /**
     *  Set the x value.
     *  @param {number} x The x value
     */
    setX(x: number): void;
    /**
     *  Set the y value.
     *  @param {number} y The y value
     */
    setY(y: number): void;
    /**
     *  Get the content at a specific index.
     *  @param {number} i The index
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
     *  @param {number} [currentSelectedIndex=0] The current selected index
     *  position
     */
    updateContentSize(currentSelectedIndex?: number): void;
    /**
     *  Set the content at a specific index.
     *  @param {number} i The index
     *  @param {Graphic.Base} content The new content
     */
    setContent(i: number, content: Graphic.Base): void;
    /**
     *  Set all the graphic contents.
     *  @param {Graphic.Base[]} contents All the contents
     */
    setContents(contents: Graphic.Base[]): void;
    /**
     *  Set all the callbacks for each choice.
     *  @param {Function[]} callbacks All the callbacks functions
     */
    setCallbacks(callbacks: Function[]): void;
    /**
     *  Set all the contents and callbacks.
     *  @param {Graphic.Base[]} contents All the contents
     *  @param {function[]} [callbacks=null] All the callbacks functions
     *  @param {number} [currentSelectedIndex=0] The current selected index
     *  position
     */
    setContentsCallbacks(contents: Graphic.Base[], callbacks?: Function[], currentSelectedIndex?: number): void;
    /**
     *  Unselect a choice.
     */
    unselect(): void;
    /**
     *  Select a choice.
     *  @param {number} i The index of the choice
     */
    select(i: number): void;
    /**
     *  Select the current choice.
     */
    selectCurrent(): void;
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
     *  @param {number} key The key ID pressed
     *  @param {Object} base The base object to apply with callback
     */
    onKeyPressed(key: number, base?: Object): void;
    /**
     *  Key pressed repeat handle, but with a small wait after the first
     *  pressure (generally used for menus).
     *  @param {number} key The key ID pressed
     *  @returns {boolean} false if the other keys are blocked after it
     */
    onKeyPressedAndRepeat(key: number): boolean;
    /**
     *  Draw the windows.
     */
    draw(): void;
}
export { WindowChoices };
