/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

// -------------------------------------------------------
//
//  CLASS EventCommand
//
// -------------------------------------------------------

function EventCommand() {

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
function EventCommandShowText(command){
    this.message = command[0];
    this.isDirectNode = false;
    this.parallel = false;
    this.window = new WindowBox(10, $SCREEN_Y - 10 - 150, $SCREEN_X - 20, 150,
                                new GraphicText(this.message));
}

EventCommandShowText.prototype = {

    /** Initialize the current state.
    *   @returns {Object} The current state (clicked).
    */
    initialize: function(){
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
        this.window.draw();

        $datasGame.system.getWindowSkin().drawArrowMessage(currentState.frame,
            $SCREEN_X / 2, $SCREEN_Y - 40);
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
function EventCommandChangeVariables(command){
    this.command = command;
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
    update: function(currentState, object, state){

        // Parsing
        var i = 2;
        var selection = this.command[1];
        var nbSelection = 1;
        if (this.command[0] === 1) nbSelection = this.command[i++] - selection;
        var operation = this.command[i++];
        var value = 0;
        var valueType = this.command[i++];
        switch(valueType){
            case 0: // Random number
                var range1 = this.command[i++];
                var range2 = this.command[i++];
                value = parseInt(Math.random() * (range2-range1+1) + range1);
                break;
        }

        // Changing variable(s)
        for (i = 0; i < nbSelection; i++){
            $game.variables[selection + i] =
                   $operators_numbers[operation]($game.variables[selection + i],
                                                 value);
        }

        // End of command
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
function EventCommandIf(command){
    this.hasElse = command[0] === 1;
    command.shift();
    this.command = command;
    this.isDirectNode = true;
    this.parallel = false;
}

EventCommandIf.prototype = {

    initialize: function(){ return null; },

    getBool: function(){

        // Parsing
        var i = 0;
        var page = this.command[i++];
        switch (page){
        case 0:
            return this.getBoolVariable(i);
        }

        return false;
    },

    getBoolSwitch: function(i){
        var idSwitch = this.command[i++];
        var value = (this.command[i++] === 0);
        return $datasGame.listSwitches[idSwitch] === value;
    },

    getBoolVariable: function(i){
        var idVar = this.command[i++];
        var operation = this.command[i++];
        var varConstType = this.command[i++];
        var compare = this.command[i++];

        var value = (varConstType === 0) ? $game.variables[compare]
                                         : compare;
        return $operators_compare[operation]($game.variables[idVar],
                                             value);
    },

    /** Check where to go according to the condition.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        var result = this.getBool();

        if (result) return -1;
        else return 1 + (this.hasElse ? 0 : 1);
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
