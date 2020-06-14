/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS ReactionInterpreter
//
//  A reaction command interpreter.
//
//  @currentSender          -> Current event sender (null for system events).
//  @currentReaction        -> Current reaction excecuted (only one per state).
//  @currentMapObject       -> Current map object.
//  @currentState           -> Current state of map object reaction.
//  @currentCommand         -> A node of a command Reaction.
//  @currentCommandState    -> Current state of the current command.
//
// -------------------------------------------------------

/** @class
*   A reaction command interpreter.
*   @property {MapObject} currentSender Current event sender (null for system
*   events).
*   @property {SystemReaction} currentReaction Current reaction excecuted (only
*   one per state).
*   @property {MapObject} currentMapObject Current map object.
*   @property {number} currentState Current state of map object reaction.
*   @property {Node} currentCommand A node of a command Reaction.
*   @property {Object} currentCommandState Current state of the current command.
*   @param {MapObject} sender Current event sender (null for system
*   events).
*   @param {SystemReaction} reaction Current reaction excecuted (only
*   one per state).
*   @param {MapObject} object Current map object.
*   @param {number} state Current state of map object reaction.
*   @param {SystemParameter[]} parameters All the parameters coming with
*   this reaction.
*/
function ReactionInterpreter(sender, reaction, object, state, parameters, event,
    command)
{
    // Default values
    if (typeof command === 'undefined') command = reaction.getFirstCommand();

    this.currentSender = sender;
    this.currentReaction = reaction;
    this.currentMapObject = object;
    this.currentState = state;
    this.currentParameters = parameters;
    this.currentCommand = command;
    this.updateObjectParameters();
    this.currentCommandState = this.currentCommand.data.initialize();
    this.currentTimeState = event;
    RPM.requestPaintHUD = true;
}

ReactionInterpreter.prototype = {

    /** Check if the current reaction is finished (no more commands to
    *   excecute).
    *   @returns {boolean}
    */
    isFinished: function(){
        return (this.currentCommand === null)
    },

    updateObjectParameters: function() {
        // Update global variables for getValue()
        RPM.currentObject = this.currentMapObject;
        RPM.currentParameters = this.currentParameters;
    },

    // -------------------------------------------------------

    updateFinish: function() {
        if (this.currentTimeState) {
            this.currentTimeState[1] = new Date().getTime();
        }
        if (this.currentMapObject && this.currentMapObject.movingState !== null)
        {
            this.currentMapObject.movingState.pause = false;
        }
    },

    // -------------------------------------------------------

    /** Update the current commands.
    */
    update: function(){
        var directNode = true;

        while (directNode){
            if (this.currentCommand.data.parallel){
                var interpreter = new ReactionInterpreter(this.currentSender,
                                                          this.currentReaction,
                                                          this.currentMapObject,
                                                          this.currentState,
                                                          this.currentParameters,
                                                          this.currentTimeState,
                                                          this.currentCommand);
                interpreter.currentCommandState.parallel = true;
                RPM.currentMap.parallelCommands.push(interpreter);
            }

            var new_command = this.updateCommand();
            if (new_command !== this.currentCommand){
                RPM.requestPaintHUD = true;
                this.currentCommand = new_command;
                if (this.currentCommand !== null){
                    this.currentCommandState =
                         this.currentCommand.data.initialize();
                    directNode = this.currentCommand.data.isDirectNode;
                }
                else
                    directNode = false;
            }
            else
                directNode = false;
        }
    },

    // -------------------------------------------------------

    /** Update a command and return the next command to excecute (if finished).
    *   @returns {Node}
    */
    updateCommand: function() {
        this.updateObjectParameters();

        // Update can return different type of values :
        var result = this.currentCommand.data.update(this.currentCommandState,
                                                     this.currentMapObject,
                                                     this.currentState);
        var value = null;

        // If the value is a string, then it can only be a label call
        if (typeof result === 'string'){
            // TODO
        }
        /* Else, that means it's a number which represents the number of nodes
        to skip */
        else{
            // If entering in a node
            if (result === -1) {
                if (this.currentCommand.firstChild === null)  {
                    return this.endOfBlock(new Node(this.currentCommand, null),
                        null);
                } else {
                    value = this.currentCommand.firstChild;
                }
            }
            // If leaving last while node
            else if (result === -2) {
                var whileNode = this.currentCommand.parent;
                while (whileNode !== null){
                    if (whileNode.data instanceof EventCommandWhile) {
                        return this.goToNextCommand(whileNode);
                    }
                    whileNode = whileNode.parent;
                }
                /* If going here, that means there is no parent while...
                bring error */
                RPM.show("Error : there is a breaking loop that is not inside"
                    + " a loop.");
            }
            // If stopping the reaction
            else if (result === -3) {
                return null;
            }
            // If positive number, then it's the number of nodes to skip
            else {
                value = this.currentCommand;
                for (var j = 1; j <= result; j++){
                    value = value.next;
                }
            }
        }

        return this.endOfBlock(this.currentCommand, value);
    },

    // -------------------------------------------------------

    /** Update a command that corresponds to the end of a block and return the
    *   next command to excecute (if finished).
    *   @param {Node} command The command before updating.
    *   @returns {Node} value The next command after updating.
    */
    endOfBlock: function(command, value){
        if (value === null){

            // If end of the event
            if (command.parent.parent === null)
                return null;

            // Else, it's only the end of a bloc of instructions
            else{
                // If while...
                if (command.parent.data instanceof EventCommandWhile){
                    return command.parent; // Redo the while command
                }
                /* If choice, search end choice command */
                else if (command.parent.data instanceof EventCommandChoice) {
                    var next;

                    next = command.parent;
                    while (next.data !== null) {
                        next = next.next;
                    }
                    next = next.next;
                    return next;
                }
                /* If condition, or other instruction bloc, leave it
                and go to next command */
                else {
                    return this.goToNextCommand(command.parent);
                }
            }
        }

        return value;
    },

    // -------------------------------------------------------

    /** After the end of a block, go to the next command.
    *   @param {Node} command The command before updating.
    *   @returns {Node}
    */
    goToNextCommand: function(node){
        var nb = node.data.goToNextCommand();
        var value = node;
        for (var i = 1; i <= nb; i++){
            value = value.next;
        }
        return this.endOfBlock(node, value);
    },

    // -------------------------------------------------------

    /**
    */
    updateObjectMoveState: function() {
        if (this.currentMapObject && this.currentCommand.data instanceof
            EventCommandMoveObject)
        {
            this.currentMapObject.updateMoveStates(this.currentCommand.data.
                getCurrentOrientation(this.currentCommandState));
        }
    },

    // -------------------------------------------------------

    /** First key press handle for the current command.
    *   @param {number} key The key ID pressed.
    */
    onKeyPressed: function(key){
        this.currentCommand.data.onKeyPressed(this.currentCommandState, key);
    },

    // -------------------------------------------------------

    /** First key release handle for the current command.
    *   @param {number} key The key ID released.
    */
    onKeyReleased: function(key){
        this.currentCommand.data.onKeyReleased(this.currentCommandState, key);
    },

    // -------------------------------------------------------

    /** Key pressed repeat handle for the current command.
    *   @param {number} key The key ID pressed.
    *   @returns {boolean} false if the other keys are blocked after it.
    */
    onKeyPressedRepeat: function(key){
        return this.currentCommand.data.onKeyPressedRepeat(
                    this.currentCommandState, key);
    },

    // -------------------------------------------------------

    /** Key pressed repeat handle for the current command, but with
    *   a small wait after the first pressure (generally used for menus).
    *   @param {number} key The key ID pressed.
    *   @returns {boolean} false if the other keys are blocked after it.
    */
    onKeyPressedAndRepeat: function(key){
        return this.currentCommand.data.onKeyPressedAndRepeat(
                    this.currentCommandState, key);
    },

    // -------------------------------------------------------

    /** Draw HUD for the current command.
    *   @param {Canvas.Context} context The canvas context.
    */
    drawHUD: function(){
        this.currentCommand.data.drawHUD(this.currentCommandState);
    }
}
