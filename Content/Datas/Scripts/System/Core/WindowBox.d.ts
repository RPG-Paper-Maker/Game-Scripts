import { Bitmap } from "./Bitmap";
import { Graphic } from "..";
/** @class
 *  A class for window boxes.
 *  @extends Bitmap
 *  @param {number} x The x coords
 *  @param {number} y The y coords
 *  @param {number} w The w coords
 *  @param {number} h The h coords
 *  @param {Object} [opts={}] Options
 *  @param {Bitmap} [opts.content=null] Content (containing a draw function) to
 *  display inside the window.
 *  @param {number[]} [opts.padding=[0,0,0,0]] Padding of the box
 *  @param {boolean} [opts.limitContent=true] If checked, the content will be
 *  cut according to padding
 */
declare class WindowBox extends Bitmap {
    static readonly NONE_PADDING: number[];
    static readonly VERY_SMALL_PADDING_BOX: number[];
    static readonly SMALL_PADDING_BOX: number[];
    static readonly MEDIUM_PADDING_BOX: number[];
    static readonly HUGE_PADDING_BOX: number[];
    static readonly DIALOG_PADDING_BOX: number[];
    static readonly SMALL_SLOT_PADDING: number[];
    static readonly SMALL_SLOT_HEIGHT = 30;
    static readonly MEDIUM_SLOT_WIDTH = 200;
    static readonly MEDIUM_SLOT_HEIGHT = 40;
    static readonly LARGE_SLOT_HEIGHT = 60;
    content: Graphic.Base;
    padding: number[];
    limitContent: boolean;
    bordersOpacity: number;
    backgroundOpacity: number;
    selected: boolean;
    bordersVisible: boolean;
    contentDimension: number[];
    windowDimension: number[];
    constructor(x: number, y: number, w: number, h: number, { content, padding, limitContent }?: {
        content?: Graphic.Base;
        padding?: number[];
        limitContent?: boolean;
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
     *  Set the w value.
     *  @param {number} w The w value
     */
    setW(w: number): void;
    /**
     *  Set the h value.
     *  @param {number} h The h value
     */
    setH(h: number): void;
    /**
     *  Update the content and window dimensions.
     */
    updateDimensions(): void;
    /**
     *  Update the content.
     */
    update(): void;
    /**
     *  Draw the window.
     *  @param {boolean} [isChoice=false] Indicate if this window box is used
     *  for a window choices
     *  @param {number[]} [windowDimension = this.windowDimension] Dimensions
     *  of the window
     *  @param {number[]} [contentDimension = this.contentDimension] Dimension
     *  of content
     */
    draw(isChoice?: boolean, windowDimension?: number[], contentDimension?: number[]): void;
}
export { WindowBox };
