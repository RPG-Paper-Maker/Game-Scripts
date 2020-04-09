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
//  CLASS SystemStatistic
//
// -------------------------------------------------------

/** @class
*   A statistic of the game.
*   @property {string} name The name of the statistic.
*   @property {string} abbreviation The abbreviation of the statistic
*   (for javascript code).
*   @property {boolean} isFix Indicate if this statistic is fix (no bar).
*/
function SystemStatistic() {

}

// -------------------------------------------------------

SystemStatistic.createElementRes = function(id, name) {
    var stat;

    stat = new SystemStatistic();
    stat.name = name + " res.";
    stat.abbreviation = "elres" + id;
    stat.isFix = true;
    stat.isRes = true;

    return stat;
}

// -------------------------------------------------------

SystemStatistic.createElementResPercent = function(id, name) {
    var stat;

    stat = new SystemStatistic();
    stat.name = name + " res.(%)";
    stat.abbreviation = "elresp" + id;
    stat.isFix = true;
    stat.isRes = true;

    return stat;
}

SystemStatistic.prototype = {

    /** Read the JSON associated to the statistic.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        this.name = json.names[1];
        this.abbreviation = json.abr;
        this.isFix = json.fix;
    },

    // -------------------------------------------------------

    getMaxAbbreviation: function() {
        return "max" + this.abbreviation;
    },

    // -------------------------------------------------------

    getBeforeAbbreviation: function() {
        return "before" + this.abbreviation;
    },

    // -------------------------------------------------------

    getBonusAbbreviation: function() {
        return "bonus" + this.abbreviation;
    },

    // -------------------------------------------------------

    getAbbreviationNext: function() {
        return this.isFix ? this.abbreviation : this.getMaxAbbreviation();
    }
}
