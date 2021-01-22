/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { System } from "..";
import { Enum, Utils } from "../Common";
import { Icon } from "./Icon";

/** @class
 *  A possible status hero.
 *  @extends System.Base
 *  @param {Record<string, any>} - json Json object describing the object state
 */
class Status extends Icon {

    public id: number;
    public animationID: System.DynamicValue;
    public restrictionKind: Enum.StatusRestrictionsKind;
    public priority: System.DynamicValue;
    public battlerPosition: System.DynamicValue;
    public isReleaseAtEndBattle: boolean;
    public isReleaseAfterAttacked: boolean;
    public chanceReleaseAfterAttacked: System.DynamicValue;
    public isReleaseStartTurn: boolean;
    public releaseStartTurn: System.StatusReleaseTurn[];
    public messageAllyAffected: System.DynamicValue;
    public messageEnemyAffected: System.DynamicValue;
    public messageStatusHealed: System.DynamicValue;
    public messageStatusStillAffected: System.DynamicValue;
    public effects: System.Effect[];
    public characteristics: System.Characteristic[];

    constructor(json?: Record<string, any>)
    {
        super(json);
    }

    /** 
     *  Read the JSON associated to the status.
     *  @param {Record<string, any>} - json Json object describing the status
     */
    read(json: Record<string, any>)
    {
        super.read(json);
        this.id = json.id;
        this.animationID = System.DynamicValue.readOrNone(json.animationID);
        this.restrictionKind = Utils.defaultValue(json.restrictionKind, Enum
            .StatusRestrictionsKind.None);
        this.priority = System.DynamicValue.readOrDefaultNumber(json.priority);
        this.battlerPosition = System.DynamicValue.readOrDefaultNumber(json.priority);
        this.isReleaseAtEndBattle = Utils.defaultValue(json.isReleaseAtEndBattle, false);
        this.isReleaseAfterAttacked = Utils.defaultValue(json.isReleaseAfterAttacked, false);
        this.chanceReleaseAfterAttacked = System.DynamicValue
            .readOrDefaultNumberDouble(json.chanceReleaseAfterAttacked);
        this.isReleaseStartTurn = Utils.defaultValue(json.isReleaseStartTurn, false);
        this.releaseStartTurn = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json
            .releaseStartTurn, []), listIndexes: this.releaseStartTurn, cons: 
            System.StatusReleaseTurn });
        this.messageAllyAffected = System.DynamicValue.readOrDefaultMessage(json
            .messageAllyAffected);
        this.messageEnemyAffected = System.DynamicValue.readOrDefaultMessage(json
            .messageEnemyAffected);
        this.messageStatusHealed = System.DynamicValue.readOrDefaultMessage(json
            .messageStatusHealed);
        this.messageStatusStillAffected = System.DynamicValue.readOrDefaultMessage(json
            .messageStatusStillAffected);
        this.effects = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.effects, []), 
            listIndexes: this.effects, cons: System.Effect });
        this.characteristics = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.characteristics, 
            []), listIndexes: this.characteristics, cons: System.Characteristic });
    }
}

export { Status }