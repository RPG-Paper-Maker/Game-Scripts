import { Camera, ReactionInterpreter, MapObject } from "../Core/index.js";
import { System } from "../index.js";
/**
 * The superclass who shape the structure of a scene.
 *
 * @abstract
 * @class Base
 */
declare abstract class Base {
    /**
     * An array of reaction interpreters.
     *
     * @type {ReactionInterpreter[]}
     * @memberof Base
     */
    reactionInterpreters: ReactionInterpreter[];
    /**
     * An array of reaction interpreters caused by effects.
     *
     * @type {ReactionInterpreter[]}
     * @memberof Base
     */
    reactionInterpretersEffects: ReactionInterpreter[];
    /**
     * the array holding parallel commands.
     *
     * @type {ReactionInterpreter[]}
     * @memberof Base
     */
    parallelCommands: ReactionInterpreter[];
    /**
     * the async loading flag.
     *
     * @type {boolean}
     * @memberof Base
     */
    loading: boolean;
    /**
     * The scene camera.
     *
     * @type {Camera}
     * @memberof Base
     */
    camera: Camera;
    /**
     * @param {boolean} [loading - = true] tell whether or not the scene is loading asynchronosively.
     */
    constructor(loading?: boolean, ...args: any);
    initialize(...args: any): void;
    /**
     * assign and create all the contents of the scene synchronously.
     *
     * @example
     * create(){
     *   super.create();
     *   this.createAllWindows();
     * }
     * @memberof Base
     */
    create(): void;
    /**
     * Load the scene asynchronous contents.
     * @example
     * // Load an the titlescreen background into the scene.
     *  const picture = await Picture2D.createWithID(null,null,null);
     *
     * @async
     * @memberof Base
     */
    load(): Promise<void>;
    /**
     * Update all the reaction interpreters from the scenes.
     *
     * @memberof Base
     */
    updateInterpreters(): void;
    /**
     * Update all the parallel commands from the scenes.
     *
     * @memberof Base
     */
    updateParallelCommands(): void;
    /**
     * Add a reaction in the interpreter list.
     *
     * @param {MapObject} sender - The reaction sender
     * @param {System.Reaction} reaction - The reaction to add
     * @param {MapObject} object - The object reacting
     * @param {number} state - the state ID
     * @param {System.DynamicValue[]} parameters - All the parameters coming with this reaction
     * @param {[System.Event, number]} - event the time events values
     * @param {boolean} [moving=false] - indicate if the command is of type moving.
     * @return {*}  {ReactionInterpreter}
     *
     * @memberof Base
     */
    addReaction(sender: MapObject, reaction: System.Reaction, object: MapObject, state: number, parameters: System.DynamicValue[], event: [System.Event, number], moving?: boolean): ReactionInterpreter;
    /**
     * Update the scene.
     *
     * @memberof Base
     */
    update(): void;
    /**
     * Handle the scene reactions when a key is pressed.
     *
     * @param {number} key - the key ID
     * @memberof Base
     */
    onKeyPressed(key: number): void;
    /**
     * Handle the scene reactions when a key is released.
     *
     * @param {number} key - the key ID
     * @memberof Base
     */
    onKeyReleased(key: number): void;
    /**
     * Handle the scene reactions when a key is repeated
     *
     * @param {number} key - The key ID
     * @return {*}  {boolean}
     * @memberof Base
     */
    onKeyPressedRepeat(key: number): boolean;
    /**
     * Handle scene reactions when a key is pressed and repeated
     *
     * @param {number} key
     * @return {*}  {boolean}
     * @memberof Base
     */
    onKeyPressedAndRepeat(key: number): boolean;
    /**
     * Draw the contents in the 3D scene.
     *
     * @memberof Base
     */
    draw3D(): void;
    /**
     * Draw the HUD contents on the scene.
     *
     * @memberof Base
     */
    drawHUD(): void;
    /**
     * Close the scene.
     *
     * @memberof Base
     */
    close(): void;
}
export { Base };
