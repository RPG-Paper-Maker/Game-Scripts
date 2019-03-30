/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

// -------------------------------------------------------
//
//  CLASS SystemValue
//
// -------------------------------------------------------

/** @class
*   A value in the system.
*   @property {number} kind The kind of value.
*   @property {number} value The value.
*/
function SystemValue(){

}

/** Create a new value.
*   @static
*   @property {number} k The kind of value.
*   @property {number} v The value.
*   @returns {SystemValue}
*/
SystemValue.createValue = function(k, v){
    var value = new SystemValue();
    value.kind = k;
    value.value = v;
    return value;
}

// -------------------------------------------------------

SystemValue.createValueCommand = function(command, iterator) {
    var k, v;

    k = command[iterator.i++];
    v = command[iterator.i++];

    return SystemValue.createValue(k, v);
}

// -------------------------------------------------------

/** Create a none value.
*   @static
*   @returns {SystemValue}
*/
SystemValue.createNone = function(){
    return SystemValue.createValue(PrimitiveValueKind.None, null);
}

// -------------------------------------------------------

/** Create a new value number.
*   @static
*   @property {number} n The number.
*   @returns {SystemValue}
*/
SystemValue.createNumber = function(n){
    return SystemValue.createValue(PrimitiveValueKind.Number, n);
}

// -------------------------------------------------------

/** Create a new value keyBoard.
*   @static
*   @property {number} k The key number.
*   @returns {SystemValue}
*/
SystemValue.createKeyBoard = function(k){
    return SystemValue.createValue(PrimitiveValueKind.KeyBoard, k);
}

// -------------------------------------------------------

/** Create a new value switch.
*   @static
*   @property {boolean} b The value of the switch.
*   @returns {SystemValue}
*/
SystemValue.createSwitch = function(b){
    return SystemValue.createValue(PrimitiveValueKind.Switch, b);
}

// -------------------------------------------------------

SystemValue.readOrDefaultNumber = function(json, number) {
    if (typeof number === 'undefined') {
        number = 0;
    }

    if (json) {
        var value = new SystemValue();
        value.read(json);
        return value;
    }

    return SystemValue.createNumber(number);
}

// -------------------------------------------------------

SystemValue.readOrDefaultDatabase = function(json) {
    if (json) {
        var value = new SystemValue();
        value.read(json);
        return value;
    }

    return SystemValue.createValue(PrimitiveValueKind.Database, 1);
}

// -------------------------------------------------------

SystemValue.readOrDefaultMessage = function(json, message) {
    if (json) {
        var value = new SystemValue();
        value.read(json);
        return value;
    }

    return SystemValue.createValue(PrimitiveValueKind.Message, message ? message
        : "");
}

// -------------------------------------------------------

SystemValue.readOrNone = function(json) {
    if (json) {
        var value = new SystemValue();
        value.read(json);
        return value;
    }

    return SystemValue.createNone();
}

// -------------------------------------------------------

SystemValue.prototype = {

    /** Read the JSON associated to the valuel.
    *   @param {Object} json Json object describing the object.
    */
    read: function(json){
        if (!json) {
            var a = 1;
        }

        this.kind = json.k;
        this.value = json.v;
    },

    // -------------------------------------------------------

    /** Get the value.
    *   @returns {number}
    */
    getValue: function(){
        if (this.kind === PrimitiveValueKind.Variable)
            return $game.variables[this.value];

        return this.value;
    },

    // -------------------------------------------------------

    /** Check if a value is equal to another one.
    *   @param {SystemValue} value The value to compare.
    *   @returns {boolean}
    */
    isEqual: function(value){

        // If keyBoard
        if (this.kind === PrimitiveValueKind.KeyBoard &&
            value.kind !== PrimitiveValueKind.KeyBoard)
        {
            return DatasKeyBoard.isKeyEqual(
                        value.value, $datasGame.keyBoard.list[this.value]);
        }
        else if (value.kind === PrimitiveValueKind.KeyBoard &&
                 this.kind !== PrimitiveValueKind.KeyBoard)
        {
            return DatasKeyBoard.isKeyEqual(
                        this.value, $datasGame.keyBoard.list[value.value]);
        }

        return this.value === value.value;
    }
}
