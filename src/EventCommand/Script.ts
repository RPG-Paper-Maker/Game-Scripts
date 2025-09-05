/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '..';
import { Interpreter, Utils } from '../Common';
import { MapObject } from '../Core';
import { Base } from './Base';

/** @class
 *  An event command for script.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class Script extends Base {
	public isDynamic: boolean;
	public script: Model.DynamicValue;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.isDynamic = Utils.numberToBool(command[iterator.i++]);
		this.script = this.isDynamic
			? Model.DynamicValue.createValueCommand(command, iterator)
			: Model.DynamicValue.createMessage(String(command[iterator.i]));
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		const res = Interpreter.evaluate(this.script.getValue(), { thisObject: object, addReturn: false }) as number;
		return res === undefined ? 1 : res;
	}
}

export { Script };
