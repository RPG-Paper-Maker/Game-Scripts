/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { Graphic, Scene, System } from "../index";
import { Enum } from "../Common";
import { Player, MapObject, Game } from "../Core";

/** @class
 *  An event command for modifying team.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ModifyTeam extends Base {

    public kind: number;
    public instanceLevel: System.DynamicValue;
    public instanceTeam: Enum.GroupKind;
    public stockVariableID : System.DynamicValue;
    public instanceKind: Enum.CharacterKind;
    public instanceID: System.DynamicValue;
    public enemyInstanceID: System.DynamicValue;
    public enemyTeam: Enum.GroupKind;
    public modifyKind: number;
    public modifyInstanceID: System.DynamicValue;
    public modifyTeam: Enum.GroupKind;

    constructor(command: any[]) {
        super();

        let iterator = {
            i: 0
        }
        this.kind = command[iterator.i++];
        switch (this.kind) {
            case 0: // Create new instance
                this.instanceLevel = System.DynamicValue.createValueCommand(
                    command, iterator);
                this.instanceTeam = command[iterator.i++];
                this.stockVariableID = System.DynamicValue.createValueCommand(
                    command, iterator);
                this.instanceKind = command[iterator.i++];
                this.instanceID = System.DynamicValue.createValueCommand(
                    command, iterator);
                break;
            case 1: // Add enemy
                this.enemyInstanceID = System.DynamicValue.createValueCommand(
                    command, iterator);
                this.enemyTeam = command[iterator.i++];
                break;
            case 2: // Modify (move/remove)
                this.modifyKind = command[iterator.i++];
                this.modifyInstanceID = System.DynamicValue.createValueCommand(
                    command, iterator);
                this.modifyTeam = command[iterator.i++];
                break;
        }
    }

    /** 
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState: Record<string, any>, object: MapObject, state: number): 
        number
    {
        switch (this.kind) {
            case 0: // Create new instance
                Game.current.instanciateTeam(this.instanceTeam, this.instanceKind, 
                    this.instanceID.getValue(), this.instanceLevel.getValue(), 
                    this.stockVariableID.getValue(true));
                break;
            case 1: { // Add enemy
                if (!Scene.Map.current.isBattleMap) {
                    return;
                }
                let id = this.enemyInstanceID.getValue();
                let player: Player = null;
                for (let battler of (<Scene.Battle>Scene.Map.current).battlers[
                    Enum.CharacterKind.Monster]) {
                    if (battler.player.instid === id) {
                        player = battler.player;
                        break;
                    }
                }
                if (player !== null) {
                    player.kind = Enum.CharacterKind.Hero;
                    Game.current.getTeam(this.enemyTeam).push(player);
                }
                break;
            }
            case 2: { // Modify (move/remove)
                let groups = Game.current.getGroups();
                let selectedGroup = null;
                let id = this.modifyInstanceID.getValue();
                let player: Player;
                // Find group and player associated to instance ID
                for (let group of groups) {
                    for (player of group) {
                        if (player.instid === id) {
                            selectedGroup = group;
                            break;
                        }
                    }
                    if (selectedGroup !== null) {
                        break;
                    }
                }
                if (selectedGroup !== null)  {
                    selectedGroup.splice(selectedGroup.indexOf(player), 1);
                    if (this.modifyKind === 0) { // If moving
                        groups[this.modifyTeam].push(player);
                    }
                }
                break;
            }
        }
        return 1;
    }
}

export { ModifyTeam }