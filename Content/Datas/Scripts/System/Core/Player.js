/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
/** @class
 *  A character in the team/hidden/reserve.
 *  @property {CharacterKind} k The kind of the character (hero or monster)
 *  @property {number} id The ID of the character
 *  @property {number} instid The instance id of the character
 *  @property {Hero} character The System character
 *  @property {string} name The character name
 *  @property {GameSkill[]} sk List of all the learned skills
 *  @property {GameItem[]} equip List of the equiped weapons/armors
 *  @property {number[]} expList The exp list for each level
 *  @property {boolean} levelingUp Indicate if leveling up
 *  @property {boolean} testedLevelUp Indicate if the level up was tested
 *  @param {CharacterKind} kind The kind of the character (hero or monster)
 *  @param {number} id The ID of the character
 *  @param {number} instanceID The instance id of the character
 *  @param {GameSkill[]} skills List of all the learned skills
 *  @param {object} [json=undefined] Json object describing the items
 */
class Player {
    constructor(kind, id, instanceID, skills, json) {
        /*
        if (!RPM.isUndefined(kind))
        {
            this.k = kind;
            this.id = id;
            this.instid = instanceID;
            this.character = this.getCharacterInformations();
            this.name = this.character.name;

            // Skills
            let l = skills.length;
            this.sk = new Array(l);
            let i;
            for (i = 0; i < l; i++)
            {
                this.sk[i] = new GameSkill(skills[i].id);
            }

            // Equip
            l = RPM.datasGame.battleSystem.maxEquipmentID;
            this.equip = new Array(l + 1);
            for (i = 1; i <= l; i++)
            {
                this.equip[i] = null;
            }

            // Experience list
            this.expList = this.character.createExpList();
            this.levelingUp = false;
            this.testedLevelUp = true;

            // Read if possible
            if (json)
            {
                this.read(json);
            }
        }
        */
    }
    // -------------------------------------------------------
    /** Get the max size of equipment kind names
    *   @static
    *   @returns {number}
    */
    static getEquipmentLength() {
        /*
        // Adding equipments
        let maxLength = 0;
        let text;
        for (let i = 0, l = RPM.datasGame.battleSystem.equipments.length - 1; i
            < l; i++)
        {
            text = new GraphicText(RPM.datasGame.battleSystem.equipments[i+1]);
            text.updateContextFont();
            maxLength = Math.max(Platform.ctx.measureText(text.text).width,
                maxLength);
        }
        return maxLength;
        */
    }
    // -------------------------------------------------------
    /** Get the max size of equipment kind names
    *   @static
    *   @param {number[]} values The values
    *   @returns {GamePlayer}
    */
    static getTemporaryPlayer(values) {
        /*
        let player = new GamePlayer();
        let statistics = RPM.datasGame.battleSystem.statistics;
        for (let i = 1, l = statistics.length; i < l; i++)
        {
            player.initStatValue(statistics[i], values ? values[i] : 0);
        }
        return player;
        */
    }
    // -------------------------------------------------------
    /** Get a compressed object for saving the character in a file
    *   @returns {Object}
    */
    getSaveCharacter() {
        /*
        return {
            k: this.k,
            id: this.id,
            instid: this.instid,
            sk: this.sk,
            stats: this.getSaveStat(),
            equip: this.getSaveEquip()
        };
        */
    }
    // -------------------------------------------------------
    /** Get the statistics for save character
    *   @returns {number[]}
    */
    getSaveStat() {
        /*
        let l = RPM.datasGame.battleSystem.statistics.length - 1;
        let list = new Array(l);
        let statistic;
        for (let i = 0; i < l; i++)
        {
            statistic = RPM.datasGame.battleSystem.statistics[i + 1];
            list[i] = statistic.isFix ? [this[statistic.abbreviation], this[
                statistic.getBonusAbbreviation()]] : [this[statistic
                .abbreviation], this[statistic.getBonusAbbreviation()], this[
                statistic.getMaxAbbreviation()]];
        }
        return list;
        */
    }
    // -------------------------------------------------------
    /** Get the equips for save character
    *   @returns {number[][]}
    */
    getSaveEquip() {
        /*
        let l = this.equip.length;
        let list = new Array(l);
        for (let i = 1; i < l; i++)
        {
            if (this.equip[i] !== null)
            {
                list[i] = [this.equip[i].k, this.equip[i].id, this.equip[i].nb];
            }
        }
        return list;
        */
    }
    // -------------------------------------------------------
    /** Check if the character is dead
    *   @returns {boolean}
    */
    isDead() {
        /*
        return RPM.evaluateFormula(RPM.datasGame.battleSystem.formulaIsDead
            .getValue(), this, null);
            */
    }
    // -------------------------------------------------------
    /** Instanciate a character in a particular level
    *   @param {number} level The level of the new character
    */
    instanciate(level) {
        /*
        // Skills
        this.sk = [];
        let skills = this.character.getSkills();
        let i, l, skill;
        for (i = 0, l = skills.length; i < l; i++)
        {
            skill = skills[i];
            if (skill.level > level)
            {
                break;
            }
            this.sk.push(new GameSkill(skill.id));
        }

        // Stats
        let statistics = RPM.datasGame.battleSystem.statistics;
        let statisticsProgression = this.character.getStatisticsProgression();
        let nonFixStatistics = new Array;
        for (i = 1, l = statistics.length; i < l; i++)
        {
            this[statistics[i].getBeforeAbbreviation()] = undefined;
        }
        let j, m, statistic, statisticProgression;
        for (i = 1, l = statistics.length; i < l; i++)
        {
            statistic = statistics[i];

            // Default value
            this.initStatValue(statistic, 0);
            this[statistic.getBonusAbbreviation()] = 0;

            if (i === RPM.datasGame.battleSystem.idLevelStatistic)
            {
                // Level
                this[statistic.abbreviation] = level;
            } else if (i === RPM.datasGame.battleSystem.idExpStatistic)
            {
                // Experience
                this[statistic.abbreviation] = this.expList[level];
                this[statistic.getMaxAbbreviation()] = this.expList[level + 1];
            } else
            {
                // Other stats
                for (j = 0, m = statisticsProgression.length; j < m; j++)
                {
                    statisticProgression = statisticsProgression[j];
                    if (statisticProgression.id === i)
                    {
                        if (!statisticProgression.isFix)
                        {
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
        for (i = 0, l = nonFixStatistics.length; i < l; i++)
        {
            for (j = 0; j < l; j++)
            {
                statisticProgression = nonFixStatistics[j];
                this.initStatValue(statistics[statisticProgression.id],
                    statisticProgression.getValueAtLevel(level, this));
            }
        }
        */
    }
    // -------------------------------------------------------
    /** Get the stats thanks to equipments
    *   @param {Item} item The System item
    *   @param {number} equipmentID The equipment ID
    *   @returns {number[][]}
    */
    getEquipmentStatsAndBonus(item, equipmentID) {
        /*
        let statistics = RPM.datasGame.battleSystem.statistics;
        let l = statistics.length
        let list = new Array(l);
        let bonus = new Array(l);
        let i;
        for (i = 1; i < l; i++)
        {
            list[i] = null;
            bonus[i] = null;
        }
        let j, m, characteristics, characteristic, result, statistic, base;
        for (j = 1, m = this.equip.length; j < m; j++)
        {
            if (j === equipmentID)
            {
                if (!item)
                {
                    continue;
                }
                characteristics = item.characteristics;
            } else
            {
                if (this.equip[j] === null)
                {
                    continue;
                }
                characteristics = this.equip[j].getItemInformations()
                    .characteristics;
            }
            if (characteristics)
            {
                for (i = 0, l = characteristics.length; i < l; i++)
                {
                    characteristic = characteristics[i];
                    result = characteristic.getNewStatValue(this);
                    if (result !== null)
                    {
                        if (list[result[0]] === null)
                        {
                            statistic = statistics[result[0]];
                            base = this[statistic.getAbbreviationNext()] - this[
                                statistic.getBonusAbbreviation()];
                            list[result[0]] = characteristic.operation ? 0 :
                                base;
                            bonus[result[0]] = characteristic.operation ? -base
                                : 0;
                        }
                        list[result[0]] += result[1];
                        bonus[result[0]] += result[1];
                    }
                }
            }
        }

        // Same values for not changed stats
        for (i = 1, l = statistics.length; i < l; i++)
        {
            if (list[i] === null)
            {
                list[i] = this[statistics[i].getAbbreviationNext()];
            }
        }

        // Update formulas statistics
        let statisticsProgression = this.character.getStatisticsProgression();
        let previewPlayer = GamePlayer.getTemporaryPlayer(list);
        let statisticProgression;
        for (i = 0, l = statisticsProgression.length; i < l; i++)
        {
            for (j = 0; j < l; j++)
            {
                statisticProgression = statisticsProgression[j];
                list[statisticProgression.id] = statisticProgression
                    .getValueAtLevel(this.getCurrentLevel(), previewPlayer, this
                    .character.getProperty(Class.PROPERTY_FINAL_LEVEL)) +
                    bonus[statisticProgression.id];
                previewPlayer.initStatValue(statistics[statisticProgression.id],
                    list[statisticProgression.id]);
            }
        }
        return [list, bonus];
        */
    }
    // -------------------------------------------------------
    /** Update stats with equipment stats
    *   @param {number[]} list The stats list
    *   @param {number[]} bonus The bonus list
    *   @returns {number[][]}
    */
    updateEquipmentStats(list, bonus) {
        /*
        let result;
        if (!list || !bonus)
        {
            result = this.getEquipmentStatsAndBonus();
            list = result[0];
            bonus = result[1];
        }
        let statistics = RPM.datasGame.battleSystem.statistics;
        let statistic, value;
        for (let i = 1, l = statistics.length; i < l; i++)
        {
            statistic = statistics[i];
            value = list[i];
            if (statistic.isFix)
            {
                this[statistic.abbreviation] = value;
            } else
            {
                this[statistic.getMaxAbbreviation()] = value;
                if (this[statistic.abbreviation] > this[statistic
                    .getMaxAbbreviation()])
                {
                    this[statistic.abbreviation] = this[statistic
                        .getMaxAbbreviation()];
                }
            }
            this[statistic.getBonusAbbreviation()] = bonus[i];
        }
        */
    }
    // -------------------------------------------------------
    /** Initialize stat value
    *   @param {SystemStatistic} statistic The statistic
    *   @param {number} bonus The value
    */
    initStatValue(statistic, value) {
        /*
        this[statistic.abbreviation] = value;
        if (!statistic.isFix)
        {
            this[statistic.getMaxAbbreviation()] = value;
        }
        */
    }
    // -------------------------------------------------------
    /** Update stats value
    *   @param {SystemStatistic} statistic The statistic
    *   @param {number} bonus The value
    */
    updateStatValue(statistic, value) {
        /*
        let abr = statistic.isFix ? statistic.abbreviation : statistic
            .getMaxAbbreviation();
        if (RPM.isUndefined(this[statistic.getBeforeAbbreviation()]))
        {
            this[statistic.getBeforeAbbreviation()] = this[abr];
        }
        this[abr] = value;
        this[statistic.getBonusAbbreviation()] = 0;
        */
    }
    // -------------------------------------------------------
    /** Update all the stats values
    */
    updateAllStatsValues() {
        /*
        // Fix values : equipment influence etc
        let level = this.getCurrentLevel();
        let statistics = RPM.datasGame.battleSystem.statistics;
        let statisticsProgression = this.character.getStatisticsProgression();
        let nonFixStatistics = new Array;
        let i, l;
        for (i = 1, l = statistics.length; i < l; i++)
        {
            this[statistics[i].getBeforeAbbreviation()] = undefined;
        }
        let j, m, statistic, statisticProgression;
        for (i = 1, l = statistics.length; i < l; i++)
        {
            statistic = statistics[i];
            if (i !== RPM.datasGame.battleSystem.idLevelStatistic & i !== RPM
                .datasGame.battleSystem.idExpStatistic)
            {
                for (j = 0, m = statisticsProgression.length; j < m; j++)
                {
                    statisticProgression = statisticsProgression[j];
                    if (statisticProgression.id === i)
                    {
                        if (!statisticProgression.isFix)
                        {
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
        for (i = 0, l = nonFixStatistics.length; i < l; i++)
        {
            for (j = 0; j < l; j++)
            {
                statisticProgression = nonFixStatistics[j];
                statistic = statistics[statisticProgression.id];
                this.updateStatValue(statistic, statisticProgression
                    .getValueAtLevel(level, this));
            }
        }

        this.updateEquipmentStats();
        */
    }
    // -------------------------------------------------------
    /** Get the bar abbreviation
    *   @param {SystemStatistic} stat The statistic
    */
    getBarAbbreviation(stat) {
        //return this[stat.abbreviation] + " / " + this[stat.getMaxAbbreviation()];
    }
    // -------------------------------------------------------
    /** Read the JSON associated to the character and items
    *   @param {object} json Json object describing the items
    */
    read(json) {
        /*
        // Stats
        let jsonStats = json.stats;
        let i, l, statistic, value;
        for (i = 1, l = RPM.datasGame.battleSystem.statistics.length; i < l; i++){
            statistic = RPM.datasGame.battleSystem.statistics[i];
            value = jsonStats[i-1];
            this[statistic.abbreviation] = value[0];
            this[statistic.getBonusAbbreviation()] = value[1];
            if (!statistic.isFix)
            {
                this[statistic.getMaxAbbreviation()] = value[2];
            }
        }

        // Equip
        l = RPM.datasGame.battleSystem.maxEquipmentID;
        this.equip = new Array(l + 1);
        let equip, item;
        for (i = 1; i <= l; i++)
        {
            equip = json.equip[i];
            if (equip)
            {
                item = GameItem.findItem(equip[0], equip[1]);
                if (item === null)
                {
                    item = new GameItem(equip[0], equip[1], equip[2]);
                }
            } else
            {
                item = null;
            }
            this.equip[i] = item;
        }
        this.updateEquipmentStats();
        */
    }
    // -------------------------------------------------------
    /** Get the character informations System
    *   @returns {Hero}
    */
    getCharacterInformations() {
        /*
        switch (this.k)
        {
        case CharacterKind.Hero:
            return RPM.datasGame.heroes.list[this.id];
        case CharacterKind.Monster:
            return RPM.datasGame.monsters.list[this.id];
        }
        return null;
        */
    }
    // -------------------------------------------------------
    /** Get the current level
    *   @returns {number}
    */
    getCurrentLevel() {
        //return this[RPM.datasGame.battleSystem.getLevelStatistic().abbreviation];
    }
    // -------------------------------------------------------
    /** Apply level up
    */
    levelUp() {
        /*
        this[RPM.datasGame.battleSystem.getLevelStatistic().abbreviation]++;

        // Update statistics
        this.updateAllStatsValues();
        */
    }
    // -------------------------------------------------------
    /** Get the experience reward
    *   @returns {number}
    */
    getRewardExperience() {
        //return this.character.getRewardExperience(this.getCurrentLevel());
    }
    // -------------------------------------------------------
    /** Get the currencies reward
    *   @returns {Object}
    */
    getRewardCurrencies() {
        //return this.character.getRewardCurrencies(this.getCurrentLevel());
    }
    // -------------------------------------------------------
    /** Get the loots reward
    *   @returns {Object[]}
    */
    getRewardLoots() {
        //return this.character.getRewardLoots(this.getCurrentLevel());
    }
    // -------------------------------------------------------
    /** Update remaining xp according to full time
    *   @param {number} fullTime Full time in milliseconds
    */
    updateRemainingXP(fullTime) {
        /*
        if (this.getCurrentLevel() < this.expList.length - 1)
        {
            let current = this[RPM.datasGame.battleSystem.getExpStatistic()
                .abbreviation];
            let max = this[RPM.datasGame.battleSystem.getExpStatistic()
                .getMaxAbbreviation()];
            let xpForLvl = max - current;
            let dif = this.totalRemainingXP - xpForLvl;
            this.remainingXP = (dif > 0) ? xpForLvl : this.totalRemainingXP;
            this.totalRemainingXP -= this.remainingXP;
            this.totalTimeXP = Math.floor(this.remainingXP / (max - this.expList
                [this.getCurrentLevel()]) * fullTime);
        } else
        {
            this.remainingXP = 0;
            this.totalRemainingXP = 0;
            this.totalTimeXP = 0;
        }
        this.timeXP = new Date().getTime();
        this.obtainedXP = 0;
        */
    }
    // -------------------------------------------------------
    /** Update obtained experience
    */
    updateObtainedExperience() {
        /*
        let xpAbbreviation = RPM.datasGame.battleSystem.getExpStatistic()
            .abbreviation;
        let tick = new Date().getTime() - this.timeXP;
        if (tick >= this.totalTimeXP)
        {
            this[xpAbbreviation] = this[xpAbbreviation] + this.remainingXP -
                this.obtainedXP;
            this.remainingXP = 0;
            this.obtainedXP = 0;
        } else
        {
            let xp = Math.floor((tick / this.totalTimeXP * this.remainingXP)) -
                this.obtainedXP;
            this.obtainedXP += xp;
            this[xpAbbreviation] += xp;
        }
        this.testedLevelUp = false;
        */
    }
    // -------------------------------------------------------
    /** Update experience and check if leveling up
    *   @returns {boolean}
    */
    updateExperience() {
        /*
        let xpAbbreviation = RPM.datasGame.battleSystem.getExpStatistic()
            .abbreviation;
        let maxXPAbbreviation = RPM.datasGame.battleSystem.getExpStatistic()
            .getMaxAbbreviation();
        let maxXP = this[maxXPAbbreviation];
        this.updateObtainedExperience();
        this.testedLevelUp = true;
        let dif = this[xpAbbreviation] - maxXP;
        if (dif >= 0)
        {
            let newMaxXP = this.expList[this.getCurrentLevel() + 2];
            let leveledUp = false;
            if (newMaxXP)
            {
                // Go to next level
                this[maxXPAbbreviation] = newMaxXP;
                this.levelUp();
                leveledUp = true;
            } else if (this.getCurrentLevel() < this.expList.length - 1)
            {
                this.levelUp();
                leveledUp = true;
            }
            this[xpAbbreviation] = maxXP;
            this.remainingXP = 0;
            this.obtainedXP = 0;
            return leveledUp;
        }
        return false;
        */
    }
    // -------------------------------------------------------
    /** Pass the progressive experience and directly update experience
    */
    passExperience() {
        //this.timeXP = this.totalTimeXP;
    }
    // -------------------------------------------------------
    /** Pause experience (when leveling up)
    */
    pauseExperience() {
        /*
        this.totalTimeXP -= new Date().getTime() - this.timeXP;
        if (this.totalTimeXP < 0)
        {
            this.totalTimeXP = 0;
        }
        this.obtainedXP = 0;
        */
    }
    // -------------------------------------------------------
    /** Unpause experience
    */
    unpauseExperience() {
        //this.timeXP = new Date().getTime();
    }
    // -------------------------------------------------------
    /** Check if experience is updated
    *   @returns {boolean}
    */
    isExperienceUpdated() {
        /*
        return this.testedLevelUp && this.totalRemainingXP === 0 && this
            .remainingXP === 0;
            */
    }
}
export { Player };
