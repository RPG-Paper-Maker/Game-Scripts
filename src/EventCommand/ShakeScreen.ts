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
import { EventCommand, Manager, Model, Scene } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for shaking screen.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ShakeScreen extends Base {
	public offset: Model.DynamicValue;
	public shakeNumber: Model.DynamicValue;
	public isWaitEnd: boolean;
	public time: Model.DynamicValue;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.offset = Model.DynamicValue.createValueCommand(command, iterator);
		this.shakeNumber = Model.DynamicValue.createValueCommand(command, iterator);
		this.isWaitEnd = Utils.numberToBool(command[iterator.i++]);
		this.time = Model.DynamicValue.createValueCommand(command, iterator);
		this.parallel = !this.isWaitEnd;
	}

	/**
	 *  Update the target offset
	 *  @static
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {number} timeRate - The time rate
	 */
	static updateTargetOffset(currentState: Record<string, any>, timeRate: number) {
		const value = timeRate * currentState.finalDifPos;
		Scene.Map.current.camera.targetOffset.x +=
			value * -Math.sin((Scene.Map.current.camera.horizontalAngle * Math.PI) / 180.0);
		Scene.Map.current.camera.targetOffset.z +=
			value * Math.cos((Scene.Map.current.camera.horizontalAngle * Math.PI) / 180.0);
	}

	/**
	 *  Initialize the current state.
	 *  @returns {Record<string, any>} The current state
	 */
	initialize(): Record<string, any> {
		const t = this.time.getValue() as number;
		const time = t * 1000;
		let shakeNumber = (this.shakeNumber.getValue() as number) * 2;
		const totalShakes = shakeNumber * t;

		// Should be pair to have perfect cycles
		if (totalShakes % 2 !== 0) {
			const floor = Math.floor(totalShakes / 2) * 2;
			const ceil = floor + 2;
			shakeNumber = (floor !== 0 && totalShakes - floor < ceil - totalShakes ? floor : ceil) / t;
		}
		const shakeTime = (1 / (shakeNumber * 2)) * 1000;
		const offset = this.offset.getValue() as number;
		return {
			parallel: this.isWaitEnd,
			offset: offset,
			shakeTime: shakeTime,
			shakeTimeLeft: shakeTime,
			currentOffset: 0,
			beginPosX: Scene.Map.current.camera.targetOffset.x,
			beginPosZ: Scene.Map.current.camera.targetOffset.z,
			finalDifPos: -offset,
			time: time,
			timeLeft: time,
			left: true,
		};
	}

	/**
	 *  Update and check if the event is finished
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		if (currentState.parallel) {
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
				currentState.shakeTimeLeft -= Manager.Stack.elapsedTime;
				if (currentState.shakeTimeLeft <= 0) {
					timeRate = (dif + currentState.shakeTimeLeft) / currentState.shakeTime;
					EventCommand.ShakeScreen.updateTargetOffset(currentState, timeRate);
					dif = -currentState.shakeTimeLeft;
					currentState.shakeTimeLeft = currentState.shakeTime + currentState.shakeTimeLeft;
					currentState.currentOffset++;
					currentState.finalDifPos =
						Math.ceil(currentState.currentOffset / 2) % 2 === 0
							? -currentState.offset
							: currentState.offset;
				}
				timeRate = dif / currentState.shakeTime;
			}
			EventCommand.ShakeScreen.updateTargetOffset(currentState, timeRate);
			if (currentState.timeLeft === 0) {
				Scene.Map.current.camera.targetOffset.x = currentState.beginPosX;
				Scene.Map.current.camera.targetOffset.z = currentState.beginPosZ;
				return 1;
			}
			return 0;
		}
		return 1;
	}
}

export { ShakeScreen };
