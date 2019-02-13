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
//  CLASS Player
//
//  A character in the team/hidden/reserve
//
//  @k          -> The kind of the character (hero or monster)
//  @id         -> The id of the character
//  @instid     -> The instance id of the character
//  @sk         -> List of all the learned skills
//  @equip      -> List of the equiped weapons/armors
//
// -------------------------------------------------------

/** @class
*   A character in the team/hidden/reserve.
*   @property {CharacterKind} k The kind of the character (hero or monster).
*   @property {number} id The ID of the character
*   @property {number} instid The instance id of the character.
*   @param {GameSkill[]} sk List of all the learned skills.
*   @param {GameItem[]} equip List of the equiped weapons/armors.
*/
function GamePlayer(kind, id, instanceId, skills){
    this.k = kind;
    this.id = id;
    this.instid = instanceId;
    this.character = this.getCharacterInformations();

    var i, l = skills.length;
    this.sk = new Array(l);
    for (i = 0; i < l; i++){
        var skill = skills[i];
        this.sk[i] = new GameSkill(skill.id);
    }

    // Experience list
    this.expList = this.character.createExpList();

    this.levelingUp = false;
    this.testedLevelUp = true;
}

/** Get the max size of equipment kind names.
*   @static
*   @returns {number}
*/
GamePlayer.getEquipmentLength = function(){

    // Adding equipments
    var i, l = $datasGame.battleSystem.equipments.length - 1;
    var maxLength = 0;
    for (i = 0; i < l; i++){
        var text = new GraphicText($datasGame.battleSystem.equipments[i+1],
                                   Align.Left);
        text.updateContextFont();
        var c = $context.measureText(text.text).width;
        if (c > maxLength) maxLength = c;
    }

    return maxLength;
}

// -------------------------------------------------------

GamePlayer.prototype = {

    /** Get a compressed object for saving the character in a file.
    *   @returns {Object}
    */
    getSaveCharacter: function(){
        return {
            k: this.k,
            id: this.id,
            instid: this.instid,
            sk: this.sk,
            stats: this.getSaveStat(),
            equip: this.getSaveEquip()
        };
    },

    // -------------------------------------------------------

    /** Get a compressed object for saving the stats in a file.
    *   @returns {Object}
    */
    getSaveStat: function(){
        var i, l = $datasGame.battleSystem.statistics.length - 1;
        var list = new Array(l);
        for (i = 0; i < l; i++){
            var statistic = $datasGame.battleSystem.statistics[i+1];
            if (statistic.isFix)
                list[i] = this[statistic.abbreviation];
            else
                list[i] = [this[statistic.abbreviation],
                           this["max"+statistic.abbreviation]];
        }
        return list;
    },

    // -------------------------------------------------------

    /** Get a compressed object for saving the equipments in a file.
    *   @returns {Object}
    */
    getSaveEquip: function(){
        var i, l = this.equip.length - 1;
        var list = new Array(l);
        for (i = 0; i < l; i++){
            list[i] = $game.items.indexOf(this.equip[i+1]);
        }
        return list;
    },

    // -------------------------------------------------------

    /** Check if the character is dead.
    *   @returns {boolean}
    */
    isDead: function(){
        var b = (this.hp === 0); // Will be a script
        return b;
    },

    // -------------------------------------------------------

    /** Instanciate a character in a particular level.
    *   @param {number} level The level of the new character.
    */
    instanciate: function(level) {
        var skills, skill, statistics, statistic, statisticsProgression,
            statisticProgression, nonFixStatistics;
        var i, j, l, ll;

        // Skills
        this.sk = [];
        skills = this.character.getSkills();
        for (i = 0, l = skills.length; i < l; i++) {
            skill = skills[i];
            if (skill.level > level) {
                break;
            }
            this.sk.push(new GameSkill(skill.id));
        }

        // Stats
        statistics = $datasGame.battleSystem.statistics;
        statisticsProgression = this.character.getStatisticsProgression();
        nonFixStatistics = new Array;
        for (i = 1, l = statistics.length; i < l; i++) {
            statistic = statistics[i];

            // Default value
            this.initStatValue(statistic, 0);

            if (i === $datasGame.battleSystem.idLevelStatistic) {
                // Level
                this[statistic.abbreviation] = level;
            } else if (i === $datasGame.battleSystem.idExpStatistic) {
                // Experience
                this[statistic.abbreviation] = this.expList[level];
                this[statistic.getMaxAbbreviation()] = this.expList
                    [level + 1];
            } else {
                // Other stats
                for (j = 0, ll = statisticsProgression.length; j < ll; j++) {
                    statisticProgression = statisticsProgression[j];
                    if (statisticProgression.id === i) {
                        if (!statisticProgression.isFix) {
                            nonFixStatistics.push(statisticProgression);
                        } else {
                            this.initStatValue(statistic, statisticProgression
                                .getValueAtLevel(level, this));
                        }
                        break;
                    }
                }
            }
        }

        // Update formulas statistics
        for (i = 0, l = nonFixStatistics.length; i < l; i++) {
            for (j = 0; j < l; j++) {
                statisticProgression = nonFixStatistics[j];
                this.initStatValue(statistics[statisticProgression.id],
                    statisticProgression.getValueAtLevel(level, this));
            }
        }

        // Equip
        l = $datasGame.battleSystem.equipments.length;
        this.equip = new Array(l);
        for (i = 1; i < l; i++){
            this.equip[i] = null;
        }
    },

    // -------------------------------------------------------

    initStatValue: function(statistic, value) {
        this[statistic.abbreviation] = value
        if (!statistic.isFix) {
            this[statistic.getMaxAbbreviation()] = value;
        }
    },

    // -------------------------------------------------------

    updateStatValue: function(statistic, value, before) {
        var abr = statistic.isFix ? statistic.abbreviation : statistic
            .getMaxAbbreviation();
        if (!before) {
            this[statistic.getBeforeAbbreviation()] = this[abr];
        }
        this[abr] = value
    },

    // -------------------------------------------------------

    updateAllStatsValues: function() {
        var skills, skill, statistics, statistic, statisticsProgression,
            statisticProgression, nonFixStatistics, value, level;
        var i, j, l, ll;

        // Fix values : equipment influence etc
        level = this.getCurrentLevel();
        statistics = $datasGame.battleSystem.statistics;
        statisticsProgression = this.character.getStatisticsProgression();
        nonFixStatistics = new Array;
        for (i = 1, l = statistics.length; i < l; i++) {
            statistic = statistics[i];

            if (i !== $datasGame.battleSystem.idLevelStatistic & i !==
                $datasGame.battleSystem.idExpStatistic)
            {
                for (j = 0, ll = statisticsProgression.length; j < ll; j++) {
                    statisticProgression = statisticsProgression[j];
                    if (statisticProgression.id === i) {
                        if (!statisticProgression.isFix) {
                            nonFixStatistics.push(statisticProgression);
                        } else {
                            this.updateStatValue(statistic, statisticProgression
                                .getValueAtLevel(level, this));
                        }
                        break;
                    }
                }
            }
        }

        // Update formulas statistics
        for (i = 0, l = nonFixStatistics.length; i < l; i++) {
            for (j = 0; j < l; j++) {
                statisticProgression = nonFixStatistics[j];
                this.updateStatValue(statistics[statisticProgression.id],
                    statisticProgression.getValueAtLevel(level, this));
            }
        }
    },

    // -------------------------------------------------------

    getBarAbbreviation: function(stat) {
        return this[stat.abbreviation] + " / " + this[stat.getMaxAbbreviation()];
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the character and items.
    *   @param {object} json Json object describing the character.
    *   @param {Object} items Json object describing the items.
    */
    readJSON: function(json, items){

        // Stats
        var jsonStats = json.stats;
        var i, l = $datasGame.battleSystem.statistics.length;
        for (i = 1; i < l; i++){
            var statistic = $datasGame.battleSystem.statistics[i];
            var value = jsonStats[i-1];
            if (statistic.isFix){
                this[statistic.abbreviation] = value;
            }
            else{
                this[statistic.abbreviation] = value[0];
                this["max"+statistic.abbreviation] = value[1];
            }
        }

        // Equip
        l = $datasGame.battleSystem.equipments.length;
        this.equip = new Array(l);
        for (i = 1; i < l; i++){
            var item = items[json.equip[i-1]];
            if (typeof item === 'undefined') item = null;
            this.equip[i] = item;
        }
    },

    // -------------------------------------------------------

    /** Get the character informations system.
    *   @returns {SystemHero|SystemMonster}
    */
    getCharacterInformations: function(){
        switch (this.k){
        case CharacterKind.Hero:
            return $datasGame.heroes.list[this.id];
        case CharacterKind.Monster:
            return $datasGame.monsters.list[this.id];
        }

        return null;
    },

    // -------------------------------------------------------

    getCurrentLevel: function() {
        return this[$datasGame.battleSystem.getLevelStatistic().abbreviation];
    },

    // -------------------------------------------------------

    levelUp: function() {
        this[$datasGame.battleSystem.getLevelStatistic().abbreviation]++;

        // Update statistics
        this.updateAllStatsValues();
    },

    // -------------------------------------------------------

    getRewardExperience: function() {
        return this.character.getRewardExperience(this.getCurrentLevel());
    },

    // -------------------------------------------------------

    updateRemainingXP: function(fullTime) {
        if (this.getCurrentLevel() < this.expList.length - 1) {
            var current = this[$datasGame.battleSystem.getExpStatistic()
                .abbreviation];
            var max = this[$datasGame.battleSystem.getExpStatistic()
                .getMaxAbbreviation()];
            var xpForLvl = max - current;
            var dif = this.totalRemainingXP - xpForLvl;

            this.remainingXP = (dif > 0) ? xpForLvl : this.totalRemainingXP;
            this.totalRemainingXP -= this.remainingXP;
            this.totalTimeXP = Math.floor(this.remainingXP / (max - this.expList
                [this.getCurrentLevel()]) * fullTime);
        } else {
            this.remainingXP = 0;
            this.totalRemainingXP = 0;
            this.totalTimeXP = 0;
        }
        this.timeXP = new Date().getTime();
        this.obtainedXP = 0;
    },

    // -------------------------------------------------------

    updateObtainedExperience: function() {
        var xpAbbreviation = $datasGame.battleSystem.getExpStatistic()
            .abbreviation;
        var tick = new Date().getTime() - this.timeXP;
        if (tick >= this.totalTimeXP) {
            this[xpAbbreviation] = this[xpAbbreviation] + this.remainingXP -
                this.obtainedXP;
            this.remainingXP = 0;
            this.obtainedXP = 0;
        } else {
            var xp = Math.floor((tick / this.totalTimeXP * this.remainingXP)) -
                this.obtainedXP;
            this.obtainedXP += xp;
            this[xpAbbreviation] += xp;
        }
        this.testedLevelUp = false;
    },

    // -------------------------------------------------------

    updateExperience: function() {
        var xpAbbreviation = $datasGame.battleSystem.getExpStatistic()
            .abbreviation;
        var maxXPAbbreviation = $datasGame.battleSystem.getExpStatistic()
            .getMaxAbbreviation();
        var maxXP = this[maxXPAbbreviation];
        this.updateObtainedExperience();
        this.testedLevelUp = true;
        var dif = this[xpAbbreviation] - maxXP;
        if (dif >= 0) {
            var newMaxXP = this.expList[this.getCurrentLevel() + 2];
            var leveledUp = false;
            if (newMaxXP) { // Go to next level
                this[maxXPAbbreviation] = newMaxXP;
                this.levelUp();
                leveledUp = true;
            } else if (this.getCurrentLevel() < this.expList.length - 1) {
                this.levelUp();
                leveledUp = true;
            }
            this[xpAbbreviation] = maxXP;
            this.remainingXP = 0;
            this.obtainedXP = 0;

            return leveledUp;
        }

        return false;
    },

    // -------------------------------------------------------

    passExperience: function() {
        this.timeXP = this.totalTimeXP;
    },

    // -------------------------------------------------------

    pauseExperience: function() {
        this.totalTimeXP -= new Date().getTime() - this.timeXP;
        if (this.totalTimeXP < 0) {
            this.totalTimeXP = 0;
        }
        this.obtainedXP = 0;
    },

    // -------------------------------------------------------

    unpauseExperience: function() {
        this.timeXP = new Date().getTime();
    },

    // -------------------------------------------------------

    isExperienceUpdated: function() {
        return this.testedLevelUp && this.totalRemainingXP === 0 && this
            .remainingXP === 0;
    }
}
