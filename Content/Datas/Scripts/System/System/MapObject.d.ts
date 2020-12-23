import { Base } from "./Base.js";
import { System } from "../index.js";
/** @class
 *  An object in the map.
 *  @extends System.Base
 *  @param {Record<string, any>} [json=undefined] Json object describing the
 *  object
 */
declare class MapObject extends Base {
    id: number;
    name: number;
    isEventFrame: boolean;
    states: System.State[];
    properties: System.Property[];
    events: Record<number, System.Event[]>;
    timeEvents: System.Event[];
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the object
     *  @param {Record<string, any>} json Json object describing the object
     */
    read(json: Record<string, any>): void;
    /**
     *  Get all the time events.
     *  @returns {System.Event[]}
     */
    getTimeEvents(): System.Event[];
    /**
     *  Get the reactions corresponding to a given event and parameters.
     *  @param {boolean} isSystem Boolean indicating if it is an event System
     *  @param {number} idEvent ID of the event
     *  @param {number} state The ID of the state
     *  @param {System.DynamicValue[]} parameters List of all the parameters
     *  @returns {System.Reaction[]}
     */
    getReactions(isSystem: boolean, idEvent: number, state: number, parameters: System.DynamicValue[]): System.Reaction[];
}
export { MapObject };
