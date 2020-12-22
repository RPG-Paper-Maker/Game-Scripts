/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { Utils, Mathf } from "../Common";
import { System, Manager, Datas } from "..";
import { MapObject, StructSearchResult, Vector3 } from "../Core";

/** @class
 *  An event command for displaying text.
 *  @extends EventCommand.Base
 *  @param {any[]} command Direct JSON command to parse
 */
class MoveCamera extends Base {

    public targetID: System.DynamicValue;
    public operation: number;
    public moveTargetOffset: boolean;
    public cameraOrientation: boolean;
    public x: System.DynamicValue;
    public xSquare: boolean;
    public y: System.DynamicValue;
    public ySquare: boolean;
    public z: System.DynamicValue;
    public zSquare: boolean;
    public rotationTargetOffset: boolean;
    public h: System.DynamicValue;
    public v: System.DynamicValue;
    public distance: System.DynamicValue;
    public isWaitEnd: boolean;
    public time: System.DynamicValue;

    constructor(command: any[]) {
        super();

        let iterator = {
            i: 0
        }

        // Target
        if (!Utils.numToBool(command[iterator.i++])) {
            this.targetID = null;
        } else {
            this.targetID = System.DynamicValue.createValueCommand(command, iterator);
        }

        // Operation
        this.operation = command[iterator.i++];

        // Move
        this.moveTargetOffset = Utils.numToBool(command[iterator.i++]);
        this.cameraOrientation = Utils.numToBool(command[iterator.i++]);
        this.x = System.DynamicValue.createValueCommand(command, iterator);
        this.xSquare = !Utils.numToBool(command[iterator.i++]);
        this.y = System.DynamicValue.createValueCommand(command, iterator);
        this.ySquare = !Utils.numToBool(command[iterator.i++]);
        this.z = System.DynamicValue.createValueCommand(command, iterator);
        this.zSquare = !Utils.numToBool(command[iterator.i++]);

        // Rotation
        this.rotationTargetOffset = Utils.numToBool(command[iterator.i++]);
        this.h = System.DynamicValue.createValueCommand(command, iterator);
        this.v = System.DynamicValue.createValueCommand(command, iterator);

        // Zoom
        this.distance = System.DynamicValue.createValueCommand(command, iterator);

        // Options
        this.isWaitEnd = Utils.numToBool(command[iterator.i++]);
        this.time = System.DynamicValue.createValueCommand(command, iterator);

        this.isDirectNode = false;
        this.parallel = !this.isWaitEnd;
    }

    /** 
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize(): Record<string, any> {
        let time = this.time.getValue() * 1000;
        let operation = Mathf.OPERATORS_NUMBERS[this.operation];
        let finalX = operation(Manager.Stack.currentMap.camera.getThreeCamera()
            .position.x, this.x.getValue() * (this.xSquare ? Datas.Systems
            .SQUARE_SIZE : 1));
        let finalY = operation(Manager.Stack.currentMap.camera.getThreeCamera()
            .position.y, this.y.getValue() * (this.ySquare ? Datas.Systems
            .SQUARE_SIZE : 1));
        let finalZ = operation(Manager.Stack.currentMap.camera.getThreeCamera()
            .position.z, this.z.getValue() * (this.zSquare ? Datas.Systems
            .SQUARE_SIZE : 1));
        let finalH = operation(Manager.Stack.currentMap.camera.horizontalAngle, 
            this.h.getValue());
        let finalV = operation(Manager.Stack.currentMap.camera.verticalAngle, 
            this.v.getValue());
        let finalDistance = operation(Manager.Stack.currentMap.camera.distance, 
            this.distance.getValue());                   
        return {
            parallel: this.isWaitEnd,
            finalPosition: new Vector3(finalX, finalY, finalZ),
            finalDifH: finalH - Manager.Stack.currentMap.camera.horizontalAngle,
            finalDifV: finalV - Manager.Stack.currentMap.camera.verticalAngle,
            finalDistance: finalDistance - Manager.Stack.currentMap.camera
                .distance,
            time: time,
            timeLeft: time,
            targetID: this.targetID === null ? null : this.targetID.getValue(),
            target: null
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
            if (!currentState.waitingObject) {
                if (currentState.targetID === null) {
                    currentState.target = false;
                } else {
                    MapObject.search(currentState.targetID, (result: 
                        StructSearchResult) => {
                        currentState.target = result.object;
                    }, object);
                }
                currentState.waitingObject = true;
            }
            if (currentState.target !== null)  {
                let dif: Vector3;
                if (!currentState.editedTarget) {
                    if (currentState.target) {
                        Manager.Stack.currentMap.camera.targetOffset.add(Manager
                            .Stack.currentMap.camera.target.position.clone().sub
                            (currentState.target.position));
                        dif = currentState.target.position.clone().sub(Manager
                            .Stack.currentMap.camera.target.position);
                        currentState.finalPosition.add(dif);
                        Manager.Stack.currentMap.camera.target = currentState
                            .target;
                        if (!this.moveTargetOffset) {
                            currentState.moveChangeTargetDif = currentState
                                .finalPosition.clone().sub(dif).sub(Manager
                                .Stack.currentMap.camera.getThreeCamera()
                                .position);
                        }
                    }
                    currentState.finalDifPosition = currentState.finalPosition
                        .sub(Manager.Stack.currentMap.camera.getThreeCamera()
                        .position);
                    currentState.editedTarget = true;
                }

                // Updating the time left
                let timeRate: number, difNb: number;
                if (currentState.time === 0) {
                    timeRate = 1;
                } else  {
                    difNb = Manager.Stack.elapsedTime;
                    currentState.timeLeft -= Manager.Stack.elapsedTime;
                    if (currentState.timeLeft < 0) {
                        dif += currentState.timeLeft;
                        currentState.timeLeft = 0;
                    }
                    timeRate = difNb / currentState.time;
                }

                // Move
                let positionOffset = new Vector3(
                    timeRate * currentState.finalDifPosition.x,
                    timeRate * currentState.finalDifPosition.y,
                    timeRate * currentState.finalDifPosition.z
                );
                Manager.Stack.currentMap.camera.getThreeCamera().position.add(
                    positionOffset);
                if (this.moveTargetOffset) {
                    Manager.Stack.currentMap.camera.targetOffset.add(positionOffset);
                } else {
                    if (currentState.moveChangeTargetDif) {
                        positionOffset = new Vector3(timeRate * (
                            currentState.finalDifPosition.x - currentState
                            .moveChangeTargetDif.x), timeRate * (currentState
                            .finalDifPosition.y - currentState
                            .moveChangeTargetDif.y), timeRate * (currentState
                            .finalDifPosition.z - currentState
                            .moveChangeTargetDif.z)
                        );
                        Manager.Stack.currentMap.camera.targetOffset.add(
                            positionOffset);
                    }
                }
                Manager.Stack.currentMap.camera.updateTargetPosition();
                Manager.Stack.currentMap.camera.updateAngles();
                Manager.Stack.currentMap.camera.updateDistance();

                // Rotation
                Manager.Stack.currentMap.camera.horizontalAngle += timeRate * 
                    currentState.finalDifH;
                Manager.Stack.currentMap.camera.addVerticalAngle(timeRate * 
                    currentState.finalDifV);
                if (this.rotationTargetOffset) {
                    Manager.Stack.currentMap.camera.updateTargetOffset();
                }

                // Zoom
                Manager.Stack.currentMap.camera.distance += timeRate * 
                    currentState.finalDistance;

                // Update
                Manager.Stack.currentMap.camera.update();

                // If time = 0, then this is the end of the command
                return currentState.timeLeft === 0 ? 1 : 0;
            }
            return 0;
        }
        return 1;
    }
}

export { MoveCamera }