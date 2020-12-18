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
 *  An event command for modifying team.
 *  @extends EventCommand
 *  @property {number} addingKind The kind of adding
 *  @property {SystemValue} instanceLevel The instance level ID
 *  @property {GroupKind} instanceTeam The instance team group
 *  @property {number} stockVariableID The stock variable ID
 *  @property {CharacterKind} instanceKind The instance character kind
 *  @property {CharacterKind} addRemoveKind The add remove character kind
 *  @property {SystemValue} addRemoveID The add remove ID value
 *  @property {GroupKind} addRemoveTeam The add remove team group kind
 *  @param {any[]} command Direct JSON command to parse
*/
class ModifyTeam extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.addingKind = command[iterator.i++];
        switch (this.addingKind) {
            case 0: // If create new instance
                this.instanceLevel = System.DynamicValue.createValueCommand(command, iterator);
                this.instanceTeam = command[iterator.i++];
                this.stockVariableID = command[iterator.i++];
                this.instanceKind = command[iterator.i++];
                this.instanceID = command[iterator.i++];
                break;
            case 1:
                this.addRemoveKind = command[iterator.i++];
                this.addRemoveID = System.DynamicValue.createValueCommand(command, iterator);
                this.addRemoveTeam = command[iterator.i++];
                break;
        }
    }
    /**
     *  Add or remove a character in a group.
     *  @param {CharacterKind} kind The type of character to instanciate
     *  @param {number} id The ID of the character to instanciate
     *  @param {GroupKind} groupKind In which group we should instanciate
     */
    addRemove(kind, id, groupKind) {
        // Searching for the ID
        let groups = Manager.Stack.game.getGroups();
        let group = null;
        let i, j, l, m, g, player;
        for (i = 0, l = groups.length; i < l; i++) {
            g = groups[i];
            for (j = 0, m = g.length; j < m; j++) {
                player = g[j];
                if (player.instid === id) {
                    group = g;
                    break;
                }
            }
            if (group !== null) {
                break;
            }
        }
        if (group !== null) {
            group.splice(j, 1);
            if (kind === 0) {
                groups[groupKind].push(player);
            }
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
        switch (this.addingKind) {
            case 0:
                Manager.Stack.game.instanciateTeam(this.instanceTeam, this
                    .instanceKind, this.instanceID, this.instanceLevel
                    .getValue(), this.stockVariableID);
                break;
            case 1:
                this.addRemove(this.addRemoveKind, this.addRemoveID.getValue(), this.addRemoveTeam);
                break;
        }
        return 1;
    }
}
export { ModifyTeam };
