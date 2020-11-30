import {BaseSystem, ProgressionTable, RewardStruct} from ".";




/**
 * The superclass who manage Characters in game.
 * @abstract
 * @deprecated Hero is the superclass instead.
 */
export abstract class Character extends BaseSystem {

    public name: string;
    public rewards: RewardStruct;

    protected constructor(json = undefined) {
        super(json);
    }

    public setup(...args) {
        this.name = "";
        this.rewards = {} as RewardStruct;
    }

    public abstract read(json: Record<string, any>)

}
