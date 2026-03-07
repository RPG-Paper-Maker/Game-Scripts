/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {
	AVAILABLE_KIND,
	DAMAGES_KIND,
	EFFECT_KIND,
	EFFECT_SPECIAL_ACTION_KIND,
	Interpreter,
	ITEM_KIND,
	SONG_KIND,
	TARGET_KIND,
	Utils,
} from '../Common';
import { Battler, Player } from '../Core';
import { Data, Scene } from '../index';
import { Characteristic, CharacteristicJSON } from './Characteristic';
import { Cost, CostJSON } from './Cost';
import { DynamicValue, DynamicValueJSON } from './DynamicValue';
import { Effect, EffectJSON } from './Effect';
import { Icon, IconJSON } from './Icon';
import { Localization, LocalizationJSON } from './Localization';
import { PlaySong, PlaySongJSON } from './PlaySong';
import { WeaponArmorKind } from './WeaponArmorKind';

/**
 * JSON schema for a common skill/item/weapon/armor.
 */
export type CommonSkillItemJSON = IconJSON & {
	id: number;
	t?: number;
	con?: boolean;
	oh?: boolean;
	d?: LocalizationJSON;
	tk?: TARGET_KIND;
	tcf?: DynamicValueJSON;
	cf?: DynamicValueJSON;
	ak?: AVAILABLE_KIND;
	s?: PlaySongJSON;
	auid?: DynamicValueJSON;
	atid?: DynamicValueJSON;
	roe?: DynamicValueJSON;
	canBeSold?: DynamicValueJSON;
	battleMessage?: LocalizationJSON;
	p?: CostJSON[];
	cos?: CostJSON[];
	e?: EffectJSON[];
	car?: CharacteristicJSON[];
};

/**
 * A common class for skills, items, weapons, and armors.
 */
class CommonSkillItem extends Icon {
	public id: number;
	public hasType: boolean;
	public hasTARGET_KIND: boolean;
	public type: number;
	public consumable: boolean;
	public oneHand: boolean;
	public description: Localization;
	public targetKind: TARGET_KIND;
	public targetConditionFormula: DynamicValue;
	public conditionFormula: DynamicValue;
	public availableKind: number;
	public sound: PlaySong;
	public animationID: DynamicValue;
	public animationTargetID: DynamicValue;
	public runOnEnemy: DynamicValue;
	public canBeSold: DynamicValue;
	public battleMessage: Localization;
	public price: Cost[];
	public costs: Cost[];
	public effects: Effect[];
	public characteristics: Characteristic[];
	public animationUserID: DynamicValue;

	constructor(json?: CommonSkillItemJSON) {
		super(json);
	}

	/**
	 * Reads the JSON data describing the common skill/item/weapon/armor.
	 * @param json - The JSON object containing all properties.
	 */
	read(json: CommonSkillItemJSON) {
		super.read(json);
		this.id = json.id;
		this.type = Utils.valueOrDefault(json.t, 1);
		this.consumable = Utils.valueOrDefault(json.con, false);
		this.oneHand = Utils.valueOrDefault(json.oh, true);
		this.description = new Localization(json.d);
		this.targetKind = Utils.valueOrDefault(json.tk, TARGET_KIND.NONE);
		this.targetConditionFormula = DynamicValue.readOrNone(json.tcf);
		this.conditionFormula = DynamicValue.readOrNone(json.cf);
		this.availableKind = Utils.valueOrDefault(json.ak, AVAILABLE_KIND.NEVER);
		this.sound = new PlaySong(SONG_KIND.SOUND, json.s);
		this.animationUserID = DynamicValue.readOrNone(json.auid);
		this.animationTargetID = DynamicValue.readOrNone(json.atid);
		this.runOnEnemy = DynamicValue.readOrDefaultSwitch(json.roe, false);
		this.canBeSold = DynamicValue.readOrDefaultSwitch(json.canBeSold);
		this.battleMessage = new Localization(json.battleMessage);
		this.price = Utils.readJSONList(json.p, Cost);
		this.costs = Utils.readJSONList(json.cos, Cost);
		for (const cost of this.costs) {
			cost.skillItem = this;
		}
		this.effects = Utils.readJSONList(json.e, Effect);
		for (const effect of this.effects) {
			effect.skillItem = this;
		}
		this.characteristics = Utils.readJSONList(json.car, Characteristic);
	}

	/**
	 * Gets all effects, including nested effects from perform skill actions.
	 * @returns Array of {@link Effect}.
	 */
	getEffects(): Effect[] {
		const effects: Effect[] = [];
		for (const effect of this.effects) {
			if (effect.kind === EFFECT_KIND.PERFORM_SKILL) {
				const skill = Data.Skills.get(effect.performSkillID.getValue() as number);
				effects.push(...skill.getEffects());
			} else {
				effects.push(effect);
			}
		}
		return effects;
	}

	/**
	 * Uses the command if possible.
	 * @returns True if the command can be used.
	 */
	useCommand(): boolean {
		const possible = this.isPossible();
		if (possible) {
			this.use(false);
		}
		return possible;
	}

	/**
	 * Executes effects and costs.
	 * @param useCost - Whether to apply costs.
	 * @returns True if any effect was executed.
	 */
	use(useCost = true): boolean {
		let isDoingSomething = false;
		for (const effect of this.getEffects()) {
			isDoingSomething = effect.execute() || isDoingSomething;
		}
		if (useCost && isDoingSomething) {
			for (const cost of this.costs) {
				cost.use();
			}
		}
		return isDoingSomething;
	}

	/**
	 * Applies all costs directly.
	 */
	cost(): void {
		for (const cost of this.costs) {
			cost.use();
		}
	}

	/**
	 * Checks if this skill/item is usable.
	 * @param target - Optional specific target to check.
	 * @param checkCost - Whether to check the costs.
	 * @returns True if usable.
	 */
	isPossible(target?: Player, checkCost = true): boolean {
		const targets = Scene.Map.current.getPossibleTargets(this.targetKind);
		const user = Scene.Map.current.user?.player ?? null;

		// Condition
		if (!Interpreter.evaluate(this.conditionFormula.getValue() as string)) {
			return false;
		}
		// Target condition : at least one target can be selected
		const fTargetCondition = (target: Player) => {
			return Interpreter.evaluate(this.targetConditionFormula.getValue() as string, { user, target });
		};
		if (target) {
			if (!fTargetCondition(target)) {
				return false;
			}
		} else if (this.targetKind !== TARGET_KIND.NONE && !targets.some(fTargetCondition)) {
			return false;
		}
		// If attack skill, also test on equipped weapons
		if (
			this.effects.some((effect) => {
				return (
					effect.kind === EFFECT_KIND.SPECIAL_ACTIONS &&
					effect.specialActionKind === EFFECT_SPECIAL_ACTION_KIND.APPLY_WEAPONS
				);
			})
		) {
			if (
				!Scene.Map.current.user.player.equip.some(
					(item) =>
						item === null ||
						!item.system.isWeapon() ||
						!Interpreter.evaluate(item.system.conditionFormula.getValue() as string) ||
						(target
							? Interpreter.evaluate(item.system.targetConditionFormula.getValue() as string, {
									user,
									target,
								})
							: targets.some((target) => {
									Interpreter.evaluate(item.system.targetConditionFormula.getValue() as string, {
										user,
										target,
									});
								})),
				)
			) {
				return false;
			}
		}
		// Skill cost
		if (checkCost) {
			for (const cost of this.costs) {
				if (!cost.isPossible()) {
					return false;
				}
			}
		}
		return true;
	}

	/**
	 * Gets a human-readable string for the target kind.
	 */
	getTargetKindString(): string {
		switch (this.targetKind) {
			case TARGET_KIND.NONE:
				return 'None';
			case TARGET_KIND.USER:
				return 'The user';
			case TARGET_KIND.ENEMY:
				return 'An enemy';
			case TARGET_KIND.ALLY:
				return 'An ally';
			case TARGET_KIND.ALL_ENEMIES:
				return 'All enemies';
			case TARGET_KIND.ALL_ALLIES:
				return 'All allies';
		}
	}

	/**
	 * Gets the weapon or armor type of this item.
	 * @returns The {@link WeaponArmorKind}, or null if not applicable.
	 */
	getType(): WeaponArmorKind {
		return null;
	}

	/**
	 * Gets the price of this item.
	 * @returns A record mapping item identifiers to `[DAMAGES_KIND, number]` tuples.
	 */
	getPrice(): Map<number, [DAMAGES_KIND, number]> {
		return Cost.getPrice(this.price);
	}

	/**
	 * Gets the item kind (weapon, armor, consumable, etc.).
	 * @returns The {@link ITEM_KIND}, or null if undefined.
	 */
	getKind(): ITEM_KIND {
		return null;
	}

	/**
	 * Checks if this item is a weapon.
	 * @returns True if the item is a weapon, false otherwise.
	 */
	isWeapon(): boolean {
		return this.getKind() === ITEM_KIND.WEAPON;
	}

	/**
	 * Checks if this item is an armor.
	 * @returns True if the item is an armor, false otherwise.
	 */
	isArmor(): boolean {
		return this.getKind() === ITEM_KIND.ARMOR;
	}

	/**
	 * Checks if this item is either a weapon or an armor.
	 * @returns True if the item is a weapon or armor, false otherwise.
	 */
	isWeaponArmor(): boolean {
		return this.isWeapon() || this.isArmor();
	}

	/**
	 * Gets a message describing the use of this item for a given battler.
	 * @param _user - The battler using the item.
	 * @returns The formatted message as a string (empty by default).
	 */
	getMessage(_user: Battler): string {
		return '';
	}
}

export { CommonSkillItem };
