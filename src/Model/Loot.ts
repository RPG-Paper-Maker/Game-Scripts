/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Mathf } from '../Common';
import { Item } from '../Core';
import { Base } from './Base';
import { DynamicValue, DynamicValueJSON } from './DynamicValue';

/**
 * JSON structure for a loot entry.
 */
export type LootJSON = {
	k: number;
	lid: DynamicValueJSON;
	n: DynamicValueJSON;
	p: DynamicValueJSON;
	i: DynamicValueJSON;
	f: DynamicValueJSON;
};

/**
 * Represents a loot entry in the game.
 * Loot defines which item can drop, how many, its probability, and
 * at which levels it is available.
 */
export class Loot extends Base {
	public kind: number;
	public lootID: DynamicValue;
	public number: DynamicValue;
	public probability: DynamicValue;
	public initial: DynamicValue;
	public final: DynamicValue;

	constructor(json?: LootJSON) {
		super(json);
	}

	/**
	 * Checks if this loot is available for a given level.
	 * @param level - The level to check against.
	 * @returns True if the loot is available, false otherwise.
	 */
	isAvailable(level: number): boolean {
		return level >= (this.initial.getValue() as number) && level <= (this.final.getValue() as number);
	}

	/**
	 * Computes the loot dropped at a specific level.
	 * Uses probability and count to decide how many items drop.
	 * @param level - The current level.
	 * @returns The resulting Item if at least one drops, otherwise null.
	 */
	currentLoot(level: number): Item | null {
		if (!this.isAvailable(level)) {
			return null;
		}
		const proba = this.probability.getValue() as number;
		const totalNumber = this.number.getValue() as number;
		let count = 0;
		for (let i = 0; i < totalNumber; i++) {
			if (Mathf.random(0, 100) <= proba) {
				count++;
			}
		}
		return count > 0 ? new Item(this.kind, this.lootID.getValue() as number, count) : null;
	}

	/**
	 *  Read the JSON associated to the loot.
	 */
	read(json: LootJSON) {
		this.kind = json.k;
		this.lootID = new DynamicValue(json.lid);
		this.number = new DynamicValue(json.n);
		this.probability = new DynamicValue(json.p);
		this.initial = new DynamicValue(json.i);
		this.final = new DynamicValue(json.f);
	}
}
