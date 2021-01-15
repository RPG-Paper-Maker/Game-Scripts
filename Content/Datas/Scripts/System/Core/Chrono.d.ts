/** @class
 *  A chrono in the game.
 *  @param {number} start - The start time of the chrono (in milliseconds)
 */
declare class Chrono {
    time: number;
    lastTime: number;
    constructor(start?: number);
    /**
     *  Get time time in seconds.
     *  @returns {number}
     */
    getSeconds(): number;
    /**
     *  Update the chrono
     */
    update(): void;
}
export { Chrono };
