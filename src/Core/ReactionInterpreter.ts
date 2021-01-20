/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { MapObject, Node } from "./index";
import { Utils, Platform } from "../Common";
import { EventCommand, System, Manager, Scene } from "../index";

/** @class
 *  A reaction command interpreter.
 *  @param {MapObject} sender - Current event sender (null for System events)
 *  @param {System.Reaction} reaction - Current reaction excecuted (only one per 
 *  state)
 *  @param {MapObject} object - Current map object
 *  @param {number} state - Current state of map object reaction
 *  @param {System.DynamicValue[]} parameters - All the parameters coming with 
 *  this reaction
 *  @param {[System.Event, number]} - event The current time events
 *  @param {Node} [command=reaction.getFirstCommand()] - The current command (by 
 *  default the first reaction command)
 */
class ReactionInterpreter {

    public static currentObject: MapObject;
    public static currentParameters: System.DynamicValue[];
    public static currentReaction: ReactionInterpreter;
    public static blockingHero: boolean;

    public currentSender: MapObject;
    public currentReaction: System.Reaction;
    public currentMapObject: MapObject;
    public currentState: number;
    public currentParameters: System.DynamicValue[];
    public currentCommand: Node;
    public currentCommandState: Record<string, any>
    public currentTimeState: [System.Event, number];
    public isInMainMenu: boolean;

    constructor(sender: MapObject, reaction: System.Reaction, object: MapObject, 
        state: number, parameters?: System.DynamicValue[], event?: [System.Event
        , number], command: Node = reaction.getFirstCommand())
    {
        this.currentSender = sender;
        this.currentReaction = reaction;
        this.currentMapObject = object;
        this.currentState = state;
        this.currentParameters = parameters;
        this.currentCommand = command;
        this.updateObjectParameters();
        this.currentCommandState = this.currentCommand.data.initialize();
        this.currentTimeState = event;
        this.isInMainMenu = Manager.Stack.isInMainMenu;
        Manager.Stack.requestPaintHUD = true;
    }

    /** 
     *  Check if the current reaction is finished (no more commands to excecute).
     *  @returns {boolean}
     */
    isFinished(): boolean {
        return (this.currentCommand === null || this.currentCommand.data === null);
    }

    /** 
     *  Check if the command can be executed.
     *  @returns {boolean}
     */
    canExecute(): boolean {
        return this.isInMainMenu || this.isInMainMenu === Manager.Stack
            .isInMainMenu;
    }

    /** 
     *  Update current object and parameters (for variables).
     */
    updateObjectParameters() {
        // Update for getValue() in System.DynamicValue
        ReactionInterpreter.currentObject = this.currentMapObject;
        ReactionInterpreter.currentParameters = this.currentParameters;
    }

    /** 
     *  Update if finished.
     */
    updateFinish() {
        if (this.currentTimeState) {
            this.currentTimeState[1] = new Date().getTime();
        }
        if (this.currentMapObject && this.currentMapObject.movingState !== null) {
            this.currentMapObject.movingState.pause = false;
        }
    }

    /** 
     *  Update the current commands
     */
    update() {
        if (this.isFinished() || Scene.Map.current.loading || !this
            .canExecute())
        {
            return;
        }
        ReactionInterpreter.currentReaction = this;
        let directNode = true;
        let interpreter: ReactionInterpreter, newCommand: Node;
        while (directNode) {
            if (this.currentCommand.data.parallel) {
                interpreter = new ReactionInterpreter(this.currentSender, this
                    .currentReaction, this.currentMapObject, this.currentState,
                    this.currentParameters, this.currentTimeState, this
                    .currentCommand);
                interpreter.currentCommandState.parallel = true;
                Scene.Map.current.parallelCommands.push(interpreter);
            }
            newCommand = this.updateCommand();
            if (newCommand !== this.currentCommand) {
                Manager.Stack.requestPaintHUD = true;
                this.currentCommand = newCommand;
                if (this.currentCommand !== null) {
                    this.currentCommandState = this.currentCommand.data
                        .initialize();
                    directNode = this.currentCommand.data.isDirectNode;
                } else {
                    directNode = false;
                }
            } else {
                directNode = false;
            }
        }
    }

    /** 
     *  Update a command and return the next command to excecute (if finished)
     *  @returns {Node}
     */
    updateCommand(): Node {
        if (Scene.Map.current.loading) {
            return this.currentCommand;
        }
        this.updateObjectParameters();

        // Update can return different type of values
        let result = this.currentCommand.data.update(this.currentCommandState,
            this.currentMapObject, this.currentState);
        let value = null;

        // If the value is a string, then it can only be a label call
        if (Utils.isString(result)) {
            let tab: [System.DynamicValue, Node];
            for (let i = 0, l = this.currentReaction.labels.length; i < l; i++) {
                tab = this.currentReaction.labels[i];
                if (result === tab[0].getValue()) {
                    value = tab[1].next;
                }
            }
        } else { /* Else, that means it's a number which represents the number 
            of nodes to skip */
            // If entering in a node
            if (result === -1) {
                if (this.currentCommand.firstChild === null) {
                    return this.endOfBlock(new Node(this.currentCommand, null),
                        null);
                } else {
                    value = this.currentCommand.firstChild;
                }
            } else if (result === -2) { // If leaving last while node
                let whileNode = this.currentCommand.parent;
                while (whileNode !== null) {
                    if (whileNode.data instanceof EventCommand.While) {
                        return this.goToNextCommand(whileNode);
                    }
                    whileNode = whileNode.parent;
                }
                /* If going here, that means there is no parent while...
                bring error */
                Platform.showErrorMessage("Error: there is a breaking loop that is not inside a loop.");
            } else if (result === -3) { // If stopping the reaction
                return null;
            } else { // If positive number, then it's the number of nodes to skip
                value = this.currentCommand;
                for (let j = 1; j <= result; j++) {
                    value = value.next;
                }
            }
        }
        return this.endOfBlock(this.currentCommand, value);
    }

    /** 
     *  Update a command that corresponds to the end of a block and return the
     *  next command to excecute (if finished).
     *  @param {Node} command - The command before updating
     *  @param {Node} value - The next command after updating
     *  @returns {Node}
     */
    endOfBlock(command: Node, value: Node): Node {
        if (value === null) {
            if (command.parent.parent === null) { // If end of the event
                return null;
            } else { // Else, it's only the end of a bloc of instructions
                // If while...
                if (command.parent.data instanceof EventCommand.While) {
                    return command.parent; // Redo the while command
                } else if (command.parent.data instanceof EventCommand.Choice) {
                    // If choice, search end choice command
                    let next = command.parent;
                    while (next.data !== null) {
                        next = next.next;
                    }
                    next = next.next;
                    return next;
                } else {
                    /* If condition, or other instruction bloc, leave it
                    and go to next command */
                    return this.goToNextCommand(command.parent);
                }
            }
        }
        return value;
    }

    /**
     *  After the end of a block, go to the next command.
     *  @param {Node} command - The command before updating
     *  @returns {Node}
     */
    goToNextCommand(node: Node): Node {
        let value = node;
        for (let i = 1, l = node.data.goToNextCommand(); i <= l; i++) {
            value = value.next;
        }
        return this.endOfBlock(node, value);
    }

    /** 
     *  First key press handle for the current command
     *  @param {number} key - The key ID pressed
     */
    onKeyPressed(key: number) {
        if (!this.isFinished() && (!Scene.Map.current.loading && this
            .canExecute()))
        {
            this.currentCommand.data.onKeyPressed(this.currentCommandState, key);
        }
    }

    /** 
     *  First key release handle for the current command.
     *  @param {number} key - The key ID released
     */
    onKeyReleased(key: number) {
        if (!this.isFinished() && (!Scene.Map.current.loading && this
            .canExecute()))
        {
            this.currentCommand.data.onKeyReleased(this.currentCommandState, key);
        }
    }

    /** 
     *  Key pressed repeat handle for the current command.
     *  @param {number} key - The key ID pressed
     *  @returns {boolean} false if the other keys are blocked after it
     */
    onKeyPressedRepeat(key: number): boolean {
        if (!this.isFinished() && (!Scene.Map.current.loading && this
            .canExecute()))
        {
            return this.currentCommand.data.onKeyPressedRepeat(this
                .currentCommandState, key);
        }
        return true;
    }

    /** 
     *  Key pressed repeat handle for the current command, but with a small 
     *  wait after the first pressure (generally used for menus).
     *  @param {number} key - The key ID pressed
     *  @returns {boolean} false if the other keys are blocked after it
    */
    onKeyPressedAndRepeat(key: number): boolean {
        if (!this.isFinished() && (!Scene.Map.current.loading && this
            .canExecute()))
        {
            return this.currentCommand.data.onKeyPressedAndRepeat(this
                .currentCommandState, key);
        }
        return true;
    }

    /**
     *  Draw HUD for the current command
     */
    drawHUD() {
        this.currentCommand.data.drawHUD(this.currentCommandState);
    }
}

export { ReactionInterpreter }