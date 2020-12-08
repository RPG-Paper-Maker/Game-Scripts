/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas } from "..";

/** @class
 *  The interpreter to evaluate formulas or simple scripts without having to 
 *  import.
 */
class Interpreter {

    private Datas: typeof Datas = Datas;

    constructor() {
        throw new Error("This is a static class");
    }

    /** 
     *  
     */
    static evaluateFormula(formula, user?, target?, damage?): any {
        return new Function("$that", 'console.log("test interpreter")');
    }
}

export { Interpreter }