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
//  CLASS SystemLoot
//
// -------------------------------------------------------

/** @class
*   A loot of the game.
*/
function SystemLoot() {

}

SystemLoot.drop = function(loot) {

};

SystemLoot.prototype = {

    /** Read the JSON associated to the loot.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        this.id = json.id;
        this.kind = json.k;
        this.number = new SystemValue();
        this.number.read(json.n);
        this.probability = new SystemValue();
        this.probability.read(json.p);
        this.initial = new SystemValue();
        this.initial.read(json.i);
        this.final = new SystemValue();
        this.final.read(json.f);
    },

    // -------------------------------------------------------

    isAvailable: function(level) {
        return level >= this.initial.getValue() && level <= this.final.getValue();
    },

    // -------------------------------------------------------

    currenLoot: function(level) {
        if (!this.isAvailable(level)) {
            return null;
        }

        var i, proba, totalNumber, number, rand, model;

        // Calculate number with proba
        proba = this.probability.getValue();
        totalNumber = this.number.getValue();
        for (i = 0, number = 0; i < totalNumber; i++) {
            rand = RPM.random(0, 100);
            if (rand <= proba) {
                number++;
            }
        }

        // Result
        return number > 0 ? new GameItem(this.kind, this.id, number) : null;
    }
}
