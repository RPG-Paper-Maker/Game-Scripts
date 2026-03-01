/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BATTLE_STEP, CHARACTER_KIND, EFFECT_SPECIAL_ACTION_KIND, Mathf, TARGET_KIND, Utils } from '../Common';
import { Battler, MapObject } from '../Core';
import { Data, Model, Scene } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for forcing an action in a battler.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class ForceAnAction extends Base {
	public battlerKind: number;
	public battlerEnemyIndex: number;
	public battlerHeroEnemyInstanceID: Model.DynamicValue;
	public actionKind: number;
	public actionID: Model.DynamicValue;
	public targetKind: number;
	public targetCustomKind: number;
	public targetEnemyIndex: number;
	public targetHeroEnemyInstanceID: Model.DynamicValue;
	public useBattlerTurn: boolean;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.battlerKind = command[iterator.i++];
		switch (this.battlerKind) {
			case 0:
				this.battlerEnemyIndex = command[iterator.i++];
				break;
			case 1:
				this.battlerHeroEnemyInstanceID = Model.DynamicValue.createValueCommand(command, iterator);
				break;
		}
		this.actionKind = command[iterator.i++];
		if (this.actionKind !== 2) {
			this.actionID = Model.DynamicValue.createValueCommand(command, iterator);
		}
		this.targetKind = command[iterator.i++];
		if (this.targetKind === 2) {
			this.targetCustomKind = command[iterator.i++];
			switch (this.targetCustomKind) {
				case 0:
					this.targetEnemyIndex = command[iterator.i++];
					break;
				case 1:
					this.targetHeroEnemyInstanceID = Model.DynamicValue.createValueCommand(command, iterator);
					break;
			}
		}
		this.useBattlerTurn = Utils.numberToBool(command[iterator.i++]);
	}

	/**
	 *  Initialize the current state.
	 *  @returns {Record<string, any>} The current state
	 */
	initialize(): Record<string, any> {
		if (!Scene.Map.current.isBattleMap) {
			return {};
		}
		const map = <Scene.Battle>Scene.Map.current;
		map.forceAnAction = true;
		// Battler (user)
		let side: CHARACTER_KIND;
		switch (this.battlerKind) {
			case 0: // Enemy
				Scene.Map.current.user = map.battlers[CHARACTER_KIND.MONSTER][this.battlerEnemyIndex];
				side = CHARACTER_KIND.MONSTER;
				break;
			case 1: // Hero instance ID
				const id = this.battlerHeroEnemyInstanceID.getValue() as number;
				Scene.Map.current.user = null;
				for (const battler of map.battlers[CHARACTER_KIND.HERO]) {
					if (battler.player.instid === id) {
						Scene.Map.current.user = battler;
						side = CHARACTER_KIND.HERO;
						break;
					}
				}
				for (const battler of map.battlers[CHARACTER_KIND.MONSTER]) {
					if (battler.player.instid === id) {
						Scene.Map.current.user = battler;
						side = CHARACTER_KIND.MONSTER;
						break;
					}
				}
				break;
		}
		// Action
		switch (this.actionKind) {
			case 0: // Skill
				map.battleCommandKind = EFFECT_SPECIAL_ACTION_KIND.OPEN_SKILLS;
				map.skill = Data.Skills.get(this.actionID.getValue() as number);
				break;
			case 1: // Item
				map.battleCommandKind = EFFECT_SPECIAL_ACTION_KIND.OPEN_ITEMS;
				map.skill = Data.Items.get(this.actionID.getValue() as number);
				break;
			case 2: // Do nothing
				map.battleCommandKind = EFFECT_SPECIAL_ACTION_KIND.NONE;
				map.skill = null;
				break;
		}
		// Target(s)
		let targets: Battler[] = [];
		map.targets = [];
		switch (map.skill.targetKind) {
			case TARGET_KIND.USER:
				map.targets = [Scene.Map.current.user];
				break;
			case TARGET_KIND.ENEMY:
				targets = map.battlers[side === CHARACTER_KIND.HERO ? CHARACTER_KIND.MONSTER : CHARACTER_KIND.HERO];
				break;
			case TARGET_KIND.ALLY:
				targets = map.battlers[side];
				break;
			case TARGET_KIND.ALL_ENEMIES:
				map.targets = map.battlers[side === CHARACTER_KIND.HERO ? CHARACTER_KIND.MONSTER : CHARACTER_KIND.HERO];
				break;
			case TARGET_KIND.ALL_ALLIES:
				map.targets = map.battlers[side];
				break;
			default:
				break;
		}
		// If several possible targets, select according to target kind
		if (targets.length > 0) {
			let targetKind = this.targetKind;
			if (targetKind === 1) {
				// Last target
				if (map.user.lastTarget !== null && targets.indexOf(map.user.lastTarget) !== -1) {
					map.targets = [map.user.lastTarget];
				} else {
					targetKind = 0;
				}
			}
			switch (targetKind) {
				case 0: // Random
					map.targets = [targets[Mathf.random(0, targets.length - 1)]];
					break;
				case 2: // custom
					switch (this.targetCustomKind) {
						case 0: // Enemy
							map.targets = [map.battlers[CHARACTER_KIND.MONSTER][this.targetEnemyIndex]];
							break;
						case 1: // Hero instance ID
							const id = this.targetHeroEnemyInstanceID.getValue() as number;
							for (const battler of map.battlers[CHARACTER_KIND.HERO]) {
								if (battler.player.instid === id) {
									map.targets = [battler];
									break;
								}
							}
							for (const battler of map.battlers[CHARACTER_KIND.MONSTER]) {
								if (battler.player.instid === id) {
									map.targets = [battler];
									break;
								}
							}
							break;
					}
					break;
			}
		}
		// Use battler turn or not
		map.forceAnActionUseTurn = this.useBattlerTurn;
		// Register step and substep for going back to it after action done
		map.previousStep = map.step;
		map.previousSubStep = map.subStep;
		map.previousCurrentEffectIndex = map.currentEffectIndex;
		map.previousEffects = map.effects;
		map.previousInformationText = map.informationText;
		// Start animation
		map.changeStep(BATTLE_STEP.ANIMATION);
		return null;
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		return !Scene.Map.current.isBattleMap || !(<Scene.Battle>Scene.Map.current).forceAnAction ? 1 : 0;
	}
}

export { ForceAnAction };
