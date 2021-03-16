import { Class } from "./Class.js";
import { System } from "../index.js";
import { StatisticProgression } from "./StatisticProgression.js";
import { Skill } from "../Core/index.js";
import { Translatable } from "./Translatable.js";
/** @class
 *  An hero of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  hero
 */
declare class Hero extends Translatable {
    idClass: number;
    idBattler: number;
    idFaceset: number;
    classInherit: Class;
    constructor(json: any);
    /**
     *  Read the JSON associated to the hero.
     *  @param {Record<string, any>} - json Json object describing the hero
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the property according to class inherit and this hero.
     *  @param {string} prop - The property name
     *  @returns {number}
     */
    getProperty(prop: string): any;
    /**
     *  Get the experience table according to class inherit and this hero.
     *  @returns {Record<string, any>}
     */
    getExperienceTable(): Record<string, any>;
    /**
     *  Get the characteristics according to class inherit and this hero.
     *  @returns {System.Characteristic[]}
     */
    getCharacteristics(): System.Characteristic[];
    /**
     *  Get the statistics progression according to class inherit and this hero.
     *  @returns {System.StatisticProgression[]}
     */
    getStatisticsProgression(): StatisticProgression[];
    /**
     *  Get the skills according to class inherit and this hero.
     *  @param {number} level
     *  @returns {Skill[]}
     */
    getSkills(level: number): Skill[];
    /**
     *  Get the learned skill at a specific level according to class inherit and
     *  this hero.
     *  @param {number} level
     *  @returns {Skill[]}
     */
    getLearnedSkills(level: number): Skill[];
    /**
     *  Create the experience list according to base and inflation.
     *  @returns {number[]}
     */
    createExpList(): number[];
}
export { Hero };
