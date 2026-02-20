/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform, Utils } from '../Common';
import { Data } from '../index';
import { CommonEvent, CommonReaction, CommonReactionJSON, MapObject, MapObjectJSON, ParameterListJSON } from '../Model';
import { Base } from './Base';

/**
 * JSON structure for Common Events.
 */
export type CommonEventsJSON = {
	eventsSystem: Record<string, ParameterListJSON>[];
	eventsUser: Record<string, ParameterListJSON>[];
	commonReactors: Record<string, CommonReactionJSON>[];
	commonObjects: Record<string, MapObjectJSON>[];
	ho: MapObjectJSON;
};

/**
 * Handles all common events data.
 */
export class CommonEvents {
	public static PROPERTY_STOCKED = 'stocked';
	private static eventsSystem: Map<number, CommonEvent>;
	private static eventsUser: Map<number, CommonEvent>;
	private static commonReactions: Map<number, CommonReaction>;
	private static commonObjects: Map<number, MapObject>;
	public static heroObject: MapObject;

	/**
	 * Get the event system by ID.
	 */
	static getEventSystem(id: number): CommonEvent {
		return Base.get(id, this.eventsSystem, 'event system');
	}

	/**
	 * Get the event user by ID.
	 */
	static getEventUser(id: number): CommonEvent {
		return Base.get(id, this.eventsUser, 'event user');
	}

	/**
	 * Get the common reaction by ID.
	 */
	static getCommonReaction(id: number): CommonReaction {
		return Base.get(id, this.commonReactions, 'common reaction');
	}

	/**
	 * Get the common object by ID.
	 */
	static getCommonObject(id: number): MapObject {
		return Base.get(id, this.commonObjects, 'common object');
	}

	/**
	 * Reorder the models in the right order for inheritance.
	 * @param jsonObject - Current object to analyze
	 * @param reorderedList - Accumulator for reordered objects
	 * @param jsonObjects - Original list of JSON objects
	 */
	static modelReOrder(jsonObject: MapObjectJSON, reorderedList: MapObjectJSON[], jsonObjects: MapObjectJSON[]): void {
		if (jsonObject && !Object.prototype.hasOwnProperty.call(jsonObject, Data.CommonEvents.PROPERTY_STOCKED)) {
			// If id = -1, we can add to the list
			const id = jsonObject.hId;
			if (id !== -1) {
				// Search id in the json list
				let inheritedObject: MapObjectJSON;
				for (inheritedObject of jsonObjects) {
					if (inheritedObject.id === id) {
						break;
					}
				}
				// Test inheritance for this object
				this.modelReOrder(inheritedObject, reorderedList, jsonObjects);
			}
			jsonObject.stocked = true;
			reorderedList.push(jsonObject);
		}
	}

	/**
	 * Read the JSON file associated to common events.
	 */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_COMMON_EVENTS)) as CommonEventsJSON;

		this.eventsSystem = Utils.readJSONMap(json.eventsSystem, CommonEvent);
		this.eventsUser = Utils.readJSONMap(json.eventsUser, CommonEvent);
		this.commonReactions = Utils.readJSONMap(json.commonReactors, CommonReaction);

		// Common objects
		/* First, we'll need to reorder the json list according to
        inheritance */
		this.commonObjects = new Map();
		const reorderedList = [];
		for (const jsonObject of json.commonObjects) {
			this.modelReOrder(jsonObject, reorderedList, json.commonObjects);
		}

		// Now, we can create all the models without problem
		this.commonObjects = Utils.readJSONMap(reorderedList, MapObject);

		// Hero object
		this.heroObject = new MapObject(json.ho);
	}
}
