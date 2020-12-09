/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Enum, Utils } from "../Common";
import PrimitiveValueKind = Enum.PrimitiveValueKind;
import { System, Manager, Datas } from "..";
import { StructIterator } from "../EventCommand";
import { Stack } from "../Manager";

interface StructJSON
{
    k: PrimitiveValueKind;
    v: any;
}

/** @class
 *  The class who handle dynamic value.
 *  @extends {System.Base}
 *  @property {PrimitiveValueKind} kind The kind of value
 *  @property {any} value The value
 *  @param {Record<string, any>} [json=undefined] Json object describing the value
 */
class DynamicValue extends System.Base {
    
    public kind: PrimitiveValueKind;
    public value: any;

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Create a new value from kind and value.
     *  @static
     *  @param {PrimitiveValueKind} [k=PrimitiveValueKind.None] The kind of value
     *  @param {any} [v=0] The value
     *  @returns {SystemValue}
     */
    static create(k: PrimitiveValueKind = PrimitiveValueKind.None, v: any = 0): 
        System.DynamicValue {
        let systemValue = new System.DynamicValue();
        systemValue.kind = k;
        switch (k) {
            case PrimitiveValueKind.None:
                systemValue.value = null;
                break;
            case PrimitiveValueKind.Message:
                systemValue.value = Utils.numToString(v);
                break;
            case PrimitiveValueKind.Switch:
                systemValue.value = Utils.numToBool(v);
                break;
            default:
                systemValue.value = v;
                break;
        }
        return systemValue;
    }

    /** 
     *  Create a new value from a command and iterator.
     *  @static
     *  @param {any[]} command The list describing the command
     *  @param {StructIterator} iterator The iterator
     *  @returns {System.DynamicValue}
     */
    static createValueCommand(command: any[], iterator: StructIterator): 
        System.DynamicValue {
        let k = command[iterator.i++];
        let v = command[iterator.i++];
        return System.DynamicValue.create(k, v);
    }

    /** 
     *  Create a none value.
     *  @static
     *  @returns {System.DynamicValue}
     */
    static createNone(): System.DynamicValue {
        return System.DynamicValue.create(PrimitiveValueKind.None, null);
    }

    /** 
     *  Create a new value number.
     *  @static
     *  @param {number} n The number
     *  @returns {System.DynamicValue}
     */
    static createNumber(n: number): System.DynamicValue {
        return System.DynamicValue.create(PrimitiveValueKind.Number, n);
    }

    /**
     *  Create a new value message.
     *  @static
     *  @param {string} m The message
     *  @returns {System.DynamicValue}
     */
    static createMessage(m: string): System.DynamicValue {
        return System.DynamicValue.create(PrimitiveValueKind.Message, m);
    }

    /** 
     *  Create a new value decimal number.
     *  @static
     *  @param {number} n The number
     *  @returns {System.DynamicValue}
     */
    static createNumberDouble(n: number): System.DynamicValue {
        return System.DynamicValue.create(PrimitiveValueKind.NumberDouble, n);
    }

    /** 
     *  Create a new value keyBoard.
     *  @static
     *  @param {number} k The key number
     *  @returns {System.DynamicValue}
     */
    static createKeyBoard(k: number): System.DynamicValue {
        return System.DynamicValue.create(PrimitiveValueKind.KeyBoard, k);
    }

    /** 
     *  Create a new value switch.
     *  @static
     *  @param {boolean} b The value of the switch
     *  @returns {System.DynamicValue}
     */
    static createSwitch(b: boolean): System.DynamicValue {
        return System.DynamicValue.create(PrimitiveValueKind.Switch, Utils.boolToNum(b));
    }

    /** 
     *  Create a new value variable.
     *  @static
     *  @param {number} id The variable ID
     *  @returns {System.DynamicValue}
     */
    static createVariable(id: number): System.DynamicValue {
        return System.DynamicValue.create(PrimitiveValueKind.Variable, id);
    }

    /** 
     *  Create a new value parameter.
     *  @static
     *  @param {number} id The parameter ID
     *  @returns {System.DynamicValue}
     */
    static createParameter(id: number): System.DynamicValue {
        return System.DynamicValue.create(PrimitiveValueKind.Parameter, id);
    }

    /** 
     *  Create a new value property.
     *  @static
     *  @param {number} id The property id
     *  @returns {System.DynamicValue}
     */
    static createProperty(id: number): System.DynamicValue {
        return System.DynamicValue.create(PrimitiveValueKind.Property, id);
    }

    /** 
     *  Try to read a number value, if not possible put default value.
     *  @static
     *  @param {StructJSONDynamicValue} json The json value
     *  @param {number} [n=0] The default value
     *  @returns {System.DynamicValue}
     */
    static readOrDefaultNumber(json: StructJSON, n: number = 0): 
        System.DynamicValue {
        return Utils.isUndefined(json) ? System.DynamicValue.createNumber(n) : 
            System.DynamicValue.readFromJSON(json);
    }

    /** 
     *  Try to read a double number value, if not possible put default value.
     *  @static
     *  @param {StructJSONDynamicValue} json The json value
     *  @param {number} [n=0] The default value
     *  @returns {System.DynamicValue}
     */
    static readOrDefaultNumberDouble(json: StructJSON, n: number = 0
        ): System.DynamicValue {
        return Utils.isUndefined(json) ? System.DynamicValue.createNumberDouble(
            n) : System.DynamicValue.readFromJSON(json);
    }

    /** 
     *  Try to read a database value, if not possible put default value.
     *  @static
     *  @param {StructJSONDynamicValue} json The json value
     *  @param {number} [id=1] The default value
     *  @returns {System.DynamicValue}
     */
    static readOrDefaultDatabase(json: StructJSON, id: number = 1): 
        System.DynamicValue {
        return Utils.isUndefined(json) ? System.DynamicValue.create(
            PrimitiveValueKind.DataBase, id) : System.DynamicValue.readFromJSON(
            json);
    }

    /** 
     *  Try to read a message value, if not possible put default value.
     *  @static
     *  @param {StructJSONDynamicValue} json The json value
     *  @param {string} [m=""] The default value
     *  @returns {System.DynamicValue}
     */
    static readOrDefaultMessage(json: StructJSON, m: string = ""): 
        System.DynamicValue {
        return Utils.isUndefined(json) ? System.DynamicValue.create(
            PrimitiveValueKind.Message, m) : System.DynamicValue.readFromJSON(
            json);
    }

    /** 
     *  Try to read a value, if not possible put none value.
     *  @static
     *  @param {StructJSONDynamicValue} json The json value
     *  @returns {System.DynamicValue}
     */
    static readOrNone(json: StructJSON): System.DynamicValue {
        return Utils.isUndefined(json) ? System.DynamicValue.createNone() : 
            System.DynamicValue.readFromJSON(json);
    }

    /** 
     *  Read a value of any kind and return it.
     *  @static
     *  @param {StructJSONDynamicValue} json The json value
     *  @returns {System.DynamicValue}
     */
    static readFromJSON(json: StructJSON): System.DynamicValue {
        let value = new System.DynamicValue();
        value.read(json);
        return value;
    }

    /** 
     *  Read the JSON associated to the value
     *  @param {StructJSONDynamicValue} json Json object describing the value
     */
    read(json: StructJSON) {
        this.kind = json.k;
        this.value = json.v;
    }

    /** 
     *  Get the value
     *  @returns {any}
     */
    getValue(): any {
        switch (this.kind) {
            case PrimitiveValueKind.Variable:
                return Stack.game.variables[this.value];
            case PrimitiveValueKind.Parameter:
                return  Manager.EventReaction.currentParameters[this.value]
                    .getValue();
            case PrimitiveValueKind.Property:
                return Manager.EventReaction.currentObject.properties[this.value];
            default:
                return this.value;
        }
    }

    /** 
     *  Check if a value is equal to another one
     *  @param {System.DynamicValue} value The value to compare
     *  @returns {boolean}
     */
    isEqual(value: System.DynamicValue): boolean {
        // If keyBoard
        if (this.kind === PrimitiveValueKind.KeyBoard && value.kind !==
            PrimitiveValueKind.KeyBoard) {
            return Datas.Keyboards.isKeyEqual(value.value, Datas.Keyboards.get(
                this.value));
        } else if (value.kind === PrimitiveValueKind.KeyBoard && this.kind !==
            PrimitiveValueKind.KeyBoard) {
            return Datas.Keyboards.isKeyEqual(this.value, Datas.Keyboards.get(
                value.value));
        } else if (this.kind === PrimitiveValueKind.Anything || value.kind ===
            PrimitiveValueKind.Anything) {
            return true;
        }
        // If any other value, compare the direct values
        return this.getValue() === value.getValue();
    }
}

export { StructJSON, DynamicValue }