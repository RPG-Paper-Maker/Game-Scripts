/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Scene } from '..';
import { Inputs } from '../Common';
import { MapObject } from '../Core';
import { Base } from './Base';

/** @class
 *  An event command for reseting the camera.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ResetCamera extends Base {
	constructor(command: any[]) {
		super();
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		const initialH = Scene.Map.current.camera.horizontalAngle;
		Scene.Map.current.camera.initialize();
		Scene.Map.current.camera.update();
		Inputs.updateLockedKeysAngles(initialH);
		return 1;
	}
}

export { ResetCamera };
