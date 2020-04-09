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
        this.kind = json.k;
        this.lootID = new SystemValue();
        this.lootID.read(json.lid);
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
        return number > 0 ? new GameItem(this.kind, this.lootID.getValue(),
            number) : null;
    }
}
