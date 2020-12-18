/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base";
import { System, Manager, EventCommand } from "..";
import { Utils } from "../Common";
/** @class
 *  An event command for shaking screen.
 *  @extends EventCommand
 *  @property {System.DynamicValue} offset The offset value
 *  @property {System.DynamicValue} shakeNumber The shakes number value
 *  @property {boolean} isWaitEnd Indicate if wait end of the command
 *  @property {System.DynamicValue} time The time value
 *  @param {Object} command Direct JSON command to parse
*/
class ShakeScreen extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.offset = System.DynamicValue.createValueCommand(command, iterator);
        this.shakeNumber = System.DynamicValue.createValueCommand(command, iterator);
        this.isWaitEnd = Utils.numToBool(command[iterator.i++]);
        this.time = System.DynamicValue.createValueCommand(command, iterator);
        this.isDirectNode = !this.isWaitEnd;
        this.parallel = !this.isWaitEnd;
    }
    /**
     *  Update the target offset
     *  @static
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {number} timeRate The time rate
     */
    static updateTargetOffset(currentState, timeRate) {
        let value = timeRate * currentState.finalDifPos;
        Manager.Stack.currentMap.camera.targetOffset.x += value * -Math.sin(Manager.Stack.currentMap.camera.horizontalAngle * Math.PI / 180.0);
        Manager.Stack.currentMap.camera.targetOffset.z += value * Math.cos(Manager.Stack.currentMap.camera.horizontalAngle * Math.PI / 180.0);
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        let t = this.time.getValue();
        let time = t * 1000;
        let shakeNumber = this.shakeNumber.getValue() * 2;
        let totalShakes = shakeNumber * t;
        // Should be pair to have perfect cycles
        if (totalShakes % 2 !== 0) {
            let floor = Math.floor(totalShakes / 2) * 2;
            let ceil = floor + 2;
            shakeNumber = ((floor !== 0 && (totalShakes - floor) < (ceil -
                totalShakes)) ? floor : ceil) / t;
        }
        let shakeTime = 1 / (shakeNumber * 2) * 1000;
        let offset = this.offset.getValue();
        return {
            parallel: this.isWaitEnd,
            offset: offset,
            shakeTime: shakeTime,
            shakeTimeLeft: shakeTime,
            currentOffset: 0,
            beginPosX: Manager.Stack.currentMap.camera.targetOffset.x,
            beginPosZ: Manager.Stack.currentMap.camera.targetOffset.z,
            finalDifPos: -offset,
            time: time,
            timeLeft: time,
            left: true
        };
    }
    /**
     *  Update and check if the event is finished
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The current object reacting
     *  @param {number} state The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState, object, state) {
        if (currentState.parallel) {
            let timeRate, dif;
            if (currentState.time === 0) {
                timeRate = 1;
            }
            else {
                dif = Manager.Stack.elapsedTime;
                currentState.timeLeft -= Manager.Stack.elapsedTime;
                if (currentState.timeLeft < 0) {
                    dif += currentState.timeLeft;
                    currentState.timeLeft = 0;
                }
                currentState.shakeTimeLeft -= Manager.Stack.elapsedTime;
                if (currentState.shakeTimeLeft <= 0) {
                    timeRate = (dif + currentState.shakeTimeLeft) / currentState
                        .shakeTime;
                    EventCommand.ShakeScreen.updateTargetOffset(currentState, timeRate);
                    dif = -currentState.shakeTimeLeft;
                    currentState.shakeTimeLeft = currentState.shakeTime +
                        currentState.shakeTimeLeft;
                    currentState.currentOffset++;
                    currentState.finalDifPos = (Math.ceil(currentState
                        .currentOffset / 2) % 2 === 0) ? -currentState.offset :
                        currentState.offset;
                }
                timeRate = dif / currentState.shakeTime;
            }
            EventCommand.ShakeScreen.updateTargetOffset(currentState, timeRate);
            if (currentState.timeLeft === 0) {
                Manager.Stack.currentMap.camera.targetOffset.x = currentState
                    .beginPosX;
                Manager.Stack.currentMap.camera.targetOffset.z = currentState
                    .beginPosZ;
                return 1;
            }
            return 0;
        }
        return 1;
    }
}
export { ShakeScreen };
