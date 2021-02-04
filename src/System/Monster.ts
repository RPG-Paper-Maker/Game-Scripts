/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Hero } from "./Hero";
import { ProgressionTable } from "./ProgressionTable";
import { Loot } from "./Loot";
import { MonsterAction } from "./MonsterAction";
import { Class } from "./Class";
import { Utils, Enum } from "../Common";
import LootKind = Enum.LootKind;
import { Item } from "../Core";

interface StructReward {
    xp: ProgressionTable;
    currencies: ProgressionTable[];
    loots: Loot[];
    actions: MonsterAction[];
}

/** @class
 *  A monster of the game.
 *  @extends System.Hero
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
        this.rewards.xp = new ProgressionTable(this.getProperty(Class
            .PROPERTY_FINAL_LEVEL), json.xp);

        // Currencies
        let jsonCurrencies = json.cur;
        let l = jsonCurrencies.length;
        this.rewards.currencies = new Array(l);
        let hash: Record<string, any>, progression: ProgressionTable;
        for (let i = 0; i < l; i++) {
            hash = jsonCurrencies[i];
            progression = new ProgressionTable(hash.k, hash.v);
            this.rewards.currencies[i] = progression;
        }
        // Loots
        this.rewards.loots = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.loots, []), 
            listIndexes: this.rewards.loots, cons: Loot });

        // Actions
        this.actions = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.a, []), 
            listIndexes: this.actions, func: (jsonAction: Record<string, any>) =>
            {
                let action = new MonsterAction(jsonAction);
                action.monster = this;
                return action;
            }
        });
    }

    /** 
     *  Get the experience reward.
     *  @param {number} level - The monster level
     *  @returns {number}
     */
    getRewardExperience(level: number): number {
        return this.rewards.xp.getProgressionAt(level, this.getProperty(Class
            .PROPERTY_FINAL_LEVEL));
    }

    /** 
     *  Get the currencies reward.
     *  @param {number} level - The monster level
     *  @returns {Object}
     */
    getRewardCurrencies(level: number): Record<string, number> {
        let currencies = {};
        let progression: ProgressionTable;
        for (let i = 0, l = this.rewards.currencies.length; i < l; i++) {
            progression = this.rewards.currencies[i];
            currencies[progression.id] = progression.getProgressionAt(level,
                this.getProperty(Class.PROPERTY_FINAL_LEVEL));
        }
        return currencies;
    }

    /** 
     *  Get the loots reward.
     *  @param {number} level - The monster level
     *  @returns {Record<string, Item>[]}
     */
    getRewardLoots(level: number): Record<string, Item>[] {
        let list = new Array(3);
        list[LootKind.Item] = {};
        list[LootKind.Weapon] = {};
        list[LootKind.Armor] = {};
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

export { StructReward, Monster }