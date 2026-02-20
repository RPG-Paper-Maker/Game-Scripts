/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model, Scene } from '..';
import { BATTLE_STEP, TROOP_REACTION_FREQUENCY_KIND } from '../Common';
import { ReactionInterpreter } from '../Core';

// -------------------------------------------------------
//
//  CLASS BattleEndTurn
//
// -------------------------------------------------------

class BattleEndTurn {
	public battle: Scene.Battle;
	public step: number = 0;
	public indexTroopReaction: number = 0;
	public interpreter: ReactionInterpreter = null;

	constructor(battle: Scene.Battle) {
		this.battle = battle;
	}

	/**
	 *  Initialize step.
	 */
	public initialize() {
		// Each end turn troop reaction
		if (this.step === 0) {
			const reactions = this.battle.troop.reactions;
			let reaction: Model.TroopReaction, l: number;
			for (l = reactions.length; this.indexTroopReaction < l; this.indexTroopReaction++) {
				reaction = reactions[this.indexTroopReaction];
				if (reaction.frequency === TROOP_REACTION_FREQUENCY_KIND.EACH_TURN_END) {
					// Check conditions
					if (!reaction.conditions.isValid()) {
						continue;
					}
					this.interpreter = new ReactionInterpreter(null, reaction, null, null);
					return;
				}
			}
			this.interpreter = null;
			this.step++;
		}

		// End
		if (this.step === 1) {
			this.step = 0;
			this.indexTroopReaction = 0;
			this.battle.activeGroup();
			this.battle.switchAttackingGroup();
			this.battle.changeStep(BATTLE_STEP.START_TURN);
		}
	}

	/**
	 *  Update the battle.
	 */
	public update() {
		// Troop reactions
		if (this.step === 0) {
			this.interpreter.update();
			if (this.interpreter.isFinished()) {
				this.indexTroopReaction++;
				this.initialize();
				return;
			}
		}
	}

	/**
	 *  Handle key pressed.
	 *  @param {number} key - The key ID
	 */
	public onKeyPressedStep(key: string) {
		if (this.interpreter) {
			this.interpreter.onKeyPressed(key);
		}
	}

	/**
	 *  Handle key released.
	 *  @param {number} key - The key ID
	 */
	public onKeyReleasedStep(key: string) {
		if (this.interpreter) {
			this.interpreter.onKeyReleased(key);
		}
	}

	/**
	 *  Handle key repeat pressed.
	 *  @param {number} key - The key ID
	 *  @returns {boolean}
	 */
	public onKeyPressedRepeatStep(key: string): boolean {
		if (this.interpreter) {
			return this.interpreter.onKeyPressedRepeat(key);
		}
		return true;
	}

	/**
	 *  Handle key pressed and repeat.
	 *  @param {number} key - The key ID
	 *  @returns {boolean}
	 */
	public onKeyPressedAndRepeatStep(key: string): boolean {
		if (this.interpreter) {
			return this.interpreter.onKeyPressedAndRepeat(key);
		}
		return true;
	}

	/**
	 *  @inheritdoc
	 */
	onMouseDownStep(x: number, y: number) {
		if (this.interpreter) {
			this.interpreter.onMouseDown(x, y);
		}
	}

	/**
	 *  @inheritdoc
	 */
	onMouseMoveStep(x: number, y: number) {
		if (this.interpreter) {
			this.interpreter.onMouseMove(x, y);
		}
	}

	/**
	 *  @inheritdoc
	 */
	onMouseUpStep(x: number, y: number) {
		if (this.interpreter) {
			this.interpreter.onMouseUp(x, y);
		}
	}

	/**
	 *  Draw the battle HUD.
	 */
	public drawHUDStep() {
		this.battle.windowTopInformations.draw();
		if (this.interpreter) {
			this.interpreter.drawHUD();
		}
	}
}
export { BattleEndTurn };
