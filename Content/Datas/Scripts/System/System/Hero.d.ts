import { Base } from "./Base";
import { Class } from "./Class";
import { StatisticProgression } from "./StatisticProgression";
import { ClassSkill } from "./ClassSkill";
/** @class
 *  An hero of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} [json=undefined] Json object describing the
 *  hero
 */
declare class Hero extends Base {
    name: string;
    idClass: number;
    idBattler: number;
    idFaceset: number;
    classInherit: Class;
    constructor(json: any);
    /**
     *  Read the JSON associated to the hero.
     *  @param {Record<string, any>} json Json object describing the hero
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the property according to class inherit and this hero.
     *  @param {string} prop The property name
     *  @returns {number}
     */
    getProperty(prop: string): any;
    /**
     *  Get the experience table according to class inherit and this hero.
     *  @returns {Record<string, any>}
     */
    getExperienceTable(): Record<string, any>;
    /**
     *  Get the statistics progression according to class inherit and this hero.
     *  @returns {System.StatisticProgression[]}
     */
    getStatisticsProgression(): StatisticProgression[];
    /**
     *  Get the skills according to class inherit and this hero.
     *  @returns {System.ClassSkill[]}
     */
    getSkills(): ClassSkill[];
    /**
     *  Create the experience list according to base and inflation.
     *  @returns {number[]}
     */
    createExpList(): number[];
}
export { Hero };
