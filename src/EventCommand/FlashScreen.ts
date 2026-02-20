/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Platform, ScreenResolution, Utils } from '../Common';
import { MapObject } from '../Core';
import { Data, Manager, Model } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for flashing screen.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class FlashScreen extends Base {
	public colorID: Model.DynamicValue;
	public isWaitEnd: boolean;
	public time: Model.DynamicValue;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.colorID = Model.DynamicValue.createValueCommand(command, iterator);
		this.isWaitEnd = Utils.numberToBool(command[iterator.i++]);
		this.time = Model.DynamicValue.createValueCommand(command, iterator);
		this.parallel = !this.isWaitEnd;
	}

	/**
	 *  Initialize the current state.
	 *  @returns {Record<string, any>} The current state
	 */
	initialize(): Record<string, any> {
		const time = (this.time.getValue() as number) * 1000;
		const color = Data.Systems.getColor(this.colorID.getValue() as number);
		return {
			parallel: this.isWaitEnd,
			time: time,
			timeLeft: time,
			color: color.getHex(),
			finalDifA: -color.alpha,
			a: color.alpha,
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
			currentState.a = currentState.a + timeRate * currentState.finalDifA;
			Manager.Stack.requestPaintHUD = true;
			return currentState.timeLeft === 0 ? 1 : 0;
		}
		return 1;
	}

	/**
	 *  Draw the HUD
	 *  @param {Record<string, any>} - currentState The current state of the event
	 */
	drawHUD(currentState: Record<string, any>) {
		Platform.ctx.fillStyle = currentState.color;
		Platform.ctx.globalAlpha = currentState.a;
		Platform.ctx.fillRect(0, 0, ScreenResolution.CANVAS_WIDTH, ScreenResolution.CANVAS_HEIGHT);
		Platform.ctx.globalAlpha = 1.0;
	}
}

export { FlashScreen };
