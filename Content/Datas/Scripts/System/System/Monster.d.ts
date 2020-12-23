import { Hero } from "./Hero";
import { ProgressionTable } from "./ProgressionTable";
import { Loot } from "./Loot";
import { MonsterAction } from "./MonsterAction";
interface StructReward {
    xp: ProgressionTable;
    currencies: ProgressionTable[];
    loots: Loot[];
    actions: MonsterAction[];
}
/** @class
 *  A monster of the game.
 *  @extends System.Hero
 *  @param {Record<string, any>} [json=undefined] Json object describing the
 *  monster
 */
declare class Monster extends Hero {
    rewards: StructReward;
    actions: MonsterAction[];
    constructor(json?: Record<string, any>);
    /** Read the JSON associated to the monster.
     *  @param {Record<string, any>} json Json object describing the monster
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the experience reward.
     *  @param {number} level The monster level
     *  @returns {number}
     */
    getRewardExperience(level: number): number;
    /**
     *  Get the currencies reward.
     *  @param {number} level The monster level
     *  @returns {Object}
     */
    getRewardCurrencies(level: number): Record<string, number>;
    /**
     *  Get the loots reward.
     *  @param {number} level The monster level
     *  @returns {Record<string, number>[]}
     */
    getRewardLoots(level: number): Record<string, number>[];
}
export { StructReward, Monster };
