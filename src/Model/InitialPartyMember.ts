/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '..';
import { CHARACTER_KIND, GROUP_KIND, Utils } from '../Common';
import { Base } from './Base';
import { DynamicValueJSON } from './DynamicValue';

/**
 * JSON structure describing an initial party member.
 */
export type InitialPartyMemberJSON = {
	level?: DynamicValueJSON;
	teamKind?: GROUP_KIND;
	isHero?: boolean;
	heroID?: DynamicValueJSON;
	monsterID?: DynamicValueJSON;
	variableInstanceID?: DynamicValueJSON;
};

/**
 * An initial party member of the game.
 */
export class InitialPartyMember extends Base {
	public level: Model.DynamicValue;
	public teamKind: GROUP_KIND;
	public characterKind: CHARACTER_KIND;
	public heroID: Model.DynamicValue;
	public variableInstanceID: Model.DynamicValue;

	constructor(json?: InitialPartyMemberJSON) {
		super(json);
	}

	/**
	 * Read the JSON associated to the initial party member.
	 */
	read(json: InitialPartyMemberJSON): void {
		this.level = Model.DynamicValue.readOrDefaultNumber(json.level, 1);
		this.teamKind = Utils.valueOrDefault(json.teamKind, GROUP_KIND.TEAM);
		const isHero = Utils.valueOrDefault(json.isHero, true);
		this.characterKind = isHero ? CHARACTER_KIND.HERO : CHARACTER_KIND.MONSTER;
		this.heroID = Model.DynamicValue.readOrDefaultDatabase(isHero ? json.heroID : json.monsterID);
		this.variableInstanceID = Model.DynamicValue.readOrDefaultVariable(json.variableInstanceID);
	}
}
