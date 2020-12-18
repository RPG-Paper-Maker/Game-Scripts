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
import { Item } from "../Core";
/** @class
 *  An event command for modifying the inventory.
 *  @extends EventCommand.Base
 *  @property {ItemKind} itemKind The item kind
 *  @property {System.DynamicValue} itemID The item ID
 *  @property {number} operation The operation kind
 *  @property {System.DynamicValue} value The number of items value
 *  @param {any[]} command Direct JSON command to parse
*/
class ModifyInventory extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.itemKind = command[iterator.i++];
        this.itemID = System.DynamicValue.createValueCommand(command, iterator);
        this.operation = command[iterator.i++];
        this.value = System.DynamicValue.createValueCommand(command, iterator);
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The current object reacting
     *  @param {number} state The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState, object, state) {
        let item = new Item(this.itemKind, this.itemID.getValue(), this.value
            .getValue());
        // Doing the coresponding operation
        switch (this.operation) {
            case 0:
                item.equalItems();
                break;
            case 1:
                item.addItems();
                break;
            case 2:
                item.removeItems();
                break;
            case 3:
                item.multItems();
                break;
            case 4:
                item.divItems();
                break;
            case 5:
                item.moduloItems();
                break;
        }
        return 1;
    }
}
export { ModifyInventory };
