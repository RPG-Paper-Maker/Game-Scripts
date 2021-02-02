/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Manager, Scene, System } from "../index.js";
import { Utils } from "../Common/index.js";
import { Base } from "./Base.js";
/** @class
 *  An event command for sarting shop menu.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class StartShopMenu extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.buyOnly = System.DynamicValue.createValueCommand(command, iterator);
        this.isStock = Utils.numToBool(command[iterator.i++]);
        if (this.isStock) {
            this.stockVariableID = command[iterator.i++];
        }
        this.items = [];
        let shopItem;
        while (iterator.i < command.length) {
            shopItem = new System.ShopItem();
            shopItem.parse(command, iterator);
            this.items.push(shopItem);
        }
        this.isDirectNode = false;
        console.log(this);
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        return {
            opened: false
        };
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState, object, state) {
        if (currentState.opened) {
            return 1;
        }
        Manager.Stack.push(new Scene.Menu());
        currentState.opened = true;
        return 0;
    }
}
export { StartShopMenu };
