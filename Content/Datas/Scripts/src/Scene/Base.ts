/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Camera, Node, ReactionInterpreter, MapObject } from "../Core";
import { Manager, System } from "..";
import { Utils } from "../Common";

/** @class
 *   Abstract class for the game stack.
 *   @param {boolean} [loading=true] Indicate if the scene should load async
 *   stuff
 */
class Base {
    
    public reactionInterpreters: ReactionInterpreter[];
    public parallelCommands: ReactionInterpreter[];
    public loading: boolean;
    public camera: Camera;

    constructor(loading = true) {
        this.reactionInterpreters = new Array;
        this.parallelCommands = new Array;
        if (loading) {
            this.loading = true;
            Utils.tryCatch(this.load, this);
        }
    }

    /** 
     *  Load async stuff.
     */
    async load() {
        this.loading = false;
    }

    /** 
     *  Update all the reactions interpreters.
     */
    updateInterpreters() {
        // Index of all the finished parallel reactions
        let endingReactions = new Array;

        // Updating blocking hero
        ReactionInterpreter.blockingHero = false;
        let i: number, l: number;
        for (i = 0, l = this.reactionInterpreters.length; i < l; i++) {
            if (this.reactionInterpreters[i].currentReaction.blockingHero) {
                ReactionInterpreter.blockingHero = true;
                break;
            }
        }

        // Updating all reactions
        let interpreter: ReactionInterpreter;
        for (i = 0, l = this.reactionInterpreters.length; i < l; i++) {
            interpreter = this.reactionInterpreters[i];
            interpreter.update();
            if (interpreter.isFinished()) {
                interpreter.updateFinish();
                endingReactions.push(i);
            }
            // If changed map, STOP
            if (!Manager.Stack.currentMap || Manager.Stack.currentMap.loading) {
                return;
            }
        }

        // Deleting finished reactions
        for (i = endingReactions.length - 1; i >= 0; i--) {
            this.reactionInterpreters.splice(endingReactions[i], 1);
        }
    }

    /** 
     *  Update all the parallel commands.
     */
    updateParallelCommands() {
        let endingCommands = new Array; // Index of all the finished commands
        let i: number, l: number, previousCommand: Node, command: Node;
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
    addReaction(sender: MapObject, reaction: System.Reaction, object: MapObject, 
        state: number, parameters: System.DynamicValue[], event: [System.Event, 
        number], moving: boolean = false): ReactionInterpreter
    {
        if (reaction.getFirstCommand() !== null) {
            let excecuted = false;
            let reactionInterpreter: ReactionInterpreter;
            for (let i = 0, l = this.reactionInterpreters.length; i < l; i++) {
                reactionInterpreter = this.reactionInterpreters[i];
                if (reactionInterpreter.currentMapObject === object &&
                    reactionInterpreter.currentReaction === reaction) {
                    excecuted = true;
                    break;
                }
            }
            if (!excecuted) {
                reactionInterpreter = new ReactionInterpreter(sender, reaction,
                    object, state, parameters, event);
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
     *  Update the scene.
     */
    update() {
        // Parallel reactions
        Base.prototype.updateInterpreters.call(this);

        // Parallel comands
        Base.prototype.updateParallelCommands.call(this);
    }

    /** 
     *  Handle scene key pressed.
     *  @param {number} key The key ID
     */
    onKeyPressed(key: number) {
        for (let i = 0, l = this.reactionInterpreters.length; i < l; i++) {
            this.reactionInterpreters[i].onKeyPressed(key);
        }
    }

    /** 
     *  Handle scene key released.
     *  @param {number} key The key ID
     */
    onKeyReleased(key: number) {
        for (let i = 0, l = this.reactionInterpreters.length; i < l; i++) {
            this.reactionInterpreters[i].onKeyReleased(key);
        }
    }

    /** 
     *  Handle scene pressed repeat key.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeat(key: number): boolean {
        for (let i = 0, l = this.reactionInterpreters.length; i < l; i++) {
            this.reactionInterpreters[i].onKeyPressedRepeat(key);
        }
        return true;
    }

    /** 
     *  Handle scene pressed and repeat key.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key: number): boolean {
        for (let i = 0, l = this.reactionInterpreters.length; i < l; i++) {
            this.reactionInterpreters[i].onKeyPressedAndRepeat(key);
        }
        return true;
    }

    /** 
     *  Draw the 3D scene.
     */
    draw3D() {

    }

    /** 
     *  Draw the HUD scene.
     */
    drawHUD() {
        let i: number, l: number;
        for (i = 0, l = this.reactionInterpreters.length; i < l; i++) {
            this.reactionInterpreters[i].drawHUD();
        }
        for (i = 0, l = this.parallelCommands.length; i < l; i++) {
            this.parallelCommands[i].drawHUD();
        }
    }

    /** 
     *  Close the scene.
     */
    close() {

    }
}

export { Base }