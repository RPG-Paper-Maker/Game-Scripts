/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../Common';
import { MapObject } from '../Core';
import { Model, Scene } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for changing the current map fog.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ChangeFog extends Base {
	public enabled: boolean;
	public intensity: Model.DynamicValue;
	public colorID: Model.DynamicValue;

	constructor(command: any[]) {
		super();

		if (!command) {
			return;
		}
		const iterator = {
			i: 0,
		};
		this.enabled = Utils.numberToBool(command[iterator.i++]);
		this.intensity = Model.DynamicValue.createValueCommand(command, iterator);
		this.colorID = Model.DynamicValue.createValueCommand(command, iterator);
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		const map = Scene.Map.current;
		if (map) {
			map.mapProperties.isFog = this.enabled;
			if (this.enabled) {
				map.mapProperties.fogColorID = this.colorID;
				map.mapProperties.fogIntensity = this.intensity;
			}
			map.mapProperties.updateFog();
		}
		return 1;
	}
}

export { ChangeFog };
