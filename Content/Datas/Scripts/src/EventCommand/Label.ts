/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { System } from "..";

/** @class
*   An event command for label
*   @extends EventCommand
*   @property {SysytemValue} label The label value
*   @param {any[]} command Direct JSON command to parse
*/
class Label extends Base {

    public name: System.DynamicValue;

    constructor(command: any[]) {
        super();
        
        let iterator = {
            i: 0
        }
        this.name = System.DynamicValue.createValueCommand(command, iterator);
    }
}

export { Label }