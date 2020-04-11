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
//  CLASS SystemClass
//
// -------------------------------------------------------

/** @class
*   A class of the game.
*   @property {string} name The name of the class.
*   @property {SystemClassSkill[]} skills The skills to learn of the class.
*/
function SystemClass() {
    SystemLang.call(this);
}

SystemClass.prototype = Object.create(SystemLang.prototype);

SystemClass.prototype.readJSON = function(json) {
    SystemLang.prototype.readJSON.call(this, json);

    var elements, elementsOrder, statisticProgression;

    this.initialLevel = json.iniL ? json.iniL : -1;
    this.finalLevel = json.mxL ? json.mxL : -1;
    this.experienceBase = json.eB ? json.eB : -1;
    this.experienceInflation = json.eI ? json.eI : -1;
    this.experienceTable = {};
    var jsonExperienceTable = json.eT;
    var i, l, index;
    if (jsonExperienceTable) {
        for (i = 0, l = jsonExperienceTable.length; i < l; i++) {
            this.experienceTable[jsonExperienceTable[i].k] =
                jsonExperienceTable[i].v;
        }
    }

    // Statistic progression
    var jsonStatisticsProgression = json.stats;
    if (!jsonStatisticsProgression) {
        jsonStatisticsProgression = [];
    }
    l = jsonStatisticsProgression.length;
    this.statisticsProgression = new Array(l);
    for (index = 0; index < l; index++){
        statisticProgression = new SystemStatisticProgression();
        statisticProgression.readJSON(jsonStatisticsProgression[index]);
        this.statisticsProgression[index] = statisticProgression;
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
};

// -------------------------------------------------------

SystemClass.prototype.getProperty = function(prop, upClass) {
    return upClass[prop] === -1 ? this[prop] : upClass[prop];
};

// -------------------------------------------------------

SystemClass.prototype.getExperienceTable = function(upClass) {
    var list = {}, i, l, level;
    for (level in this.experienceTable) {
        list[level] = this.experienceTable[level];
    }
    for (level in upClass.experienceTable) {
        list[level] = upClass.experienceTable[level];
    }

    return list;
};

// -------------------------------------------------------

SystemClass.prototype.getStatisticsProgression = function(upClass) {
    var list = [], i, j, l, ll, checked;
    for (i = 0, l = this.statisticsProgression.length; i < l; i++) {
        list.push(this.statisticsProgression[i]);
    }
    for (i = 0, l = upClass.statisticsProgression.length; i < l; i++) {
        checked = false;
        for (j = 0, ll = this.statisticsProgression.length; j < ll; j++) {
            if (upClass.statisticsProgression[i].id === this
                .statisticsProgression[j].id)
            {
                list[j] = upClass.statisticsProgression[i];
                checked = true;
                break;
            }
        }
        if (!checked) {
            list.push(upClass.statisticsProgression[i]);
        }
    }

    return list;
};

// -------------------------------------------------------

SystemClass.prototype.getSkills = function(upClass) {
    return this.skills.concat(upClass.skills);
};
