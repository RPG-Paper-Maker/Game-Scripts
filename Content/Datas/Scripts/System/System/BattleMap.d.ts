import { Base } from "./Base.js";
import { Position } from "../Core/index.js";
/** @class
 *  A battle map of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} [json=undefined] Json object describing the
 *  battle map
 */
declare class BattleMap extends Base {
    idMap: number;
    position: Position;
    constructor(json?: Record<string, any>);
    /**
     *  Create a System battle map.
     *  @static
     *  @param {number} idMap The map ID
     *  @param {number[]} position The json position
     *  @returns {System.BattleMap}
     */
    static create(idMap: number, position: number[]): BattleMap;
    /**
     *  Read the JSON associated to the battle map.
     *  @param {Record<string, any>} json Json object describing the battle map
     */
    read(json: Record<string, any>): void;
}
export { BattleMap };
