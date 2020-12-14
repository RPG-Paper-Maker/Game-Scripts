/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Portion } from "../Core/index.js";
import { Enum } from "../Common/index.js";
var EventCommandKind = Enum.EventCommandKind;
import { EventCommand, Manager, Datas } from "../index.js";
/** @class
 *  A static class for some events functions.
 */
class Events {
    constructor() {
        throw new Error("This is a static class");
    }
    /**
     *  Get the event command and read json.
     *  @param {Record<string, any>} json
     *  @returns {EventCommand.Base}
     */
    static getEventCommand(json) {
        let command = json.command;
        switch (json.kind) {
            /*
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
                */
            case EventCommandKind.SetDialogBoxOptions:
                return new EventCommand.SetDialogBoxOptions(command);
            /*
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
            */
        }
        return null;
    }
    /**
     *  Send an event.
     *  @static
     *  @param {MapObject} sender The sender of this event
     *  @param {number} targetKind The kind of target
     *  @param {number} targetID The target ID
     *  @param {boolean} isSystem Boolean indicating if it is an event System
     *  @param {number} eventID The event ID
     *  @param {Parameter[]} parameters List of all the parameters
     *  @param {boolean} senderNoReceiver Indicate if the sender should not
     *  receive event
     */
    static sendEvent(sender, targetKind, targetID, isSystem, eventID, parameters, senderNoReceiver) {
        switch (targetKind) {
            case 0: // Send to all
                Manager.Events.sendEventDetection(sender, -1, isSystem, eventID, parameters);
                break;
            case 1: // Send to detection
                Manager.Events.sendEventDetection(sender, targetID, isSystem, eventID, parameters, senderNoReceiver);
                break;
            case 2: // Send to a particular object
                if (targetID === -1) {
                    // Send to sender
                    sender.receiveEvent(sender, isSystem, eventID, parameters, sender.states);
                }
                else if (targetID === 0) {
                    // Send to the hero
                    Manager.Stack.game.hero.receiveEvent(sender, isSystem, eventID, parameters, Manager.Stack.game.heroStates);
                }
                else {
                    Manager.Stack.currentMap.updatePortions(this, function (x, y, z, i, j, k) {
                        let objects = Manager.Stack.game.getPotionsDatas(Manager
                            .Stack.currentMap.id, new Portion(x, y, z));
                        // Moved objects
                        let a, l, object;
                        for (a = 0, l = objects.min.length; a < l; a++) {
                            object = objects.min[a];
                            if (object.system.id === targetID) {
                                object.receiveEvent(sender, isSystem, eventID, parameters, object.states);
                                break;
                            }
                        }
                        for (a = 0, l = objects.mout.length; a < l; a++) {
                            object = objects.mout[a];
                            if (object.system.id === targetID) {
                                object.receiveEvent(sender, isSystem, eventID, parameters, object.states);
                                break;
                            }
                        }
                        // Static
                        let mapPortion = Manager.Stack.currentMap.getMapPortion(new Portion(i, j, k));
                        if (mapPortion) {
                            for (a = 0, l = mapPortion.objectsList.length; a < l; a++) {
                                object = mapPortion.objectsList[a];
                                if (object.system.id === targetID) {
                                    object.receiveEvent(sender, isSystem, eventID, parameters, object.states);
                                    break;
                                }
                            }
                            if (mapPortion.heroID === targetID) {
                                Manager.Stack.game.hero.receiveEvent(sender, isSystem, eventID, parameters, Manager.Stack
                                    .game.heroStates);
                            }
                        }
                    });
                }
                break;
            default:
                break;
        }
    }
    /**
     *  Send an event detection
     *  @static
     *  @param {MapObject} sender The sender of this event
     *  @param {number} targetID The target ID
     *  @param {boolean} isSystem Boolean indicating if it is an event System
     *  @param {number} eventID The event ID
     *  @param {Parameter[]} parameters List of all the parameters
     *  @param {boolean} senderNoReceiver Indicate if the sender should not
     *  receive event
     */
    static sendEventDetection(sender, targetID, isSystem, eventID, parameters, senderNoReceiver = false) {
        Manager.Stack.currentMap.updatePortions(this, function (x, y, z, i, j, k) {
            let objects = Manager.Stack.game.getPotionsDatas(Manager.Stack
                .currentMap.id, new Portion(x, y, z));
            // Moved objects
            Manager.Events.sendEventObjects(objects.min, sender, targetID, isSystem, eventID, parameters, senderNoReceiver);
            Manager.Events.sendEventObjects(objects.mout, sender, targetID, isSystem, eventID, parameters, senderNoReceiver);
            // Static
            let mapPortion = Manager.Stack.currentMap.getMapPortion(new Portion(i, j, k));
            if (mapPortion) {
                Manager.Events.sendEventObjects(mapPortion.objectsList, sender, targetID, isSystem, eventID, parameters, senderNoReceiver);
            }
        });
        // And the hero!
        if (!senderNoReceiver || sender !== Manager.Stack.game.hero) {
            if (targetID !== -1) {
                // Check according to detection model
                if (!Datas.Systems.getDetection(targetID).checkCollision(sender, Manager.Stack.game.hero)) {
                    return;
                }
            }
            Manager.Stack.game.hero.receiveEvent(sender, isSystem, eventID, parameters, Manager.Stack.game.heroStates);
        }
    }
    /**
     *  Send an event to objects.
     *  @static
     *  @param {MapObject[]} objects The list of objects to send event
     *  @param {MapObject} sender The sender of this event
     *  @param {number} targetID The target ID
     *  @param {boolean} isSystem Boolean indicating if it is an event System
     *  @param {number} eventID The event ID
     *  @param {Parameter[]} parameters List of all the parameters
     *  @param {boolean} senderNoReceiver Indicate if the sender should not
     *  receive event
     */
    static sendEventObjects(objects, sender, targetID, isSystem, eventID, parameters, senderNoReceiver) {
        let object;
        for (let i = 0, l = objects.length; i < l; i++) {
            object = objects[i];
            if (senderNoReceiver && sender === object) {
                continue;
            }
            if (targetID !== -1) {
                // Check according to detection model
                if (!Datas.Systems.getDetection(targetID).checkCollision(sender, object)) {
                    continue;
                }
            }
            // Make the object receive the event
            object.receiveEvent(sender, isSystem, eventID, parameters, object
                .states);
        }
    }
}
export { Events };
