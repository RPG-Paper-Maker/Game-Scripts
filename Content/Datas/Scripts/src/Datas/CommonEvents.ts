/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { IO, Paths, Utils } from "../Common";
import { System, Datas } from "..";

/** @class
 *  All the battle System datas.
 *  @property {string} [DatasCommonEvents.PROPERTY_STOCKED="stocked"] The 
 *  property stocked for reorder function
 *  @property {Event[]} eventsSystem List of all the events System by ID
 *  @property {Event[]} eventsUser List of all the events user by ID
 *  @property {SystemCommonReaction[]} commonReactions List of all the common
 *  reactions by ID
 *  @property {SystemObject[]} commonObjects List of all the common objects by 
 *  ID
 */
class CommonEvents {

    public static PROPERTY_STOCKED = "stocked";
    public static eventsSystem: System.Event[];
    public static eventsUser: System.Event[];
    public static commonReactions: System.CommonReaction[];
    public static commonObjects: System.MapObject[];

    constructor() {
        throw new Error("This is a static class!");
    }

    /** 
     *  Read the JSON file associated to common events.
     *  @static
     *  @async
     */
    static async read() {
        let json = await IO.parseFileJSON(Paths.FILE_COMMON_EVENTS);

        // Lists
        this.eventsSystem = [];
        Utils.readJSONSystemList({ list: json.eventsSystem, listIDs: this
            .eventsSystem, cons: System.Event });
        this.eventsUser = [];
        Utils.readJSONSystemList({ list: json.eventsUser, listIDs: this
            .eventsUser, cons: System.Event });
        Utils.readJSONSystemList({ list: json.commonReactors, listIDs: this
            .commonReactions, cons: System.CommonReaction });

        // Common objects
        /* First, we'll need to reorder the json list according to
        inheritance */
        let jsonObjects = json.commonObjects;
        let reorderedList = [];
        let jsonObject: Record<string, any>;
        for (let i = 0, l = jsonObjects.length; i < l; i++) {
            jsonObject = jsonObjects[i];
            this.modelReOrder(jsonObject, reorderedList, jsonObjects, l);
        }

        // Now, we can create all the models without problem
        this.commonObjects = [];
        Utils.readJSONSystemList({ list: reorderedList, listIDs: this
            .commonObjects, cons: System.MapObject });
    }

    /** 
     *  Reorder the models in the right order for inheritance.
     *  @param {Record<string, any>} jsonObject The json corresponding to the 
     *  current object to analyze
     *  @param {Record<string, any>[]} reorderedList The reordered list we are 
     *  updating
     *  @param {Record<string, any>[]} jsonObjects The brutal JSON list of 
     *  objects
     *  @param {number} objectsLength The number of objects to identify
     */
    static modelReOrder(jsonObject: Record<string, any>, reorderedList: 
        Record<string, any>[], jsonObjects: Record<string, any>[], objectsLength
        : number)
    {
        if (jsonObject && !jsonObject.hasOwnProperty(Datas.CommonEvents
            .PROPERTY_STOCKED))
        {
            // If id = -1, we can add to the list
            let id = jsonObject.hId;
            if (id !== -1) {
                // Search id in the json list
                let inheritedObject: Record<string, any>;
                for (let i = 0; i < objectsLength; i++) {
                    inheritedObject = jsonObjects[i];
                    if (inheritedObject.id === id) {
                        break;
                    }
                }
                // Test inheritance for this object
                this.modelReOrder(inheritedObject, reorderedList, jsonObjects,
                    objectsLength);
            }
            jsonObject.stocked = true;
            reorderedList.push(jsonObject);
        }
    }
}

export { CommonEvents }