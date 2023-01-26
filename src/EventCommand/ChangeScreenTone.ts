/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { System, Datas, Manager, Scene } from "../index";
import { Utils } from "../Common";
import { MapObject } from "../Core";

/** @class
 *  An event command for changing screen tone.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ChangeScreenTone extends Base {

    public r: System.DynamicValue;
    public g: System.DynamicValue;
    public b: System.DynamicValue;
    public grey: System.DynamicValue;
    public subColor: boolean;
    public colorID: System.DynamicValue;
    public waitEnd: boolean;
    public time: System.DynamicValue;

    constructor(command: any[]) {
        super();

        if (!command) {
            return;
        }
        let iterator = {
            i: 0
        };
        this.r = System.DynamicValue.createValueCommand(command, iterator);
        this.g = System.DynamicValue.createValueCommand(command, iterator);
        this.b = System.DynamicValue.createValueCommand(command, iterator);
        this.grey = System.DynamicValue.createValueCommand(command, iterator);
        if (Utils.numToBool(command[iterator.i++])) {
            this.subColor = Utils.numToBool(command[iterator.i++]);
            this.colorID = System.DynamicValue.createValueCommand(command, 
                iterator);
        }
        this.waitEnd = Utils.numToBool(command[iterator.i++]);
        this.time = System.DynamicValue.createValueCommand(command, iterator);
        this.parallel = !this.waitEnd;
    }

    /** 
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize(): Record<string, any> {
        let time = this.time.getValue() * 1000;
        let color = this.colorID ? Datas.Systems.getColor(this.colorID
            .getValue()) : null;
        return {
            parallel: this.waitEnd,
            finalDifRed: Math.max(Math.min((this.r.getValue() + (color ? color
                .red : 0)) / 255, 1), -1) - Manager.GL.screenTone.x,
            finalDifGreen: Math.max(Math.min((this.g.getValue() + (color ? color
                .green : 0)) / 255, 1), -1) - Manager.GL.screenTone.y,
            finalDifBlue: Math.max(Math.min((this.b.getValue() + (color ? color
                .blue : 0)) / 255, 1), -1) - Manager.GL.screenTone.z,
            finalDifGrey: Math.max(Math.min(1 - (this.grey.getValue() / 100), 1)
                , -1) - Manager.GL.screenTone.w,
            time: time,
            timeLeft: time
        }
    }

    /** 
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState: Record<string, any>, object: MapObject, state: number): 
        number
    {
        if (currentState.parallel) {
            // Updating the time left
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
            Manager.GL.screenTone.setX(Manager.GL.screenTone.x + (timeRate * 
                currentState.finalDifRed));
            Manager.GL.screenTone.setY(Manager.GL.screenTone.y + (timeRate * 
                currentState.finalDifGreen));
            Manager.GL.screenTone.setZ(Manager.GL.screenTone.z + (timeRate * 
                currentState.finalDifBlue));
            Manager.GL.screenTone.setW(Manager.GL.screenTone.w + (timeRate * 
                currentState.finalDifGrey));
            Manager.GL.updateBackgroundColor(Scene.Map.current.mapProperties
                .backgroundColor);

            // If time = 0, then this is the end of the command
            if (currentState.timeLeft === 0) {
                return 1;
            }
            return 0;
        }
        return 1;
    }
}

export { ChangeScreenTone }