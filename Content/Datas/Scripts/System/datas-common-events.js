/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   All the battle system datas
*   @property {string} [DatasCommonEvents.PROPERTY_STOCKED="stocked"] The 
*   property stocked for reorder function
*   @property {SystemEvent[]} eventsSystem List of all the events system by ID
*   @property {SystemEvent[]} eventsUser List of all the events user by ID
*   @property {SystemCommonReaction[]} commonReactions List of all the common
*   reactions by ID
*   @property {SystemObject[]} commonObjects List of all the common objects by 
*   ID
*/
class DatasCommonEvents
{
    static PROPERTY_STOCKED = "stocked";

    constructor()
    {

    }

    // -------------------------------------------------------
    /** Read the JSON file associated to common events
    */
    async read()
    {
        let json = await RPM.parseFileJSON(RPM.FILE_COMMON_EVENTS);

        // Lists
        this.eventsSystem = RPM.readJSONSystemList(json.eventsSystem, 
            SystemEvent);
        this.eventsUser = RPM.readJSONSystemList(json.eventsUser, SystemEvent);
        this.commonReactions = RPM.readJSONSystemList(json.commonReactors, 
            SystemCommonReaction);

        // Common objects
        /* First, we'll need to reorder the json list according to
        inheritance */
        let jsonObjects = json.commonObjects;
        let reorderedList = [];
        let jsonObject;
        for (let i = 0, l = jsonObjects.length; i < l; i++)
        {
            jsonObject = jsonObjects[i];
            this.modelReOrder(jsonObject, reorderedList, jsonObjects, l);
        }

        // Now, we can create all the models without problem
        this.commonObjects = RPM.readJSONSystemList(reorderedList, SystemObject);
    }

    // -------------------------------------------------------
    /** Reorder the models in the right order for inheritance
    *   @param {JSON} jsonObject The json corresponding to the current object
    *   to analyze
    *   @param {JSON[]} reorderedList The reordered list we are updating
    *   @param {JSON[]} jsonObjects The brutal JSON list of objects
    *   @param {number} objectsLength The number of objects to identify
    */
    modelReOrder(jsonObject, reorderedList, jsonObjects, objectsLength)
    {
        if (jsonObject && !jsonObject.hasOwnProperty(DatasCommonEvents
            .PROPERTY_STOCKED))
        {
            // If id = -1, we can add to the list
            let id = jsonObject.hId;
            if (id !== -1)
            {
                // Search id in the json list
                let inheritedObject;
                for (let i = 0; i < objectsLength; i++)
                {
                    inheritedObject = jsonObjects[i];
                    if (inheritedObject.id === id)
                    {
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
