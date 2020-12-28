/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum, Interpreter, Utils, Platform } from "../Common/index.js";
var CharacterKind = Enum.CharacterKind;
import { Datas, System, Graphic } from "../index.js";
import { Skill } from "./Skill.js";
import { Item } from "./Item.js";
/** @class
 *  A character in the team/hidden/reserve.
 *  @param {CharacterKind} [kind=undefined] The kind of the character (hero or monster)
 *  @param {number} [id=undefined] The ID of the character
 *  @param {number} [instanceID=undefined] The instance id of the character
 *  @param {Skill[]} [skills=undefined] List of all the learned skills
 *  @param {Record<string, any>} [json=undefined] Json object describing the items
 */
class Player {
    constructor(kind, id, instanceID, skills, name, json) {
        if (!Utils.isUndefined(kind)) {
            this.kind = kind;
            this.id = id;
            this.instid = instanceID;
            this.system = this.getSystem();
            this.name = Utils.isUndefined(name) ? this.system.name : name;
            // Skills
            let l = skills.length;
            this.sk = new Array(l);
            let i;
            for (i = 0; i < l; i++) {
                this.sk[i] = new Skill(skills[i].id);
            }
            // Equip
            l = Datas.BattleSystems.maxEquipmentID;
            this.equip = new Array(l + 1);
            for (i = 1; i <= l; i++) {
                this.equip[i] = null;
            }
            // Experience list
            this.expList = this.system.createExpList();
            this.levelingUp = false;
            this.testedLevelUp = true;
            // Read if possible
            if (json) {
                this.read(json);
            }
        }
    }
    /**
     *  Get the max size of equipment kind names.
     *  @static
     *  @returns {number}
    */
    static getEquipmentLength() {
        // Adding equipments
        let maxLength = 0;
        let graphic;
        for (let i = 0, l = Datas.BattleSystems.equipmentsOrder.length - 1; i <
            l; i++) {
            graphic = new Graphic.Text(Datas.BattleSystems.getEquipment(Datas
                .BattleSystems.equipmentsOrder[i + 1]));
            graphic.updateContextFont();
            maxLength = Math.max(Platform.ctx.measureText(graphic.text).width, maxLength);
        }
        return maxLength;
    }
    /**
     *  Get the max size of equipment kind names.
     *  @static
     *  @param {number[]} values The values
     *  @returns {GamePlayer}
     */
    static getTemporaryPlayer(values) {
        let player = new Player();
        let statistics = Datas.BattleSystems.statisticsOrder;
        for (let i = 0, l = statistics.length; i < l; i++) {
            player.initStatValue(Datas.BattleSystems.getStatistic(statistics[i]), values ? values[i] : 0);
        }
        return player;
    }
    /**
     *  Get the player informations System.
     *  @returns {System.Hero}
     */
    getSystem() {
        switch (this.kind) {
            case CharacterKind.Hero:
                return Datas.Heroes.get(this.id);
            case CharacterKind.Monster:
                return Datas.Monsters.get(this.id);
        }
    }
    /**
     *  Get a compressed object for saving the character in a file.
     *  @returns {Record<string, any>}
     */
    getSaveCharacter() {
        return {
            kind: this.kind,
            id: this.id,
            name: this.name,
            instid: this.instid,
            sk: this.sk,
            stats: this.getSaveStat(),
            equip: this.getSaveEquip()
        };
    }
    /**
     *  Get the statistics for save character.
     *  @returns {number[]}
     */
    getSaveStat() {
        let l = Datas.BattleSystems.statisticsOrder.length;
        let list = new Array(l);
        let statistic;
        for (let i = 0; i < l; i++) {
            let id = Datas.BattleSystems.statisticsOrder[i];
            statistic = Datas.BattleSystems.getStatistic(id);
            list[id] = statistic.isFix ? [this[statistic.abbreviation], this[statistic.getBonusAbbreviation()]] : [this[statistic
                    .abbreviation], this[statistic.getBonusAbbreviation()], this[statistic.getMaxAbbreviation()]];
        }
        return list;
    }
    /**
     *  Get the equips for save character.
     *  @returns {number[][]}
     */
    getSaveEquip() {
        let l = this.equip.length;
        let list = new Array(l);
        for (let i = 1; i < l; i++) {
            if (this.equip[i] !== null) {
                list[i] = [this.equip[i].kind, this.equip[i].id, this.equip[i]
                        .nb];
            }
        }
        return list;
    }
    /**
     *  Check if the character is dead.
     *  @returns {boolean}
     */
    isDead() {
        return Interpreter.evaluate(Datas.BattleSystems.formulaIsDead.getValue(), { user: this });
    }
    /**
     *  Instanciate a character in a particular level.
     *  @param {number} level The level of the new character
     */
    instanciate(level) {
        // Skills
        this.sk = this.system.getSkills(level);
        // Stats
        let statistics = Datas.BattleSystems.statisticsOrder;
        let statisticsProgression = this.system.getStatisticsProgression();
        let nonFixStatistics = new Array;
        let i, l;
        for (i = 0, l = statistics.length; i < l; i++) {
            this[Datas.BattleSystems.getStatistic(statistics[i])
                .getBeforeAbbreviation()] = undefined;
        }
        let j, m, statistic, statisticProgression;
        for (i = 0, l = statistics.length; i < l; i++) {
            let id = statistics[i];
            statistic = Datas.BattleSystems.getStatistic(id);
            // Default value
            this.initStatValue(statistic, 0);
            this[statistic.getBonusAbbreviation()] = 0;
            if (id === Datas.BattleSystems.idLevelStatistic) {
                // Level
                this[statistic.abbreviation] = level;
            }
            else if (id === Datas.BattleSystems.idExpStatistic) {
                // Experience
                this[statistic.abbreviation] = this.expList[level];
                this[statistic.getMaxAbbreviation()] = this.expList[level + 1];
            }
            else {
                // Other stats
                for (j = 0, m = statisticsProgression.length; j < m; j++) {
                    statisticProgression = statisticsProgression[j];
                    if (statisticProgression.id === id) {
                        if (!statisticProgression.isFix) {
                            nonFixStatistics.push(statisticProgression);
                        }
                        else {
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
                this.initStatValue(Datas.BattleSystems.getStatistic(statisticProgression.id), statisticProgression
                    .getValueAtLevel(level, this));
            }
        }
    }
    /**
     *  Get the stats thanks to equipments.
     *  @param {System.CommonSkillItem} item The System item
     *  @param {number} equipmentID The equipment ID
     *  @returns {number[][]}
     */
    getEquipmentStatsAndBonus(item, equipmentID) {
        let statistics = Datas.BattleSystems.statisticsOrder;
        let l = statistics.length;
        let list = new Array(l);
        let bonus = new Array(l);
        let i;
        for (i = 1; i < l; i++) {
            list[i] = null;
            bonus[i] = null;
        }
        let j, m, characteristics, characteristic, result, statistic, base;
        for (j = 1, m = this.equip.length; j < m; j++) {
            if (j === equipmentID) {
                if (!item) {
                    continue;
                }
                characteristics = item.characteristics;
            }
            else {
                if (this.equip[j] === null) {
                    continue;
                }
                characteristics = this.equip[j].getItemInformations()
                    .characteristics;
            }
            if (characteristics) {
                for (i = 0, l = characteristics.length; i < l; i++) {
                    characteristic = characteristics[i];
                    result = characteristic.getNewStatValue(this);
                    if (result !== null) {
                        if (list[result[0]] === null) {
                            statistic = Datas.BattleSystems.getStatistic(result[0]);
                            base = this[statistic.getAbbreviationNext()] - this[statistic.getBonusAbbreviation()];
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
        for (i = 0, l = statistics.length; i < l; i++) {
            let id = statistics[i];
            if (list[id] === null) {
                list[id] = this[Datas.BattleSystems.getStatistic(id)
                    .getAbbreviationNext()];
            }
        }
        // Update formulas statistics
        let statisticsProgression = this.system.getStatisticsProgression();
        let previewPlayer = Player.getTemporaryPlayer(list);
        let statisticProgression;
        for (i = 0, l = statisticsProgression.length; i < l; i++) {
            for (j = 0; j < l; j++) {
                statisticProgression = statisticsProgression[j];
                list[statisticProgression.id] = statisticProgression
                    .getValueAtLevel(this.getCurrentLevel(), previewPlayer, this
                    .system.getProperty(System.Class.PROPERTY_FINAL_LEVEL)) +
                    bonus[statisticProgression.id];
                previewPlayer.initStatValue(Datas.BattleSystems.getStatistic(statisticProgression.id), list[statisticProgression.id]);
            }
        }
        return [list, bonus];
    }
    /**
     *  Update stats with equipment stats
     *  @param {number[]} list The stats list
     *  @param {number[]} bonus The bonus list
     */
    updateEquipmentStats(list, bonus) {
        let result;
        if (!list || !bonus) {
            result = this.getEquipmentStatsAndBonus();
            list = result[0];
            bonus = result[1];
        }
        let statistics = Datas.BattleSystems.statisticsOrder;
        let statistic, value;
        for (let i = 0, l = statistics.length; i < l; i++) {
            let id = statistics[i];
            statistic = Datas.BattleSystems.getStatistic(id);
            value = list[id];
            if (statistic.isFix) {
                this[statistic.abbreviation] = value;
            }
            else {
                this[statistic.getMaxAbbreviation()] = value;
                if (this[statistic.abbreviation] > this[statistic
                    .getMaxAbbreviation()]) {
                    this[statistic.abbreviation] = this[statistic
                        .getMaxAbbreviation()];
                }
            }
            this[statistic.getBonusAbbreviation()] = bonus[id];
        }
    }
    /**
     *  Initialize stat value.
     *  @param {System.Statistic} statistic The statistic
     *  @param {number} bonus The value
     */
    initStatValue(statistic, value) {
        this[statistic.abbreviation] = value;
        if (!statistic.isFix) {
            this[statistic.getMaxAbbreviation()] = value;
        }
    }
    /** Update stats value.
     *  @param {System.Statistic} statistic The statistic
     *  @param {number} bonus The value
     */
    updateStatValue(statistic, value) {
        let abr = statistic.isFix ? statistic.abbreviation : statistic
            .getMaxAbbreviation();
        if (Utils.isUndefined(this[statistic.getBeforeAbbreviation()])) {
            this[statistic.getBeforeAbbreviation()] = this[abr];
        }
        this[abr] = value;
        this[statistic.getBonusAbbreviation()] = 0;
    }
    /**
     *  Update all the stats values.
     */
    updateAllStatsValues() {
        // Fix values : equipment influence etc
        let level = this.getCurrentLevel();
        let statistics = Datas.BattleSystems.statisticsOrder;
        let statisticsProgression = this.system.getStatisticsProgression();
        let nonFixStatistics = new Array;
        let i, l;
        for (i = 0, l = statistics.length; i < l; i++) {
            this[Datas.BattleSystems.getStatistic(statistics[i])
                .getBeforeAbbreviation()] = undefined;
        }
        let j, m, statistic, statisticProgression;
        for (i = 0, l = statistics.length; i < l; i++) {
            let id = statistics[i];
            statistic = Datas.BattleSystems.getStatistic(id);
            if (id !== Datas.BattleSystems.idLevelStatistic && id !== Datas
                .BattleSystems.idExpStatistic) {
                for (j = 0, m = statisticsProgression.length; j < m; j++) {
                    statisticProgression = statisticsProgression[j];
                    if (statisticProgression.id === id) {
                        if (!statisticProgression.isFix) {
                            nonFixStatistics.push(statisticProgression);
                        }
                        else {
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
                statistic = Datas.BattleSystems.getStatistic(statisticProgression.id);
                this.updateStatValue(statistic, statisticProgression
                    .getValueAtLevel(level, this));
            }
        }
        this.updateEquipmentStats();
    }
    /**
     *  Get the bar abbreviation.
     *  @param {System.Statistic} stat The statistic
     *  @returns {string}
     */
    getBarAbbreviation(stat) {
        return this[stat.abbreviation] + " / " + this[stat.getMaxAbbreviation()];
    }
    /**
     *  Read the JSON associated to the character and items.
     *  @param {Record<string, any>} json Json object describing the items
    */
    read(json) {
        // Stats
        let jsonStats = json.stats;
        let i, l, statistic, value;
        for (i = 0, l = Datas.BattleSystems.statisticsOrder.length; i < l; i++) {
            let id = Datas.BattleSystems.statisticsOrder[i];
            statistic = Datas.BattleSystems.getStatistic(id);
            value = jsonStats[id];
            if (value) {
                this[statistic.abbreviation] = value[0];
                this[statistic.getBonusAbbreviation()] = value[1];
                if (!statistic.isFix) {
                    this[statistic.getMaxAbbreviation()] = value[2];
                }
            }
        }
        // Equip
        l = Datas.BattleSystems.maxEquipmentID;
        this.equip = new Array(l + 1);
        let equip, item;
        for (i = 1; i <= l; i++) {
            equip = json.equip[i];
            if (equip) {
                item = Item.findItem(equip[0], equip[1]);
                if (item === null) {
                    item = new Item(equip[0], equip[1], equip[2]);
                }
            }
            else {
                item = null;
            }
            this.equip[i] = item;
        }
        this.updateEquipmentStats();
    }
    /**
     *  Get the current level.
     *  @returns {number}
     */
    getCurrentLevel() {
        return this[Datas.BattleSystems.getLevelStatistic().abbreviation];
    }
    /**
     *  Apply level up.
     */
    levelUp() {
        // Change lvl stat
        this[Datas.BattleSystems.getLevelStatistic().abbreviation]++;
        // Update statistics
        this.updateAllStatsValues();
        // Update skills learned
        this.learnSkills();
    }
    /**
     *  Learn new skills (on level up).
     */
    learnSkills() {
        this.sk = this.sk.concat(this.system.getLearnedSkills(this[Datas
            .BattleSystems.getLevelStatistic().abbreviation]));
    }
    /**
     *  Get the experience reward.
     *  @returns {number}
     */
    getRewardExperience() {
        return this.system.getRewardExperience(this
            .getCurrentLevel());
    }
    /**
     *  Get the currencies reward.
     *  @returns {Record<string, any>}
     */
    getRewardCurrencies() {
        return this.system.getRewardCurrencies(this
            .getCurrentLevel());
    }
    /**
     *  Get the loots reward.
     *  @returns {Record<string, Item>[]}
     */
    getRewardLoots() {
        return this.system.getRewardLoots(this
            .getCurrentLevel());
    }
    /**
     *  Update remaining xp according to full time.
     *  @param {number} fullTime Full time in milliseconds
     */
    updateRemainingXP(fullTime) {
        if (this.getCurrentLevel() < this.expList.length - 1) {
            let current = this[Datas.BattleSystems.getExpStatistic()
                .abbreviation];
            let max = this[Datas.BattleSystems.getExpStatistic()
                .getMaxAbbreviation()];
            let xpForLvl = max - current;
            let dif = this.totalRemainingXP - xpForLvl;
            this.remainingXP = (dif > 0) ? xpForLvl : this.totalRemainingXP;
            this.totalRemainingXP -= this.remainingXP;
            this.totalTimeXP = Math.floor(this.remainingXP / (max - this.expList[this.getCurrentLevel()]) * fullTime);
        }
        else {
            this.remainingXP = 0;
            this.totalRemainingXP = 0;
            this.totalTimeXP = 0;
        }
        this.timeXP = new Date().getTime();
        this.obtainedXP = 0;
    }
    /**
     *  Update obtained experience.
     */
    updateObtainedExperience() {
        let xpAbbreviation = Datas.BattleSystems.getExpStatistic().abbreviation;
        let tick = new Date().getTime() - this.timeXP;
        if (tick >= this.totalTimeXP) {
            this[xpAbbreviation] = this[xpAbbreviation] + this.remainingXP -
                this.obtainedXP;
            this.remainingXP = 0;
            this.obtainedXP = 0;
        }
        else {
            let xp = Math.floor((tick / this.totalTimeXP * this.remainingXP)) -
                this.obtainedXP;
            this.obtainedXP += xp;
            this[xpAbbreviation] += xp;
        }
        this.testedLevelUp = false;
    }
    /**
     *  Update experience and check if leveling up.
     *  @returns {boolean}
     */
    updateExperience() {
        let xpAbbreviation = Datas.BattleSystems.getExpStatistic()
            .abbreviation;
        let maxXPAbbreviation = Datas.BattleSystems.getExpStatistic()
            .getMaxAbbreviation();
        let maxXP = this[maxXPAbbreviation];
        this.updateObtainedExperience();
        this.testedLevelUp = true;
        let dif = this[xpAbbreviation] - maxXP;
        if (dif >= 0) {
            let newMaxXP = this.expList[this.getCurrentLevel() + 2];
            let leveledUp = false;
            if (newMaxXP) {
                // Go to next level
                this[maxXPAbbreviation] = newMaxXP;
                this.levelUp();
                leveledUp = true;
            }
            else if (this.getCurrentLevel() < this.expList.length - 1) {
                this.levelUp();
                leveledUp = true;
            }
            this[xpAbbreviation] = maxXP;
            this.remainingXP = 0;
            this.obtainedXP = 0;
            return leveledUp;
        }
        return false;
    }
    /**
     *  Pass the progressive experience and directly update experience.
     */
    passExperience() {
        this.timeXP = this.totalTimeXP;
    }
    /**
     *  Pause experience (when leveling up).
     */
    pauseExperience() {
        this.totalTimeXP -= new Date().getTime() - this.timeXP;
        if (this.totalTimeXP < 0) {
            this.totalTimeXP = 0;
        }
        this.obtainedXP = 0;
    }
    /**
     *  Unpause experience.
     */
    unpauseExperience() {
        this.timeXP = new Date().getTime();
    }
    /**
     *  Check if experience is updated.
     *  @returns {boolean}
     */
    isExperienceUpdated() {
        return this.testedLevelUp && this.totalRemainingXP === 0 && this
            .remainingXP === 0;
    }
}
export { Player };
