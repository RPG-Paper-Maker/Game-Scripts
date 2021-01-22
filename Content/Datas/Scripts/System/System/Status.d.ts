import { System } from "../index.js";
import { Enum } from "../Common/index.js";
import { Base } from "./Base.js";
/** @class
 *  A possible status hero.
 *  @extends System.Base
 *  @param {Record<string, any>} - json Json object describing the object state
 */
declare class Status extends Base {
    animationID: System.DynamicValue;
    restrictionKind: Enum.StatusRestrictionsKind;
    priority: System.DynamicValue;
    battlerPosition: System.DynamicValue;
    isReleaseAtEndBattle: boolean;
    isReleaseAfterAttacked: boolean;
    chanceReleaseAfterAttacked: System.DynamicValue;
    isReleaseStartTurn: boolean;
    releaseStartTurn: System.StatusReleaseTurn[];
    messageAllyAffected: System.DynamicValue;
    messageEnemyAffected: System.DynamicValue;
    messageStatusHealed: System.DynamicValue;
    messageStatusStillAffected: System.DynamicValue;
    effects: System.Effect[];
    characteristics: System.Characteristic[];
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the status.
     *  @param {Record<string, any>} - json Json object describing the status
     */
    read(json: Record<string, any>): void;
}
export { Status };
