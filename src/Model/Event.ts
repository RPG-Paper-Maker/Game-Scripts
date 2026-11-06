/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Data } from '../index';
import { Base } from './Base';
import { Parameter, ParameterJSON, ParameterListJSON } from './Parameter';
import { Reaction, ReactionJSON } from './Reaction';

/**
 * JSON structure describing an event.
 */
export type EventJSON = ParameterListJSON & {
	sys: boolean;
	id: number;
	parameters?: Record<string, ParameterJSON>;
	r: Record<number, ReactionJSON>;
};

/**
 * An event that an object can react to.
 */
export class Event extends Base {
	public isSystem: boolean;
	public idEvent: number;
	public parameters: Map<number, Parameter>;
	public reactions: Map<number, Reaction>;

	constructor(json?: EventJSON) {
		super(json);
	}

	/**
	 * Check if this event is equal to another.
	 */
	isEqual(event: Event): boolean {
		if (this.isSystem !== event.isSystem || this.idEvent !== event.idEvent) {
			return false;
		}
		for (const [id, parameter] of this.parameters.entries()) {
			if (!parameter.isEqual(event.parameters.get(id))) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Create a copy of this event with its own reactions map, for inheritance.
	 */
	cloneForInheritance(): Event {
		const event = new Event();
		event.isSystem = this.isSystem;
		event.idEvent = this.idEvent;
		event.parameters = this.parameters;
		event.reactions = new Map(this.reactions);
		return event;
	}

	/**
	 * Add reactions to the event. Reactions flagged as inherited are skipped
	 * if a reaction already exists for that state.
	 */
	addReactions(reactions: Map<number, Reaction>): void {
		for (const [idState, reaction] of reactions) {
			if (reaction.inherit && this.reactions.has(idState)) {
				continue;
			}
			this.reactions.set(idState, reaction);
		}
	}

	/**
	 * Read the JSON associated to the event.
	 */
	read(json: EventJSON): void {
		this.isSystem = json.sys;
		this.idEvent = json.id;

		// Parameters
		this.parameters = Parameter.readParametersWithDefault(
			json,
			(this.isSystem
				? Data.CommonEvents.getEventSystem(this.idEvent)
				: Data.CommonEvents.getEventUser(this.idEvent)
			).parameters,
		);

		// Reactions
		const jsonReactions = json.r;
		this.reactions = new Map();
		for (const idState in json.r) {
			const reaction = new Reaction(jsonReactions[idState]);
			reaction.event = this;
			this.reactions.set(Number(idState), reaction);
		}
	}
}
