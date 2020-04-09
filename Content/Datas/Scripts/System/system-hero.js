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
//  CLASS SystemHero
//
// -------------------------------------------------------

/** @class
*   An hero of the game.
*   @property {string} name The name of the hero.
*   @property {number} idClass The class ID of the hero
*/
function SystemHero(){

}

SystemHero.prototype = {

    /** Read the JSON associated to the hero.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        this.name = json.names[1];
        this.idClass = json.class;
        this.idBattler = typeof json.bid === 'undefined' ? -1 : json.bid;
        this.idFaceset = typeof json.fid === 'undefined' ? -1 : json.fid;
        this.classInherit = new SystemClass();
        this.classInherit.readJSON(json.ci);
        this.check();
    },

    // -------------------------------------------------------

    check: function() {
        if (!$datasGame.classes.list[this.idClass]) {
            RPM.showErrorMessage("Can't find class with ID " + RPM.formatNumber(
                this.idClass, 4) + " for " + (this.rewards ? "monster" : "hero")
                + " " + this.name + ", check it in datasbase.");
        }
    },

    // -------------------------------------------------------

    getProperty: function(prop) {
        return $datasGame.classes.list[this.idClass].getProperty(prop,
            this.classInherit);
    },

    // -------------------------------------------------------

    getExperienceTable: function() {
        return $datasGame.classes.list[this.idClass].getExperienceTable(this
            .classInherit);
    },

    // -------------------------------------------------------

    getStatisticsProgression: function() {
        return $datasGame.classes.list[this.idClass].getStatisticsProgression(
            this.classInherit);
    },

    // -------------------------------------------------------

    getSkills: function(upClass) {
        return $datasGame.classes.list[this.idClass].getSkills(this.classInherit);
    },

    // -------------------------------------------------------

    createExpList: function() {
        var finalLevel = this.getProperty("finalLevel");
        var experienceBase = this.getProperty("experienceBase");
        var experienceInflation = this.getProperty("experienceInflation");
        var experienceTable = this.getExperienceTable();
        var expList = new Array(finalLevel + 1);
        var pow, i;

        // Basis
        pow = 2.4 + experienceInflation / 100;
        expList[1] = 0;
        for (i = 2; i <= finalLevel; i++) {
            expList[i] = expList[i - 1] + (experienceTable[i - 1] ?
                experienceTable[i - 1] : (Math.floor(experienceBase * (Math.pow(
                i + 3, pow) / Math.pow(5, pow)))));
        }

        return expList;
    }
}
