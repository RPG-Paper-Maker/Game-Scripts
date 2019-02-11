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
        var i, j, l;

        // Skills
        this.sk = [];
        var character = $datasGame.heroes.list[this.id];
        var skills = $datasGame.classes.list[character.idClass].skills;
        for (i = 0, l = skills.length; i < l; i++){
            var skill = skills[i];
            if (skill.level > level) break;

            this.sk.push(new GameSkill(skill.id));
        }

        // Stats
        l = $datasGame.battleSystem.statistics.length;
        character = this.getCharacterInformations();
        var cl = $datasGame.classes.list[character.idClass];
        var ll = cl.statisticsProgression.length;
        for (i = 1; i < l; i++){
            var statistic = $datasGame.battleSystem.statistics[i];
            this[statistic.abbreviation] = 0;
            if (!statistic.isFix)
                this["max" + statistic.abbreviation] = 0;

            if (i === $datasGame.battleSystem.idLevelStatistic)
                this[statistic.abbreviation] = cl.initialLevel;
            else if (i === $datasGame.battleSystem.idExpStatistic) {
                this[statistic.abbreviation] = this.expList[cl.initialLevel];
                this["max" + statistic.abbreviation] = this.expList[cl
                    .initialLevel + 1];
            }
            else{
                for (j = 0; j < ll; j++){
                    var statProgress = cl.statisticsProgression[j];
                    if (statProgress.id === i){
                        this[statistic.abbreviation] =
                                                     statProgress.initialValue;
                        if (!statistic.isFix)
                            this["max" + statistic.abbreviation] =
                                                     statProgress.initialValue;
                    }
                }
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

        // TODO
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
            this.totalTimeXP = Math.floor(this.remainingXP / (max - this.expList[this
                .getCurrentLevel()]) * fullTime);
        } else {
            this.remainingXP = 0;
            this.totalRemainingXP = 0;
            this.totalTimeXP = 0;
        }
        this.timeXP = new Date().getTime();
        this.obtainedXP = 0;
    },

    // -------------------------------------------------------

    updateExperience: function() {
        var xpAbbreviation = $datasGame.battleSystem.getExpStatistic()
            .abbreviation;
        var maxXPAbbreviation = $datasGame.battleSystem.getExpStatistic()
            .getMaxAbbreviation();
        var maxXP = this[maxXPAbbreviation];
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
            if (xp < 0) {
                var a = 0;
            }
        }
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
        return this.totalRemainingXP === 0 && this.remainingXP === 0;
    }
}
