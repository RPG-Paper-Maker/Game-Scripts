/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas, Model } from '../index';
import { Base } from './Base';

/** @class
 *  An event that an object can react on.
 *  @extends Model.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  object event
 */
class Event extends Base {
	public isSystem: boolean;
	public idEvent: number;
	public parameters: Model.Parameter[];
	public reactions: Record<number, Model.Reaction>;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Read the JSON associated to the object event
	 *  @param {Record<string, any>} - json Json object describing the object event
	 */
	read(json: Record<string, any>) {
		this.isSystem = json.sys;
		this.idEvent = json.id;

		// Parameters
		this.parameters = Model.Parameter.readParametersWithDefault(
			json,
			(this.isSystem
				? Datas.CommonEvents.getEventSystem(this.idEvent)
				: Datas.CommonEvents.getEventUser(this.idEvent)
			).parameters
		);

		// Reactions
		const jsonReactions = json.r;
		this.reactions = {};
		for (const idState in jsonReactions) {
			const reaction = new Model.Reaction(jsonReactions[idState]);
			reaction.event = this;
			this.reactions[idState] = reaction;
		}
	}

	/**
	 *  Check if this event is equal to another.
	 *  @param {System.Event} event - The event to compare
	 *  @returns {boolean}
	 */
	isEqual(event: Model.Event): boolean {
		if (this.isSystem !== event.isSystem || this.idEvent !== event.idEvent) {
			return false;
		}
		for (let i = 1, l = this.parameters.length; i < l; i++) {
			if (!this.parameters[i].isEqual(event.parameters[i])) {
				return false;
			}
		}
		return true;
	}

	/**
	 *  Add reactions to the event.
	 *  @param {Record<number, Model.Reaction>} - reactions The reactions to add
	 */
	addReactions(reactions: Record<number, Model.Reaction>) {
		for (const idState in reactions) {
			this.reactions[idState] = reactions[idState];
		}
	}
}

export { Event };
