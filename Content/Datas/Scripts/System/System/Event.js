/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { System } from "../index.js";
import { Utils } from "../Common/index.js";
/** @class
 *  An event that an object can react on.
 *  @property {boolean} isSystem Boolean indicating if it is an event System
 *  @property {number} idEvent ID of the event
 *  @property {System.Parameter[]} parameters All the parameters values
 *  @property {Record<number, System.Reaction>} reactions List of all the reactions
 *  according to states ID
 *  @param {Record<string, any>} [json=undefined] Json object describing the
 *  object event
 */
class Event extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the object event
     *  @param {Record<string, any>} json Json object describing the object event
     */
    read(json) {
        this.isSystem = Utils.defaultValue(json.sys, true);
        this.idEvent = json.id;
        // Parameters
        this.parameters = System.Parameter.readParameters(json);
        // Reactions
        let jsonReactions = json.r;
        this.reactions = {};
        for (let idState in jsonReactions) {
            this.reactions[idState] = new System.Reaction(jsonReactions[idState]);
        }
    }
    /**
     *  Check if this event is equal to another.
     *  @param {System.Event} event The event to compare
     *  @returns {boolean}
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
    /**
     *  Add reactions to the event.
     *  @param {Record<number, System.Reaction>} reactions The reactions to add
     */
    addReactions(reactions) {
        for (let idState in reactions) {
            this.reactions[idState] = reactions[idState];
        }
    }
}
export { Event };