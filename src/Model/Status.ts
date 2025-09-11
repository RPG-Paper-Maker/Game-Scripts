/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas } from '..';
import { EFFECT_KIND, STATUS_RESTRICTIONS_KIND, Utils } from '../Common';
import { Characteristic, CharacteristicJSON } from './Characteristic';
import { DynamicValue, DynamicValueJSON } from './DynamicValue';
import { Effect, EffectJSON } from './Effect';
import { Icon, IconJSON } from './Icon';
import { StatusReleaseTurn, StatusReleaseTurnJSON } from './StatusReleaseTurn';

/**
 * JSON structure for a status.
 */
export type StatusJSON = IconJSON & {
	id?: number;
	animationID?: DynamicValueJSON;
	restrictionKind?: STATUS_RESTRICTIONS_KIND;
	priority?: DynamicValueJSON;
	battlerPosition?: DynamicValueJSON;
	isReleaseAtEndBattle?: boolean;
	isReleaseAfterAttacked?: boolean;
	chanceReleaseAfterAttacked?: DynamicValueJSON;
	isReleaseStartTurn?: boolean;
	releaseStartTurn?: StatusReleaseTurnJSON[];
	messageAllyAffected?: DynamicValueJSON;
	messageEnemyAffected?: DynamicValueJSON;
	messageStatusHealed?: DynamicValueJSON;
	messageStatusStillAffected?: DynamicValueJSON;
	effects?: EffectJSON[];
	characteristics?: CharacteristicJSON[];
};

/**
 * A possible status applied to a hero.
 */
export class Status extends Icon {
	public id: number;
	public animationID: DynamicValue;
	public restrictionKind: STATUS_RESTRICTIONS_KIND;
	public priority: DynamicValue;
	public battlerPosition: DynamicValue;
	public isReleaseAtEndBattle: boolean;
	public isReleaseAfterAttacked: boolean;
	public chanceReleaseAfterAttacked: DynamicValue;
	public isReleaseStartTurn: boolean;
	public releaseStartTurn: StatusReleaseTurn[];
	public messageAllyAffected: DynamicValue;
	public messageEnemyAffected: DynamicValue;
	public messageStatusHealed: DynamicValue;
	public messageStatusStillAffected: DynamicValue;
	public effects: Effect[];
	public characteristics: Characteristic[];

	constructor(json?: StatusJSON) {
		super(json);
	}

	/**
	 * Get all effects, including those from perform skill effects.
	 */
	getEffects(): Effect[] {
		const effects: Effect[] = [];
		for (const effect of this.effects) {
			if (effect.kind === EFFECT_KIND.PERFORM_SKILL) {
				effects.concat(Datas.Skills.get(effect.performSkillID.getValue() as number).getEffects());
			} else {
				effects.push(effect);
			}
		}
		return effects;
	}

	/**
	 * Read JSON into this status.
	 */
	read(json: StatusJSON): void {
		super.read(json);
		this.id = json.id;
		this.animationID = DynamicValue.readOrNone(json.animationID);
		this.restrictionKind = Utils.valueOrDefault(json.restrictionKind, STATUS_RESTRICTIONS_KIND.NONE);
		this.priority = DynamicValue.readOrDefaultNumber(json.priority);
		this.battlerPosition = DynamicValue.readOrDefaultNumber(json.battlerPosition);
		this.isReleaseAtEndBattle = Utils.valueOrDefault(json.isReleaseAtEndBattle, false);
		this.isReleaseAfterAttacked = Utils.valueOrDefault(json.isReleaseAfterAttacked, false);
		this.chanceReleaseAfterAttacked = DynamicValue.readOrDefaultNumberDouble(json.chanceReleaseAfterAttacked);
		this.isReleaseStartTurn = Utils.valueOrDefault(json.isReleaseStartTurn, false);
		this.releaseStartTurn = Utils.readJSONList(json.releaseStartTurn, StatusReleaseTurn);
		this.messageAllyAffected = DynamicValue.readOrDefaultMessage(json.messageAllyAffected);
		this.messageEnemyAffected = DynamicValue.readOrDefaultMessage(json.messageEnemyAffected);
		this.messageStatusHealed = DynamicValue.readOrDefaultMessage(json.messageStatusHealed);
		this.messageStatusStillAffected = DynamicValue.readOrDefaultMessage(json.messageStatusStillAffected);
		this.effects = Utils.readJSONList(json.effects, Effect);
		this.characteristics = Utils.readJSONList(json.characteristics, Characteristic);
	}
}
