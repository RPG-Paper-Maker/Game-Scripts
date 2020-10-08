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
*   @property {number} initialValue The initial value of the statistic
*   @property {number} finalValue The final value of the statistic
*   @property {number} id The id of the statistic
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

    /** Read the JSON associated to the statistic progression.
    *   @param {Object} json Json object describing the object.
    */
    read(json)
    {
        this.id = json.id;
        this.maxValue = new SystemValue(json.m);
        this.isFix = json.if;
        if (this.isFix) {
            this.table = new SystemProgressionTable(undefined, json.t);
            this.random = new SystemValue(json.r);
        } else {
            this.formula = new SystemValue(json.f);
        }
    }

    // -------------------------------------------------------

    getValueAtLevel(level, user, maxLevel)
    {
        return this.isFix ? this.table.getProgressionAt(level, RPM.isUndefined(
            maxLevel) ? user.character.getProperty(SystemClass
            .PROPERTY_FINAL_LEVEL) : maxLevel) : RPM.evaluateFormula(this.formula
            .getValue(), user, null);
    }
}
