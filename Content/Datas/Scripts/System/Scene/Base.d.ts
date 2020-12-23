import { Camera, ReactionInterpreter, MapObject } from "../Core/index.js";
import { System } from "../index.js";
/** @class
 *   Abstract class for the game stack.
 *   @param {boolean} [loading=true] Indicate if the scene should load async
 *   stuff
 */
declare class Base {
    reactionInterpreters: ReactionInterpreter[];
    parallelCommands: ReactionInterpreter[];
    loading: boolean;
    camera: Camera;
    constructor(loading?: boolean);
    /**
     *  Load async stuff.
     */
    load(): Promise<void>;
    /**
     *  Update all the reactions interpreters.
     */
    updateInterpreters(): void;
    /**
     *  Update all the parallel commands.
     */
    updateParallelCommands(): void;
    /**
     *  Add a reaction in the interpreter list.
     *  @param {MapObject} sender The sender of this reaction
     *  @param {System.Reaction} reaction The reaction to add
     *  @param {MapObject} object The object reacting
     *  @param {number} state The state ID
     *  @param {System.Parameter[]} parameters All the parameters coming with
     *  this reaction
     *  @param {number[]} event The time events values
     *  @param {boolean} moving Indicate if command is a moving one
     */
    addReaction(sender: MapObject, reaction: System.Reaction, object: MapObject, state: number, parameters: System.DynamicValue[], event: [
        System.Event,
        number
    ], moving?: boolean): ReactionInterpreter;
    /**
     *  Update the scene.
     */
    update(): void;
    /**
     *  Handle scene key pressed.
     *  @param {number} key The key ID
     */
    onKeyPressed(key: number): void;
    /**
     *  Handle scene key released.
     *  @param {number} key The key ID
     */
    onKeyReleased(key: number): void;
    /**
     *  Handle scene pressed repeat key.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeat(key: number): boolean;
    /**
     *  Handle scene pressed and repeat key.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key: number): boolean;
    /**
     *  Draw the 3D scene.
     */
    draw3D(): void;
    /**
     *  Draw the HUD scene.
     */
    drawHUD(): void;
    /**
     *  Close the scene.
     */
    close(): void;
}
export { Base };
