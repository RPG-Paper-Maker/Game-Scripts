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
//  CLASS EventCommand
//
// -------------------------------------------------------

function EventCommand() {
    this.isDirectNode = true;
    this.parallel = false;
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
        case EventCommandKind.DisplayAPicture:
            return new EventCommandDisplayAPicture(command);
        case EventCommandKind.SetMoveTurnAPicture:
            return new EventCommandSetMoveTurnAPicture(command);
        case EventCommandKind.RemoveAPicture:
            return new EventCommandRemoveAPicture(command);
        case EventCommandKind.SetDialogBoxOptions:
            return new EventCommandSetDialogBoxOptions(command);
        case EventCommandKind.TitleScreen:
            return new EventCommandTitleScreen(command);
        case EventCommandKind.ChangeScreenTone:
            return new EventCommandChangeScreenTone(command);
        case EventCommandKind.RemoveObjectFromMap:
            return new EventCommandRemoveObjectFromMap(command);
        case EventCommandKind.StopReaction:
            return new EventCommandStopReaction(command);
        case EventCommandKind.AllowForbidSaves:
            return new EventCommandAllowForbidSaves(command);
        case EventCommandKind.AllowForbidMainMenu:
            return new EventCommandAllowForbidMainMenu(command);
        case EventCommandKind.CallACommonReaction:
            return new EventCommandCallACommonReaction(command);
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

    this.windowMain = new WindowBox(0, 0, 0, 0, new GraphicMessage("" + this
        .message, this.facesetID), RPM.HUGE_PADDING_BOX);
    this.windowInterlocutor = new WindowBox(this.windowMain.oX + (RPM
        .MEDIUM_SLOT_HEIGHT / 2), this.windowMain.oY - (RPM.MEDIUM_SLOT_HEIGHT /
        2), RPM.MEDIUM_SLOT_WIDTH, RPM.MEDIUM_SLOT_HEIGHT, new GraphicText("", {
        align: Align.Center }), RPM.SMALL_SLOT_PADDING);
}

EventCommandShowText.prototype = {

    /** Initialize the current state.
    *   @returns {Object} The current state (clicked).
    */
    initialize: function() {
        this.windowMain.setX(RPM.defaultValue($datasGame.system.dbOptions.vx, 0));
        this.windowMain.setY(RPM.defaultValue($datasGame.system.dbOptions.vy, 0));
        this.windowMain.setW(RPM.defaultValue($datasGame.system.dbOptions.vw, 0));
        this.windowMain.setH(RPM.defaultValue($datasGame.system.dbOptions.vh, 0));
        this.windowInterlocutor.setX(this.windowMain.oX + (RPM
            .MEDIUM_SLOT_HEIGHT / 2));
        this.windowInterlocutor.setY(this.windowMain.oY - (RPM
            .MEDIUM_SLOT_HEIGHT / 2));
        this.windowMain.padding[0] = RPM.defaultValue($datasGame.system
            .dbOptions.vpLeft, 0);
        this.windowMain.padding[1] = RPM.defaultValue($datasGame.system
            .dbOptions.vpTop, 0);
        this.windowMain.padding[2] = RPM.defaultValue($datasGame.system
            .dbOptions.vpRight, 0);
        this.windowMain.padding[3] = RPM.defaultValue($datasGame.system
            .dbOptions.vpBottom, 0);
        this.windowMain.updateDimensions();
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
                .frame, this.windowMain.oX + (this.windowMain.oW / 2), this
                .windowMain.oY + (this.windowMain.oH - 40));
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
    case 2: // Message
        this.valueMessage = SystemValue.createValueCommand(command, iterator);
        break;
    case 3: // Switch
        this.valueSwitch = SystemValue.createValueCommand(command, iterator);
        break;
    case 4: // Map object characteristic
        this.valueMapObject = SystemValue.createValueCommand(command, iterator);
        this.valueMapObjectChar = command[iterator.i++];
        break;
    }

    this.isDirectNode = true;
    this.parallel = false;
}

EventCommandChangeVariables.prototype = {

    initialize: function() {
        return {
            started: false,
        };
    },

    /** Parse command and change the variable values, and then finish.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state) {
        if (!currentState.started) {
            currentState.started = true;
            // Get value to set
            switch (this.valueKind) {
            case 0: // Number
                currentState.value = this.valueNumber.getValue();
                break;
            case 1: // Random number
                currentState.value = RPM.random(this.valueRandomA.getValue(),
                    this.valueRandomB.getValue());
                break;
            case 2: // Message
                currentState.value = this.valueMessage.getValue();
                break;
            case 3: // Switch
                currentState.value = this.valueSwitch.getValue(true);
                break;
            case 4: // Map object characteristic
                var objectID;

                objectID = this.valueMapObject.getValue();

                MapObject.updateObjectWithID(object, objectID, this, function(
                    obj)
                {
                    switch(this.valueMapObjectChar) {
                    case VariableMapObjectCharacteristicKind.XSquarePosition:
                        currentState.value = RPM.getPosition(obj.position)[0];
                        break;
                    case VariableMapObjectCharacteristicKind.YSquarePosition:
                        currentState.value = RPM.getPosition(obj.position)[1];
                        break;
                    case VariableMapObjectCharacteristicKind.ZSquarePosition:
                        currentState.value = RPM.getPosition(obj.position)[2];
                        break;
                    case VariableMapObjectCharacteristicKind.XPixelPosition:
                        currentState.value = obj.position.x;
                        break;
                    case VariableMapObjectCharacteristicKind.YPixelPosition:
                        currentState.value = obj.position.y;
                        break;
                    case VariableMapObjectCharacteristicKind.ZPixelPosition:
                        currentState.value = obj.position.z;
                        break;
                    case VariableMapObjectCharacteristicKind.Orientation:
                        currentState.value = obj.orientation;
                        break;
                    }
                });
            }
        }

        // Apply new value to variable(s)
        if (!RPM.isUndefined(currentState.value)) {
            var i, l;

            for (i = 0, l = this.nbSelection; i < l; i++) {
                $game.variables[this.selection + i] = $operators_numbers[this
                    .operation]($game.variables[this.selection + i],
                    currentState.value);
            }
        }

        return RPM.isUndefined(currentState.value) ? 0 : 1;
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
        break;
    case 1: // Heroes
        this.heroesSelection = command[i++];
        if (this.heroesSelection === ConditionHeroesKind.TheHeroeWithInstanceID) {
            k = command[i++];
            v = command[i++];
            this.heroInstanceID = SystemValue.createValue(k, v);;
        }
        this.heroesInTeam = RPM.numToBool(command[i++]);
        if (this.heroesInTeam) {
            this.heroesInTeamSelection = command[i++];
        }
        this.heroesKind = command[i++];
        switch (this.heroesKind) {
        case 0:
            k = command[i++];
            v = command[i++];
            this.heroesNamed = SystemValue.createValue(k, v);
            break;
        case 1:
            this.heroesInTeamValue = command[i++];
            break;
        case 2:
            k = command[i++];
            v = command[i++];
            this.heroesSkillID = SystemValue.createValue(k, v);
            break;
        case 3:
            this.heroesEquipedKind = command[i++];
            switch (this.heroesEquipedKind) {
            case 0:
                k = command[i++];
                v = command[i++];
                this.heroesEquipedWeaponID = SystemValue.createValue(k, v);
                break;
            case 1:
                k = command[i++];
                v = command[i++];
                this.heroesEquipedArmorID = SystemValue.createValue(k, v);
                break;
            }
            break;
        case 4:
            k = command[i++];
            v = command[i++];
            this.heroesStatusID = SystemValue.createValue(k, v);
            break;
        case 5:
            k = command[i++];
            v = command[i++];
            this.heroesStatisticID = SystemValue.createValue(k, v);
            this.heroesStatisticOperation = command[i++];
            k = command[i++];
            v = command[i++];
            this.heroesStatisticValue = SystemValue.createValue(k, v);
            break;
        }
        break;
    case 2:
        k = command[i++];
        v = command[i++];
        this.currencyID = SystemValue.createValue(k, v);
        this.operationCurrency = command[i++];
        k = command[i++];
        v = command[i++];
        this.currencyValue = SystemValue.createValue(k, v);
        break;
    case 3:
        k = command[i++];
        v = command[i++];
        this.itemID = SystemValue.createValue(k, v);
        this.operationItem = command[i++];
        k = command[i++];
        v = command[i++];
        this.itemValue = SystemValue.createValue(k, v);
        break;
    case 4:
        k = command[i++];
        v = command[i++];
        this.weaponID = SystemValue.createValue(k, v);
        this.operationWeapon = command[i++];
        k = command[i++];
        v = command[i++];
        this.weaponValue = SystemValue.createValue(k, v);
        this.weaponEquiped = RPM.numToBool(command[i++]);
        break;
    case 5:
        k = command[i++];
        v = command[i++];
        this.armorID = SystemValue.createValue(k, v);
        this.operationArmor = command[i++];
        k = command[i++];
        v = command[i++];
        this.armorValue = SystemValue.createValue(k, v);
        this.armorEquiped = RPM.numToBool(command[i++]);
        break;
    case 6:
        k = command[i++];
        v = command[i++];
        this.keyID = SystemValue.createValue(k, v);
        k = command[i++];
        v = command[i++];
        this.keyValue = SystemValue.createValue(k, v);
        break;
    case 7:
        k = command[i++];
        v = command[i++];
        this.script = SystemValue.createValue(k, v);
        break;
    }

    this.isDirectNode = true;
    this.parallel = false;
}

EventCommandIf.prototype = {

    allTheHeroes: function(tab, callback) {
        var i, l;

        for (i = 0, l = tab.length; i < l; i++) {
            if (!callback.call(this, tab[i])) {
                return false;
            }
        }

        return true;
    },

    // -------------------------------------------------------

    noneOfTheHeroes: function(tab, callback) {
        var i, l;

        for (i = 0, l = tab.length; i < l; i++) {
            if (callback.call(this, tab[i])) {
                return false;
            }
        }

        return true;
    },

    // -------------------------------------------------------

    atLeastOneHero: function(tab, callback) {
        var i, l;

        for (i = 0, l = tab.length; i < l; i++) {
            if (callback.call(this, tab[i])) {
                return true;
            }
        }

        return false;
    },

    // -------------------------------------------------------

    theHeroeWithInstanceID: function(tab, id, callback) {
        var i, l, hero;

        for (i = 0, l = tab.length; i < l; i++) {
            hero = tab[i];
            if (hero.instid === id && !callback.call(this, hero)) {
                return false;
            }
        }

        return true;
    },

    // -------------------------------------------------------

    getResult: function(tab, callback) {
        switch (this.heroesSelection) {
        case ConditionHeroesKind.AllTheHeroes:
            return this.allTheHeroes(tab, callback);
        case ConditionHeroesKind.NoneOfTheHeroes:
            return this.noneOfTheHeroes(tab, callback);
        case ConditionHeroesKind.AtLeastOneHero:
            return this.atLeastOneHero(tab, callback);
        case ConditionHeroesKind.TheHeroeWithInstanceID:
            return this.theHeroeWithInstanceID(tab, this.heroInstanceID
                .getValue(), callback);
        }
    },

    // -------------------------------------------------------

    initialize: function(){ return null; },

    // -------------------------------------------------------

    /** Check where to go according to the condition.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        var i, j, l, ll, id, result, data, value, nb, heroesSelection, h, equip;

        switch (this.kind) {
        case 0: // Variable / Param / Prop
            result = $operators_compare[this.variableParamPropOperationKind](
                this.variableParamProp.getValue(), this.variableParamPropValue
                .getValue());
            break;
        case 1:
            if (this.heroesInTeam) {
                heroesSelection = $game.getTeam(this.heroesInTeamSelection);
            } else {
                heroesSelection = $game.teamHeroes.concat($game.reserveHeroes);
                heroesSelection.concat($game.hiddenHeroes);
            }

            switch (this.heroesKind) {
            case 0:
                var name;

                name = this.heroesNamed.getValue();
                result = this.getResult(heroesSelection, function(hero) {
                    return hero.name === name;
                });
                break;
            case 1:
                var tab;

                tab = $game.getTeam(this.heroesInTeamValue);
                result = this.getResult(heroesSelection, function(hero) {
                    id = hero.instid;
                    for (i = 0, l = tab.length; i < l; i++) {
                        if (tab[i].instid === id) {
                            return true;
                        }
                    }
                    return false;
                });
                break;
            case 2:
                id = this.heroesSkillID.getValue();
                result = this.getResult(heroesSelection, function(hero) {
                    for (i = 0, l = hero.sk.length; i < l; i++) {
                        if (hero.sk[i].id === id) {
                            return true;
                        }
                    }
                    return false;
                });
                break;
            case 3:
                switch (this.heroesEquipedKind) {
                case 0:
                    id = this.heroesEquipedWeaponID.getValue();
                    result = this.getResult(heroesSelection, function(hero) {
                        for (i = 0, l = hero.equip.length; i < l; i++) {
                            equip = hero.equip[i];
                            if (equip && equip.k === ItemKind.Weapon && equip.id
                                === id)
                            {
                                return true;
                            }
                        }
                        return false;
                    });
                    break;
                case 1:
                    id = this.heroesEquipedArmorID.getValue();
                    result = this.getResult(heroesSelection, function(hero) {
                        for (i = 0, l = hero.equip.length; i < l; i++) {
                            equip = hero.equip[i];
                            if (equip && equip.k === ItemKind.Armor && equip.id
                                === id)
                            {
                                return true;
                            }
                        }
                        return false;
                    });
                    break;
                }
                break;
            case 4:
                // TODO
                break;
            case 5:
                data = $datasGame.battleSystem.statistics[this.heroesStatisticID
                    .getValue()];
                value = this.heroesStatisticValue.getValue();
                result = this.getResult(heroesSelection, function(hero) {
                    return $operators_compare[this.heroesStatisticOperation](
                        hero[data.abbreviation], value);
                });
                break;
            }
            break;
        case 2:
            result = $operators_compare[this.operationCurrency]($game.currencies
                [this.currencyID.getValue()], this.currencyValue.getValue());
            break;
        case 3:
            nb = 0;
            id = this.itemID.getValue();
            for (i = 0, l = $game.items.length; i < l; i++) {
                data = $game.items[i];
                if (data.k === ItemKind.Item && data.id === id) {
                    nb = data.nb;
                    break;
                }
            }
            result = $operators_compare[this.operationItem](nb, this.itemValue
                .getValue());
            break;
        case 4:
            nb = 0;
            id = this.weaponID.getValue();
            for (i = 0, l = $game.items.length; i < l; i++) {
                data = $game.items[i];
                if (data.k === ItemKind.Weapon && data.id === id) {
                    nb = data.nb;
                    break;
                }
            }
            if (this.weaponEquiped) {
                heroesSelection = $game.teamHeroes.concat($game.reserveHeroes);
                heroesSelection.concat($game.hiddenHeroes);
                for (i = 0, l = heroesSelection.length; i < l; i++) {
                    h = heroesSelection[i];
                    for (j = 0, ll = h.equip.length; j < ll; j++) {
                        equip = h.equip[j];
                        if (equip && equip.k === ItemKind.Weapon && equip.id ===
                            id)
                        {
                            nb += 1;
                        }
                    }
                }
            }
            result = $operators_compare[this.operationWeapon](nb, this
                .weaponValue.getValue());
            break;
        case 5:
            nb = 0;
            id = this.armorID.getValue();
            for (i = 0, l = $game.items.length; i < l; i++) {
                data = $game.items[i];
                if (data.k === ItemKind.Armor && data.id === id) {
                    nb = data.nb;
                    break;
                }
            }
            if (this.armorEquiped) {
                heroesSelection = $game.teamHeroes.concat($game.reserveHeroes);
                heroesSelection.concat($game.hiddenHeroes);
                for (i = 0, l = heroesSelection.length; i < l; i++) {
                    h = heroesSelection[i];
                    for (j = 0, ll = h.equip.length; j < ll; j++) {
                        equip = h.equip[j];
                        if (equip && equip.k === ItemKind.Armor && equip.id ===
                            id)
                        {
                            nb += 1;
                        }
                    }
                }
            }
            result = $operators_compare[this.operationArmor](nb, this.armorValue
                .getValue());
            break;
        case 6:
            data = $datasGame.keyBoard.list[this.keyID.getValue()];
            value = this.keyValue.getValue();
            result = !value;
            for (i = 0, l = $keysPressed.length; i < l; i++) {
                if (DatasKeyBoard.isKeyEqual($keysPressed[i], data)) {
                    result = value;
                    break;
                }
            }
            break;
        case 7:
            result = RPM.evaluateScript("return " + this.script.getValue());
            break;
        default:
            break;
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
    update: function(currentState, object, state) {
        if (!$allowMainMenu || currentState.opened) {
            return 1;
        }
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
    update: function(currentState, object, state) {
        if (!$allowSaves || currentState.opened) {
            return 1;
        }
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
