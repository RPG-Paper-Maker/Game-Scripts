/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ORIENTATION, Utils } from '../Common';
import { MapObject, Position } from '../Core';
import { Data, Manager } from '../index';
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
		for (let i = 0; i < this.boxes.length; i++) {
			const [p, bls, blp, bhs, bhp, bws, bwp] = this.boxes[i];
			const length = bls * Data.Systems.SQUARE_SIZE + (blp / 100) * Data.Systems.SQUARE_SIZE;
			const height = bhs * Data.Systems.SQUARE_SIZE + (bhp / 100) * Data.Systems.SQUARE_SIZE;
			const width = bws * Data.Systems.SQUARE_SIZE + (bwp / 100) * Data.Systems.SQUARE_SIZE;
			const px = (p.x - 1) * Data.Systems.SQUARE_SIZE + p.getPixelsCenterX() + length / 2;
			const pz = (p.z - 1) * Data.Systems.SQUARE_SIZE + p.getPixelsCenterZ() + width / 2;
			let x: number;
			let z: number;
			switch (orientation) {
				case ORIENTATION.SOUTH:
					x = px;
					z = pz;
					break;
				case ORIENTATION.WEST:
					x = -pz;
					z = px;
					break;
				case ORIENTATION.NORTH:
					x = -px;
					z = -pz;
					break;
				case ORIENTATION.EAST:
					x = pz;
					z = -px;
					break;
				default:
					x = 0;
					z = 0;
					break;
			}
			list[i] = [
				localPosition.x + x,
				localPosition.y + p.getTotalY() + height / 2,
				localPosition.z + z,
				length,
				height,
				width,
				0,
				0,
				0,
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
		for (const [index, { k, v }] of jsonList.entries()) {
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
