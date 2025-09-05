/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas, Model } from '..';
import { EFFECT_KIND, STATUS_RESTRICTIONS_KIND, Utils } from '../Common';
import { Icon } from './Icon';

/** @class
 *  A possible status hero.
 *  @extends Model.Base
 *  @param {Record<string, any>} - json Json object describing the object state
 */
class Status extends Icon {
	public id: number;
	public animationID: Model.DynamicValue;
	public restrictionKind: STATUS_RESTRICTIONS_KIND;
	public priority: Model.DynamicValue;
	public battlerPosition: Model.DynamicValue;
	public isReleaseAtEndBattle: boolean;
	public isReleaseAfterAttacked: boolean;
	public chanceReleaseAfterAttacked: Model.DynamicValue;
	public isReleaseStartTurn: boolean;
	public releaseStartTurn: Model.StatusReleaseTurn[];
	public messageAllyAffected: Model.DynamicValue;
	public messageEnemyAffected: Model.DynamicValue;
	public messageStatusHealed: Model.DynamicValue;
	public messageStatusStillAffected: Model.DynamicValue;
	public effects: Model.Effect[];
	public characteristics: Model.Characteristic[];

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Read the JSON associated to the status.
	 *  @param {Record<string, any>} - json Json object describing the status
	 */
	read(json: Record<string, any>) {
		super.read(json);
		this.id = json.id;
		this.animationID = Model.DynamicValue.readOrNone(json.animationID);
		this.restrictionKind = Utils.defaultValue(json.restrictionKind, STATUS_RESTRICTIONS_KIND.NONE);
		this.priority = Model.DynamicValue.readOrDefaultNumber(json.priority);
		this.battlerPosition = Model.DynamicValue.readOrDefaultNumber(json.battlerPosition);
		this.isReleaseAtEndBattle = Utils.defaultValue(json.isReleaseAtEndBattle, false);
		this.isReleaseAfterAttacked = Utils.defaultValue(json.isReleaseAfterAttacked, false);
		this.chanceReleaseAfterAttacked = Model.DynamicValue.readOrDefaultNumberDouble(json.chanceReleaseAfterAttacked);
		this.isReleaseStartTurn = Utils.defaultValue(json.isReleaseStartTurn, false);
		this.releaseStartTurn = [];
		Utils.readJSONSystemList({
			list: Utils.defaultValue(json.releaseStartTurn, []),
			listIndexes: this.releaseStartTurn,
			cons: Model.StatusReleaseTurn,
		});
		this.messageAllyAffected = Model.DynamicValue.readOrDefaultMessage(json.messageAllyAffected);
		this.messageEnemyAffected = Model.DynamicValue.readOrDefaultMessage(json.messageEnemyAffected);
		this.messageStatusHealed = Model.DynamicValue.readOrDefaultMessage(json.messageStatusHealed);
		this.messageStatusStillAffected = Model.DynamicValue.readOrDefaultMessage(json.messageStatusStillAffected);
		this.effects = [];
		Utils.readJSONSystemList({
			list: Utils.defaultValue(json.effects, []),
			listIndexes: this.effects,
			cons: Model.Effect,
		});
		this.characteristics = [];
		Utils.readJSONSystemList({
			list: Utils.defaultValue(json.characteristics, []),
			listIndexes: this.characteristics,
			cons: Model.Characteristic,
		});
	}

	/**
	 *  Get all the effects, including the ones with perform skill efect.
	 *  @returns {System.Effect}
	 */
	getEffects(): Model.Effect[] {
		const effects: Model.Effect[] = [];
		for (const effect of this.effects) {
			if (effect.kind === EFFECT_KIND.PERFORM_SKILL) {
				effects.concat(Datas.Skills.get(effect.performSkillID.getValue()).getEffects());
			} else {
				effects.push(effect);
			}
		}
		return effects;
	}
}

export { Status };
