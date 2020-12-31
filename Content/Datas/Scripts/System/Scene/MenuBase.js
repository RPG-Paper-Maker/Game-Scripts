import { Base } from "./index.js";
import { Manager } from "../index.js";
export class MenuBase extends Base {
    constructor() {
        super(false);
    }
    /**
     * Returns the whole
     */
    heroes() {
        return Manager.Stack.game.teamHeroes;
    }
}
