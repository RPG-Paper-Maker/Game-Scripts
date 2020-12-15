/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Enum, Interpreter, Utils, Platform } from "../Common";
import CharacterKind = Enum.CharacterKind;
import { Datas, System, Graphic } from "..";
import { Skill } from "./Skill";
import { Item } from "./Item";

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
    
    public id: number;
    public kind: CharacterKind;
    public instid: number;
    public system: System.Hero;
    public name: string;
    public levelingUp: boolean;
    public sk: Skill[];
    public equip: Item[];
    public expList: number[];
    public testedLevelUp: boolean;
    public remainingXP: number;
    public totalRemainingXP: number;
    public totalTimeXP: number;
    public timeXP: number;
    public obtainedXP: number;

    constructor(kind?: CharacterKind, id?: number, instanceID?: number, skills?: 
        Skill[], json?: Record<string, any>)
    {
        if (!Utils.isUndefined(kind)) {
            this.kind = kind;
            this.id = id;
            this.instid = instanceID;
            this.system = this.getSystem();
            this.name = this.system.name;

            // Skills
            let l = skills.length;
            this.sk = new Array(l);
            let i: number;
            for (i = 0; i < l; i++) {
                this.sk[i] = new Skill(skills[i].id);
            }

            // Equip
            l = Datas.BattleSystems.maxEquipmentID;
            this.equip = new Array(l + 1);
            for (i = 1; i <= l; i++)
            {
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
    static getEquipmentLength(): number {
        // Adding equipments
        let maxLength = 0;
        let graphic: Graphic.Text;
        for (let i = 0, l = Datas.BattleSystems.equipmentsOrder.length - 1; i < 
            l; i++)
        {
            graphic = new Graphic.Text(Datas.BattleSystems.getEquipment(Datas
                .BattleSystems.equipmentsOrder[i+1]));
            graphic.updateContextFont();
            maxLength = Math.max(Platform.ctx.measureText(graphic.text).width, 
                maxLength);
        }
        return maxLength;
    }

    /** 
     *  Get the max size of equipment kind names.
     *  @static
     *  @param {number[]} values The values
     *  @returns {GamePlayer}
     */
    static getTemporaryPlayer(values?: number[]): Player {
        let player = new Player();
        let statistics = Datas.BattleSystems.statisticsOrder;
        for (let i = 0, l = statistics.length; i < l; i++) {
            player.initStatValue(Datas.BattleSystems.getStatistic(statistics[i])
                , values ? values[i] : 0);
        }
        return player;
    }

    /** 
     *  Get the player informations System.
     *  @returns {System.Hero}
     */
    getSystem(): System.Hero {
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
    getSaveStat(): number[] {
        let l = Datas.BattleSystems.statisticsOrder.length;
        let list = new Array(l);
        let statistic: System.Statistic;
        for (let i = 0; i < l; i++) {
            statistic = Datas.BattleSystems.getStatistic(i);
            list[i] = statistic.isFix ? [this[statistic.abbreviation], this[
                statistic.getBonusAbbreviation()]] : [this[statistic
                .abbreviation], this[statistic.getBonusAbbreviation()], this[
                statistic.getMaxAbbreviation()]];
        }
        return list;
    }

    /** 
     *  Get the equips for save character.
     *  @returns {number[][]}
     */
    getSaveEquip(): number[][] {
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
    isDead(): boolean {
        return Interpreter.evaluate(Datas.BattleSystems.formulaIsDead.getValue()
            , { user: this });
    }

    /** 
     *  Instanciate a character in a particular level.
     *  @param {number} level The level of the new character
     */
    instanciate(level: number) {
        // Skills
        this.sk = [];
        let skills = this.system.getSkills();
        let i: number, l: number, skill: System.ClassSkill;
        for (i = 0, l = skills.length; i < l; i++) {
            skill = skills[i];
            if (skill.level > level) {
                break;
            }
            this.sk.push(new Skill(skill.id));
        }

        // Stats
        let statistics = Datas.BattleSystems.statisticsOrder;
        let statisticsProgression = this.system.getStatisticsProgression();
        let nonFixStatistics = new Array;
        for (i = 0, l = statistics.length; i < l; i++) {
            this[Datas.BattleSystems.getStatistic(statistics[i])
                .getBeforeAbbreviation()] = undefined;
        }
        let j: number, m: number, statistic: System.Statistic, 
            statisticProgression: System.StatisticProgression;
        for (i = 0, l = statistics.length; i < l; i++) {
            statistic = Datas.BattleSystems.getStatistic(statistics[i]);

            // Default value
            this.initStatValue(statistic, 0);
            this[statistic.getBonusAbbreviation()] = 0;
            if (i === Datas.BattleSystems.idLevelStatistic) {
                // Level
                this[statistic.abbreviation] = level;
            } else if (i === Datas.BattleSystems.idExpStatistic) {
                // Experience
                this[statistic.abbreviation] = this.expList[level];
                this[statistic.getMaxAbbreviation()] = this.expList[level + 1];
            } else {
                // Other stats
                for (j = 0, m = statisticsProgression.length; j < m; j++) {
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
                this.initStatValue(Datas.BattleSystems.getStatistic(
                    statisticProgression.id), statisticProgression
                    .getValueAtLevel(level, this));
            }
        }
    }

    /** 
     *  Get the stats thanks to equipments.
     *  @param {System.Item} item The System item
     *  @param {number} equipmentID The equipment ID
     *  @returns {number[][]}
     */
    getEquipmentStatsAndBonus(item?: System.Item, equipmentID?: number): 
        number[][]
    {
        let statistics = Datas.BattleSystems.statisticsOrder;
        let l = statistics.length
        let list = new Array(l);
        let bonus = new Array(l);
        let i: number;
        for (i = 1; i < l; i++) {
            list[i] = null;
            bonus[i] = null;
        }
        let j: number, m: number, characteristics: System.Characteristic[], 
            characteristic: System.Characteristic, result: number[], statistic: 
            System.Statistic, base: number;
        for (j = 1, m = this.equip.length; j < m; j++) {
            if (j === equipmentID) {
                if (!item) {
                    continue;
                }
                characteristics = item.characteristics;
            } else {
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
                            statistic = Datas.BattleSystems.getStatistic(result[
                                0]);
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
        for (i = 1, l = statistics.length; i < l; i++) {
            if (list[i] === null) {
                list[i] = this[Datas.BattleSystems.getStatistic(statistics[i])
                    .getAbbreviationNext()];
            }
        }

        // Update formulas statistics
        let statisticsProgression = this.system.getStatisticsProgression();
        let previewPlayer = Player.getTemporaryPlayer(list);
        let statisticProgression: System.StatisticProgression;
        for (i = 0, l = statisticsProgression.length; i < l; i++) {
            for (j = 0; j < l; j++) {
                statisticProgression = statisticsProgression[j];
                list[statisticProgression.id] = statisticProgression
                    .getValueAtLevel(this.getCurrentLevel(), previewPlayer, this
                    .system.getProperty(System.Class.PROPERTY_FINAL_LEVEL)) +
                    bonus[statisticProgression.id];
                previewPlayer.initStatValue(Datas.BattleSystems.getStatistic(
                    statisticProgression.id), list[statisticProgression.id]);
            }
        }
        return [list, bonus];
    }

    /** 
     *  Update stats with equipment stats
     *  @param {number[]} list The stats list
     *  @param {number[]} bonus The bonus list
     */
    updateEquipmentStats(list?: number[], bonus?: number[]) {
        let result: number[][];
        if (!list || !bonus) {
            result = this.getEquipmentStatsAndBonus();
            list = result[0];
            bonus = result[1];
        }
        let statistics = Datas.BattleSystems.statisticsOrder;
        let statistic: System.Statistic, value: number;
        for (let i = 0, l = statistics.length; i < l; i++) {
            statistic = Datas.BattleSystems.getStatistic(statistics[i]);
            value = list[i];
            if (statistic.isFix) {
                this[statistic.abbreviation] = value;
            } else {
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
    }

    /**
     *  Initialize stat value.
     *  @param {System.Statistic} statistic The statistic
     *  @param {number} bonus The value
     */
    initStatValue(statistic: System.Statistic, value: number) {
        this[statistic.abbreviation] = value;
        if (!statistic.isFix) {
            this[statistic.getMaxAbbreviation()] = value;
        }
    }

    /** Update stats value.
     *  @param {System.Statistic} statistic The statistic
     *  @param {number} bonus The value
     */
    updateStatValue(statistic: System.Statistic, value: number) {
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
        let i: number, l: number;
        for (i = 0, l = statistics.length; i < l; i++) {
            this[Datas.BattleSystems.getStatistic(statistics[i])
                .getBeforeAbbreviation()] = undefined;
        }
        let j: number, m: number, statistic: System.Statistic, 
            statisticProgression: System.StatisticProgression;
        for (i = 0, l = statistics.length; i < l; i++) {
            statistic = Datas.BattleSystems.getStatistic(statistics[i]);
            if (i !== Datas.BattleSystems.idLevelStatistic && i !== Datas
                .BattleSystems.idExpStatistic)
            {
                for (j = 0, m = statisticsProgression.length; j < m; j++) {
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
                statistic = Datas.BattleSystems.getStatistic(
                    statisticProgression.id);
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
    getBarAbbreviation(stat: System.Statistic): string {
        return this[stat.abbreviation] + " / " + this[stat.getMaxAbbreviation()];
    }

    /** 
     *  Read the JSON associated to the character and items.
     *  @param {Record<string, any>} json Json object describing the items
    */
    read(json: Record<string, any>) {
        // Stats
        let jsonStats = json.stats;
        let i: number, l: number, statistic: System.Statistic, value: number[];
        for (i = 1, l = Datas.BattleSystems.statisticsOrder.length; i < l; i++) {
            statistic = Datas.BattleSystems.getStatistic(Datas.BattleSystems
                .statisticsOrder[i]);
            value = jsonStats[i-1];
            this[statistic.abbreviation] = value[0];
            this[statistic.getBonusAbbreviation()] = value[1];
            if (!statistic.isFix) {
                this[statistic.getMaxAbbreviation()] = value[2];
            }
        }

        // Equip
        l = Datas.BattleSystems.maxEquipmentID;
        this.equip = new Array(l + 1);
        let equip: number[], item: Item;
        for (i = 1; i <= l; i++) {
            equip = json.equip[i];
            if (equip) {
                item = Item.findItem(equip[0], equip[1]);
                if (item === null) {
                    item = new Item(equip[0], equip[1], equip[2]);
                }
            } else {
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
    getCurrentLevel(): number {
        return this[Datas.BattleSystems.getLevelStatistic().abbreviation];
    }

    /**
     *  Apply level up.
     */
    levelUp() {
        this[Datas.BattleSystems.getLevelStatistic().abbreviation]++;

        // Update statistics
        this.updateAllStatsValues();
    }

    /**
     *  Get the experience reward.
     *  @returns {number}
     */
    getRewardExperience(): number {
        return (<System.Monster> this.system).getRewardExperience(this
            .getCurrentLevel());
    }

    /** 
     *  Get the currencies reward.
     *  @returns {Record<string, any>}
     */
    getRewardCurrencies(): Record<string, number> {
        return (<System.Monster> this.system).getRewardCurrencies(this
            .getCurrentLevel());
    }

    /** 
     *  Get the loots reward.
     *  @returns {Record<string, any>[]}
     */
    getRewardLoots(): Record<string, any>[] {
        return (<System.Monster> this.system).getRewardLoots(this
            .getCurrentLevel());
    }

    /** 
     *  Update remaining xp according to full time.
     *  @param {number} fullTime Full time in milliseconds
     */
    updateRemainingXP(fullTime: number) {
        if (this.getCurrentLevel() < this.expList.length - 1) {
            let current = this[Datas.BattleSystems.getExpStatistic()
                .abbreviation];
            let max = this[Datas.BattleSystems.getExpStatistic()
                .getMaxAbbreviation()];
            let xpForLvl = max - current;
            let dif = this.totalRemainingXP - xpForLvl;
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
        } else {
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
    updateExperience(): boolean {
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
    isExperienceUpdated(): boolean {
        return this.testedLevelUp && this.totalRemainingXP === 0 && this
            .remainingXP === 0;
    }
}

export { Player }