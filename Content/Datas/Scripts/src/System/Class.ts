/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Translatable } from "./Translatable";
import { StatisticProgression } from "./StatisticProgression";
import { ClassSkill } from "./ClassSkill";
import { Utils } from "../Common";

/** @class
 *  A class of the game.
 *  @extends System.Translatable
 *  @extends System.Base
 *  @param {Record<string, any>} [json=undefined] Json object describing the 
 *  class
 */
class Class extends Translatable {

    public static PROPERTY_FINAL_LEVEL = "finalLevel";
    public static PROPERTY_EXPERIENCE_BASE = "experienceBase";
    public static PROPERTY_EXPERIENCE_INFLATION = "experienceInflation";

    public initialLevel: number;
    public finalLevel: number;
    public experienceBase: number;
    public experienceInflation: number;
    public experienceTable: Record<string, any>;
    public statisticsProgression: StatisticProgression[];
    public skills: ClassSkill[];

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Read the JSON associated to the class.
     *  @param {Record<string, any>} json Json object describing the class
     */
    read(json: Record<string, any>) {
        super.read(json);

        this.initialLevel = Utils.defaultValue(json.iniL, -1);
        this.finalLevel = Utils.defaultValue(json.mxL, -1);
        this.experienceBase = Utils.defaultValue(json.eB, -1);
        this.experienceInflation = Utils.defaultValue(json.eI, -1);
        this.experienceTable = {};
        let jsonExperienceTable = json.eT;
        var i: number, l: number;
        if (jsonExperienceTable) {
            for (i = 0, l = jsonExperienceTable.length; i < l; i++) {
                this.experienceTable[jsonExperienceTable[i].k] =
                    jsonExperienceTable[i].v;
            }
        }

        // Statistic progression
        this.statisticsProgression = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.stats, []), 
            listIndexes: this.statisticsProgression, cons: StatisticProgression });

        // Skills
        this.skills = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.skills, []), 
            listIndexes: this.skills, cons: ClassSkill });
    }

    /** 
     *  Get property according to upClass.
     *  @param {string} prop The property name
     *  @param {System.Class} upClass The up class
     *  @returns {any}
     */
    getProperty(prop: string, upClass: Class): any {
        return upClass[prop] === -1 ? this[prop] : upClass[prop];
    }

    /** 
     *  Get the experience table.
     *  @param {System.Class} upClass The up class
     *  @returns {Record<string, number>}
     */
    getExperienceTable(upClass: Class): Record<string, number> {
        let list = {};
        let level: string;
        for (level in this.experienceTable) {
            list[level] = this.experienceTable[level];
        }
        for (level in upClass.experienceTable) {
            list[level] = upClass.experienceTable[level];
        }
        return list;
    }

    /** 
     *  Get the statistics progression.
     *  @param {System.Class} upClass The up class
     *  @returns {System.StatisticProgression[]}
     */
    getStatisticsProgression(upClass: Class): StatisticProgression[] {
        let list = [];
        let i: number, l: number;
        for (i = 0, l = this.statisticsProgression.length; i < l; i++) {
            list.push(this.statisticsProgression[i]);
        }
        let j: number, m: number, checked: boolean;
        for (i = 0, l = upClass.statisticsProgression.length; i < l; i++) {
            checked = false;
            for (j = 0, m = this.statisticsProgression.length; j < m; j++) {
                if (upClass.statisticsProgression[i].id === this
                    .statisticsProgression[j].id) {
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
    }

    /** 
     *  Get the skills.
     *  @param {System.Class} upClass The up class
     *  @returns {System.ClassSkill[]}
     */
    getSkills(upClass: Class): ClassSkill[] {
        return this.skills.concat(upClass.skills);
    }
}

export { Class }