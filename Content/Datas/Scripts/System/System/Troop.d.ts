import { Base } from "./Base.js";
/** @class
 *  A troop of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} [json=undefined] Json object describing the
 *  troop
 */
declare class Troop extends Base {
    list: {
        id: number;
        level: number;
    }[];
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the troop.
     *  @param {Record<string, any>} json Json object describing the troop
     */
    read(json: Record<string, any>): void;
}
export { Troop };
