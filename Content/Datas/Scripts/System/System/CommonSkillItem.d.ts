import { Icon } from "./Icon.js";
import { Translatable } from "./Translatable.js";
import { DynamicValue } from "./DynamicValue.js";
import { PlaySong } from "./PlaySong.js";
import { Cost } from "./Cost.js";
import { Characteristic } from "./Characteristic.js";
import { Effect } from "./Effect.js";
import { System } from "../index.js";
/** @class
 *  A common class for skills, items, weapons, armors.
 *  @extends System.Icon
 *  @param {Record<string, any>} - [json=undefined] Json object describing the common
 */
declare class CommonSkillItem extends Icon {
    id: number;
    hasType: boolean;
    hasTargetKind: boolean;
    type: number;
    consumable: boolean;
    oneHand: boolean;
    description: Translatable;
    targetKind: number;
    targetConditionFormula: DynamicValue;
    conditionFormula: DynamicValue;
    availableKind: number;
    sound: PlaySong;
    animationID: DynamicValue;
    animationTargetID: DynamicValue;
    price: Cost[];
    costs: Cost[];
    effects: Effect[];
    characteristics: Characteristic[];
    animationUserID: DynamicValue;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the common.
     *  @param {Record<string, any>} - json Json object describing the common
     */
    read(json: Record<string, any>): void;
    /**
     *  Use the command if possible.
     *  @returns {boolean}
     */
    useCommand(): boolean;
    /**
     *  Execute the effects and costs.
     *  @returns {boolean}
     */
    use(): boolean;
    /**
     *  Use the costs.
     */
    cost(): void;
    /** Check if the costs are possible.
     *  @returns {boolean}
     */
    isPossible(): boolean;
    /**
     *  Get the target kind string.
     *  @returns {string}
     */
    getTargetKindString(): string;
    /**
     *  Get the weapon kind.
     *  @returns {System/WeaponArmorKind}
     */
    getType(): System.WeaponArmorKind;
}
export { CommonSkillItem };
