/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Platform } from '../Common';
import { Game, MapObject, StructSearchResult } from '../Core';
import { EventCommand, Model, Scene } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for changing an object state.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ChangeState extends Base {
	public mapID: Model.DynamicValue;
	public objectID: Model.DynamicValue;
	public idState: Model.DynamicValue;
	public operationKind: number;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.mapID = Model.DynamicValue.createValueCommand(command, iterator);
		this.objectID = Model.DynamicValue.createValueCommand(command, iterator);
		this.idState = Model.DynamicValue.createValueCommand(command, iterator);
		this.operationKind = command[iterator.i++];
	}

	/**
	 *  Add a state to an object.
	 *  @static
	 *  @param {Record<string, any>} - portionData Data inside a portion
	 *  @param {number} index - Index in the portion datas
	 *  @param {number} state - ID of the state
	 */
	static addState(portionData: Record<string, any>, index: number, state: number) {
		const states = portionData.s[index];
		if (states.indexOf(state) === -1) {
			states.push(state);
		}
		EventCommand.ChangeState.removeFromData(portionData, index, states);
	}

	/**
	 *  Remove a state from an object.
	 *  @static
	 *  @param {Record<string, any>} - portionData Data inside a portion
	 *  @param {number} index - Index in the portion datas
	 *  @param {number} state - ID of the state
	 */
	static removeState(portionData: Record<string, any>, index: number, state: number) {
		const states = portionData.s[index];
		const indexState = states.indexOf(state);
		if (states.indexOf(state) !== -1) {
			states.splice(indexState, 1);
		}
		EventCommand.ChangeState.removeFromData(portionData, index, states);
	}

	/**
	 *  Remove all the states from an object.
	 *  @static
	 *  @param {Record<string, any>} - portionData Data inside a portion
	 *  @param {number} index - Index in the portion datas
	 */
	static removeAll(portionData: Record<string, any>, index: number) {
		portionData.s[index] = [];
	}

	/**
	 *  Remove states from datas.
	 *  @static
	 *  @param {Record<string, any>} - portionData Data inside a portion
	 *  @param {number} index - Index in the portion datas
	 *  @param {number[]} states
	 */
	static removeFromData(portionData: Record<string, any>, index: number, states: number[]) {
		if (states.length === 1 && states[0] === 1) {
			portionData.si.splice(index, 1);
			portionData.s.splice(index, 1);
		}
	}

	/**
	 *  Add state in ID's list.
	 *  @static
	 *  @param {number[]} states - The states IDs
	 *  @param {number} state - ID of the state
	 */
	static addStateSpecial(states: number[], state: number) {
		if (states.indexOf(state) === -1) {
			states.push(state);
		}
	}

	/**
	 *  Remove state in ID's list.
	 *  @static
	 *  @param {number[]} states - The states IDs
	 *  @param {number} state - ID of the state
	 */
	static removeStateSpecial(states: number[], state: number) {
		const indexState = states.indexOf(state);
		if (indexState !== -1) {
			states.splice(indexState, 1);
		}
	}

	/**
	 *  Initialize the current state.
	 *  @returns {Record<string, any>} The current state
	 */
	initialize(): Record<string, any> {
		return {
			map: null,
			object: null,
			mapID: this.mapID.getValue() as number,
			objectID: this.objectID.getValue() as number,
		};
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		if (!currentState.waitingObject) {
			if (currentState.map === null) {
				if (
					currentState.mapID === -1 ||
					currentState.mapID === Scene.Map.current.id ||
					currentState.objectID === -1
				) {
					currentState.map = Scene.Map.current;
				} else {
					currentState.map = new Scene.Map(currentState.mapID, false, true);
					(async () => {
						await currentState.map.readMapProperties(true);
						currentState.map.initializePortionsObjects();
					})();
				}
			}
			if (currentState.map.mapProperties.allObjects && currentState.map.portionsObjectsUpdated) {
				if (currentState.map === Scene.Map.current) {
					MapObject.search(
						currentState.objectID,
						(result: StructSearchResult) => {
							currentState.object = result.object;
						},
						object,
					);
				} else {
					currentState.object = {};
				}
				currentState.waitingObject = true;
			}
		}
		if (currentState.waitingObject && currentState.object !== null) {
			if (currentState.object.isHero || currentState.object.isStartup) {
				let states = currentState.object.isHero
					? Game.current.heroStates
					: Game.current.startupStates[Scene.Map.current.id];
				switch (this.operationKind) {
					case 0: // Replacing
						if (currentState.object.isHero) {
							Game.current.heroStates = [];
						} else {
							Game.current.startupStates[Scene.Map.current.id] = [];
						}
						states = currentState.object.isHero
							? Game.current.heroStates
							: Game.current.startupStates[Scene.Map.current.id];
						EventCommand.ChangeState.addStateSpecial(states, this.idState.getValue() as number);
						break;
					case 1: // Adding
						EventCommand.ChangeState.addStateSpecial(states, this.idState.getValue() as number);
						break;
					case 2: // Deleting
						EventCommand.ChangeState.removeStateSpecial(states, this.idState.getValue() as number);
						break;
				}
			} else {
				const objectID = currentState.objectID === -1 ? object.system.id : currentState.objectID;
				const position = currentState.map.mapProperties.allObjects.get(objectID);
				if (!position) {
					Platform.showErrorMessage(
						'Change state command: the object ID ' +
							objectID +
							" selected doesn't exist in the map " +
							currentState.map.name,
					);
				}
				const portion = position.getGlobalPortion();
				const portionData = Game.current.getPortionData(currentState.map.id, portion);
				let indexState = portionData.si.indexOf(objectID);
				if (indexState === -1) {
					indexState = portionData.si.length;
					portionData.si.push(objectID);
					portionData.s.push([1]);
				}
				switch (this.operationKind) {
					case 0: // Replacing
						EventCommand.ChangeState.removeAll(portionData, indexState);
						EventCommand.ChangeState.addState(portionData, indexState, this.idState.getValue() as number);
						break;
					case 1: // Adding
						EventCommand.ChangeState.addState(portionData, indexState, this.idState.getValue() as number);
						break;
					case 2: // Deleting
						EventCommand.ChangeState.removeState(
							portionData,
							indexState,
							this.idState.getValue() as number,
						);
						break;
				}
			}
			if (currentState.map === Scene.Map.current) {
				currentState.object.changeState();
			}
			return 1;
		}
		return 0;
	}
}

export { ChangeState };
