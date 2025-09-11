/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { CHARACTERISTIC_KIND, INCREASE_DECREASE_KIND, Interpreter, Utils } from '../Common';
import { Player } from '../Core';
import { Datas, Model, Scene } from '../index';
import { Base } from './Base';
import { DynamicValue, DynamicValueJSON } from './DynamicValue';

/**
 * JSON schema for a characteristic.
 */
export type CharacteristicJSON = {
	k?: CHARACTERISTIC_KIND;
	iid?: boolean;
	idk?: INCREASE_DECREASE_KIND;
	svid?: DynamicValueJSON;
	erid?: DynamicValueJSON;
	strid?: DynamicValueJSON;
	cgid?: DynamicValueJSON;
	scid?: DynamicValueJSON;
	iasc?: boolean;
	vid?: number;
	o?: boolean;
	v?: DynamicValueJSON;
	u?: boolean;
	s?: DynamicValueJSON;
	iae?: boolean;
	iaew?: boolean;
	ewtid?: DynamicValueJSON;
	eatid?: DynamicValueJSON;
	iace?: boolean;
	ceid?: DynamicValueJSON;
	beid?: DynamicValueJSON;
	ibw?: boolean;
	bwaid?: DynamicValueJSON;
	eid?: DynamicValueJSON;
};

/**
 * Represents a modifier applied to a characteristic (multiplicative and additive).
 */
export type CharacteristicModifierType = {
	multiplication: number;
	addition: number;
};

/**
 * Represents the structure used to accumulate increase/decrease values
 * across different categories (status, experience, currency, skills).
 */
export type CharacteristicResType = {
	statusRes: Record<number, CharacteristicModifierType>;
	experienceGain: Record<number, CharacteristicModifierType>;
	currencyGain: Record<number, CharacteristicModifierType>;
	skillCostRes: Record<number, CharacteristicModifierType>;
};

/**
 * Represents a characteristic of a common skill item.
 */
export class Characteristic extends Base {
	public kind: CHARACTERISTIC_KIND;
	public isIncreaseDecrease: boolean;
	public increaseDecreaseKind: number;
	public statisticValueID: DynamicValue;
	public elementResID: DynamicValue;
	public statusResID: DynamicValue;
	public currencyGainID: DynamicValue;
	public skillCostID: DynamicValue;
	public isAllSkillCost: boolean;
	public variableID: number;
	public operation: boolean;
	public value: DynamicValue;
	public unit: boolean;
	public script: DynamicValue;
	public isAllowEquip: boolean;
	public isAllowEquipWeapon: boolean;
	public equipWeaponTypeID: DynamicValue;
	public equipArmorTypeID: DynamicValue;
	public isAllowChangeEquipment: boolean;
	public changeEquipmentID: DynamicValue;
	public beginEquipmentID: DynamicValue;
	public beginWeaponArmorID: DynamicValue;
	public isBeginWeapon: boolean;
	public elementID: DynamicValue;

	constructor(json?: CharacteristicJSON) {
		super(json);
	}

	/**
	 * Get the new stat value of a player with this characteristic bonus.
	 * @param gamePlayer - The player to apply the characteristic to.
	 * @returns A tuple [statisticID, value] or null if not applicable.
	 */

	getNewStatValue(gamePlayer: Player): [number, number] | null {
		switch (this.kind) {
			case CHARACTERISTIC_KIND.INCREASE_DECREASE:
				switch (this.increaseDecreaseKind) {
					case INCREASE_DECREASE_KIND.STAT_VALUE: {
						const statID = this.statisticValueID.getValue() as number;
						const stat = Datas.BattleSystems.getStatistic(statID);
						let value = (this.value.getValue() as number) * (this.isIncreaseDecrease ? 1 : -1);
						const baseStatValue =
							gamePlayer[stat.getAbbreviationNext()] - gamePlayer[stat.getBonusAbbreviation()];
						if (this.operation) {
							// *
							value = this.unit
								? baseStatValue * Math.round((baseStatValue * value) / 100)
								: baseStatValue * value; // % / Fix
						} else {
							// +
							value = this.unit ? Math.round((baseStatValue * value) / 100) : value; // % / Fix
						}
						return [statID, value];
					}
					case INCREASE_DECREASE_KIND.ELEMENT_RES: {
						const statID = this.unit
							? Datas.BattleSystems.getStatisticElementPercent(this.elementResID.getValue() as number)
							: Datas.BattleSystems.getStatisticElement(this.elementResID.getValue() as number);
						const stat = Datas.BattleSystems.getStatistic(statID);
						let value = (this.value.getValue() as number) * (this.isIncreaseDecrease ? 1 : -1);
						if (this.operation) {
							// *
							value *= gamePlayer[stat.getAbbreviationNext()] - gamePlayer[stat.getBonusAbbreviation()];
						}
						return [statID, value];
					}
					default:
						return null;
				}
			default:
				return null;
		}
	}

	/**
	 * Apply increase/decrease values to a specific resistance.
	 * @param res - The resistance object to modify.
	 */
	setIncreaseDecreaseValues(res: CharacteristicResType): void {
		let propName = '';
		let id = 0;
		switch (this.increaseDecreaseKind) {
			case INCREASE_DECREASE_KIND.STATUS_RES:
				propName = 'statusRes';
				id = this.statusResID.getValue() as number;
				break;
			case INCREASE_DECREASE_KIND.EXPERIENCE_GAIN:
				propName = 'experienceGain';
				id = 0;
				break;
			case INCREASE_DECREASE_KIND.CURRENCY_GAIN:
				propName = 'currencyGain';
				id = this.currencyGainID.getValue() as number;
				break;
			case INCREASE_DECREASE_KIND.SKILL_COST:
				propName = 'skillCostRes';
				id = this.isAllSkillCost ? -1 : (this.skillCostID.getValue() as number);
				break;
		}
		if (!res[propName][id]) {
			res[propName][id] = {
				multiplication: 1,
				addition: 0,
			};
		}
		const value = this.value.getValue() as number;
		if (this.operation) {
			// * (multiplication)
			const v = this.unit ? value / 100 : value;
			res[propName][id].multiplication *= this.isIncreaseDecrease ? v : 1 / v; // % / Fix
		} else {
			// + (addition)
			res[propName][id].addition += this.isIncreaseDecrease ? value : -value; // % / Fix
		}
	}

	/**
	 * Execute the characteristic's script.
	 * @param user - The player executing the script.
	 */
	executeScript(user: Player): void {
		Interpreter.evaluate(this.script.getValue() as string, { user, addReturn: false });
	}

	/**
	 * Get the string representation of the characteristic.
	 */
	toString(): string {
		const user = Scene.Map.current.user?.player ?? Player.getTemporaryPlayer();
		const target = Player.getTemporaryPlayer();
		let result = '';
		switch (this.kind) {
			case CHARACTERISTIC_KIND.INCREASE_DECREASE: {
				switch (this.increaseDecreaseKind) {
					case INCREASE_DECREASE_KIND.STAT_VALUE:
						result += Datas.BattleSystems.getStatistic(
							Interpreter.evaluate(this.statisticValueID.getValue() as string, {
								user,
								target,
							}) as number
						).name();
						break;
					case INCREASE_DECREASE_KIND.ELEMENT_RES:
						result +=
							Datas.BattleSystems.getElement(this.elementResID.getValue() as number).name() + ' res.';
						break;
					case INCREASE_DECREASE_KIND.STATUS_RES:
						result += Datas.Status.get(this.statusResID.getValue() as number).name() + ' res.';
						break;
					case INCREASE_DECREASE_KIND.EXPERIENCE_GAIN:
						result += Datas.BattleSystems.getExpStatistic().name() + ' gain';
						break;
					case INCREASE_DECREASE_KIND.CURRENCY_GAIN:
						result += Datas.Systems.getCurrency(this.currencyGainID.getValue() as number).name() + ' gain';
						break;
					case INCREASE_DECREASE_KIND.SKILL_COST:
						if (this.isAllSkillCost) {
							result += 'All skills cost';
						} else {
							result += Datas.Skills.get(this.skillCostID.getValue() as number).name() + ' skill cost';
						}
						break;
					case INCREASE_DECREASE_KIND.VARIABLE:
						result += Datas.Variables.get(this.variableID);
						break;
				}
				result += ' ';
				let sign = this.isIncreaseDecrease ? 1 : -1;
				const value = this.value.getValue() as number;
				sign *= Math.sign(value);
				if (this.operation) {
					result += 'x';
					if (sign === -1) {
						result += '/';
					}
				} else {
					if (sign === 1) {
						result += '+';
					} else if (sign === -1) {
						result += '-';
					}
				}
				result += Math.abs(value);
				if (this.unit) {
					result += '%';
				}
				break;
			}
			default:
				break;
		}
		return result;
	}

	/**
	 * Read the JSON associated to the characteristic.
	 */
	read(json: CharacteristicJSON): void {
		this.kind = Utils.valueOrDefault(json.k, CHARACTERISTIC_KIND.INCREASE_DECREASE);
		switch (this.kind) {
			case CHARACTERISTIC_KIND.INCREASE_DECREASE:
				this.isIncreaseDecrease = Utils.valueOrDefault(json.iid, true);
				this.increaseDecreaseKind = Utils.valueOrDefault(json.idk, INCREASE_DECREASE_KIND.STAT_VALUE);
				switch (this.increaseDecreaseKind) {
					case INCREASE_DECREASE_KIND.STAT_VALUE:
						this.statisticValueID = DynamicValue.readOrDefaultDatabase(json.svid);
						break;
					case INCREASE_DECREASE_KIND.ELEMENT_RES:
						this.elementResID = DynamicValue.readOrDefaultDatabase(json.erid);
						break;
					case INCREASE_DECREASE_KIND.STATUS_RES:
						this.statusResID = DynamicValue.readOrDefaultDatabase(json.strid);
						break;
					case INCREASE_DECREASE_KIND.CURRENCY_GAIN:
						this.currencyGainID = DynamicValue.readOrDefaultDatabase(json.cgid);
						break;
					case INCREASE_DECREASE_KIND.SKILL_COST:
						this.skillCostID = DynamicValue.readOrDefaultDatabase(json.scid);
						this.isAllSkillCost = Utils.valueOrDefault(json.iasc, true);
						break;
					case INCREASE_DECREASE_KIND.VARIABLE:
						this.variableID = Utils.valueOrDefault(json.vid, 1);
						break;
				}
				this.operation = Utils.valueOrDefault(json.o, true);
				this.value = DynamicValue.readOrDefaultNumber(json.v);
				this.unit = Utils.valueOrDefault(json.u, true);
				break;
			case CHARACTERISTIC_KIND.SCRIPT:
				this.script = DynamicValue.readOrDefaultMessage(json.s);
				break;
			case CHARACTERISTIC_KIND.ALLOW_FORBID_EQUIP:
				this.isAllowEquip = Utils.valueOrDefault(json.iae, true);
				this.isAllowEquipWeapon = Utils.valueOrDefault(json.iaew, true);
				this.equipWeaponTypeID = DynamicValue.readOrDefaultDatabase(json.ewtid);
				this.equipArmorTypeID = DynamicValue.readOrDefaultDatabase(json.eatid);
				break;
			case CHARACTERISTIC_KIND.ALLOW_FORBID_CHANGE:
				this.isAllowChangeEquipment = Utils.valueOrDefault(json.iace, true);
				this.changeEquipmentID = DynamicValue.readOrDefaultDatabase(json.ceid);
				break;
			case CHARACTERISTIC_KIND.BEGIN_EQUIPMENT:
				this.beginEquipmentID = DynamicValue.readOrDefaultDatabase(json.beid);
				this.isBeginWeapon = Utils.valueOrDefault(json.ibw, true);
				this.beginWeaponArmorID = DynamicValue.readOrDefaultDatabase(json.bwaid);
				break;
			case CHARACTERISTIC_KIND.ELEMENT:
				this.elementID = Model.DynamicValue.readOrDefaultDatabase(json.eid);
				break;
		}
	}
}
