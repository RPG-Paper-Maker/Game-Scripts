/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A parameter of a reaction
*   @property {SystemValue} value The value of the parameter
*   @param {Object} [json=undefined] Json object describing the parameter value
*/
class SystemParameter
{
    constructor(json)
    {
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the parameters
    *   @static 
    *   @param {Object} json Json object describing the parameters
    *   @returns {SystemParameter[]}
    */
    static readParameters(json)
    {
        return RPM.readJSONSystemList(RPM.defaultValue(json.p, []), 
            SystemParameter);
    }

    // -------------------------------------------------------
    /** Read the parameters with default values
    *   @param {Object} json Json object describing the object
    *   @param {SystemParameter[]} list List of all the parameters default
    *   @returns {SystemParameter[]}
    */
    static readParametersWithDefault(json, list)
    {
        let jsonParameters = json.p;
        let l = jsonParameters.length;
        let parameters = new Array(l+1);
        let jsonParameter, parameter;
        for (let i = 0, l = jsonParameters.length; i < l; i++)
        {
            jsonParameter = jsonParameters[i];
            parameter = new SystemParameter();
            parameter.readDefault(jsonParameter.v);
            if (parameter.value.kind === PrimitiveValueKind.Default)
            {
                parameter = list[i + 1];
            }
            parameters[jsonParameter.id] = parameter;
        }
        return parameters;
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the parameter value
    *   @param {Object} json Json object describing the parameter value
    */
    read(json)
    {
        this.value = new SystemValue(json.d);
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the parameter default value
    *   @param {Object} json Json object describing the default value
    */
    readDefault(json)
    {
        this.value = new SystemValue(json);
    }

    // -------------------------------------------------------
    /** Check if the parameter is equal to another one
    *   @param {SystemParameter} parameter The parameter to compare
    *   @returns {boolean}
    */
    isEqual(parameter)
    {
        return (this.value === parameter.value && this.kind === parameter.kind);
    }
}