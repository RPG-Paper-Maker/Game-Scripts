/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {
	CHARACTER_KIND,
	DAMAGES_KIND,
	EFFECT_KIND,
	EFFECT_SPECIAL_ACTION_KIND,
	Interpreter,
	Mathf,
	Utils,
} from '../Common';
import { Battler, Game, Player, ReactionInterpreter } from '../Core';
import { Data, EventCommand, Manager, Scene } from '../index';
import { Base } from './Base';
import { CommonSkillItem } from './CommonSkillItem';
import { DynamicValue, DynamicValueJSON } from './DynamicValue';
import { ReactionCommandJSON } from './Reaction';

/**
 * JSON schema for a skill or item effect.
 */
export type EffectJSON = {
	k?: number;
	dk?: number;
	dsid?: DynamicValueJSON;
	dcid?: DynamicValueJSON;
	dvid?: number;
	df?: DynamicValueJSON;
	idmin?: boolean;
	dmin?: DynamicValueJSON;
	idmax?: boolean;
	dmax?: DynamicValueJSON;
	ide?: boolean;
	deid?: DynamicValueJSON;
	idv?: boolean;
	dvf?: DynamicValueJSON;
	idc?: boolean;
	dcf?: DynamicValueJSON;
	idp?: boolean;
	dpf?: DynamicValueJSON;
	idsv?: boolean;
	dsv?: number;
	iddn?: boolean;
	iast?: boolean;
	sid?: DynamicValueJSON;
	spf?: DynamicValueJSON;
	iask?: boolean;
	asid?: DynamicValueJSON;
	psid?: DynamicValueJSON;
	cr?: ReactionCommandJSON;
	sak?: number;
	sf?: DynamicValueJSON;
	itct?: boolean;
	tctf?: DynamicValueJSON;
};

/**
 * Represents an effect of a skill or item.
 * Can be damages, status changes, skill additions/removals,
 * common reactions, special actions, or script effects.
 */
export class Effect extends Base {
	/** Kind of effect (damage, status, etc.). */
	public kind: EFFECT_KIND;

	// === Damage-related fields ===
	public damageKind?: DAMAGES_KIND;
	public damageStatisticID?: DynamicValue;
	public damageCurrencyID?: DynamicValue;
	public damageVariableID?: number;
	public damageFormula?: DynamicValue;
	public isDamagesMinimum?: boolean;
	public damagesMinimumFormula?: DynamicValue;
	public isDamagesMaximum?: boolean;
	public damagesMaximumFormula?: DynamicValue;
	public isDamageElement?: boolean;
	public damageElementID?: DynamicValue;
	public isDamageVariance?: boolean;
	public damageVarianceFormula?: DynamicValue;
	public isDamageCritical?: boolean;
	public damageCriticalFormula?: DynamicValue;
	public isDamagePrecision?: boolean;
	public damagePrecisionFormula?: DynamicValue;
	public isDamageStockVariableID?: boolean;
	public damageStockVariableID?: number;
	public isDamageDisplayName?: boolean;

	// === Status-related fields ===
	public isAddStatus?: boolean;
	public statusID?: DynamicValue;
	public statusPrecisionFormula?: DynamicValue;

	// === Skill-related fields ===
	public isAddSkill?: boolean;
	public addSkillID?: DynamicValue;
	public performSkillID?: DynamicValue;

	// === Common reaction ===
	public commonReaction?: EventCommand.CallACommonReaction;

	// === Special action ===
	public specialActionKind?: EFFECT_SPECIAL_ACTION_KIND;

	// === Script effect ===
	public scriptFormula?: DynamicValue;

	// === Target change ===
	public isTemporarilyChangeTarget?: boolean;
	public temporarilyChangeTargetFormula?: DynamicValue;

	/** Parent skill/item. */
	public skillItem: CommonSkillItem;

	/** Indicates if this effect can be skipped (used in HUD). */
	public canSkip = false;

	constructor(json?: EffectJSON) {
		super(json);
	}

	/**
	 * Checks if the effect is animated (for HUD/battle display).
	 */
	isAnimated(): boolean {
		return (
			this.kind === EFFECT_KIND.DAMAGES ||
			this.kind === EFFECT_KIND.STATUS ||
			this.kind === EFFECT_KIND.COMMON_REACTION
		);
	}

	/**
	 * Precomputes whether this effect hits/misses and if it is critical.
	 * Updates temporary miss/crit flags on each battler.
	 */
	getMissAndCrit(): void {
		const user = Scene.Map.current.user?.player ?? Player.getTemporaryPlayer();
		Scene.Map.current.tempTargets = Scene.Map.current.targets;
		if (this.isTemporarilyChangeTarget) {
			Scene.Map.current.targets = Interpreter.evaluate(this.temporarilyChangeTargetFormula.getValue() as string, {
				user,
			}) as Battler[];
		}
		const targets = Scene.Map.current.targets;
		switch (this.kind) {
			case EFFECT_KIND.DAMAGES: {
				let damage = 0;
				for (const battler of targets) {
					const target = battler.player;
					let miss = false;
					let crit = false;
					if (this.skillItem && !this.skillItem.isPossible(target, false)) {
						continue;
					}
					damage = 0;
					if (this.isDamagePrecision) {
						const precision = Interpreter.evaluate(this.damagePrecisionFormula.getValue() as string, {
							user,
							target,
						}) as number;
						if (!Mathf.randomPercentTest(precision)) {
							damage = null;
							miss = true;
						}
					}
					if (damage !== null) {
						if (this.isDamageCritical) {
							const critical = Interpreter.evaluate(this.damageCriticalFormula.getValue() as string, {
								user,
								target,
							}) as number;
							if (Mathf.randomPercentTest(critical)) {
								crit = true;
							}
						}
					}
					battler.tempIsDamagesMiss = miss;
					battler.tempIsDamagesCritical = crit;
				}
				break;
			}
			case EFFECT_KIND.STATUS: {
				for (const battler of targets) {
					const target = battler.player;
					let miss = false;
					let precision = Interpreter.evaluate(this.statusPrecisionFormula.getValue() as string, {
						user,
						target,
					}) as number;
					const id = this.statusID.getValue() as number;
					// Handle resistance
					if (target.statusRes[id]) {
						precision /= target.statusRes[id].multiplication;
						precision -= target.statusRes[id].addition;
					}
					if (!Mathf.randomPercentTest(precision)) {
						miss = true;
					}
					battler.tempIsDamagesMiss = miss;
				}
				break;
			}
			default: {
				for (const battler of targets) {
					battler.tempIsDamagesMiss = null;
					battler.tempIsDamagesCritical = null;
				}
				break;
			}
		}
	}

	/**
	 * Executes the effect logic on all targets.
	 * @param forceReaction - Whether to force common reactions immediately.
	 * @returns True if the effect had an impact, false otherwise.
	 */
	execute(forceReaction = false): boolean {
		const user = Scene.Map.current.user?.player ?? Player.getTemporaryPlayer();
		this.canSkip = false;
		Scene.Map.current.tempTargets = Scene.Map.current.targets;
		if (this.isTemporarilyChangeTarget) {
			Scene.Map.current.targets = Interpreter.evaluate(this.temporarilyChangeTargetFormula.getValue() as string, {
				user,
			}) as Battler[];
		}
		let result = false;
		switch (this.kind) {
			case EFFECT_KIND.DAMAGES:
				result = this.executeDamages(user);
				break;
			case EFFECT_KIND.STATUS:
				result = this.executeStatus(user);
				break;
			case EFFECT_KIND.ADD_REMOVE_SKILL:
				result = this.executeAddRemoveSkill();
				break;
			case EFFECT_KIND.PERFORM_SKILL:
				break;
			case EFFECT_KIND.COMMON_REACTION:
				result = this.executeCommonReaction(forceReaction);
				break;
			case EFFECT_KIND.SPECIAL_ACTIONS:
				result = this.executeSpecialAction();
				break;
			case EFFECT_KIND.SCRIPT: {
				result = this.executeScript(user);
				break;
			}
		}
		Scene.Map.current.targets = Scene.Map.current.tempTargets;
		return result;
	}

	/**
	 * Executes a damage effect on all current battle targets.
	 * @param user - The player performing the attack or skill.
	 * @returns `true` if at least one target’s state was modified, otherwise `false`.
	 */
	executeDamages(user: Player): boolean {
		let result = false;
		for (const battler of Scene.Map.current.targets) {
			const target = battler.player;
			if (this.skillItem && !this.skillItem.isPossible(target, false)) {
				battler.tempIsDamagesMiss = null;
				battler.tempIsDamagesCritical = null;
				continue;
			}
			let damage = 0;
			let damageName = '';
			let miss = false;
			let crit = false;

			// Calculate damages
			if (this.isDamagePrecision) {
				const precision = Interpreter.evaluate(this.damagePrecisionFormula.getValue() as string, {
					user,
					target,
				}) as number;
				if (
					battler.tempIsDamagesMiss ||
					(battler.tempIsDamagesMiss === null && !Mathf.randomPercentTest(precision))
				) {
					damage = null;
					miss = true;
				}
			}
			if (damage !== null) {
				damage = Interpreter.evaluate(this.damageFormula.getValue() as string, {
					user,
					target,
				}) as number;
				if (this.isDamageVariance) {
					const variance = Math.round(
						(damage *
							(Interpreter.evaluate(this.damageVarianceFormula.getValue() as string, {
								user,
								target,
							}) as number)) /
							100
					);
					damage = Mathf.random(damage - variance, damage + variance);
				}
				if (this.isDamageElement) {
					const element = this.damageElementID.getValue() as number;
					const modelElement = Data.BattleSystems.getElement(element);
					// If target also has elements
					for (const targetElement of target.elements) {
						const efficiency = modelElement.efficiency.get(targetElement.getValue() as number);
						damage *= efficiency ? (efficiency.getValue() as number) : 1;
					}
					const fixRes =
						target[
							Data.BattleSystems.getStatistic(Data.BattleSystems.getStatisticElement(element))
								.abbreviation
						];
					const percentRes =
						target[
							Data.BattleSystems.getStatistic(Data.BattleSystems.getStatisticElementPercent(element))
								.abbreviation
						];
					damage -= (damage * percentRes) / 100;
					damage -= fixRes;
				}
				if (this.isDamageCritical) {
					const critical = Interpreter.evaluate(this.damageCriticalFormula.getValue() as string, {
						user,
						target,
					}) as number;
					if (
						battler.tempIsDamagesCritical ||
						(battler.tempIsDamagesCritical === null && Mathf.randomPercentTest(critical))
					) {
						damage = Interpreter.evaluate(Data.BattleSystems.formulaCrit.getValue() as string, {
							user,
							target,
							damage,
						}) as number;
						crit = true;
					}
				}
				if (this.isDamagesMinimum) {
					damage = Math.max(
						damage,
						Interpreter.evaluate(this.damagesMinimumFormula.getValue() as string, {
							user,
							target,
						}) as number
					);
				}
				if (this.isDamagesMaximum) {
					damage = Math.min(
						damage,
						Interpreter.evaluate(this.damagesMaximumFormula.getValue() as string, {
							user,
							target,
						}) as number
					);
				}
				damage = Math.round(damage);
			}
			if (this.isDamageStockVariableID) {
				Game.current.variables.set(this.damageStockVariableID, damage === null ? 0 : damage);
			}
			if (this.isDamageDisplayName) {
				switch (this.damageKind) {
					case DAMAGES_KIND.STAT:
						damageName = Data.BattleSystems.getStatistic(
							this.damageStatisticID.getValue() as number
						).name();
						break;
					case DAMAGES_KIND.CURRENCY:
						damageName = Data.Systems.getCurrency(this.damageCurrencyID.getValue() as number).name();
						break;
					default:
						break;
				}
			}

			// For diplaying result in HUD
			if (Scene.Map.current.isBattleMap) {
				battler.damages = damage;
				battler.damagesName = damageName;
				battler.isDamagesMiss = miss;
				battler.isDamagesCritical = crit;
			}

			// Result accoring to damage kind
			switch (this.damageKind) {
				case DAMAGES_KIND.STAT: {
					const stat = Data.BattleSystems.getStatistic(this.damageStatisticID.getValue() as number);
					const abbreviation = stat.abbreviation;
					const max = target[stat.getMaxAbbreviation()];
					const before = target[abbreviation];
					target[abbreviation] -= damage;
					if (target[abbreviation] < 0) {
						target[abbreviation] = 0;
					}
					if (!stat.isFix) {
						target[abbreviation] = Math.min(target[abbreviation], max);
					}
					result = result || before !== target[abbreviation];
					break;
				}
				case DAMAGES_KIND.CURRENCY: {
					const currencyID = this.damageCurrencyID.getValue() as number;
					if (target.kind === CHARACTER_KIND.HERO) {
						const before = Game.current.getCurrency(currencyID);
						Game.current.addCurrency(currencyID, -damage);
						if (Game.current.getCurrency(currencyID) < 0) {
							Game.current.setCurrency(currencyID, 0);
						}
						result = result || before !== Game.current.getCurrency(currencyID);
					}
					break;
				}
				case DAMAGES_KIND.VARIABLE: {
					const before = Game.current.getVariable(this.damageVariableID);
					Game.current.variables.set(
						this.damageVariableID,
						Game.current.getVariable(this.damageVariableID) - damage
					);
					result = result || before !== Game.current.getVariable(this.damageVariableID);
					break;
				}
			}
			battler.tempIsDamagesMiss = null;
			battler.tempIsDamagesCritical = null;
		}
		return result;
	}

	/**
	 * Executes a status effect (add or remove) on all current battle targets.
	 * @param user - The player applying the status effect.
	 * @returns Always `true`, since the action itself was executed (even if missed).
	 */
	executeStatus(user: Player): boolean {
		this.canSkip = true;
		for (const battler of Scene.Map.current.targets) {
			const target = battler.player;
			const id = this.statusID.getValue() as number;
			if (!this.isAddStatus && !target.hasStatus(id)) {
				battler.damages = null;
				battler.isDamagesMiss = false;
				battler.isDamagesCritical = false;
				battler.lastStatus = null;
				battler.lastStatusHealed = null;
				battler.tempIsDamagesMiss = null;
				battler.tempIsDamagesCritical = null;
				continue;
			} else {
				this.canSkip = false;
			}
			let precision = Interpreter.evaluate(this.statusPrecisionFormula.getValue() as string, {
				user,
				target,
			}) as number;
			// Handle resistance
			if (target.statusRes[id]) {
				precision /= target.statusRes[id].multiplication;
				precision -= target.statusRes[id].addition;
			}
			let miss = true;
			if (
				battler.tempIsDamagesMiss === false ||
				(battler.tempIsDamagesMiss === null && Mathf.randomPercentTest(precision))
			) {
				miss = false;
				const previousFirst = battler.player.status[0];

				// Add or remove status
				if (this.isAddStatus) {
					battler.lastStatusHealed = null;
					battler.lastStatus = target.addStatus(id);
				} else {
					battler.lastStatusHealed = target.removeStatus(id);
					battler.lastStatus = null;
				}

				// If first status changed, change animation
				battler.updateAnimationStatus(previousFirst);
			}
			// For diplaying result in HUD
			if (Scene.Map.current.isBattleMap) {
				battler.damages = null;
				battler.isDamagesMiss = miss;
				battler.isDamagesCritical = false;
			}
			battler.tempIsDamagesMiss = null;
			battler.tempIsDamagesCritical = null;
		}
		return true;
	}

	/**
	 * Executes an add/remove skill effect on all current battle targets.
	 * Depending on `isAddSkill`, the corresponding skill is either learned or
	 * forgotten by each target.
	 * @returns Always `true`, since the action is always applied.
	 */
	executeAddRemoveSkill(): boolean {
		for (const battler of Scene.Map.current.targets) {
			const skillID = this.addSkillID.getValue() as number;
			if (this.isAddSkill) {
				battler.player.addSkill(skillID);
			} else {
				battler.player.removeSkill(skillID);
			}
		}
		return true;
	}

	/**
	 * Executes a common reaction event.
	 * Pushes a `ReactionInterpreter` into the manager stack to handle the
	 * common reaction. If `forceReaction` is true, the interpreters are
	 * updated immediately, and `canSkip` may be set if no reactions remain.
	 * @param forceReaction - Whether to immediately execute the common reaction.
	 * @returns Always `true`, since the action was initiated.
	 */
	executeCommonReaction(forceReaction: boolean): boolean {
		const reactionInterpreter = new ReactionInterpreter(
			null,
			Data.CommonEvents.getCommonReaction(this.commonReaction.commonReactionID),
			null,
			null,
			Utils.arrayToMap(this.commonReaction.parameters, true)
		);
		Manager.Stack.top.reactionInterpretersEffects.push(reactionInterpreter);
		if (forceReaction) {
			Manager.Stack.top.updateInterpreters();
			if (Manager.Stack.top.reactionInterpretersEffects.length === 0) {
				this.canSkip = true;
			}
		}
		return true;
	}

	/**
	 * Executes a special action in the battle system.
	 * @returns Always `true`, since the action was applied.
	 */
	executeSpecialAction(): boolean {
		Scene.Map.current.battleCommandKind = this.specialActionKind;
		return true;
	}

	/**
	 * Executes a script effect for the skill or item.
	 * @param user - The player executing the script.
	 * @returns Always `true`, since the script was executed.
	 */
	executeScript(user: Player): boolean {
		const script = this.scriptFormula.getValue() as string;
		if (Scene.Map.current.targets.length === 0) {
			Interpreter.evaluate(script, { addReturn: false, user, target: null });
		}
		for (const battler of Scene.Map.current.targets) {
			Interpreter.evaluate(script, { addReturn: false, user, target: battler.player });
		}
		return true;
	}

	/**
	 * Returns a human-readable string describing the effect.
	 */
	toString(): string {
		const user = Scene.Map.current.user?.player ?? Player.getTemporaryPlayer();
		const target = Player.getTemporaryPlayer();
		switch (this.kind) {
			case EFFECT_KIND.DAMAGES:
				return this.toStringDamages(user, target);
			case EFFECT_KIND.STATUS:
				return this.toStringStatus(user, target);
			case EFFECT_KIND.ADD_REMOVE_SKILL:
				return this.toStringAddRemoveSkill();
			case EFFECT_KIND.PERFORM_SKILL:
				return this.toStringPerformSkill();
			default:
				return '';
		}
	}

	/**
	 * Builds a human-readable string describing a damage effect.
	 * Evaluates the damage formula and applies variance, precision, and critical
	 * chance if configured.
	 * @param user - The player using the skill or item.
	 * @param target - The target player affected by the damage.
	 * @returns A formatted string describing the damage (or heal) effect,
	 *          or an empty string if the result is zero damage.
	 */
	toStringDamages(user: Player, target: Player): string {
		let damage = Interpreter.evaluate(this.damageFormula.getValue() as string, {
			user,
			target,
		}) as number;
		damage = Math.round(damage);
		if (damage === 0) {
			return '';
		}
		let precision = 100;
		let critical = 0;
		let variance = 0;
		if (this.isDamageVariance) {
			variance = Math.round(
				(damage *
					(Interpreter.evaluate(this.damageVarianceFormula.getValue() as string, {
						user,
						target,
					}) as number)) /
					100
			);
		}
		let min = damage - variance;
		let max = damage + variance;
		if (damage < 0) {
			const temp = min;
			min = -max;
			max = -temp;
		}
		const options = [];
		if (this.isDamagePrecision) {
			precision = Interpreter.evaluate(this.damagePrecisionFormula.getValue() as string, {
				user,
				target,
			}) as number;
			options.push(`${Data.Languages.extras.precision.name()}: ${precision}%`);
		}
		if (this.isDamageCritical) {
			critical = Interpreter.evaluate(this.damageCriticalFormula.getValue() as string, {
				user,
				target,
			}) as number;
			options.push(`${Data.Languages.extras.critical.name()}: ${critical}%`);
		}
		let damageName = '';
		switch (this.damageKind) {
			case DAMAGES_KIND.STAT:
				damageName = Data.BattleSystems.getStatistic(this.damageStatisticID.getValue() as number).name();
				break;
			case DAMAGES_KIND.CURRENCY:
				damageName = Data.Systems.getCurrency(this.damageCurrencyID.getValue() as number).name();
				break;
			case DAMAGES_KIND.VARIABLE:
				damageName = Data.Variables.get(this.damageVariableID);
				break;
		}
		return `${
			damage > 0 ? Data.Languages.extras.damage.name() : Data.Languages.extras.heal.name()
		} ${damageName}: ${min === max ? min : min + ' - ' + max}${
			options.length > 0 ? ` [${options.join(' - ')}]` : ''
		}`;
	}

	/**
	 * Builds a human-readable string describing a status effect.
	 * Includes whether the effect adds or removes a status, the status name,
	 * and the precision percentage.
	 * @param user - The player applying the status effect.
	 * @param target - The target player affected by the status effect.
	 * @returns A formatted string describing the status effect.
	 */
	toStringStatus(user: Player, target: Player): string {
		return `${
			this.isAddStatus ? Data.Languages.extras.add.name() : Data.Languages.extras.remove.name()
		} ${Data.Status.get(
			this.statusID.getValue() as number
		).name()} [${Data.Languages.extras.precision.name()}: ${Interpreter.evaluate(
			this.statusPrecisionFormula.getValue() as string,
			{ user, target }
		)}%]`;
	}

	/**
	 * Builds a human-readable string describing an add/remove skill effect.
	 * Indicates whether the effect adds or removes a skill and includes the
	 * name of the skill.
	 * @returns A formatted string describing the add/remove skill effect.
	 */
	toStringAddRemoveSkill(): string {
		return `${
			this.isAddSkill ? Data.Languages.extras.add.name() : Data.Languages.extras.remove.name()
		} ${Data.Languages.extras.skill.name()} ${Data.Skills.get(this.addSkillID.getValue() as number).name()}`;
	}

	/**
	 * Builds a human-readable string describing a perform skill effect.
	 * Indicates which skill will be performed.
	 *
	 * @returns A formatted string describing the perform skill effect.
	 */
	toStringPerformSkill(): string {
		return `${Data.Languages.extras.performSkill.name()} ${Data.Skills.get(
			this.performSkillID.getValue() as number
		).name()}`;
	}

	/**
	 * Reads the JSON data describing this effect.
	 * @param json - The JSON object containing the effect data.
	 */
	read(json: EffectJSON): void {
		this.kind = Utils.valueOrDefault(json.k, EFFECT_KIND.DAMAGES);
		switch (this.kind) {
			case EFFECT_KIND.DAMAGES: {
				this.damageKind = Utils.valueOrDefault(json.dk, DAMAGES_KIND.STAT);
				switch (this.damageKind) {
					case DAMAGES_KIND.STAT:
						this.damageStatisticID = DynamicValue.readOrDefaultDatabase(json.dsid);
						break;
					case DAMAGES_KIND.CURRENCY:
						this.damageCurrencyID = DynamicValue.readOrDefaultDatabase(json.dcid);
						break;
					case DAMAGES_KIND.VARIABLE:
						this.damageVariableID = Utils.valueOrDefault(json.dvid, 1);
						break;
				}
				this.damageFormula = DynamicValue.readOrDefaultMessage(json.df);
				this.isDamagesMinimum = Utils.valueOrDefault(json.idmin, true);
				this.damagesMinimumFormula = DynamicValue.readOrDefaultMessage(json.dmin, '0');
				this.isDamagesMaximum = Utils.valueOrDefault(json.idmax, false);
				this.damagesMaximumFormula = DynamicValue.readOrDefaultMessage(json.dmax, '0');
				this.isDamageElement = Utils.valueOrDefault(json.ide, false);
				this.damageElementID = DynamicValue.readOrDefaultDatabase(json.deid);
				this.isDamageVariance = Utils.valueOrDefault(json.idv, false);
				this.damageVarianceFormula = DynamicValue.readOrDefaultMessage(json.dvf, '0');
				this.isDamageCritical = Utils.valueOrDefault(json.idc, false);
				this.damageCriticalFormula = DynamicValue.readOrDefaultMessage(json.dcf, '0');
				this.isDamagePrecision = Utils.valueOrDefault(json.idp, false);
				this.damagePrecisionFormula = DynamicValue.readOrDefaultMessage(json.dpf, '100');
				this.isDamageStockVariableID = Utils.valueOrDefault(json.idsv, false);
				this.damageStockVariableID = Utils.valueOrDefault(json.dsv, 1);
				this.isDamageDisplayName = Utils.valueOrDefault(json.iddn, false);
				break;
			}
			case EFFECT_KIND.STATUS:
				this.isAddStatus = Utils.valueOrDefault(json.iast, true);
				this.statusID = DynamicValue.readOrDefaultDatabase(json.sid);
				this.statusPrecisionFormula = DynamicValue.readOrDefaultMessage(json.spf, '100');
				break;
			case EFFECT_KIND.ADD_REMOVE_SKILL:
				this.isAddSkill = Utils.valueOrDefault(json.iask, true);
				this.addSkillID = DynamicValue.readOrDefaultDatabase(json.asid);
				break;
			case EFFECT_KIND.PERFORM_SKILL:
				this.performSkillID = DynamicValue.readOrDefaultDatabase(json.psid);
				break;
			case EFFECT_KIND.COMMON_REACTION:
				this.commonReaction =
					json.cr === undefined
						? null
						: (Manager.Events.getEventCommand(json.cr) as EventCommand.CallACommonReaction);
				break;
			case EFFECT_KIND.SPECIAL_ACTIONS:
				this.specialActionKind = Utils.valueOrDefault(json.sak, EFFECT_SPECIAL_ACTION_KIND.APPLY_WEAPONS);
				break;
			case EFFECT_KIND.SCRIPT:
				this.scriptFormula = DynamicValue.readOrDefaultMessage(json.sf);
				break;
		}
		this.isTemporarilyChangeTarget = Utils.valueOrDefault(json.itct, false);
		this.temporarilyChangeTargetFormula = DynamicValue.readOrDefaultMessage(json.tctf);
	}
}
