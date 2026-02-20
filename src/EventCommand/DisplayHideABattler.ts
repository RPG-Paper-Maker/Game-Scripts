/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { CHARACTER_KIND } from '../Common';
import { Battler, MapObject } from '../Core';
import { Model, Scene } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for displaying or hidding a battler.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class DisplayHideABattler extends Base {
	public battlerKind: number;
	public battlerEnemyIndex: number;
	public battlerHeroEnemyInstanceID: Model.DynamicValue;
	public hidden: Model.DynamicValue;

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
		this.hidden = Model.DynamicValue.createValueCommand(command, iterator);
	}

	/**
	 *  Initialize the current state.
	 *  @returns {Record<string, any>} The current state
	 */
	initialize(): Record<string, any> {
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
		if (Scene.Map.current.isBattleMap) {
			const map = <Scene.Battle>Scene.Map.current;
			let battler: Battler = null;
			switch (this.battlerKind) {
				case 0: // Enemy
					battler = map.battlers[CHARACTER_KIND.MONSTER][this.battlerEnemyIndex];
					break;
				case 1: // Hero instance ID
					const id = this.battlerHeroEnemyInstanceID.getValue() as number;
					for (const b of map.battlers[CHARACTER_KIND.HERO]) {
						if (b.player.instid === id) {
							battler = b;
							break;
						}
					}
					for (const b of map.battlers[CHARACTER_KIND.MONSTER]) {
						if (b.player.instid === id) {
							battler = b;
							break;
						}
					}
					break;
			}
			if (battler) {
				battler.updateHidden(this.hidden.getValue() as boolean);
			}
		}
		return 1;
	}
}

export { DisplayHideABattler };
