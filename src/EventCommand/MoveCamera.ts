/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Constants, Inputs, Mathf, Utils } from '../Common';
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
	/** @deprecated Move camera legacy mode (pre-3.2.30 projects), to remove. */
	public isLegacy: boolean;

	static runningMoves = new Set<Record<string, any>>();

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
		this.isLegacy = Utils.numberToBool(command[iterator.i++]);

		this.parallel = !this.isWaitEnd;
	}

	/**
	 *  Initialize the current state.
	 *  @returns {Record<string, any>} The current state
	 */
	initialize(): Record<string, any> {
		const time = (this.time.getValue() as number) * 1000;
		return {
			parallel: this.isWaitEnd,
			x: (this.x.getValue() as number) / (this.xSquare ? 1 : Data.Systems.SQUARE_SIZE),
			y: (this.y.getValue() as number) / (this.ySquare ? 1 : Data.Systems.SQUARE_SIZE),
			z: (this.z.getValue() as number) / (this.zSquare ? 1 : Data.Systems.SQUARE_SIZE),
			h: this.h.getValue() as number,
			v: this.v.getValue() as number,
			distance: (this.distance.getValue() as number) / Constants.BASIC_SQUARE_SIZE,
			time: time,
			timeLeft: time,
			targetID: this.targetID === null ? null : (this.targetID.getValue() as number),
			target: null,
		};
	}

	/**
	 *  Compute the final camera values from the camera state when the move
	 *  actually starts. An equal move stops any other camera move still running.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 */
	start(currentState: Record<string, any>) {
		if (this.operation === 0) {
			for (const move of MoveCamera.runningMoves) {
				move.cancelled = true;
			}
			MoveCamera.runningMoves.clear();
		}
		MoveCamera.runningMoves.add(currentState);
		const camera = Scene.Map.current.camera;
		const position = this.getCameraPosition();
		const operation = Mathf.OPERATORS_NUMBERS[this.operation];
		currentState.initialH = camera.horizontalAngle;
		currentState.initialDistance = camera.distance;
		currentState.finalPosition = new THREE.Vector3(
			operation(position.x, currentState.x),
			operation(position.y, currentState.y),
			operation(position.z, currentState.z),
		);
		currentState.finalDifH = operation(camera.horizontalAngle, currentState.h) - camera.horizontalAngle;
		currentState.finalDifV = operation(camera.verticalAngle, currentState.v) - camera.verticalAngle;
		currentState.finalDifDistance = operation(camera.distance, currentState.distance) - camera.distance;
		if (this.operation === 0 && !this.moveTargetOffset && !this.isLegacy) {
			const h = (currentState.h * Math.PI) / 180;
			const v = (currentState.v * Math.PI) / 180;
			const x = currentState.distance * Math.sin(v) * Math.cos(h) - currentState.x;
			const y = -currentState.distance * Math.cos(v) - currentState.y;
			const z = currentState.distance * Math.sin(v) * Math.sin(h) - currentState.z;
			const distance = Math.sqrt(x * x + y * y + z * z);
			if (distance > 0) {
				const aimH = (Math.atan2(z, x) * 180) / Math.PI;
				const finalH = currentState.h + Mathf.mod(aimH - currentState.h + 180, 360) - 180;
				const finalV = 90 + (Math.atan2(y, Math.sqrt(x * x + z * z)) * 180) / Math.PI;
				currentState.finalDifH = finalH - camera.horizontalAngle;
				currentState.finalDifV = finalV - camera.verticalAngle;
				currentState.finalDifDistance = distance - camera.distance;
			}
			currentState.finalPosition = position.clone();
		}
		if (this.operation !== 0 && !this.moveTargetOffset && !this.isLegacy && !currentState.target) {
			const finalPosition = currentState.finalPosition;
			const distance = finalPosition.distanceTo(camera.targetPosition);
			if (finalPosition.distanceToSquared(position) > 0) {
				if (distance >= 0.001) {
					currentState.finalDifH +=
						Mathf.mod(
							camera.getHorizontalAngle(finalPosition, camera.targetPosition) -
								camera.horizontalAngle +
								180,
							360,
						) - 180;
					currentState.finalDifV +=
						camera.getVerticalAngle(finalPosition, camera.targetPosition) - camera.verticalAngle;
				}
				currentState.finalDifDistance += distance - camera.distance;
			}
			currentState.finalPosition = position.clone();
		}
		currentState.started = true;
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
			if (currentState.cancelled) {
				return 1;
			}
			if (!currentState.waitingObject) {
				if (currentState.targetID === null) {
					currentState.target = false;
				} else {
					MapObject.search(
						currentState.targetID,
						(result: StructSearchResult) => {
							currentState.target = result.object;
							Scene.Map.current.camera.targetLastPosition = null;
						},
						object,
					);
				}
				currentState.waitingObject = true;
			}
			if (currentState.target !== null) {
				if (!currentState.started) {
					this.start(currentState);
				}
				let dif: THREE.Vector3;
				if (!currentState.editedTarget) {
					if (currentState.target) {
						Scene.Map.current.camera.targetOffset.add(
							Scene.Map.current.camera.target.position.clone().sub(currentState.target.position),
						);
						dif = currentState.target.position.clone().sub(Scene.Map.current.camera.target.position);
						currentState.finalPosition.add(dif);
						Scene.Map.current.camera.target = currentState.target;
						if (!this.moveTargetOffset) {
							currentState.moveChangeTargetDif = currentState.finalPosition
								.clone()
								.sub(dif)
								.sub(this.getCameraPosition());
						}
					}
					if (this.operation === 0 && this.moveTargetOffset && !this.isLegacy) {
						currentState.finalDifPosition = new THREE.Vector3(
							currentState.x,
							currentState.y,
							currentState.z,
						).sub(Scene.Map.current.camera.targetOffset);
					} else {
						currentState.finalDifPosition = currentState.finalPosition.sub(this.getCameraPosition());
					}
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

				if (currentState.target) {
					Scene.Map.current.camera.targetLastPosition = null;
				}

				if (this.isLegacy) {
					this.updateCameraLegacy(currentState, timeRate);
				} else {
					this.updateCamera(currentState, timeRate);
				}
				Scene.Map.current.updateLayerOffsets();

				// If time = 0, then this is the end of the command
				if (currentState.timeLeft === 0) {
					MoveCamera.runningMoves.delete(currentState);
					Inputs.updateLockedKeysAngles(currentState.initialH);
					return 1;
				}
			}
			return 0;
		}
		return 1;
	}
	/**
	 *  Get the camera position the move is computed from.
	 *  @returns {THREE.Vector3}
	 */
	getCameraPosition(): THREE.Vector3 {
		const camera = Scene.Map.current.camera;
		return this.isLegacy ? camera.getThreeCamera().position.clone() : camera.getOrbitPosition();
	}

	/**
	 *  Apply the position part of the move.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {number} timeRate - The rate of the move to apply this frame
	 */
	move(currentState: Record<string, any>, timeRate: number) {
		const camera = Scene.Map.current.camera;
		let positionOffset = new THREE.Vector3(
			timeRate * currentState.finalDifPosition.x,
			timeRate * currentState.finalDifPosition.y,
			timeRate * currentState.finalDifPosition.z,
		);
		camera.getThreeCamera().position.add(positionOffset);
		if (this.moveTargetOffset) {
			camera.targetOffset.add(positionOffset);
		} else {
			if (currentState.moveChangeTargetDif) {
				positionOffset = new THREE.Vector3(
					timeRate * (currentState.finalDifPosition.x - currentState.moveChangeTargetDif.x),
					timeRate * (currentState.finalDifPosition.y - currentState.moveChangeTargetDif.y),
					timeRate * (currentState.finalDifPosition.z - currentState.moveChangeTargetDif.z),
				);
				camera.targetOffset.add(positionOffset);
			}
		}
		camera.updateTargetPosition();
	}

	/**
	 *  Apply the rotation part of the move.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {number} timeRate - The rate of the move to apply this frame
	 */
	rotate(currentState: Record<string, any>, timeRate: number) {
		const camera = Scene.Map.current.camera;
		camera.addHorizontalAngle(timeRate * currentState.finalDifH);
		camera.addVerticalAngle(timeRate * currentState.finalDifV);
		if (this.rotationTargetOffset) {
			camera.updateTargetOffset();
		}
	}

	/**
	 *  Apply the zoom part of the move.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {number} timeRate - The rate of the move to apply this frame
	 *  @param {boolean} absolute - Indicate if the distance is set from the initial distance
	 */
	zoom(currentState: Record<string, any>, timeRate: number, absolute: boolean) {
		const camera = Scene.Map.current.camera;
		if (absolute) {
			camera.distance =
				currentState.initialDistance +
				(1 - (currentState.time === 0 ? 0 : currentState.timeLeft / currentState.time)) *
					currentState.finalDifDistance;
		} else {
			camera.updateDistance();
			camera.distance += timeRate * currentState.finalDifDistance;
		}
	}

	/**
	 *  Update the camera for one frame.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {number} timeRate - The rate of the move to apply this frame
	 */
	updateCamera(currentState: Record<string, any>, timeRate: number) {
		const camera = Scene.Map.current.camera;
		this.move(currentState, timeRate);
		const position = this.rotationTargetOffset ? camera.getOrbitPosition() : null;
		camera.addHorizontalAngle(timeRate * currentState.finalDifH);
		camera.addVerticalAngle(timeRate * currentState.finalDifV);
		if (position) {
			camera.targetOffset.add(position.sub(camera.getOrbitPosition()));
			camera.updateTargetPosition();
		}
		camera.distance += timeRate * currentState.finalDifDistance;
	}

	/**
	 *  Update the camera for one frame like before version 3.2.30.
	 *  @deprecated Move camera legacy mode (pre-3.2.30 projects), to remove.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {number} timeRate - The rate of the move to apply this frame
	 */
	updateCameraLegacy(currentState: Record<string, any>, timeRate: number) {
		this.rotate(currentState, timeRate);
		this.move(currentState, timeRate);
		if (currentState.finalDifH === 0 && currentState.finalDifV === 0 && !currentState.target) {
			Scene.Map.current.camera.updateAngles();
		}
		this.zoom(currentState, timeRate, this.operation === 0);
	}
}

export { MoveCamera };
