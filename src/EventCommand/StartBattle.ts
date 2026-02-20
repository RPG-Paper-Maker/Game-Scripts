/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../Common';
import { Game, MapObject, Position } from '../Core';
import { Data, Manager, Model, Scene } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for battle processing.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class StartBattle extends Base {
	public battleMapID: Model.DynamicValue;
	public mapID: Model.DynamicValue;
	public x: Model.DynamicValue;
	public y: Model.DynamicValue;
	public yPlus: Model.DynamicValue;
	public z: Model.DynamicValue;
	public canEscape: boolean;
	public canGameOver: boolean;
	public troopID: Model.DynamicValue;
	public transitionStart: number;
	public transitionStartColor: Model.DynamicValue;
	public transitionEnd: number;
	public transitionEndColor: Model.DynamicValue;
	public battleMapType: number;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.battleMapID = null;
		this.mapID = null;
		this.x = null;
		this.y = null;
		this.yPlus = null;
		this.z = null;

		// Options
		this.canEscape = Utils.numberToBool(command[iterator.i++]);
		this.canGameOver = Utils.numberToBool(command[iterator.i++]);

		// Troop
		const type = command[iterator.i++];
		switch (type) {
			case 0: // Existing troop ID
				this.troopID = Model.DynamicValue.createValueCommand(command, iterator);
				break;
			case 1: // If random troop in map properties
				if (Scene.Map.current.mapProperties.randomBattles.length > 0) {
					const totalPriorities = Scene.Map.current.mapProperties.randomBattles.reduce(
						(sum, randomBattle) => sum + (randomBattle.priority.getValue() as number),
						0,
					);
					let r = Math.random() * totalPriorities;
					let selectedBattle: Model.RandomBattle | null = null;
					for (const battle of Scene.Map.current.mapProperties.randomBattles) {
						r -= battle.priority.getValue() as number;
						if (r <= 0) {
							selectedBattle = battle;
							break;
						}
					}
					if (selectedBattle === null) {
						selectedBattle =
							Scene.Map.current.mapProperties.randomBattles[
								Scene.Map.current.mapProperties.randomBattles.length - 1
							];
					}
					this.troopID = Model.DynamicValue.createNumber(selectedBattle.troopID.getValue() as number);
				} else {
					this.troopID = Model.DynamicValue.createNumber(1);
				}
				break;
		}

		// Battle map
		this.battleMapType = command[iterator.i++];
		switch (this.battleMapType) {
			case 0: // Existing battle map ID
				this.battleMapID = Model.DynamicValue.createValueCommand(command, iterator);
				break;
			case 1: // Select
				this.mapID = Model.DynamicValue.createNumber(command[iterator.i++]);
				this.x = Model.DynamicValue.createNumber(command[iterator.i++]);
				this.y = Model.DynamicValue.createNumber(command[iterator.i++]);
				this.yPlus = Model.DynamicValue.createNumber(command[iterator.i++]);
				this.z = Model.DynamicValue.createNumber(command[iterator.i++]);
				break;
			case 2: // Numbers
				this.mapID = Model.DynamicValue.createValueCommand(command, iterator);
				this.x = Model.DynamicValue.createValueCommand(command, iterator);
				this.y = Model.DynamicValue.createValueCommand(command, iterator);
				this.yPlus = Model.DynamicValue.createValueCommand(command, iterator);
				this.z = Model.DynamicValue.createValueCommand(command, iterator);
				break;
		}

		// Transition
		this.transitionStart = command[iterator.i++];
		if (Utils.numberToBool(this.transitionStart)) {
			this.transitionStartColor = Model.DynamicValue.createValueCommand(command, iterator);
		}
		this.transitionEnd = command[iterator.i++];
		if (Utils.numberToBool(this.transitionEnd)) {
			this.transitionEndColor = Model.DynamicValue.createValueCommand(command, iterator);
		}
	}

	/**
	 *  Initialize the current state.
	 *  @returns {Record<string, any>} The current state
	 */
	initialize(): Record<string, any> {
		return {
			mapScene: null,
			sceneBattle: null,
		};
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		// Initializing battle
		if (currentState.sceneBattle === null) {
			if (this.battleMapType === 3) {
				this.battleMapID = Scene.Map.current.mapProperties.tileset.battleMap;
			}
			const battleMap =
				this.battleMapID === null
					? Model.BattleMap.create(
							this.mapID.getValue() as number,
							new Position(
								this.x.getValue() as number,
								this.y.getValue() as number,
								this.z.getValue() as number,
								this.yPlus.getValue() as number,
							),
						)
					: Data.BattleSystems.getBattleMap(this.battleMapID.getValue() as number);
			Game.current.heroBattle = new MapObject(Game.current.hero.system, battleMap.position.toVector3(), true);

			// Defining the battle state instance
			const sceneBattle = new Scene.Battle(
				this.troopID.getValue() as number,
				this.canGameOver,
				this.canEscape,
				battleMap,
				this.transitionStart,
				this.transitionEnd,
				this.transitionStartColor
					? Data.Systems.getColor(this.transitionStartColor.getValue() as number)
					: null,
				this.transitionEndColor ? Data.Systems.getColor(this.transitionEndColor.getValue() as number) : null,
			);

			// Keep instance of battle state for results
			currentState.sceneBattle = sceneBattle;
			currentState.mapScene = Manager.Stack.top;
			Manager.Stack.push(sceneBattle);
			return 0; // Stay on this command as soon as we are in battle state
		}

		// If there are not game overs, go to win/lose nodes
		if (!this.canGameOver && !currentState.sceneBattle.winning) {
			return 2;
		}
		return 1;
	}
}

export { StartBattle };
