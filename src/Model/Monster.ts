/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../Common';
import { Item } from '../Core';
import { Class } from './Class';
import { Hero, HeroJSON } from './Hero';
import { Loot, LootJSON } from './Loot';
import { MonsterAction, MonsterActionJSON } from './MonsterAction';
import { ProgressionTable, ProgressionTableJSON } from './ProgressionTable';

/**
 * JSON structure describing a monster.
 */
export type MonsterJSON = HeroJSON & {
	xp: ProgressionTableJSON;
	cur: { k: number; v: ProgressionTableJSON }[];
	loots: LootJSON[];
	a: MonsterActionJSON[];
};

/**
 * Structure holding monster rewards.
 */
export interface Reward {
	xp: ProgressionTable;
	currencies: ProgressionTable[];
	loots: Loot[];
	actions: MonsterAction[];
}

/**
 * Represents a monster of the game.
 */
export class Monster extends Hero {
	public rewards: Reward;
	public actions: MonsterAction[];

	constructor(json?: MonsterJSON) {
		super(json);
	}

	/**
	 * Check if this hero is a monster.
	 */
	isMonster(): boolean {
		return true;
	}

	/**
	 * Get the experience reward at a given level.
	 */
	getRewardExperience(level: number): number {
		return this.rewards.xp.getProgressionAt(level, this.getProperty(Class.PROPERTY_FINAL_LEVEL));
	}

	/**
	 * Get the currencies reward at a given level.
	 */
	getRewardCurrencies(level: number): Map<number, number> {
		const currencies = new Map<number, number>();
		for (const progression of this.rewards.currencies) {
			currencies.set(
				progression.id,
				progression.getProgressionAt(level, this.getProperty(Class.PROPERTY_FINAL_LEVEL, undefined))
			);
		}
		return currencies;
	}

	/**
	 * Get the loots reward at a given level.
	 */
	getRewardLoots(level: number): Map<number, Item>[] {
		const list = [new Map<number, Item>(), new Map<number, Item>(), new Map<number, Item>()];
		for (const loot of this.rewards.loots) {
			const item = loot.currentLoot(level);
			if (item !== null) {
				const loots = list[item.kind];
				const existingLoot = loots.get(item.system.id);
				if (existingLoot) {
					existingLoot.nb += item.nb;
				} else {
					loots.set(item.system.id, item);
				}
			}
		}
		return list;
	}

	/**
	 * Initialize this monster from JSON data.
	 */
	read(json: MonsterJSON): void {
		super.read(json);

		this.rewards = {} as Reward;

		// Experience
		this.rewards.xp = new ProgressionTable(this.getProperty(Class.PROPERTY_FINAL_LEVEL), json.xp);

		// Currencies
		this.rewards.currencies = json.cur.map((hash) => new ProgressionTable(hash.k, hash.v));

		// Loots
		this.rewards.loots = Utils.readJSONList(json.loots, Loot);

		// Actions
		this.actions = Utils.readJSONList(json.a, (jsonAction) => {
			const action = new MonsterAction(jsonAction);
			action.monster = this;
			return action;
		});
	}
}
