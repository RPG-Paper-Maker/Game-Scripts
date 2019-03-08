/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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
