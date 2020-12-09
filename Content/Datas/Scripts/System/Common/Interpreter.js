/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas, Common, Core, EventCommand, Graphic, Manager, System } from "../index.js";
import { Scene } from "../../Libs/three.js";
/** @class
 *  The interpreter to evaluate formulas or simple scripts without having to
 *  import.
 */
class Interpreter {
    constructor() {
        throw new Error("This is a static class");
    }
    /**
     *  Evaluate a formula.
     */
    static evaluate(formula, { user, target, damage, addReturn = true } = {}) {
        return new Function("Common", "Core", "Datas", "EventCommand", "Graphic", "Manager", "Scene", "System", "u", "t", "damage", "return " +
            formula)(this.common, this.core, this.datas, this.eventCommand, this
            .graphic, this.manager, this.scene, this.system, user, target, damage);
    }
}
Interpreter.common = Common;
Interpreter.core = Core;
Interpreter.datas = Datas;
Interpreter.eventCommand = EventCommand;
Interpreter.graphic = Graphic;
Interpreter.manager = Manager;
Interpreter.scene = Scene;
Interpreter.system = System;
export { Interpreter };
