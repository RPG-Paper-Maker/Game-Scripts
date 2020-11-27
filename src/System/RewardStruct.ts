import {ProgressionTable} from ".";

export interface RewardStruct {
    xp: number;
    currencies: ProgressionTable[];
    loots: Loots[];
    actions: MonsterAction[];
}