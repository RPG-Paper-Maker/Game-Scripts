/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as EventCommand from "."
import { MapObject } from "../Core";

interface StructIterator {
    i: number
}

/** @class
 *  An event command
 *  @property {boolean} isDirectNode Indicate if this node is directly
 *  going to the next node (takes only one frame)
 *  @property {boolean} parallel Indicate if this command is run in parallel
 */
abstract class Base {

    public isDirectNode: boolean;
    public parallel: boolean;

    constructor() {
        this.isDirectNode = true;
        this.parallel = false;
    }

    /** 
     *  Get the event command and read json.
     *  @param {Record<string, any>} json
     *  @returns {EventCommand.Base}
     */
    static get(json: Record<string, any>): EventCommand.Base {
        let command = json.command;
        /*
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
        }*/
        return null;
    }

    /** 
     * Initialize the current state.
     * @returns {Object} The current state
     */
    initialize(): Object {
        return null;
    }

    /** 
     * Update and check if the event is finished.
     * @param {Object} currentState The current state of the event
     * @param {Game.Object} object The current object reacting
     * @param {number} state The state ID
     * @returns {number} The number of node to pass
     */
    update(currentState: Object, object: MapObject, state: number): number {
        return 1;
    }

    /** 
     *  First key press handle for the current stack.
     *  @param {Object} currentState The current state of the event
     *  @param {number} key The key ID pressed
     */
    onKeyPressed(currentState: Object, key: number) {

    }

    /** 
     *  First key release handle for the current stack.
     *  @param {Object} currentState The current state of the event
     *  @param {number} key The key ID pressed
    */
    onKeyReleased(currentState: Object, key: number) {

    }

    /** 
     *  Key pressed repeat handle for the current stack.
     *  @param {Object} currentState The current state of the event
     *  @param {number} key The key ID pressed
     *  @returns {boolean}
     */
    onKeyPressedRepeat(currentState: Object, key: number): boolean {
        return true;
    }

    /** 
     *  Key pressed repeat handle for the current stack, but with
     *  a small wait after the first pressure (generally used for menus).
     *  @param {Object} currentState The current state of the event
     *  @param {number} key The key ID pressed
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(currentState: Object, key: number): boolean {
        return true;
    }

    /** 
     *  Draw the HUD.
     *  @param {Object} currentState The current state of the event
     */
    drawHUD(currentState: Object) {

    }
}

export { StructIterator, Base }
