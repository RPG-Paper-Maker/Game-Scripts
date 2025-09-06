/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas, Model, Scene } from '..';
import { CHARACTER_KIND, CONDITION_HEROES_KIND, Mathf, OPERATION_KIND, Utils } from '../Common';
import { Player } from '../Core';
import { Base } from './Base';

/** @class
 *  A troop reaction conditions of the game.
 *  @extends Model.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  troop reaction conditions
 */
class TroopReactionConditions extends Base {
	public isNumberOfTurn: boolean;
	public numberOfTurnPlus: Model.DynamicValue;
	public numberOfTurnTimes: Model.DynamicValue;
	public isHeroesMonsters: boolean;
	public isHeroes: boolean;
	public conditionHeroesKind: CONDITION_HEROES_KIND;
	public heroInstanceID: Model.DynamicValue;
	public isStatusID: boolean;
	public statusID: Model.DynamicValue;
	public isStatisticID: boolean;
	public statisticID: Model.DynamicValue;
	public statisticOPERATION_KIND: OPERATION_KIND;
	public statisticCompare: Model.DynamicValue;
	public statisticCompareUnit: boolean;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Read the JSON associated to the troop reaction conditions.
	 *  @param {Record<string, any>} - json Json object describing the troop
	 *  reaction conditions
	 */
	read(json: Record<string, any>) {
		this.isNumberOfTurn = Utils.valueOrDefault(json.isNumberOfTurn, false);
		this.numberOfTurnPlus = Model.DynamicValue.readOrDefaultNumber(json.numberOfTurnPlus, 1);
		this.numberOfTurnTimes = Model.DynamicValue.readOrDefaultNumber(json.numberOfTurnTimes, 1);
		this.isHeroesMonsters = Utils.valueOrDefault(json.isHeroesMonsters, false);
		this.isHeroes = Utils.valueOrDefault(json.isHeroes, true);
		this.conditionHeroesKind = Utils.valueOrDefault(json.conditionHeroesKind, CONDITION_HEROES_KIND.ALL_THE_HEROES);
		this.heroInstanceID = Model.DynamicValue.readOrDefaultVariable(json.heroInstanceID);
		this.isStatusID = Utils.valueOrDefault(json.isStatusID, false);
		this.statusID = Model.DynamicValue.readOrDefaultDatabase(json.statusID);
		this.isStatisticID = Utils.valueOrDefault(json.isStatisticID, false);
		this.statisticID = Model.DynamicValue.readOrDefaultDatabase(json.statisticID);
		this.statisticOPERATION_KIND = Utils.valueOrDefault(json.statisticOPERATION_KIND, OPERATION_KIND.EQUAL_TO);
		this.statisticCompare = Model.DynamicValue.readOrDefaultNumber(json.statisticCompare);
		this.statisticCompareUnit = Utils.valueOrDefault(json.statisticCompareUnit, true);
	}

	/**
	 *  Check if conditions are valid.
	 *  @returns {boolean}
	 */
	isValid(): boolean {
		const sceneBattle = <Scene.Battle>Scene.Map.current;
		if (this.isNumberOfTurn) {
			const plus = this.numberOfTurnPlus.getValue();
			const times = this.numberOfTurnTimes.getValue();
			if (times === 1) {
				if (sceneBattle.turn < plus) {
					return false;
				}
			} else {
				if (Mathf.mod(sceneBattle.turn - plus, times) !== 0) {
					return false;
				}
			}
		}
		if (this.isHeroesMonsters) {
			return Player.applySelection(
				this.conditionHeroesKind,
				sceneBattle.players[this.isHeroes ? CHARACTER_KIND.HERO : CHARACTER_KIND.MONSTER],
				this.heroInstanceID.getValue(),
				(player: Player) => {
					let test = false;
					let id: number;
					if (this.isStatusID) {
						id = this.statusID.getValue();
						for (let i = 0, l = player.status.length; i < l; i++) {
							if (id === player.status[i].system.id) {
								test = true;
								break;
							}
						}
						if (!test) {
							return test;
						}
					}
					if (this.isStatisticID) {
						id = this.statisticID.getValue();
						const stat = Datas.BattleSystems.getStatistic(this.statisticID.getValue());
						const statValue = player[stat.abbreviation];
						const statValueMax = player[stat.getMaxAbbreviation()];
						if (statValueMax === undefined) {
							throw new Error('No max value for stat ' + stat.name());
						}
						const compareValue = this.statisticCompare.getValue();
						return Mathf.OPERATORS_COMPARE[this.statisticOPERATION_KIND](
							this.statisticCompareUnit ? statValue / statValueMax : statValue,
							this.statisticCompareUnit ? compareValue / 100 : compareValue
						);
					}
					return true;
				}
			);
		}
		return true;
	}
}

export { TroopReactionConditions };
