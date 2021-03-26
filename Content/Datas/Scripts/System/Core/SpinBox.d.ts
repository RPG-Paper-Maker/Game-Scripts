import { Bitmap } from "./Bitmap.js";
import { WindowBox } from "./WindowBox.js";
/**
 * The class for window boxes.
 * @class
 * @extends {Bitmap}
 */
declare class SpinBox extends Bitmap {
    static DEFAULT_WIDTH: number;
    static DEFAULT_HEIGHT: number;
    windowBox: WindowBox;
    value: number;
    min: number;
    max: number;
    allowLeftRight: boolean;
    active: boolean;
    startTime: number;
    /**
     *  @param {number} x - The x coordinates
     *  @param {number} y - The y coordinates
     */
    constructor(x: number, y: number, { w, h, value, min, max, active, allowLeftRight, times }?: {
        w?: number;
        h?: number;
        value?: number;
        min?: number;
        max?: number;
        active?: boolean;
        allowLeftRight?: boolean;
        times?: boolean;
    });
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
     *  Set the w value.
     *  @param {number} w - The w value
     */
    setW(w: number): void;
    /**
     *  Set the h value.
     *  @param {number} h - The h value
     */
    setH(h: number): void;
    /**
     *  Update active.
     *  @param {boolean} active
     */
    setActive(active: boolean): void;
    /**
     *  Update value.
     *  @param {number} value
     */
    updateValue(value: number): void;
    /**
     *  Update when going down.
     */
    goDown(): void;
    /**
     *  Update when going up.
     */
    goUp(): void;
    /**
     *  Update when going left.
     */
    goLeft(): void;
    /**
     *  Update when going right.
     */
    goRight(): void;
    /**
     *  Key pressed repeat handle, but with a small wait after the first
     *  pressure (generally used for menus).
     *  @param {number} key - The key ID pressed
     *  @returns {boolean} false if the other keys are blocked after it
     */
    onKeyPressedAndRepeat(key: number): boolean;
    /**
     *  Draw the spin box.
     */
    draw(): void;
}
export { SpinBox };
