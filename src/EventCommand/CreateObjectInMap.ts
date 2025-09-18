/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Data, Model, Scene } from '..';
import { Utils } from '../Common';
import { Game, MapObject, Position, StructSearchResult } from '../Core';
import { Base } from './Base';

/** @class
 *  An event command for creating an object in map.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class CreateObjectInMap extends Base {
	public modelID: Model.DynamicValue;
	public objectIDPosition: Model.DynamicValue;
	public mapID: Model.DynamicValue;
	public x: Model.DynamicValue;
	public y: Model.DynamicValue;
	public yPlus: Model.DynamicValue;
	public z: Model.DynamicValue;
	public isStockID: boolean;
	public stockID: Model.DynamicValue;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.modelID = Model.DynamicValue.createValueCommand(command, iterator);
		this.objectIDPosition = null;
		this.mapID = null;
		switch (command[iterator.i++]) {
			case 0:
				this.mapID = Model.DynamicValue.createNumber(command[iterator.i++]);
				this.x = Model.DynamicValue.createNumber(command[iterator.i++]);
				this.y = Model.DynamicValue.createNumber(command[iterator.i++]);
				this.yPlus = Model.DynamicValue.createNumber(command[iterator.i++]);
				this.z = Model.DynamicValue.createNumber(command[iterator.i++]);
				break;
			case 1:
				this.mapID = Model.DynamicValue.createValueCommand(command, iterator);
				this.x = Model.DynamicValue.createValueCommand(command, iterator);
				this.y = Model.DynamicValue.createValueCommand(command, iterator);
				this.yPlus = Model.DynamicValue.createValueCommand(command, iterator);
				this.z = Model.DynamicValue.createValueCommand(command, iterator);
				break;
			case 2:
				this.objectIDPosition = Model.DynamicValue.createValueCommand(command, iterator);
				break;
		}
		this.isStockID = Utils.numberToBool(command[iterator.i++]);
		if (this.isStockID) {
			this.stockID = Model.DynamicValue.createValueCommand(command, iterator);
		}
	}

	/**
	 *  Initialize the current state.
	 *  @returns {Record<string, any>} The current state
	 */
	initialize(): Record<string, any> {
		return {
			position: null,
			waitingPosition: false,
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
		// Do nothing if not in the current map
		if (this.objectIDPosition === null && (this.mapID.getValue() as number) !== Scene.Map.current.id) {
			return 1;
		}
		if (!currentState.waitingPosition) {
			// Set object's position
			if (this.objectIDPosition === null) {
				currentState.position = new Position(
					this.x.getValue() as number,
					this.y.getValue() as number,
					this.z.getValue() as number,
					((this.yPlus.getValue() as number) * 100) / Data.Systems.SQUARE_SIZE
				).toVector3();
			} else {
				MapObject.search(
					this.objectIDPosition.getValue() as number,
					(result: StructSearchResult) => {
						currentState.position = result.object.position.clone();
					},
					object
				);
			}
			currentState.waitingPosition = true;
		}
		if (currentState.position !== null) {
			const id = ++Scene.Map.current.mapProperties.maxObjectsID;
			const position = Position.createFromVector3(currentState.position);
			const globalPortion = position.getGlobalPortion();
			Scene.Map.current.mapProperties.allObjects.set(id, position);
			const newObject = new MapObject(
				Model.MapObject.createFromModelID(this.modelID.getValue() as number, id),
				currentState.position
			);
			if (this.isStockID) {
				Game.current.variables.set(this.stockID.getValue(true) as number, id);
			}
			Game.current.getPortionData(Scene.Map.current.id, globalPortion).m.push(newObject);
			Game.current.getPortionData(Scene.Map.current.id, globalPortion).min.push(newObject);
			newObject.changeState();
		}
		return currentState.position === null ? 0 : 1;
	}
}

export { CreateObjectInMap };
