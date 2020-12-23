import { Base } from "./Base";
import { System } from "..";
import { Enum } from "../Common";
import CommandMoveKind = Enum.CommandMoveKind;
import Orientation = Enum.Orientation;
import { MapObject } from "../Core";
/** @class
 *  An event command for moving object.
 *  @extends EventCommand.Base
 *  @param {any[]} command Direct JSON command to parse
 */
declare class MoveObject extends Base {
    objectID: System.DynamicValue;
    isIgnore: boolean;
    isWaitEnd: boolean;
    isCameraOrientation: boolean;
    moves: Function[];
    parameters: Record<string, any>[];
    kind: CommandMoveKind;
    constructor(command: any[]);
    /**
     *  Get the opposite orientation.
     *  @static
     *  @param {Orientation} orientation The orientation
     *  @returns {Orientation} The current state
     */
    static oppositeOrientation(orientation: Orientation): Orientation;
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize(): Record<string, any>;
    /**
     *  Function to move north.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The object to move
     *  @param {bool} square Indicate if it is a square move
     *  @param {Orientation} orientation The orientation where to move
     *  @returns {boolean}
     */
    move(currentState: Record<string, any>, object: MapObject, square: boolean, orientation: Orientation): boolean;
    /**
     *  Change the frequency tick of the object.
     *  @param {MapObject} object The object to move
     */
    moveFrequency(object: MapObject): void;
    /**
     *  Function to move north.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The object to move
     *  @param {Record<string, any>} parameters The parameters
     *  @returns {Orientation}
     */
    moveNorth(currentState: Record<string, any>, object: MapObject, parameters: Record<string, any>): Orientation | boolean;
    /**
     *  Function to move south.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The object to move
     *  @param {Record<string, any>} parameters The parameters
     *  @returns {Orientation}
     */
    moveSouth(currentState: Record<string, any>, object: MapObject, parameters: Record<string, any>): Orientation | boolean;
    /**
     *  Function to move west.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The object to move
     *  @param {Record<string, any>} parameters The parameters
     *  @returns {Orientation}
    */
    moveWest(currentState: Record<string, any>, object: MapObject, parameters: Record<string, any>): Orientation | boolean;
    /**
     *  Function to move east.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The object to move
     *  @param {Record<string, any>} parameters The parameters
     *  @returns {Orientation}
     */
    moveEast(currentState: Record<string, any>, object: MapObject, parameters: Record<string, any>): Orientation | boolean;
    /**
     *  Function to move north west.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The object to move
     *  @param {Record<string, any>} parameters The parameters
     *  @returns {Orientation}
     */
    moveNorthWest(currentState: Record<string, any>, object: MapObject, parameters: Record<string, any>): Orientation | boolean;
    /**
     *  Function to move north west.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The object to move
     *  @param {Record<string, any>} parameters The parameters
     *  @returns {Orientation}
     */
    moveNorthEast(currentState: Record<string, any>, object: MapObject, parameters: Record<string, any>): Orientation | boolean;
    /**
     *  Function to move north west.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The object to move
     *  @param {Record<string, any>} parameters The parameters
     *  @returns {Orientation}
     */
    moveSouthWest(currentState: Record<string, any>, object: MapObject, parameters: Record<string, any>): Orientation | boolean;
    /**
     *  Function to move north west.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The object to move
     *  @param {Record<string, any>} parameters The parameters
     *  @returns {Orientation}
    */
    moveSouthEast(currentState: Record<string, any>, object: MapObject, parameters: Record<string, any>): Orientation | boolean;
    /**
     *  Function to move random.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The object to move
     *  @param {Record<string, any>} parameters The parameters
     *  @returns {Orientation}
     */
    moveRandom(currentState: Record<string, any>, object: MapObject, parameters: Record<string, any>): Orientation | boolean;
    /**
     *  Function to move hero.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The object to move
     *  @param {Record<string, any>} parameters The parameters
     *  @returns {Orientation}
    */
    moveHero(currentState: Record<string, any>, object: MapObject, parameters: Record<string, any>): Orientation | boolean;
    /**
     *  Function to move opposite to hero.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The object to move
     *  @param {Record<string, any>} parameters The parameters
     *  @returns {Orientation}
    */
    moveOppositeHero(currentState: Record<string, any>, object: MapObject, parameters: Record<string, any>): Orientation | boolean;
    /**
     *  Function to move hero and opposite hero.
     *  @param {Object} currentState The current state of the event
     *  @param {MapObject} object The object to move
     *  @param {Object} parameters The parameters
     *  @param {boolean} opposite Indicate if opposite
     *  @returns {Orientation}
    */
    moveHeroAndOpposite(currentState: Record<string, any>, object: MapObject, parameters: Record<string, any>, opposite: boolean): Orientation | boolean;
    /**
     *  Function to move front.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The object to move
     *  @param {Record<string, any>} parameters The parameters
     *  @returns {Orientation}
    */
    moveFront(currentState: Record<string, any>, object: MapObject, parameters: Record<string, any>): Orientation | boolean;
    /**
     *  Function to move back.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The object to move
     *  @param {Record<string, any>} parameters The parameters
     *  @returns {Orientation}
    */
    moveBack(currentState: Record<string, any>, object: MapObject, parameters: Record<string, any>): Orientation | boolean;
    /**
     *  Function to change graphics.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The object to move
     *  @param {Record<string, any>} parameters The parameters
    */
    changeGraphics(currentState: Record<string, any>, object: MapObject, parameters: Record<string, any>): Orientation | boolean;
    /**
     *  Get the hero orientation.
     *  @param {MapObject} object The object to move
     *  @returns {Orientation}
    */
    getHeroOrientation(object: MapObject): Orientation;
    /**
     *  Get the current orientation.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @returns {Orientation}
     */
    getCurrentOrientation(currentState: Record<string, any>): Orientation;
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The current object reacting
     *  @param {number} state The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState: Record<string, any>, object: MapObject, state: number): number;
}
export { MoveObject };
