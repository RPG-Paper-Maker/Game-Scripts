/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { System, Datas, Manager } from "..";
import { Utils, Platform, ScreenResolution } from "../Common";
import { MapObject } from "../Core";

/** @class
 *  An event command for flashing screen.
 *  @extends EventCommand.Base
 *  @param {Object} command Direct JSON command to parse
 */
class FlashScreen extends Base {
    
    public colorID: System.DynamicValue;
    public isWaitEnd: boolean;
    public time: System.DynamicValue;

    constructor(command: any[]) {
        super();

        let iterator = {
            i: 0
        }
        this.colorID = System.DynamicValue.createValueCommand(command, iterator);
        this.isWaitEnd = Utils.numToBool(command[iterator.i++]);
        this.time = System.DynamicValue.createValueCommand(command, iterator);
        this.isDirectNode = !this.isWaitEnd;
        this.parallel = !this.isWaitEnd;
    }

    /** 
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize(): Record<string, any> {
        let time = this.time.getValue() * 1000;
        let color = Datas.Systems.getColor(this.colorID.getValue());
        return {
            parallel: this.isWaitEnd,
            time: time,
            timeLeft: time,
            color: color.getHex(),
            finalDifA: -color.alpha,
            a: color.alpha
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
        if (currentState.parallel) {
            let timeRate: number, dif: number;
            if (currentState.time === 0) {
                timeRate = 1;
            } else {
                dif = Manager.Stack.elapsedTime;
                currentState.timeLeft -= Manager.Stack.elapsedTime;
                if (currentState.timeLeft < 0) {
                    dif += currentState.timeLeft;
                    currentState.timeLeft = 0;
                }
                timeRate = dif / currentState.time;
            }

            // Update values
            currentState.a = currentState.a + (timeRate * currentState
                .finalDifA);
            Manager.Stack.requestPaintHUD = true;
            return currentState.timeLeft === 0 ? 1 : 0;
        }
        return 1;
    }

    /** 
     *  Draw the HUD
     *  @param {Record<string, any>} currentState The current state of the event
     */
    drawHUD(currentState: Record<string, any>) {
        Platform.ctx.fillStyle = currentState.color;
        Platform.ctx.globalAlpha = currentState.a;
        Platform.ctx.fillRect(0, 0, ScreenResolution.CANVAS_WIDTH, 
            ScreenResolution.CANVAS_HEIGHT);
        Platform.ctx.globalAlpha = 1.0;
    }
}

export { FlashScreen }