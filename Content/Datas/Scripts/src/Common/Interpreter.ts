/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas, Common, Core, EventCommand, Graphic, Manager, System } from "..";
import { Scene } from "../../Libs/three";
import { Player } from "../Core";

/** @class
 *  The interpreter to evaluate formulas or simple scripts without having to 
 *  import.
 */
class Interpreter {

    private static common: typeof Common = Common;
    private static core: typeof Core = Core;
    private static datas: typeof Datas = Datas;
    private static eventCommand: typeof EventCommand = EventCommand;
    private static graphic: typeof Graphic = Graphic;
    private static manager: typeof Manager = Manager;
    private static scene: typeof Scene = Scene;
    private static system: typeof System = System;

    constructor() {
        throw new Error("This is a static class");
    }

    /** 
     *  Evaluate a formula.
     */
    static evaluate(formula: string, { user, target, damage, addReturn = true }: 
        { user?: Player, target?: Player, damage?: number, addReturn?: boolean} 
        = {}): any
    {
        return new Function("Common", "Core", "Datas", "EventCommand", "Graphic"
            , "Manager", "Scene", "System", "u", "t", "damage", "return " + 
            formula)(this.common, this.core, this.datas, this.eventCommand, this
            .graphic, this.manager, this.scene, this.system, user, target, 
            damage);
    }
}

export { Interpreter }