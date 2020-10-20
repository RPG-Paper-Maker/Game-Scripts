/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A value in the system
*   @property {number} kind The kind of value
*   @property {number} value The value
*   @param {Object} [json=undefined] Json object describing the value
*/
class SystemValue
{
    constructor(json)
    {
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Create a new value from kind and value
    *   @static
    *   @param {number} [k=PrimitiveValueKind.None] The kind of value
    *   @param {number} [v=0] The value
    *   @returns {SystemValue}
    */
    static create = function(k = PrimitiveValueKind.None, v = 0)
    {
        let systemValue = new SystemValue();
        systemValue.kind = k;
        switch (k) 
        {
        case PrimitiveValueKind.None:
            systemValue.value = null;
            break;
        case PrimitiveValueKind.Message:
            systemValue.value = RPM.numToString(v);
            break;
        case PrimitiveValueKind.Switch:
            systemValue.value = RPM.numToBool(v);
            break;
        default:
            systemValue.value = v;
            break;
        }
        return systemValue;
    }

    // -------------------------------------------------------
    /** Create a new value from a command and iterator
    *   @static
    *   @param {any[]} command The list describing the command
    *   @param {Object} iterator The iterator
    *   @returns {SystemValue}
    */
    static createValueCommand = function(command, iterator) {
        let k = command[iterator.i++];
        let v = command[iterator.i++];
        return SystemValue.create(k, v);
    }

    // -------------------------------------------------------
    /** Create a none value
    *   @static
    *   @returns {SystemValue}
    */
    static createNone()
    {
        return SystemValue.create(PrimitiveValueKind.None, null);
    }

    // -------------------------------------------------------
    /** Create a new value number
    *   @static
    *   @param {number} n The number
    *   @returns {SystemValue}
    */
    static createNumber(n)
    {
        return SystemValue.create(PrimitiveValueKind.Number, n);
    }

    // -------------------------------------------------------
    /** Create a new value message
    *   @static
    *   @param {string} m The message
    *   @returns {SystemValue}
    */
    static createMessage(m)
    {
        return SystemValue.create(PrimitiveValueKind.Message, m);
    }

    // -------------------------------------------------------
    /** Create a new value decimal number
    *   @static
    *   @param {number} n The number
    *   @returns {SystemValue}
    */
    static createNumberDouble(n)
    {
        return SystemValue.create(PrimitiveValueKind.NumberDouble, n);
    }

    // -------------------------------------------------------
    /** Create a new value keyBoard
    *   @static
    *   @param {number} k The key number
    *   @returns {SystemValue}
    */
    static createKeyBoard(k)
    {
        return SystemValue.create(PrimitiveValueKind.KeyBoard, k);
    }

    // -------------------------------------------------------
    /** Create a new value switch
    *   @static
    *   @param {boolean} b The value of the switch
    *   @returns {SystemValue}
    */
    static createSwitch(b)
    {
        return SystemValue.create(PrimitiveValueKind.Switch, RPM.boolToNum(b));
    }

    // -------------------------------------------------------
    /** Create a new value variable
    *   @static
    *   @param {number} id The variable id
    *   @returns {SystemValue}
    */
    static createVariable(id)
    {
        return SystemValue.create(PrimitiveValueKind.Variable, id);
    }

    // -------------------------------------------------------
    /** Create a new value parameter
    *   @static
    *   @param {number} id The parameter id
    *   @returns {SystemValue}
    */
    static createParameter(id)
    {
        return SystemValue.create(PrimitiveValueKind.Parameter, id);
    }

    // -------------------------------------------------------
    /** Create a new value property
    *   @static
    *   @param {number} id The property id
    *   @returns {SystemValue}
    */
    static createProperty(id)
    {
        return SystemValue.create(PrimitiveValueKind.Property, id);
    }

    // -------------------------------------------------------
    /** Try to read a number value, if not possible put default value
    *   @static
    *   @param {number} json The json value
    *   @param {number} [n=0] The default value
    *   @returns {SystemValue}
    */
    static readOrDefaultNumber(json, n = 0)
    {
        return RPM.isUndefined(json) ? SystemValue.createNumber(n) : 
            SystemValue.readFromJSON(json);
    }

    // -------------------------------------------------------
    /** Try to read a double number value, if not possible put default value
    *   @static
    *   @param {number} json The json value
    *   @param {number} [n=0] The default value
    *   @returns {SystemValue}
    */
    static readOrDefaultNumberDouble(json, n = 0)
    {
        return RPM.isUndefined(json) ? SystemValue.createNumberDouble(n) : 
            SystemValue.readFromJSON(json);
    }

    // -------------------------------------------------------
    /** Try to read a database value, if not possible put default value
    *   @static
    *   @param {number} json The json value
    *   @param {number} [id=1] The default value
    *   @returns {SystemValue}
    */
    static readOrDefaultDatabase = function(json, id = 1)
    {
        return RPM.isUndefined(json) ? SystemValue.create(PrimitiveValueKind
            .DataBase, id) : SystemValue.readFromJSON(json);
    }

    // -------------------------------------------------------
    /** Try to read a message value, if not possible put default value
    *   @static
    *   @param {number} json The json value
    *   @param {number} [m=RPM.STRING_EMPTY] The default value
    *   @returns {SystemValue}
    */
    static readOrDefaultMessage(json, m)
    {
        return RPM.isUndefined(json) ? SystemValue.create(PrimitiveValueKind
            .Message, m) : SystemValue.readFromJSON(json);
    }

    // -------------------------------------------------------
    /** Try to read a value, if not possible put none value
    *   @static
    *   @param {number} json The json value
    *   @returns {SystemValue}
    */
    static readOrNone(json)
    {
        return RPM.isUndefined(json) ? SystemValue.createNone() : SystemValue
            .readFromJSON(json);
    }

    // -------------------------------------------------------
    /** Read a value of any kind and return it
    *   @static
    *   @param {number} json The json value
    *   @returns {SystemValue}
    */
    static readFromJSON(json)
    {
        let value = new SystemValue();
        value.read(json);
        return value;
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the value
    *   @param {Object} json Json object describing the value
    */
    read(json)
    {
        this.kind = json.k;
        this.value = json.v;
    }

    // -------------------------------------------------------
    /** Get the value
    *   @returns {number}
    */
    getValue()
    {
        switch (this.kind)
        {
        case PrimitiveValueKind.Variable:
            return RPM.game.variables[this.value];
        case PrimitiveValueKind.Parameter:
            return RPM.currentParameters[this.value].getValue();
        case PrimitiveValueKind.Property:
            return RPM.currentObject.properties[this.value];
        default:
            return this.value;
        }
    }

    // -------------------------------------------------------
    /** Check if a value is equal to another one
    *   @param {SystemValue} value The value to compare
    *   @returns {boolean}
    */
    isEqual(value)
    {
        // If keyBoard
        if (this.kind === PrimitiveValueKind.KeyBoard && value.kind !== 
            PrimitiveValueKind.KeyBoard)
        {
            return DatasKeyBoard.isKeyEqual(value.value, RPM.datasGame.keyBoard
                .list[this.value]);
        } else if (value.kind === PrimitiveValueKind.KeyBoard && this.kind !== 
            PrimitiveValueKind.KeyBoard)
        {
            return DatasKeyBoard.isKeyEqual(this.value, RPM.datasGame.keyBoard
                .list[value.value]);
        } else if (this.kind === PrimitiveValueKind.Anything || value.kind ===
            PrimitiveValueKind.Anything)
        {
            return true;
        }
        // If any other value, compare the direct values
        return this.getValue() === value.getValue();
    }
}