/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { MapObject } from "../Core";

/** @class
*   A reaction command interpreter
*   @property {MapObject} currentSender Current event sender (null for System
*   events)
*   @property {SystemReaction} currentReaction Current reaction excecuted (only
*   one per state)
*   @property {MapObject} currentMapObject Current map object
*   @property {number} currentState Current state of map object reaction
*   @property {Parameter[]} currentParameters All the parameters coming
*   with this reaction
*   @property {Node} currentCommand A node of a command reaction
*   @property {Object} currentCommandState Current state of the current command
*   @property {number[]} currentTimeState The current time events
*   @property {boolean} isInMainMenu Indicate if this reaction was executed in 
*   main menu
*   @param {MapObject} sender Current event sender (null for System events)
*   @param {SystemReaction} reaction Current reaction excecuted (only one per 
*   state)
*   @param {MapObject} object Current map object
*   @param {number} state Current state of map object reaction
*   @param {Parameter[]} parameters All the parameters coming with this
*   reaction
*   @param {number[]} event The current time events
*   @param {EventCommand} [command=reaction.getFirstCommand()] The current 
*   command (by default the first reaction command)
*/
class EventReaction
{
    public static currentObject: MapObject;
    public static currentParameters: any;

    constructor(sender, reaction, object, state, parameters, event, command = 
        reaction.getFirstCommand())
    {
        /*
        this.currentSender = sender;
        this.currentReaction = reaction;
        this.currentMapObject = object;
        this.currentState = state;
        this.currentParameters = parameters;
        this.currentCommand = command;
        this.updateObjectParameters();
        this.currentCommandState = this.currentCommand.data.initialize();
        this.currentTimeState = event;
        this.isInMainMenu = RPM.isInMainMenu;
        RPM.requestPaintHUD = true;*/
    }

    // -------------------------------------------------------
    /** Check if the current reaction is finished (no more commands to
    *   excecute)
    *   @returns {boolean}
    */
    isFinished()
    {
        //return (this.currentCommand === null)
    }

    // -------------------------------------------------------
    /** Check if the command can be executed
    *   @returns {boolean}
    */
    canExecute()
    {
        //return this.isInMainMenu || this.isInMainMenu === RPM.isInMainMenu;
    }

    // -------------------------------------------------------
    /** Update current object and parameters (for variables)
    */
    updateObjectParameters()
    {
        /*
        // Update global variables for getValue()
        RPM.currentObject = this.currentMapObject;
        RPM.currentParameters = this.currentParameters;
        */
    }

    // -------------------------------------------------------
    /** Update if finished
    */
    updateFinish()
    {
        /*
        if (this.currentTimeState)
        {
            this.currentTimeState[1] = new Date().getTime();
        }
        if (this.currentMapObject && this.currentMapObject.movingState !== null)
        {
            this.currentMapObject.movingState.pause = false;
        }
        */
    }

    // -------------------------------------------------------
    /** Update the current commands
    */
    update()
    {
        /*
        if (this.isFinished() || RPM.currentMap.loading || !this.canExecute())
        {
            return;
        }
        RPM.currentReaction = this;
        let directNode = true;
        let interpreter, newCommand;
        while (directNode)
        {
            if (this.currentCommand.data.parallel)
            {
                interpreter = new ReactionInterpreter(this.currentSender, this
                    .currentReaction, this.currentMapObject, this.currentState,
                    this.currentParameters, this.currentTimeState, this
                    .currentCommand);
                interpreter.currentCommandState.parallel = true;
                RPM.currentMap.parallelCommands.push(interpreter);
            }
            newCommand = this.updateCommand();
            if (newCommand !== this.currentCommand)
            {
                RPM.requestPaintHUD = true;
                this.currentCommand = newCommand;
                if (this.currentCommand !== null)
                {
                    this.currentCommandState = this.currentCommand.data
                        .initialize();
                    directNode = this.currentCommand.data.isDirectNode;
                } else
                {
                    directNode = false;
                }
            } else
            {
                directNode = false;
            }
        }
        */
    }

    // -------------------------------------------------------
    /** Update a command and return the next command to excecute (if finished)
    *   @returns {Node}
    */
    updateCommand()
    {
        /*
        if (RPM.currentMap.loading)
        {
            return this.currentCommand;
        }
        this.updateObjectParameters();

        // Update can return different type of values
        let result = this.currentCommand.data.update(this.currentCommandState,
            this.currentMapObject, this.currentState);
        let value = null;

        // If the value is a string, then it can only be a label call
        if (RPM.isString(result))
        {
            let tab;
            for (let i = 0, l = this.currentReaction.labels.length; i < l; i++)
            {
                tab = this.currentReaction.labels[i];
                if (result === tab[0].getValue())
                {
                    value = tab[1].next;
                }
            }
        } else
        {   // Else, that means it's a number which represents the number of nodes
            // to skip
            // If entering in a node
            if (result === -1)
            {
                if (this.currentCommand.firstChild === null)
                {
                    return this.endOfBlock(new Node(this.currentCommand, null),
                        null);
                } else
                {
                    value = this.currentCommand.firstChild;
                }
            }
            // If leaving last while node
            else if (result === -2)
            {
                let whileNode = this.currentCommand.parent;
                while (whileNode !== null)
                {
                    if (whileNode.data instanceof EventCommandWhile)
                    {
                        return this.goToNextCommand(whileNode);
                    }
                    whileNode = whileNode.parent;
                }
                // If going here, that means there is no parent while...
                // bring error
                RPM.show("Error: there is a breaking loop that is not inside"
                    + " a loop.");
            } else if (result === -3) // If stopping the reaction
            {
                return null;
            }
            // If positive number, then it's the number of nodes to skip
            else
            {
                value = this.currentCommand;
                for (let j = 1; j <= result; j++)
                {
                    value = value.next;
                }
            }
        }
        return this.endOfBlock(this.currentCommand, value);
        */
    }

    // -------------------------------------------------------
    /** Update a command that corresponds to the end of a block and return the
    *   next command to excecute (if finished)
    *   @param {Node} command The command before updating
    *   @param {Node} value The next command after updating
    *   @returns {Node}
    */
    endOfBlock(command, value)
    {
        /*
        if (value === null)
        {
            // If end of the event
            if (command.parent.parent === null)
            {
                return null;
            } else // Else, it's only the end of a bloc of instructions
            {
                // If while...
                if (command.parent.data instanceof EventCommandWhile)
                {
                    return command.parent; // Redo the while command
                } else if (command.parent.data instanceof EventCommandChoice)
                {
                    // If choice, search end choice command
                    let next = command.parent;
                    while (next.data !== null)
                    {
                        next = next.next;
                    }
                    next = next.next;
                    return next;
                } else
                {
                    // If condition, or other instruction bloc, leave it
                    // and go to next command
                    return this.goToNextCommand(command.parent);
                }
            }
        }
        return value;
        */
    }

    // -------------------------------------------------------
    /** After the end of a block, go to the next command
    *   @param {Node} command The command before updating
    *   @returns {Node}
    */
    goToNextCommand(node)
    {
        /*
        let value = node;
        for (let i = 1, l = node.data.goToNextCommand(); i <= l; i++)
        {
            value = value.next;
        }
        return this.endOfBlock(node, value);
        */
    }

    // -------------------------------------------------------
    /** First key press handle for the current command
    *   @param {number} key The key ID pressed
    */
    onKeyPressed(key)
    {
        /*
        if (!this.isFinished() && (!RPM.currentMap.loading && this.canExecute()))
        {
            this.currentCommand.data.onKeyPressed(this.currentCommandState, key);
        }*/
    }

    // -------------------------------------------------------
    /** First key release handle for the current command
    *   @param {number} key The key ID released
    */
    onKeyReleased(key)
    {
        /*
        if (!this.isFinished() && (!RPM.currentMap.loading && this.canExecute()))
        {
            this.currentCommand.data.onKeyReleased(this.currentCommandState, key);
        }
        */
    }

    // -------------------------------------------------------
    /** Key pressed repeat handle for the current command
    *   @param {number} key The key ID pressed
    *   @returns {boolean} false if the other keys are blocked after it
    */
    onKeyPressedRepeat(key)
    {
        /*
        if (!this.isFinished() && (!RPM.currentMap.loading && this.canExecute()))
        {
            return this.currentCommand.data.onKeyPressedRepeat(this
                .currentCommandState, key);
        }
        return true;
        */
    }

    // -------------------------------------------------------
    /** Key pressed repeat handle for the current command, but with a small 
    *   wait after the first pressure (generally used for menus)
    *   @param {number} key The key ID pressed
    *   @returns {boolean} false if the other keys are blocked after it
    */
    onKeyPressedAndRepeat(key)
    {
        /*
        if (!this.isFinished() && (!RPM.currentMap.loading && this.canExecute()))
        {
            return this.currentCommand.data.onKeyPressedAndRepeat(this
                .currentCommandState, key);
        }
        return true;
        */
    }

    // -------------------------------------------------------
    /** Draw HUD for the current command
    */
    drawHUD()
    {
        //this.currentCommand.data.drawHUD(this.currentCommandState);
    }
}

export { EventReaction }