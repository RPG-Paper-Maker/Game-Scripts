/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { System } from "..";
import { MapObject } from "../Core";

/** @class
 *  An event command for changing variables values.
 *  @extends EventCommand
 *  @property {number} selection The selection begining
 *  @property {number} nbSelection The selection number
 *  @property {number} operation The operation number
 *  @property {number} valueKind The kind of value
 *  @property {System.DynamicValue} valueNumber The value number
 *  @property {System.DynamicValue} valueRandomA The value number random start
 *  @property {System.DynamicValue} valueRandomB The value number random end
 *  @property {System.DynamicValue} valueMessage The value message
 *  @property {System.DynamicValue} valueSwitch The value switch
 *  @property {System.DynamicValue} valueMapObject The value map object
 *  @property {VariableMapObjectCharacteristicKind} valueMapObjectChar The kind 
 *  of map object value
 *  @param {any[]} command Direct JSON command to parse
*/
class ChangeVariables extends Base {

    public selection: number;
    public nbSelection: number;
    public operation: number;
    public valueKind: number;
    public valueNumber: System.DynamicValue;
    public valueRandomA: System.DynamicValue;
    public valueRandomB: System.DynamicValue;
    public valueMessage: System.DynamicValue;
    public valueSwitch: System.DynamicValue;
    public valueMapObject: System.DynamicValue;
    public valueMapObjectChar: System.DynamicValue;

    constructor(command: any[]) {
        super();

        let iterator = {
            i: 2
        }

        // Selection
        this.selection = command[1];
        this.nbSelection = 1;
        if (command[0] === 1) {
            this.nbSelection = command[iterator.i++] - this.selection;
        }

        // Operation
        this.operation = command[iterator.i++];

        // Value
        this.valueKind = command[iterator.i++];
        switch (this.valueKind) {
            case 0: // Number
                this.valueNumber = System.DynamicValue.createValueCommand(
                    command, iterator);
                break;
            case 1: // Random number
                this.valueRandomA = System.DynamicValue.createValueCommand(
                    command, iterator);
                this.valueRandomB = System.DynamicValue.createValueCommand(
                    command, iterator);
                break;
            case 2: // Message
                this.valueMessage = System.DynamicValue.createValueCommand(
                    command, iterator);
                break;
            case 3: // Switch
                this.valueSwitch = System.DynamicValue.createValueCommand(
                    command, iterator);
                break;
            case 4: // Map object characteristic
                this.valueMapObject = System.DynamicValue.createValueCommand(
                    command, iterator);
                this.valueMapObjectChar = command[iterator.i++];
                break;
        }
    }

    /** 
     *  Initialize the current.
     *  @returns {Record<string, any>} The current state
     */
    initialize(): Record<string, any> {
        return {
            started: false,
        };
    }

    /** 
     *  Update and check if the event is finished
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The current object reacting
     *  @param {number} state The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState: Record<string, any>, object: MapObject, state: number): 
        number
    {
        if (!currentState.started) {
            currentState.started = true;
            // Get value to set
            switch (this.valueKind) {
                case 0: // Number
                    currentState.value = this.valueNumber.getValue();
                    break;
                case 1: // Random number
                    currentState.value = RPM.random(this.valueRandomA.getValue(),
                        this.valueRandomB.getValue());
                    break;
                case 2: // Message
                    currentState.value = this.valueMessage.getValue();
                    break;
                case 3: // Switch
                    currentState.value = this.valueSwitch.getValue(true);
                    break;
                case 4: // Map object characteristic
                    let objectID = this.valueMapObject.getValue();
                    MapObject.updateObjectWithID(object, objectID, this, function(
                        obj)
                    {
                        switch(this.valueMapObjectChar)
                        {
                        case VariableMapObjectCharacteristicKind.XSquarePosition:
                            currentState.value = RPM.getPosition(obj.position)[0];
                            break;
                        case VariableMapObjectCharacteristicKind.YSquarePosition:
                            currentState.value = RPM.getPosition(obj.position)[1];
                            break;
                        case VariableMapObjectCharacteristicKind.ZSquarePosition:
                            currentState.value = RPM.getPosition(obj.position)[2];
                            break;
                        case VariableMapObjectCharacteristicKind.XPixelPosition:
                            currentState.value = obj.position.x;
                            break;
                        case VariableMapObjectCharacteristicKind.YPixelPosition:
                            currentState.value = obj.position.y;
                            break;
                        case VariableMapObjectCharacteristicKind.ZPixelPosition:
                            currentState.value = obj.position.z;
                            break;
                        case VariableMapObjectCharacteristicKind.Orientation:
                            currentState.value = obj.orientation;
                            break;
                        }
                    });
            }
        }

        // Apply new value to variable(s)
        if (!RPM.isUndefined(currentState.value))
        {
            for (let i = 0, l = this.nbSelection; i < l; i++)
            {
                RPM.game.variables[this.selection + i] = RPM.operators_numbers[
                    this.operation](RPM.game.variables[this.selection + i],
                    currentState.value);
            }
        }
        return RPM.isUndefined(currentState.value) ? 0 : 1;
    }
}