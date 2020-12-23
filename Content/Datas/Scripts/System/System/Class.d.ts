import { Translatable } from "./Translatable";
import { StatisticProgression } from "./StatisticProgression";
import { ClassSkill } from "./ClassSkill";
/** @class
 *  A class of the game.
 *  @extends System.Translatable
 *  @extends System.Base
 *  @param {Record<string, any>} [json=undefined] Json object describing the
 *  class
 */
declare class Class extends Translatable {
    static PROPERTY_FINAL_LEVEL: string;
    static PROPERTY_EXPERIENCE_BASE: string;
    static PROPERTY_EXPERIENCE_INFLATION: string;
    initialLevel: number;
    finalLevel: number;
    experienceBase: number;
    experienceInflation: number;
    experienceTable: Record<string, any>;
    statisticsProgression: StatisticProgression[];
    skills: ClassSkill[];
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the class.
     *  @param {Record<string, any>} json Json object describing the class
     */
    read(json: Record<string, any>): void;
    /**
     *  Get property according to upClass.
     *  @param {string} prop The property name
     *  @param {System.Class} upClass The up class
     *  @returns {any}
     */
    getProperty(prop: string, upClass: Class): any;
    /**
     *  Get the experience table.
     *  @param {System.Class} upClass The up class
     *  @returns {Record<string, number>}
     */
    getExperienceTable(upClass: Class): Record<string, number>;
    /**
     *  Get the statistics progression.
     *  @param {System.Class} upClass The up class
     *  @returns {System.StatisticProgression[]}
     */
    getStatisticsProgression(upClass: Class): StatisticProgression[];
    /**
     *  Get the skills.
     *  @param {System.Class} upClass The up class
     *  @returns {System.ClassSkill[]}
     */
    getSkills(upClass: Class): ClassSkill[];
}
export { Class };
