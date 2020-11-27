/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A statistic progression of the game
*   @property {number} id The id of the statistic
*   @property {SystemValue} maxValue The max value
*   @property {boolean} isFix Indicate if the statistic progression is fix
*   @property {ProgressionTable} table The System progression table
*   @property {SystemValue} random The random value
*   @property {SystemValue} formula The formula
*   @param {Object} [json=undefined] Json object describing the statistic 
*   progression
*/
class SystemStatisticProgression
{
    constructor(json)
    {
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the statistic progression
    *   @param {Object} json Json object describing the statistic progression
    */
    read(json)
    {
        this.id = json.id;
        this.maxValue = new SystemValue(json.m);
        this.isFix = json.if;
        if (this.isFix) {
            this.table = new ProgressionTable(undefined, json.t);
            this.random = new SystemValue(json.r);
        } else {
            this.formula = new SystemValue(json.f);
        }
    }

    // -------------------------------------------------------
    /** Get the value progresion at level
    *   @param {number} level The level
    *   @param {GamePlayer} user The user
    *   @param {number} [maxLevel=undefined] The max level
    */
    getValueAtLevel(level, user, maxLevel)
    {
        return this.isFix ? this.table.getProgressionAt(level, RPM.isUndefined(
            maxLevel) ? user.character.getProperty(Class
            .PROPERTY_FINAL_LEVEL) : maxLevel) : RPM.evaluateFormula(this
            .formula.getValue(), user, null);
    }
}
