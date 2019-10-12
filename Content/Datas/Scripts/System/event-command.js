/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS EventCommand
//
// -------------------------------------------------------

function EventCommand() {

}

EventCommand.prototype = {

    /** Initialize the current state.
    *   @returns {Object} The current state (clicked).
    */
    initialize: function() {
        return null;
    },

    // -------------------------------------------------------

    /** Update and check if the event is finished.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state) {
        return 1;
    },

    // -------------------------------------------------------

    /** Update clicked to true.
    *   @param {Object} currentState The current state of the event.
    *   @param {number} key The key ID pressed.
    */
    onKeyPressed: function(currentState, key) {},

    // -------------------------------------------------------

    onKeyReleased: function(currentState, key) {},

    // -------------------------------------------------------

    onKeyPressedRepeat: function(currentState, key) {
        return true;
    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(currentState, key) {},

    // -------------------------------------------------------

    /** Draw the dialog box.
    *   @param {Object} currentState The current state of the event.
    */
    drawHUD: function(currentState) {}
}

EventCommand.getEventCommand = function(json) {
    var command = json.command;
    var kind = json.kind;
    switch(kind) {
        case EventCommandKind.ShowText:
            return new EventCommandShowText(command);
        case EventCommandKind.ChangeVariables:
            return new EventCommandChangeVariables(command);
        case EventCommandKind.EndGame:
            return new EventCommandEndGame(command);
        case EventCommandKind.While:
            return new EventCommandWhile(command);
        case EventCommandKind.WhileBreak:
            return new EventCommandWhileBreak(command);
        case EventCommandKind.InputNumber:
            return new EventCommandInputNumber(command);
        case EventCommandKind.If:
            return new EventCommandIf(command);
        case EventCommandKind.Else:
            return new EventCommandElse(command);
        case EventCommandKind.OpenMainMenu:
            return new EventCommandOpenMainMenu(command);
        case EventCommandKind.OpenSavesMenu:
            return new EventCommandOpenSavesMenu(command);
        case EventCommandKind.ModifyInventory:
            return new EventCommandModifyInventory(command);
        case EventCommandKind.ModifyTeam:
            return new EventCommandModifyTeam(command);
        case EventCommandKind.StartBattle:
            return new EventCommandStartBattle(command);
        case EventCommandKind.IfWin:
            return new EventCommandIfWin(command);
        case EventCommandKind.IfLose:
            return new EventCommandIfLose(command);
        case EventCommandKind.ChangeState:
            return new EventCommandChangeState(command);
        case EventCommandKind.SendEvent:
            return new EventCommandSendEvent(command);
        case EventCommandKind.TeleportObject:
            return new EventCommandTeleportObject(command);
        case EventCommandKind.MoveObject:
            return new EventCommandMoveObject(command);
        case EventCommandKind.Wait:
            return new EventCommandWait(command);
        case EventCommandKind.MoveCamera:
            return new EventCommandMoveCamera(command);
        case EventCommandKind.PlayMusic:
            return new EventCommandPlayMusic(command);
        case EventCommandKind.StopMusic:
            return new EventCommandStopMusic(command);
        case EventCommandKind.PlayBackgroundSound:
            return new EventCommandPlayBackgroundSound(command);
        case EventCommandKind.StopBackgroundSound:
            return new EventCommandStopBackgroundSound(command);
        case EventCommandKind.PlaySound:
            return new EventCommandPlaySound(command);
        case EventCommandKind.PlayMusicEffect:
            return new EventCommandPlayMusicEffect(command);
        case EventCommandKind.ChangeProperty:
            return new EventCommandChangeProperty(command);
        case EventCommandKind.DisplayChoice:
            return new EventCommandDisplayChoice(command);
        case EventCommandKind.Choice:
            return new EventCommandChoice(command);
        case EventCommandKind.Script:
            return new EventCommandScript(command);
        default:
            return null;
    }
};

// -------------------------------------------------------
//
//  CLASS EventCommandShowText
//
// -------------------------------------------------------

/** @class
*   An event command for displaying text.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {WindowBox} window Window containins the message to display.
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandShowText(command) {
    var i, k, v;

    i = 0;
    k = command[i++];
    v = command[i++];
    this.interlocutor = SystemValue.createValue(k, v);
    this.facesetID = command[i++];
    this.message = command[i++];

    this.isDirectNode = false;
    this.parallel = false;

    this.windowMain = new WindowBox(10, $SCREEN_Y - 10 - 150, $SCREEN_X - 20,
        150, new GraphicMessage(this.message, this.facesetID), RPM
        .HUGE_PADDING_BOX);
    this.windowInterlocutor = new WindowBox(this.windowMain.oX + (RPM
        .MEDIUM_SLOT_HEIGHT / 2), this.windowMain.oY - (RPM.MEDIUM_SLOT_HEIGHT /
        2), RPM.MEDIUM_SLOT_WIDTH, RPM.MEDIUM_SLOT_HEIGHT, new GraphicText("", {
        align: Align.Center }), RPM.SMALL_SLOT_PADDING);
}

EventCommandShowText.prototype = {

    /** Initialize the current state.
    *   @returns {Object} The current state (clicked).
    */
    initialize: function(){
        this.windowMain.content.update();

        return {
            clicked: false,
            frame: 0,
            frameTick: 0,
            frameDuration: 150
        }
    },

    // -------------------------------------------------------

    /** Update and check if the event is finished.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        if (currentState.clicked)
            return 1;
        currentState.frameTick += $elapsedTime;
        if (currentState.frameTick >= currentState.frameDuration) {
            currentState.frame = (currentState.frame + 1) % $FRAMES;
            currentState.frameTick = 0;
            $requestPaintHUD = true;
        }
        this.windowInterlocutor.content.setText(this.interlocutor.getValue());

        return 0;
    },

    // -------------------------------------------------------

    /** Update clicked to true.
    *   @param {Object} currentState The current state of the event.
    *   @param {number} key The key ID pressed.
    */
    onKeyPressed: function(currentState, key){
        if (DatasKeyBoard.isKeyEqual(key,
                                     $datasGame.keyBoard.menuControls.Action))
        {
            currentState.clicked = true;
        }
    },

    // -------------------------------------------------------

    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},

    /** Draw the dialog box.
    *   @param {Object} currentState The current state of the event.
    */
    drawHUD: function(currentState) {
        this.windowMain.draw();
        if (this.windowInterlocutor.content.text) {
            this.windowInterlocutor.draw();
        }

        if (currentState) {
            $datasGame.system.getWindowSkin().drawArrowMessage(currentState
                .frame, $SCREEN_X / 2, $SCREEN_Y - 40);
        }
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandChangeVariables
//
// -------------------------------------------------------

/** @class
*   An event command for changing variables values.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {JSON} command Direct JSON command to parse.
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandChangeVariables(command) {
    var iterator, k, v;

    iterator = {
        i: 2
    }

    // Selection
    this.selection = command[1];
    this.nbSelection = 1;
    if (command[0] === 1) {
        this.nbSelection = command[iterator.i++] - this.selection;
    }

    // Operation
    this.operation = command[iterator.i++];

    // Value
    this.valueKind = command[iterator.i++];
    switch (this.valueKind) {
    case 0: // Number
        this.valueNumber = SystemValue.createValueCommand(command, iterator);
        break;
    case 1: // Random number
        this.valueRandomA = SystemValue.createValueCommand(command, iterator);
        this.valueRandomB = SystemValue.createValueCommand(command, iterator);
        break;
    }

    this.isDirectNode = true;
    this.parallel = false;
}

EventCommandChangeVariables.prototype = {

    initialize: function(){ return null; },

    /** Parse command and change the variable values, and then finish.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state) {
        var value, randomA, randomB;
        var i, l;

        switch (this.valueKind) {
        case 0: // Number
            value = this.valueNumber.getValue();
            break;
        case 1: // Random number
            randomA = this.valueRandomA.getValue();
            randomB = this.valueRandomB.getValue();
            value = RPM.random(randomA, randomB);
            break;
        }

        for (i = 0, l = this.nbSelection; i < l; i++) {
            $game.variables[this.selection + i] = $operators_numbers[this
                .operation]($game.variables[this.selection + i], value);
        }

        return 1;
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandEndGame
//
// -------------------------------------------------------

/** @class
*   An event command for ending the game.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandEndGame(command){
    this.isDirectNode = true;
    this.parallel = false;
}

EventCommandEndGame.prototype = {

    initialize: function(){ return null; },

    /** Quit the game.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        quit();
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandWhile
//
// -------------------------------------------------------

/** @class
*   An event command for loop event command block.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandWhile(command){
    this.isDirectNode = true;
    this.parallel = false;
}

EventCommandWhile.prototype = {

    initialize: function(){ return null; },

    /** Go inside the loop block.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        return -1;
    },

    // -------------------------------------------------------

    goToNextCommand : function(){ return 2; },
    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandWhileBreak
//
// -------------------------------------------------------

/** @class
*   An event command for leaving while event command.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandWhileBreak(command){
    this.isDirectNode = true;
    this.parallel = false;
}

EventCommandWhileBreak.prototype = {

    initialize: function(){ return null; },

    /** Go outside the loop block.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){ return -2; },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandInputNumber
//
// -------------------------------------------------------

/** @class
*   An event command for entering a number inside a variable.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {number} id Id of the variable.
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandInputNumber(command){
    this.id = parseInt(command[0]);
    this.isDirectNode = false;
    this.parallel = false;
}

EventCommandInputNumber.prototype = {

    /** Initialize the current state.
    *   @returns {Object} The current state (entered, confirmed).
    */
    initialize: function(){
        return {
            entered: "",
            confirmed: false
        }
    },

    // -------------------------------------------------------

    /** Finish after confirmation.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        if (currentState.confirmed){
            $datasGame.variables[this.id] = currentState.entered;
            return 1;
        }

        return 0;
    },

    // -------------------------------------------------------

    /** Update confirmed to true, or update text entered.
    *   @param {Object} currentState The current state of the event.
    *   @param {number} key The key ID pressed.
    */
    onKeyPressed: function(currentState, key){
        if (key === KeyEvent.DOM_VK_ENTER)
            currentState.confirmed = true;
        else{
            if (KeyEvent.isKeyNumberPressed(key))
                currentState.entered += KeyEvent.getKeyChar(key);
        }
    },

    // -------------------------------------------------------

    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},

    /** Draw number entered.
    *   @param {Object} currentState The current state of the event.
    */
    drawHUD: function(currentState){
        $context.fillText(currentState.entered, $canvasWidth / 2, $canvasHeight
            / 2);
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandIf
//
// -------------------------------------------------------

/** @class
*   An event command for condition event command block.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {boolean} hasElse Boolean indicating if there an else node or not.
*   @property {JSON} command Direct JSON command to parse.
*/
function EventCommandIf(command) {
    var i, k, v;

    // Parsing
    i = 0;
    this.hasElse = command[i++] === 1;
    this.kind = command[i++];
    switch (this.kind) {
    case 0: // Variable / Param / Prop
        k = command[i++];
        v = command[i++];
        this.variableParamProp = SystemValue.createValue(k, v);
        this.variableParamPropOperationKind = command[i++];
        k = command[i++];
        v = command[i++];
        this.variableParamPropValue = SystemValue.createValue(k, v);
    }

    this.isDirectNode = true;
    this.parallel = false;
}

EventCommandIf.prototype = {

    initialize: function(){ return null; },

    /** Check where to go according to the condition.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        var result;

        switch (this.kind) {
        case 0: // Variable / Param / Prop
            result = $operators_compare[this.variableParamPropOperationKind](
                this.variableParamProp.getValue(), this.variableParamPropValue
                .getValue())
        }

        if (result) {
            return -1;
        } else {
            return 1 + (this.hasElse ? 0 : 1);
        }
    },

    // -------------------------------------------------------

    /** Returns the number of node to pass.
    *   @returns {number}
    */
    goToNextCommand : function(){
        return 2 + (this.hasElse ? 1 : 0);
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandElse
//
// -------------------------------------------------------

/** @class
*   An event command for condition else event command block.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandElse(command){
    this.isDirectNode = true;
    this.parallel = false;
}

EventCommandElse.prototype = {

    initialize: function(){ return null; },

    /** Go inside the else block.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        return -1;
    },

    // -------------------------------------------------------

    /** Returns the number of node to pass.
    *   @returns {number}
    */
    goToNextCommand : function(){
        return 2;
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandOpenMainMenu
//
// -------------------------------------------------------

/** @class
*   An event command for opening the main menu.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandOpenMainMenu(command){
    this.isDirectNode = false;
    this.parallel = false;
}

EventCommandOpenMainMenu.prototype = {

    /** Initialize the current state.
    *   @returns {Object} The current state (opened).
    */
    initialize: function(){
        return {
            opened: false
        }
    },

    // -------------------------------------------------------

    /** Open the menu.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        if (currentState.opened)
            return 1;
        $gameStack.push(new SceneMenu());
        currentState.opened = true;

        return 0;
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandOpenSavesMenu
//
// -------------------------------------------------------

/** @class
*   An event command for opening the saves menu.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandOpenSavesMenu(command){
    this.isDirectNode = false;
    this.parallel = false;
}

EventCommandOpenSavesMenu.prototype = {

    /** Initialize the current state.
    *   @returns {Object} The current state (opened).
    */
    initialize: function(){
        return {
            opened: false
        }
    },

    // -------------------------------------------------------

    /** Open the menu.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        if (currentState.opened)
            return 1;
        $gameStack.push(new SceneSaveGame());
        currentState.opened = true;

        return 0;
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandModifyInventory
//
// -------------------------------------------------------

/** @class
*   An event command for modifying the inventory.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {JSON} command Direct JSON command to parse.
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandModifyInventory(command) {
    var i, k, v;

    i = 0;
    this.itemKind = command[i++];
    this.itemId = command[i++];
    this.operation = command[i++];
    k = command[i++];
    v = command[i++];
    this.value = SystemValue.createValue(k, v);

    this.isDirectNode = true;
    this.parallel = false;
}

EventCommandModifyInventory.prototype = {

    initialize: function(){ return null; },

    // -------------------------------------------------------

    /** Update the inventory and finish.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state) {
        var item = new GameItem(this.itemKind, this.itemId, this.value.getValue());

        // Doing the coresponding operation
        switch(this.operation){
        case 0:
            item.equalItems(); break;
        case 1:
            item.addItems(); break;
        case 2:
            item.removeItems(); break;
        case 3:
            item.multItems(); break;
        case 4:
            item.divItems(); break;
        case 5:
            item.moduloItems(); break;
        }

        return 1;
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandModifyTeam
//
// -------------------------------------------------------

/** @class
*   An event command for modifying team.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {JSON} command Direct JSON command to parse.
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandModifyTeam(command){
    var i = 0, k, v;

    this.addingKind = command[i++];

    switch (this.addingKind){
    case 0: // If create new instance
        k = command[i++];
        v = command[i++];
        this.instanceLevel = SystemValue.createValue(k, v);
        this.instanceTeam = command[i++];
        this.stockVariableId = command[i++];
        this.instanceKind = command[i++];
        this.instanceId = command[i++];
        break;
    case 1:
        this.addRemoveKind = command[i++];
        k = command[i++];
        v = command[i++];
        this.addRemoveID = SystemValue.createValue(k, v);
        this.addRemoveTeam = this.command[i++];
        break;
    }

    this.isDirectNode = true;
    this.parallel = false;
}

/** Instanciate a new character in a group.
*   @static
*   @param {GroupKind} where In which group we should instanciate.
*   @param {CharacterKind} type The type of character to instanciate.
*   @param {number} id The ID of the character to instanciate.
*   @param {number} stockId The ID of the variable where we will stock the
*   instantiate ID.
*/
EventCommandModifyTeam.instanciateTeam = function(where, type, id, level,
    stockId)
{

    // Stock the instanciation id in a variable
    $game.variables[stockId] = $game.charactersInstances;

    // Adding the instanciated character in the right group
    var player = new GamePlayer(type, id, $game.charactersInstances++, []);
    player.instanciate(level);
    var group;
    switch(where){
    case 0: group = $game.teamHeroes; break;
    case 1: group = $game.reserveHeroes; break;
    case 2: group = $game.hiddenHeroes; break;
    }

    group.push(player);
};

EventCommandModifyTeam.prototype = {

    initialize: function() {
        return null;
    },

    /** Add or remove a character in a group.
    *   @param {CharacterKind} kind The type of character to instanciate.
    *   @param {number} id The ID of the character to instanciate.
    *   @param {GroupKind} where In which group we should instanciate.
    */
    addRemove: function(kind, id, where) {
        // Serching for the id
        var groups = [$game.teamHeroes, $game.reserveHeroes,
                      $game.hiddenHeroes];
        var group = null;
        var player;
        var i, j, l, ll;
        for (i = 0, l = groups.length; i < l; i++){
            var g = groups[i];
            for (j = 0, ll = g.length; j < ll; j++){
                player = g[j];
                if (player.instid === id){
                    group = g;
                    break;
                }
            }
            if (group !== null) break;
        }

        if (group !== null){
            group.splice(j, 1);
            if (kind === 0) groups[where].push(player);
        }
    },

    // -------------------------------------------------------

    /** Parsing, modifying the team and finishing.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        switch (this.addingKind) {
        case 0:
            EventCommandModifyTeam.instanciateTeam(this.instanceTeam, this
                .instanceKind, this.instanceId, this.instanceLevel.getValue(),
                this.stockVariableId);
            break;
        case 1:
            this.addRemove(this.addRemoveKind, this.addRemoveId.getValue(), this
                .addRemoveTeam);
            break;
        }

        return 1;
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState){}
}
