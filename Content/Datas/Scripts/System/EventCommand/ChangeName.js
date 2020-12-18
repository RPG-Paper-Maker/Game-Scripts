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
/** @class
 *  An event command for changing a hero name.
 *  @extends EventCommand
 *  @property {System.DynamicValue} name The name value
 *  @property {number} selection The selection kind
 *  @property {System.DynamicValue} heInstanceID The hero enemy instance ID value
 *  @property {GroupKind} groupIndex The group index
 *  @param {any[]} command Direct JSON command to parse
*/
class ChangeName extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.name = System.DynamicValue.createValueCommand(command, iterator);
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
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The current object reacting
     *  @param {number} state The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState, object, state) {
        let name = this.name.getValue();
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
        let target;
        for (let i = 0, l = targets.length; i < l; i++) {
            target = targets[i];
            target.name = name;
        }
        return 1;
    }
}
export { ChangeName };
