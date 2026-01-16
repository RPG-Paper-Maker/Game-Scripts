/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Inputs, Mathf, Utils } from '../Common';
import { MapObject, StructSearchResult } from '../Core';
import { Data, Manager, Model, Scene } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for displaying text.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class MoveCamera extends Base {
	public targetID: Model.DynamicValue;
	public operation: number;
	public moveTargetOffset: boolean;
	public cameraOrientation: boolean;
	public x: Model.DynamicValue;
	public xSquare: boolean;
	public y: Model.DynamicValue;
	public ySquare: boolean;
	public z: Model.DynamicValue;
	public zSquare: boolean;
	public rotationTargetOffset: boolean;
	public h: Model.DynamicValue;
	public v: Model.DynamicValue;
	public distance: Model.DynamicValue;
	public isWaitEnd: boolean;
	public time: Model.DynamicValue;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};

		// Target
		if (!Utils.numberToBool(command[iterator.i++])) {
			this.targetID = null;
		} else {
			this.targetID = Model.DynamicValue.createValueCommand(command, iterator);
		}

		// Operation
		this.operation = command[iterator.i++];

		// Move
		this.moveTargetOffset = Utils.numberToBool(command[iterator.i++]);
		this.cameraOrientation = Utils.numberToBool(command[iterator.i++]);
		this.x = Model.DynamicValue.createValueCommand(command, iterator);
		this.xSquare = !Utils.numberToBool(command[iterator.i++]);
		this.y = Model.DynamicValue.createValueCommand(command, iterator);
		this.ySquare = !Utils.numberToBool(command[iterator.i++]);
		this.z = Model.DynamicValue.createValueCommand(command, iterator);
		this.zSquare = !Utils.numberToBool(command[iterator.i++]);

		// Rotation
		this.rotationTargetOffset = Utils.numberToBool(command[iterator.i++]);
		this.h = Model.DynamicValue.createValueCommand(command, iterator);
		this.v = Model.DynamicValue.createValueCommand(command, iterator);

		// Zoom
		this.distance = Model.DynamicValue.createValueCommand(command, iterator);

		// Options
		this.isWaitEnd = Utils.numberToBool(command[iterator.i++]);
		this.time = Model.DynamicValue.createValueCommand(command, iterator);

		this.parallel = !this.isWaitEnd;
	}

	/**
	 *  Initialize the current state.
	 *  @returns {Record<string, any>} The current state
	 */
	initialize(): Record<string, any> {
		Scene.Map.current.camera.update();
		const time = (this.time.getValue() as number) * 1000;
		const operation = Mathf.OPERATORS_NUMBERS[this.operation];
		const finalX = operation(
			Scene.Map.current.camera.getThreeCamera().position.x,
			(this.x.getValue() as number) * (this.xSquare ? Data.Systems.SQUARE_SIZE : 1)
		);
		const finalY = operation(
			Scene.Map.current.camera.getThreeCamera().position.y,
			(this.y.getValue() as number) * (this.ySquare ? Data.Systems.SQUARE_SIZE : 1)
		);
		const finalZ = operation(
			Scene.Map.current.camera.getThreeCamera().position.z,
			(this.z.getValue() as number) * (this.zSquare ? Data.Systems.SQUARE_SIZE : 1)
		);
		const finalH = operation(Scene.Map.current.camera.horizontalAngle, this.h.getValue() as number);
		const finalV = operation(Scene.Map.current.camera.verticalAngle, this.v.getValue() as number);
		const finalDistance = operation(Scene.Map.current.camera.distance, this.distance.getValue() as number);
		return {
			parallel: this.isWaitEnd,
			initialH: Scene.Map.current.camera.horizontalAngle,
			finalPosition: new THREE.Vector3(finalX, finalY, finalZ),
			finalDifH: finalH - Scene.Map.current.camera.horizontalAngle,
			finalDifV: finalV - Scene.Map.current.camera.verticalAngle,
			finalDifDistance: finalDistance - Scene.Map.current.camera.distance,
			time: time,
			timeLeft: time,
			targetID: this.targetID === null ? null : (this.targetID.getValue() as number),
			target: null,
		};
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		if (currentState.parallel) {
			if (!currentState.waitingObject) {
				if (currentState.targetID === null) {
					currentState.target = false;
				} else {
					MapObject.search(
						currentState.targetID,
						(result: StructSearchResult) => {
							currentState.target = result.object;
						},
						object
					);
				}
				currentState.waitingObject = true;
			}
			if (currentState.target !== null) {
				let dif: THREE.Vector3;
				if (!currentState.editedTarget) {
					if (currentState.target) {
						Scene.Map.current.camera.targetOffset.add(
							Scene.Map.current.camera.target.position.clone().sub(currentState.target.position)
						);
						dif = currentState.target.position.clone().sub(Scene.Map.current.camera.target.position);
						currentState.finalPosition.add(dif);
						Scene.Map.current.camera.target = currentState.target;
						if (!this.moveTargetOffset) {
							currentState.moveChangeTargetDif = currentState.finalPosition
								.clone()
								.sub(dif)
								.sub(Scene.Map.current.camera.getThreeCamera().position);
						}
					}
					currentState.finalDifPosition = currentState.finalPosition.sub(
						Scene.Map.current.camera.getThreeCamera().position
					);
					currentState.editedTarget = true;
				}

				// Updating the time left
				let timeRate: number, difNb: number;
				if (currentState.time === 0) {
					timeRate = 1;
				} else {
					difNb = Manager.Stack.elapsedTime;
					currentState.timeLeft -= Manager.Stack.elapsedTime;
					if (currentState.timeLeft < 0) {
						difNb += currentState.timeLeft;
						currentState.timeLeft = 0;
					}
					timeRate = difNb / currentState.time;
				}

				// Rotation
				Scene.Map.current.camera.addHorizontalAngle(timeRate * currentState.finalDifH);
				Scene.Map.current.camera.addVerticalAngle(timeRate * currentState.finalDifV);
				if (this.rotationTargetOffset) {
					Scene.Map.current.camera.updateTargetOffset();
				}

				// Move
				let positionOffset = new THREE.Vector3(
					timeRate * currentState.finalDifPosition.x,
					timeRate * currentState.finalDifPosition.y,
					timeRate * currentState.finalDifPosition.z
				);
				Scene.Map.current.camera.getThreeCamera().position.add(positionOffset);
				if (this.moveTargetOffset) {
					Scene.Map.current.camera.targetOffset.add(positionOffset);
				} else {
					if (currentState.moveChangeTargetDif) {
						positionOffset = new THREE.Vector3(
							timeRate * (currentState.finalDifPosition.x - currentState.moveChangeTargetDif.x),
							timeRate * (currentState.finalDifPosition.y - currentState.moveChangeTargetDif.y),
							timeRate * (currentState.finalDifPosition.z - currentState.moveChangeTargetDif.z)
						);
						Scene.Map.current.camera.targetOffset.add(positionOffset);
					}
				}
				Scene.Map.current.camera.updateTargetPosition();
				if (currentState.finalDifH === 0 && currentState.finalDifV === 0) {
					Scene.Map.current.camera.updateAngles();
				}
				Scene.Map.current.camera.updateDistance();

				// Zoom
				Scene.Map.current.camera.distance += timeRate * currentState.finalDifDistance;

				// Update
				Scene.Map.current.camera.update();

				// If time = 0, then this is the end of the command
				if (currentState.timeLeft === 0) {
					Inputs.updateLockedKeysAngles(currentState.initialH);
					return 1;
				}
			}
			return 0;
		}
		return 1;
	}
}

export { MoveCamera };
