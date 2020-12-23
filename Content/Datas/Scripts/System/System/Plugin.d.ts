import { Base } from "./Base";
import { System } from "..";
/** @class
 *  A custom plugin in the game.
 *  @extends System.Base
 *  @param {Record<string, any>} [json=undefined] Json object describing the
 *  plugin
 */
declare class Plugin extends Base {
    name: string;
    isOn: boolean;
    author: string;
    version: string;
    parameters: Record<string, System.DynamicValue>;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the plugin.
     *  @param {Record<string, any>} json Json object describing the plugin
     */
    read(json: Record<string, any>): void;
}
export { Plugin };
