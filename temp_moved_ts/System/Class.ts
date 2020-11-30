/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {ClassSkill, Lang, StatisticProgression} from ".";
import {RPM} from "../Core";

/** @class
 *   A class of the game
 *   @extends SystemLang
 *   @property {string} [Class.PROPERTY_FINAL_LEVEL="finalLevel"] The
 *   final level string property
 *   @property {string} [Class.PROPERTY_EXPERIENCE_BASE="experienceBase"]
 *   The experience base property
 *   @property {string} [Class.PROPERTY_EXPERIENCE_INFLATION="experienceInflation"]
 *   The experience inflation property
 *   @property {number} initialLevel The initial level
 *   @property {number} finalLevel The final level
 *   @property {number} experienceBase The experience base
 *   @property {number} experienceInflation The experience inflation
 *   @property {Object} experienceTable The experience table
 *   @property {SystemStatisticProgression[]} statisticsProgression The
 *   statistics progression
 *   @property {SystemClassSkill[]} skills The skills to learn of the class
 *   @param {Object} [json=undefined] Json object describing the class
 */
export class Class extends Lang {

    static PROPERTY_FINAL_LEVEL = "finalLevel";
    static PROPERTY_EXPERIENCE_BASE = "experienceBase";
    static PROPERTY_EXPERIENCE_INFLATION = "experienceInflation";

    initialLevel: number;
    finalLevel: number;
    experienceBase: number;
    experienceInflation: number;
    experienceTable: Record<string, any>;
    statisticsProgression: StatisticProgression[]
    skills: ClassSkill[]


    constructor(json) {
        super(json);
    }

    public setup() {
        super.setup();
        this.initialLevel = 0;
        this.finalLevel =0;
        this.experienceBase =0;
        this.experienceInflation =0 ;
        this.experienceTable = {};
        this.statisticsProgression = null;
        this.skills = null;
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the class
     *   @param {Object} json Json object describing the class
     */
    read(json) {
        super.read(json);

        this.initialLevel = RPM.defaultValue(json.iniL, -1);
        this.finalLevel = RPM.defaultValue(json.mxL, -1);
        this.experienceBase = RPM.defaultValue(json.eB, -1);
        this.experienceInflation = RPM.defaultValue(json.eI, -1);
        this.experienceTable = {};
        let jsonExperienceTable = json.eT;
        var i, l;
        if (jsonExperienceTable) {
            for (i = 0, l = jsonExperienceTable.length; i < l; i++) {
                this.experienceTable[jsonExperienceTable[i].k] =
                    jsonExperienceTable[i].v;
            }
        }

        // Statistic progression
        this.statisticsProgression = RPM.readJSONSystemListByIndex(RPM
            .defaultValue(json.stats, []), StatisticProgression);

        // Skills
        this.skills = RPM.readJSONSystemListByIndex(RPM
            .defaultValue(json.skills, []), ClassSkill);
    }

    // -------------------------------------------------------
    /** Get property according to upClass
     *   @param {string} prop The property name
     *   @param {Class} upClass The up class
     *   @returns {any}
     */
    getProperty(prop, upClass) {
        return upClass[prop] === -1 ? this[prop] : upClass[prop];
    }

    // -------------------------------------------------------
    /** Get the experience table
     *   @param {Class} upClass The up class
     *   @returns {Object}
     */
    getExperienceTable(upClass) {
        let list = {};
        let level;
        for (level in this.experienceTable) {
            list[level] = this.experienceTable[level];
        }
        for (level in upClass.experienceTable) {
            list[level] = upClass.experienceTable[level];
        }
        return list;
    }

    // -------------------------------------------------------
    /** Get the statistics progression
     *   @param {Class} upClass The up class
     *   @returns {SystemStatisticProgression[]}
     */
    getStatisticsProgression(upClass) {
        let list = [];
        let i, l;
        for (i = 0, l = this.statisticsProgression.length; i < l; i++) {
            list.push(this.statisticsProgression[i]);
        }
        let j, m, checked;
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

    // -------------------------------------------------------
    /** Get the skills
     *   @param {Class} upClass The up class
     *   @returns {SystemClassSkill[]}
     */
    getSkills(upClass) {
        return this.skills.concat(upClass.skills);
    }
}