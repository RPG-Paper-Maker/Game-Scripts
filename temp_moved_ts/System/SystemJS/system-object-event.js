/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *   An event that an object can react on
 *   @property {boolean} isSystem Boolean indicating if it is an event System
 *   @property {number} idEvent ID of the event
 *   @property {Parameter[]} parameters All the parameters values
 *   @property {SystemObjectReaction[]} reactions List of all the reactions
 *   according to states ID
 *   @param {Object} [json=undefined] Json object describing the object event
 */
class SystemObjectEvent {
    constructor(json) {
        if (json) {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the object event
     *   @param {Object} json Json object describing the object event
     */
    read(json) {
        this.isSystem = json.sys;
        this.idEvent = json.id;

        // Parameters
        this.parameters = Parameter.readParametersWithDefault(json, (this
            .isSystem ? RPM.datasGame.commonEvents.eventsSystem : RPM.datasGame
            .commonEvents.eventsUser)[this.idEvent].parameters);

        // Reactions
        let jsonReactions = json.r;
        this.reactions = {};
        for (let idState in jsonReactions) {
            this.reactions[idState] = new SystemObjectReaction(jsonReactions[
                idState]);
        }
    }

    // -------------------------------------------------------
    /** Check if this event is equal to another
     *   @param {SystemObjectEvent} event The event to compare
     *   @returns {boolean}
     */
    isEqual(event) {
        if (this.isSystem !== event.isSystem || this.idEvent !== event.idEvent) {
            return false;
        }

        for (let i = 1, l = this.parameters.length; i < l; i++) {
            if (!this.parameters[i].isEqual(event.parameters[i])) {
                return false;
            }
        }
        return true;
    }

    // -------------------------------------------------------
    /** Add reactions to the event
     *   @param {Object} reactions The reactions to add
     */
    addReactions(reactions) {
        for (let idState in reactions) {
            this.reactions[idState] = reactions[idState];
        }
    }
}