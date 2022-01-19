/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { System } from "..";
import { Enum, Utils } from "../Common";
import { Base } from "./Base";

/** @class
 *  An initial party member of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the 
 *  initial party member
 */
class InitialPartyMember extends Base {

    public level: System.DynamicValue;
    public teamKind: Enum.GroupKind;
    public characterKind: Enum.CharacterKind;
    public heroID: System.DynamicValue;
    public variableInstanceID: System.DynamicValue;

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Read the JSON associated to the initial party member.
     *  @param {Record<string, any>} - json Json object describing the initial 
     *  party member
     */
    read(json: Record<string, any>) {
        this.level = System.DynamicValue.readOrDefaultNumber(json.level, 1);
        this.teamKind = Utils.defaultValue(json.teamKind, 0);
        const isHero = Utils.defaultValue(json.isHero, true);
        this.characterKind = isHero ? Enum.CharacterKind.Hero : Enum
            .CharacterKind.Monster;
        this.heroID = System.DynamicValue.readOrDefaultDatabase(isHero ? json
            .heroID : json.monsterID);
        this.variableInstanceID = System.DynamicValue.readOrDefaultVariable(json.variableInstanceID);
    }
}

export { InitialPartyMember }