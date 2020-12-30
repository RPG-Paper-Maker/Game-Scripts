import { Base } from ".";
import { Manager } from "..";


export abstract class MenuBase extends Base {
    
    constructor(){
        super(false);
    }

    /**
     * Returns the whole 
     */
    heroes() {
        return Manager.Stack.game.teamHeroes;
    }
}