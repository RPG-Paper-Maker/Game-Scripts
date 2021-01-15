/** @class
 *  A frame for updating animations (characters, battlers, etc.).
 *  @param {number} duration - The frame duration
 *  @param {number} [tick=0] - The frame tick (= time spent since current frame)
 *  @param {number} [value=0] - The current frame value
 */
declare class Frame {
    duration: number;
    tick: number;
    value: number;
    constructor(duration: number, tick?: number, value?: number);
    /**
     *  Update frame according to tick and duration, return true if frame is
     *  different.
     *  @param {number} [duration=this.duration] - The frame duration
     *  @returns {boolean}
     */
    update(duration?: number): boolean;
}
export { Frame };