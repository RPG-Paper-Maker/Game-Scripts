/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Mathf, Platform } from '../Common';
import { Game, MapObject, Position } from '../Core';
import { Model, Scene } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for changing a property value.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ChangeProperty extends Base {
	public mapID: Model.DynamicValue;
	public objectID: Model.DynamicValue;
	public propertyID: Model.DynamicValue;
	public operationKind: number;
	public newValue: Model.DynamicValue;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.propertyID = Model.DynamicValue.createValueCommand(command, iterator);
		this.operationKind = command[iterator.i++];
		this.newValue = Model.DynamicValue.createValueCommand(command, iterator);
		this.mapID =
			iterator.i < command.length
				? Model.DynamicValue.createValueCommand(command, iterator)
				: Model.DynamicValue.createNumber(-1);
		this.objectID =
			iterator.i < command.length
				? Model.DynamicValue.createValueCommand(command, iterator)
				: Model.DynamicValue.createNumber(-1);
	}

	initialize(): Record<string, any> {
		return {
			map: null,
			object: null,
			error: false,
			mapID: this.mapID.getValue(),
			objectID: this.objectID.getValue(),
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
					void (async () => {
						await currentState.map.readMapProperties(true);
						currentState.map.initializePortionsObjects();
					})();
				}
			}
			if (currentState.map.mapProperties?.allObjects && currentState.map.portionsObjectsUpdated) {
				if (currentState.map === Scene.Map.current) {
					MapObject.search(currentState.objectID, (result) => {
						if (result) {
							currentState.object = result.object;
						} else {
							const objectID = currentState.objectID === -1 ? object.system.id : currentState.objectID;
							Platform.showErrorMessage(
								`Change property command: the object ID ${objectID} selected doesn't exist in the map ${currentState.map.name} or was removed.`,
							);
							currentState.error = true;
						}
					}, object);
				} else {
					currentState.object = {};
				}
				currentState.waitingObject = true;
			}
		}
		if (currentState.error) return 1;
		if (currentState.waitingObject && currentState.object !== null) {
			const propertyID = this.propertyID.getValue() as number;
			const targetObject = currentState.object as MapObject;
			let props: number[];
			if (targetObject.isHero) {
				props = Game.current.heroProperties;
			} else if (targetObject.isStartup) {
				props = Game.current.startupProperties[Scene.Map.current.id] ?? [];
				Game.current.startupProperties[Scene.Map.current.id] = props;
			} else {
				const objectID = currentState.objectID === -1 ? object.system.id : currentState.objectID;
				const position = currentState.map.mapProperties.allObjects.get(objectID);
				if (!position) {
					Platform.showErrorMessage(
						`Change property command: the object ID ${objectID} selected doesn't exist in the map ${currentState.map.name}`,
					);
					return 1;
				}
				const portion = position.getGlobalPortion();
				const portionData = Game.current.getPortionData(currentState.map.id, portion);
				let indexProp = portionData.pi.indexOf(objectID);
				if (indexProp === -1) {
					indexProp = portionData.pi.length;
					portionData.pi.push(objectID);
					portionData.p.push([]);
				}
				props = portionData.p[indexProp];
			}
			const newValue = Mathf.OPERATORS_NUMBERS[this.operationKind](
				currentState.map === Scene.Map.current ? targetObject.properties[propertyID] : (props[propertyID - 1] ?? 0),
				this.newValue.getValue() as number,
			);
			if (currentState.map === Scene.Map.current) {
				targetObject.properties[propertyID] = newValue;
			}
			props[propertyID - 1] = newValue;
			return 1;
		}
		return 0;
	}
}

export { ChangeProperty };
