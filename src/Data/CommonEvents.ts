/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform, Utils } from '../Common';
import { JsonType } from '../Common/Types';
import { Data } from '../index';
import { CommonEvent, CommonReaction, CommonReactionJSON, MapObject, MapObjectJSON, ParameterListJSON } from '../Model';
import { Base } from './Base';

/**
 * JSON structure for Common Events.
 */
export type CommonEventsJSON = {
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

	private static readonly SYSTEM_EVENTS: JsonType[] = [
		{ id: 1, name: 'Time', p: [
			{ id: 1, name: 'Interval', d: { k: 3, v: 0 } },
			{ id: 2, name: 'Repeat', d: { k: 10, v: true } },
		]},
		{ id: 2, name: 'Chronometer finished', p: [
			{ id: 1, name: 'ID', d: { k: 3, v: 0 } },
		]},
		{ id: 3, name: 'KeyPress', p: [
			{ id: 1, name: 'ID', d: { k: 1, v: null } },
			{ id: 2, name: 'Repeat', d: { k: 10, v: false } },
			{ id: 3, name: 'Immediate Repeat', d: { k: 10, v: false } },
		]},
		{ id: 4, name: 'KeyRelease', p: [
			{ id: 1, name: 'ID', d: { k: 1, v: null } },
		]},
		{ id: 5, name: 'MouseDown', p: [
			{ id: 1, name: 'x', d: { k: 3, v: 0 } },
			{ id: 2, name: 'y', d: { k: 3, v: 0 } },
			{ id: 3, name: 'Left', d: { k: 10, v: true } },
			{ id: 4, name: 'Repeat', d: { k: 10, v: false } },
		]},
		{ id: 6, name: 'MouseUp', p: [
			{ id: 1, name: 'x', d: { k: 3, v: 0 } },
			{ id: 2, name: 'y', d: { k: 3, v: 0 } },
			{ id: 3, name: 'Left', d: { k: 10, v: true } },
		]},
		{ id: 7, name: 'MouseMove', p: [
			{ id: 1, name: 'x', d: { k: 3, v: 0 } },
			{ id: 2, name: 'y', d: { k: 3, v: 0 } },
		]},
		{ id: 8, name: 'Closing main menu', p: [] },
	];

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
	 * @param visiting - Set of object IDs currently being processed (used to detect inheritance cycles)
	 */
	static modelReOrder(
		jsonObject: MapObjectJSON,
		reorderedList: MapObjectJSON[],
		jsonObjects: MapObjectJSON[],
		visiting: Set<number> = new Set(),
	): void {
		if (jsonObject && !Object.prototype.hasOwnProperty.call(jsonObject, Data.CommonEvents.PROPERTY_STOCKED)) {
			// If id = -1, we can add to the list
			const id = jsonObject.hId;
			if (id !== undefined && id !== -1) {
				// Search id in the json list
				let inheritedObject: MapObjectJSON | undefined;
				for (const obj of jsonObjects) {
					if (obj.id === id) {
						inheritedObject = obj;
						break;
					}
				}
				if (inheritedObject) {
					// Detect inheritance cycle: if the target model is already in the current call chain
					if (visiting.has(id)) {
						Platform.showErrorMessage(
							`Model inheritance loop detected in common objects: "${jsonObject.name}" (ID: ${jsonObject.id}) inherits from "${inheritedObject.name}" (ID: ${id}), which creates a cycle. Please fix this in the Systems > Models tab.`,
						);
					}
					visiting.add(jsonObject.id!);
					this.modelReOrder(inheritedObject, reorderedList, jsonObjects, visiting);
					visiting.delete(jsonObject.id!);
				}
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

		this.eventsSystem = Utils.readJSONMap(CommonEvents.SYSTEM_EVENTS, CommonEvent);
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
