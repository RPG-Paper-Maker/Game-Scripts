/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano
*/

import { MapObject } from '../Core';
import { Model } from '../index';
import { Base } from './Base';

enum MODIFY_LIGHT_ACTION {
	ADD,
	DELETE,
	EDIT,
}

const LIGHT_PROPERTIES: (keyof Model.StateLight)[] = [
	'kind',
	'followOrientation',
	'color',
	'groundColor',
	'intensity',
	'intensityOffset',
	'intensityTime',
	'x',
	'y',
	'z',
	'distance',
	'angle',
	'penumbra',
	'targetX',
	'targetY',
	'targetZ',
];

const LEGACY_LIGHT_PROPERTIES = LIGHT_PROPERTIES.filter((property) => property !== 'followOrientation');

class ModifyLight extends Base {
	public objectID: Model.DynamicValue;
	public action: MODIFY_LIGHT_ACTION;
	public lightID: Model.DynamicValue;
	public light: Model.StateLight | null;
	public selectedFields: boolean[];

	constructor(command: any[]) {
		super();
		const iterator = { i: 0 };
		this.objectID = Model.DynamicValue.createValueCommand(command, iterator);
		this.action = command[iterator.i++];
		this.lightID = Model.DynamicValue.createValueCommand(command, iterator);
		this.light = null;
		this.selectedFields = [];
		if (this.action !== MODIFY_LIGHT_ACTION.DELETE) {
			this.light = new Model.StateLight({});
			const properties =
				command.length - iterator.i ===
				LEGACY_LIGHT_PROPERTIES.length * (this.action === MODIFY_LIGHT_ACTION.EDIT ? 3 : 2)
					? LEGACY_LIGHT_PROPERTIES
					: LIGHT_PROPERTIES;
			const hasSelectedFields =
				this.action === MODIFY_LIGHT_ACTION.EDIT && command.length - iterator.i >= properties.length * 3;
			for (const property of properties) {
				this.selectedFields[LIGHT_PROPERTIES.indexOf(property)] = hasSelectedFields ? command[iterator.i++] === 1 : true;
				(this.light[property] as Model.DynamicValue) = Model.DynamicValue.createValueCommand(command, iterator);
			}
		}
	}

	initialize(): Record<string, any> {
		return { started: false, finished: false };
	}

	update(currentState: Record<string, any>, object: MapObject): number {
		if (!currentState.started) {
			currentState.started = true;
			MapObject.search(
				this.objectID.getValue() as number,
				(result) => {
					const target = result?.object as MapObject | undefined;
					if (target?.currentStateInstance) {
						const lightID = this.lightID.getValue() as number;
						const lights = target.currentStateInstance.lights;
						const index = lights.findIndex((light) => Number(light.id) === lightID);
						switch (this.action) {
							case MODIFY_LIGHT_ACTION.ADD:
								if (index === -1 && this.light) {
									const light = this.light.createCopy();
									light.id = lightID;
									lights.push(light);
									target.refreshObjectLights();
								}
								break;
							case MODIFY_LIGHT_ACTION.DELETE:
								if (index !== -1) {
									lights.splice(index, 1);
									target.refreshObjectLights();
								}
								break;
							case MODIFY_LIGHT_ACTION.EDIT:
								if (index !== -1 && this.light) {
									let hasUpdated = false;
									for (let i = 0; i < LIGHT_PROPERTIES.length; i++) {
										if (this.selectedFields[i]) {
											const property = LIGHT_PROPERTIES[i];
											(lights[index][property] as Model.DynamicValue) = (
												this.light[property] as Model.DynamicValue
											).createCopy();
											hasUpdated = true;
										}
									}
									if (hasUpdated) {
										target.refreshObjectLights();
									}
								}
								break;
						}
					}
					currentState.finished = true;
				},
				object,
			);
		}
		return currentState.finished ? 1 : 0;
	}
}

export { ModifyLight };
