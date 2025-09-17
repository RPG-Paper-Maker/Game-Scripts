/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../Common';
import { Data } from '../index';
import { Base } from './Base';
import { DynamicValue } from './DynamicValue';
import { Event, EventJSON } from './Event';
import { Property, PropertyJSON } from './Property';
import { Reaction } from './Reaction';
import { State, StateJSON } from './State';

/**
 * JSON structure describing a map object.
 */
export type MapObjectJSON = {
	id?: number;
	name?: string;
	ooepf?: boolean;
	canBeTriggeredAnotherObject?: boolean;
	hId?: number;
	states?: StateJSON[];
	p?: PropertyJSON[];
	events?: EventJSON[];
};

/**
 * Represents an object on the map.
 */
export class MapObject extends Base {
	public id: number;
	public name: string;
	public isEventFrame: boolean;
	public canBeTriggeredAnotherObject: boolean;
	public states: State[];
	public properties: Property[];
	public events: Map<number, Event[]>;
	public timeEvents: Event[];

	constructor(json?: MapObjectJSON) {
		super(json);
	}

	/**
	 * Creates a system map object from a model ID.
	 * @param modelID - Model ID to inherit from.
	 * @param id - Unique ID to assign to the created object.
	 */
	static createFromModelID(modelID: number, id: number): MapObject {
		const mapObject = new MapObject();
		mapObject.id = id;
		mapObject.name = '';
		mapObject.addDefaultValues();
		mapObject.addInheritanceModel(modelID);
		mapObject.timeEvents = mapObject.getTimeEvents();
		return mapObject;
	}

	/**
	 * Get all the "time" (model) events for this object.
	 */
	getTimeEvents(): Event[] {
		const completeList = this.events.get(1);
		const list = [];
		if (completeList) {
			for (const event of completeList) {
				if (event.isSystem) {
					list.push(event);
				}
			}
		}
		return list;
	}

	/**
	 * Get the reactions corresponding to a given event and parameters.
	 * @param isSystem - Whether the event is a system event.
	 * @param idEvent - Event ID to search for.
	 * @param state - The state ID for which to retrieve reactions.
	 * @param parameters - Map of parameter id → {@link DynamicValue}.
	 * @returns Array of matching {@link Model.Reaction} objects.
	 */
	getReactions(isSystem: boolean, idEvent: number, state: number, parameters: Map<number, DynamicValue>): Reaction[] {
		const events = this.events.get(idEvent);
		if (!events) {
			return [];
		}
		const reactions: Reaction[] = [];
		for (const event of events) {
			if (event.isSystem !== isSystem) {
				continue;
			}
			const allMatch = Array.from(parameters.entries()).every(([id, value]) => {
				const param = event.parameters.get(id);
				return !param || param.value.isEqual(value);
			});
			if (!allMatch) {
				continue;
			}
			const reaction = event.reactions.get(state);
			if (reaction) {
				reactions.push(reaction);
			}
		}
		return reactions;
	}

	/**
	 * Initialize collections with default values.
	 */
	addDefaultValues(): void {
		this.states = [];
		this.properties = [];
		this.events = new Map();
	}

	/**
	 * Inherit values from a given model ID.
	 * @param modelID - The ID of the model to inherit from. If -1, nothing is inherited.
	 */
	addInheritanceModel(modelID: number): void {
		if (modelID === -1) {
			return;
		}
		const inheritedObject = Data.CommonEvents.getCommonObject(modelID);

		// Only one event per frame inheritance is a priority
		this.isEventFrame = inheritedObject.isEventFrame;
		this.canBeTriggeredAnotherObject = inheritedObject.canBeTriggeredAnotherObject;

		// States & properties
		this.states.push(...Utils.valueOrDefault(inheritedObject.states, []));
		this.properties.push(...Utils.valueOrDefault(inheritedObject.properties, []));

		// Events (clone arrays to avoid mutating the inherited object)
		this.events = new Map();
		for (const [idEvent, eventsList] of inheritedObject.events.entries()) {
			this.events.set(Number(idEvent), [...eventsList]);
		}
	}

	/**
	 * Reads and initializes the object from its JSON representation.
	 */
	read(json: MapObjectJSON): void {
		this.id = json.id;
		this.name = json.name;
		this.isEventFrame = json.ooepf;
		this.canBeTriggeredAnotherObject = Utils.valueOrDefault(json.canBeTriggeredAnotherObject, true);
		this.addDefaultValues();
		this.addInheritanceModel(json.hId);

		// States
		for (const stateJson of Utils.valueOrDefault(json.states, [])) {
			const state = new State(stateJson);
			const index = this.states.findIndex((s) => s.id === state.id);
			if (index === -1) {
				this.states.push(state);
			} else {
				this.states[index] = state;
			}
		}

		// Properties
		for (const propertyJson of Utils.valueOrDefault(json.p, [])) {
			const property = new Property(propertyJson);
			const index = this.properties.findIndex((p) => p.id === property.id);
			if (index === -1) {
				this.properties.push(property);
			} else {
				this.properties[index] = property;
			}
		}

		// Events
		for (const eventJson of Utils.valueOrDefault(json.events, [])) {
			const event = new Event(eventJson);
			let list = this.events.get(event.idEvent);
			if (!list) {
				list = [];
				this.events.set(event.idEvent, list);
			}
			const existing = list.find((e) => e.isEqual(event));
			if (existing) {
				existing.addReactions(event.reactions);
			} else {
				list.push(event);
			}
		}
		this.timeEvents = this.getTimeEvents();
	}
}
