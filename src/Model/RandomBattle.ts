/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '..';
import { Utils } from '../Common';
import { Game } from '../Core';
import { Base } from './Base';

/** @class
 *  A random battle of the game.
 *  @extends Model.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  random battle
 */
class RandomBattle extends Base {
	public troopID: Model.DynamicValue;
	public priority: Model.DynamicValue;
	public isEntireMap: boolean;
	public terrains: Model.DynamicValue[];
	public currentPriority: number;
	public currentNumberSteps: number;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Read the JSON associated to random battle.
	 *  @param {Record<string, any>} - json Json object describing the random
	 *  battle
	 */
	read(json: Record<string, any>) {
		this.troopID = Model.DynamicValue.readOrDefaultDatabase(json.troopID);
		this.priority = Model.DynamicValue.readOrDefaultNumber(json.priority, 10);
		this.isEntireMap = Utils.valueOrDefault(json.isEntireMap, true);
		this.terrains = [];
		if (!this.isEntireMap) {
			Utils.readJSONSystemList({
				list: json.terrains,
				listIndexes: this.terrains,
				func: (obj: Record<string, any>) => {
					return Model.DynamicValue.readOrDefaultNumber(obj.value);
				},
			});
		}
		this.resetCurrentNumberSteps();
	}

	/**
	 *  Update the current priority value.
	 */
	updateCurrentPriority() {
		this.currentPriority = this.priority.getValue();
	}

	/**
	 *  Update the current number of steps for this random battle.
	 */
	updateCurrentNumberSteps() {
		if (this.isEntireMap) {
			this.currentNumberSteps++;
		} else {
			for (const terrain of this.terrains) {
				if (Game.current.hero.terrain === terrain.getValue()) {
					this.currentNumberSteps++;
					break;
				}
			}
		}
	}

	/**
	 *  Reset the current number of steps for this random battle.
	 */
	resetCurrentNumberSteps() {
		this.currentNumberSteps = 0;
	}
}

export { RandomBattle };
