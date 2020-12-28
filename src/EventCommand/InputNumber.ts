/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { MapObject, Game } from "../Core";
import { KeyEvent, Platform, ScreenResolution } from "../Common";

/** @class
 *  An event command for entering a number inside a variable.
 *  @extends EventCommand.Base
 *  @param {any[]} command Direct JSON command to parse
 */
class InputNumber extends Base {

    public id: number;

    constructor(command: any[]) {
        super();

        // TODO
        this.id = parseInt(command[0]);
        this.isDirectNode = false;
    }

    /** 
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize(): Record<string, any> {
        return {
            entered: "",
            confirmed: false
        }
    }

    /** 
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The current object reacting
     *  @param {number} state The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState: Record<string, any>, object: MapObject, state: number): 
        number
    {
        if (currentState.confirmed) {
            Game.current.variables[this.id] = currentState.entered;
            return 1;
        }
        return 0;
    }

    /** 
     *  First key press handle for the current stack.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {number} key The key ID pressed
     */
    onKeyPressed(currentState: Record<string, any>, key: number) {
        if (key === KeyEvent.DOM_VK_ENTER) {
            currentState.confirmed = true;
        } else {
            if (KeyEvent.isKeyNumberPressed(key)) {
                currentState.entered += KeyEvent.getKeyChar(key);
            }
        }
    }

    /** 
     *  Draw the HUD.
     *  @param {Record<string, any>} currentState The current state of the event
     */
    drawHUD(currentState: Record<string, any>) {
        Platform.ctx.fillText(currentState.entered, ScreenResolution
            .CANVAS_WIDTH / 2, ScreenResolution.CANVAS_HEIGHT / 2);
    }
}

export { InputNumber }