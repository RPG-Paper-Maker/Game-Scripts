/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { CHARACTER_KIND } from '../Common';
import { Battler, Game, MapObject, Player } from '../Core';
import { Graphic, Model, Scene } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for transforming a battler.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class TransformABattler extends Base {
	public battlerKind: number;
	public battlerEnemyIndex: number;
	public battlerHeroEnemyInstanceID: Model.DynamicValue;
	public monsterID: Model.DynamicValue;
	public level: Model.DynamicValue;

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
		this.monsterID = Model.DynamicValue.createValueCommand(command, iterator);
		this.level = Model.DynamicValue.createValueCommand(command, iterator);
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
			let index = 0;
			let side = CHARACTER_KIND.HERO;
			switch (this.battlerKind) {
				case 0: // Enemy
					battler = map.battlers[CHARACTER_KIND.MONSTER][this.battlerEnemyIndex];
					index = this.battlerEnemyIndex;
					side = CHARACTER_KIND.MONSTER;
					break;
				case 1: // Hero instance ID
					const id = this.battlerHeroEnemyInstanceID.getValue();
					for (const [i, b] of map.battlers[CHARACTER_KIND.HERO].entries()) {
						if (b.player.instid === id) {
							battler = b;
							index = i;
							side = CHARACTER_KIND.HERO;
							break;
						}
					}
					for (const [i, b] of map.battlers[CHARACTER_KIND.MONSTER].entries()) {
						if (b.player.instid === id) {
							battler = b;
							index = i;
							side = CHARACTER_KIND.MONSTER;
							break;
						}
					}
					break;
			}
			if (battler) {
				const player = new Player(
					battler.player.kind,
					this.monsterID.getValue(),
					Game.current.charactersInstances++,
					[],
					[]
				);
				player.instanciate(this.level.getValue());
				const newBattler = new Battler(
					player,
					battler.isEnemy,
					battler.initialPosition,
					battler.position,
					map.camera
				);
				map.battlers[side][index].removeFromScene();
				newBattler.addToScene();
				map.battlers[side][index] = newBattler;
				map.players[side][index] = player;
				map.graphicPlayers[side][index] = new Graphic.Player(player);
				player.battler = newBattler;
			}
		}
		return 1;
	}
}

export { TransformABattler };
