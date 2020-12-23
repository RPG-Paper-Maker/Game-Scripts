import { Base } from "./Base";
import { System } from "..";
/** @class
 *  An event command for label.
 *  @extends EventCommand.Base
 *  @param {any[]} command Direct JSON command to parse
 */
declare class Label extends Base {
    name: System.DynamicValue;
    constructor(command: any[]);
}
export { Label };
