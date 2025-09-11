/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Utils } from '../Common';
import { Datas } from '../index';
import { CollisionSquare } from './CollisionSquare';
import { CustomGeometry } from './CustomGeometry';
import { MapElement, StructMapElementCollision } from './MapElement';
import { Position } from './Position';
import { Rectangle } from './Rectangle';
import { Sprite } from './Sprite';

/** @class
 *  A land in the map.
 *  @extends MapElement
 */
class Land extends MapElement {
	public up: boolean;
	public texture: Rectangle;

	constructor() {
		super();
	}

	/**
	 *  Read the JSON associated to the land
	 *  @param {Record<string, any>} json - Json object describing the land
	 */
	read(json: Record<string, any>) {
		super.read(json);
		this.up = Utils.valueOrDefault(json.up, true);
		this.texture = Rectangle.createFromArray(json.t);
	}

	/**
	 *  Return the rect index.
	 *  @param {number} width
	 *  @returns {number}
	 */
	getIndex(width: number): number {
		return this.texture.x + this.texture.y * width;
	}

	/**
	 *  Update the geometry associated to this land and return the collision
	 *  result.
	 *  @param {Core.CustomGeometry} geometry - The geometry asoociated to the
	 *  autotiles
	 *  @param {CollisionSquare} collision - The collision square
	 *  @param {Position} position - The position
	 *  @param {number} width - The texture total width
	 *  @param {number} height - The texture total height
	 *  @param {number} x - The x texture position
	 *  @param {number} y - The y texture position
	 *  @param {number} w - The w texture size
	 *  @param {number} h - The h texture size
	 *  @param {number} count - The faces count
	 *  @returns {StructCollision}
	 */
	updateGeometryLand(
		geometry: CustomGeometry,
		collision: CollisionSquare,
		position: Position,
		width: number,
		height: number,
		x: number,
		y: number,
		w: number,
		h: number,
		count: number
	): StructMapElementCollision {
		const localPosition = position.toVector3();
		const a = localPosition.x;
		let yLayerOffset = position.layer * 0.05;
		if (!this.up) {
			yLayerOffset *= -1;
		}
		const b = localPosition.y + yLayerOffset;
		const c = localPosition.z;
		let objCollision: StructMapElementCollision = null;

		// Vertices
		const vecA = new THREE.Vector3(a - Datas.Systems.SQUARE_SIZE / 2, b, c - Datas.Systems.SQUARE_SIZE / 2);
		const vecB = new THREE.Vector3(a + Datas.Systems.SQUARE_SIZE / 2, b, c - Datas.Systems.SQUARE_SIZE / 2);
		const vecC = new THREE.Vector3(a + Datas.Systems.SQUARE_SIZE / 2, b, c + Datas.Systems.SQUARE_SIZE / 2);
		const vecD = new THREE.Vector3(a - Datas.Systems.SQUARE_SIZE / 2, b, c + Datas.Systems.SQUARE_SIZE / 2);
		const center = new THREE.Vector3(a, b, c);
		Sprite.rotateQuadEuler(vecA, vecB, vecC, vecD, center, position.toRotationEuler());
		// Vertices
		geometry.pushQuadVertices(vecA, vecB, vecC, vecD);

		// Indices
		geometry.pushQuadIndices(count * 4);

		// UVs
		const coefX = MapElement.COEF_TEX / width;
		const coefY = MapElement.COEF_TEX / height;
		x += coefX;
		y += coefY;
		w -= coefX * 2;
		h -= coefY * 2;
		const texA = new THREE.Vector2();
		const texB = new THREE.Vector2();
		const texC = new THREE.Vector2();
		const texD = new THREE.Vector2();
		CustomGeometry.uvsQuadToTex(texA, texB, texC, texD, x, y, w, h);
		geometry.pushQuadUVs(texA, texB, texC, texD);

		// Collision
		if (collision !== null) {
			const rect = collision.rect;
			if (!collision.hasAllDirections() || collision.terrain > 0) {
				let rectB =
					rect === null
						? [0, 0, Datas.Systems.SQUARE_SIZE, Datas.Systems.SQUARE_SIZE]
						: [rect.x, rect.y, rect.width, rect.height];
				rectB = [a + rectB[0], b + 0.5, c + rectB[1], rectB[2], rectB[3], 1, 0];
				objCollision = {
					p: position,
					l: localPosition,
					b: rectB,
					cs: collision,
				};
			} else if (rect !== null) {
				objCollision = {
					p: position,
					l: localPosition,
					b: [a + rect.x, b + 0.5, c + rect.y, rect.width, rect.height, 1, 0],
					cs: null,
				};
			}
		}
		return objCollision;
	}
}

export { Land };
