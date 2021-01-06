import { Base } from "./Base.js";
import { System } from "../index.js";
import { Enum } from "../Common/index.js";
import GroupKind = Enum.GroupKind;
import CharacterKind = Enum.CharacterKind;
import { MapObject } from "../Core/index.js";
/** @class
 *  An event command for modifying team.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
declare class ModifyTeam extends Base {
    addingKind: number;
    instanceLevel: System.DynamicValue;
    instanceTeam: GroupKind;
    stockVariableID: number;
    instanceKind: CharacterKind;
    instanceID: number;
    addRemoveKind: CharacterKind;
    addRemoveID: System.DynamicValue;
    addRemoveTeam: GroupKind;
    constructor(command: any[]);
    /**
     *  Add or remove a character in a group.
     *  @param {CharacterKind} kind - The type of character to instanciate
     *  @param {number} id - The ID of the character to instanciate
     *  @param {GroupKind} groupKind - In which group we should instanciate
     */
    addRemove(kind: CharacterKind, id: number, groupKind: GroupKind): void;
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState: Record<string, any>, object: MapObject, state: number): number;
}
export { ModifyTeam };
