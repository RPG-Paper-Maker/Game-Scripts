/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas, Manager, Scene, System } from "..";
import { Utils } from "../Common";
import { Game, MapObject } from "../Core";
import { Base } from "./Base";

/** @class
 *  An event command for changing weather.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class ChangeWeather extends Base {
    
    public isNone: boolean;
    public isColor: boolean;
    public colorID: System.DynamicValue;
    public imageID: System.DynamicValue;
    public numberPerPortion: System.DynamicValue;
    public portionsRay: System.DynamicValue;
    public size: System.DynamicValue;
    public depthTest: System.DynamicValue;
    public depthWrite: System.DynamicValue;
    public initialVelocity: System.DynamicValue;
    public velocityAddition: System.DynamicValue;
    public initialYRotation: System.DynamicValue;
    public yRotationAddition: System.DynamicValue;
    public isWaitEnd: boolean;
    public time: System.DynamicValue;

    constructor(command: any[]) {
        super();

        let iterator = {
            i: 0
        }
        switch (command[iterator.i++]) {
            case 0:
                this.isNone = true;
                break;
            case 1:
                this.isNone = false;
                switch (command[iterator.i++]) {
                    case 0:
                        this.isColor = true;
                        this.colorID = System.DynamicValue.createValueCommand(
                            command, iterator);
                        break;
                    case 1:
                        this.isColor = false;
                        this.imageID = System.DynamicValue.createValueCommand(
                            command, iterator);
                        iterator.i++;
                        break;
                }
                this.numberPerPortion = System.DynamicValue.createValueCommand(
                    command, iterator);
                this.portionsRay = System.DynamicValue.createValueCommand(
                    command, iterator);
                this.size = System.DynamicValue.createValueCommand(
                    command, iterator);
                this.depthTest = System.DynamicValue.createValueCommand(
                    command, iterator);
                this.depthWrite = System.DynamicValue.createValueCommand(
                    command, iterator);
                this.initialVelocity = System.DynamicValue.createValueCommand(
                    command, iterator);
                this.velocityAddition = System.DynamicValue.createValueCommand(
                    command, iterator);
                this.initialYRotation = System.DynamicValue.createValueCommand(
                    command, iterator);
                this.yRotationAddition = System.DynamicValue.createValueCommand(
                    command, iterator);
                break;
        }
        this.isWaitEnd = Utils.numToBool(command[iterator.i++]);
        this.time = System.DynamicValue.createValueCommand(command, iterator);
        this.parallel = !this.isWaitEnd;
    }

    /** 
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize(): Record<string, any> {
        let time = this.time.getValue() * 1000;
        let result: Record<string, any> = {
            parallel: this.isWaitEnd,
            time: time,
            timeLeft: time,
            isNone: this.isNone,
            isColor: this.isColor,
            particles: 0,
            created: false
        }
        if (this.isNone) {
            return result;
        }
        if (this.isColor) {
            result.color = Datas.Systems.getColor(this.colorID.getValue());
        } else {
            result.imageID = this.imageID.getValue();
        }
        result.numberPerPortion = this.numberPerPortion.getValue();
        result.finalDifParticles = result.numberPerPortion;
        result.portionsRay = this.portionsRay.getValue();
        result.size = this.size.getValue();
        result.depthTest = this.depthTest.getValue();
        result.depthWrite = this.depthWrite.getValue();
        result.initialVelocity = this.initialVelocity.getValue();
        result.velocityAddition = this.velocityAddition.getValue();
        result.initialYRotation = this.initialYRotation.getValue();
        result.yRotationAddition = this.yRotationAddition.getValue();
        return result;
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
            currentState.particles = currentState.particles + (timeRate * currentState
                .finalDifParticles);

            // Create weather in the current map
            if (!currentState.created) {
                currentState.created = true;
                Game.current.currentWeatherOptions = currentState;
                console.log("ok")
                Scene.Map.current.createWeather();
            }
            return currentState.timeLeft === 0 ? 1 : 0;
        }
        return 1;
    }
}

export { ChangeWeather }