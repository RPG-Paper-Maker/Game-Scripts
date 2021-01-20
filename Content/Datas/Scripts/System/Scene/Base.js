/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { ReactionInterpreter } from "../Core/index.js";
import { Scene } from "../index.js";
import { Utils } from "../Common/index.js";
/**
 * The superclass who shape the structure of a scene.
 *
 * @abstract
 * @class Base
 */
class Base {
    /**
     * @param {boolean} [loading - = true] tell whether or not the scene is loading asynchronosively.
     */
    constructor(loading = true) {
        this.reactionInterpreters = new Array;
        this.parallelCommands = new Array;
        if (loading) {
            this.loading = true;
            Utils.tryCatch(this.load, this);
        }
        this.create();
    }
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
    create() { }
    ;
    /**
     * Load the scene asynchronous contents.
     * @example
     * // Load an the titlescreen background into the scene.
     *  const picture = await Picture2D.createWithID(null,null,null);
     *
     * @async
     * @memberof Base
     */
    async load() {
        this.loading = false;
    }
    /**
     * Update all the reaction interpreters from the scenes.
     *
     * @memberof Base
     */
    updateInterpreters() {
        // Index of all the finished parallel reactions
        let endingReactions = new Array;
        // Updating blocking hero
        ReactionInterpreter.blockingHero = false;
        let i, l;
        for (i = 0, l = this.reactionInterpreters.length; i < l; i++) {
            if (this.reactionInterpreters[i].currentReaction.blockingHero) {
                ReactionInterpreter.blockingHero = true;
                break;
            }
        }
        // Updating all reactions
        let interpreter;
        for (i = 0, l = this.reactionInterpreters.length; i < l; i++) {
            interpreter = this.reactionInterpreters[i];
            interpreter.update();
            if (interpreter.isFinished()) {
                interpreter.updateFinish();
                endingReactions.push(i);
            }
            // If changed map, STOP
            if (!Scene.Map.current || Scene.Map.current.loading) {
                return;
            }
        }
        // Deleting finished reactions
        for (i = endingReactions.length - 1; i >= 0; i--) {
            this.reactionInterpreters.splice(endingReactions[i], 1);
        }
    }
    /**
     * Update all the parallel commands from the scenes.
     *
     * @memberof Base
     */
    updateParallelCommands() {
        let endingCommands = new Array; // Index of all the finished commands
        let i, l, previousCommand, command;
        for (i = 0, l = this.parallelCommands.length; i < l; i++) {
            previousCommand = this.parallelCommands[i].currentCommand;
            command = this.parallelCommands[i].updateCommand();
            if (previousCommand !== command) {
                endingCommands.push(i);
            }
        }
        for (i = endingCommands.length - 1; i >= 0; i--) {
            this.parallelCommands.splice(endingCommands[i], 1);
        }
    }
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
    addReaction(sender, reaction, object, state, parameters, event, moving = false) {
        if (reaction.getFirstCommand() !== null) {
            let excecuted = false;
            let reactionInterpreter;
            for (let i = 0, l = this.reactionInterpreters.length; i < l; i++) {
                reactionInterpreter = this.reactionInterpreters[i];
                if (reactionInterpreter.currentMapObject === object &&
                    reactionInterpreter.currentReaction === reaction) {
                    excecuted = true;
                    break;
                }
            }
            if (!excecuted) {
                reactionInterpreter = new ReactionInterpreter(sender, reaction, object, state, parameters, event);
                this.reactionInterpreters.push(reactionInterpreter);
                if (!moving) {
                    if (object.movingState !== null) {
                        object.movingState.pause = true;
                    }
                }
                return reactionInterpreter;
            }
        }
        return null;
    }
    /**
     * Update the scene.
     *
     * @memberof Base
     */
    update() {
        // Parallel reactions
        this.updateInterpreters.call(this);
        //Base.prototype.updateInterpreters.call(this);
        // Parallel commands
        this.updateParallelCommands.call(this);
        // Base.prototype.updateParallelCommands.call(this);
    }
    /**
     * Handle the scene reactions when a key is pressed.
     *
     * @param {number} key - the key ID
     * @memberof Base
     */
    onKeyPressed(key) {
        for (let i = 0, l = this.reactionInterpreters.length; i < l; i++) {
            this.reactionInterpreters[i].onKeyPressed(key);
        }
    }
    /**
     * Handle the scene reactions when a key is released.
     *
     * @param {number} key - the key ID
     * @memberof Base
     */
    onKeyReleased(key) {
        for (let i = 0, l = this.reactionInterpreters.length; i < l; i++) {
            this.reactionInterpreters[i].onKeyReleased(key);
        }
    }
    /**
     * Handle the scene reactions when a key is repeated
     *
     * @param {number} key - The key ID
     * @return {*}  {boolean}
     * @memberof Base
     */
    onKeyPressedRepeat(key) {
        for (let i = 0, l = this.reactionInterpreters.length; i < l; i++) {
            this.reactionInterpreters[i].onKeyPressedRepeat(key);
        }
        return true;
    }
    /**
     * Handle scene reactions when a key is pressed and repeated
     *
     * @param {number} key
     * @return {*}  {boolean}
     * @memberof Base
     */
    onKeyPressedAndRepeat(key) {
        for (let i = 0, l = this.reactionInterpreters.length; i < l; i++) {
            this.reactionInterpreters[i].onKeyPressedAndRepeat(key);
        }
        return true;
    }
    /**
     * Draw the contents in the 3D scene.
     *
     * @memberof Base
     */
    draw3D() {
    }
    /**
     * Draw the HUD contents on the scene.
     *
     * @memberof Base
     */
    drawHUD() {
        let i, l;
        for (i = 0, l = this.reactionInterpreters.length; i < l; i++) {
            this.reactionInterpreters[i].drawHUD();
        }
        for (i = 0, l = this.parallelCommands.length; i < l; i++) {
            this.parallelCommands[i].drawHUD();
        }
    }
    /**
     * Close the scene.
     *
     * @memberof Base
     */
    close() {
    }
}
export { Base };
