/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { MONSTER_ACTION_KIND, MONSTER_ACTION_TARGET_KIND, OPERATION_KIND, Utils } from '../Common';
import { Base } from './Base';
import { DynamicValue } from './DynamicValue';
import { Monster } from './Monster';

/** @class
 *  A monster action of the game.
 *  @extends Model.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  monster action
 */
class MonsterAction extends Base {
	public actionKind: number;
	public skillID: DynamicValue;
	public itemID: DynamicValue;
	public itemNumberMax: DynamicValue;
	public priority: DynamicValue;
	public targetKind: number;
	public isConditionTurn: boolean;
	public operationKindTurn: number;
	public turnValueCompare: DynamicValue;
	public isConditionStatistic: boolean;
	public statisticID: DynamicValue;
	public operationKindStatistic: number;
	public statisticValueCompare: DynamicValue;
	public isConditionVariable: boolean;
	public variableID: number;
	public operationKindVariable: number;
	public variableValueCompare: DynamicValue;
	public isConditionStatus: boolean;
	public statusID: DynamicValue;
	public isConditionScript: boolean;
	public script: DynamicValue;
	public monster: Monster;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Read the JSON associated to the monster action.
	 *  @param {Record<string, any>} - json Json object describing the monster
	 *  action
	 */
	read(json: Record<string, any>) {
		this.actionKind = Utils.defaultValue(json.ak, MONSTER_ACTION_KIND.DO_NOTHING);
		switch (this.actionKind) {
			case MONSTER_ACTION_KIND.USE_SKILL:
				this.skillID = DynamicValue.readOrDefaultNumber(json.sid, 1);
				break;
			case MONSTER_ACTION_KIND.USE_ITEM:
				this.itemID = DynamicValue.readOrDefaultNumber(json.iid, 1);
				this.itemNumberMax = DynamicValue.readOrDefaultNumber(json.inm, 1);
				break;
			default:
				break;
		}
		this.priority = DynamicValue.readOrDefaultNumber(json.p, 10);
		this.targetKind = Utils.defaultValue(json.tk, MONSTER_ACTION_TARGET_KIND.RANDOM);
		this.isConditionTurn = Utils.defaultValue(json.ict, false);
		if (this.isConditionTurn) {
			this.operationKindTurn = Utils.defaultValue(json.okt, OPERATION_KIND.EQUAL_TO);
			this.turnValueCompare = DynamicValue.readOrDefaultNumber(json.tvc, 0);
		}
		this.isConditionStatistic = Utils.defaultValue(json.ics, false);
		if (this.isConditionStatistic) {
			this.statisticID = DynamicValue.readOrDefaultDatabase(json.stid);
			this.operationKindStatistic = Utils.defaultValue(json.oks, OPERATION_KIND.EQUAL_TO);
			this.statisticValueCompare = DynamicValue.readOrDefaultNumber(json.svc, 0);
		}
		this.isConditionVariable = Utils.defaultValue(json.icv, false);
		if (this.isConditionVariable) {
			this.variableID = Utils.defaultValue(json.vid, 1);
			this.operationKindVariable = Utils.defaultValue(json.okv, OPERATION_KIND.EQUAL_TO);
			this.variableValueCompare = DynamicValue.readOrDefaultNumber(json.vvc, 0);
		}
		this.isConditionStatus = Utils.defaultValue(json.icst, false);
		if (this.isConditionStatus) {
			this.statusID = DynamicValue.readOrDefaultNumber(json.stsid, 0);
		}
		this.isConditionScript = Utils.defaultValue(json.icsc, false);
		if (this.isConditionScript) {
			this.script = DynamicValue.readOrDefaultMessage(json.s, '');
		}
	}
}

export { MonsterAction };
