/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { MONSTER_ACTION_KIND, MONSTER_ACTION_TARGET_KIND, OPERATION_KIND, Utils } from '../Common';
import { Base } from './Base';
import { DynamicValue, DynamicValueJSON } from './DynamicValue';
import { Monster } from './Monster';

/**
 * JSON structure describing a monster action.
 */
export type MonsterActionJSON = {
	ak?: number;
	sid?: DynamicValueJSON;
	iid?: DynamicValueJSON;
	inm?: DynamicValueJSON;
	p?: DynamicValueJSON;
	tk?: number;
	ict?: boolean;
	okt?: number;
	tvc?: DynamicValueJSON;
	ics?: boolean;
	stid?: DynamicValueJSON;
	oks?: number;
	svc?: DynamicValueJSON;
	icv?: boolean;
	vid?: number;
	okv?: number;
	vvc?: DynamicValueJSON;
	icst?: boolean;
	stsid?: DynamicValueJSON;
	icsc?: boolean;
	s?: DynamicValueJSON;
};

/**
 * Represents a monster action.
 */
export class MonsterAction extends Base {
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

	constructor(json?: MonsterActionJSON) {
		super(json);
	}

	/**
	 * Initialize this monster action from JSON data.
	 */
	read(json: MonsterActionJSON): void {
		this.actionKind = Utils.valueOrDefault(json.ak, MONSTER_ACTION_KIND.DO_NOTHING);
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
		this.targetKind = Utils.valueOrDefault(json.tk, MONSTER_ACTION_TARGET_KIND.RANDOM);
		this.isConditionTurn = Utils.valueOrDefault(json.ict, false);
		if (this.isConditionTurn) {
			this.operationKindTurn = Utils.valueOrDefault(json.okt, OPERATION_KIND.EQUAL_TO);
			this.turnValueCompare = DynamicValue.readOrDefaultNumber(json.tvc, 0);
		}
		this.isConditionStatistic = Utils.valueOrDefault(json.ics, false);
		if (this.isConditionStatistic) {
			this.statisticID = DynamicValue.readOrDefaultDatabase(json.stid);
			this.operationKindStatistic = Utils.valueOrDefault(json.oks, OPERATION_KIND.EQUAL_TO);
			this.statisticValueCompare = DynamicValue.readOrDefaultNumber(json.svc, 0);
		}
		this.isConditionVariable = Utils.valueOrDefault(json.icv, false);
		if (this.isConditionVariable) {
			this.variableID = Utils.valueOrDefault(json.vid, 1);
			this.operationKindVariable = Utils.valueOrDefault(json.okv, OPERATION_KIND.EQUAL_TO);
			this.variableValueCompare = DynamicValue.readOrDefaultNumber(json.vvc, 0);
		}
		this.isConditionStatus = Utils.valueOrDefault(json.icst, false);
		if (this.isConditionStatus) {
			this.statusID = DynamicValue.readOrDefaultNumber(json.stsid, 0);
		}
		this.isConditionScript = Utils.valueOrDefault(json.icsc, false);
		if (this.isConditionScript) {
			this.script = DynamicValue.readOrDefaultMessage(json.s, '');
		}
	}
}
