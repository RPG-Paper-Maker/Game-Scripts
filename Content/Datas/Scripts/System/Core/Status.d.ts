import { System } from "../index.js";
import { Picture2D } from "./Picture2D.js";
/** @class
 *  A status affected to a player.
 *  @param {number} id - The ID of the status
 */
declare class Status {
    system: System.Status;
    turn: number;
    picture: Picture2D;
    constructor(id: number, turn?: number);
    /**
     *  Draw the status on top of battler.
     *  @param {number} x - The x position
     *  @param {number} y - The y position
     */
    drawBattler(x: number, y: number): void;
}
export { Status };
