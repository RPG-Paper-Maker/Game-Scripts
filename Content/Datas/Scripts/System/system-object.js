/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS SystemObject
//
// -------------------------------------------------------

/** @class
*   An object.
*   @property {number} id The ID of the object.
*   @property {SystemObjectState[]} states List of all the possible states of
*   the object.
*   @property {SystemObjectEvent[]} events List of all the event that the object
*   can react on.
*/
function SystemObject(){

}

SystemObject.prototype = {

    /** Read the JSON associated to the object.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        var i, j, l, ll, id, hId;
        var jsonStates, jsonState, jsonProperties, jsonProperty, jsonEvents,
            jsonEvent, prop;

        this.id = json.id;
        this.name = json.name;
        this.eventFrame = json.ooepf;
        this.states = [];
        this.properties = [];
        this.events = {};

        hId = json.hId;
        if (hId !== -1) {
            var inheritedObject = $datasGame.commonEvents.commonObjects[hId];

            // Only one event per frame inheritance is a priority
            this.eventFrame = inheritedObject.eventFrame;

            // States
            var states = inheritedObject.states;
            l = states ? states.length : 0;
            for (i = 0; i < l; i++){
                this.states.push(states[i]);
            }

            // Properties
            var properties = inheritedObject.properties;
            l = properties ? properties.length : 0;
            for (i = 0; i < l; i++) {
                this.properties.push(properties[i]);
            }

            // Events
            var events = inheritedObject.events;
            for (var idEvent in events){
                var eventsList = events[idEvent];
                var realEventsList = new Array;
                for (i = 0, l = eventsList.length; i < l; i++){
                    realEventsList.push(eventsList[i]);
                }
                this.events[idEvent] = realEventsList;
            }
        }

        // States
        jsonStates = json.states;
        l = jsonStates ? jsonStates.length : 0;
        for (i = 0; i < l; i++){
            jsonState = jsonStates[i];
            id = jsonState.id;
            for (j = 0, ll = this.states.length; j < ll; j++){
                if (this.states[j].id === id)
                    break;
            }
            var state = new SystemObjectState();
            state.readJSON(jsonState);
            this.states[j] = state;
        }

        // Properties
        jsonProperties = json.p;
        l = jsonProperties ? jsonProperties.length : 0;
        for (i = 0; i < l; i++) {
            jsonProperty = jsonProperties[i];
            prop = new SystemProperty();
            prop.readJSON(jsonProperty);
            id = prop.id;
            for (j = 0, ll = this.properties.length; j < ll; j++) {
                if (this.properties[j].id === id)
                    break;
            }
            this.properties[j] = prop;
        }

        // Events
        jsonEvents = json.events;
        l = jsonEvents ? jsonEvents.length : 0;
        for (i = 0; i < l; i++){
            jsonEvent = jsonEvents[i];
            var event = new SystemObjectEvent();
            event.readJSON(jsonEvent);

            if (this.events.hasOwnProperty(event.idEvent)) {
                var list = this.events[event.idEvent];
                for (j = 0, ll = list.length; j < ll; j++){
                    if (list[j].isEqual(event))
                        break;
                }
                if (j < list.length){
                    list[j].addReactions(event.reactions);
                }
                else
                    list.push(event);
            }
            else
                this.events[event.idEvent] = [event];
        }

        this.timeEvents = this.getTimeEvents();
    },

    // -------------------------------------------------------

    getTimeEvents: function() {
        var i, l, list, completeList, event;

        completeList = this.events[1];
        list = [];
        if (completeList) {
            for (i = 0, l = completeList.length; i < l; i++) {
                event = completeList[i];
                if (event.isSystem) {
                    list.push(event);
                }
            }
        }

        return list;
    },

    // -------------------------------------------------------

    /** Get the reactions corresponding to a given event and parameters.
    *   @param {boolean} isSystem Boolean indicating if it is an event system.
    *   @param {number} idEvent ID of the event.
    *   @param {number} state The ID of the state.
    *   @param {SystemValue[]} parameters List of all the parameters.
    */
    getReactions: function(isSystem, idEvent, state, parameters){
        var i, j, l, ll, test;
        var reactions = [];
        var events = this.events[idEvent];
        var event, reaction;

        if (typeof events !== 'undefined'){
            for (i = 0, l = events.length; i < l; i++){
                test = true;
                event = events[i];

                if (event.isSystem === isSystem) {
                    for (j = 1, ll = parameters.length; j < ll; j++){
                        if (!event.parameters[j].value.isEqual(parameters[j])) {
                            test = false;
                            break;
                        }
                    }

                    if (test) {
                        reaction = events[i].reactions[state];
                        if (reaction)
                            reactions.push(reaction);
                    }
                }
            }
        }

        return reactions;
    }
}
