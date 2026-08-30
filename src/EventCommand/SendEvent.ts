/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { DYNAMIC_VALUE_KIND, Platform, Utils } from '../Common';
import { Game, MapObject, ReactionInterpreter } from '../Core';
import { Data, Manager, Model } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for sending an event.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class SendEvent extends Base {
	public targetKind: number;
	public senderNoReceiver: boolean;
	public onlyTheClosest: boolean;
	public targetID: Model.DynamicValue;
	public isSystem: boolean;
	public eventID: number;
	public parameters: Model.DynamicValue[];
	public isStockLastObjectID: boolean;
	public stockLastObjectIDVariable: Model.DynamicValue;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		// Target
		const l = command.length;
		this.targetKind = command[iterator.i++];
		this.senderNoReceiver = false;
		switch (this.targetKind) {
			case 1:
				this.targetID = Model.DynamicValue.createValueCommand(command, iterator);
				this.senderNoReceiver = Utils.numberToBool(command[iterator.i++]);
				this.onlyTheClosest = Utils.numberToBool(command[iterator.i++]);
				break;
			case 2:
				this.targetID = Model.DynamicValue.createValueCommand(command, iterator);
				break;
		}
		this.isSystem = !Utils.numberToBool(command[iterator.i++]);
		this.eventID = command[iterator.i++];

		// Parameters
		const parameters = (
			this.isSystem
				? Data.CommonEvents.getEventSystem(this.eventID)
				: Data.CommonEvents.getEventUser(this.eventID)
		).parameters;
		this.parameters = [];
		let parameter: Model.DynamicValue, paramID: number, k: DYNAMIC_VALUE_KIND;
		for (let parameterIndex = 0; parameterIndex < parameters.size && iterator.i < l; parameterIndex++) {
			paramID = command[iterator.i++];
			k = command[iterator.i++];
			if (k > DYNAMIC_VALUE_KIND.UNKNOWN && k <= DYNAMIC_VALUE_KIND.DEFAULT) {
				// If default value
				if (k === DYNAMIC_VALUE_KIND.DEFAULT) {
					const defaultParameter = parameters.get(paramID);
					if (!defaultParameter) {
						Platform.showErrorMessage(
							`Send event command: parameter ID ${paramID} does not exist in ${this.isSystem ? 'system' : 'user'} event ID ${this.eventID}. The parameter was ignored. Please review this command.`,
						);
						continue;
					}
					parameter = defaultParameter.value;
				} else {
					parameter = Model.DynamicValue.create(k, null);
				}
			} else {
				parameter = Model.DynamicValue.create(k, command[iterator.i++]);
			}
			this.parameters[paramID] = parameter;
		}
		this.isStockLastObjectID = iterator.i < l && Utils.numberToBool(command[iterator.i++]);
		if (this.isStockLastObjectID) {
			this.stockLastObjectIDVariable = Model.DynamicValue.createValueCommand(command, iterator);
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
		const lastObjectID = Manager.Events.sendEvent(
			object,
			this.targetKind,
			this.targetID ? (this.targetID.getValue() as number) : -1,
			this.isSystem,
			this.eventID,
			Utils.arrayToMap(Model.DynamicValue.mapWithParametersProperties(this.parameters), true),
			this.senderNoReceiver,
			this.onlyTheClosest,
		);
		if (this.isStockLastObjectID) {
			const storedObjectID = lastObjectID ?? -1;
			if (this.stockLastObjectIDVariable.kind === DYNAMIC_VALUE_KIND.LOCAL_VARIABLE) {
				ReactionInterpreter.currentReaction.localVariables.set(
					this.stockLastObjectIDVariable.value as string,
					storedObjectID,
				);
			} else {
				Game.current.variables.set(this.stockLastObjectIDVariable.getValue(true) as number, storedObjectID);
			}
		}
		return 1;
	}
}

export { SendEvent };
