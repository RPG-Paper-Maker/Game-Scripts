import { Player } from "./Player";


/**
 * The class who handles the heroes party. 
 */
export class Party {

    private teamheroes : Player[];

    constructor(){

    }

    /**
     * Return all members of the team.
     */
    heroes(): Player[] {
        return this.teamheroes;
    }

    /**
     * Return all the aliveMembers
     */
    aliveMembers(){

    }

    /**
     * return all the dead members
     */
    deadMembers(){
        
    }

    /**
     * Return the first member of the party.
     */
    leader(): number {
        return 0;
    }







}