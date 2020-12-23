import { Icon } from "./Icon";
import { Translatable } from "./Translatable";
import { DynamicValue } from "./DynamicValue";
import { PlaySong } from "./PlaySong";
import { Cost } from "./Cost";
import { Characteristic } from "./Characteristic";
import { Effect } from "./Effect";
import { System } from "..";
/** @class
 *  A common class for skills, items, weapons, armors.
 *  @extends System.Icon
 *  @param {Record<string, any>} [json=undefined] Json object describing the common
 */
declare class CommonSkillItem extends Icon {
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
    price: DynamicValue;
    costs: Cost[];
    effects: Effect[];
    characteristics: Characteristic[];
    animationUserID: DynamicValue;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the common.
     *  @param {Record<string, any>} json Json object describing the common
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
