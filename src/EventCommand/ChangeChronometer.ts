/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../Common';
import { Chrono, Game, MapObject } from '../Core';
import { Manager, System } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for changing chronometer.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class ChangeChronometer extends Base {
	public chronometerID: System.DynamicValue;
	public operation: number;
	public time: System.DynamicValue;
	public diplayOnScreen: boolean;
	public stockValue: boolean;
	public stockID: System.DynamicValue;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.chronometerID = System.DynamicValue.createValueCommand(command, iterator);
		this.operation = command[iterator.i++];
		if (this.operation === 0) {
			this.time = System.DynamicValue.createValueCommand(command, iterator);
			this.diplayOnScreen = Utils.numberToBool(command[iterator.i++]);
		} else {
			this.stockValue = Utils.numberToBool(command[iterator.i++]);
			if (this.stockValue) {
				this.stockID = System.DynamicValue.createValueCommand(command, iterator);
			}
		}
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		const chronometerID = this.chronometerID.getValue(this.operation === 0);
		const index = Utils.indexOfProp(Game.current.chronometers as any, 'id', chronometerID);
		const chrono = index === -1 ? null : Game.current.chronometers[index];
		switch (this.operation) {
			case 0: // Start
				const time = this.time.getValue() * 1000;
				if (chrono === null) {
					Game.current.chronometers.push(
						new Chrono(time, Game.current.getNewChronoID(), true, this.diplayOnScreen)
					);
				}
				Manager.Stack.requestPaintHUD = true;
				break;
			case 1: // Pause
				if (chrono !== null) {
					chrono.pause();
				}
				break;
			case 2: // Continue
				if (chrono !== null) {
					chrono.continue();
					Manager.Stack.requestPaintHUD = true;
				}
				break;
			case 3: // Stop
				if (chrono !== null) {
					Game.current.chronometers.splice(index, 1);
					Manager.Stack.requestPaintHUD = true;
				}
				break;
		}
		// Stock value
		if (this.operation !== 0 && this.stockValue && chrono !== null) {
			Game.current.variables[this.stockID.getValue(true)] = chrono.getSeconds();
		}
		return 1;
	}
}

export { ChangeChronometer };
