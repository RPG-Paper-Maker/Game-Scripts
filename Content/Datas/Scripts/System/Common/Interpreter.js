/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas } from "../index.js";
/** @class
 *  The interpreter to evaluate formulas or simple scripts without having to
 *  import.
 */
class Interpreter {
    constructor() {
        this.Datas = Datas;
        throw new Error("This is a static class");
    }
    /**
     *
     */
    static evaluateFormula(formula, user, target, damage) {
        return new Function("$that", 'console.log("test interpreter")');
    }
}
export { Interpreter };
