/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { DYNAMIC_VALUE_KIND, Utils } from '../Common';
import { Game, MapObject, Portion, StructSearchResult } from '../Core';
import { Model, Scene } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for removing a specific object from map.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class RemoveObjectFromMap extends Base {
	public objectID: Model.DynamicValue;
	public isPermanent: boolean;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.objectID = Model.DynamicValue.createValueCommand(command, iterator);
		this.isPermanent = Utils.numberToBool(command[iterator.i++] ?? 0);
	}

	/**
	 *  Initialize the current state.
	 *  @returns {Record<string, any>} The current state
	 */
	initialize(): Record<string, any> {
		return {
			started: false,
			finished: false,
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
		const objectID =
			this.objectID.kind === DYNAMIC_VALUE_KIND.PROPERTY && this.objectID.value === -1
				? -1
				: (this.objectID.getValue() as number);
		if (!currentState.started) {
			currentState.started = true;
			MapObject.search(
				objectID,
				(result: StructSearchResult) => {
					if (!result) {
						currentState.finished = true;
						return;
					}
					if (!result.object.removed) {
						if (result.datas !== null) {
							const originDatas = result.datas;
							const movedIndex = originDatas.m.indexOf(result.object);
							if (movedIndex !== -1) {
								originDatas.m.splice(movedIndex, 1);
							}
							const originIndex = originDatas.min.indexOf(result.object);
							if (originIndex !== -1) {
								originDatas.min.splice(originIndex, 1);
							} else {
								const destinationDatas = Game.current.getPortionData(
									Scene.Map.current.id,
									Portion.createFromVector3(result.object.position),
								);
								const destinationIndex = destinationDatas.mout?.indexOf(result.object) ?? -1;
								if (destinationIndex !== -1) {
									destinationDatas.mout.splice(destinationIndex, 1);
								}
							}
							if (result.list) {
								const listIndex = result.list.indexOf(result.object);
								if (listIndex !== -1) {
									result.list.splice(listIndex, 1);
								}
							}
							if (originDatas.r.indexOf(result.id) === -1) {
								originDatas.r.push(result.id);
							}
							if (this.isPermanent && originDatas.pr.indexOf(result.id) === -1) {
								originDatas.pr.push(result.id);
							}
						}
						const position = result.object.position.clone();
						result.object.removed = true;
						result.object.removeFromScene();
						Scene.Map.current.landObjectsSpatialHashDirty = true;
						void MapObject.refreshAutotilesAround(position);
					}
					currentState.finished = true;
				},
				object,
			);
		}
		return currentState.finished ? 1 : 0;
	}
}

export { RemoveObjectFromMap };
