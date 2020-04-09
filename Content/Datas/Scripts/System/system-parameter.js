/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS SystemParameter
//
// -------------------------------------------------------

/** @class
*   A parameter of a reaction.
*   @property {SystemValue} value The value of the parameter.
*/
function SystemParameter(){

}

/** Read the parameters.
*   @param {Object} json Json object describing the object.
*   @returns {SystemParameter[]}
*/
SystemParameter.readParameters = function(json){
    var i, l;
    var jsonParameters = json.p;

    l = jsonParameters ? jsonParameters.length : 0;
    var parameters = new Array(l+1);
    for (i = 0; i < l; i++){
        var jsonParameter = jsonParameters[i];
        var parameter = new SystemParameter();
        parameter.readJSON(jsonParameter);
        parameters[jsonParameter.id] = parameter;
    }

    return parameters;
}

// -------------------------------------------------------

/** Read the parameters with default values.
*   @param {Object} json Json object describing the object.
*   @param {SystemParameter[]} list List of all the parameters default.
*   @returns {SystemParameter[]}
*/
SystemParameter.readParametersWithDefault = function(json, list){
    var i, l;
    var jsonParameters = json.p;
    l = jsonParameters.length;
    var parameters = new Array(l+1);
    for (i = 0, l = jsonParameters.length; i < l; i++){
        var jsonParameter = jsonParameters[i];
        var parameter = new SystemParameter();
        parameter.readJSONDefault(jsonParameter.v);

        // If default value
        if (parameter.value.kind === 2)
            parameter = list[i + 1];

        parameters[jsonParameter.id] = parameter;
    }

    return parameters;
}

// -------------------------------------------------------

SystemParameter.prototype = {

    /** Read the JSON associated to the parameter value.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        this.value = new SystemValue;
        this.value.read(json.d);
    },

    /** Read the JSON associated to the parameter default value.
    *   @param {Object} json Json object describing the object.
    */
    readJSONDefault: function(json){
        this.value = new SystemValue;
        this.value.read(json);
    },

    /** Check if the parameter is equal to another one.
    *   @param {SystemParameter()} parameter The parameter to compare.
    *   @returns {boolean}
    */
    isEqual: function(parameter){
        return (this.value === parameter.value && this.kind === parameter.kind);
    }
}
