/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {
	CHANGE_VARIABLES_OTHER_CHARACTERISTICS,
	CHARACTER_KIND,
	ITEM_KIND,
	Mathf,
	Platform,
	SONG_KIND,
	VARIABLE_MAP_OBJECT_CHARACTERISTIC_KIND,
} from '../Common';
import { Game, Item, MapObject, Position, StructSearchResult } from '../Core';
import { Datas, Manager, Scene, System } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for changing variables values.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ChangeVariables extends Base {
	public selection: number;
	public nbSelection: number;
	public operation: number;
	public valueKind: number;
	public valueNumber: System.DynamicValue;
	public valueRandomA: System.DynamicValue;
	public valueRandomB: System.DynamicValue;
	public valueMessage: System.DynamicValue;
	public valueSwitch: System.DynamicValue;
	public valueMapObject: System.DynamicValue;
	public valueMapObjectChar: number;
	public valueITEM_KIND: ITEM_KIND;
	public valueItemID: System.DynamicValue;
	public valueTotalCurrencyKind: number;
	public valueTotalCurrencyID: System.DynamicValue;
	public valueHeroEnemyInstanceID: System.DynamicValue;
	public valueStatisticID: System.DynamicValue;
	public valueEnemyIndex: number;
	public valueOtherCHARACTERISTIC_KIND: CHANGE_VARIABLES_OTHER_CHARACTERISTICS;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 2,
		};
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
				this.valueNumber = System.DynamicValue.createValueCommand(command, iterator);
				break;
			case 1: // Random number
				this.valueRandomA = System.DynamicValue.createValueCommand(command, iterator);
				this.valueRandomB = System.DynamicValue.createValueCommand(command, iterator);
				break;
			case 2: // Message
				this.valueMessage = System.DynamicValue.createValueCommand(command, iterator);
				break;
			case 3: // Switch
				this.valueSwitch = System.DynamicValue.createValueCommand(command, iterator);
				break;
			case 4: // Map object characteristic
				this.valueMapObject = System.DynamicValue.createValueCommand(command, iterator);
				this.valueMapObjectChar = command[iterator.i++];
				break;
			case 5: // Number of weapon / armor / item in inventory
				this.valueITEM_KIND = command[iterator.i++];
				this.valueItemID = System.DynamicValue.createValueCommand(command, iterator);
				break;
			case 6: // Total currency
				this.valueTotalCurrencyKind = command[iterator.i++];
				this.valueTotalCurrencyID = System.DynamicValue.createValueCommand(command, iterator);
				break;
			case 7: // Hero / enemy stat
				this.valueHeroEnemyInstanceID = System.DynamicValue.createValueCommand(command, iterator);
				this.valueStatisticID = System.DynamicValue.createValueCommand(command, iterator);
				break;
			case 8: // Enemy instance ID
				this.valueEnemyIndex = command[iterator.i++];
				break;
			case 9: // Other characteristics
				this.valueOtherCHARACTERISTIC_KIND = command[iterator.i++];
				break;
		}
	}

	/**
	 *  Initialize the current.
	 *  @returns {Record<string, any>} The current state
	 */
	initialize(): Record<string, any> {
		return {
			started: false,
		};
	}

	/**
	 *  Update and check if the event is finished
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		if (!currentState.started) {
			currentState.started = true;
			currentState.valid = true;
			// Get value to set
			switch (this.valueKind) {
				case 0: // Number
					currentState.value = this.valueNumber.getValue();
					break;
				case 1: // Random number
					currentState.value = Mathf.random(this.valueRandomA.getValue(), this.valueRandomB.getValue());
					break;
				case 2: // Message
					currentState.value = this.valueMessage.getValue();
					break;
				case 3: // Switch
					currentState.value = this.valueSwitch.getValue();
					break;
				case 4: // Map object characteristic
					const objectID = this.valueMapObject.getValue();
					currentState.valid = false;
					MapObject.search(
						objectID,
						(result: StructSearchResult) => {
							const obj = result.object;
							if (!obj) {
								Platform.showErrorMessage(
									'Cannot find object ID ' +
										objectID +
										' in change variables for map object characteristics.'
								);
							}
							switch (this.valueMapObjectChar) {
								case VARIABLE_MAP_OBJECT_CHARACTERISTIC_KIND.X_SQUARE_POSITION:
									currentState.value = Position.createFromVector3(obj.position).x;
									break;
								case VARIABLE_MAP_OBJECT_CHARACTERISTIC_KIND.Y_SQUARE_POSITION:
									currentState.value = Position.createFromVector3(obj.position).y;
									break;
								case VARIABLE_MAP_OBJECT_CHARACTERISTIC_KIND.Z_SQUARE_POSITION:
									currentState.value = Position.createFromVector3(obj.position).z;
									break;
								case VARIABLE_MAP_OBJECT_CHARACTERISTIC_KIND.X_PIXEL_POSITION:
									currentState.value = obj.position.x;
									break;
								case VARIABLE_MAP_OBJECT_CHARACTERISTIC_KIND.Y_PIXEL_POSITION:
									currentState.value = obj.position.y;
									break;
								case VARIABLE_MAP_OBJECT_CHARACTERISTIC_KIND.Z_PIXEL_POSITION:
									currentState.value = obj.position.z;
									break;
								case VARIABLE_MAP_OBJECT_CHARACTERISTIC_KIND.ORIENTATION:
									currentState.value = obj.orientation;
									break;
								case VARIABLE_MAP_OBJECT_CHARACTERISTIC_KIND.TERRAIN:
									currentState.value = obj.terrain;
									break;
							}
							currentState.valid = true;
						},
						object
					);
					break;
				case 5: // Number of weapon / armor / item in inventory
					const item = Item.findItem(this.valueITEM_KIND, this.valueItemID.getValue());
					currentState.value = item === null ? 0 : item.nb;
					break;
				case 6: // Total currency
					switch (this.valueTotalCurrencyKind) {
						case 0: // Owned
							currentState.value = Game.current.getCurrency(this.valueTotalCurrencyID.getValue());
							break;
						case 1: // Earned
							currentState.value = Game.current.getCurrencyEarned(this.valueTotalCurrencyID.getValue());
							break;
						case 2: // Used
							currentState.value = Game.current.getCurrencyUsed(this.valueTotalCurrencyID.getValue());
							break;
					}
					break;
				case 7: // Hero / enemy stat
					currentState.value = 0;
					const id = this.valueHeroEnemyInstanceID.getValue();
					for (const player of Game.current.teamHeroes) {
						if (player.instid === id) {
							currentState.value =
								player[Datas.BattleSystems.getStatistic(this.valueStatisticID.getValue()).abbreviation];
							break;
						}
					}
					break;
				case 8: // Enemy instance ID
					currentState.value = 0;
					if (Scene.Map.current.isBattleMap) {
						currentState.value = (<Scene.Battle>Scene.Map.current).battlers[CHARACTER_KIND.MONSTER][
							this.valueEnemyIndex
						].player.instid;
					}
					break;
				case 9: // Other characteristics
					switch (this.valueOtherCHARACTERISTIC_KIND) {
						case CHANGE_VARIABLES_OTHER_CHARACTERISTICS.CURRENT_MAP_ID:
							currentState.value = Scene.Map.current.id;
							break;
						case CHANGE_VARIABLES_OTHER_CHARACTERISTICS.NUMBER_IN_TEAM:
							currentState.value = Game.current.teamHeroes.length;
							break;
						case CHANGE_VARIABLES_OTHER_CHARACTERISTICS.NUMBER_IN_HIDDEN:
							currentState.value = Game.current.hiddenHeroes.length;
							break;
						case CHANGE_VARIABLES_OTHER_CHARACTERISTICS.NUMBER_IN_RESERVE:
							currentState.value = Game.current.reserveHeroes.length;
							break;
						case CHANGE_VARIABLES_OTHER_CHARACTERISTICS.TOTAL_NUMBER_OF_STEPS:
							currentState.value = Game.current.steps;
							break;
						case CHANGE_VARIABLES_OTHER_CHARACTERISTICS.TOTAL_NUMBER_OF_SECONDS:
							currentState.value = Game.current.playTime.getSeconds();
							break;
						case CHANGE_VARIABLES_OTHER_CHARACTERISTICS.TOTAL_NUMBER_OF_SAVES_DONE:
							currentState.value = Game.current.saves;
							break;
						case CHANGE_VARIABLES_OTHER_CHARACTERISTICS.TOTAL_NUMBER_OF_BATTLES:
							currentState.value = Game.current.battles;
							break;
						case CHANGE_VARIABLES_OTHER_CHARACTERISTICS.CAMERA_X_POSITION:
							currentState.value = Scene.Map.current.camera.getThreeCamera().position.x;
							break;
						case CHANGE_VARIABLES_OTHER_CHARACTERISTICS.CAMERA_Y_POSITION:
							currentState.value = Scene.Map.current.camera.getThreeCamera().position.y;
							break;
						case CHANGE_VARIABLES_OTHER_CHARACTERISTICS.CAMERA_Z_POSITION:
							currentState.value = Scene.Map.current.camera.getThreeCamera().position.z;
							break;
						case CHANGE_VARIABLES_OTHER_CHARACTERISTICS.TOTAL_SECONDS_CURRENT_MUSIC: {
							currentState.value = 0;
							const current = Manager.Songs.current[SONG_KIND.MUSIC];
							if (current) {
								currentState.value = current.seek();
							}
							break;
						}
						case CHANGE_VARIABLES_OTHER_CHARACTERISTICS.TOTAL_SECONDS_CURRENT_BACKGROUND_MUSIC: {
							currentState.value = 0;
							const current = Manager.Songs.current[SONG_KIND.BACKGROUND_SOUND];
							if (current) {
								currentState.value = current.seek();
							}
							break;
						}
					}
					break;
			}
		}

		// Apply new value to variable(s)
		if (currentState.valid) {
			for (let i = 0, l = this.nbSelection; i < l; i++) {
				Game.current.variables[this.selection + i] = Mathf.OPERATORS_NUMBERS[this.operation](
					Game.current.variables[this.selection + i],
					currentState.value
				);
			}
			return 1;
		}
		return 0;
	}
}

export { ChangeVariables };
