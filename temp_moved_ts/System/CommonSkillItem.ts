/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {DynamicValue, Icon, Lang, SystemStructure} from ".";
import {Enum, RPM} from "../Core";
import TargetKind = Enum.TargetKind;
import AvailableKind = Enum.AvailableKind;
import SongKind = Enum.SongKind;

/** @class
 *   A common class for skills, items, weapons, armors
 *   @extends SystemIcon
 *   @property {boolean} [hasType=true] Indicate if the common has a type
 *   @property {boolean} [hasTargetKind=true] Indicate if the common has a
 *   target kind
 *   @property {number} type The type of common
 *   @property {boolean} consumable Indicate if the common is consumable
 *   @property {boolean} oneHand Indicate if the common is one hand
 *   @property {SystemLang} description The description
 *   @property {TargetKind} targetKind The target kind
 *   @property {SystemValue} targetConditionFormula The target condition formula
 *   @property {SystemValue} conditionFormula The condition formula
 *   @property {AvailableKind} availableKind The kind of available
 *   @property {SystemPlaySong} sound The sound menu
 *   @property {SystemValue} animationUserID The animation user ID value
 *   @property {SystemValue} animationTargetID The animation target ID value
 *   @property {SystemValue} price The price value
 *   @property {SystemCost[]} costs The costs list
 *   @property {SystemEffect[]} effects The effects list
 *   @property {SystemCharacteristic[]} characteristics The characteristics list
 *   @param {Object} [json=undefined] Json object describing the common
 */
export class CommonSkillItem extends Icon implements SystemStructure {
    hasType: boolean;
    hasTargetKind: boolean;
    type: number;
    consumable: boolean;
    oneHand: boolean;
    description: Lang;
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


    constructor(json) {
        super(json);
    }

    public setup() {
        super.setup();
        this.hasType = true;
        this.hasTargetKind = true;
        this.type = 1;
        this.consumable = false;
        this.oneHand = true;
        this.description = null;
        this.targetKind = TargetKind.None;
        this.targetConditionFormula = null;
        this.availableKind = AvailableKind.Never;

    }

    // -------------------------------------------------------
    /** Read the JSON associated to the common
     *   @param {Object} json Json object describing the common
     */
    read(json) {
        super.read(json);

        this.type = RPM.defaultValue(json.t, 1);
        this.consumable = RPM.defaultValue(json.con, false);
        this.oneHand = RPM.defaultValue(json.oh, true);
        this.description = new Lang(RPM.defaultValue(json.d, Lang
            .EMPTY_NAMES));
        this.targetKind = RPM.defaultValue(json.tk, TargetKind.None);
        this.targetConditionFormula = DynamicValue.readOrNone(json.tcf);
        this.conditionFormula = DynamicValue.readOrNone(json.cf);
        this.availableKind = RPM.defaultValue(json.ak, AvailableKind.Never);
        this.sound = new PlaySong(SongKind.sound, json.s);
        this.animationUserID = DynamicValue.readOrNone(json.auid);
        this.animationTargetID = DynamicValue.readOrNone(json.atid);
        this.price = DynamicValue.readOrDefaultNumber(json.p);
        let costs = RPM.defaultValue(json.cos, []);
        this.costs = RPM.readJSONSystemListByIndex(costs, SystemCost);
        let effects = RPM.defaultValue(json.e, []);
        this.effects = RPM.readJSONSystemListByIndex(effects, SystemEffect);
        let characteristics = RPM.defaultValue(json.car, []);
        this.characteristics = RPM.readJSONSystemListByIndex(characteristics,
            SystemCharacteristic);
    }

    // -------------------------------------------------------
    /** Use the command if possible
     *   @returns {boolean}
     */
    useCommand() {
        let possible = this.isPossible();
        if (possible) {
            this.use();
        }
        return possible;
    }

    // -------------------------------------------------------
    /** Execute the effects and costs
     *   @returns {boolean}
     */
    use() {
        let isDoingSomething = false;
        let i, l;
        for (i = 0, l = this.effects.length; i < l; i++) {
            isDoingSomething = isDoingSomething || this.effects[i].execute();
        }
        if (isDoingSomething) {
            for (i = 0, l = this.costs.length; i < l; i++) {
                this.costs[i].use();
            }
        }
        return isDoingSomething;
    }

    // -------------------------------------------------------
    /** Use the costs
     */
    cost() {
        for (let i = 0, l = this.costs.length; i < l; i++) {
            this.costs[i].use();
        }
    }

    // -------------------------------------------------------
    /** Check if the costs are possible
     *   @returns {boolean}
     */
    isPossible() {
        for (let i = 0, l = this.costs.length; i < l; i++) {
            if (!this.costs[i].isPossible()) {
                return false;
            }
        }
        return true;
    }

    // -------------------------------------------------------
    /** Get the target kind string
     *   @returns {string}
     */
    getTargetKindString() {
        switch (this.targetKind) {
            case TargetKind.None:
                return "None";
            case TargetKind.User:
                return "The user";
            case TargetKind.Enemy:
                return "An enemy";
            case TargetKind.Ally:
                return "An ally";
            case TargetKind.AllEnemies:
                return "All enemies";
            case TargetKind.AllAllies:
                return "All allies";
        }
        return RPM.STRING_EMPTY;
    }
}