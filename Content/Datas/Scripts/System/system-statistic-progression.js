/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

// -------------------------------------------------------
//
//  CLASS SystemStatisticProgression
//
// -------------------------------------------------------

/** @class
*   A statistic progression of the game.
*   @property {number} initialValue The initial value of the statistic.
*   @property {number} finalValue The final value of the statistic.
*   @property {number} id The id of the statistic.
*/
function SystemStatisticProgression(){

}

SystemStatisticProgression.prototype = {

    /** Read the JSON associated to the statistic progression.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        this.id = json.id;
        this.maxValue = new SystemValue();
        this.maxValue.read(json.m);
        this.isFix = json["if"];
        if (this.isFix) {
            this.table = new SystemProgressionTable();
            this.table.readJSON(json.t);
            this.random = new SystemValue();
            this.random.read(json.r);
        } else {
            this.formula = new SystemValue();
            this.formula.read(json.f);
        }
    },

    // -------------------------------------------------------

    getValueAtLevel: function(level, user, maxLevel) {
        return this.isFix ? this.table.getProgressionAt(level, typeof maxLevel
             === 'undefined' ? user.character.getProperty("finalLevel") :
             maxLevel) : RPM.evaluateFormula(this.formula.getValue(), user, null);
    }
}
