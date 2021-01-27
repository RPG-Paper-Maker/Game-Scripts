import { Enum } from "../Common/index.js";
import CharacterKind = Enum.CharacterKind;
import { System } from "../index.js";
import { Skill } from "./Skill.js";
import { Item } from "./Item.js";
import { Battler } from "./Battler.js";
import { Status } from "./Status.js";
/** @class
 *  A character in the team/hidden/reserve.
 *  @param {CharacterKind} [kind=undefined] - The kind of the character (hero or monster)
 *  @param {number} [id=undefined] - The ID of the character
 *  @param {number} [instanceID=undefined] - The instance id of the character
 *  @param {Skill[]} [skills=undefined] - List of all the learned skills
 *  @param {Record<string, any>} - [json=undefined] Json object describing the items
 */
declare class Player {
    static MAX_STATUS_DISPLAY_TOP: number;
    id: number;
    kind: CharacterKind;
    instid: number;
    system: System.Hero;
    name: string;
    levelingUp: boolean;
    sk: Skill[];
    equip: Item[];
    status: Status[];
    expList: number[];
    testedLevelUp: boolean;
    remainingXP: number;
    totalRemainingXP: number;
    totalTimeXP: number;
    timeXP: number;
    obtainedXP: number;
    stepLevelUp: number;
    battler: Battler;
    constructor(kind?: CharacterKind, id?: number, instanceID?: number, skills?: Record<string, any>[], status?: Record<string, any>[], name?: string, json?: Record<string, any>);
    /**
     *  Get the max size of equipment kind names.
     *  @static
     *  @returns {number}
    */
    static getEquipmentLength(): number;
    /**
     *  Get the max size of equipment kind names.
     *  @static
     *  @param {number[]} values - The values
     *  @returns {GamePlayer}
     */
    static getTemporaryPlayer(values?: number[]): Player;
    /**
     *  Get the player informations System.
     *  @returns {System.Hero}
     */
    getSystem(): System.Hero;
    /**
     *  Get a compressed object for saving the character in a file.
     *  @returns {Record<string, any>}
     */
    getSaveCharacter(): Record<string, any>;
    /**
     *  Get the statistics for save character.
     *  @returns {number[]}
     */
    getSaveStat(): number[];
    /**
     *  Get the equips for save character.
     *  @returns {number[][]}
     */
    getSaveEquip(): number[][];
    /**
     *  Check if the character is dead.
     *  @returns {boolean}
     */
    isDead(): boolean;
    /**
     *  Instanciate a character in a particular level.
     *  @param {number} level - The level of the new character
     */
    instanciate(level: number): void;
    /**
     *  Get the stats thanks to equipments.
     *  @param {System.CommonSkillItem} item - The System item
     *  @param {number} equipmentID - The equipment ID
     *  @returns {number[][]}
     */
    getEquipmentStatsAndBonus(item?: System.CommonSkillItem, equipmentID?: number): number[][];
    /**
     *  Update stats with equipment stats
     *  @param {number[]} list - The stats list
     *  @param {number[]} bonus - The bonus list
     */
    updateEquipmentStats(list?: number[], bonus?: number[]): void;
    /**
     *  Initialize stat value.
     *  @param {System.Statistic} statistic - The statistic
     *  @param {number} bonus - The value
     */
    initStatValue(statistic: System.Statistic, value: number): void;
    /** Update stats value.
     *  @param {System.Statistic} statistic - The statistic
     *  @param {number} bonus - The value
     */
    updateStatValue(statistic: System.Statistic, value: number): void;
    /**
     *  Update all the stats values.
     */
    updateAllStatsValues(): void;
    /**
     *  Get the bar abbreviation.
     *  @param {System.Statistic} stat - The statistic
     *  @returns {string}
     */
    getBarAbbreviation(stat: System.Statistic): string;
    /**
     *  Read the JSON associated to the character and items.
     *  @param {Record<string, any>} - json Json object describing the items
    */
    read(json: Record<string, any>): void;
    /**
     *  Get the current level.
     *  @returns {number}
     */
    getCurrentLevel(): number;
    /**
     *  Apply level up.
     */
    levelUp(): void;
    /**
     *  Learn new skills (on level up).
     */
    learnSkills(): void;
    /**
     *  Get the experience reward.
     *  @returns {number}
     */
    getRewardExperience(): number;
    /**
     *  Get the currencies reward.
     *  @returns {Record<string, any>}
     */
    getRewardCurrencies(): Record<string, number>;
    /**
     *  Get the loots reward.
     *  @returns {Record<string, Item>[]}
     */
    getRewardLoots(): Record<string, Item>[];
    /**
     *  Update remaining xp according to full time.
     *  @param {number} fullTime - Full time in milliseconds
     */
    updateRemainingXP(fullTime: number): void;
    /**
     *  Update obtained experience.
     */
    updateObtainedExperience(): void;
    /**
     *  Update experience and check if leveling up.
     *  @returns {boolean}
     */
    updateExperience(): boolean;
    /**
     *  Pass the progressive experience and directly update experience.
     */
    passExperience(): void;
    /**
     *  Pause experience (when leveling up).
     */
    pauseExperience(): void;
    /**
     *  Unpause experience.
     */
    unpauseExperience(): void;
    /**
     *  Check if experience is updated.
     *  @returns {boolean}
     */
    isExperienceUpdated(): boolean;
    /**
     *  Get the first status to display according to priority.
     *  @returns {Core.Status[]}
     */
    getFirstStatus(): Status[];
    /**
     *  Add a new status and check if already in.
     *  @param {number} id - The status id to add
     *  @returns {Core.Status}
     */
    addStatus(id: number): Status;
    /**
     *  Remove the status.
     *  @param {number} id - The status id to remove
     */
    removeStatus(id: number): void;
}
export { Player };
