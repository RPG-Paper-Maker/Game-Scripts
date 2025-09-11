/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../Common';
import { Game } from '../Core';
import { Base } from './Base';
import { DynamicValue, DynamicValueJSON } from './DynamicValue';

/**
 * JSON structure describing a random battle.
 */
export type RandomBattleJSON = {
	troopID?: DynamicValueJSON;
	priority?: DynamicValueJSON;
	isEntireMap?: boolean;
	terrains?: { value: DynamicValueJSON }[];
};

/**
 * Represents a random battle of the game.
 */
export class RandomBattle extends Base {
	public troopID: DynamicValue;
	public priority: DynamicValue;
	public isEntireMap: boolean;
	public terrains: DynamicValue[];
	public currentPriority: number;
	public currentNumberSteps: number;

	constructor(json?: RandomBattleJSON) {
		super(json);
	}

	/**
	 * Update the current priority value.
	 */
	updateCurrentPriority(): void {
		this.currentPriority = this.priority.getValue() as number;
	}

	/**
	 * Update the current number of steps for this random battle.
	 */
	updateCurrentNumberSteps(): void {
		if (this.isEntireMap) {
			this.currentNumberSteps++;
		} else {
			for (const terrain of this.terrains) {
				if (Game.current.hero.terrain === (terrain.getValue() as number)) {
					this.currentNumberSteps++;
					break;
				}
			}
		}
	}

	/**
	 * Reset the current number of steps.
	 */
	resetCurrentNumberSteps(): void {
		this.currentNumberSteps = 0;
	}

	/**
	 * Initialize this random battle from JSON data.
	 */
	read(json: RandomBattleJSON): void {
		this.troopID = DynamicValue.readOrDefaultDatabase(json.troopID);
		this.priority = DynamicValue.readOrDefaultNumber(json.priority, 10);
		this.isEntireMap = Utils.valueOrDefault(json.isEntireMap, true);
		this.terrains = this.isEntireMap
			? []
			: Utils.readJSONList(json.terrains, (obj: { value: DynamicValueJSON }) =>
					DynamicValue.readOrDefaultNumber(obj.value)
			  );
		this.resetCurrentNumberSteps();
	}
}
