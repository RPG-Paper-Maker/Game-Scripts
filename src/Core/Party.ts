import { Datas, System } from "..";
import { Hero } from "../System";
import { Player } from "./Player";

/**
 * The class who handles the heroes party.
 *
 * @class Party
 */
class Party {

    /**
     * the heros who are in the party and are used in battle.
     *
     * @private
     * @type {Player[]}
     * @memberof Party
     */
    private teamHeroes: Player[];

    /**
     * The heros who temporally left the party.
     *
     * @private
     * @type {Player[]}
     * @memberof Party
     */
    private hiddenHeroes: Player[];

    /**
     * the heros who are in the reserve party (not in battle).
     *
     * @private
     * @type {Player[]}
     * @memberof Party
     */
    private reserveHeroes: Player[];

    constructor() {

    }

    /**
     * Return all members of the team. (including hidden and reserve)
     */
    allMembers(): Player[] {
        let heroes = [];
        return heroes.concat(this.teamHeroes, this.hiddenHeroes, this.reserveHeroes);
    }

    teamMembers(): Player[] {
        return this.teamHeroes;
    }

    reserveMembers(): Player[] {
        return this.reserveHeroes;
    }

    hiddenMembers(): Player[] {
        return this.hiddenHeroes;
    }
    /**
     * Return all the aliveMembers (including hidden and reserve)
     */
    aliveMembers(): Player[] {
        return this.allMembers().filter(hero => !hero.isDead());
    }

    /**
     * Return all the alive team members.
     *
     * @return {*}  {Player[]}
     * @memberof Party
     */
    aliveTeamMembers(): Player[] {
        return this.teamHeroes.filter(hero => !hero.isDead());
    }


    /**
     * return all the dead members (including hidden and reserve)
     *
     * @return {*}  {Player[]}
     * @memberof Party
     */
    deadMembers(): Player[] {
        return this.allMembers().filter(hero => hero.isDead());
    }

    teamDeadMembers(): Player[] {
        return this.teamHeroes.filter(hero => hero.isDead());
    }

    reserveDeadMembers(): Player[] {
        return this.reserveHeroes.filter(hero => hero.isDead());
    }

    hiddenDeadMembers(): Player[] {
        return this.hiddenHeroes.filter(hero => hero.isDead());
    }

    /**
     * Return the first member of the battle party.
     */
    leader(): Player {
        return this.teamHeroes[0]
    }

    /**
     * Return the max number of members a party can be
     * @todo make the max party size increasable in editor? 
     * @return {*}  {number}
     * @memberof Party
     */
    maxMembers(): number {
        return 4;
    }

    /**
     * Return all the currencies that a party has.
     *
     * @return {*}  {number}
     * @memberof Party
     */
    currencies(): number {
        return 10;
    }

    /**
     * return a specific currency.
     * @param id 
     */
    currency(id: string): number {
        return 10;
    }
    /**
     * Return the maximum currency that a party can have.
     * @todo work with the new currencies system?
     *
     * @return {*}  {number}
     * @memberof Party
     */
    maxCurrencies(): number {
        return 9999999999;
    }
}

export { Party }