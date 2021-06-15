/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { Datas, System } from "../index";
import { Enum } from "../Common";
import { Game, MapObject, Player } from "../Core";

/** @class
 *  An event command for changing experience curve of one or several hero.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class ChangeClass extends Base {
    
    public classID: System.DynamicValue;
    public selectionKind: number;
    public selectionHeroEnemyInstanceID: System.DynamicValue;
    public selectionTeam: Enum.GroupKind;

    constructor(command: any[]) {
        super();

        let iterator = {
            i: 0
        }
        this.classID = System.DynamicValue.createValueCommand(command, iterator);
        this.selectionKind = command[iterator.i++];
        switch (this.selectionKind) {
            case 0:
                this.selectionHeroEnemyInstanceID = System.DynamicValue
                    .createValueCommand(command, iterator);
                break;
            case 1:
                this.selectionTeam = command[iterator.i++];
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
        let newClass = Datas.Classes.get(this.classID.getValue());
        let targets: Player[];
        switch (this.selectionKind) {
            case 0:
                targets = [Game.current.getHeroByInstanceID(this
                    .selectionHeroEnemyInstanceID.getValue())];
                break;
            case 1:
                targets = Game.current.getTeam(this.selectionTeam);
                break;
        }
        let level: number;
        for (let target of targets) {
            target.changedClass = newClass;
            level = target[Datas.BattleSystems.getLevelStatistic().abbreviation];
            target.skills = target.system.getSkills(level, newClass);
            target.updateAllStatsValues();
        }
        return 1;
    }
}

export { ChangeClass }