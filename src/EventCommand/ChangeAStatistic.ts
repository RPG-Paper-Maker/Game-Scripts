/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { System, Datas } from "../index";
import { Utils, Mathf, Interpreter } from "../Common";
import { MapObject, Game } from "../Core";
import { Player } from "../Core";

/** @class
 *  An event command for changing a statistic.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class ChangeAStatistic extends Base {

    public statisticID: System.DynamicValue;
    public selection: number;
    public heInstanceID: System.DynamicValue;
    public groupIndex: number;
    public operation: number;
    public value: number;
    public vNumber: System.DynamicValue;
    public vFormula: System.DynamicValue;
    public vMax: boolean;
    public canAboveMax: boolean;

    constructor(command: any[]) {
        super();

        let iterator = {
            i: 0
        }
        this.statisticID = System.DynamicValue.createValueCommand(command, 
            iterator);

        // Selection
        this.selection = command[iterator.i++];
        switch (this.selection) {
            case 0:
                this.heInstanceID = System.DynamicValue.createValueCommand(
                    command, iterator);
                break;
            case 1:
                this.groupIndex = command[iterator.i++];
                break;
        }
        
        // Operation
        this.operation = command[iterator.i++];

        // Value
        this.value = command[iterator.i++];
        switch (this.value) {
            case 0:
                this.vNumber = System.DynamicValue.createValueCommand(command, 
                    iterator);
                break;
            case 1:
                this.vFormula = System.DynamicValue.createValueCommand(command, 
                    iterator);
                break;
            case 2:
                this.vMax = true;
                break;
        }

        // Option
        this.canAboveMax = !Utils.numToBool(command[iterator.i++]);
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
        let stat = Datas.BattleSystems.getStatistic(this.statisticID.getValue());
        let abr = stat.abbreviation;
        let targets: Player[];
        switch (this.selection) {
            case 0:
                targets = [Game.current.getHeroByInstanceID(this
                    .heInstanceID.getValue())];
                break;
            case 1:
                targets = Game.current.getTeam(this.groupIndex);
                break;
        }
        let target: Player;
        for (let i = 0, l = targets.length; i < l; i++) {
            target = targets[i];
            switch (this.value) {
                case 0:
                    target[abr] = Mathf.OPERATORS_NUMBERS[this.operation](target
                        [abr], this.vNumber.getValue());
                    break;
                case 1:
                    target[abr] = Mathf.OPERATORS_NUMBERS[this.operation](target
                        [abr], Interpreter.evaluate(this.vFormula.getValue(), { 
                        user: target }));
                    break;
                case 2:
                    target[abr] = Mathf.OPERATORS_NUMBERS[this.operation](target
                        [abr], target[stat.getMaxAbbreviation()]);
                    break;
            }
            if (!this.canAboveMax) {
                target[abr] = Math.max(target[stat.getMaxAbbreviation()], target
                    [abr]);
            }
        }
        return 1;
    }
}
export { ChangeAStatistic }
