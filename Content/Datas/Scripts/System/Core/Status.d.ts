import { System } from "../index.js";
import { Enum } from "../Common/index.js";
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
    static getMessage(message: System.DynamicValue, target: string): string;
    static drawList(statusList: Status[], x: number, y: number, align?: Enum.Align): void;
    getMessageAllyAffected(target: string): string;
    getMessageEnemyAffected(target: string): string;
    getMessageHealed(target: string): string;
    /**
     *  Draw the status on top of battler.
     *  @param {number} x - The x position
     *  @param {number} y - The y position
     */
    draw(x: number, y: number): void;
}
export { Status };
