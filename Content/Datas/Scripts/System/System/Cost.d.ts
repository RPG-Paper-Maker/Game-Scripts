import { Base } from "./Base.js";
import { DynamicValue } from "./DynamicValue.js";
import { StructIterator } from "../EventCommand/index.js";
/** @class
 *  A cost of a common skill item.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  cost
 */
declare class Cost extends Base {
    kind: number;
    statisticID: DynamicValue;
    currencyID: DynamicValue;
    variableID: number;
    valueFormula: DynamicValue;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the cost.
     *  @param {Record<string, any>} - json Json object describing the cost
     */
    read(json: Record<string, any>): void;
    parse(command: any[], iterator: StructIterator): void;
    /**
     *  Use the cost.
     */
    use(): void;
    /**
     *  Check if the cost is possible.
     *  @returns {boolean}
     */
    isPossible(): boolean;
    /**
     *  Get the string representing the cost.
     *  @returns {string}
     */
    toString(): string;
}
export { Cost };
