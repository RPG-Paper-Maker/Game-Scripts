/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../Common';
import { Datas, Model } from '../index';
import { Base } from './Base';

/** @class
 *  An object in the map.
 *  @extends Model.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  object
 */
class MapObject extends Base {
	public id: number;
	public name: string;
	public isEventFrame: boolean;
	public canBeTriggeredAnotherObject: boolean;
	public states: Model.State[];
	public properties: Model.Property[];
	public events: Record<number, Model.Event[]>;
	public timeEvents: Model.Event[];

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Create a system map object from a model ID.
	 *  @static
	 *  @param {Record<string, any>} modelID
	 *  @param {Record<string, any>} id
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
	 *  Read the JSON associated to the object
	 *  @param {Record<string, any>} - json Json object describing the object
	 */
	read(json: Record<string, any>) {
		this.id = json.id;
		this.name = json.name;
		this.isEventFrame = json.ooepf;
		this.canBeTriggeredAnotherObject = Utils.valueOrDefault(json.canBeTriggeredAnotherObject, true);
		this.addDefaultValues();
		this.addInheritanceModel(json.hId);

		// States
		let jsonList = Utils.valueOrDefault(json.states, []);
		let jsonElement: Record<string, any>, id: number, j: number, m: number, i: number, l: number;
		for (i = 0, l = jsonList.length; i < l; i++) {
			jsonElement = jsonList[i];
			id = jsonElement.id;
			for (j = 0, m = this.states.length; j < m; j++) {
				if (this.states[j].id === id) {
					break;
				}
			}
			this.states[j] = new Model.State(jsonElement);
		}

		// Properties
		jsonList = Utils.valueOrDefault(json.p, []);
		let property: Model.Property;
		for (i = 0, l = jsonList.length; i < l; i++) {
			jsonElement = jsonList[i];
			property = new Model.Property(jsonElement);
			id = property.id;
			for (j = 0, m = this.properties.length; j < m; j++) {
				if (this.properties[j].id === id) {
					break;
				}
			}
			this.properties[j] = property;
		}

		// Events
		jsonList = Utils.valueOrDefault(json.events, []);
		let event: Model.Event, list: Model.Event[];
		for (i = 0, l = jsonList.length; i < l; i++) {
			jsonElement = jsonList[i];
			event = new Model.Event(jsonElement);
			if (this.events.hasOwnProperty(event.idEvent)) {
				list = this.events[event.idEvent];
				for (j = 0, m = list.length; j < m; j++) {
					if (list[j].isEqual(event)) {
						break;
					}
				}
				if (j < list.length) {
					list[j].addReactions(event.reactions);
				} else {
					list.push(event);
				}
			} else {
				this.events[event.idEvent] = [event];
			}
		}
		this.timeEvents = this.getTimeEvents();
	}

	/**
	 *  Add default values.
	 */
	addDefaultValues() {
		this.states = [];
		this.properties = [];
		this.events = {};
	}

	/**
	 *  Add inheritance values according to a model ID.
	 *  @param {number} modelID
	 */
	addInheritanceModel(modelID: number) {
		if (modelID !== -1) {
			const inheritedObject = Datas.CommonEvents.getCommonObject(modelID);

			// Only one event per frame inheritance is a priority
			this.isEventFrame = inheritedObject.isEventFrame;
			this.canBeTriggeredAnotherObject = inheritedObject.canBeTriggeredAnotherObject;

			// States
			const states = Utils.valueOrDefault(inheritedObject.states, []);
			let i: number, l: number;
			for (i = 0, l = states.length; i < l; i++) {
				this.states.push(states[i]);
			}

			// Properties
			const properties = Utils.valueOrDefault(inheritedObject.properties, []);
			for (i = 0, l = properties.length; i < l; i++) {
				this.properties.push(properties[i]);
			}

			// Events
			const events = inheritedObject.events;
			let eventsList: Model.Event[], realEventsList: Model.Event[];
			for (const idEvent in events) {
				eventsList = events[idEvent];
				realEventsList = [];
				for (i = 0, l = eventsList.length; i < l; i++) {
					realEventsList.push(eventsList[i]);
				}
				this.events[idEvent] = realEventsList;
			}
		}
	}

	/**
	 *  Get all the time events.
	 *  @returns {System.Event[]}
	 */
	getTimeEvents(): Model.Event[] {
		const completeList = this.events[1];
		const list = [];
		if (completeList) {
			let event: Model.Event;
			for (let i = 0, l = completeList.length; i < l; i++) {
				event = completeList[i];
				if (event.isSystem) {
					list.push(event);
				}
			}
		}
		return list;
	}

	/**
	 *  Get the reactions corresponding to a given event and parameters.
	 *  @param {boolean} isSystem - Boolean indicating if it is an event System
	 *  @param {number} idEvent - ID of the event
	 *  @param {number} state - The ID of the state
	 *  @param {Model.DynamicValue[]} parameters - List of all the parameters
	 *  @returns {System.Reaction[]}
	 */
	getReactions(
		isSystem: boolean,
		idEvent: number,
		state: number,
		parameters: Model.DynamicValue[]
	): Model.Reaction[] {
		const events = this.events[idEvent];
		const reactions = [];
		if (events !== undefined) {
			let test: boolean, event: Model.Event, j: number, m: number, reaction: Model.Reaction;
			for (let i = 0, l = events.length; i < l; i++) {
				test = true;
				event = events[i];
				if (event.isSystem === isSystem) {
					for (j = 1, m = parameters.length; j < m; j++) {
						if (event.parameters[j] && !event.parameters[j].value.isEqual(parameters[j])) {
							test = false;
							break;
						}
					}
					if (test) {
						reaction = events[i].reactions[state];
						if (reaction) {
							reactions.push(reaction);
						}
					}
				}
			}
		}
		return reactions;
	}
}

export { MapObject };
