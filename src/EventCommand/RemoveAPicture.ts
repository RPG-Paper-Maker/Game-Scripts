/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { MapObject } from '../Core';
import { Manager, Model } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for removing a picture.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class RemoveAPicture extends Base {
	public index: Model.DynamicValue;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.index = Model.DynamicValue.createValueCommand(command, iterator);
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		const currentIndex = this.index.getValue() as number;
		for (let i = 0, l = Manager.Stack.displayedPictures.length; i < l; i++) {
			if (currentIndex === Manager.Stack.displayedPictures[i][0]) {
				Manager.Stack.displayedPictures.splice(i, 1);
				break;
			}
		}
		Manager.Stack.requestPaintHUD = true;
		return 1;
	}
}

export { RemoveAPicture };
