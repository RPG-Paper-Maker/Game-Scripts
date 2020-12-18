/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base";
import { System, Manager } from "..";
import { Skill } from "../Core";
import { Utils } from "../Common";
/** @class
 *  An event command for changing a skill.
 *  @extends EventCommand.Base
 *  @property {System.DynamicValue} skillID The skill ID value
 *  @property {number} selection The selection kind
 *  @property {System.DynamicValue} heInstanceID The hero enemy instance ID
 *  value
 *  @property {GroupKind} groupIndex The group index
 *  @property {number} operation The operation kind
 *  @param {any[]} command Direct JSON command to parse
*/
class ChangeASkill extends Base {
    constructor(command) {
        super();
        var iterator = {
            i: 0
        };
        this.skillID = System.DynamicValue.createValueCommand(command, iterator);
        // Selection
        this.selection = command[iterator.i++];
        switch (this.selection) {
            case 0:
                this.heInstanceID = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 1:
                this.groupIndex = command[iterator.i++];
                break;
        }
        // Operation
        this.operation = command[iterator.i++];
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The current object reacting
     *  @param {number} state The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState, object, state) {
        let skillID = this.skillID.getValue();
        let targets;
        switch (this.selection) {
            case 0:
                targets = [Manager.Stack.game.getHeroByInstanceID(this
                        .heInstanceID.getValue())];
                break;
            case 1:
                targets = Manager.Stack.game.getTeam(this.groupIndex);
                break;
        }
        let target, index;
        for (let i = 0, l = targets.length; i < l; i++) {
            target = targets[i];
            index = Utils.indexOfProp(target.sk, "id", skillID);
            switch (this.operation) {
                case 0:
                    if (index === -1) {
                        target.sk.push(new Skill(skillID));
                    }
                    break;
                case 1:
                    if (index !== -1) {
                        target.sk.splice(index, 1);
                    }
                    break;
            }
        }
        return 1;
    }
}
export { ChangeASkill };
