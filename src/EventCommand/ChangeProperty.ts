/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Mathf } from '../Common';
import { Game, MapObject } from '../Core';
import { Model, Scene } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for changing a property value.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ChangeProperty extends Base {
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
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		const propertyID = this.propertyID.getValue() as number;
		const newValue = Mathf.OPERATORS_NUMBERS[this.operationKind](
			object.properties[propertyID],
			this.newValue.getValue() as number
		);
		object.properties[propertyID] = newValue;
		let props: number[];
		if (object.isHero) {
			props = Game.current.heroProperties;
		} else if (object.isStartup) {
			props = Game.current.startupProperties[Scene.Map.current.id];
			if (props === undefined) {
				props = [];
				Game.current.startupProperties[Scene.Map.current.id] = props;
			}
		} else {
			const portion = Scene.Map.current.mapProperties.allObjects.get(object.system.id).getGlobalPortion();
			const portionData = Game.current.getPortionData(Scene.Map.current.id, portion);
			const indexProp = portionData.pi.indexOf(object.system.id);
			if (indexProp === -1) {
				props = [];
				portionData.pi.push(object.system.id);
				portionData.p.push(props);
			} else {
				props = portionData.p[indexProp];
			}
		}
		props[propertyID - 1] = newValue;
		return 1;
	}
}

export { ChangeProperty };
