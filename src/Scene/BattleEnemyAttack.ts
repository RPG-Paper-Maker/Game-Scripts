/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Data, Graphic, Model, Scene } from '..';
import {
	BATTLE_STEP,
	CHARACTER_KIND,
	EFFECT_KIND,
	EFFECT_SPECIAL_ACTION_KIND,
	Interpreter,
	Mathf,
	MONSTER_ACTION_KIND,
	MONSTER_ACTION_TARGET_KIND,
	STATUS_RESTRICTIONS_KIND,
	TARGET_KIND,
} from '../Common';
import { Battler, Game } from '../Core';

// -------------------------------------------------------
//
//  CLASS SceneBattle
//
//  Enemy attack (IA)
//
// -------------------------------------------------------

class BattleEnemyAttack {
	public battle: Scene.Battle;

	public constructor(battle: Scene.Battle) {
		this.battle = battle;
	}

	/**
	 *  Initialize step.
	 */
	initialize() {
		(<Graphic.Text>this.battle.windowTopInformations.content).setText('');

		// Define which monster will attack
		let exists = false;
		let i: number, l: number;
		for (i = 0, l = this.battle.battlers[CHARACTER_KIND.MONSTER].length; i < l; i++) {
			if (this.battle.isDefined(CHARACTER_KIND.MONSTER, i)) {
				exists = true;
				break;
			}
		}
		if (!exists) {
			this.battle.changeStep(BATTLE_STEP.END_TURN);
			return;
		}
		i = 0;
		do {
			this.battle.user = this.battle.battlers[CHARACTER_KIND.MONSTER][i];
			i++;
		} while (!this.battle.isDefined(CHARACTER_KIND.MONSTER, i - 1));

		// Define action
		this.defineAction();

		// Define targets
		this.defineTargets();

		this.battle.time = new Date().getTime();
		this.battle.timeEnemyAttack = new Date().getTime();
	}

	/**
	 *  Define the possible action to do.
	 */
	definePossibleActions(actions: Model.MonsterAction[], restriction: STATUS_RESTRICTIONS_KIND): number {
		let priorities = 0;
		const player = this.battle.user.player;
		const monster = <Model.Monster>player.system;
		const systemActions = monster.actions;

		// If status can't do anything, do nothing
		if (this.battle.user.containsRestriction(STATUS_RESTRICTIONS_KIND.CANT_DO_ANYTHING)) {
			return;
		}

		// List every possible actions
		let i: number, l: number, action: Model.MonsterAction, stat: Model.Statistic, number: number;
		for (i = 0, l = systemActions.length; i < l; i++) {
			action = systemActions[i];
			if (
				action.isConditionTurn &&
				!Mathf.OPERATORS_COMPARE[action.operationKindTurn](
					this.battle.turn,
					action.turnValueCompare.getValue() as number
				)
			) {
				continue;
			}
			if (action.isConditionStatistic) {
				stat = Data.BattleSystems.getStatistic(action.statisticID.getValue() as number);
				if (stat.isFix) {
					if (
						!Mathf.OPERATORS_COMPARE[action.operationKindStatistic](
							player[stat.abbreviation],
							action.statisticValueCompare.getValue() as number
						)
					) {
						continue;
					}
				} else {
					if (
						!Mathf.OPERATORS_COMPARE[action.operationKindStatistic](
							(player[stat.abbreviation] / player[stat.getMaxAbbreviation()]) * 100,
							action.statisticValueCompare.getValue() as number
						)
					) {
						continue;
					}
				}
			}
			if (
				action.isConditionVariable &&
				!Mathf.OPERATORS_COMPARE[action.operationKindVariable](
					Game.current.getVariable(action.variableID),
					action.variableValueCompare.getValue() as number
				)
			) {
				continue;
			}
			if (action.isConditionStatus && !player.hasStatus(action.statusID.getValue() as number)) {
				continue;
			}
			if (action.isConditionScript && !Interpreter.evaluate(action.script.getValue() as string)) {
				continue;
			}
			if (action.actionKind === MONSTER_ACTION_KIND.USE_SKILL) {
				const skill = Data.Skills.get(action.skillID.getValue() as number);
				if (
					!skill.isPossible() ||
					this.battle.user.containsRestriction(STATUS_RESTRICTIONS_KIND.CANT_USE_SKILLS)
				) {
					continue;
				}
				if (
					restriction === STATUS_RESTRICTIONS_KIND.ATTACK_RANDOM_ALLY &&
					skill.targetKind !== TARGET_KIND.ALL_ENEMIES &&
					skill.targetKind !== TARGET_KIND.ENEMY
				) {
					continue;
				}
				if (
					restriction === STATUS_RESTRICTIONS_KIND.ATTACK_RANDOM_ENEMY &&
					skill.targetKind !== TARGET_KIND.ALL_ENEMIES &&
					skill.targetKind !== TARGET_KIND.ENEMY
				) {
					continue;
				}
				if (
					restriction === STATUS_RESTRICTIONS_KIND.ATTACK_RANDOM_TARGET &&
					skill.targetKind !== TARGET_KIND.ALL_ENEMIES &&
					skill.targetKind !== TARGET_KIND.ENEMY
				) {
					continue;
				}
			}
			if (action.actionKind === MONSTER_ACTION_KIND.USE_ITEM) {
				number = this.battle.user.itemsNumbers[action.itemID.getValue() as number];
				if (
					(number !== undefined && number === 0) ||
					this.battle.user.containsRestriction(STATUS_RESTRICTIONS_KIND.CANT_USE_ITEMS)
				) {
					continue;
				}
			}

			// Push to possible actions if passing every conditions
			actions.push(action);
			priorities += action.priority.getValue() as number;
		}
		return priorities;
	}

	/**
	 *  Define the action to do.
	 */
	defineAction(restriction: STATUS_RESTRICTIONS_KIND = STATUS_RESTRICTIONS_KIND.NONE) {
		const actions = [];
		this.battle.action = this.battle.actionDoNothing;
		this.battle.battleCommandKind = EFFECT_SPECIAL_ACTION_KIND.DO_NOTHING;
		const priorities = this.definePossibleActions(actions, restriction);

		// If no action
		if (priorities <= 0) {
			return;
		}

		// Random
		const random = Mathf.random(0, 100);
		let step = 0;
		let value: number, action: Model.MonsterAction;
		for (let i = 0, l = actions.length; i < l; i++) {
			action = actions[i];
			value = ((action.priority.getValue() as number) / priorities) * 100;
			if (random >= step && random <= value + step) {
				this.battle.action = action;
				break;
			}
			step += value;
		}

		// Define battle command kind
		switch (this.battle.action.actionKind) {
			case MONSTER_ACTION_KIND.USE_SKILL:
				const effect = Data.Skills.get(this.battle.action.skillID.getValue() as number).getEffects()[0];
				if (effect) {
					this.battle.battleCommandKind =
						effect.kind === EFFECT_KIND.SPECIAL_ACTIONS
							? effect.specialActionKind
							: EFFECT_SPECIAL_ACTION_KIND.OPEN_SKILLS;
				} else {
					this.battle.battleCommandKind = EFFECT_SPECIAL_ACTION_KIND.OPEN_SKILLS;
				}
				this.battle.attackSkill = Data.Skills.get(this.battle.action.skillID.getValue() as number);
				break;
			case MONSTER_ACTION_KIND.USE_ITEM:
				this.battle.battleCommandKind = EFFECT_SPECIAL_ACTION_KIND.OPEN_ITEMS;

				// If item, use one
				const id = this.battle.action.itemID.getValue() as number;
				this.battle.user.itemsNumbers[id] =
					(this.battle.user.itemsNumbers[id]
						? this.battle.user.itemsNumbers[id]
						: (this.battle.action.itemNumberMax.getValue() as number)) - 1;
				break;
			case MONSTER_ACTION_KIND.DO_NOTHING:
				this.battle.battleCommandKind = EFFECT_SPECIAL_ACTION_KIND.DO_NOTHING;
				break;
		}
	}

	/**
	 *  Define the targets
	 */
	defineTargets(restriction: STATUS_RESTRICTIONS_KIND = STATUS_RESTRICTIONS_KIND.NONE) {
		if (!this.battle.action) {
			this.battle.targets = [];
			return;
		}

		// Verify if the target is not all allies or all enemies and define side
		let targetKind: TARGET_KIND, side: CHARACTER_KIND;
		switch (this.battle.action.actionKind) {
			case MONSTER_ACTION_KIND.USE_SKILL:
				this.battle.skill = Data.Skills.get(this.battle.action.skillID.getValue() as number);
				targetKind = this.battle.skill.targetKind;
				break;
			case MONSTER_ACTION_KIND.USE_ITEM:
				this.battle.skill = Data.Items.get(this.battle.action.itemID.getValue() as number);
				targetKind = this.battle.skill.targetKind;
				break;
			case MONSTER_ACTION_KIND.DO_NOTHING:
				this.battle.skill = null;
				this.battle.targets = [];
				return;
		}
		switch (targetKind) {
			case TARGET_KIND.NONE:
				this.battle.targets = [];
				return;
			case TARGET_KIND.USER:
				this.battle.targets = [this.battle.user];
				return;
			case TARGET_KIND.ENEMY:
				switch (restriction) {
					case STATUS_RESTRICTIONS_KIND.ATTACK_RANDOM_ALLY:
						side = CHARACTER_KIND.MONSTER;
						break;
					case STATUS_RESTRICTIONS_KIND.ATTACK_RANDOM_ENEMY:
						side = CHARACTER_KIND.HERO;
						break;
					case STATUS_RESTRICTIONS_KIND.ATTACK_RANDOM_TARGET:
						side = Mathf.random(0, 1) === 0 ? CHARACTER_KIND.MONSTER : CHARACTER_KIND.HERO;
						break;
					default:
						side = CHARACTER_KIND.HERO;
						break;
				}
				break;
			case TARGET_KIND.ALLY:
				switch (restriction) {
					case STATUS_RESTRICTIONS_KIND.ATTACK_RANDOM_ALLY:
						side = CHARACTER_KIND.MONSTER;
						break;
					case STATUS_RESTRICTIONS_KIND.ATTACK_RANDOM_ENEMY:
						side = CHARACTER_KIND.HERO;
						break;
					case STATUS_RESTRICTIONS_KIND.ATTACK_RANDOM_TARGET:
						side = Mathf.random(0, 1) === 0 ? CHARACTER_KIND.MONSTER : CHARACTER_KIND.HERO;
						break;
					default:
						side = CHARACTER_KIND.MONSTER;
						break;
				}
				break;
			case TARGET_KIND.ALL_ENEMIES:
				switch (restriction) {
					case STATUS_RESTRICTIONS_KIND.ATTACK_RANDOM_ALLY:
						this.battle.targets = this.battle.battlers[CHARACTER_KIND.MONSTER];
						return;
					case STATUS_RESTRICTIONS_KIND.ATTACK_RANDOM_ENEMY:
						this.battle.targets = this.battle.battlers[CHARACTER_KIND.HERO];
						return;
					case STATUS_RESTRICTIONS_KIND.ATTACK_RANDOM_TARGET:
						this.battle.targets =
							Mathf.random(0, 1) === 0
								? this.battle.battlers[CHARACTER_KIND.MONSTER]
								: this.battle.battlers[CHARACTER_KIND.HERO];
						return;
				}
				this.battle.targets = this.battle.battlers[CHARACTER_KIND.HERO];
				return;
			case TARGET_KIND.ALL_ALLIES:
				switch (restriction) {
					case STATUS_RESTRICTIONS_KIND.ATTACK_RANDOM_ALLY:
						this.battle.targets = this.battle.battlers[CHARACTER_KIND.HERO];
						return;
					case STATUS_RESTRICTIONS_KIND.ATTACK_RANDOM_ENEMY:
						this.battle.targets = this.battle.battlers[CHARACTER_KIND.MONSTER];
						return;
					case STATUS_RESTRICTIONS_KIND.ATTACK_RANDOM_TARGET:
						this.battle.targets =
							Mathf.random(0, 1) === 0
								? this.battle.battlers[CHARACTER_KIND.MONSTER]
								: this.battle.battlers[CHARACTER_KIND.HERO];
						return;
				}
				this.battle.targets = this.battle.battlers[CHARACTER_KIND.MONSTER];
				return;
		}

		// Select one enemy / ally according to target kind
		const l = this.battle.battlers[side].length;
		const targetKindAction =
			restriction === STATUS_RESTRICTIONS_KIND.NONE
				? this.battle.action.targetKind
				: MONSTER_ACTION_TARGET_KIND.RANDOM;
		let i: number, target: Battler;
		switch (targetKindAction) {
			case MONSTER_ACTION_TARGET_KIND.RANDOM:
				i = Mathf.random(0, l - 1);
				while (!this.battle.isDefined(side, i, true)) {
					i++;
					i = i % l;
				}
				target = this.battle.battlers[side][i];
				break;
			case MONSTER_ACTION_TARGET_KIND.WEAK_ENEMIES:
				i = 0;
				while (!this.battle.isDefined(side, i, true)) {
					i++;
					i = i % l;
				}
				target = this.battle.battlers[side][i];
				const minHP = target.player['hp'];
				let tempTarget: Battler, tempHP: Battler;
				while (i < l) {
					tempTarget = this.battle.battlers[side][i];
					if (this.battle.isDefined(side, i, true)) {
						tempHP = tempTarget.player['hp'];
						if (tempHP < minHP) {
							target = tempTarget;
						}
					}
					i++;
				}
				break;
		}
		this.battle.targets = [target];
	}

	/**
	 *  Update the battle
	 */
	update() {
		if (new Date().getTime() - this.battle.time >= 500) {
			if (this.battle.action.actionKind !== MONSTER_ACTION_KIND.DO_NOTHING) {
				this.battle.user.setSelected(true);
			}
			if (new Date().getTime() - this.battle.timeEnemyAttack >= 1000) {
				this.battle.changeStep(BATTLE_STEP.ANIMATION);
			}
		}
	}

	/**
	 *  Handle key pressed.
	 *  @param {number} key - The key ID
	 */
	onKeyPressedStep(key: string) {}

	/**
	 *  Handle key released.
	 *   @param {number} key - The key ID
	 */
	onKeyReleasedStep(key: string) {}

	/**
	 *  Handle key repeat pressed.
	 *  @param {number} key - The key ID
	 *  @returns {boolean}
	 */
	onKeyPressedRepeatStep(key: string): boolean {
		return true;
	}

	/**
	 *  Handle key pressed and repeat.
	 *  @param {number} key - The key ID
	 *  @returns {boolean}
	 */
	onKeyPressedAndRepeatStep(key: string): boolean {
		return true;
	}

	/**
	 *  Draw the battle HUD.
	 */
	drawHUDStep() {
		this.battle.windowTopInformations.draw();
	}
}

export { BattleEnemyAttack };
