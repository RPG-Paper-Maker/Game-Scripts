/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { EVENT_COMMAND_KIND } from '../Common';
import { Game, MapObject, Portion } from '../Core';
import { Data, EventCommand, Manager, Scene } from '../index';
import { DynamicValue, ReactionCommandJSON } from '../Model';

/** @class
 *  A static class for some events functions.
 *  @static
 */
class Events {
	constructor() {
		throw new Error('This is a static class');
	}

	/**
	 *  Get the event command and read json.
	 *  @param {Record<string, any>} - json
	 *  @returns {EventCommand.Base}
	 */
	static getEventCommand(json: ReactionCommandJSON): EventCommand.Base {
		const command = json.command;
		switch (json.kind) {
			case EVENT_COMMAND_KIND.SHOW_TEXT:
				return new EventCommand.ShowText(command);
			case EVENT_COMMAND_KIND.CHANGE_VARIABLES:
				return new EventCommand.ChangeVariables(command);
			case EVENT_COMMAND_KIND.GAME_OVER:
				return new EventCommand.GameOver(command);
			case EVENT_COMMAND_KIND.WHILE:
				return new EventCommand.While(command);
			case EVENT_COMMAND_KIND.WHILE_BREAK:
				return new EventCommand.WhileBreak(command);
			case EVENT_COMMAND_KIND.INPUT_NUMBER:
				return new EventCommand.InputNumber(command);
			case EVENT_COMMAND_KIND.IF:
				return new EventCommand.If(command);
			case EVENT_COMMAND_KIND.ELSE:
				return new EventCommand.Else(command);
			case EVENT_COMMAND_KIND.OPEN_MAIN_MENU:
				return new EventCommand.OpenMainMenu(command);
			case EVENT_COMMAND_KIND.OPEN_SAVES_MENU:
				return new EventCommand.OpenSavesMenu(command);
			case EVENT_COMMAND_KIND.MODIFY_INVENTORY:
				return new EventCommand.ModifyInventory(command);
			case EVENT_COMMAND_KIND.MODIFY_TEAM:
				return new EventCommand.ModifyTeam(command);
			case EVENT_COMMAND_KIND.START_BATTLE:
				return new EventCommand.StartBattle(command);
			case EVENT_COMMAND_KIND.IF_WIN:
				return new EventCommand.IfWin(command);
			case EVENT_COMMAND_KIND.IF_LOSE:
				return new EventCommand.IfLose(command);
			case EVENT_COMMAND_KIND.CHANGE_STATE:
				return new EventCommand.ChangeState(command);
			case EVENT_COMMAND_KIND.SEND_EVENT:
				return new EventCommand.SendEvent(command);
			case EVENT_COMMAND_KIND.TELEPORT_OBJECT:
				return new EventCommand.TeleportObject(command);
			case EVENT_COMMAND_KIND.MOVE_OBJECT:
				return new EventCommand.MoveObject(command);
			case EVENT_COMMAND_KIND.WAIT:
				return new EventCommand.Wait(command);
			case EVENT_COMMAND_KIND.MOVE_CAMERA:
				return new EventCommand.MoveCamera(command);
			case EVENT_COMMAND_KIND.PLAY_MUSIC:
				return new EventCommand.PlayMusic(command);
			case EVENT_COMMAND_KIND.STOP_MUSIC:
				return new EventCommand.StopMusic(command);
			case EVENT_COMMAND_KIND.PLAY_BACKGROUND_SOUND:
				return new EventCommand.PlayBackgroundSound(command);
			case EVENT_COMMAND_KIND.STOP_BACKGROUND_SOUND:
				return new EventCommand.StopBackgroundSound(command);
			case EVENT_COMMAND_KIND.PLAY_SOUND:
				return new EventCommand.PlaySound(command);
			case EVENT_COMMAND_KIND.PLAY_MUSIC_EFFECT:
				return new EventCommand.PlayMusicEffect(command);
			case EVENT_COMMAND_KIND.CHANGE_PROPERTY:
				return new EventCommand.ChangeProperty(command);
			case EVENT_COMMAND_KIND.DISPLAY_CHOICE:
				return new EventCommand.DisplayChoice(command);
			case EVENT_COMMAND_KIND.CHOICE:
				return new EventCommand.Choice(command);
			case EVENT_COMMAND_KIND.SCRIPT:
				return new EventCommand.Script(command);
			case EVENT_COMMAND_KIND.DISPLAY_A_PICTURE:
				return new EventCommand.DisplayAPicture(command);
			case EVENT_COMMAND_KIND.SET_MOVE_TURN_A_PICTURE:
				return new EventCommand.SetMoveTurnAPicture(command);
			case EVENT_COMMAND_KIND.REMOVE_A_PICTURE:
				return new EventCommand.RemoveAPicture(command);
			case EVENT_COMMAND_KIND.SET_DIALOG_BOX_OPTIONS:
				return new EventCommand.SetDialogBoxOptions(command);
			case EVENT_COMMAND_KIND.TITLE_SCREEN:
				return new EventCommand.TitleScreen(command);
			case EVENT_COMMAND_KIND.CHANGE_SCREEN_TONE:
				return new EventCommand.ChangeScreenTone(command);
			case EVENT_COMMAND_KIND.REMOVE_OBJECT_FROM_MAP:
				return new EventCommand.RemoveObjectFromMap(command);
			case EVENT_COMMAND_KIND.STOP_REACTION:
				return new EventCommand.StopReaction(command);
			case EVENT_COMMAND_KIND.ALLOW_FORBID_SAVES:
				return new EventCommand.AllowForbidSaves(command);
			case EVENT_COMMAND_KIND.ALLOW_FORBID_MAIN_MENU:
				return new EventCommand.AllowForbidMainMenu(command);
			case EVENT_COMMAND_KIND.CALL_A_COMMON_REACTION:
				return new EventCommand.CallACommonReaction(command);
			case EVENT_COMMAND_KIND.LABEL:
				return new EventCommand.Label(command);
			case EVENT_COMMAND_KIND.JUMP_LABEL:
				return new EventCommand.JumpToLabel(command);
			case EVENT_COMMAND_KIND.COMMENT:
				return new EventCommand.Comment(command);
			case EVENT_COMMAND_KIND.CHANGE_A_STATISTIC:
				return new EventCommand.ChangeAStatistic(command);
			case EVENT_COMMAND_KIND.CHANGE_A_SKILL:
				return new EventCommand.ChangeASkill(command);
			case EVENT_COMMAND_KIND.CHANGE_NAME:
				return new EventCommand.ChangeName(command);
			case EVENT_COMMAND_KIND.CHANGE_EQUIPMENT:
				return new EventCommand.ChangeEquipment(command);
			case EVENT_COMMAND_KIND.MODIFY_CURRENCY:
				return new EventCommand.ModifyCurrency(command);
			case EVENT_COMMAND_KIND.DISPLAY_AN_ANIMATION:
				return new EventCommand.DisplayAnAnimation(command);
			case EVENT_COMMAND_KIND.SHAKE_SCREEN:
				return new EventCommand.ShakeScreen(command);
			case EVENT_COMMAND_KIND.FLASH_SCREEN:
				return new EventCommand.FlashScreen(command);
			case EVENT_COMMAND_KIND.PLUGIN:
				return new EventCommand.Plugin(command);
			case EVENT_COMMAND_KIND.START_SHOP_MENU:
				return new EventCommand.StartShopMenu(command);
			case EVENT_COMMAND_KIND.RESTOCK_SHOP:
				return new EventCommand.StartShopMenu(command, true);
			case EVENT_COMMAND_KIND.ENTER_A_NAME_MENU:
				return new EventCommand.EnterANameMenu(command);
			case EVENT_COMMAND_KIND.CREATE_OBJECT_IN_MAP:
				return new EventCommand.CreateObjectInMap(command);
			case EVENT_COMMAND_KIND.CHANGE_STATUS:
				return new EventCommand.ChangeStatus(command);
			case EVENT_COMMAND_KIND.RESET_CAMERA:
				return new EventCommand.ResetCamera(command);
			case EVENT_COMMAND_KIND.CHANGE_BATTLE_MUSIC:
				return new EventCommand.ChangeBattleMusic(command);
			case EVENT_COMMAND_KIND.CHANGE_VICTORY_MUSIC:
				return new EventCommand.ChangeVictoryMusic(command);
			case EVENT_COMMAND_KIND.END_BATTLE:
				return new EventCommand.EndBattle(command);
			case EVENT_COMMAND_KIND.FORCE_AN_ACTION:
				return new EventCommand.ForceAnAction(command);
			case EVENT_COMMAND_KIND.CHANGE_MAP_PROPERTIES:
				return new EventCommand.ChangeMapProperties(command);
			case EVENT_COMMAND_KIND.CHANGE_EXPERIENCE_CURVE:
				return new EventCommand.ChangeExperienceCurve(command);
			case EVENT_COMMAND_KIND.CHANGE_CLASS:
				return new EventCommand.ChangeClass(command);
			case EVENT_COMMAND_KIND.CHANGE_CHRONOMETER:
				return new EventCommand.ChangeChronometer(command);
			case EVENT_COMMAND_KIND.CHANGE_WEATHER:
				return new EventCommand.ChangeWeather(command);
			case EVENT_COMMAND_KIND.PLAY_A_VIDEO:
				return new EventCommand.PlayAVideo(command);
			case EVENT_COMMAND_KIND.SWITCH_TEXTURE:
				return new EventCommand.SwitchTexture(command);
			case EVENT_COMMAND_KIND.STOP_A_SOUND:
				return new EventCommand.StopASound(command);
			case EVENT_COMMAND_KIND.DISPLAY_HIDE_A_BATTLER:
				return new EventCommand.DisplayHideABattler(command);
			case EVENT_COMMAND_KIND.TRANSFORM_A_BATTLER:
				return new EventCommand.TransformABattler(command);
			case EVENT_COMMAND_KIND.CHANGE_BATTLER_GRAPHICS:
				return new EventCommand.ChangeBattlerGraphics(command);
			default:
				return null;
		}
	}

	/**
	 *  Send an event.
	 *  @static
	 *  @param {MapObject} sender - The sender of this event
	 *  @param {number} targetKind - The kind of target
	 *  @param {number} targetID - The target ID
	 *  @param {boolean} isSystem - Boolean indicating if it is an event System
	 *  @param {number} eventID - The event ID
	 *  @param {Parameter[]} parameters - List of all the parameters
	 *  @param {boolean} senderNoReceiver - Indicate if the sender should not
	 *  receive event
	 */
	static sendEvent(
		sender: MapObject,
		targetKind: number,
		targetID: number,
		isSystem: boolean,
		eventID: number,
		parameters: Map<number, DynamicValue>,
		senderNoReceiver: boolean,
		onlyTheClosest: boolean
	) {
		switch (targetKind) {
			case 0: // Send to all
				Manager.Events.sendEventDetection(sender, -1, isSystem, eventID, parameters);
				break;
			case 1: // Send to detection
				Manager.Events.sendEventDetection(
					sender,
					targetID,
					isSystem,
					eventID,
					parameters,
					senderNoReceiver,
					onlyTheClosest
				);
				break;
			case 2: // Send to a particular object
				if (targetID === -1) {
					// Send to sender
					sender.receiveEvent(sender, isSystem, eventID, parameters, sender.states);
				} else if (targetID === 0) {
					// Send to the hero
					Game.current.hero.receiveEvent(sender, isSystem, eventID, parameters, Game.current.heroStates);
				} else {
					Scene.Map.current.updatePortions(
						this,
						function (x: number, y: number, z: number, i: number, j: number, k: number) {
							const objects = Game.current.getPortionData(Scene.Map.current.id, new Portion(x, y, z));

							// Moved objects
							let a: number, l: number, object: MapObject;
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
							const mapPortion = Scene.Map.current.getMapPortion(i, j, k);
							if (mapPortion) {
								for (a = 0, l = mapPortion.objectsList.length; a < l; a++) {
									object = mapPortion.objectsList[a];
									if (object.system.id === targetID) {
										object.receiveEvent(sender, isSystem, eventID, parameters, object.states);
										break;
									}
								}
							}
						}
					);
				}
				break;
			default:
				break;
		}
	}

	/**
	 *  Send an event detection
	 *  @static
	 *  @param {MapObject} sender - The sender of this event
	 *  @param {number} targetID - The target ID
	 *  @param {boolean} isSystem - Boolean indicating if it is an event System
	 *  @param {number} eventID - The event ID
	 *  @param {Parameter[]} parameters - List of all the parameters
	 *  @param {boolean} senderNoReceiver - Indicate if the sender should not
	 *  receive event
	 */
	static sendEventDetection(
		sender: MapObject,
		targetID: number,
		isSystem: boolean,
		eventID: number,
		parameters: Map<number, DynamicValue>,
		senderNoReceiver: boolean = false,
		onlyTheClosest: boolean = false
	) {
		let objects: Record<string, any>;
		const closests: any[][] = [];
		Scene.Map.current.updatePortions(this, (x: number, y: number, z: number, i: number, j: number, k: number) => {
			objects = Game.current.getPortionData(Scene.Map.current.id, new Portion(x, y, z));

			// Moved objects
			Manager.Events.sendEventObjects(
				objects.min,
				sender,
				targetID,
				isSystem,
				eventID,
				parameters,
				senderNoReceiver,
				onlyTheClosest,
				closests
			);
			Manager.Events.sendEventObjects(
				objects.mout,
				sender,
				targetID,
				isSystem,
				eventID,
				parameters,
				senderNoReceiver,
				onlyTheClosest,
				closests
			);
			// Static
			const mapPortion = Scene.Map.current.getMapPortion(i, j, k);
			if (mapPortion) {
				Manager.Events.sendEventObjects(
					mapPortion.objectsList,
					sender,
					targetID,
					isSystem,
					eventID,
					parameters,
					senderNoReceiver,
					onlyTheClosest,
					closests
				);
			}
		});

		// And the hero!
		if (!senderNoReceiver || sender !== Game.current.hero) {
			if (targetID !== -1) {
				// Check according to detection model
				if (!Data.Systems.getDetection(targetID).checkCollision(sender, Game.current.hero)) {
					return;
				}
			}
			if (onlyTheClosest) {
				closests.push([Game.current.hero, sender, isSystem, eventID, parameters, Game.current.heroStates]);
			} else {
				Game.current.hero.receiveEvent(sender, isSystem, eventID, parameters, Game.current.heroStates);
			}
		}

		// If only sending to the closest to the sender...
		if (onlyTheClosest && closests.length > 0) {
			let closest = closests[0],
				d1: number,
				d2: number;
			for (let i = 1, l = closests.length; i < l; i++) {
				d1 = closest[0].position.distanceTo(sender.position);
				d2 = closests[i][0].position.distanceTo(sender.position);
				if (d1 >= d2) {
					closest = closests[i];
				}
			}
			closest[0].receiveEvent(closest[1], closest[2], closest[3], closest[4], closest[5]);
		}
	}

	/**
	 *  Send an event to objects.
	 *  @static
	 *  @param {MapObject[]} objects - The list of objects to send event
	 *  @param {MapObject} sender - The sender of this event
	 *  @param {number} targetID - The target ID
	 *  @param {boolean} isSystem - Boolean indicating if it is an event System
	 *  @param {number} eventID - The event ID
	 *  @param {Parameter[]} parameters - List of all the parameters
	 *  @param {boolean} senderNoReceiver - Indicate if the sender should not
	 *  receive event
	 *  @param {boolean} onlyTheClosest
	 *  @param {any[][]} closests
	 */
	static sendEventObjects(
		objects: MapObject[],
		sender: MapObject,
		targetID: number,
		isSystem: boolean,
		eventID: number,
		parameters: Map<number, DynamicValue>,
		senderNoReceiver: boolean,
		onlyTheClosest: boolean,
		closests: any[][]
	) {
		let object: MapObject;
		for (let i = 0, l = objects.length; i < l; i++) {
			object = objects[i];
			if (senderNoReceiver && sender === object) {
				continue;
			}
			if (targetID !== -1) {
				// Check according to detection model
				if (!Data.Systems.getDetection(targetID).checkCollision(sender, object)) {
					continue;
				}
			}

			// Make the object receive the event
			if (onlyTheClosest) {
				closests.push([object, sender, isSystem, eventID, parameters, object.states]);
			} else {
				object.receiveEvent(sender, isSystem, eventID, parameters, object.states);
			}
		}
	}
}

export { Events };
