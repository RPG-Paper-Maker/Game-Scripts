/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Data, Graphic, Manager, Model, Scene } from '..';
import {
	ANIMATION_EFFECT_CONDITION_KIND,
	ANIMATION_POSITION_KIND,
	ArrayUtils,
	BATTLE_STEP,
	BATTLER_STEP,
	CHARACTER_KIND,
	EFFECT_KIND,
	EFFECT_SPECIAL_ACTION_KIND,
	ITEM_KIND,
} from '../Common';
import { Animation, Battler, Game, Item } from '../Core';

// -------------------------------------------------------
//
//  CLASS SceneBattle
//
//      SubStep 0 : Animation user + animation sprite
//      SubStep 1 : Animation target
//      SubStep 2 : Damages
//
// -------------------------------------------------------

class BattleAnimation {
	public battle: Scene.Battle;
	public runOnEnemy = false;
	private pendingBattlerStep: BATTLER_STEP = BATTLER_STEP.NORMAL;

	public constructor(battle: Scene.Battle) {
		this.battle = battle;
	}

	/**
	 *  Initialize step.
	 */
	public initialize() {
		let content: Model.CommonSkillItem;
		switch (this.battle.battleCommandKind) {
			case EFFECT_SPECIAL_ACTION_KIND.APPLY_WEAPONS:
				this.battle.informationText = this.battle.attackSkill.getMessage(this.battle.user);
				break;
			case EFFECT_SPECIAL_ACTION_KIND.OPEN_SKILLS:
				if (this.battle.forceAnAction) {
					content = this.battle.skill;
				} else {
					content =
						this.battle.attackingGroup === CHARACTER_KIND.HERO
							? this.battle.battleStartTurn.active
								? this.battle.currentSkill
								: (<Graphic.Skill>this.battle.windowChoicesSkills.getCurrentContent()).system
							: Data.Skills.get(this.battle.action.skillID.getValue() as number);
				}
				this.battle.informationText = content.getMessage(this.battle.user);
				break;
			case EFFECT_SPECIAL_ACTION_KIND.OPEN_ITEMS:
				if (this.battle.forceAnAction) {
					content = this.battle.skill;
				} else {
					content =
						this.battle.attackingGroup === CHARACTER_KIND.HERO
							? (<Graphic.Item>this.battle.windowChoicesItems.getCurrentContent()).item.system
							: Data.Items.get(this.battle.action.itemID.getValue() as number);
				}
				this.battle.informationText = content.getMessage(this.battle.user);
				break;
			case EFFECT_SPECIAL_ACTION_KIND.NONE: // If command was a skill without special action
				content = <Model.Skill>(
					(<Graphic.TextIcon>(
						this.battle.windowChoicesBattleCommands.getContent(this.battle.user.lastCommandIndex)
					)).system
				);
				this.battle.informationText = content.getMessage(this.battle.user);
				break;
			default:
				this.battle.informationText = '';
				break;
		}
		(<Graphic.Text>this.battle.windowTopInformations.content).setText(this.battle.informationText);
		this.battle.time = new Date().getTime();
		this.battle.effects = [];
		this.runOnEnemy = false;
		let i: number, l: number;
		switch (this.battle.battleCommandKind) {
			case EFFECT_SPECIAL_ACTION_KIND.APPLY_WEAPONS:
				this.addWeaponsEffects();
				if (this.battle.effects.length === 0) {
					this.battle.animationUser = new Animation(Data.Skills.get(1).animationUserID.getValue() as number);
					this.battle.animationTarget = new Animation(
						Data.Skills.get(1).animationTargetID.getValue() as number,
					);
					const effects = this.battle.attackSkill.getEffects();
					for (i = 1, l = effects.length; i < l; i++) {
						this.battle.effects.push(effects[i]);
					}
				}
				this.runOnEnemy = this.battle.attackSkill.runOnEnemy.getValue() as boolean;
				this.battle.user.setAttacking();
				break;
			case EFFECT_SPECIAL_ACTION_KIND.OPEN_SKILLS:
			case EFFECT_SPECIAL_ACTION_KIND.NONE: {
				this.battle.animationUser = new Animation(content.animationUserID.getValue() as number);
				this.battle.animationTarget = new Animation(content.animationTargetID.getValue() as number);
				this.battle.effects = content.getEffects();
				const index = this.battle.effects.findIndex(
					(effect) => effect.specialActionKind === EFFECT_SPECIAL_ACTION_KIND.APPLY_WEAPONS,
				);
				if (index !== -1) {
					this.addWeaponsEffects(index);
				}
				content.cost();
				this.runOnEnemy = content.runOnEnemy.getValue() as boolean;
				this.battle.user.setUsingSkill();
				break;
			}
			case EFFECT_SPECIAL_ACTION_KIND.OPEN_ITEMS:
				const graphic = <Graphic.Item>this.battle.windowChoicesItems.getCurrentContent();
				this.battle.animationUser = new Animation(content.animationUserID.getValue() as number);
				this.battle.animationTarget = new Animation(content.animationTargetID.getValue() as number);
				this.battle.effects = content.getEffects();
				if (this.battle.user.player.kind === CHARACTER_KIND.HERO) {
					Game.current.useItem(graphic.item);
				}
				this.runOnEnemy = content.runOnEnemy.getValue() as boolean;
				this.battle.user.setUsingItem();
				break;
			case EFFECT_SPECIAL_ACTION_KIND.END_TURN:
				this.battle.time -= Scene.Battle.TIME_ACTION_ANIMATION;
				let user: Battler;
				for (i = 0, l = this.battle.battlers[CHARACTER_KIND.HERO].length; i < l; i++) {
					user = this.battle.battlers[CHARACTER_KIND.HERO][i];
					user.setActive(false);
					user.setSelected(false);
				}
				this.battle.subStep = 2;
				break;
			case EFFECT_SPECIAL_ACTION_KIND.DO_NOTHING:
				this.battle.time -= Scene.Battle.TIME_ACTION_ANIMATION;
				this.battle.subStep = 2;
				break;
		}
		this.battle.currentEffectIndex = -1;
		if (this.battle.effects.length > 0) {
			this.battle.effects[0].getMissAndCrit();
		}
		this.battle.currentTargetIndex = null;
		// For ForceAnAction: skip the sprite attacking animation wait in substep 0
		if (this.battle.forceAnAction && this.battle.user) {
			this.battle.user.frameAttacking.value = Data.Systems.FRAMES - 1;
		}
		if (this.battle.animationUser && this.battle.animationUser.model === null) {
			this.battle.animationUser = null;
		}
		if (this.battle.animationTarget && this.battle.animationTarget.model === null) {
			this.battle.animationTarget = null;
		}
		if (this.runOnEnemy) {
			this.pendingBattlerStep = this.battle.user.step;
			this.battle.user.step = BATTLER_STEP.NORMAL;
			this.battle.user.updateUVs();
			this.startRunToTarget();
			this.battle.subStep = 3;
		}
	}

	addWeaponsEffects(index = -1): void {
		if (this.battle.user.player.kind === CHARACTER_KIND.HERO) {
			const equipments = this.battle.user.player.equip;
			let j: number, m: number, gameItem: Item, weapon: Model.Weapon;
			for (let i = 0, l = equipments.length; i < l; i++) {
				gameItem = equipments[i];
				if (gameItem && gameItem.kind === ITEM_KIND.WEAPON) {
					weapon = gameItem.system;
					this.battle.animationUser = new Animation(weapon.animationUserID.getValue() as number);
					this.battle.animationTarget = new Animation(weapon.animationTargetID.getValue() as number);
					const effects = weapon.getEffects();
					for (j = 0, m = effects.length; j < m; j++) {
						if (index === -1) {
							this.battle.effects.push(effects[j]);
						} else {
							ArrayUtils.insert(this.battle.effects, index + j, effects[j]);
						}
					}
				}
			}
		}
	}

	/**
	 *  Get the animation efect condition kind.
	 *  @returns {ANIMATION_EFFECT_CONDITION_KIND}
	 */
	public getCondition(): ANIMATION_EFFECT_CONDITION_KIND {
		for (const target of this.battle.targets) {
			if (target.tempIsDamagesMiss) {
				return ANIMATION_EFFECT_CONDITION_KIND.MISS;
			}
			if (target.tempIsDamagesCritical) {
				return ANIMATION_EFFECT_CONDITION_KIND.CRITICAL;
			}
		}
		return ANIMATION_EFFECT_CONDITION_KIND.HIT;
	}

	/**
	 *  Update the targets attacked and check if they are dead.
	 */
	public updateTargetsAttacked() {
		let target: Battler, isAttacked: boolean;
		for (let i = 0, l = this.battle.targets.length; i < l; i++) {
			target = this.battle.targets[i];
			isAttacked = (target.damages > 0 || target == null) && !target.isDamagesMiss;
			target.updateDead(isAttacked, this.battle.user ? this.battle.user.player : null);

			// Release status after attacked
			if (this.battle.currentEffectIndex === 0 && isAttacked) {
				target.player.removeAfterAttackedStatus(target);
			}
		}
	}

	/**
	 *  Update the battle.
	 */
	public update() {
		let i: number, l: number;
		switch (this.battle.subStep) {
			case 0: // Animation user
				// Before animation, wait for enemy moving
				if (this.battle.user.moving) {
					return;
				}

				// User animation if exists
				if (this.battle.animationUser) {
					this.battle.animationUser.update();
					this.battle.animationUser.playSounds(this.getCondition());
					Manager.Stack.requestPaintHUD = true;
				}

				// Test if animation finished
				if (
					(!this.battle.animationUser ||
						this.battle.animationUser.frame > this.battle.animationUser.model.maxFrameID) &&
					!this.battle.user.isAttacking()
				) {
					if (!this.battle.animationTarget) {
						if (this.runOnEnemy) {
							this.battle.user.step = BATTLER_STEP.NORMAL;
							this.battle.user.updateUVs();
							this.startRunBack();
							this.battle.subStep = 4;
						} else {
							this.battle.time =
								new Date().getTime() -
								Scene.Battle.TIME_ACTION_ANIMATION +
								Scene.Battle.TIME_ACTION_NO_ANIMATION;
							for (i = 0, l = this.battle.targets.length; i < l; i++) {
								this.battle.targets[i].timeDamage = 0;
							}
							this.battle.subStep = 2;
						}
					} else {
						if (this.runOnEnemy) {
							this.battle.currentEffectIndex++;
							for (l = this.battle.effects.length; this.battle.currentEffectIndex < l; this.battle.currentEffectIndex++) {
								const effect = this.battle.effects[this.battle.currentEffectIndex];
								effect.execute(true);
								if (!effect.canSkip && effect.isAnimated()) {
									if (effect.kind === EFFECT_KIND.STATUS) {
										this.battle.currentTargetIndex = -1;
									}
									break;
								}
							}
							this.updateTargetsAttacked();
							for (i = 0, l = this.battle.targets.length; i < l; i++) {
								this.battle.targets[i].timeDamage = 0;
							}
						}
						this.battle.subStep = 1;
					}
				}
				break;
			case 1: // Animation target
				// Target animation if exists
				this.battle.animationTarget.update();
				this.battle.animationTarget.playSounds(this.getCondition());
				Manager.Stack.requestPaintHUD = true;
				if (this.battle.animationTarget.frame > this.battle.animationTarget.model.maxFrameID) {
					if (this.runOnEnemy) {
						this.battle.user.step = BATTLER_STEP.NORMAL;
						this.battle.user.updateUVs();
						this.startRunBack();
						this.battle.subStep = 4;
					} else {
						this.battle.time = new Date().getTime() - Scene.Battle.TIME_ACTION_ANIMATION;
						for (i = 0, l = this.battle.targets.length; i < l; i++) {
							this.battle.targets[i].timeDamage = 0;
						}
						this.battle.subStep = 2;
					}
				}
				break;
			case 3: // Run to target
				if (this.battle.user.isRunMoving) {
					this.battle.user.updateRunMove();
					return;
				}
				this.battle.user.step = this.pendingBattlerStep;
				this.battle.user.updateUVs();
				this.battle.subStep = 0;
				break;
			case 4: // Run back
				if (this.battle.user.isRunMoving) {
					this.battle.user.updateRunMove();
					return;
				}
				this.battle.time = new Date().getTime() - Scene.Battle.TIME_ACTION_ANIMATION;
				for (i = 0, l = this.battle.targets.length; i < l; i++) {
					this.battle.targets[i].timeDamage = 0;
				}
				this.battle.subStep = 2;
				break;
			case 2: // Damages
				// If calling a common reaction, wait for it to be finished
				if (this.battle.reactionInterpretersEffects.length > 0 && !this.battle.forceAnAction) {
					for (i = 0, l = this.battle.targets.length; i < l; i++) {
						this.battle.targets[i].timeDamage = 0;
						this.battle.targets[i].damages = null;
						this.battle.targets[i].isDamagesMiss = false;
						this.battle.targets[i].isDamagesCritical = false;
					}
					return;
				}
				if (new Date().getTime() - this.battle.time >= Scene.Battle.TIME_ACTION_ANIMATION) {
					for (i = 0, l = this.battle.targets.length; i < l; i++) {
						this.battle.targets[i].updateDead(false);
					}
					if (this.battle.user) {
						this.battle.user.updateDead(false);
					}

					// Testing end of battle
					let isAnotherEffect: boolean;
					// Apply effect
					if (this.battle.currentTargetIndex === null) {
						this.battle.currentEffectIndex++;
						for (
							l = this.battle.effects.length;
							this.battle.currentEffectIndex < l;
							this.battle.currentEffectIndex++
						) {
							const effect = this.battle.effects[this.battle.currentEffectIndex];
							effect.execute(true);
							if (!effect.canSkip && effect.isAnimated()) {
								if (effect.kind === EFFECT_KIND.STATUS) {
									this.battle.currentTargetIndex = -1;
								}
								break;
							}
						}
					}
					// Status message
					if (this.battle.currentTargetIndex !== null) {
						let target: Battler;
						this.battle.currentTargetIndex++;
						const messages: string[] = [];
						for (
							l = this.battle.targets.length;
							this.battle.currentTargetIndex < l;
							this.battle.currentTargetIndex++
						) {
							target = this.battle.targets[this.battle.currentTargetIndex];
							if (!target.isDamagesMiss) {
								if (target.lastStatus !== null) {
									messages.push(
										target.player.kind === CHARACTER_KIND.HERO
											? target.lastStatus.getMessageAllyAffected(target)
											: target.lastStatus.getMessageEnemyAffected(target),
									);
								}
								if (target.lastStatusHealed !== null) {
									messages.push(target.lastStatusHealed.getMessageHealed(target));
								}
							}
						}
						(<Graphic.Text>this.battle.windowTopInformations.content).setText(messages.join(' '));
						this.battle.currentTargetIndex = null;
					}
					// Target attacked
					this.updateTargetsAttacked();

					isAnotherEffect =
						this.battle.currentEffectIndex < this.battle.effects.length ||
						this.battle.currentTargetIndex !== null;
					if (isAnotherEffect) {
						this.battle.time = new Date().getTime() - Scene.Battle.TIME_ACTION_ANIMATION / 2;
						for (i = 0, l = this.battle.targets.length; i < l; i++) {
							this.battle.targets[i].timeDamage = 0;
						}
						return;
					} else {
						let target: Battler;
						for (i = 0, l = this.battle.targets.length; i < l; i++) {
							target = this.battle.targets[i];
							target.updateDead(false);
							target.damages = null;
							target.isDamagesMiss = false;
							target.isDamagesCritical = false;
						}
						if (this.battle.user) {
							if (!this.battle.forceAnAction || this.battle.forceAnActionUseTurn) {
								this.battle.user.setActive(false);
								this.battle.user.setSelected(false);
							}
							if (this.battle.targets.length > 0) {
								this.battle.user.lastTarget = target;
							}
						}
					}

					if (this.battle.isWin()) {
						this.battle.winning = true;
						this.battle.activeGroup();
						this.battle.changeStep(BATTLE_STEP.VICTORY);
					} else if (this.battle.isLose()) {
						this.battle.winning = false;
						this.battle.changeStep(BATTLE_STEP.VICTORY);
					} else {
						if (this.battle.forceAnAction) {
							this.battle.forceAnAction = false;
							this.battle.step = this.battle.previousStep;
							this.battle.subStep = this.battle.previousSubStep;
							this.battle.currentEffectIndex = this.battle.previousCurrentEffectIndex;
							this.battle.effects = this.battle.previousEffects;
							this.battle.informationText = this.battle.previousInformationText;
							(<Graphic.Text>this.battle.windowTopInformations.content).setText(
								this.battle.informationText,
							);
							return;
						} else {
							// Testing end of turn
							if (this.battle.battleStartTurn.active) {
								this.battle.changeStep(BATTLE_STEP.START_TURN);
								return;
							}
							if (this.battle.isEndTurn()) {
								this.battle.changeStep(BATTLE_STEP.END_TURN);
							} else {
								if (this.battle.attackingGroup === CHARACTER_KIND.HERO) {
									this.battle.changeStep(BATTLE_STEP.SELECTION); // Attack of heroes
								} else {
									this.battle.changeStep(BATTLE_STEP.ENEMY_ATTACK); // Attack of ennemies
								}
							}
						}
					}
				}
				break;
		}
	}

	/**
	 *  Handle key pressed.
	 *   @param {number} key - The key ID
	 */
	public onKeyPressedStep(key: string) {}

	/**
	 *  Handle key released.
	 *  @param {number} key - The key ID
	 */
	public onKeyReleasedStep(key: string) {}

	/**
	 *  Handle key repeat pressed.
	 *  @param {number} key - The key ID
	 *  @returns {boolean}
	 */
	public onKeyPressedRepeatStep(key: string): boolean {
		return true;
	}

	/**
	 *  Handle key pressed and repeat.
	 *  @param {number} key - The key ID
	 *  @returns {boolean}
	 */
	public onKeyPressedAndRepeatStep(key: string): boolean {
		return true;
	}

	/**
	 *  Draw the battle HUD.
	 */
	public drawHUDStep() {
		this.battle.windowTopInformations.draw();

		// Draw animations
		if (this.battle.animationUser) {
			this.battle.animationUser.draw(this.battle.user);
		}
		let i: number, l: number;
		if (this.battle.animationTarget) {
			if (this.battle.animationTarget.model.positionKind === ANIMATION_POSITION_KIND.SCREEN_CENTER) {
				this.battle.animationTarget.draw(null);
			} else {
				for (i = 0, l = this.battle.targets.length; i < l; i++) {
					this.battle.animationTarget.draw(this.battle.targets[i]);
				}
			}
		}

		// Draw damages
		if (
			(this.battle.reactionInterpretersEffects.length === 0 || this.battle.forceAnAction) &&
			(this.battle.user === null || !this.battle.user.isAttacking()) &&
			(this.runOnEnemy ||
				!this.battle.animationTarget ||
				this.battle.animationTarget.frame > this.battle.animationTarget.model.maxFrameID)
		) {
			for (i = 0, l = this.battle.targets.length; i < l; i++) {
				this.battle.targets[i].drawDamages();
			}
		}
	}


	private startRunToTarget(): void {
		const targets = this.battle.targets;
		let targetX = 0;
		let targetZ = 0;
		let avgTargetWidth = 0;
		for (const target of targets) {
			targetX += target.mesh.position.x;
			targetZ += target.mesh.position.z;
			avgTargetWidth += target.width;
		}
		targetX /= targets.length;
		targetZ /= targets.length;
		avgTargetWidth /= targets.length;
		const offset = (avgTargetWidth / 2) * Data.Systems.SQUARE_SIZE;
		const directionX = Math.sign(this.battle.user.position.x - targetX);
		this.battle.user.startRunTo(targetX + directionX * offset, targetZ);
	}

	private startRunBack(): void {
		this.battle.user.startRunBack();
	}
}

export { BattleAnimation };
