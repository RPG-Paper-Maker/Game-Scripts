/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform, Utils } from '../Common';
import { Data } from '../index';
import { CommonEvent, CommonReaction, MapObject } from '../Model';

/** @class
 *  All the battle System datas.
 *  @static
 */
class CommonEvents {
	public static PROPERTY_STOCKED = 'stocked';
	private static eventsSystem: Map<number, CommonEvent>;
	private static eventsUser: Map<number, CommonEvent>;
	private static commonReactions: Map<number, CommonReaction>;
	private static commonObjects: Map<number, MapObject>;
	public static heroObject: MapObject;

	/**
	 *  Read the JSON file associated to common events.
	 *  @static
	 *  @async
	 */
	static async read() {
		const json = (await Platform.parseFileJSON(Paths.FILE_COMMON_EVENTS)) as any;

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
		this.heroObject = new MapObject();
		this.heroObject.read(json.ho);
	}

	/**
	 *  Reorder the models in the right order for inheritance.
	 *  @param {Record<string, any>} - jsonObject The json corresponding to the
	 *  current object to analyze
	 *  @pa Dataects
	 *  @param {number} objectsLength - The number of objects to identify
	 */
	static modelReOrder(
		jsonObject: Record<string, any>,
		reorderedList: Record<string, any>[],
		jsonObjects: Record<string, any>[]
	) {
		if (jsonObject && !jsonObject.hasOwnProperty(Data.CommonEvents.PROPERTY_STOCKED)) {
			// If id = -1, we can add to the list
			const id = jsonObject.hId;
			if (id !== -1) {
				// Search id in the json list
				let inheritedObject: Record<string, any>;
				for (let i = 0; i < jsonObjects.length; i++) {
					inheritedObject = jsonObjects[i];
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
	 *  Get the event system by ID.
	 *  @param {number} id
	 *  @returns {System.Event}
	 */
	static getEventSystem(id: number): CommonEvent {
		return Data.Base.get(id, this.eventsSystem, 'event system');
	}

	/**
	 *  Get the event user by ID.
	 *  @param {number} id
	 *  @returns {System.Event}
	 */
	static getEventUser(id: number): CommonEvent {
		return Data.Base.get(id, this.eventsUser, 'event user');
	}

	/**
	 *  Get the common reaction by ID.
	 *  @param {number} id
	 *  @returns {System.CommonReaction}
	 */
	static getCommonReaction(id: number): CommonReaction {
		return Data.Base.get(id, this.commonReactions, 'common reaction');
	}

	/**
	 *  Get the common object by ID.
	 *  @param {number} id
	 *  @returns {System.MapObject}
	 */
	static getCommonObject(id: number): MapObject {
		return Data.Base.get(id, this.commonObjects, 'common object');
	}
}

export { CommonEvents };
