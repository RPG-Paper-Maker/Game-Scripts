/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../Common';
import { MapObject } from '../Core';
import { Data, Manager, Model, Scene } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for changing screen tone.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ChangeScreenTone extends Base {
	public r: Model.DynamicValue;
	public g: Model.DynamicValue;
	public b: Model.DynamicValue;
	public grey: Model.DynamicValue;
	public subColor: boolean;
	public colorID: Model.DynamicValue;
	public waitEnd: boolean;
	public time: Model.DynamicValue;

	constructor(command: any[]) {
		super();

		if (!command) {
			return;
		}
		const iterator = {
			i: 0,
		};
		this.r = Model.DynamicValue.createValueCommand(command, iterator);
		this.g = Model.DynamicValue.createValueCommand(command, iterator);
		this.b = Model.DynamicValue.createValueCommand(command, iterator);
		this.grey = Model.DynamicValue.createValueCommand(command, iterator);
		if (Utils.numberToBool(command[iterator.i++])) {
			this.subColor = Utils.numberToBool(command[iterator.i++]);
			this.colorID = Model.DynamicValue.createValueCommand(command, iterator);
		}
		this.waitEnd = Utils.numberToBool(command[iterator.i++]);
		this.time = Model.DynamicValue.createValueCommand(command, iterator);
		this.parallel = !this.waitEnd;
	}

	/**
	 *  Initialize the current state.
	 *  @returns {Record<string, any>} The current state
	 */
	initialize(): Record<string, any> {
		const time = (this.time.getValue() as number) * 1000;
		const color = this.colorID ? Data.Systems.getColor(this.colorID.getValue() as number) : null;
		return {
			parallel: this.waitEnd,
			finalDifRed:
				Math.max(Math.min(((this.r.getValue() as number) + (color ? color.red : 0)) / 255, 1), -1) -
				Manager.GL.screenTone.x,
			finalDifGreen:
				Math.max(Math.min(((this.g.getValue() as number) + (color ? color.green : 0)) / 255, 1), -1) -
				Manager.GL.screenTone.y,
			finalDifBlue:
				Math.max(Math.min(((this.b.getValue() as number) + (color ? color.blue : 0)) / 255, 1), -1) -
				Manager.GL.screenTone.z,
			finalDifGrey:
				Math.max(Math.min(1 - (this.grey.getValue() as number) / 100, 1), -1) - Manager.GL.screenTone.w,
			time: time,
			timeLeft: time,
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
		if (currentState.parallel) {
			// Updating the time left
			let timeRate: number, dif: number;
			if (currentState.time === 0) {
				timeRate = 1;
			} else {
				dif = Manager.Stack.elapsedTime;
				currentState.timeLeft -= Manager.Stack.elapsedTime;
				if (currentState.timeLeft < 0) {
					dif += currentState.timeLeft;
					currentState.timeLeft = 0;
				}
				timeRate = dif / currentState.time;
			}

			// Update values
			Manager.GL.screenTone.setX(Manager.GL.screenTone.x + timeRate * currentState.finalDifRed);
			Manager.GL.screenTone.setY(Manager.GL.screenTone.y + timeRate * currentState.finalDifGreen);
			Manager.GL.screenTone.setZ(Manager.GL.screenTone.z + timeRate * currentState.finalDifBlue);
			Manager.GL.screenTone.setW(Manager.GL.screenTone.w + timeRate * currentState.finalDifGrey);
			Manager.GL.updateBackgroundColor(Scene.Map.current.mapProperties.backgroundColor);

			// If time = 0, then this is the end of the command
			if (currentState.timeLeft === 0) {
				return 1;
			}
			return 0;
		}
		return 1;
	}
}

export { ChangeScreenTone };
