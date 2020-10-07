/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   An object
*   @property {number} id The ID of the object
*   @property {string} name The name of the object
*   @property {boolean} eventFrame Indicated if it only execute one reaction 
*   per frame
*   @property {SystemObjectState[]} states List of all the possible states of
*   the object
*   @property {SystemProperty[]} properties List of all properties of the object
*   @property {SystemObjectEvent[]} events List of all the event that the object
*   can react on
*   @param {Object} [json=undefined] Json object describing the object
*/
class SystemObject
{
    constructor(json)
    {
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the object
    *   @param {Object} json Json object describing the object
    */
    read(json)
    {
        this.id = json.id;
        this.name = json.name;
        this.eventFrame = json.ooepf;
        this.states = [];
        this.properties = [];
        this.events = {};

        let hId = json.hId;
        let i, l;
        if (hId !== -1)
        {
            let inheritedObject = RPM.datasGame.commonEvents.commonObjects[hId];

            // Only one event per frame inheritance is a priority
            this.eventFrame = inheritedObject.eventFrame;

            // States
            let states = RPM.defaultValue(inheritedObject.states, []);
            for (i = 0, l = states.length; i < l; i++)
            {
                this.states.push(states[i]);
            }

            // Properties
            let properties = RPM.defaultValue(inheritedObject.properties, []);
            for (i = 0, l = properties.length; i < l; i++)
            {
                this.properties.push(properties[i]);
            }

            // Events
            let events = inheritedObject.events;
            let eventsList, realEventsList;
            for (let idEvent in events)
            {
                eventsList = events[idEvent];
                realEventsList = new Array;
                for (i = 0, l = eventsList.length; i < l; i++)
                {
                    realEventsList.push(eventsList[i]);
                }
                this.events[idEvent] = realEventsList;
            }
        }

        // States
        let jsonList = RPM.defaultValue(json.states, []);
        let jsonElement, id, j, m, element;
        for (i = 0, l = jsonList.length; i < l; i++)
        {
            jsonElement = jsonList[i];
            id = jsonElement.id;
            for (j = 0, m = this.states.length; j < m; j++)
            {
                if (this.states[j].id === id)
                {
                    break;
                }
            }
            this.states[j] = new SystemObjectState(jsonElement);
        }

        // Properties
        jsonList = RPM.defaultValue(json.p, []);
        for (i = 0, l = jsonList.length; i < l; i++)
        {
            jsonElement = jsonList[i];
            element = new SystemProperty(jsonElement);
            id = element.id;
            for (j = 0, m = this.properties.length; j < m; j++)
            {
                if (this.properties[j].id === id)
                {
                    break;
                }
            }
            this.properties[j] = element;
        }

        // Events
        jsonList = RPM.defaultValue(json.events, []);
        let list;
        for (i = 0, l = jsonList.length; i < l; i++)
        {
            jsonElement = jsonList[i];
            element = new SystemObjectEvent(jsonElement);
            if (this.events.hasOwnProperty(element.idEvent))
            {
                list = this.events[element.idEvent];
                for (j = 0, m = list.length; j < m; j++)
                {
                    if (list[j].isEqual(element))
                    {
                        break;
                    }
                }
                if (j < list.length)
                {
                    list[j].addReactions(element.reactions);
                }
                else
                {
                    list.push(element);
                }
            }
            else
            {
                this.events[element.idEvent] = [element];
            }
        }

        this.timeEvents = this.getTimeEvents();
    }

    // -------------------------------------------------------
    /** Get all the time events
    *   @returns {SystemEvent[]}
    */
    getTimeEvents()
    {
        let completeList = this.events[1];
        let list = [];
        if (completeList)
        {
            let event;
            for (let i = 0, l = completeList.length; i < l; i++)
            {
                event = completeList[i];
                if (event.isSystem)
                {
                    list.push(event);
                }
            }
        }
        return list;
    }

    // -------------------------------------------------------
    /** Get the reactions corresponding to a given event and parameters
    *   @param {boolean} isSystem Boolean indicating if it is an event system
    *   @param {number} idEvent ID of the event
    *   @param {number} state The ID of the state
    *   @param {SystemValue[]} parameters List of all the parameters
    */
    getReactions(isSystem, idEvent, state, parameters)
    {
        
        let events = this.events[idEvent];
        let reactions = [];
        if (!RPM.isUndefined(events))
        {
            let test, event, j, m, reaction;
            for (let i = 0, l = events.length; i < l; i++)
            {
                test = true;
                event = events[i];
                if (event.isSystem === isSystem)
                {
                    for (j = 1, m = parameters.length; j < m; j++)
                    {
                        if (!event.parameters[j].value.isEqual(parameters[j]))
                        {
                            test = false;
                            break;
                        }
                    }
                    if (test)
                    {
                        reaction = events[i].reactions[state];
                        if (reaction)
                        {
                            reactions.push(reaction);
                        }
                    }
                }
            }
        }
        return reactions;
    }
}