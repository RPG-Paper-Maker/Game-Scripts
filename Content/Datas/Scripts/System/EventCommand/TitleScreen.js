/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base";
import { Manager } from "..";
/** @class
 *  An event command for going to title screen.
 *  @extends EventCommand.Base
 *  @param {any[]} command Direct JSON command to parse
 */
class TitleScreen extends Base {
    constructor(command) {
        super();
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The current object reacting
     *  @param {number} state The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState, object, state) {
        Manager.Stack.popAll();
        Manager.Stack.pushTitleScreen();
        return 1;
    }
}
export { TitleScreen };
