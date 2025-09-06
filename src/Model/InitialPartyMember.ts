/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '..';
import { CHARACTER_KIND, GROUP_KIND, Utils } from '../Common';
import { Base } from './Base';

/** @class
 *  An initial party member of the game.
 *  @extends Model.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  initial party member
 */
class InitialPartyMember extends Base {
	public level: Model.DynamicValue;
	public teamKind: GROUP_KIND;
	public CHARACTER_KIND: CHARACTER_KIND;
	public heroID: Model.DynamicValue;
	public variableInstanceID: Model.DynamicValue;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Read the JSON associated to the initial party member.
	 *  @param {Record<string, any>} - json Json object describing the initial
	 *  party member
	 */
	read(json: Record<string, any>) {
		this.level = Model.DynamicValue.readOrDefaultNumber(json.level, 1);
		this.teamKind = Utils.valueOrDefault(json.teamKind, 0);
		const isHero = Utils.valueOrDefault(json.isHero, true);
		this.CHARACTER_KIND = isHero ? CHARACTER_KIND.HERO : CHARACTER_KIND.MONSTER;
		this.heroID = Model.DynamicValue.readOrDefaultDatabase(isHero ? json.heroID : json.monsterID);
		this.variableInstanceID = Model.DynamicValue.readOrDefaultVariable(json.variableInstanceID);
	}
}

export { InitialPartyMember };
