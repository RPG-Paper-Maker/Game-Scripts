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
import { Status } from '../Core/Status';
import { Datas, EventCommand, Manager, Scene, System } from '../index';
import { Base } from './Base';
import { Statistic } from './Statistic';

/** @class
 *  An effect of a common skill item.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  effect
 */
class Effect extends Base {
	public kind: EFFECT_KIND;
	public damageKind: DAMAGES_KIND;
	public damageStatisticID: System.DynamicValue;
	public damageCurrencyID: System.DynamicValue;
	public damageVariableID: number;
	public damageFormula: System.DynamicValue;
	public isDamagesMinimum: boolean;
	public damagesMinimumFormula: System.DynamicValue;
	public isDamagesMaximum: boolean;
	public damagesMaximumFormula: System.DynamicValue;
	public isDamageElement: boolean;
	public damageElementID: System.DynamicValue;
	public isDamageVariance: boolean;
	public damageVarianceFormula: System.DynamicValue;
	public isDamageCritical: boolean;
	public damageCriticalFormula: System.DynamicValue;
	public isDamagePrecision: boolean;
	public damagePrecisionFormula: System.DynamicValue;
	public isDamageStockVariableID: boolean;
	public damageStockVariableID: number;
	public isDamageDisplayName: boolean;
	public isAddStatus: boolean;
	public statusID: System.DynamicValue;
	public statusPrecisionFormula: System.DynamicValue;
	public isAddSkill: boolean;
	public addSkillID: System.DynamicValue;
	public performSkillID: System.DynamicValue;
	public commonReaction: EventCommand.CallACommonReaction;
	public specialActionKind: EFFECT_SPECIAL_ACTION_KIND;
	public scriptFormula: System.DynamicValue;
	public isTemporarilyChangeTarget: boolean;
	public temporarilyChangeTargetFormula: System.DynamicValue;
	public skillItem: System.CommonSkillItem;
	public canSkip = false;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Read the JSON associated to the effect.
	 *  @param {Record<string, any>} - json Json object describing the effect
	 */
	read(json: Record<string, any>) {
		this.kind = Utils.defaultValue(json.k, EFFECT_KIND.DAMAGES);
		switch (this.kind) {
			case EFFECT_KIND.DAMAGES: {
				this.damageKind = Utils.defaultValue(json.dk, DAMAGES_KIND.STAT);
				switch (this.damageKind) {
					case DAMAGES_KIND.STAT:
						this.damageStatisticID = System.DynamicValue.readOrDefaultDatabase(json.dsid);
						break;
					case DAMAGES_KIND.CURRENCY:
						this.damageCurrencyID = System.DynamicValue.readOrDefaultDatabase(json.dcid);
						break;
					case DAMAGES_KIND.VARIABLE:
						this.damageVariableID = Utils.defaultValue(json.dvid, 1);
						break;
				}
				this.damageFormula = System.DynamicValue.readOrDefaultMessage(json.df);
				this.isDamagesMinimum = Utils.defaultValue(json.idmin, true);
				this.damagesMinimumFormula = System.DynamicValue.readOrDefaultMessage(json.dmin, '0');
				this.isDamagesMaximum = Utils.defaultValue(json.idmax, false);
				this.damagesMaximumFormula = System.DynamicValue.readOrDefaultMessage(json.dmax, '0');
				this.isDamageElement = Utils.defaultValue(json.ide, false);
				this.damageElementID = System.DynamicValue.readOrDefaultDatabase(json.deid);
				this.isDamageVariance = Utils.defaultValue(json.idv, false);
				this.damageVarianceFormula = System.DynamicValue.readOrDefaultMessage(json.dvf, '0');
				this.isDamageCritical = Utils.defaultValue(json.idc, false);
				this.damageCriticalFormula = System.DynamicValue.readOrDefaultMessage(json.dcf, '0');
				this.isDamagePrecision = Utils.defaultValue(json.idp, false);
				this.damagePrecisionFormula = System.DynamicValue.readOrDefaultMessage(json.dpf, String(100));
				this.isDamageStockVariableID = Utils.defaultValue(json.idsv, false);
				this.damageStockVariableID = Utils.defaultValue(json.dsv, 1);
				this.isDamageDisplayName = Utils.defaultValue(json.iddn, false);
				break;
			}
			case EFFECT_KIND.STATUS:
				this.isAddStatus = Utils.defaultValue(json.iast, true);
				this.statusID = System.DynamicValue.readOrDefaultDatabase(json.sid);
				this.statusPrecisionFormula = System.DynamicValue.readOrDefaultMessage(json.spf, String(100));
				break;
			case EFFECT_KIND.ADD_REMOVE_SKILL:
				this.isAddSkill = Utils.defaultValue(json.iask, true);
				this.addSkillID = System.DynamicValue.readOrDefaultDatabase(json.asid);
				break;
			case EFFECT_KIND.PERFORM_SKILL:
				this.performSkillID = System.DynamicValue.readOrDefaultDatabase(json.psid);
				break;
			case EFFECT_KIND.COMMON_REACTION:
				this.commonReaction = <EventCommand.CallACommonReaction>(
					(json.cr === undefined ? null : Manager.Events.getEventCommand(json.cr))
				);
				break;
			case EFFECT_KIND.SPECIAL_ACTIONS:
				this.specialActionKind = Utils.defaultValue(json.sak, EFFECT_SPECIAL_ACTION_KIND.APPLY_WEAPONS);
				break;
			case EFFECT_KIND.SCRIPT:
				this.scriptFormula = System.DynamicValue.readOrDefaultMessage(json.sf);
				break;
		}
		this.isTemporarilyChangeTarget = Utils.defaultValue(json.itct, false);
		this.temporarilyChangeTargetFormula = System.DynamicValue.readOrDefaultMessage(json.tctf);
	}

	/**
	 *  Get if effect is miss in battler temp variables.
	 */
	getMissAndCrit() {
		const user = Scene.Map.current.user ? Scene.Map.current.user.player : Player.getTemporaryPlayer();
		Scene.Map.current.tempTargets = Scene.Map.current.targets;
		if (this.isTemporarilyChangeTarget) {
			Scene.Map.current.targets = Interpreter.evaluate(this.temporarilyChangeTargetFormula.getValue(), {
				user: user,
			}) as Battler[];
		}
		const targets = Scene.Map.current.targets;
		const l = targets.length;
		let target: Player, battler: Battler, precision: number, critical: number, miss: boolean, crit: boolean;
		switch (this.kind) {
			case EFFECT_KIND.DAMAGES: {
				let damage: number;
				for (let i = 0; i < l; i++) {
					battler = targets[i];
					target = battler.player;
					miss = false;
					crit = false;
					if (this.skillItem && !this.skillItem.isPossible(target, false)) {
						continue;
					}
					damage = 0;
					if (this.isDamagePrecision) {
						precision = Interpreter.evaluate(this.damagePrecisionFormula.getValue(), {
							user: user,
							target: target,
						}) as number;
						if (!Mathf.randomPercentTest(precision)) {
							damage = null;
							miss = true;
						}
					}
					if (damage !== null) {
						if (this.isDamageCritical) {
							critical = Interpreter.evaluate(this.damageCriticalFormula.getValue(), {
								user: user,
								target: target,
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
				let precision: number, id: number;
				for (let i = 0, l = targets.length; i < l; i++) {
					battler = targets[i];
					target = battler.player;
					miss = false;
					precision = Interpreter.evaluate(this.statusPrecisionFormula.getValue(), {
						user: user,
						target: battler.player,
					}) as number;
					id = this.statusID.getValue();
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
			}
			default: {
				for (const battler of targets) {
					battler.tempIsDamagesMiss = null;
					battler.tempIsDamagesCritical = null;
				}
			}
		}
	}

	/**
	 *  Execute the effect.
	 *  @returns {boolean}
	 */
	execute(forceReaction = false): boolean {
		const user = Scene.Map.current.user ? Scene.Map.current.user.player : Player.getTemporaryPlayer();
		this.canSkip = false;
		Scene.Map.current.tempTargets = Scene.Map.current.targets;
		if (this.isTemporarilyChangeTarget) {
			Scene.Map.current.targets = Interpreter.evaluate(this.temporarilyChangeTargetFormula.getValue(), {
				user: user,
			}) as Battler[];
		}
		const targets = Scene.Map.current.targets;
		let result = false;
		const l = targets.length;
		let target: Player, battler: Battler;
		switch (this.kind) {
			case EFFECT_KIND.DAMAGES: {
				let damage: number,
					damageName: string,
					miss: boolean,
					crit: boolean,
					precision: number,
					variance: number,
					fixRes: number,
					percentRes: number,
					element: number,
					critical: number,
					stat: Statistic,
					abbreviation: string,
					max: number,
					before: number,
					currencyID: number,
					targetElement: System.DynamicValue,
					systemElement: System.Element,
					efficiency: System.DynamicValue;
				for (let i = 0; i < l; i++) {
					battler = targets[i];
					target = battler.player;
					if (this.skillItem && !this.skillItem.isPossible(target, false)) {
						battler.tempIsDamagesMiss = null;
						battler.tempIsDamagesCritical = null;
						continue;
					}
					damage = 0;
					damageName = '';
					miss = false;
					crit = false;

					// Calculate damages
					if (this.isDamagePrecision) {
						precision = Interpreter.evaluate(this.damagePrecisionFormula.getValue(), {
							user: user,
							target: target,
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
						damage = Interpreter.evaluate(this.damageFormula.getValue(), {
							user: user,
							target: target,
						}) as number;
						if (this.isDamageVariance) {
							variance = Math.round(
								(damage *
									(Interpreter.evaluate(this.damageVarianceFormula.getValue(), {
										user: user,
										target: target,
									}) as number)) /
									100
							);
							damage = Mathf.random(damage - variance, damage + variance);
						}
						if (this.isDamageElement) {
							element = this.damageElementID.getValue();
							systemElement = Datas.BattleSystems.getElement(element);
							// If target also has elements
							for (targetElement of target.elements) {
								efficiency = systemElement.efficiency[targetElement.getValue()];
								damage *= efficiency ? efficiency.getValue() : 1;
							}
							fixRes =
								target[
									Datas.BattleSystems.getStatistic(Datas.BattleSystems.getStatisticElement(element))
										.abbreviation
								];
							percentRes =
								target[
									Datas.BattleSystems.getStatistic(
										Datas.BattleSystems.getStatisticElementPercent(element)
									).abbreviation
								];
							damage -= (damage * percentRes) / 100;
							damage -= fixRes;
						}
						if (this.isDamageCritical) {
							critical = Interpreter.evaluate(this.damageCriticalFormula.getValue(), {
								user: user,
								target: target,
							}) as number;
							if (
								battler.tempIsDamagesCritical ||
								(battler.tempIsDamagesCritical === null && Mathf.randomPercentTest(critical))
							) {
								damage = Interpreter.evaluate(Datas.BattleSystems.formulaCrit.getValue(), {
									user: user,
									target: target,
									damage: damage,
								}) as number;
								crit = true;
							}
						}
						if (this.isDamagesMinimum) {
							damage = Math.max(
								damage,
								Interpreter.evaluate(this.damagesMinimumFormula.getValue(), {
									user: user,
									target: target,
								}) as number
							);
						}
						if (this.isDamagesMaximum) {
							damage = Math.min(
								damage,
								Interpreter.evaluate(this.damagesMaximumFormula.getValue(), {
									user: user,
									target: target,
								}) as number
							);
						}
						damage = Math.round(damage);
					}
					if (this.isDamageStockVariableID) {
						Game.current.variables[this.damageStockVariableID] = damage === null ? 0 : damage;
					}
					if (this.isDamageDisplayName) {
						switch (this.damageKind) {
							case DAMAGES_KIND.STAT:
								damageName = Datas.BattleSystems.getStatistic(this.damageStatisticID.getValue()).name();
								break;
							case DAMAGES_KIND.CURRENCY:
								damageName = Datas.Systems.getCurrency(this.damageCurrencyID.getValue()).name();
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
						case DAMAGES_KIND.STAT:
							stat = Datas.BattleSystems.getStatistic(this.damageStatisticID.getValue());
							abbreviation = stat.abbreviation;
							max = target[stat.getMaxAbbreviation()];
							before = target[abbreviation];
							target[abbreviation] -= damage;
							if (target[abbreviation] < 0) {
								target[abbreviation] = 0;
							}
							if (!stat.isFix) {
								target[abbreviation] = Math.min(target[abbreviation], max);
							}
							result = result || before !== target[abbreviation];
							break;
						case DAMAGES_KIND.CURRENCY:
							currencyID = this.damageCurrencyID.getValue();
							if (target.kind === CHARACTER_KIND.HERO) {
								before = Game.current.currencies[currencyID];
								Game.current.currencies[currencyID] -= damage;
								if (Game.current.currencies[currencyID] < 0) {
									Game.current.currencies[currencyID] = 0;
								}
								result = result || before !== Game.current.currencies[currencyID];
							}
							break;
						case DAMAGES_KIND.VARIABLE:
							before = Game.current.variables[this.damageVariableID];
							Game.current.variables[this.damageVariableID] -= damage;
							result = result || before !== Game.current.variables[this.damageVariableID];
							break;
					}
					battler.tempIsDamagesMiss = null;
					battler.tempIsDamagesCritical = null;
				}
				break;
			}
			case EFFECT_KIND.STATUS: {
				let precision: number, miss: boolean, id: number, previousFirst: Status;
				this.canSkip = true;
				for (let i = 0, l = targets.length; i < l; i++) {
					battler = targets[i];
					target = battler.player;
					id = this.statusID.getValue();
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
					precision = Interpreter.evaluate(this.statusPrecisionFormula.getValue(), {
						user: user,
						target: battler.player,
					}) as number;
					// Handle resistance
					if (target.statusRes[id]) {
						precision /= target.statusRes[id].multiplication;
						precision -= target.statusRes[id].addition;
					}
					if (
						battler.tempIsDamagesMiss === false ||
						(battler.tempIsDamagesMiss === null && Mathf.randomPercentTest(precision))
					) {
						miss = false;
						previousFirst = battler.player.status[0];

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
					} else {
						miss = true;
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
				result = true;
				break;
			}
			case EFFECT_KIND.ADD_REMOVE_SKILL:
				for (battler of targets) {
					const skillID = this.addSkillID.getValue();
					if (this.isAddSkill) {
						battler.player.addSkill(skillID);
					} else {
						battler.player.removeSkill(skillID);
					}
				}
				result = true;
				break;
			case EFFECT_KIND.PERFORM_SKILL:
				break;
			case EFFECT_KIND.COMMON_REACTION:
				const reactionInterpreter = new ReactionInterpreter(
					null,
					Datas.CommonEvents.getCommonReaction(this.commonReaction.commonReactionID),
					null,
					null,
					this.commonReaction.parameters
				);
				Manager.Stack.top.reactionInterpretersEffects.push(reactionInterpreter);
				Manager.Stack.top.reactionInterpreters.push(reactionInterpreter);
				if (forceReaction) {
					Manager.Stack.top.updateInterpreters();
					if (Manager.Stack.top.reactionInterpretersEffects.length === 0) {
						this.canSkip = true;
					}
				}
				result = true;
				break;
			case EFFECT_KIND.SPECIAL_ACTIONS:
				Scene.Map.current.battleCommandKind = this.specialActionKind;
				result = true;
				break;
			case EFFECT_KIND.SCRIPT:
				const script = this.scriptFormula.getValue();
				if (targets.length === 0) {
					Interpreter.evaluate(script, { addReturn: false, user: user, target: null });
				}
				for (const target of targets) {
					Interpreter.evaluate(script, { addReturn: false, user: user, target: target.player });
				}
				result = true;
				break;
		}
		Scene.Map.current.targets = Scene.Map.current.tempTargets;
		return result;
	}

	/**
	 *  Check if the effect is animated.
	 *  @returns {boolean}
	 */
	isAnimated(): boolean {
		return (
			this.kind === EFFECT_KIND.DAMAGES ||
			this.kind === EFFECT_KIND.STATUS ||
			this.kind === EFFECT_KIND.COMMON_REACTION
		);
	}

	/**
	 *  Get the string representation of the effect.
	 *  @returns {string}
	 */
	toString(): string {
		const user = Scene.Map.current.user ? Scene.Map.current.user.player : Player.getTemporaryPlayer();
		const target = Player.getTemporaryPlayer();
		switch (this.kind) {
			case EFFECT_KIND.DAMAGES:
				let damage = Interpreter.evaluate(this.damageFormula.getValue(), {
					user: user,
					target: target,
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
							(Interpreter.evaluate(this.damageVarianceFormula.getValue(), {
								user: user,
								target: target,
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
					precision = Interpreter.evaluate(this.damagePrecisionFormula.getValue(), {
						user: user,
						target: target,
					}) as number;
					options.push(Datas.Languages.extras.precision.name() + ': ' + precision + '%');
				}
				if (this.isDamageCritical) {
					critical = Interpreter.evaluate(this.damageCriticalFormula.getValue(), {
						user: user,
						target: target,
					}) as number;
					options.push(Datas.Languages.extras.critical.name() + ': ' + critical + '%');
				}
				let damageName = '';
				switch (this.damageKind) {
					case DAMAGES_KIND.STAT:
						damageName = Datas.BattleSystems.getStatistic(this.damageStatisticID.getValue()).name();
						break;
					case DAMAGES_KIND.CURRENCY:
						damageName = Datas.Systems.getCurrency(this.damageCurrencyID.getValue()).name();
						break;
					case DAMAGES_KIND.VARIABLE:
						damageName = Datas.Variables.get(this.damageVariableID);
						break;
				}
				return (
					(damage > 0 ? Datas.Languages.extras.damage.name() : Datas.Languages.extras.heal.name()) +
					' ' +
					damageName +
					': ' +
					(min === max ? min : min + ' - ' + max) +
					(options.length > 0 ? ' [' + options.join(' - ') + ']' : '')
				);
			case EFFECT_KIND.STATUS:
				return (
					(this.isAddStatus ? Datas.Languages.extras.add.name() : Datas.Languages.extras.remove.name()) +
					' ' +
					Datas.Status.get(this.statusID.getValue()).name() +
					' [' +
					Datas.Languages.extras.precision.name() +
					': ' +
					Interpreter.evaluate(this.statusPrecisionFormula.getValue(), { user: user, target: target }) +
					'%]'
				);
			case EFFECT_KIND.ADD_REMOVE_SKILL:
				return (
					(this.isAddSkill ? Datas.Languages.extras.add.name() : Datas.Languages.extras.remove.name()) +
					' ' +
					Datas.Languages.extras.skill.name() +
					' ' +
					Datas.Skills.get(this.addSkillID.getValue()).name()
				);
			case EFFECT_KIND.PERFORM_SKILL:
				return (
					Datas.Languages.extras.performSkill.name() +
					' ' +
					Datas.Skills.get(this.performSkillID.getValue()).name()
				);
			default:
				return '';
		}
	}
}

export { Effect };
