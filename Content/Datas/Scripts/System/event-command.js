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

class EventCommand
{
    constructor()
    {
        this.isDirectNode = true;
        this.parallel = false;
    }

    static getEventCommand(json)
    {
        let command = json.command;
        switch(json.kind)
        {
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
            case EventCommandKind.Label:
                return new EventCommandLabel(command);
            case EventCommandKind.JumpLabel:
                return new EventCommandJumpToLabel(command);
            case EventCommandKind.Comment:
                return new EventCommandComment();
            case EventCommandKind.ChangeAStatistic:
                return new EventCommandChangeAStatistic(command);
            case EventCommandKind.ChangeASkill:
                return new EventCommandChangeASkill(command);
            case EventCommandKind.ChangeName:
                return new EventCommandChangeName(command);
            case EventCommandKind.ChangeEquipment:
                return new EventCommandChangeEquipment(command);
            case EventCommandKind.ModifyCurrency:
                return new EventCommandModifyCurrency(command);
            case EventCommandKind.DisplayAnAnimation:
                return new EventCommandDisplayAnAnimation(command);
            case EventCommandKind.ShakeScreen:
                return new EventCommandShakeScreen(command);
            case EventCommandKind.FlashScreen:
                return new EventCommandFlashScreen(command);
            default:
                return null;
        }
    }

    // -------------------------------------------------------
    /** Initialize the current state
    *   @returns {Object} The current state (clicked)
    */
    initialize()
    {
        return null;
    }

    // -------------------------------------------------------
    /** Update and check if the event is finished
    *   @param {Object} currentState The current state of the event
    *   @param {MapObject} object The current object reacting
    *   @param {number} state The state ID
    *   @returns {number} The number of node to pass
    */
    update(currentState, object, state)
    {
        return 1;
    }

    // -------------------------------------------------------
    /** Update clicked to true
    *   @param {Object} currentState The current state of the event
    *   @param {number} key The key ID pressed
    */
    onKeyPressed(currentState, key)
    {

    }

    // -------------------------------------------------------

    onKeyReleased(currentState, key)
    {

    }

    // -------------------------------------------------------

    onKeyPressedRepeat(currentState, key)
    {
        return true;
    }

    // -------------------------------------------------------

    onKeyPressedAndRepeat(currentState, key)
    {

    }

    // -------------------------------------------------------
    /** Draw the dialog box
    *   @param {Object} currentState The current state of the event
    */
    drawHUD(currentState)
    {

    }
}

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
class EventCommandShowText extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        }
        this.interlocutor = SystemValue.createValueCommand(command, iterator);
        this.facesetID = command[iterator.i++];
        this.message = command[iterator.i++];
        this.windowMain = new WindowBox(0, 0, 0, 0,
            {
                content: new GraphicMessage(RPM.numToString(this.message), this
                    .facesetID),
                padding: RPM.HUGE_PADDING_BOX
            }
        );
        this.windowInterlocutor = new WindowBox(this.windowMain.oX + (RPM
            .MEDIUM_SLOT_HEIGHT / 2), this.windowMain.oY - (RPM
            .MEDIUM_SLOT_HEIGHT / 2), RPM.MEDIUM_SLOT_WIDTH, RPM
            .MEDIUM_SLOT_HEIGHT,
            {
                content: new GraphicText(RPM.STRING_EMPTY, { align: Align.Center }),
                padding: RPM.SMALL_SLOT_PADDING
            }
        );
        this.isDirectNode = false;
    }

    // -------------------------------------------------------
    /** Initialize the current state.
    *   @returns {Object} The current state (clicked).
    */
    initialize()
    {
        this.windowMain.setX(RPM.defaultValue(RPM.datasGame.system.dbOptions.vx,
            0));
        this.windowMain.setY(RPM.defaultValue(RPM.datasGame.system.dbOptions.vy,
            0));
        this.windowMain.setW(RPM.defaultValue(RPM.datasGame.system.dbOptions.vw,
            0));
        this.windowMain.setH(RPM.defaultValue(RPM.datasGame.system.dbOptions.vh,
            0));
        this.windowInterlocutor.setX(this.windowMain.oX + (RPM
            .MEDIUM_SLOT_HEIGHT / 2));
        this.windowInterlocutor.setY(this.windowMain.oY - (RPM
            .MEDIUM_SLOT_HEIGHT / 2));
        this.windowMain.padding[0] = RPM.defaultValue(RPM.datasGame.system
            .dbOptions.vpLeft, 0);
        this.windowMain.padding[1] = RPM.defaultValue(RPM.datasGame.system
            .dbOptions.vpTop, 0);
        this.windowMain.padding[2] = RPM.defaultValue(RPM.datasGame.system
            .dbOptions.vpRight, 0);
        this.windowMain.padding[3] = RPM.defaultValue(RPM.datasGame.system
            .dbOptions.vpBottom, 0);
        this.windowMain.updateDimensions();
        this.windowMain.content.update();
        this.windowInterlocutor.content.setText(this.interlocutor.getValue());
        return {
            clicked: false,
            frame: 0,
            frameTick: 0,
            frameDuration: 150
        }
    }

    // -------------------------------------------------------
    /** Update and check if the event is finished.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        if (currentState.clicked)
        {
            return 1;
        }
        currentState.frameTick += RPM.elapsedTime;
        if (currentState.frameTick >= currentState.frameDuration)
        {
            currentState.frame = (currentState.frame + 1) % RPM.FRAMES;
            currentState.frameTick = 0;
            RPM.requestPaintHUD = true;
        }
        this.windowInterlocutor.content.setText(this.interlocutor.getValue());
        return 0;
    }

    // -------------------------------------------------------
    /** Update clicked to true.
    *   @param {Object} currentState The current state of the event.
    *   @param {number} key The key ID pressed.
    */
    onKeyPressed(currentState, key)
    {
        if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard.menuControls
            .Action))
        {
            currentState.clicked = true;
        }
    }

    // -------------------------------------------------------
    /** Draw the dialog box.
    *   @param {Object} currentState The current state of the event.
    */
    drawHUD(currentState)
    {
        this.windowMain.draw();
        if (this.windowInterlocutor.content.text)
        {
            this.windowInterlocutor.draw();
        }
        if (currentState)
        {
            RPM.datasGame.system.getWindowSkin().drawArrowMessage(currentState
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
class EventCommandChangeVariables extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 2
        }

        // Selection
        this.selection = command[1];
        this.nbSelection = 1;
        if (command[0] === 1)
        {
            this.nbSelection = command[iterator.i++] - this.selection;
        }

        // Operation
        this.operation = command[iterator.i++];

        // Value
        this.valueKind = command[iterator.i++];
        switch (this.valueKind)
        {
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
    }

    initialize()
    {
        return {
            started: false,
        };
    }

    /** Parse command and change the variable values, and then finish.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        if (!currentState.started)
        {
            currentState.started = true;
            // Get value to set
            switch (this.valueKind)
            {
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
                let objectID = this.valueMapObject.getValue();
                MapObject.updateObjectWithID(object, objectID, this, function(
                    obj)
                {
                    switch(this.valueMapObjectChar)
                    {
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
        if (!RPM.isUndefined(currentState.value))
        {
            for (let i = 0, l = this.nbSelection; i < l; i++)
            {
                RPM.game.variables[this.selection + i] = RPM.operators_numbers[
                    this.operation](RPM.game.variables[this.selection + i],
                    currentState.value);
            }
        }
        return RPM.isUndefined(currentState.value) ? 0 : 1;
    }
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
class EventCommandEndGame extends EventCommand
{
    constructor(command)
    {
        super();
    }

    /** Quit the game.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        Platform.quit();
    }
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
class EventCommandWhile extends EventCommand
{
    constructor(command)
    {
        super();
    }

    /** Go inside the loop block.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        return -1;
    }

    goToNextCommand()
    {
        return 2;
    }
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
class EventCommandWhileBreak extends EventCommand
{
    constructor(command)
    {
        super();
    }

    /** Go outside the loop block.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        return -2;
    }
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
class EventCommandInputNumber extends EventCommand
{
    constructor(command)
    {
        super();

        // TODO
        this.id = parseInt(command[0]);
        this.isDirectNode = false;
    }

    /** Initialize the current state.
    *   @returns {Object} The current state (entered, confirmed).
    */
    initialize()
    {
        return {
            entered: "",
            confirmed: false
        }
    }

    // -------------------------------------------------------
    /** Finish after confirmation.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        if (currentState.confirmed)
        {
            RPM.datasGame.variables[this.id] = currentState.entered;
            return 1;
        }
        return 0;
    }

    // -------------------------------------------------------
    /** Update confirmed to true, or update text entered.
    *   @param {Object} currentState The current state of the event.
    *   @param {number} key The key ID pressed.
    */
    onKeyPressed(currentState, key)
    {
        if (key === KeyEvent.DOM_VK_ENTER)
        {
            currentState.confirmed = true;
        } else
        {
            if (KeyEvent.isKeyNumberPressed(key))
            {
                currentState.entered += KeyEvent.getKeyChar(key);
            }
        }
    }

    // -------------------------------------------------------
    /** Draw number entered.
    *   @param {Object} currentState The current state of the event.
    */
    drawHUD(currentState)
    {
        Platform.ctx.fillText(currentState.entered, RPM.CANVAS_WIDTH / 2, RPM
            .CANVAS_HEIGHT / 2);
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
class EventCommandIf extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        }
        this.hasElse = RPM.numToBool(command[iterator.i++]);
        this.kind = command[iterator.i++];
        switch (this.kind)
        {
        case 0: // Variable / Param / Prop
            this.variableParamProp = SystemValue.createValueCommand(command, 
                iterator);
            this.variableParamPropOperationKind = command[iterator.i++];
            this.variableParamPropValue = SystemValue.createValueCommand(command
                , iterator);
            break;
        case 1: // Heroes
            this.heroesSelection = command[iterator.i++];
            if (this.heroesSelection === ConditionHeroesKind
                .TheHeroeWithInstanceID)
            {
                this.heroInstanceID = SystemValue.createValueCommand(command, 
                    iterator);
            }
            this.heroesInTeam = RPM.numToBool(command[iterator.i++]);
            if (this.heroesInTeam)
            {
                this.heroesInTeamSelection = command[iterator.i++];
            }
            this.heroesKind = command[iterator.i++];
            switch (this.heroesKind)
            {
            case 0:
                this.heroesNamed = SystemValue.createValueCommand(command, 
                    iterator);
                break;
            case 1:
                this.heroesInTeamValue = command[iterator.i++];
                break;
            case 2:
                this.heroesSkillID = SystemValue.createValueCommand(command, 
                    iterator);
                break;
            case 3:
                this.heroesEquipedKind = command[iterator.i++];
                switch (this.heroesEquipedKind)
                {
                case 0:
                    this.heroesEquipedWeaponID = SystemValue.createValueCommand(
                        command, iterator);
                    break;
                case 1:
                    this.heroesEquipedArmorID = SystemValue.createValueCommand(
                        command, iterator);
                    break;
                }
                break;
            case 4:
                this.heroesStatusID = SystemValue.createValueCommand(command, 
                    iterator);
                break;
            case 5:
                this.heroesStatisticID = SystemValue.createValueCommand(command, 
                    iterator);
                this.heroesStatisticOperation = command[iterator.i++];
                this.heroesStatisticValue = SystemValue.createValueCommand(
                    command, iterator);
                break;
            }
            break;
        case 2:
            this.currencyID = SystemValue.createValueCommand(command, iterator);
            this.operationCurrency = command[iterator.i++];
            this.currencyValue = SystemValue.createValueCommand(command, 
                iterator);
            break;
        case 3:
            this.itemID = SystemValue.createValueCommand(command, iterator);
            this.operationItem = command[iterator.i++];
            this.itemValue = SystemValue.createValueCommand(command, iterator);
            break;
        case 4:
            this.weaponID = SystemValue.createValueCommand(command, iterator);
            this.operationWeapon = command[iterator.i++];
            this.weaponValue = SystemValue.createValueCommand(command, iterator);
            this.weaponEquiped = RPM.numToBool(command[iterator.i++]);
            break;
        case 5:
            this.armorID = SystemValue.createValueCommand(command, iterator);
            this.operationArmor = command[iterator.i++];
            this.armorValue = SystemValue.createValueCommand(command, iterator);
            this.armorEquiped = RPM.numToBool(command[iterator.i++]);
            break;
        case 6:
            this.keyID = SystemValue.createValueCommand(command, iterator);
            this.keyValue = SystemValue.createValueCommand(command, iterator);
            break;
        case 7:
            this.script = SystemValue.createValueCommand(command, iterator);
            break;
        }
    }

    allTheHeroes(tab, callback)
    {
        for (let i = 0, l = tab.length; i < l; i++)
        {
            if (!callback.call(this, tab[i]))
            {
                return false;
            }
        }
        return true;
    }

    // -------------------------------------------------------

    noneOfTheHeroes(tab, callback)
    {
        for (let i = 0, l = tab.length; i < l; i++)
        {
            if (callback.call(this, tab[i]))
            {
                return false;
            }
        }
        return true;
    }

    // -------------------------------------------------------

    atLeastOneHero(tab, callback)
    {
        for (let i = 0, l = tab.length; i < l; i++)
        {
            if (callback.call(this, tab[i]))
            {
                return true;
            }
        }
        return false;
    }

    // -------------------------------------------------------

    theHeroeWithInstanceID(tab, id, callback)
    {
        let hero;
        for (let i = 0, l = tab.length; i < l; i++)
        {
            hero = tab[i];
            if (hero.instid === id && !callback.call(this, hero))
            {
                return false;
            }
        }
        return true;
    }

    // -------------------------------------------------------

    getResult(tab, callback)
    {
        switch (this.heroesSelection)
        {
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
    }

    // -------------------------------------------------------
    /** Check where to go according to the condition.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        let i, j, l, m, result, heroesSelection, id, equip, data, value, nb;
        switch (this.kind)
        {
        case 0: // Variable / Param / Prop
            result = RPM.operators_compare[this.variableParamPropOperationKind](
                this.variableParamProp.getValue(), this.variableParamPropValue
                .getValue());
            break;
        case 1:
            if (this.heroesInTeam)
            {
                heroesSelection = RPM.game.getTeam(this.heroesInTeamSelection);
            } else {
                heroesSelection = RPM.game.teamHeroes.concat(RPM.game
                    .reserveHeroes);
                heroesSelection.concat(RPM.game.hiddenHeroes);
            }
            switch (this.heroesKind)
            {
            case 0:
                let name = this.heroesNamed.getValue();
                result = this.getResult(heroesSelection, (hero) => {
                    return hero.name === name;
                });
                break;
            case 1:
                let tab = RPM.game.getTeam(this.heroesInTeamValue);
                result = this.getResult(heroesSelection, (hero) => {
                    id = hero.instid;
                    for (i = 0, l = tab.length; i < l; i++)
                    {
                        if (tab[i].instid === id)
                        {
                            return true;
                        }
                    }
                    return false;
                });
                break;
            case 2:
                id = this.heroesSkillID.getValue();
                result = this.getResult(heroesSelection, (hero) => {
                    for (i = 0, l = hero.sk.length; i < l; i++)
                    {
                        if (hero.sk[i].id === id)
                        {
                            return true;
                        }
                    }
                    return false;
                });
                break;
            case 3:
                switch (this.heroesEquipedKind)
                {
                case 0:
                    id = this.heroesEquipedWeaponID.getValue();
                    result = this.getResult(heroesSelection, (hero) => {
                        for (i = 0, l = hero.equip.length; i < l; i++)
                        {
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
                    result = this.getResult(heroesSelection, (hero) => {
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
                data = RPM.datasGame.battleSystem.statistics[this
                    .heroesStatisticID.getValue()];
                value = this.heroesStatisticValue.getValue();
                result = this.getResult(heroesSelection, (hero) => {
                    return RPM.operators_compare[this.heroesStatisticOperation](
                        hero[data.abbreviation], value);
                });
                break;
            }
            break;
        case 2:
            result = RPM.operators_compare[this.operationCurrency](RPM.game
                .currencies[this.currencyID.getValue()], this.currencyValue
                .getValue());
            break;
        case 3:
            nb = 0;
            id = this.itemID.getValue();
            for (i = 0, l = RPM.game.items.length; i < l; i++)
            {
                data = RPM.game.items[i];
                if (data.k === ItemKind.Item && data.id === id)
                {
                    nb = data.nb;
                    break;
                }
            }
            result = RPM.operators_compare[this.operationItem](nb, this
                .itemValue.getValue());
            break;
        case 4:
            nb = 0;
            id = this.weaponID.getValue();
            for (i = 0, l = RPM.game.items.length; i < l; i++)
            {
                data = RPM.game.items[i];
                if (data.k === ItemKind.Weapon && data.id === id)
                {
                    nb = data.nb;
                    break;
                }
            }
            if (this.weaponEquiped)
            {
                heroesSelection = RPM.game.teamHeroes.concat(RPM.game
                    .reserveHeroes);
                heroesSelection.concat(RPM.game.hiddenHeroes);
                let h;
                for (i = 0, l = heroesSelection.length; i < l; i++)
                {
                    h = heroesSelection[i];
                    for (j = 0, m = h.equip.length; j < m; j++)
                    {
                        equip = h.equip[j];
                        if (equip && equip.k === ItemKind.Weapon && equip.id ===
                            id)
                        {
                            nb += 1;
                        }
                    }
                }
            }
            result = RPM.operators_compare[this.operationWeapon](nb, this
                .weaponValue.getValue());
            break;
        case 5:
            nb = 0;
            id = this.armorID.getValue();
            for (i = 0, l = RPM.game.items.length; i < l; i++)
            {
                data = RPM.game.items[i];
                if (data.k === ItemKind.Armor && data.id === id)
                {
                    nb = data.nb;
                    break;
                }
            }
            if (this.armorEquiped)
            {
                heroesSelection = RPM.game.teamHeroes.concat(RPM.game
                    .reserveHeroes);
                heroesSelection.concat(RPM.game.hiddenHeroes);
                for (i = 0, l = heroesSelection.length; i < l; i++)
                {
                    h = heroesSelection[i];
                    for (j = 0, ll = h.equip.length; j < ll; j++)
                    {
                        equip = h.equip[j];
                        if (equip && equip.k === ItemKind.Armor && equip.id ===
                            id)
                        {
                            nb += 1;
                        }
                    }
                }
            }
            result = RPM.operators_compare[this.operationArmor](nb, this
                .armorValue.getValue());
            break;
        case 6:
            data = RPM.datasGame.keyBoard.list[this.keyID.getValue()];
            value = this.keyValue.getValue();
            result = !value;
            for (i = 0, l = RPM.keysPressed.length; i < l; i++)
            {
                if (DatasKeyBoard.isKeyEqual(RPM.keysPressed[i], data))
                {
                    result = value;
                    break;
                }
            }
            break;
        case 7:
            result = RPM.evaluateScript("return " + this.script.getValue());
            break;
        case 8:
            result = RPM.escaped;
            break;
        default:
            break;
        }
        if (result)
        {
            return -1;
        } else
        {
            return 1 + (this.hasElse ? 0 : 1);
        }
    }

    // -------------------------------------------------------
    /** Returns the number of node to pass.
    *   @returns {number}
    */
    goToNextCommand()
    {
        return 2 + (this.hasElse ? 1 : 0);
    }
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
class EventCommandElse extends EventCommand
{
    constructor(command)
    {
        super();
    }

    /** Go inside the else block.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        return -1;
    }

    // -------------------------------------------------------
    /** Returns the number of node to pass.
    *   @returns {number}
    */
    goToNextCommand()
    {
        return 2;
    }
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
class EventCommandOpenMainMenu extends EventCommand
{
    constructor(command)
    {
        super();

        this.isDirectNode = false;
    }

    /** Initialize the current state.
    *   @returns {Object} The current state (opened).
    */
    initialize()
    {
        return {
            opened: false
        }
    }

    // -------------------------------------------------------
    /** Open the menu.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        if (!RPM.allowMainMenu || currentState.opened)
        {
            return 1;
        }
        RPM.gameStack.push(new SceneMenu());
        currentState.opened = true;
        return 0;
    }
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
class EventCommandOpenSavesMenu extends EventCommand
{
    constructor(command)
    {
        super();

        this.isDirectNode = false;
    }

    /** Initialize the current state.
    *   @returns {Object} The current state (opened).
    */
    initialize()
    {
        return {
            opened: false
        }
    }

    // -------------------------------------------------------

    /** Open the menu.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        if (!RPM.allowSaves || currentState.opened)
        {
            return 1;
        }
        RPM.gameStack.push(new SceneSaveGame());
        currentState.opened = true;
        return 0;
    }
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
class EventCommandModifyInventory extends EventCommand
{
    constructor(command)
    {
        super();
        
        let iterator = {
            i: 0
        }
        this.itemKind = command[iterator.i++];
        this.itemID = SystemValue.createValueCommand(command, iterator);
        this.operation = command[iterator.i++];
        this.value = SystemValue.createValueCommand(command, iterator);
    }

    // -------------------------------------------------------
    /** Update the inventory and finish.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        let item = new GameItem(this.itemKind, this.itemID.getValue(), this
            .value.getValue());

        // Doing the coresponding operation
        switch(this.operation)
        {
        case 0:
            item.equalItems();
            break;
        case 1:
            item.addItems();
            break;
        case 2:
            item.removeItems();
            break;
        case 3:
            item.multItems();
            break;
        case 4:
            item.divItems();
            break;
        case 5:
            item.moduloItems();
            break;
        }
        return 1;
    }
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
class EventCommandModifyTeam extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        }
        this.addingKind = command[iterator.i++];
        switch (this.addingKind)
        {
        case 0: // If create new instance
            this.instanceLevel = SystemValue.createValueCommand(command, 
                iterator);
            this.instanceTeam = command[iterator.i++];
            this.stockVariableID = command[iterator.i++];
            this.instanceKind = command[iterator.i++];
            this.instanceID = command[iterator.i++];
            break;
        case 1:
            this.addRemoveKind = command[iterator.i++];
            this.addRemoveID = SystemValue.createValueCommand(command, iterator);
            this.addRemoveTeam = this.command[iterator.i++];
            break;
        }
    }

    /** Instanciate a new character in a group.
    *   @static
    *   @param {GroupKind} where In which group we should instanciate.
    *   @param {CharacterKind} type The type of character to instanciate.
    *   @param {number} id The ID of the character to instanciate.
    *   @param {number} stockID The ID of the variable where we will stock the
    *   instantiate ID.
    */
    static instanciateTeam(where, type, id, level, stockID)
    {
        // Stock the instanciation id in a variable
        RPM.game.variables[stockID] = RPM.game.charactersInstances;

        // Adding the instanciated character in the right group
        let player = new GamePlayer(type, id, RPM.game.charactersInstances++, []);
        player.instanciate(level);
        let group;
        switch (where)
        {
        case 0:
            group = RPM.game.teamHeroes;
            break;
        case 1: 
            group = RPM.game.reserveHeroes;
            break;
        case 2:
            group = RPM.game.hiddenHeroes;
            break;
        }
        group.push(player);
    }

    /** Add or remove a character in a group.
    *   @param {CharacterKind} kind The type of character to instanciate.
    *   @param {number} id The ID of the character to instanciate.
    *   @param {GroupKind} where In which group we should instanciate.
    */
    addRemove(kind, id, where)
    {
        // Serching for the id
        let groups = [RPM.game.teamHeroes, RPM.game.reserveHeroes, RPM.game
            .hiddenHeroes];
        let group = null;
        let i, j, l, m, g, player;
        for (i = 0, l = groups.length; i < l; i++)
        {
            g = groups[i];
            for (j = 0, m = g.length; j < m; j++)
            {
                player = g[j];
                if (player.instid === id)
                {
                    group = g;
                    break;
                }
            }
            if (group !== null)
            {
                break;
            }
        }
        if (group !== null)
        {
            group.splice(j, 1);
            if (kind === 0)
            {
                groups[where].push(player);
            }
        }
    }

    // -------------------------------------------------------
    /** Parsing, modifying the team and finishing.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        switch (this.addingKind)
        {
        case 0:
            EventCommandModifyTeam.instanciateTeam(this.instanceTeam, this
                .instanceKind, this.instanceID, this.instanceLevel.getValue(),
                this.stockVariableID);
            break;
        case 1:
            this.addRemove(this.addRemoveKind, this.addRemoveId.getValue(), this
                .addRemoveTeam);
            break;
        }
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandStartBattle
//
// -------------------------------------------------------

/** @class
*   An event command for battle processing.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {boolean} canEscape Boolean indicating if the player can escape
*   this battle.
*   @property {boolean} canGameOver Boolean indicating if there a win/lose node
*   or not.
*   @property {JSON} command Direct JSON command to parse.
*   @param {JSON} command Direct JSON command to parse.
*/
class EventCommandStartBattle extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        }
        this.battleMapID = null;
        this.idMap = null;
        this.x = null;
        this.y = null;
        this.yPlus = null;
        this.z = null;

        // Options
        this.canEscape = RPM.numToBool(command[iterator.i++]);
        this.canGameOver = RPM.numToBool(command[iterator.i++]);

        // Troop
        let type = command[iterator.i++];
        switch(type){
        case 0: // Existing troop ID
            this.troopID = SystemValue.createValueCommand(command, iterator);
            break;
        case 1: // If random troop in map properties
            // TODO
        }

        // Battle map
        type = command[iterator.i++];
        switch(type)
        {
        case 0: // Existing battle map ID
            this.battleMapID = SystemValue.createValueCommand(command, iterator);
            break;
        case 1: // Select
            this.idMap = SystemValue.createNumber(command[iterator.i++]);
            this.x = SystemValue.createNumber(command[iterator.i++]);
            this.y = SystemValue.createNumber(command[iterator.i++]);
            this.yPlus = SystemValue.createNumber(command[iterator.i++]);
            this.z = SystemValue.createNumber(command[iterator.i++]);
            break;
        case 2: // Numbers
            this.idMap = SystemValue.createValueCommand(command, iterator);
            this.x = SystemValue.createValueCommand(command, iterator);
            this.y = SystemValue.createValueCommand(command, iterator);
            this.yPlus = SystemValue.createValueCommand(command, iterator);
            this.z = SystemValue.createValueCommand(command, iterator);
            break;
        }

        // Transition
        this.transitionStart = command[iterator.i++];
        if (RPM.numToBool(this.transitionStart))
        {
            this.transitionStartColor = SystemValue.createValueCommand(command, 
                iterator);
        }
        this.transitionEnd = command[iterator.i++];
        if (RPM.numToBool(this.transitionEnd))
        {
            this.transitionEndColor = SystemValue.createValueCommand(command, 
                iterator);
        }
        this.isDirectNode = false;
    }

    /** Initialize the current state.
    *   @returns {Object} The current state (sceneBattle).
    */
    initialize()
    {
        return {
            mapScene: null,
            sceneBattle: null
        };
    }

    // -------------------------------------------------------
    /** Parsing and starting a battle scene.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        // Initializing battle
        if (currentState.sceneBattle === null)
        {
            let battleMap = (this.battleMapID === null) ? SystemBattleMap.create
                (this.idMap.getValue(), [this.x.getValue(), this.y.getValue(), 
                this.yPlus.getValue(), this.z.getValue()]) : RPM.datasGame
                .battleSystem.battleMaps[this.battleMapID.getValue()];
            RPM.game.heroBattle = {
                position: RPM.positionToVector3(battleMap.position)
            };

            // Defining the battle state instance
            let sceneBattle = new SceneBattle(this.troopID.getValue(), this
                .canGameOver, this.canEscape, battleMap, this.transitionStart, 
                this.transitionEnd, this.transitionStartColor ? RPM.datasGame
                .system.colors[this.transitionStartColor.getValue()] : null, 
                this.transitionEndColor ? RPM.datasGame.system.colors[this
                .transitionEndColor.getValue()] : null);
            
            // Keep instance of battle state for results
            currentState.sceneBattle = sceneBattle;
            currentState.mapScene = RPM.gameStack.top;
            RPM.gameStack.push(sceneBattle);
            return 0; // Stay on this command as soon as we are in battle state
        }

        // If there are not game overs, go to win/lose nodes
        if (!this.canGameOver && !currentState.sceneBattle.winning)
        {
            return 2;
        }
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandIfWin
//
// -------------------------------------------------------

/** @class
*   An event command for after a battle winning.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @param {JSON} command Direct JSON command to parse.
*/
class EventCommandIfWin extends EventCommand
{
    constructor(command)
    {
        super();
    }

    /** Go inside the ifWin node.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        return -1;
    }

    // -------------------------------------------------------
    /** Returns the number of node to pass.
    *   @returns {number}
    */
    goToNextCommand()
    {
        return 3;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandIfLose
//
// -------------------------------------------------------

/** @class
*   An event command for after a battle winning.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @param {JSON} command Direct JSON command to parse.
*/
class EventCommandIfLose extends EventCommand
{
    constructor(command)
    {
        super();
    }

    /** Go inside the ifLose node.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        return -1;
    }

    // -------------------------------------------------------
    /** Returns the number of node to pass.
    *   @returns {number}
    */
    goToNextCommand()
    {
        return 2;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandChangeState
//
// -------------------------------------------------------

/** @class
*   An event command for changing an object state.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {number} idState The ID of the state to change.
*   @property {number} operationKind Index of operation.
*   @param {JSON} command Direct JSON command to parse.
*/
class EventCommandChangeState extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        }
        this.mapID = SystemValue.createValueCommand(command, iterator);
        this.objectID = SystemValue.createValueCommand(command, iterator);
        this.idState = SystemValue.createValueCommand(command, iterator);
        this.operationKind = command[iterator.i++];
    }

    /** Add a state to an object.
    *   @static
    *   @param {Object} portionDatas Datas inside a portion.
    *   @param {number} index Index in the portion datas.
    *   @param {number} state ID of the state.
    */
    static addState(portionDatas, index, state)
    {
        let states = portionDatas.s[index];
        if (states.indexOf(state) === -1)
        {
            states.push(state);
        }
        EventCommandChangeState.removeFromDatas(portionDatas, index, states);
    }

    // -------------------------------------------------------
    /** Remove a state from an object.
    *   @static
    *   @param {Object} portionDatas Datas inside a portion.
    *   @param {number} index Index in the portion datas.
    *   @param {number} state ID of the state.
    */
    static removeState(portionDatas, index, state)
    {
        let states = portionDatas.s[index];
        let indexState = states.indexOf(state);
        if (states.indexOf(state) !== -1)
        {
            states.splice(indexState, 1);
        }
        EventCommandChangeState.removeFromDatas(portionDatas, index, states);
    }

    // -------------------------------------------------------
    /** Remove all the states from an object.
    *   @static
    *   @param {Object} portionDatas Datas inside a portion.
    *   @param {number} index Index in the portion datas.
    *   @param {number} state ID of the state.
    */
    static removeAll(portionDatas, index)
    {
        portionDatas.s[index] = [];
    }

    // -------------------------------------------------------
    /** Remove states from datas.
    *   @static
    *   @param {Object} portionDatas Datas inside a portion.
    *   @param {number} index Index in the portion datas.
    *   @param {number} state ID of the state.
    */
    static removeFromDatas(portionDatas, index, states)
    {
        if (states.length === 1 && states[0] === 1)
        {
            portionDatas.si.splice(index, 1);
            portionDatas.s.splice(index, 1);
        }
    }

    // -------------------------------------------------------

    static addStateSpecial(states, state)
    {
        if (states.indexOf(state) === -1)
        {
            states.push(state);
        }
    }

    // -------------------------------------------------------

    static removeStateSpecial(states, state)
    {
        let indexState = states.indexOf(state);
        if (indexState !== -1) {
            states.splice(indexState, 1);
        }
    }

    initialize()
    { 
        return {
            map: null,
            object: null,
            mapID: this.mapID.getValue(),
            objectID: this.objectID.getValue()
        }; 
    }

    /** Change the state of the object and finish.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        if (!currentState.waitingObject)
        {
            if (currentState.map === null)
            {
                if (currentState.mapID === -1 || currentState.mapID === RPM
                    .currentMap.id || currentState.objectID === -1)
                {
                    currentState.map = RPM.currentMap;
                } else
                {
                    currentState.map = new SceneMap(currentState.mapID, false, 
                        true);
                    currentState.map.readMapProperties();
                    currentState.map.initializeObjects();
                }
            }
            if (currentState.map.allObjects && currentState.map
                .portionsObjectsUpdated)
            {
                if (currentState.map === RPM.currentMap)
                {
                    MapObject.updateObjectWithID(object, currentState.objectID, 
                        this, function(moved)
                    {
                        currentState.object = moved;
                    });
                } else
                {
                    currentState.object = {};
                }
                currentState.waitingObject = true;
            }
        }
        if (currentState.waitingObject && currentState.object !== null) 
        {
            if (currentState.object.isHero || currentState.object.isStartup) 
            {
                let states = currentState.object.isHero ? RPM.game.heroStates : 
                    RPM.game.startupStates[RPM.currentMap.id];
                switch (this.operationKind)
                {
                case 0: // Replacing
                    if (currentState.object.isHero)
                    {
                        RPM.game.heroStates = [];
                    } else
                    {
                        RPM.game.startupStates[RPM.currentMap.id] = [];
                    }
                    states = currentState.object.isHero ? RPM.game.heroStates : 
                        RPM.game.startupStates[RPM.currentMap.id];
                    EventCommandChangeState.addStateSpecial(states, this.idState
                        .getValue());
                    break;
                case 1: // Adding
                    EventCommandChangeState.addStateSpecial(states, this.idState
                        .getValue());
                    break;
                case 2: // Deleting
                    EventCommandChangeState.removeStateSpecial(states, this
                        .idState.getValue());
                    break;
                }
            } else
            {
                let objectID = currentState.objectID === -1 ? object.system.id : 
                    currentState.objectID;
                let portion = SceneMap.getGlobalPortion(currentState.map
                    .allObjects[objectID]);
                let portionDatas = RPM.game.getPotionsDatas(currentState.map.id,
                    portion[0],portion[1],portion[2]);
                let indexState = portionDatas.si.indexOf(objectID);
                if (indexState === -1)
                {
                    indexState = portionDatas.si.length;
                    portionDatas.si.push(objectID);
                    portionDatas.s.push([1]);
                }

                switch (this.operationKind)
                {
                case 0: // Replacing
                    EventCommandChangeState.removeAll(portionDatas, indexState);
                    EventCommandChangeState.addState(portionDatas, indexState,
                        this.idState.getValue());
                    break;
                case 1: // Adding
                    EventCommandChangeState.addState(portionDatas, indexState,
                        this.idState.getValue());
                    break;
                case 2: // Deleting
                    EventCommandChangeState.removeState(portionDatas, indexState,
                        this.idState.getValue());
                    break;
                }
            }
            if (currentState.map === RPM.currentMap)
            {
                currentState.object.changeState();
            }
            return 1;
        }
        return 0;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandSendEvent
//
// -------------------------------------------------------

/** @class
*   An event command for sending an event.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {number} targetKind The kind of target.
*   @property {number} idTarget ID of target.
*   @property {boolean} isSystem Boolean indicating if it is an event system.
*   @property {number} eventId ID of the event.
*   @property {SystemParameter[]} parameters List of all the parameters.
*   @param {JSON} command Direct JSON command to parse.
*/
class EventCommandSendEvent extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        }

        // Target
        let l = command.length;
        this.targetKind = command[iterator.i++];
        this.senderNoReceiver = false;
        switch (this.targetKind)
        {
        case 1:
            this.idTarget = SystemValue.createValueCommand(command, iterator);
            this.senderNoReceiver = RPM.numToBool(command[iterator.i++]);
            break;
        case 2:
            this.idTarget = SystemValue.createValueCommand(command, iterator);
            break;
        }

        this.isSystem = !RPM.numToBool(command[iterator.i++]);
        this.eventId = command[iterator.i++];

        // Parameters
        let events = this.isSystem ? RPM.datasGame.commonEvents.eventsSystem :
                RPM.datasGame.commonEvents.eventsUser;
        let parameters = events[this.eventId].parameters;
        this.parameters = [];
        let parameter, paramID, k;
        while (iterator.i < l)
        {
            paramID = command[iterator.i++];
            k = command[iterator.i++];
            if (k <= PrimitiveValueKind.Default)
            {
                // If default value
                parameter = k === PrimitiveValueKind.Default ? parameters[
                    paramID].value : SystemValue.create(k, null);
            } else
            {
                parameter = SystemValue.create(k, command[iterator.i++]);
            }
            this.parameters[paramID] = parameter;
        }
    }

    // -------------------------------------------------------
    /** Send an event.
    *   @static
    *   @param {MapObject} sender The sender of this event.
    *   @param {number} targetKind The kind of target.
    *   @param {number} idTarget ID of target.
    *   @param {boolean} isSystem Boolean indicating if it is an event system.
    *   @param {number} eventId ID of the event.
    *   @param {SystemParameter[]} parameters List of all the parameters.
    */
    static sendEvent(sender, targetKind, idTarget, isSystem, idEvent, parameters
        , senderNoReceiver)
    {
        switch (targetKind)
        {
        case 0: // Send to all
            EventCommandSendEvent.sendEventDetection(sender, -1, isSystem, 
                idEvent, parameters);
            break;
        case 1: // Send to detection
            EventCommandSendEvent.sendEventDetection(sender, idTarget, isSystem,
                idEvent, parameters, senderNoReceiver);
            break;
        case 2: // Send to a particular object
            if (idTarget === -1)
            {
                // Send to sender
                sender.receiveEvent(sender, isSystem, idEvent, parameters, 
                    sender.states);
            } else if (idTarget === 0)
            {
                // Send to the hero
                RPM.game.hero.receiveEvent(sender, isSystem, idEvent, parameters
                    , RPM.game.heroStates);
            } else
            {
                RPM.currentMap.updatePortions(this, function(x, y, z, i, j, k)
                {
                    let objects = RPM.game.getPotionsDatas(RPM.currentMap.id, x,
                        y, z);

                    // Moved objects
                    let a, l, object;
                    for (a = 0, l = objects.min.length; a < l; a++)
                    {
                        object = objects.min[a];
                        if (object.system.id === idTarget)
                        {
                            object.receiveEvent(sender, isSystem, idEvent,
                                parameters, object.states);
                            break;
                        }
                    }
                    for (a = 0, l = objects.mout.length; a < l; a++)
                    {
                        object = objects.mout[a];
                        if (object.system.id === idTarget)
                        {
                            object.receiveEvent(sender, isSystem, idEvent,
                                parameters, object.states);
                            break;
                        }
                    }

                    // Static
                    let mapPortion = RPM.currentMap.getMapPortion(i, j, k);
                    if (mapPortion)
                    {
                        for (a = 0, l = mapPortion.objectsList.length; a < l; 
                            a++)
                        {
                            object = mapPortion.objectsList[a];
                            if (object.system.id === idTarget)
                            {
                                object.receiveEvent(sender, isSystem, idEvent,
                                    parameters, object.states);
                                break;
                            }
                        }
                        if (mapPortion.heroID === idTarget)
                        {
                            RPM.game.hero.receiveEvent(sender, isSystem, idEvent
                                , parameters, RPM.game.heroStates);
                        }
                    }
                });
            }
            break;
        }
    }

    // -------------------------------------------------------

    static sendEventDetection(sender, idTarget, isSystem, idEvent, parameters, 
        senderNoReceiver)
    {
        RPM.currentMap.updatePortions(this, function(x, y, z, i, j, k)
        {
            let objects = RPM.game.getPotionsDatas(RPM.currentMap.id, x, y, z);

            // Moved objects
            EventCommandSendEvent.sendEventObjects(objects.min, objects, sender, 
                idTarget, isSystem, idEvent, parameters, senderNoReceiver);
            EventCommandSendEvent.sendEventObjects(objects.mout, objects, sender
                , idTarget, isSystem, idEvent, parameters, senderNoReceiver);

            // Static
            let mapPortion = RPM.currentMap.getMapPortion(i, j, k);
            if (mapPortion)
            {
                EventCommandSendEvent.sendEventObjects(mapPortion.objectsList,
                    objects, sender, idTarget, isSystem, idEvent, parameters, 
                    senderNoReceiver);
            }
        });

        // And the hero!
        if (!senderNoReceiver || sender !== RPM.game.hero)
        {
            if (idTarget !== -1)
            {
                // Check according to detection model
                if (!RPM.datasGame.system.detections[idTarget].checkCollision(
                    sender, RPM.game.hero))
                {
                    return;
                }
            }
            RPM.game.hero.receiveEvent(sender, isSystem, idEvent, parameters, 
                RPM.game.heroStates);
        }
    }

    // -------------------------------------------------------

    static sendEventObjects(objects, portionDatas, sender, idTarget, isSystem, 
        idEvent, parameters, senderNoReceiver)
    {
        let object;
        for (let i = 0, l = objects.length; i < l; i++)
        {
            object = objects[i];
            if (senderNoReceiver && sender === object)
            {
                continue;
            }
            if (idTarget !== -1)
            {
                // Check according to detection model
                if (!RPM.datasGame.system.detections[idTarget].checkCollision(
                    sender, object))
                {
                    continue;
                }
            }

            // Make the object receive the event
            object.receiveEvent(sender, isSystem, idEvent, parameters, object.states);
        }
    }

    /** Send the event and finish.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        EventCommandSendEvent.sendEvent(object, this.targetKind, this.idTarget
            .getValue(), this.isSystem, this.eventId, this.parameters, this
            .senderNoReceiver);
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandTeleportObject
//
// -------------------------------------------------------

/** @class
*   An event command for teleporting an object.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {number} objectID The ID of the object to teleport.
*   @property {number} idMap The ID of the map.
*   @property {number} x The x coordinate of the map.
*   @property {number} y The y coordinate of the map.
*   @property {number} yPlus The y plus coordinate of the map.
*   @property {number} z The z coordinate of the map.
*   @property {number} objectIDPosition The ID of the object to teleport on.
*   @param {JSON} command Direct JSON command to parse.
*/
class EventCommandTeleportObject extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        }

        // Object ID
        this.objectID = SystemValue.createValueCommand(command, iterator);

        // Position
        this.objectIDPosition = null;
        this.idMap = null;
        switch (command[iterator.i++])
        {
        case 0:
            this.idMap = SystemValue.createNumber(command[iterator.i++]);
            this.x = SystemValue.createNumber(command[iterator.i++]);
            this.y = SystemValue.createNumber(command[iterator.i++]);
            this.yPlus = SystemValue.createNumber(command[iterator.i++]);
            this.z = SystemValue.createNumber(command[iterator.i++]);
            break;
        case 1:
            this.idMap = SystemValue.createValueCommand(command, iterator);
            this.x = SystemValue.createValueCommand(command, iterator);
            this.y = SystemValue.createValueCommand(command, iterator);
            this.yPlus = SystemValue.createValueCommand(command, iterator);
            this.z = SystemValue.createValueCommand(command, iterator);
            break;
        case 2:
            this.objectIDPosition = SystemValue.createValueCommand(command, iterator);
            break;
        }

        // Options
        // TODO

        this.isDirectNode = false;
    }

    /** Initialize the current state.
    *   @returns {Object} The current state (waitingFileRead, teleported).
    */
    initialize()
    {
        return {
            position: null,
            waitingPosition: false,
            waitingObject: false,
            teleported: false
        }
    }

    /** Teleport the object.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        if (!currentState.waitingObject)
        {
            let objectID = this.objectID.getValue();
            if (!currentState.waitingPosition)
            {
                // Set object's position
                if (this.objectIDPosition === null)
                {
                    currentState.position = RPM.positionToVector3(
                        [
                            this.x.getValue(),
                            this.y.getValue(),
                            this.yPlus.getValue(),
                            this.z.getValue()
                        ]
                    );
                } else
                {
                    MapObject.updateObjectWithID(object, this.objectIDPosition
                        .getValue(), this, (moved) =>
                    {
                        currentState.position = moved.position;
                    });
                }
                currentState.waitingPosition = true;
            }
            if (currentState.position !== null)
            {
                // Teleport
                MapObject.updateObjectWithID(object, objectID, this, async (
                    moved) =>
                {
                    // If needs teleport hero in another map
                    if (this.idMap !== null)
                    {
                        let id = this.idMap.getValue();

                        // If hero set the current map
                        if (moved.isHero)
                        {
                            RPM.game.hero.position = currentState.position;
                            if (RPM.currentMap.id !== id)
                            {
                                let map = new SceneMap(id);
                                map.reactionInterpreters.push(RPM
                                    .currentReaction);
                                RPM.gameStack.replace(map);
                            } else
                            {
                                await RPM.currentMap.loadPortions(true);
                            }
                        }
                    }
                    moved.teleport(currentState.position);
                    currentState.teleported = true;
                });
                currentState.waitingObject = true;
            }
        }
        return currentState.teleported ? 1 : 0;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandMoveObject
//
// -------------------------------------------------------

/** @class
*   An event command for moving object.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {number} objectID The ID of the object.
*   @property {boolean} isIgnore Ignore a move if impossible.
*   @property {boolean} isWaitEnd Wait then of all the moves to end the command
*   (parallel command).
*   @property {boolean} isCameraOrientation Take the orientation of the came in
*   count.
*   @property {function[]} moves All the moves callbacks.
*   @property {Object[]} parameters Parameters for ach moves callbacks.
*   @param {JSON} command Direct JSON command to parse.
*/
class EventCommandMoveObject extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        }
        let l = command.length;

        // Object ID
        this.objectID = SystemValue.createValueCommand(command, iterator);

        // Options
        this.isIgnore = RPM.numToBool(command[iterator.i++]);
        this.isWaitEnd = RPM.numToBool(command[iterator.i++]);
        this.isCameraOrientation = RPM.numToBool(command[iterator.i++]);

        // List of move commands
        this.moves = [];
        this.parameters = [];
        let permanent;
        while (iterator.i < l)
        {
            this.kind = command[iterator.i++];
            if (this.kind >= CommandMoveKind.MoveNorth && this.kind <= 
                CommandMoveKind.MoveBack)
            {
                this.parameters.push({
                    square: !RPM.numToBool(command[iterator.i++])
                });
                switch (this.kind)
                {
                case CommandMoveKind.MoveNorth:
                    this.moves.push(this.moveNorth);
                    break;
                case CommandMoveKind.MoveSouth:
                    this.moves.push(this.moveSouth);
                    break;
                case CommandMoveKind.MoveWest:
                    this.moves.push(this.moveWest);
                    break;
                case CommandMoveKind.MoveEast:
                    this.moves.push(this.moveEast);
                    break;
                case CommandMoveKind.MoveNorthWest:
                    this.moves.push(this.moveNorthWest);
                    break;
                case CommandMoveKind.MoveNorthEast:
                    this.moves.push(this.moveNorthEast);
                    break;
                case CommandMoveKind.MoveSouthWest:
                    this.moves.push(this.moveSouthWest);
                    break;
                case CommandMoveKind.MoveSouthEast:
                    this.moves.push(this.moveSouthEast);
                    break;
                case CommandMoveKind.MoveRandom:
                    this.moves.push(this.moveRandom);
                    break;
                case CommandMoveKind.MoveHero:
                    this.moves.push(this.moveHero);
                    break;
                case CommandMoveKind.MoveOppositeHero:
                    this.moves.push(this.moveOppositeHero);
                    break;
                case CommandMoveKind.MoveFront:
                    this.moves.push(this.moveFront);
                    break;
                case CommandMoveKind.MoveBack:
                    this.moves.push(this.moveBack);
                    break;
                }
            }
            if (this.kind === CommandMoveKind.ChangeGraphics)
            {
                permanent = RPM.numToBool(command[iterator.i++]);
                let pictureID = SystemValue.createValueCommand(command, iterator);
                let indexX = command[iterator.i++];
                let indexY = command[iterator.i++];
                let width = command[iterator.i++];
                let height = command[iterator.i++];
                this.parameters.push({
                    permanent: permanent,
                    pictureID: pictureID, 
                    indexX: indexX,
                    indexY: indexY,
                    width: width,
                    height: height
                });
                this.moves.push(this.changeGraphics);
            }
        }
        this.isDirectNode = !this.isWaitEnd;
        this.parallel = !this.isWaitEnd;
    }

    static oppositeOrientation(orientation)
    {
        switch (orientation)
        {
        case Orientation.South:
            return Orientation.North;
        case Orientation.West:
            return Orientation.East;
        case Orientation.North:
            return Orientation.South;
        case Orientation.East:
            return Orientation.West;
        }
    }

    /** Initialize the current state.
    *   @returns {Object} The current state (position, distance).
    */
    initialize()
    {
        return {
            parallel: this.isWaitEnd,
            index: 0,
            distance: 0,
            normalDistance: 0,
            position: null,
            waitingPosition: false,
            moved: false,
            object: null,
            random: RPM.random(0, 3),
            moveHeroOrientation: null,
            pause: false
        }
    }

    // -------------------------------------------------------
    /** Function to move north.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {bool} square Indicate if it is a square move.
    *   @param {Orientation} orientation The orientation where to move.
    */
    move(currentState, object, square, orientation)
    {
        if (object.moveFrequencyTick > 0)
        {
            return false;
        }
        let angle = this.isCameraOrientation ? RPM.currentMap.camera
            .horizontalAngle : -90.0;
        if (currentState.position === null && square)
        {
            let position = object.position;
            currentState.position = object.getFuturPosition(orientation, RPM
                .SQUARE_SIZE, angle);
            if (position.equals(currentState.position))
            {
                if (this.isIgnore)
                {
                    currentState.position = null;
                    object.moving = true;
                    return false;
                }
                object.move(orientation, 0, angle, this.isCameraOrientation);
                this.moveFrequency(object);
                return true;
            }
        }
        if (object.previousMoveCommand === null && object.previousOrientation
            === null)
        {
            object.previousMoveCommand = this;
            object.previousOrientation = orientation;
        } else if (object.previousMoveCommand === this)
        {
            if (object.otherMoveCommand)
            {
                this.moveFrequency(object);
                return true;
            }
        } else if (object.previousMoveCommand && object.otherMoveCommand &&
            object.otherMoveCommand !== this)
        {
            this.moveFrequency(object);
            return true;
        } else if (object.previousMoveCommand !== this)
        {
            object.otherMoveCommand = this;
        }
        let distances = object.move(orientation, RPM.SQUARE_SIZE - currentState
            .distance, angle, this.isCameraOrientation);
        currentState.distance += distances[0];
        currentState.normalDistance += distances[1];
        if (!square || (square && currentState.normalDistance >= RPM.SQUARE_SIZE
            ) || (square && currentState.distance >= RPM.SQUARE_SIZE || (
            distances[0] === 0)))
        {
            if (this.isIgnore && distances[0] === 0)
            {
                currentState.position = null;
                object.moving = true;
                return false;
            }
            if (square && currentState.distance === currentState.normalDistance)
            {
                object.position = currentState.position;
            }
            object.previousOrientation = null;
            object.previousMoveCommand = null;
            object.otherMoveCommand = null;
            this.moveFrequency(object);
            return true;
        }
        return false;
    }

    // -------------------------------------------------------

    moveFrequency(object)
    {
        object.moveFrequencyTick = object.frequency.getValue() * 1000;
    }

    // -------------------------------------------------------
    /** Function to move north.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {Object} parameters The parameters.
    */
    moveNorth(currentState, object, parameters)
    {
        return object ? this.move(currentState, object, parameters.square,
            Orientation.North) : Orientation.North;
    }

    // -------------------------------------------------------
    /** Function to move south.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {Object} parameters The parameters.
    */
    moveSouth(currentState, object, parameters)
    {
        return object ? this.move(currentState, object, parameters.square,
            Orientation.South) : Orientation.South;
    }

    // -------------------------------------------------------
    /** Function to move west.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {Object} parameters The parameters.
    */
    moveWest(currentState, object, parameters)
    {
        return object ? this.move(currentState, object, parameters.square,
            Orientation.West) : Orientation.West;
    }

    // -------------------------------------------------------

    /** Function to move east.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {Object} parameters The parameters.
    */
    moveEast(currentState, object, parameters)
    {
        return object ? this.move(currentState, object, parameters.square,
            Orientation.East) : Orientation.East;
    }

    // -------------------------------------------------------
    /** Function to move north west.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {Object} parameters The parameters.
    */
    moveNorthWest(currentState, object, parameters)
    {
        if (object)
        {
            object.previousOrientation = Orientation.North;
        }
        let orientation = this.moveWest(currentState, object, parameters);
        return object ? orientation : Orientation.North;
    }

    // -------------------------------------------------------
    /** Function to move north west.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {Object} parameters The parameters.
    */
    moveNorthEast(currentState, object, parameters)
    {
        if (object) {
            object.previousOrientation = Orientation.North;
        }
        let orientation = this.moveEast(currentState, object, parameters);
        return object ? orientation : Orientation.North;
    }

    // -------------------------------------------------------
    /** Function to move north west.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {Object} parameters The parameters.
    */
    moveSouthWest(currentState, object, parameters)
    {
        if (object)
        {
            object.previousOrientation = Orientation.South;
        }
        let orientation = this.moveWest(currentState, object, parameters);
        return object ? orientation : Orientation.South;
    }

    // -------------------------------------------------------
    /** Function to move north west.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {Object} parameters The parameters.
    */
    moveSouthEast(currentState, object, parameters)
    {
        if (object)
        {
            object.previousOrientation = Orientation.South;
        }
        let orientation = this.moveEast(currentState, object, parameters);
        return object ? orientation : Orientation.South;
    }

    // -------------------------------------------------------
    /** Function to move random.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {Object} parameters The parameters.
    */
    moveRandom(currentState, object, parameters)
    {
        switch (currentState.random)
        {
        case CommandMoveKind.MoveNorth:
            return this.moveNorth(currentState, object, parameters);
        case CommandMoveKind.MoveSouth:
            return this.moveSouth(currentState, object, parameters);
        case CommandMoveKind.MoveWest:
            return this.moveWest(currentState, object, parameters);
        case CommandMoveKind.MoveEast:
            return this.moveEast(currentState, object, parameters);
        }
    }

    /** Function to move north west.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {Object} parameters The parameters.
    */
    moveHero(currentState, object, parameters)
    {
        return this.moveHeroAndOpposite(currentState, object, parameters, false);
    }

    /** Function to move north west.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {Object} parameters The parameters.
    */
    moveOppositeHero(currentState, object, parameters)
    {
        return this.moveHeroAndOpposite(currentState, object, parameters, true);
    }

    /** Function to move north west.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {Object} parameters The parameters.
    */
    moveHeroAndOpposite(currentState, object, parameters, opposite)
    {
        if (object)
        {
            let orientation = currentState.moveHeroOrientation === null ? this
                .getHeroOrientation(object) : currentState.moveHeroOrientation;
            currentState.moveHeroOrientation = orientation;
            if (opposite)
            {
                orientation = EventCommandMoveObject.oppositeOrientation(
                    orientation);
            }
            return this.move(currentState, object, parameters.square,
                orientation);
        }
        return Orientation.None;
    }

    /** Function to move north west.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {Object} parameters The parameters.
    */
    moveFront(currentState, object, parameters)
    {
        if (object)
        {
            let orientation = currentState.moveHeroOrientation === null ? object
                .orientationEye : currentState.moveHeroOrientation;
            currentState.moveHeroOrientation = orientation;
            return this.move(currentState, object, parameters.square, 
                currentState.moveHeroOrientation);
        }
        return Orientation.None;
    }

    /** Function to move north west.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {Object} parameters The parameters.
    */
    moveBack(currentState, object, parameters)
    {
        if (object)
        {
            let orientation = currentState.moveHeroOrientation === null ?
                EventCommandMoveObject.oppositeOrientation(object.orientationEye
                ) : currentState.moveHeroOrientation;
            currentState.moveHeroOrientation = orientation;
            return this.move(currentState, object, parameters.square, 
                currentState.moveHeroOrientation);
        }
        return Orientation.None;
    }

    // -------------------------------------------------------

    changeGraphics(currentState, object, parameters)
    {
        if (object)
        {
            // Change object current state value
            object.currentStateInstance.graphicID = parameters.pictureID
                .getValue();
            if (object.currentStateInstance.graphicID === 0)
            {
                object.currentStateInstance.rectTileset = [
                    parameters.indexX,
                    parameters.indexY,
                    parameters.width,
                    parameters.height
                ];
            } else
            {
                object.currentStateInstance.indexX = parameters.indexX;
                object.currentStateInstance.indexY = parameters.indexY;
            }

            // Permanent change
            if (parameters.permanent)
            {
                let statesOptions;
                if (object.isHero)
                {
                    statesOptions = RPM.game.heroStatesOptions;
                } else if (object.isStartup)
                {
                    return;
                } else 
                {
                    let portion = SceneMap.getGlobalPortion(RPM.currentMap
                        .allObjects[object.system.id]);
                    let portionDatas = RPM.game.getPotionsDatas(RPM.currentMap
                        .id, portion[0], portion[1], portion[2]);
                    let indexProp = portionDatas.soi.indexOf(object.system.id);
                    if (indexProp === -1)
                    {
                        statesOptions = [];
                        portionDatas.soi.push(object.system.id);
                        portionDatas.so.push(statesOptions);
                    } else
                    {
                        statesOptions = portionDatas.so[indexProp];
                    }
                }
                let options = statesOptions[object.currentState.id - 1];
                if (!options)
                {
                    options = {};
                    statesOptions[object.currentState.id - 1] = options;
                }
                options.gid = object.currentStateInstance.graphicID;
                options.gt = object.currentStateInstance.rectTileset;
                options.gix = object.currentStateInstance.indexX;
                options.giy = object.currentStateInstance.indexY;
            }

            // Graphic update
            object.changeState();
        }
        return Orientation.None;
    }

    /** Function to move north west.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {Object} parameters The parameters.
    */
    getHeroOrientation(object)
    {
        let xDif = object.position.x - RPM.game.hero.position.x;
        let zDif = object.position.z - RPM.game.hero.position.z;
        if (Math.abs(xDif) > Math.abs(zDif))
        {
            if (xDif > 0)
            {
                return Orientation.West;
            } else
            {
                return Orientation.East;
            }
        } else
        {
            if (zDif > 0)
            {
                return Orientation.North;
            } else
            {
                return Orientation.South;
            }
        }
    }

    // -------------------------------------------------------
    /** Move the object(s).
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        if (currentState.pause)
        {
            return 0;
        }
        if (currentState.parallel && this.moves.length > 0)
        {
            if (!currentState.waitingObject)
            {
                let objectID = this.objectID.getValue();
                MapObject.updateObjectWithID(object, objectID, this, (moved) =>
                {
                    currentState.object = moved;
                });
                currentState.waitingObject = true;
            }
            if (currentState.object !== null)
            {

                let finished = this.moves[currentState.index].call(this,
                    currentState, currentState.object, this.parameters[
                    currentState.index]);

                if (finished)
                {
                    currentState.distance = 0;
                    currentState.normalDistance = 0;
                    currentState.index = currentState.index + 1;
                    currentState.random = RPM.random(0, 3);
                    currentState.position = null;
                    currentState.moveHeroOrientation = null;
                }
                return (this.moves[currentState.index] == null) ? 1 : 0;
            }
            return 0;
        }
        return 1;
    }

    // -------------------------------------------------------

    getCurrentOrientation(currentState)
    {
        if (this.moves.length === 0)
        {
            return Orientation.None;
        }
        return this.moves[currentState.index].call(this, currentState);
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandWait
//
// -------------------------------------------------------

/** @class
*   An event command for displaying text.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {number} milliseconds The number of milliseconds to wait.
*   @param {JSON} command Direct JSON command to parse.
*/
class EventCommandWait extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        }
        this.milliseconds = SystemValue.createValueCommand(command, iterator);
        this.isDirectNode = false;
    }

    /** Initialize the current state.
    *   @returns {Object} The current state (clicked).
    */
    initialize() {
        return {
            milliseconds: this.milliseconds.getValue() * 1000,
            currentTime: new Date().getTime()
        }
    }

    // -------------------------------------------------------
    /** Update and check if the event is finished.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        return (currentState.currentTime + currentState.milliseconds <= new
            Date().getTime()) ? 1 : 0;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandMoveCamera
//
// -------------------------------------------------------

/** @class
*   An event command for displaying text.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {SystemValue} targetID The ID of the camera target.
*   @property {number} operation The operation used for the transformations.
*   @property {SystemValue} time The time to wait.
*   @param {JSON} command Direct JSON command to parse.
*/
class EventCommandMoveCamera extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        }

        // Target
        if (!RPM.numToBool(command[iterator.i++])) // Unchanged
        {
            this.targetID = null;
        }
        else
        {
            this.targetID = SystemValue.createValueCommand(command, iterator);
        }

        // Operation
        this.operation = command[iterator.i++];

        // Move
        this.moveTargetOffset = RPM.numToBool(command[iterator.i++]);
        this.cameraOrientation = RPM.numToBool(command[iterator.i++]);
        this.x = SystemValue.createValueCommand(command, iterator);
        this.xSquare = !RPM.numToBool(command[iterator.i++]);
        this.y = SystemValue.createValueCommand(command, iterator);
        this.ySquare = !RPM.numToBool(command[iterator.i++]);
        this.z = SystemValue.createValueCommand(command, iterator);
        this.zSquare = !RPM.numToBool(command[iterator.i++]);

        // Rotation
        this.rotationTargetOffset = RPM.numToBool(command[iterator.i++]);
        this.h = SystemValue.createValueCommand(command, iterator);
        this.v = SystemValue.createValueCommand(command, iterator);

        // Zoom
        this.distance = SystemValue.createValueCommand(command, iterator);

        // Options
        this.isWaitEnd = RPM.numToBool(command[iterator.i++]);
        this.time = SystemValue.createValueCommand(command, iterator);

        this.isDirectNode = false;
        this.parallel = !this.isWaitEnd;
    }

    /** Initialize the current state.
    *   @returns {Object} The current state (clicked).
    */
    initialize()
    {
        let time = this.time.getValue() * 1000;
        let operation = RPM.operators_numbers[this.operation];
        let finalX = operation(RPM.currentMap.camera.threeCamera.position.x, 
            this.x.getValue() * (this.xSquare ? RPM.SQUARE_SIZE : 1));
        let finalY = operation(RPM.currentMap.camera.threeCamera.position.y,
            this.y.getValue() * (this.ySquare ? RPM.SQUARE_SIZE : 1));
        let finalZ = operation(RPM.currentMap.camera.threeCamera.position.z,
            this.z.getValue() * (this.zSquare ? RPM.SQUARE_SIZE : 1));
        let finalH = operation(RPM.currentMap.camera.horizontalAngle, this.h
            .getValue());
        let finalV = operation(RPM.currentMap.camera.verticalAngle, this.v
            .getValue());
        let finalDistance = operation(RPM.currentMap.camera.distance, this
            .distance.getValue());                   
        return {
            parallel: this.isWaitEnd,
            finalPosition: new THREE.Vector3(finalX, finalY, finalZ),
            finalDifH: finalH - RPM.currentMap.camera.horizontalAngle,
            finalDifV: finalV - RPM.currentMap.camera.verticalAngle,
            finalDistance: finalDistance - RPM.currentMap.camera.distance,
            time: time,
            timeLeft: time,
            targetID: this.targetID === null ? null : this.targetID.getValue(),
            target: null
        }
    }

    // -------------------------------------------------------
    /** Update and check if the event is finished.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        if (currentState.parallel) 
        {
            if (!currentState.waitingObject)
            {
                if (currentState.targetID === null)
                {
                    currentState.target = false;
                } else
                {
                    MapObject.updateObjectWithID(object, currentState.targetID, 
                        this, (target) =>
                    {
                        currentState.target = target;
                    });
                }
                currentState.waitingObject = true;
            }
            if (currentState.target !== null) 
            {
                let dif;
                if (!currentState.editedTarget)
                {
                    if (currentState.target)
                    {
                        RPM.currentMap.camera.targetOffset.add(RPM.currentMap
                            .camera.target.position.clone().sub(currentState
                            .target.position));
                        dif = currentState.target.position.clone().sub(RPM
                            .currentMap.camera.target.position);
                        currentState.finalPosition.add(dif);
                        RPM.currentMap.camera.target = currentState.target;
                        if (!this.moveTargetOffset)
                        {
                            currentState.moveChangeTargetDif = currentState
                                .finalPosition.clone().sub(dif).sub(RPM
                                .currentMap.camera.threeCamera.position);
                        }
                    }
                    currentState.finalDifPosition = currentState.finalPosition
                        .sub(RPM.currentMap.camera.threeCamera.position);
                    currentState.editedTarget = true;
                }

                // Updating the time left
                let timeRate;
                if (currentState.time === 0)
                {
                    timeRate = 1;
                } else 
                {
                    dif = RPM.elapsedTime;
                    currentState.timeLeft -= RPM.elapsedTime;
                    if (currentState.timeLeft < 0) 
                    {
                        dif += currentState.timeLeft;
                        currentState.timeLeft = 0;
                    }
                    timeRate = dif / currentState.time;
                }

                // Move
                let positionOffset = new THREE.Vector3(
                    timeRate * currentState.finalDifPosition.x,
                    timeRate * currentState.finalDifPosition.y,
                    timeRate * currentState.finalDifPosition.z
                );
                RPM.currentMap.camera.threeCamera.position.add(positionOffset);
                if (this.moveTargetOffset)
                {
                    RPM.currentMap.camera.targetOffset.add(positionOffset);
                } else
                {
                    if (currentState.moveChangeTargetDif)
                    {
                        positionOffset = new THREE.Vector3(timeRate * (
                            currentState.finalDifPosition.x - currentState
                            .moveChangeTargetDif.x), timeRate * (currentState
                            .finalDifPosition.y - currentState
                            .moveChangeTargetDif.y), timeRate * (currentState
                            .finalDifPosition.z - currentState
                            .moveChangeTargetDif.z)
                        );
                        RPM.currentMap.camera.targetOffset.add(positionOffset);
                    }
                }
                RPM.currentMap.camera.updateTargetPosition();
                RPM.currentMap.camera.updateAngles();
                RPM.currentMap.camera.updateDistance();

                // Rotation
                RPM.currentMap.camera.horizontalAngle += timeRate * currentState
                    .finalDifH;
                RPM.currentMap.camera.addVerticalAngle(timeRate * currentState
                    .finalDifV);
                if (this.rotationTargetOffset)
                {
                    RPM.currentMap.camera.updateTargetOffset();
                }

                // Zoom
                RPM.currentMap.camera.distance += timeRate * currentState
                    .finalDistance;

                // Update
                RPM.currentMap.camera.update();

                // If time = 0, then this is the end of the command
                return currentState.timeLeft === 0 ? 1 : 0;
            }
            return 0;
        }
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandPlayMusic
//
// -------------------------------------------------------

/** @class
*   An event command for playing a music.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*/

class EventCommandPlayMusic extends EventCommand
{
    constructor(command)
    {
        super();

        EventCommandPlayMusic.parsePlaySong(this, command, SongKind.Music);
    }

    // -------------------------------------------------------

    static parsePlaySong(that, command, kind)
    {
        let iterator = {
            i: 0
        }
        let isIDprimitive = RPM.numToBool(command[iterator.i++]);
        let idValue = SystemValue.createValueCommand(command, iterator);
        let id = SystemValue.createNumber(command[iterator.i++]);
        let songID = isIDprimitive ? idValue : id;
        let volume = SystemValue.createValueCommand(command, iterator);
        let isStart = RPM.numToBool(command[iterator.i++]);
        let start = SystemValue.createValueCommand(command, iterator);
        start = isStart ? start : null;
        let isEnd = RPM.numToBool(command[iterator.i++]);
        let end = SystemValue.createValueCommand(command, iterator);
        end = isEnd ? end : null;
        that.song = new SystemPlaySong(kind);
        that.song.updateValues(songID, volume, isStart, start, isEnd, end);
    }

    initialize()
    {
        return this.song.initialize();
    }

    // -------------------------------------------------------

    /** Update and check if the event is finished.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */

    update(currentState, object, state)
    {
        return this.song.playMusic();
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandStopMusic
//
// -------------------------------------------------------

/** @class
*   An event command for stopping the music.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*/

class EventCommandStopMusic extends EventCommand
{
    constructor(command)
    {
        super();

        EventCommandStopMusic.parseStopSong(this, command);
        this.isDirectNode = true;
        this.parallel = true;
    }

    // -------------------------------------------------------

    static parseStopSong(that, command)
    {
        let iterator = {
            i: 0
        }
        that.seconds = SystemValue.createValueCommand(command, iterator);
    }

    // -------------------------------------------------------

    static stopSong(that, kind, time)
    {
        return RPM.songsManager.stopSong(kind, time, that.seconds.getValue()) ? 
            1 : 0;
    }

    initialize()
    {
        return {
            parallel: false,
            time: new Date().getTime()
        };
    }

    // -------------------------------------------------------
    /** Update and check if the event is finished.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        let stopped = EventCommandStopMusic.stopSong(this, SongKind.Music,
            currentState.time);
        return currentState.parallel ? stopped : 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandPlayBackgroundSound
//
// -------------------------------------------------------

/** @class
*   An event command for playing a backgroundsound.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*/

class EventCommandPlayBackgroundSound extends EventCommand
{
    constructor(command)
    {
        super();

        EventCommandPlayMusic.parsePlaySong(this, command, SongKind
            .BackgroundSound);
    }

    initialize()
    {
        return this.song.initialize();
    }

    // -------------------------------------------------------
    /** Update and check if the event is finished.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        return this.song.playMusic();
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandStopBackgroundSound
//
// -------------------------------------------------------

/** @class
*   An event command for stopping the background sound.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*/

class EventCommandStopBackgroundSound extends EventCommand
{
    constructor(command)
    {
        super();

        EventCommandStopMusic.parseStopSong(this, command);
        this.parallel = true;
    }

    initialize()
    {
        return {
            parallel: false,
            time: new Date().getTime()
        };
    }

    // -------------------------------------------------------
    /** Update and check if the event is finished.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        let stopped = EventCommandStopMusic.stopSong(this, SongKind
            .BackgroundSound, currentState.time);
        return currentState.parallel ? stopped : 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandPlaySound
//
// -------------------------------------------------------

/** @class
*   An event command for playing a backgroundsound.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*/

class EventCommandPlaySound extends EventCommand
{
    constructor(command)
    {
        super();

        EventCommandPlayMusic.parsePlaySong(this, command, SongKind.Sound);
    }

    initialize()
    {
        return this.song.initialize();
    }

    // -------------------------------------------------------

    play() {
        return this.song.playSound();
    }

    // -------------------------------------------------------
    /** Update and check if the event is finished.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        this.play();
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandPlayMusicEffect
//
// -------------------------------------------------------

/** @class
*   An event command for playing a music effect.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*/

class EventCommandPlayMusicEffect extends EventCommand
{
    constructor(command)
    {
        super();

        EventCommandPlayMusic.parsePlaySong(this, command, SongKind.MusicEffect);
        this.parallel = true;
    }

    initialize()
    {
        return this.song.initialize();
    }

    // -------------------------------------------------------
    /** Update and check if the event is finished.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        return this.song.playMusicEffect(currentState);
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandChangeProperty
//
// -------------------------------------------------------

/** @class
*   An event command for changing a property value.
*   @param {JSON} command Direct JSON command to parse.
*/
class EventCommandChangeProperty extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        }
        this.propertyID = SystemValue.createValueCommand(command, iterator);
        this.operationKind = command[iterator.i++];
        this.newValue = SystemValue.createValueCommand(command, iterator);
    }

    update(currentState, object, state)
    {
        let propertyID = this.propertyID.getValue();
        let newValue = RPM.operators_numbers[this.operationKind](object
            .properties[propertyID], this.newValue.getValue());
        object.properties[propertyID] = newValue;
        let props;
        if (object.isHero)
        {
            props = RPM.game.heroProperties;
        } else if (object.isStartup)
        {
            props = RPM.game.startupProperties[RPM.currentMap.id];
            if (RPM.isUndefined(props))
            {
                props = [];
                RPM.game.startupProperties[RPM.currentMap.id] = props;
            }
        } else
        {
            let portion = SceneMap.getGlobalPortion(RPM.currentMap.allObjects[
                object.system.id]);
            let portionDatas = RPM.game.getPotionsDatas(RPM.currentMap.id, 
                portion[0], portion[1], portion[2]);
            let indexProp = portionDatas.pi.indexOf(object.system.id);
            if (indexProp === -1)
            {
                props = [];
                portionDatas.pi.push(object.system.id);
                portionDatas.p.push(props);
            } else
            {
                props = portionDatas.p[indexProp];
            }
        }
        props[propertyID - 1] = newValue;
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandDisplayChoice
//
// -------------------------------------------------------

class EventCommandDisplayChoice extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        };
        this.cancelAutoIndex = SystemValue.createValueCommand(command, iterator);
        this.choices = [];
        let l = command.length;
        let lang = null;
        let next;
        while (iterator.i < l)
        {
            next = command[iterator.i];
            if (next === RPM.STRING_DASH)
            {
                iterator.i++;
                if (lang !== null)
                {
                    this.choices.push(lang.name());
                }
                lang = new SystemLang();
                iterator.i++;
            }
            lang.getCommand(command, iterator);
        }
        if (lang !== null)
        {
            this.choices.push(lang.name());
        }

        // Determine slots width
        l = this.choices.length;
        let graphics = new Array(l);
        let w = RPM.MEDIUM_SLOT_WIDTH;
        let graphic;
        for (let i = 0; i < l; i++)
        {
            graphic = new GraphicText(this.choices[i], { align: Align.Center });
            graphics[i] = graphic;
            if (graphic.textWidth > w)
            {
                w = graphic.textWidth;
            }
        }
        w += RPM.SMALL_SLOT_PADDING[0] + RPM.SMALL_SLOT_PADDING[2];

        // Window
        this.windowChoices = new WindowChoices((RPM.SCREEN_X - w) / 2, RPM
            .SCREEN_Y - 10 - 150 - (l * RPM.MEDIUM_SLOT_HEIGHT), w, RPM
            .MEDIUM_SLOT_HEIGHT, graphics, 
            {
                nbItemsMax: l
            }
        );
    }

    setShowText(showText)
    {
        this.showText = showText;

        // Move to right if show text before
        if (showText)
        {
            this.windowChoices.setX(RPM.SCREEN_X - this.windowChoices.oW - 10);
        }
    }

    initialize()
    {
        this.windowChoices.unselect();
        this.windowChoices.select(0);
        return {
            index: -1
        };
    }

    /** Go inside the else block.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        return currentState.index + 1;
    }

    // -------------------------------------------------------
    /** Returns the number of node to pass.
    *   @returns {number}
    */
    goToNextCommand ()
    {
        return 1;
    }

    // -------------------------------------------------------

    onKeyPressed(currentState, key)
    {
        if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard.menuControls
            .Action))
        {
            currentState.index = this.windowChoices.currentSelectedIndex;
        } else if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
            .menuControls.Cancel))
        {
            currentState.index = this.cancelAutoIndex.getValue() - 1;
        }
    }

    onKeyPressedAndRepeat(currentState, key)
    {
        this.windowChoices.onKeyPressedAndRepeat(key);
    }

    // -------------------------------------------------------

    drawHUD(currentState)
    {
        // Display text command if existing
        if (this.showText)
        {
            this.showText.drawHUD();
        }
        this.windowChoices.draw();
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandChoice
//
// -------------------------------------------------------

class EventCommandChoice extends EventCommand
{
    constructor(command)
    {
        super();

        this.index = command[0];
        this.isDirectNode = true;
        this.parallel = false;
    }

    /** Go inside the else block.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update(currentState, object, state)
    {
        return -1;
    }

    // -------------------------------------------------------
    /** Returns the number of node to pass.
    *   @returns {number}
    */
    goToNextCommand()
    {
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandScript
//
// -------------------------------------------------------

class EventCommandScript extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        }
        this.isDynamic = RPM.numToBool(command[iterator.i++]);
        this.script = this.isDynamic ? SystemValue.createValueCommand(command, 
            iterator) : SystemValue.createMessage(RPM.numToString(command[
            iterator.i]));
    }

    update(currentState, object, state)
    {
        let res = new Function("$that", "$object", this.script.getValue())($that
            , object);
        return RPM.isUndefined(res) ? 1 : res;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandDisplayAPicture
//
// -------------------------------------------------------

class EventCommandDisplayAPicture extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        }
        this.pictureID = SystemValue.createValueCommand(command, iterator);
        iterator.i++;
        this.index = SystemValue.createValueCommand(command, iterator);
        this.centered = !RPM.numToBool(command[iterator.i++]);
        if (this.centered)
        {
            this.originX = RPM.SCREEN_X / 2;
            this.originY = RPM.SCREEN_Y / 2;
        } else {
            this.originX = 0;
            this.originY = 0;
        }
        this.x = SystemValue.createValueCommand(command, iterator);
        this.y = SystemValue.createValueCommand(command, iterator);
        this.zoom = SystemValue.createValueCommand(command, iterator);
        this.opacity = SystemValue.createValueCommand(command, iterator);
        this.angle = SystemValue.createValueCommand(command, iterator);
    }

    // -------------------------------------------------------

    update(currentState, object, state)
    {
        let currentIndex = this.index.getValue();
        let picture = RPM.datasGame.pictures.getPictureCopy(PictureKind.Pictures
            , this.pictureID.getValue());
        picture.setX(this.originX + this.x.getValue());
        picture.setY(this.originY + this.y.getValue());
        picture.centered = this.centered;
        picture.zoom = this.zoom.getValue() / 100;
        picture.opacity = this.opacity.getValue() / 100;
        picture.angle = this.angle.getValue();
        let value = [currentIndex, picture];
        let ok = false;
        let index;
        for (let i = 0, l = RPM.displayedPictures.length; i < l; i++)
        {
            index = RPM.displayedPictures[i][0];
            if (currentIndex === index)
            {
                RPM.displayedPictures[i] = value;
                ok = true;
                break;
            } else if (currentIndex < index)
            {
                RPM.displayedPictures.splice(i, 0, value);
                ok = true;
                break;
            }
        }
        if (!ok)
        {
            RPM.displayedPictures.push(value);
        }
        RPM.requestPaintHUD = true;
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandSetMoveTurnAPicture
//
// -------------------------------------------------------

class EventCommandSetMoveTurnAPicture extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        }
        this.index = SystemValue.createValueCommand(command, iterator);
        if (RPM.numToBool(command[iterator.i++]))
        {
            iterator.i++; 
            this.pictureID = SystemValue.createValueCommand(command, iterator);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.zoom = SystemValue.createValueCommand(command, iterator);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.opacity = SystemValue.createValueCommand(command, iterator);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.x = SystemValue.createValueCommand(command, iterator);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.y = SystemValue.createValueCommand(command, iterator);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.angle = SystemValue.createValueCommand(command, iterator);
        }
        this.time = SystemValue.createValueCommand(command, iterator);
        this.waitEnd = RPM.numToBool(command[iterator.i++]);
        this.isDirectNode = true;
        this.parallel = !this.waitEnd;
    }

    // -------------------------------------------------------

    initialize()
    {
        let time = this.time.getValue() * 1000;
        let index = this.index.getValue();
        let obj, picture;
        for (let i = 0, l = RPM.displayedPictures.length; i < l; i++)
        {
            obj = RPM.displayedPictures[i];
            if (index === obj[0])
            {
                picture = obj[1];
                break;
            }
        }
        if (picture)
        {
            // If new picture ID, create a new picture
            if (this.pictureID)
            {
                let prevX = picture.oX;
                let prevY = picture.oY;
                let prevW = picture.oW;
                let prevH = picture.oH;
                let prevCentered = picture.centered;
                let prevZoom = picture.zoom;
                let prevOpacity = picture.opacity;
                let prevAngle = picture.angle;
                picture = RPM.datasGame.pictures.getPictureCopy(PictureKind
                    .Pictures, this.pictureID.getValue());
                if (prevCentered)
                {
                    prevX += (prevW - picture.oW) / 2;
                    prevY += (prevH - picture.oH) / 2;
                }
                picture.setX(prevX);
                picture.setY(prevY);
                picture.centered = prevCentered;
                picture.zoom = prevZoom;
                picture.opacity = prevOpacity;
                picture.angle = prevAngle;
                RPM.displayedPictures[i][1] = picture;
            }
        } else
        {
            return {};
        }
        return {
            parallel: this.waitEnd,
            picture: picture,
            finalDifZoom: this.zoom ? (this.zoom.getValue() / 100) - picture
                .zoom : null,
            finalDifOpacity: this.opacity ? (this.opacity.getValue() / 100) -
                picture.opacity : null,
            finalDifX: this.x ? (picture.centered ? RPM.SCREEN_X / 2 : 0) + this
                .x.getValue() - picture.oX : null,
            finalDifY: this.y ? (picture.centered ? RPM.SCREEN_Y / 2 : 0) + this
                .y.getValue() - picture.oY : null,
            finalDifAngle: this.angle ? this.angle.getValue() - picture.angle : 
                null,
            time: time,
            timeLeft: time
        }
    }

    // -------------------------------------------------------

    update(currentState, object, state)
    {
        // If no picture corresponds, go to next command
        if (!currentState.picture)
        {
            return 1;
        }
        if (currentState.parallel)
        {
            // Updating the time left
            let timeRate, dif;
            if (currentState.time === 0)
            {
                timeRate = 1;
            } else
            {
                dif = RPM.elapsedTime;
                currentState.timeLeft -= RPM.elapsedTime;
                if (currentState.timeLeft < 0)
                {
                    dif += currentState.timeLeft;
                    currentState.timeLeft = 0;
                }
                timeRate = dif / currentState.time;
            }

            // Set
            if (this.zoom)
            {
                currentState.picture.zoom += timeRate * currentState
                    .finalDifZoom;
            }
            if (this.opacity)
            {
                currentState.picture.opacity += timeRate * currentState
                    .finalDifOpacity;
            }

            // Move
            if (this.x)
            {
                currentState.picture.setX(currentState.picture.oX + (timeRate *
                    currentState.finalDifX));
            }
            if (this.y)
            {
                currentState.picture.setY(currentState.picture.oY + (timeRate *
                    currentState.finalDifY));
            }

            // Turn
            if (this.angle)
            {
                currentState.picture.angle += timeRate * currentState
                    .finalDifAngle;
            }
            RPM.requestPaintHUD = true;

            // If time = 0, then this is the end of the command
            if (currentState.timeLeft === 0)
            {
                return 1;
            }
            return 0;
        }
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandRemoveAPicture
//
// -------------------------------------------------------

class EventCommandRemoveAPicture extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        }
        this.index = SystemValue.createValueCommand(command, iterator);
    }

    update(currentState, object, state)
    {
        let currentIndex = this.index.getValue();
        for (let i = 0, l = RPM.displayedPictures.length; i < l; i++)
        {
            if (currentIndex === RPM.displayedPictures[i][0])
            {
                RPM.displayedPictures.splice(i, 1);
                break;
            }
        }
        RPM.requestPaintHUD = true;
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandSetDialogBoxOptions
//
// -------------------------------------------------------

class EventCommandSetDialogBoxOptions extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.windowSkinID = SystemValue.createValueCommand(command, iterator);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.x = SystemValue.createValueCommand(command, iterator);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.y = SystemValue.createValueCommand(command, iterator);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.w = SystemValue.createValueCommand(command, iterator);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.h = SystemValue.createValueCommand(command, iterator);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.pLeft = SystemValue.createValueCommand(command, iterator);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.pTop = SystemValue.createValueCommand(command, iterator);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.pRight = SystemValue.createValueCommand(command, iterator);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.pBottom = SystemValue.createValueCommand(command, iterator);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.fPosAbove = RPM.numToBool(command[iterator.i++]);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.fX = SystemValue.createValueCommand(command, iterator);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.fY = SystemValue.createValueCommand(command, iterator);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.tOutline = command[iterator.i++] !== RPM.NUM_BOOL_TRUE;
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.tcText = SystemValue.createValueCommand(command, iterator);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.tcOutline = SystemValue.createValueCommand(command, iterator);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.tcBackground = SystemValue.createValueCommand(command, iterator);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.tSize = SystemValue.createValueCommand(command, iterator);
        }
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.tFont = SystemValue.createValueCommand(command, iterator);
        }
    }

    // -------------------------------------------------------

    update(currentState, object, state)
    {
        if (!RPM.isUndefined(this.windowSkinID))
        {
            RPM.datasGame.system.dbOptions.vwindowSkinID = this.windowSkinID
                .getValue();
        }
        if (!RPM.isUndefined(this.x))
        {
            RPM.datasGame.system.dbOptions.vx = this.x.getValue();
        }
        if (!RPM.isUndefined(this.y))
        {
            RPM.datasGame.system.dbOptions.vy = this.y.getValue();
        }
        if (!RPM.isUndefined(this.w))
        {
            RPM.datasGame.system.dbOptions.vw = this.w.getValue();
        }
        if (!RPM.isUndefined(this.h))
        {
            RPM.datasGame.system.dbOptions.vh = this.h.getValue();
        }
        if (!RPM.isUndefined(this.pLeft))
        {
            RPM.datasGame.system.dbOptions.vpLeft = this.pLeft.getValue();
        }
        if (!RPM.isUndefined(this.pTop))
        {
            RPM.datasGame.system.dbOptions.vpTop = this.pTop.getValue();
        }
        if (!RPM.isUndefined(this.pRight))
        {
            RPM.datasGame.system.dbOptions.vpRight = this.pRight.getValue();
        }
        if (!RPM.isUndefined(this.pBottom))
        {
            RPM.datasGame.system.dbOptions.vpBottom = this.pBottom.getValue();
        }
        if (!RPM.isUndefined(this.fPosAbove))
        {
            RPM.datasGame.system.dbOptions.vfPosAbove = this.fPosAbove;
        }
        if (!RPM.isUndefined(this.fX))
        {
            RPM.datasGame.system.dbOptions.fX = this.fX.getValue();
        }
        if (!RPM.isUndefined(this.fY))
        {
            RPM.datasGame.system.dbOptions.fY = this.fY.getValue();
        }
        if (!RPM.isUndefined(this.tOutline))
        {
            RPM.datasGame.system.dbOptions.vtOutline = this.tOutline;
        }
        if (!RPM.isUndefined(this.tcText))
        {
            RPM.datasGame.system.dbOptions.vtcText = RPM.datasGame.system.colors
                [this.tcText.getValue()];
        }
        if (!RPM.isUndefined(this.tcOutline))
        {
            RPM.datasGame.system.dbOptions.vtcOutline = RPM.datasGame.system
                .colors[this.tcOutline.getValue()];
        }
        if (!RPM.isUndefined(this.tcBackground))
        {
            RPM.datasGame.system.dbOptions.vtcBackground = RPM.datasGame.system
                .colors[this.tcBackground.getValue()];
        }
        if (!RPM.isUndefined(this.tSize))
        {
            RPM.datasGame.system.dbOptions.vtSize = RPM.datasGame.system
                .fontSizes[this.tSize.getValue()].getValue();
        }
        if (!RPM.isUndefined(this.tFont)) {
            RPM.datasGame.system.dbOptions.vtFont = RPM.datasGame.system
                .fontNames[this.tFont.getValue()].getValue();
        }
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandTitleScreen
//
// -------------------------------------------------------

class EventCommandTitleScreen extends EventCommand
{
    constructor(command)
    {
        super();
    }

    // -------------------------------------------------------

    update(currentState, object, state)
    {
        RPM.gameStack.pop();
        RPM.gameStack.pushTitleScreen();
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandChangeScreenTone
//
// -------------------------------------------------------

class EventCommandChangeScreenTone extends EventCommand
{
    constructor(command)
    {
        super();

        if (!command)
        {
            return;
        }
        let iterator = {
            i: 0
        };
        this.r = SystemValue.createValueCommand(command, iterator);
        this.g = SystemValue.createValueCommand(command, iterator);
        this.b = SystemValue.createValueCommand(command, iterator);
        this.grey = SystemValue.createValueCommand(command, iterator);
        if (RPM.numToBool(command[iterator.i++]))
        {
            this.subColor = RPM.numToBool(command[iterator.i++]);
            this.colorID = SystemValue.createValueCommand(command, iterator);
        }
        this.waitEnd = RPM.numToBool(command[iterator.i++]);
        this.time = SystemValue.createValueCommand(command, iterator);
        this.isDirectNode = true;
        this.parallel = !this.waitEnd;
    }

    // -------------------------------------------------------

    initialize()
    {
        let time = this.time.getValue() * 1000;
        let color = this.colorID ? RPM.datasGame.system.colors[this.colorID
            .getValue()] : null;
        return {
            parallel: this.waitEnd,
            finalDifRed: Math.max(Math.min((this.r.getValue() + (color ? color
                .red : 0)) / 255, 1), -1) - RPM.screenTone.x,
            finalDifGreen: Math.max(Math.min((this.g.getValue() + (color ? color
                .green : 0)) / 255, 1), -1) - RPM.screenTone.y,
            finalDifBlue: Math.max(Math.min((this.b.getValue() + (color ? color
                .blue : 0)) / 255, 1), -1) - RPM.screenTone.z,
            finalDifGrey: Math.max(Math.min(1 - (this.grey.getValue() / 100), 1)
                , -1) - RPM.screenTone.w,
            time: time,
            timeLeft: time
        }
    }

    // -------------------------------------------------------

    update(currentState, object, state)
    {
        if (currentState.parallel)
        {
            // Updating the time left
            let timeRate, dif;
            if (currentState.time === 0)
            {
                timeRate = 1;
            } else
            {
                dif = RPM.elapsedTime;
                currentState.timeLeft -= RPM.elapsedTime;
                if (currentState.timeLeft < 0)
                {
                    dif += currentState.timeLeft;
                    currentState.timeLeft = 0;
                }
                timeRate = dif / currentState.time;
            }

            // Update values
            RPM.screenTone.setX(RPM.screenTone.x + (timeRate * currentState
                .finalDifRed));
            RPM.screenTone.setY(RPM.screenTone.y + (timeRate * currentState
                .finalDifGreen));
            RPM.screenTone.setZ(RPM.screenTone.z + (timeRate * currentState
                .finalDifBlue));
            RPM.screenTone.setW(RPM.screenTone.w + (timeRate * currentState
                .finalDifGrey));
            RPM.updateBackgroundColor(RPM.currentMap.mapProperties
                .backgroundColor);

            // If time = 0, then this is the end of the command
            if (currentState.timeLeft === 0)
            {
                return 1;
            }
            return 0;
        }
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandRemoveObjectFromMap
//
// -------------------------------------------------------

class EventCommandRemoveObjectFromMap extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        };
        this.objectID = SystemValue.createValueCommand(command, iterator);
    }

    // -------------------------------------------------------

    initialize()
    {
        return {
            started: false,
            finished: false
        }
    }

    // -------------------------------------------------------

    update(currentState, object, state)
    {
        let objectID = this.objectID.getValue();
        if (!currentState.started)
        {
            currentState.started = true;
            MapObject.getObjectAndPortion(object, objectID, this, (removed, id, 
                kind, i, objects, datas) =>
            {
                if (datas.r.indexOf(id) === -1)
                {
                    switch (kind)
                    {
                    case 0:
                        datas.m.splice(i, 1);
                        let index = datas.min.indexOf(removed);
                        if (index === -1)
                        {
                            datas = RPM.game.getPotionsDatas(RPM.currentMap.id, 
                                Math.floor(removed.position.x / RPM.PORTION_SIZE
                                ), Math.floor(removed.position.y / RPM
                                .PORTION_SIZE), Math.floor(removed.position.z / 
                                RPM.PORTION_SIZE));
                            datas.mout.splice(datas.mout.indexOf(removed), 1);
                        } else
                        {
                            datas.min.splice(index, 1);
                        }
                        break;
                    case 1:
                        if (i > -1)
                        {
                            objects.splice(i, 1);
                        }
                        break;
                    }
                    removed.removed = true;
                    removed.removeFromScene();
                }
                currentState.finished = true;
            });
        }
        return currentState.finished ? 1 : 0;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandStopReaction
//
// -------------------------------------------------------

class EventCommandStopReaction extends EventCommand
{
    constructor(command)
    {
        super();
    }

    // -------------------------------------------------------

    update(currentState, object, state)
    {
        return -3;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandAllowForbidSaves
//
// -------------------------------------------------------

class EventCommandAllowForbidSaves extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        };
        this.allow = SystemValue.createValueCommand(command, iterator);
    }

    // -------------------------------------------------------

    update(currentState, object, state)
    {
        RPM.allowSaves = this.allow.getValue();
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandAllowForbidMainMenu
//
// -------------------------------------------------------

class EventCommandAllowForbidMainMenu extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        };
        this.allow = SystemValue.createValueCommand(command, iterator);
    }

    // -------------------------------------------------------

    update(currentState, object, state)
    {
        RPM.allowMainMenu = this.allow.getValue();
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandCallACommonReaction
//
// -------------------------------------------------------

class EventCommandCallACommonReaction extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        };
        this.commonReactionID = command[iterator.i++];
        this.parameters = [];
        let l = command.length;
        let paramID;
        while (iterator.i < l)
        {
            paramID = command[iterator.i++];
            this.parameters[paramID] = SystemValue.createValueCommand(command, 
                iterator);
        }
    }

    // -------------------------------------------------------

    initialize()
    {
        return {
            interpreter: null
        };
    }

    // -------------------------------------------------------

    update(currentState, object, state)
    {
        if (!currentState.interpreter)
        {
            let reaction = RPM.datasGame.commonEvents.commonReactions[this.commonReactionID];

            // Correct parameters for default values
            let v, parameter, k;
            for (let id in reaction.parameters)
            {
                v = reaction.parameters[id].value;
                parameter = this.parameters[id];
                k = parameter ? parameter.kind : PrimitiveValueKind.None;
                if (k <= PrimitiveValueKind.Default)
                {
                    parameter = k === PrimitiveValueKind.Default ? v : 
                        SystemValue.create(k, null);
                }
                this.parameters[id] = parameter;
            }
            currentState.interpreter = new ReactionInterpreter(object, RPM
                .datasGame.commonEvents.commonReactions[this.commonReactionID], 
                null, null, this.parameters);
        }
        RPM.blockingHero = currentState.interpreter.currentReaction.blockingHero;
        currentState.interpreter.update();
        if (currentState.interpreter.isFinished())
        {
            currentState.interpreter.updateFinish();
            return 1;
        }
        return 0;
    }

    // -------------------------------------------------------

    onKeyPressed(currentState, key)
    {
        if (currentState.interpreter && currentState.interpreter.currentCommand)
        {
            currentState.interpreter.currentCommand.data.onKeyPressed(
                currentState.interpreter.currentCommandState, key);
        }
        super.onKeyPressed(currentState, key);
    }

    // -------------------------------------------------------

    onKeyReleased(currentState, key)
    {
        if (currentState.interpreter && currentState.interpreter.currentCommand)
        {
            currentState.interpreter.currentCommand.data.onKeyReleased(
                currentState.interpreter.currentCommandState, key);
        }
        super.onKeyReleased(currentState, key);
    }

    // -------------------------------------------------------

    onKeyPressedRepeat(currentState, key)
    {
        if (currentState.interpreter && currentState.interpreter.currentCommand)
        {
            return currentState.interpreter.currentCommand.data
                .onKeyPressedRepeat(currentState.interpreter.currentCommandState
                , key);
        }
        return super.onKeyPressedRepeat(currentState, key);
    }

    // -------------------------------------------------------

    onKeyPressedAndRepeat(currentState, key)
    {
        if (currentState.interpreter && currentState.interpreter.currentCommand)
        {
            currentState.interpreter.currentCommand.data.onKeyPressedAndRepeat(
                currentState.interpreter.currentCommandState, key);
        }
        super.onKeyPressedAndRepeat(currentState, key);
    }

    // -------------------------------------------------------
    /** Draw the dialog box.
    *   @param {Object} currentState The current state of the event.
    */
    drawHUD(currentState)
    {
        if (currentState.interpreter && currentState.interpreter.currentCommand)
        {
            currentState.interpreter.currentCommand.data.drawHUD(currentState
                .interpreter.currentCommandState);
        }
        super.drawHUD(currentState);
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandLabel
//
// -------------------------------------------------------

class EventCommandLabel extends EventCommand
{
    constructor(command)
    {
        super();
        
        let iterator = {
            i: 0
        }
        this.label = SystemValue.createValueCommand(command, iterator);
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandJumpToLabel
//
// -------------------------------------------------------

class EventCommandJumpToLabel extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        }
        this.label = SystemValue.createValueCommand(command, iterator);
    }

    // -------------------------------------------------------

    update(currentState, object, state)
    {
        return this.label.getValue();
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandComment
//
// -------------------------------------------------------

class EventCommandComment extends EventCommand
{
    constructor(command)
    {
        super();
    }    
}

// -------------------------------------------------------
//
//  CLASS EventCommandChangeAStatistic
//
// -------------------------------------------------------

class EventCommandChangeAStatistic extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        }
        this.statisticID = SystemValue.createValueCommand(command, iterator);

        // Selection
        this.selection = command[iterator.i++];
        switch (this.selection)
        {
        case 0:
            this.heInstanceID = SystemValue.createValueCommand(command, iterator);
            break;
        case 1:
            this.groupIndex = command[iterator.i++];
            break;
        }
        
        // Operation
        this.operation = command[iterator.i++];

        // Value
        this.value = command[iterator.i++];
        switch (this.value)
        {
        case 0:
            this.vNumber = SystemValue.createValueCommand(command, iterator);
            break;
        case 1:
            this.vFormula = SystemValue.createValueCommand(command, iterator);
            break;
        case 2:
            this.vMax = true;
            break;
        }

        // Option
        this.canAboveMax = !RPM.numToBool(command[iterator.i++]);
    }

    // -------------------------------------------------------

    update(currentState, object, state)
    {
        let stat = RPM.datasGame.battleSystem.statistics[this.statisticID
            .getValue()];
        let abr = stat.abbreviation;
        let targets;
        switch (this.selection)
        {
        case 0:
            targets = [RPM.game.getHeroByInstanceID(this.heInstanceID.getValue())];
            break;
        case 1:
            targets = RPM.game.getTeam(this.groupIndex);
            break;
        }
        let target;
        for (let i = 0, l = targets.length; i < l; i++)
        {
            target = targets[i];
            switch (this.value)
            {
            case 0:
                target[abr] = RPM.operators_numbers[this.operation](target[abr], 
                    this.vNumber.getValue());
                break;
            case 1:
                target[abr] = RPM.operators_numbers[this.operation](target[abr],
                    RPM.evaluateFormula(this.vFormula.getValue(), target, null));
                break;
            case 2:
                target[abr] = RPM.operators_numbers[this.operation](target[abr], 
                    target[stat.getMaxAbbreviation()]);
                break;
            }
            if (!this.canAboveMax)
            {
                target[abr] = Math.max(target[stat.getMaxAbbreviation()], target
                    [abr]);
            }
        }
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandChangeASkill
//
// -------------------------------------------------------

class EventCommandChangeASkill extends EventCommand
{
    constructor(command)
    {
        super();

        var iterator = {
            i: 0
        }
        this.skillID = SystemValue.createValueCommand(command, iterator);
    
        // Selection
        this.selection = command[iterator.i++];
        switch (this.selection)
        {
        case 0:
            this.heInstanceID = SystemValue.createValueCommand(command, iterator);
            break;
        case 1:
            this.groupIndex = command[iterator.i++];
            break;
        }
        
        // Operation
        this.operation = command[iterator.i++];
    }

    // -------------------------------------------------------

    update(currentState, object, state)
    {
        let skillID = this.skillID.getValue();
        let targets;
        switch (this.selection)
        {
        case 0:
            targets = [RPM.game.getHeroByInstanceID(this.heInstanceID.getValue())];
            break;
        case 1:
            targets = RPM.game.getTeam(this.groupIndex);
            break;
        }
        let target, index;
        for (let i = 0, l = targets.length; i < l; i++)
        {
            target = targets[i];
            index = RPM.indexOfProp(target.sk, "id", skillID);
            switch (this.operation)
            {
            case 0:
                if (index === -1)
                {
                    target.sk.push(new GameSkill(skillID));
                }
                break;
            case 1:
                if (index !== -1)
                {
                    target.sk.splice(index, 1);
                }
                break;
            }
        }
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandChangeName
//
// -------------------------------------------------------

class EventCommandChangeName extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        }
        this.name = SystemValue.createValueCommand(command, iterator);

        // Selection
        this.selection = command[iterator.i++];
        switch (this.selection)
        {
        case 0:
            this.heInstanceID = SystemValue.createValueCommand(command, iterator);
            break;
        case 1:
            this.groupIndex = command[iterator.i++];
            break;
        }
    }

    // -------------------------------------------------------

    update(currentState, object, state)
    {
        let name = this.name.getValue();
        let targets;
        switch (this.selection)
        {
        case 0:
            targets = [RPM.game.getHeroByInstanceID(this.heInstanceID.getValue())];
            break;
        case 1:
            targets = RPM.game.getTeam(this.groupIndex);
            break;
        }
        let target;
        for (let i = 0, l = targets.length; i < l; i++)
        {
            target = targets[i];
            target.character.name = name;
            target.name = name;
        }
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandChangeEquipment
//
// -------------------------------------------------------

class EventCommandChangeEquipment extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        };
        this.equipmentID = SystemValue.createValueCommand(command, iterator);
        this.isWeapon = RPM.numToBool(command[iterator.i++]);
        this.weaponArmorID = SystemValue.createValueCommand(command, iterator);

        // Selection
        this.selection = command[iterator.i++];
        switch (this.selection)
        {
        case 0:
            this.heInstanceID = SystemValue.createValueCommand(command, iterator);
            break;
        case 1:
            this.groupIndex = command[iterator.i++];
            break;
        }
        this.isApplyInInventory = RPM.numToBool(command[iterator.i++]);
    }

    // -------------------------------------------------------

    update(currentState, object, state)
    {
        let equipmentID = this.equipmentID.getValue();
        let kind = this.isWeapon ? ItemKind.Weapon : ItemKind.Armor;
        let weaponArmorID = this.weaponArmorID.getValue();
        let targets;
        switch (this.selection)
        {
        case 0:
            targets = [RPM.game.getHeroByInstanceID(this.heInstanceID.getValue())];
            break;
        case 1:
            targets = RPM.game.getTeam(this.groupIndex);
            break;
        }
        let target, item;
        for (let i = 0, l = targets.length; i < l; i++)
        {
            target = targets[i];
            item = GameItem.findItem(kind, weaponArmorID);
            if (item === null)
            {
                if (this.isApplyInInventory)
                {
                    break; // Don't apply because not in inventory
                }
                item = new GameItem(kind, weaponArmorID, 0);
            }
            if (target.equip[equipmentID] !== null)
            {
                target.equip[equipmentID].add(1);
            }
            target.equip[equipmentID] = item;
            if (this.isApplyInInventory)
            {
                item.remove(1);
            }
        }
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandModifyCurrency
//
// -------------------------------------------------------

class EventCommandModifyCurrency extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        };
        this.currencyID = SystemValue.createValueCommand(command, iterator);
        this.operation = command[iterator.i++];
        this.value = SystemValue.createValueCommand(command, iterator);
    }

    // -------------------------------------------------------

    update(currentState, object, state)
    {
        let currencyID = this.currencyID.getValue();
        RPM.game.currencies[currencyID] = RPM.operators_numbers[this.operation](
            RPM.game.currencies[currencyID], this.value.getValue());
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandDisplayAnAnimation
//
// -------------------------------------------------------

class EventCommandDisplayAnAnimation extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        };
        this.objectID = SystemValue.createValueCommand(command, iterator);
        this.animationID = SystemValue.createValueCommand(command, iterator);
        this.isWaitEnd = RPM.numToBool(command[iterator.i++]);
        this.isDirectNode = !this.isWaitEnd;
        this.parallel = !this.isWaitEnd;
    }

    initialize()
    {
        let animation = RPM.datasGame.animations.list[this.animationID.getValue()];
        return {
            parallel: this.isWaitEnd,
            animation: animation,
            picture: animation.createPicture(),
            frame: 1,
            frameMax: animation.frames.length - 1,
            object: null,
            waitingObject: false
        }
    }

    // -------------------------------------------------------

    update(currentState, object, state)
    {
        if (currentState.parallel)
        {
            if (!currentState.waitingObject)
            {
                let objectID = this.objectID.getValue();
                MapObject.updateObjectWithID(object, objectID, this, (moved) =>
                {
                    currentState.object = moved;
                });
                currentState.waitingObject = true;
            }
            if (currentState.object !== null)
            {
                currentState.object.topPosition = RPM.toScreenPosition(
                    currentState.object.upPosition, RPM.currentMap.camera
                    .threeCamera);
                currentState.object.midPosition = RPM.toScreenPosition(
                    currentState.object.halfPosition, RPM.currentMap.camera
                    .threeCamera);
                currentState.object.botPosition = RPM.toScreenPosition(
                    currentState.object.position, RPM.currentMap.camera
                    .threeCamera);
                currentState.animation.playSounds(currentState.frame, 
                    AnimationEffectConditionKind.None);
                currentState.frame++;
                RPM.requestPaintHUD = true;
                return currentState.frame > currentState.frameMax ? 1 : 0;
            }
        }
        return 1;
    }

    // -------------------------------------------------------

    drawHUD(currentState)
    {
        if (currentState.object !== null)
        {
            currentState.animation.draw(currentState.picture, currentState.frame
                , currentState.object);
        }
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandShakeScreen
//
// -------------------------------------------------------

class EventCommandShakeScreen extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        };
        this.offset = SystemValue.createValueCommand(command, iterator);
        this.shakeNumber = SystemValue.createValueCommand(command, iterator);
        this.isWaitEnd = RPM.numToBool(command[iterator.i++]);
        this.time = SystemValue.createValueCommand(command, iterator);
        this.isDirectNode = !this.isWaitEnd;
        this.parallel = !this.isWaitEnd;
    }

    static updateTargetOffset(currentState, timeRate)
    {
        let value = timeRate * currentState.finalDifPos;
        RPM.currentMap.camera.targetOffset.x += value * -Math.sin(RPM.currentMap
            .camera.horizontalAngle * Math.PI / 180.0);
        RPM.currentMap.camera.targetOffset.z += value * Math.cos(RPM.currentMap
            .camera.horizontalAngle * Math.PI / 180.0);
    }

    initialize()
    {
        let t = this.time.getValue();
        let time = t * 1000;
        let shakeNumber = this.shakeNumber.getValue() * 2;
        let totalShakes = shakeNumber * t;

        // Should be pair to have perfect cycles
        if (totalShakes % 2 !== 0)
        {
            let floor = Math.floor(totalShakes / 2) * 2;
            let ceil = floor + 2;
            shakeNumber = ((floor !== 0 && (totalShakes - floor) < (ceil - totalShakes)) ? floor : ceil) 
                / t; 
        }
        let shakeTime = 1 / (shakeNumber * 2) * 1000;
        let offset = this.offset.getValue();
        return {
            parallel: this.isWaitEnd,
            offset: offset,
            shakeTime: shakeTime,
            shakeTimeLeft: shakeTime,
            currentOffset: 0,
            beginPosX: RPM.currentMap.camera.targetOffset.x,
            beginPosZ: RPM.currentMap.camera.targetOffset.z,
            finalDifPos: -offset,
            time: time,
            timeLeft: time,
            left: true
        }
    }

    // -------------------------------------------------------

    update(currentState, object, state)
    {
        if (currentState.parallel)
        {
            let timeRate, dif;
            if (currentState.time === 0)
            {
                timeRate = 1;
            } else 
            {
                dif = RPM.elapsedTime;
                currentState.timeLeft -= RPM.elapsedTime;
                if (currentState.timeLeft < 0)
                {
                    dif += currentState.timeLeft;
                    currentState.timeLeft = 0;
                }
                currentState.shakeTimeLeft -= RPM.elapsedTime;
                if (currentState.shakeTimeLeft <= 0)
                {
                    timeRate = (dif + currentState.shakeTimeLeft) / currentState
                        .shakeTime;
                    EventCommandShakeScreen.updateTargetOffset(currentState, 
                        timeRate);
                    dif = -currentState.shakeTimeLeft;
                    currentState.shakeTimeLeft = currentState.shakeTime + 
                        currentState.shakeTimeLeft;
                    currentState.currentOffset++;
                    currentState.finalDifPos = (Math.ceil(currentState
                        .currentOffset / 2) % 2 === 0) ? -currentState.offset : 
                        currentState.offset;
                }
                timeRate = dif / currentState.shakeTime;
            }
            EventCommandShakeScreen.updateTargetOffset(currentState, timeRate);
            if (currentState.timeLeft === 0)
            {
                RPM.currentMap.camera.targetOffset.x = currentState.beginPosX;
                RPM.currentMap.camera.targetOffset.z = currentState.beginPosZ;
                return 1;
            }
            return 0;
        }
        return 1;
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandFlashScreen
//
// -------------------------------------------------------

class EventCommandFlashScreen extends EventCommand
{
    constructor(command)
    {
        super();

        let iterator = {
            i: 0
        }
        this.colorID = SystemValue.createValueCommand(command, iterator);
        this.isWaitEnd = RPM.numToBool(command[iterator.i++]);
        this.time = SystemValue.createValueCommand(command, iterator);
        this.isDirectNode = !this.isWaitEnd;
        this.parallel = !this.isWaitEnd;
    }

    initialize()
    {
        let time = this.time.getValue() * 1000;
        let color = RPM.datasGame.system.colors[this.colorID.getValue()];
        return {
            parallel: this.isWaitEnd,
            time: time,
            timeLeft: time,
            color: color.getHex(),
            finalDifA: -color.alpha,
            a: color.alpha
        }
    }

    // -------------------------------------------------------

    update(currentState, object, state)
    {
        if (currentState.parallel)
        {
            let timeRate, dif;
            if (currentState.time === 0)
            {
                timeRate = 1;
            } else
            {
                dif = RPM.elapsedTime;
                currentState.timeLeft -= RPM.elapsedTime;
                if (currentState.timeLeft < 0) {
                    dif += currentState.timeLeft;
                    currentState.timeLeft = 0;
                }
                timeRate = dif / currentState.time;
            }

            // Update values
            currentState.a = currentState.a + (timeRate * currentState.finalDifA);
            RPM.requestPaintHUD = true;
            return currentState.timeLeft === 0 ? 1 : 0;
        }
        return 1;
    }

    // -------------------------------------------------------

    drawHUD(currentState)
    {
        Platform.ctx.fillStyle = currentState.color;
        Platform.ctx.globalAlpha = currentState.a;
        Platform.ctx.fillRect(0, 0, RPM.CANVAS_WIDTH, RPM.CANVAS_HEIGHT);
        Platform.ctx.globalAlpha = 1.0;
    }
}