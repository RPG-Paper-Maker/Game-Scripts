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
//  CLASS SystemClass
//
// -------------------------------------------------------

/** @class
*   A class of the game.
*   @property {string} name The name of the class.
*   @property {SystemClassSkill[]} skills The skills to learn of the class.
*/
function SystemClass(){

}

SystemClass.prototype = {

    /** Read the JSON associated to the class.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        this.name = json.name;
        this.initialLevel = json.iniL ? json.iniL : -1;
        this.finalLevel = json.mxL ? json.mxL : -1;
        this.experienceBase = json.eB ? json.eB : -1;
        this.experienceInflation = json.eI ? json.eI : -1;
        this.experienceTable = {};
        var jsonExperienceTable = json.eT;
        var i, l;
        if (jsonExperienceTable) {
            for (i = 0, l = jsonExperienceTable.length; i < l; i++) {
                this.experienceTable[jsonExperienceTable[i]["k"]] =
                    jsonExperienceTable[i]["v"];
            }
        }

        // Statistic progression
        var jsonStatisticsProgression = json.stats;
        if (!jsonStatisticsProgression) {
            jsonStatisticsProgression = [];
        }
        l = jsonStatisticsProgression.length;
        this.statisticsProgression = new Array(l);
        for (i = 0; i < l; i++){
            var statisticProgression = new SystemStatisticProgression();
            statisticProgression.readJSON(jsonStatisticsProgression[i]);
            this.statisticsProgression[i] = statisticProgression;
        }

        // Skills
        var jsonClassSkills = json.skills;
        if (!jsonClassSkills) {
            jsonClassSkills = [];
        }
        l = jsonClassSkills.length;
        this.skills = new Array(l);
        for (i = 0; i < l; i++){
            var classSkill = new SystemClassSkill();
            classSkill.readJSON(jsonClassSkills[i]);
            this.skills[i] = classSkill;
        }
    },

    // -------------------------------------------------------

    getProperty: function(prop, upClass) {
        return upClass[prop] === -1 ? this[prop] : upClass[prop];
    },

    // -------------------------------------------------------

    getExperienceTable: function(upClass) {
        var list = {}, i, l, level;
        for (level in this.experienceTable) {
            list[level] = this.experienceTable[level];
        }
        for (level in upClass.experienceTable) {
            list[level] = upClass.experienceTable[level];
        }

        return list;
    },

    // -------------------------------------------------------

    getStatisticsProgression: function(upClass) {
        var list = [], i, l, checked;
        for (i = 0, l = this.statisticsProgression.length; i < l; i++) {
            list.push(this.statisticsProgression[i]);
        }
        for (i = 0, l = upClass.statisticsProgression.length; i < l; i++) {
            checked = false;
            for (j = 0, ll = this.statisticsProgression.length; j < ll; j++) {
                if (upClass.statisticsProgression[i].id === this
                    .statisticsProgression[j].id)
                {
                    list[i] = upClass.statisticsProgression[j];
                    checked = true;
                    break;
                }
            }
            if (!checked) {
                list.push(upClass.statisticsProgression[i]);
            }
        }

        return list;
    },

    // -------------------------------------------------------

    getSkills: function(upClass) {
        return this.skills.concat(upClass.skills);
    }
}
