import {Loot, MonsterAction, ProgressionTable} from ".";

export interface RewardStruct {
    xp: ProgressionTable;
    currencies: ProgressionTable[];
    loots: Loot[];
    actions: MonsterAction[];
}