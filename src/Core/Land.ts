/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

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
import { Sprite } from './Sprite';

/** @class
 *  A land in the map.
 *  @extends MapElement
 */
class Land extends MapElement {
	public up: boolean;
	public texture: number[];

	constructor() {
		super();
	}

	/**
	 *  Read the JSON associated to the land
	 *  @param {Record<string, any>} json - Json object describing the land
	 */
	read(json: Record<string, any>) {
		super.read(json);
		this.up = Utils.defaultValue(json.up, true);
		this.texture = json.t;
		if (this.texture.length === 2) {
			this.texture.push(1);
			this.texture.push(1);
		}
	}

	/**
	 *  Return the rect index.
	 *  @param {number} width
	 *  @returns {number}
	 */
	getIndex(width: number): number {
		return this.texture[0] + this.texture[1] * width;
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
		let a = localPosition.x;
		let yLayerOffset = position.layer * 0.05;
		if (!this.up) {
			yLayerOffset *= -1;
		}
		let b = localPosition.y + yLayerOffset;
		let c = localPosition.z;
		let objCollision: StructMapElementCollision = null;

		// Vertices
		const vecA = new THREE.Vector3(a - Datas.Systems.SQUARE_SIZE / 2, b, c - Datas.Systems.SQUARE_SIZE / 2);
		const vecB = new THREE.Vector3(a + Datas.Systems.SQUARE_SIZE / 2, b, c - Datas.Systems.SQUARE_SIZE / 2);
		const vecC = new THREE.Vector3(a + Datas.Systems.SQUARE_SIZE / 2, b, c + Datas.Systems.SQUARE_SIZE / 2);
		const vecD = new THREE.Vector3(a - Datas.Systems.SQUARE_SIZE / 2, b, c + Datas.Systems.SQUARE_SIZE / 2);
		let center = new THREE.Vector3(a, b, c);
		Sprite.rotateQuadEuler(vecA, vecB, vecC, vecD, center, position.toRotationEuler());
		// Vertices
		geometry.pushQuadVertices(vecA, vecB, vecC, vecD);

		// Indices
		geometry.pushQuadIndices(count * 4);

		// UVs
		let coefX = MapElement.COEF_TEX / width;
		let coefY = MapElement.COEF_TEX / height;
		x += coefX;
		y += coefY;
		w -= coefX * 2;
		h -= coefY * 2;
		let texA = new THREE.Vector2();
		let texB = new THREE.Vector2();
		let texC = new THREE.Vector2();
		let texD = new THREE.Vector2();
		CustomGeometry.uvsQuadToTex(texA, texB, texC, texD, x, y, w, h);
		geometry.pushQuadUVs(texA, texB, texC, texD);

		// Collision
		if (collision !== null) {
			let rect = collision.rect;
			if (!collision.hasAllDirections() || collision.terrain > 0) {
				if (rect === null) {
					rect = [0, 0, Datas.Systems.SQUARE_SIZE, Datas.Systems.SQUARE_SIZE];
				}
				rect = [a + rect[0], b + 0.5, c + rect[1], rect[2], rect[3], 1, 0];
				objCollision = {
					p: position,
					l: localPosition,
					b: rect,
					cs: collision,
				};
			} else if (rect !== null) {
				objCollision = {
					p: position,
					l: localPosition,
					b: [a + rect[0], b + 0.5, c + rect[1], rect[2], rect[3], 1, 0],
					cs: null,
				};
			}
		}
		return objCollision;
	}
}

export { Land };
