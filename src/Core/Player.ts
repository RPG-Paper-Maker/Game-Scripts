/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Enum, Interpreter, Utils, Platform, Mathf } from "../Common";
import { Datas, System, Graphic, Core } from "../index";
import { Skill } from "./Skill";
import { Item } from "./Item";
import { Battler } from "./Battler";
import { Status } from "./Status";

/** @class
 *  A character in the team/hidden/reserve.
 *  @param {CharacterKind} [kind=undefined] - The kind of the character (hero or monster)
 *  @param {number} [id=undefined] - The ID of the character
 *  @param {number} [instanceID=undefined] - The instance id of the character
 *  @param {Skill[]} [skills=undefined] - List of all the learned skills
 *  @param {Record<string, any>} - [json=undefined] Json object describing the items
 */
class Player {
    
    public static MAX_STATUS_DISPLAY_TOP: number = 3;

    public id: number;
    public kind: Enum.CharacterKind;
    public instid: number;
    public system: System.Hero;
    public name: string;
    public levelingUp: boolean;
    public skills: Skill[];
    public equip: Item[];
    public status: Status[];
    public expList: number[];
    public editedExpList: Record<string, number>;
    public testedLevelUp: boolean;
    public remainingXP: number;
    public totalRemainingXP: number;
    public totalTimeXP: number;
    public timeXP: number;
    public obtainedXP: number;
    public stepLevelUp: number;
    public battler: Battler;
    public statusRes: Record<string, number>[];
    public experienceGain: Record<string, number>[];
    public currencyGain: Record<string, number>[];
    public skillCostRes: Record<string, number>[];
    public changedClass: System.Class;
    public elements: System.DynamicValue[];
    public battlerID: number = null;
    public facesetID: number = null;
    public facesetIndexX: number = null;
    public facesetIndexY: number = null;

    constructor(kind?: Enum.CharacterKind, id?: number, instanceID?: number, skills?: 
        Record<string, any>[], status?: Record<string, any>[], name?: string, 
        json?: Record<string, any>)
    {
        if (!Utils.isUndefined(kind)) {
            this.kind = kind;
            this.id = id;
            this.instid = instanceID;
            this.system = this.getSystem();
            this.name = Utils.isUndefined(name) ? this.system.name() : name;

            // Skills
            this.skills = [];
            let i: number, l: number;
            for (i = 0, l = skills.length; i < l; i++) {
                this.skills[i] = new Skill(skills[i].id);
            }

            // Equip
            l = Datas.BattleSystems.maxEquipmentID;
            this.equip = new Array(l + 1);
            for (i = 1, l = Datas.BattleSystems.maxEquipmentID; i <= l; i++) {
                this.equip[i] = null;
            }

            // Status
            this.status = [];
            let element: Record<string, any>;
            for (i = 0, l = status.length; i < l; i++) {
                element = status[i];
                this.status[i] = new Status(element.id, element.turn);
            }

            // Elements
            this.updateElements();

            // Experience list
            this.editedExpList = {};
            this.levelingUp = false;
            this.testedLevelUp = true;

            // Read if possible
            if (json) {
                this.read(json);
            } else {
                this.expList = this.system.createExpList(undefined);
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
                .BattleSystems.equipmentsOrder[i+1]).name());
            graphic.updateContextFont();
            maxLength = Math.max(Platform.ctx.measureText(graphic.text).width, 
                maxLength);
        }
        return maxLength;
    }

    /** 
     *  Get the max size of equipment kind names.
     *  @static
     *  @param {number[]} values - The values
     *  @returns {GamePlayer}
     */
    static getTemporaryPlayer(values?: number[]): Player {
        let player = new Player();
        let statistics = Datas.BattleSystems.statisticsOrder;
        for (let i = 0, l = statistics.length; i < l; i++) {
            player.initStatValue(Datas.BattleSystems.getStatistic(statistics[i]), 
                values ? values[statistics[i]] : 0);
        }
        return player;
    }

    /** 
     *  Apply callback with all the heroes.
     *  @param {Player[]} tab - The heroes list
     *  @param {Function} callback - The callback
     *  @returns {boolean}
     */
    static allTheHeroes(tab: Player[], callback: Function): boolean {
        for (let i = 0, l = tab.length; i < l; i++) {
            if (!callback.call(this, tab[i])) {
                return false;
            }
        }
        return true;
    }

    /** 
     *  Apply callback with none of the heroes.
     *  @param {Player[]} tab - The heroes list
     *  @param {Function} callback - The callback
     *  @returns {boolean}
     */
    static noneOfTheHeroes(tab: Player[], callback: Function): boolean {
        for (let i = 0, l = tab.length; i < l; i++) {
            if (callback.call(this, tab[i])) {
                return false;
            }
        }
        return true;
    }

    /** 
     *  Apply callback with at least one hero.
     *  @param {Player[]} tab - The heroes list
     *  @param {Function} callback - The callback
     *  @returns {boolean}
     */
    static atLeastOneHero(tab: Player[], callback: Function): boolean {
        for (let i = 0, l = tab.length; i < l; i++) {
            if (callback.call(this, tab[i])) {
                return true;
            }
        }
        return false;
    }

    /** 
     *  Apply callback with the hero with instance ID.
     *  @param {Player[]} tab - The heroes list
     *  @param {number} id - The hero instance id
     *  @param {Function} callback - The callback
     *  @returns {boolean}
     */
    static theHeroeWithInstanceID(tab: Player[], id: number, callback: Function): 
        boolean
    {
        let hero: Player;
        for (let i = 0, l = tab.length; i < l; i++) {
            hero = tab[i];
            if (hero.instid === id && !callback.call(this, hero)) {
                return false;
            }
        }
        return true;
    }

    /** 
     *  Apply callback according to heroes selection.
     *  @param {Player[]} tab - The heroes list
     *  @param {Function} callback - The callback
     *  @returns {boolean}
    */
    static applySelection(selectionKind: Enum.ConditionHeroesKind, tab: Player[], 
        instanceID: number, callback: Function): boolean {
        switch (selectionKind) {
            case Enum.ConditionHeroesKind.AllTheHeroes:
                return Player.allTheHeroes(tab, callback);
            case Enum.ConditionHeroesKind.NoneOfTheHeroes:
                return Player.noneOfTheHeroes(tab, callback);
            case Enum.ConditionHeroesKind.AtLeastOneHero:
                return Player.atLeastOneHero(tab, callback);
            case Enum.ConditionHeroesKind.TheHeroeWithInstanceID:
                return Player.theHeroeWithInstanceID(tab, instanceID, callback);
        }
    }

    /** 
     *  Get the player informations System.
     *  @returns {System.Hero}
     */
    getSystem(): System.Hero {
        switch (this.kind) {
            case Enum.CharacterKind.Hero:
                return Datas.Heroes.get(this.id);
            case Enum.CharacterKind.Monster:
                return Datas.Monsters.get(this.id);
        }
    }

    /** 
     *  Get a compressed object for saving the character in a file.
     *  @returns {Record<string, any>}
     */
    getSaveCharacter(): Record<string, any> {
        // Status
        let statusList = [];
        let i: number, l: number, status: Status;
        for (i = 0, l = this.status.length; i < l; i++) {
            status = this.status[i];
            statusList[i] = {
                id: status.system.id,
                turn: status.turn
            };
        }
        return {
            kind: this.kind,
            id: this.id,
            name: this.name,
            instid: this.instid,
            sk: this.skills,
            status: statusList,
            stats: this.getSaveStat(),
            equip: this.getSaveEquip(),
            exp: this.editedExpList,
            class: this.changedClass ? this.changedClass.id : undefined,
            battler: this.battlerID,
            face: this.facesetID,
            faceX: this.facesetIndexX,
            faceY: this.facesetIndexY
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
            let id = Datas.BattleSystems.statisticsOrder[i];
            statistic = Datas.BattleSystems.getStatistic(id);
            list[id] = statistic.isFix ? [this[statistic.abbreviation], this[
                statistic.getBonusAbbreviation()], this[statistic
                .getAddedAbbreviation()]] : [this[statistic.abbreviation], this
                [statistic.getBonusAbbreviation()], this[statistic
                .getMaxAbbreviation()], this[statistic.getAddedAbbreviation()]];
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
                list[i] = [this.equip[i].kind, this.equip[i].system.id, this
                    .equip[i].nb];
            }
        }
        return list;
    }

    /** 
     *  Check if the character is dead.
     *  @returns {boolean}
     */
    isDead(): boolean {
        return Interpreter.evaluate(Datas.BattleSystems.formulaIsDead.getValue(), { user: this });
    }

    /** 
     *  Instanciate a character in a particular level.
     *  @param {number} level - The level of the new character
     */
    instanciate(level: number) {
        // Skills
        this.skills = this.system.getSkills(level, this.changedClass);

        // Begin equipment / elements
        let characteristics = this.system.getCharacteristics(this.changedClass);
        this.elements = [];
        let i: number, l: number, characteristic: System.Characteristic, kind: 
            Enum.ItemKind, itemID: number, item: Item;
        for (i = 0, l = characteristics.length; i < l; i++) {
            characteristic = characteristics[i];
            if (characteristic.kind === Enum.CharacteristicKind.BeginEquipment) {
                kind = characteristic.isBeginWeapon ? Enum.ItemKind.Weapon :
                    Enum.ItemKind.Armor;
                itemID = characteristic.beginWeaponArmorID.getValue();
                item = Item.findItem(kind, itemID);
                if (item) {
                    item.nb++;
                } else {
                    item = new Item(kind, itemID, 0);
                }
                this.equip[characteristic.beginEquipmentID.getValue()] = item;
            } else if (characteristic.kind === Enum.CharacteristicKind.Element) {
                this.elements.push(characteristic.elementID);
            }
        }

        // Stats
        let statistics = Datas.BattleSystems.statisticsOrder;
        let statisticsProgression = this.system.getStatisticsProgression(this
            .changedClass);
        let nonFixStatistics = new Array;
        for (i = 0, l = statistics.length; i < l; i++) {
            this[Datas.BattleSystems.getStatistic(statistics[i])
                .getBeforeAbbreviation()] = undefined;
        }
        let j: number, m: number, statistic: System.Statistic, 
            statisticProgression: System.StatisticProgression;
        for (i = 0, l = statistics.length; i < l; i++) {
            let id = statistics[i];
            statistic = Datas.BattleSystems.getStatistic(id);

            // Default value
            this.initStatValue(statistic, 0);
            this[statistic.getBonusAbbreviation()] = 0;
            this[statistic.getAddedAbbreviation()] = 0;
            if (id === Datas.BattleSystems.idLevelStatistic) {
                // Level
                this[statistic.abbreviation] = level;
            } else if (id === Datas.BattleSystems.idExpStatistic) {
                // Experience
                this[statistic.abbreviation] = this.expList[level];
                this[statistic.getMaxAbbreviation()] = this.expList[level + 1];
            } else {
                // Other stats
                for (j = 0, m = statisticsProgression.length; j < m; j++) {
                    statisticProgression = statisticsProgression[j];
                    if (statisticProgression.id === id) {
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
        this.updateAllStatsValues();
    }

    /** 
     *  Get the stats thanks to equipments.
     *  @param {System.CommonSkillItem} item - The System item
     *  @param {number} equipmentID - The equipment ID
     *  @returns {number[][]}
     */
    getEquipmentStatsAndBonus(item?: System.CommonSkillItem, equipmentID?: 
        number): [number[], number[], Record<string, any>]
    {
        let statistics = Datas.BattleSystems.statisticsOrder;
        let l = Datas.BattleSystems.maxStatisticID;
        let list = new Array(l + 1);
        let bonus = new Array(l + 1);
        let added = new Array(l + 1);
        let res: Record<string, any> = {
            statusRes: [],
            experienceGain: [],
            currencyGain: [],
            skillCostRes: []
        };
        let i: number;
        for (i = 1; i < l + 1; i++) {
            list[i] = null;
            bonus[i] = null;
            added[i] = null;
        }

        // Equipment
        let j: number, m: number, characteristics: System.Characteristic[], 
            statistic: System.Statistic;
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
                characteristics = this.equip[j].system.characteristics;
            }
            if (characteristics) {
                this.updateCharacteristics(characteristics, list, bonus, res);
            }
        }

        // Status
        for (j = 0, m = this.status.length; j < m; j++) {
            characteristics = this.status[j].system.characteristics;
            if (characteristics) {
                this.updateCharacteristics(characteristics, list, bonus, res);
            }
        }

        // Class and hero characteristics
        this.updateCharacteristics(this.system.getCharacteristics(this.changedClass), 
            list, bonus, res);

        // Same values for not changed stats and added stats
        let id: number;
        for (i = 0, l = statistics.length; i < l; i++) {
            id = statistics[i];
            statistic = Datas.BattleSystems.getStatistic(id);
            if (list[id] === null) {
                list[id] = this[statistic.getAbbreviationNext()];
            }
            added[id] = this[statistic.getAddedAbbreviation()];
            list[id] += added[id];
        }

        // Update formulas statistics
        let statisticsProgression = this.system.getStatisticsProgression(this
            .changedClass);
        let previewPlayer = Player.getTemporaryPlayer(list);
        let statisticProgression: System.StatisticProgression;
        for (i = 0, l = statisticsProgression.length; i < l; i++) {
            for (j = 0; j < l; j++) {
                statisticProgression = statisticsProgression[j];
                list[statisticProgression.id] = statisticProgression
                    .getValueAtLevel(this.getCurrentLevel(), previewPlayer, this
                    .system.getProperty(System.Class.PROPERTY_FINAL_LEVEL, this
                    .changedClass)) + bonus[statisticProgression.id] + added[
                    statisticProgression.id];
                previewPlayer.initStatValue(Datas.BattleSystems.getStatistic(
                    statisticProgression.id), list[statisticProgression.id]);
            }
        }
        return [list, bonus, res];
    }

    /** 
     *  Update stats according to charactersitics.
     *  @param {number[]} characteristics - The characteristics list
     *  @param {number[]} list - The stats list
     *  @param {number[]} bonus - The bonus list
     */
    updateCharacteristics(characteristics: System.Characteristic[], list: 
        number[], bonus: number[], res: Record<string, any>) {
        let characteristic: System.Characteristic, statistic: System.Statistic, 
            base: number;
        for (let i = 0, l = characteristics.length; i < l; i++) {
            characteristic = characteristics[i];
            if (characteristic.kind === Enum.CharacteristicKind.IncreaseDecrease) {
                switch (characteristic.increaseDecreaseKind) {
                    case Enum.IncreaseDecreaseKind.StatValue:
                    case Enum.IncreaseDecreaseKind.ElementRes:
                        let result = characteristic.getNewStatValue(this);
                        if (result !== null) {
                            if (list[result[0]] === null) {
                                statistic = Datas.BattleSystems.getStatistic(result[0]);
                                base = this[statistic.getAbbreviationNext()] - this[statistic
                                    .getBonusAbbreviation()];
                                list[result[0]] = characteristic.operation ? 0 : base;
                                bonus[result[0]] = characteristic.operation ? -base : 0;
                            }
                            list[result[0]] += result[1];
                            bonus[result[0]] += result[1];
                        }
                        break;
                    default:
                        characteristic.setIncreaseDecreaseValues(res);
                        break;
                }
            } else if (characteristic.kind === Enum.CharacteristicKind.Script) {
                characteristic.executeScript(this);
            }
        }
    }

    /** 
     *  Update stats with equipment stats
     *  @param {number[]} list - The stats list
     *  @param {number[]} bonus - The bonus list
     */
    updateEquipmentStats(list?: number[], bonus?: number[], res?: Record<string, any>) {
        if (!list || !bonus || !res) {
            let result = this.getEquipmentStatsAndBonus();
            list = result[0];
            bonus = result[1];
            res = result[2];
        }
        let statistics = Datas.BattleSystems.statisticsOrder;
        let statistic: System.Statistic, value: number;
        for (let i = 0, l = statistics.length; i < l; i++) {
            let id = statistics[i];
            statistic = Datas.BattleSystems.getStatistic(id);
            value = list[id];
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
            this[statistic.getBonusAbbreviation()] = bonus[id];
        }
        this.statusRes = res.statusRes;
        this.experienceGain = res.experienceGain;
        this.currencyGain = res.currencyGain;
        this.skillCostRes = res.skillCostRes;
    }

    /**
     *  Initialize stat value.
     *  @param {System.Statistic} statistic - The statistic
     *  @param {number} bonus - The value
     */
    initStatValue(statistic: System.Statistic, value: number) {
        this[statistic.abbreviation] = value;
        if (!statistic.isFix) {
            this[statistic.getMaxAbbreviation()] = value;
        }
    }

    /** Update stats value.
     *  @param {System.Statistic} statistic - The statistic
     *  @param {number} bonus - The value
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
        let statisticsProgression = this.system.getStatisticsProgression(this
            .changedClass);
        let nonFixStatistics = new Array;
        let i: number, l: number;
        for (i = 0, l = statistics.length; i < l; i++) {
            this[Datas.BattleSystems.getStatistic(statistics[i])
                .getBeforeAbbreviation()] = undefined;
        }
        let j: number, m: number, statistic: System.Statistic, 
            statisticProgression: System.StatisticProgression;
        for (i = 0, l = statistics.length; i < l; i++) {
            let id = statistics[i];
            statistic = Datas.BattleSystems.getStatistic(id);
            if (id !== Datas.BattleSystems.idLevelStatistic && id !== Datas
                .BattleSystems.idExpStatistic)
            {
                for (j = 0, m = statisticsProgression.length; j < m; j++) {
                    statisticProgression = statisticsProgression[j];
                    if (statisticProgression.id === id) {
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

        // Update equipment stats + characteristics
        this.statusRes = [];
        this.updateEquipmentStats();
    }

    /** 
     *  Get the bar abbreviation.
     *  @param {System.Statistic} stat - The statistic
     *  @returns {string}
     */
    getBarAbbreviation(stat: System.Statistic): string {
        return this[stat.abbreviation] + " / " + this[stat.getMaxAbbreviation()];
    }

    /** 
     *  Read the JSON associated to the character and items.
     *  @param {Record<string, any>} - json Json object describing the items
    */
    read(json: Record<string, any>) {

        // Stats
        let jsonStats = json.stats;
        let i: number, l: number, statistic: System.Statistic, value: number[];
        for (i = 0, l = Datas.BattleSystems.statisticsOrder.length; i < l; i++) {
            let id = Datas.BattleSystems.statisticsOrder[i];
            statistic = Datas.BattleSystems.getStatistic(id);
            value = jsonStats[id];
            if (value) {
                this[statistic.abbreviation] = value[0];
                this[statistic.getBonusAbbreviation()] = value[1];
                if (!statistic.isFix) {
                    this[statistic.getMaxAbbreviation()] = value[2];
                    this[statistic.getAddedAbbreviation()] = value[3];
                } else {
                    this[statistic.getAddedAbbreviation()] = value[2];
                }
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

        // Exp list
        this.changedClass = json.class ? Datas.Classes.get(json.class) : undefined;
        this.expList = this.system.createExpList(this.changedClass);
        for (let i in json.exp) {
            this.expList[i] = json.exp[i];
        }

        // Faceset and battler
        this.facesetID = Utils.defaultValue(json.face, null);
        this.facesetIndexX = Utils.defaultValue(json.faceX, null);
        this.facesetIndexY = Utils.defaultValue(json.faceY, null);
        this.battlerID = Utils.defaultValue(json.battler, null);

        this.updateAllStatsValues();
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
        let newSkills = this.system.getLearnedSkills(this[Datas.BattleSystems
            .getLevelStatistic().abbreviation], this.changedClass);

        // If already added, remove
        for (let skill of newSkills) {
            this.removeSkill(skill.id);
        }

        this.skills = this.skills.concat(newSkills);
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
     *  @returns {Record<string, Item>[]}
     */
    getRewardLoots(): Record<string, Item>[] {
        return (<System.Monster> this.system).getRewardLoots(this
            .getCurrentLevel());
    }

    /** 
     *  Update remaining xp according to full time.
     *  @param {number} fullTime - Full time in milliseconds
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
        this.remainingXP -= this.obtainedXP;
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

    /** 
     *  Synchronize experience if level was manually updated with a command.
     */
    synchronizeExperience() {
        let statistic = Datas.BattleSystems.getExpStatistic();
        let level = this.getCurrentLevel();
        this[statistic.abbreviation] = this.expList[level];
        this[statistic.getMaxAbbreviation()] = this.expList[level + 1];
    }

    /** 
     *  Synchronize level if experience was manually updated with a command.
     */
    synchronizeLevel() {
        let expStatistic = Datas.BattleSystems.getExpStatistic();
        let exp = this[expStatistic.abbreviation];
        let finalLevel = this.expList.length - 1;
        for (; finalLevel >= 1; finalLevel--) {
            if (exp >= this.expList[finalLevel]) {
                break;
            }
        }
        this[expStatistic.getMaxAbbreviation()] = this.expList[finalLevel + 1];
        while (this.getCurrentLevel() < finalLevel) {
            this.levelUp();
        }
    }

    /** 
     *  Check if player has status with ID.
     *  @param {number} id 
     *  @returns {boolean}
     */
    hasStatus(id: number): boolean {
        for (let status of this.status) {
            if (status.id === id) {
                return true;
            }
        }
        return false;
    }

    /** 
     *  Get the first status to display according to priority.
     *  @returns {Core.Status[]}
     */
    getFirstStatus(): Status[] {
        let statusList: Status[] = [];
        let status: Status;
        for (let c = 0, i = 0; i < Player.MAX_STATUS_DISPLAY_TOP; i++) {
            status = this.status[i];
            if (status) {
                if (status.system.pictureID !== -1) {
                    c++;
                    statusList.push(status);
                }
            } else {
                break;
            }
        }
        return statusList;
    }

    /** 
     *  Add a new status and check if already in.
     *  @param {number} id - The status id to add
     *  @returns {Core.Status}
     */
    addStatus(id: number): Status {
        let status = new Status(id);
        let priority = status.system.priority.getValue();
        let i: number, s: Status, p: number;
        for (i = this.status.length - 1; i >= 0; i--) {
            s = this.status[i];
            // If same id, don't add
            if (s.system.id === id) {
                return null;
            }
        }
        for (i = this.status.length - 1; i >= 0; i--) {
            // Add according to priority
            p = s.system.priority.getValue();
            if (s <= priority) {
                break;
            }
        }
        this.status.splice(i < 0 ? 0 : 0, 0, status);
        this.updateAllStatsValues();
        return status;
    }

    /** 
     *  Remove the status.
     *  @param {number} id - The status id to remove
     *  @returns {Core.Status}
     */
    removeStatus(id: number): Status {
        let i: number, s: Status;
        for (i = this.status.length - 1; i >= 0; i--) {
            s = this.status[i];
            // If same id, remove
            if (s.system.id === id) {
                this.status.splice(i, 1);
                this.updateAllStatsValues();
                return s;
            }
        }
        return null;
    }

    /** 
     *  Remove the status with release at end battle option.
     */
    removeEndBattleStatus() {
        let test = false;
        let s: Status;
        for (let i = this.status.length - 1; i >= 0; i--) {
            s = this.status[i];
            if (s.system.isReleaseAtEndBattle) {
                this.status.splice(i, 1);
                test = true;
            }
        }
        // If at least one removed, update stats
        if (test) {
            this.updateAllStatsValues();
        }
    }

    /** 
     *  Remove the status with release after attacked option.
     */
    removeAfterAttackedStatus(battler: Battler) {
        let test = false;
        let s: Status;
        for (let i = this.status.length - 1; i >= 0; i--) {
            s = this.status[i];
            if (s.system.isReleaseAfterAttacked && Mathf.randomPercentTest(s.system
                .chanceReleaseAfterAttacked.getValue())) {
                s = this.status[0];
                this.status.splice(i, 1);
                battler.updateStatusStep();
                battler.updateAnimationStatus(s);
                test = true;
            }
        }
        if (test) {
            this.updateAllStatsValues();
        }
    }

    /** 
     *  Remove the status with release at start turn option.
     */
    removeStartTurnStatus(listStill: Status[]): Status[] {
        let listHealed: Status[] = [];
        let test = false;
        let j: number, m: number, s: Status, release: System.StatusReleaseTurn,
            testRelease: boolean;
        for (let i = this.status.length - 1; i >= 0; i--) {
            s = this.status[i];
            testRelease = false;
            if (s.system.isReleaseStartTurn) {
                testRelease = false;
                for (j = 0, m = s.system.releaseStartTurn.length; j < m; j++) {
                    release = s.system.releaseStartTurn[j];
                    if (Mathf.OPERATORS_COMPARE[release.operationTurnKind](s.turn, 
                        release.turn.getValue()) && Mathf.randomPercentTest(
                        release.chance.getValue())) {
                        this.status.splice(i, 1);
                        listHealed.push(s);
                        test = true;
                        testRelease = true;
                        break;
                    }
                }
            }
            if (!testRelease) {
                listStill.push(s);
            }
        }
        if (test) {
            this.updateAllStatsValues();
        }
        return listHealed;
    }

    /** 
     *  Update each status turn.
     */
    updateStatusTurn() {
        for (let i = this.status.length - 1; i >= 0; i--) {
            this.status[i].turn++;
        }
    }

    /** 
     *  Get the best weapon armor to replace for shops.
     *  @param {System.CommonSkillItem}
     *  @returns {[number, number, number[][]]}
     */
    getBestWeaponArmorToReplace(weaponArmor: System.CommonSkillItem): [number, 
        number, [number[], number[], Record<string, any>]] {
        let equipments = weaponArmor.getType().equipments;
        let baseResult = this.getEquipmentStatsAndBonus();
        let baseBonus = 0;
        let id: string;
        for (id in baseResult[1]) {
            baseBonus += baseResult[1][id] === null ? 0 : baseResult[1][id];
        }
        let totalBonus: number = 0, bestResult: [number[], number[], Record<
            string, any>], result: [number[], number[], Record<string, any>], 
            bestBonus: number, bestEquipmentID: number;
        for (let equipmentID = equipments.length - 1; equipmentID >= 1; equipmentID--) {
            if (equipments[equipmentID]) {
                result = this.getEquipmentStatsAndBonus(weaponArmor, equipmentID);
                totalBonus = 0;
                for (id in baseResult[1]) {
                    totalBonus += result[1][id] === null ? 0 : result[1][id];
                }
                if (Utils.isUndefined(bestBonus) || bestBonus < totalBonus) {
                    bestBonus = totalBonus;
                    bestResult = result;
                    bestEquipmentID = equipmentID;
                }
            }
        }
        return [bestBonus - baseBonus, bestEquipmentID, bestResult];
    }

    /** 
     *  Add a skill id if not existing yet.
     *  @param {number} id
     */
    addSkill(id: number) {
        let index = Utils.indexOfProp(this.skills, "id", id);
        if (index === -1) {
            this.skills.push(new Skill(id));
        }
    }

    /** 
     *  Remove a skill id if existing.
     *  @param {number} id
     */
    removeSkill(id: number) {
        let index = Utils.indexOfProp(this.skills, "id", id);
        if (index !== -1) {
            this.skills.splice(index, 1);
        }
    }

    /** 
     *  Get characteristics.
     *  @returns {System.Characteristic[]}
     */
    getCharacteristics(): System.Characteristic[] {
        let characteristics = this.system.getCharacteristics(this.changedClass);
        // Also add weapons and armors
        for (let equipment of this.equip) {
            if (equipment) {
                characteristics = characteristics.concat(equipment
                    .system.characteristics);
            }
        }
        return characteristics;
    }

    /** 
     *  Get player class (depends on if it was changed).
     *  @returns {System.Characteristic[]}
     */
    getClass(): System.Class {
        return Utils.defaultValue(this.changedClass, this.system.class);
    }

    /** 
     *  Update the elements list according to characteristics.
     */
    updateElements() {
        this.elements = [];
        const characteristics = this.system.getCharacteristics(this.changedClass);
        for (let characteristic of characteristics) {
            if (characteristic.kind === Enum.CharacteristicKind.Element) {
                this.elements.push(characteristic.elementID);
            }
        }
    }

    /** 
     *  Get battler ID from system, or another if modified with change graphics.
     *  @returns {number}
     */
    getBattlerID(): number {
        return this.battlerID === null ? this.system.idBattler : this.battlerID;
    }

    /** 
     *  Get faceset ID from system, or another if modified with change graphics.
     *  @returns {number}
     */
    getFacesetID(): number {
        return this.facesetID === null ? this.system.idFaceset : this.facesetID;
    }

    /** 
     *  Get faceset index x from system, or another if modified with change graphics.
     *  @returns {number}
     */
    getFacesetIndexX(): number {
        return this.facesetIndexX === null ? this.system.indexXFaceset : this.facesetIndexX;
    }

    /** 
     *  Get faceset index y from system, or another if modified with change graphics.
     *  @returns {number}
     */
    getFacesetIndexY(): number {
        return this.facesetIndexY === null ? this.system.indexYFaceset : this.facesetIndexY;
    }

    /** 
     *  Check if player can equip this weapon or armor.
     *  @param {Core.Item} weaponArmor
     *  @returns {boolean}
     */
    canEquipWeaponArmor(weaponArmor: Item): boolean {
        let characteristics = this.getCharacteristics();
        for (let characteristic of characteristics) {
            if (characteristic.kind === Enum.CharacteristicKind
                .AllowForbidEquip && ((weaponArmor.kind === Enum.ItemKind
                .Weapon && characteristic.isAllowEquipWeapon && 
                weaponArmor.system.type === characteristic.equipWeaponTypeID
                .getValue()) || (weaponArmor.kind === Enum.ItemKind.Armor 
                && !characteristic.isAllowEquipWeapon && 
                weaponArmor.system.type === characteristic.equipArmorTypeID
                .getValue())) && !characteristic.isAllowEquip) {
                return false;
            }
            if (characteristic.kind === Enum.CharacteristicKind.AllowForbidChange 
                && !characteristic.isAllowChangeEquipment) {
                let type = weaponArmor.kind === Enum.ItemKind.Weapon ? Datas
                    .BattleSystems.getWeaponKind(weaponArmor.system.type) : Datas
                    .BattleSystems.getArmorKind(weaponArmor.system.type);
                if (type.equipments[characteristic.changeEquipmentID.getValue()]) {
                    return false;
                }
            }
        }
        return true;
    }
}

export { Player }