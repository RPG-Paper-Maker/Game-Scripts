/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { ORIENTATION, Utils } from '../Common';
import { MapObject, Position } from '../Core';
import { Manager } from '../index';
import { Base } from './Base';

/**
 * JSON structure describing a detection.
 */
export type DetectionJSON = {
	b?: {
		k: number[];
		v: {
			bls?: number;
			blp?: number;
			bhs?: number;
			bhp?: number;
			bws?: number;
			bwp?: number;
		};
	}[];
};

/**
 * A detection of the game.
 */
export class Detection extends Base {
	boxes: [Position, number, number, number, number, number, number][];

	constructor(json?: DetectionJSON) {
		super(json);
	}

	/**
	 * Check the collision between sender and object.
	 */
	checkCollision(sender: MapObject, object: MapObject): boolean {
		const boundingBoxes = this.getBoundingBoxes(sender);
		for (const boundingBox of boundingBoxes) {
			Manager.Collisions.applyBoxSpriteTransforms(Manager.Collisions.getBBBoxDetection(), boundingBox);
			if (object.checkCollisionDetection()) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Get the sender bounding boxes.
	 */
	getBoundingBoxes(sender: MapObject): number[][] {
		const orientation = sender.orientationEye;
		const localPosition = sender.position;
		const list = new Array(this.boxes.length);
		const angleY = ((4 - orientation) % 4) * 90;
		const senderRotation = new THREE.Quaternion().setFromAxisAngle(
			new THREE.Vector3(0, 1, 0),
			THREE.MathUtils.degToRad(angleY),
		);
		const boxEuler = new THREE.Euler();
		const boxRotation = new THREE.Quaternion();
		const combinedQuaternion = new THREE.Quaternion();
		const combinedRotation = new THREE.Euler();
		const center = new THREE.Vector3();
		for (let i = 0; i < this.boxes.length; i++) {
			const [p, bls, blp, bhs, bhp, bws, bwp] = this.boxes[i];
			const length = (bls + blp / 100) * p.scaleX;
			const height = (bhs + bhp / 100) * p.scaleY;
			const width = (bws + bwp / 100) * p.scaleZ;
			center.set(length / 2 - 0.5, height / 2, width / 2 - 0.5);
			const isRotated = p.angleX !== 0 || p.angleY !== 0 || p.angleZ !== 0;
			if (isRotated) {
				boxEuler.set(
					THREE.MathUtils.degToRad(p.angleX),
					THREE.MathUtils.degToRad(p.angleY),
					THREE.MathUtils.degToRad(p.angleZ),
				);
				boxRotation.setFromEuler(boxEuler);
				combinedQuaternion.copy(senderRotation).multiply(boxRotation);
				combinedRotation.setFromQuaternion(combinedQuaternion, 'XYZ');
			}
			center.x += p.x - 0.5 + p.getPixelsCenterX();
			center.y += p.getTotalY();
			center.z += p.z - 0.5 + p.getPixelsCenterZ();
			let x: number;
			let z: number;
			switch (orientation) {
				case ORIENTATION.SOUTH:
					x = center.x;
					z = center.z;
					break;
				case ORIENTATION.WEST:
					x = -center.z;
					z = center.x;
					break;
				case ORIENTATION.NORTH:
					x = -center.x;
					z = -center.z;
					break;
				case ORIENTATION.EAST:
					x = center.z;
					z = -center.x;
					break;
				default:
					x = 0;
					z = 0;
					break;
			}
			list[i] = [
				localPosition.x + x,
				localPosition.y + center.y,
				localPosition.z + z,
				length,
				height,
				width,
				isRotated ? THREE.MathUtils.radToDeg(combinedRotation.y) : angleY,
				isRotated ? THREE.MathUtils.radToDeg(combinedRotation.x) : 0,
				isRotated ? THREE.MathUtils.radToDeg(combinedRotation.z) : 0,
			];
		}
		return list;
	}

	/**
	 * Read the JSON associated to the detection.
	 */
	read(json: DetectionJSON): void {
		const jsonList = Utils.valueOrDefault(json.b, []);
		this.boxes = new Array(jsonList.length);
		for (const [index, item] of jsonList.entries()) {
			if (!item) continue;
			const { k, v } = item;
			this.boxes[index] = [
				Position.createFromArray(k),
				Utils.valueOrDefault(v.bls, 1),
				Utils.valueOrDefault(v.blp, 0),
				Utils.valueOrDefault(v.bhs, 1),
				Utils.valueOrDefault(v.bhp, 0),
				Utils.valueOrDefault(v.bws, 1),
				Utils.valueOrDefault(v.bwp, 0),
			];
		}
	}
}
