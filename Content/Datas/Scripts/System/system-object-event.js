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
//  CLASS SystemObjectEvent
//
// -------------------------------------------------------

/** @class
*   An event that an object can react on.
*   @property {boolean} isSystem Boolean indicating if it is an event system.
*   @property {number} idEvent ID of the event.
*   @property {SystemValue[]} parameters All the parameters values.
*   @property {SystemReaction[]} reactions List of all the reactions according
*   to states id.
*/
function SystemObjectEvent(){

}

SystemObjectEvent.prototype = {

    /** Read the JSON associated to the object event.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        var i, l, id, idState;

        this.isSystem = json.sys;
        this.idEvent = json.id;

        // Parameters
        var listEvents = this.isSystem ?
                    $datasGame.commonEvents.eventsSystem
                  : $datasGame.commonEvents.eventsUser;
        this.parameters =
             SystemParameter.readParametersWithDefault(
                 json, listEvents[this.idEvent].parameters);

        // Reactions
        var jsonReactions = json["r"];
        this.reactions = {};
        for (idState in jsonReactions){
            var jsonReaction = jsonReactions[idState];
            var reaction = new SystemObjectReaction();
            reaction.readJSON(jsonReaction);
            this.reactions[idState] = reaction;
        }
    },

    // -------------------------------------------------------

    /** Check if this event is equal to another.
    *   @param {SystemObjectEvent} event The event to compare.
    *   @returns {boolean}
    */
    isEqual: function(event){
        if (this.isSystem !== event.isSystem || this.idEvent !== event.idEvent)
            return false;

        for (var i = 1, l = this.parameters.length; i < l; i++){
            if (!this.parameters[i].isEqual(event.parameters[i]))
                return false;
        }

        return true;
    },

    // -------------------------------------------------------

    /** Add reactions to the event.
    *   @param {Object} reactions The reactions to add.
    */
    addReactions: function(reactions){
        for (var idState in reactions){
            this.reactions[idState] = reactions[idState];
        }
    }
}
