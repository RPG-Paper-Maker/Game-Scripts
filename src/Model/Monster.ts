/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { LOOT_KIND, Utils } from '../Common';
import { Item } from '../Core';
import { Class } from './Class';
import { Hero } from './Hero';
import { Loot } from './Loot';
import { MonsterAction } from './MonsterAction';
import { ProgressionTable } from './ProgressionTable';

interface StructReward {
	xp: ProgressionTable;
	currencies: ProgressionTable[];
	loots: Loot[];
	actions: MonsterAction[];
}

/** @class
 *  A monster of the game.
 *  @extends Model.Hero
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  monster
 */
class Monster extends Hero {
	rewards: StructReward;
	actions: MonsterAction[];

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/** Read the JSON associated to the monster.
	 *  @param {Record<string, any>} - json Json object describing the monster
	 */
	read(json: Record<string, any>) {
		super.read(json);

		this.rewards = {} as StructReward;

		// Experience
		this.rewards.xp = new ProgressionTable(this.getProperty(Class.PROPERTY_FINAL_LEVEL, undefined), json.xp);

		// Currencies
		const jsonCurrencies = json.cur;
		const l = jsonCurrencies.length;
		this.rewards.currencies = new Array(l);
		let hash: Record<string, any>, progression: ProgressionTable;
		for (let i = 0; i < l; i++) {
			hash = jsonCurrencies[i];
			progression = new ProgressionTable(hash.k, hash.v);
			this.rewards.currencies[i] = progression;
		}
		// Loots
		this.rewards.loots = [];
		Utils.readJSONSystemList({
			list: Utils.defaultValue(json.loots, []),
			listIndexes: this.rewards.loots,
			cons: Loot,
		});

		// Actions
		this.actions = [];
		Utils.readJSONSystemList({
			list: Utils.defaultValue(json.a, []),
			listIndexes: this.actions,
			func: (jsonAction: Record<string, any>) => {
				const action = new MonsterAction(jsonAction);
				action.monster = this;
				return action;
			},
		});
	}

	/**
	 *  Get the experience reward.
	 *  @param {number} level - The monster level
	 *  @returns {number}
	 */
	getRewardExperience(level: number): number {
		return this.rewards.xp.getProgressionAt(level, this.getProperty(Class.PROPERTY_FINAL_LEVEL, undefined));
	}

	/**
	 *  Get the currencies reward.
	 *  @param {number} level - The monster level
	 *  @returns {Object}
	 */
	getRewardCurrencies(level: number): Record<string, number> {
		const currencies = {};
		let progression: ProgressionTable;
		for (let i = 0, l = this.rewards.currencies.length; i < l; i++) {
			progression = this.rewards.currencies[i];
			currencies[progression.id] = progression.getProgressionAt(
				level,
				this.getProperty(Class.PROPERTY_FINAL_LEVEL, undefined)
			);
		}
		return currencies;
	}

	/**
	 *  Get the loots reward.
	 *  @param {number} level - The monster level
	 *  @returns {Record<string, Item>[]}
	 */
	getRewardLoots(level: number): Record<string, Item>[] {
		const list = new Array(3);
		list[LOOT_KIND.ITEM] = {};
		list[LOOT_KIND.WEAPON] = {};
		list[LOOT_KIND.ARMOR] = {};
		let loot: Item, loots: Record<string, Item>;
		for (let i = 0, l = this.rewards.loots.length; i < l; i++) {
			loot = this.rewards.loots[i].currenLoot(level);
			if (loot !== null) {
				loots = list[loot.kind];
				if (loots.hasOwnProperty(loot.system.id)) {
					loots[loot.system.id].nb += loot.nb;
				} else {
					loots[loot.system.id] = loot;
				}
			}
		}
		return list;
	}
}

export { Monster, StructReward };
