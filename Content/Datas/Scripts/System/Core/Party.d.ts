import { Player } from "./Player.js";
/**
 * The class who handles the heroes party.
 */
export declare class Party {
    private teamheroes;
    constructor();
    /**
     * Return all members of the team.
     */
    heroes(): Player[];
    /**
     * Return all the aliveMembers
     */
    aliveMembers(): void;
    /**
     * return all the dead members
     */
    deadMembers(): void;
    /**
     * Return the first member of the party.
     */
    leader(): number;
}
