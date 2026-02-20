/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { ELEMENT_MAP_KIND, Mathf, Utils } from '../Common';
import { Core, Data, Scene } from '../index';
import { CustomGeometry } from './CustomGeometry';
import { CustomGeometryFace } from './CustomGeometryFace';
import { MapElement, StructMapElementCollision } from './MapElement';
import { Position } from './Position';
import { Rectangle } from './Rectangle';

/** @class
 *  A sprite in the map.
 *  @extends MapElement
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  sprite
 */
class Sprite extends MapElement {
	public static MODEL = [
		new THREE.Vector3(-0.5, 1.0, 0.0),
		new THREE.Vector3(0.5, 1.0, 0.0),
		new THREE.Vector3(0.5, 0.0, 0.0),
		new THREE.Vector3(-0.5, 0.0, 0.0),
	];
	public static Y_AXIS = new THREE.Vector3(0, 1, 0);
	public static X_AXIS = new THREE.Vector3(1, 0, 0);
	public static Z_AXIS = new THREE.Vector3(0, 0, 1);

	public kind: ELEMENT_MAP_KIND;
	public textureRect: Rectangle;

	constructor(json?: Record<string, any>) {
		super();

		this.front = true;
		if (json) {
			this.read(json);
		}
	}

	/**
	 *  Create a new sprite.
	 *  @static
	 *  @param {ELEMENT_MAP_KIND} kind - The element map kind
	 *  @param {number[]} texture - Texture UV coords
	 */
	static create(kind: ELEMENT_MAP_KIND, texture: Rectangle): Sprite {
		const sprite = new Sprite();
		sprite.kind = kind;
		sprite.textureRect = texture;
		return sprite;
	}

	/**
	 *  Rotate a vertex around a specified center.
	 *  @static
	 *  @param {THREE.Vector3} vec - The vertex to rotate
	 *  @param {THREE.Vector3} center - The center to rotate around
	 *  @param {number} angle - The angle in degree
	 *  @param {THREE.Vector3} axis - The vector axis
	 */
	static rotateVertex(
		vec: THREE.Vector3,
		center: THREE.Vector3,
		angle: number,
		axis: THREE.Vector3,
		isDegree: boolean = true,
	) {
		vec.sub(center);
		vec.applyAxisAngle(axis, isDegree ? (angle * Math.PI) / 180.0 : angle);
		vec.add(center);
	}

	/** Rotate the four vertices of a sprite around a specified center.
	 *   @static
	 *   @param {THREE.Vector3} vecA - The A vertex to rotate
	 *   @param {THREE.Vector3} vecB - The B vertex to rotate
	 *   @param {THREE.Vector3} vecC - The C vertex to rotate
	 *   @param {THREE.Vector3} vecD - The D vertex to rotate
	 *   @param {THREE.Vector3} center - The center to rotate around
	 *   @param {number} angle - The angle in degree
	 *   @param {THREE.Vector3} axis - The vector axis
	 */
	static rotateSprite(
		vecA: THREE.Vector3,
		vecB: THREE.Vector3,
		vecC: THREE.Vector3,
		vecD: THREE.Vector3,
		center: THREE.Vector3,
		angle: number,
		axis: THREE.Vector3,
	) {
		Mathf.rotateVertex(vecA, center, angle, axis);
		Mathf.rotateVertex(vecB, center, angle, axis);
		Mathf.rotateVertex(vecC, center, angle, axis);
		Mathf.rotateVertex(vecD, center, angle, axis);
	}

	/**
	 *  Add a static sprite to the geometry.
	 *  @static
	 *  @param {THREE.Geometry} geometry - The geometry
	 *  @param {THREE.Vector3} vecA - The A vertex
	 *  @param {THREE.Vector3} vecB - The B vertex
	 *  @param {THREE.Vector3} vecC - The C vertex
	 *  @param {THREE.Vector3} vecD - The D vertex
	 *  @param {THREE.Vector2} texA- The texture face A
	 *  @param {THREE.Vector2} texB - The texture face B
	 *  @param {number} count - The faces count
	 *  @returns {number}
	 */
	static addStaticSpriteToGeometry(
		geometry: CustomGeometry,
		vecA: THREE.Vector3,
		vecB: THREE.Vector3,
		vecC: THREE.Vector3,
		vecD: THREE.Vector3,
		texA: THREE.Vector2,
		texB: THREE.Vector2,
		texC: THREE.Vector2,
		texD: THREE.Vector2,
		count: number,
	): number {
		geometry.pushQuadVertices(vecA, vecB, vecC, vecD);
		geometry.pushQuadIndices(count);
		geometry.pushQuadUVs(texA, texB, texC, texD);
		return count + 4;
	}

	getVectors(
		vecA: THREE.Vector3,
		vecB: THREE.Vector3,
		vecC: THREE.Vector3,
		vecD: THREE.Vector3,
		pos: THREE.Vector3,
		position: Position,
		size: THREE.Vector3,
	) {
		let zPlus = position.layer * 0.05;

		// Apply an offset according to layer position
		if (this.kind !== ELEMENT_MAP_KIND.SPRITES_FACE && !this.front) {
			zPlus *= -1;
		}
		pos.setX(this.xOffset * Data.Systems.SQUARE_SIZE);
		pos.setY(this.yOffset * Data.Systems.SQUARE_SIZE);
		pos.setZ(this.zOffset * Data.Systems.SQUARE_SIZE + zPlus);
		vecA.multiply(size);
		vecB.multiply(size);
		vecC.multiply(size);
		vecD.multiply(size);
		vecA.add(pos);
		vecB.add(pos);
		vecC.add(pos);
		vecD.add(pos);
	}

	/**
	 *  Update the geometry associated to this.
	 *  @param {Core.CustomGeometry} geometry - The geometry
	 *  @param {number} width - The total texture width
	 *  @param {number} height - The total texture height
	 *  @param {number[]} position - The position
	 *  @param {number} count - The faces count
	 *  @param {boolean} tileset - Indicate if the texture is tileset
	 *  @param {THREE.Vector3} localPosition - The local position
	 *  @returns {any[]}
	 */
	updateGeometry(
		geometry: CustomGeometry | CustomGeometryFace,
		width: number,
		height: number,
		position: Position,
		count: number,
		tileset: boolean,
		localPosition: THREE.Vector3,
	): [number, StructMapElementCollision[]] {
		const vecA = Sprite.MODEL[0].clone();
		const vecB = Sprite.MODEL[1].clone();
		const vecC = Sprite.MODEL[2].clone();
		const vecD = Sprite.MODEL[3].clone();
		const center = new THREE.Vector3();
		const pos = new THREE.Vector3();
		const size = new THREE.Vector3(
			this.textureRect.width * Data.Systems.SQUARE_SIZE * position.scaleX,
			this.textureRect.height * Data.Systems.SQUARE_SIZE * position.scaleY,
			1.0,
		);

		// For static sprites
		this.getVectors(vecA, vecB, vecC, vecD, pos, position, size);
		if (localPosition !== null) {
			vecA.add(localPosition);
			vecB.add(localPosition);
			vecC.add(localPosition);
			vecD.add(localPosition);
			center.add(localPosition);
			pos.add(localPosition);
		} else {
			localPosition = tileset ? position.toVector3() : new THREE.Vector3();
		}

		// Getting UV coordinates
		let x = (this.textureRect.x * Data.Systems.SQUARE_SIZE) / width;
		let y = (this.textureRect.y * Data.Systems.SQUARE_SIZE) / height;
		let w = (this.textureRect.width * Data.Systems.SQUARE_SIZE) / width;
		let h = (this.textureRect.height * Data.Systems.SQUARE_SIZE) / height;
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

		// Collision
		const objCollision: StructMapElementCollision[] = [];
		const twidth = Math.floor((this.textureRect.width * position.scaleX) / 2);
		const theight = Math.floor((this.textureRect.height * position.scaleY) / 2);
		if (tileset) {
			const collisions = Scene.Map.current.mapProperties.tileset.picture.getSquaresForTexture(this.textureRect);
			for (const rect of collisions) {
				objCollision.push({
					p: position,
					l: localPosition,
					b: [
						localPosition.x -
							twidth * Data.Systems.SQUARE_SIZE -
							((this.textureRect.width * position.scaleX) % 2) *
								Math.round(Data.Systems.SQUARE_SIZE / 2) +
							rect.x +
							Math.round((rect.width * position.scaleX) / 2),
						localPosition.y +
							this.textureRect.height * position.scaleY * Data.Systems.SQUARE_SIZE -
							rect.y -
							Math.round((rect.height * position.scaleY) / 2),
						localPosition.z,
						rect.width * position.scaleX,
						rect.height * position.scaleY,
						1,
						position.angleY,
						position.angleX,
						position.angleZ,
					],
					w: twidth,
					h: theight,
					cr: [0, -size.y / 2, 0],
					k: this.kind === ELEMENT_MAP_KIND.SPRITES_FIX,
				});
			}
			const climbing = Scene.Map.current.mapProperties.tileset.picture.getSquaresClimbing(this.textureRect);
			for (const [x, y] of climbing) {
				objCollision.push({
					p: position,
					l: localPosition,
					b: [
						localPosition.x -
							twidth * Data.Systems.SQUARE_SIZE -
							((this.textureRect.width * position.scaleX) % 2) *
								Math.round(Data.Systems.SQUARE_SIZE / 2) +
							(x + this.xOffset) * Data.Systems.SQUARE_SIZE * position.scaleX +
							Math.round((Data.Systems.SQUARE_SIZE * position.scaleX * position.scaleX) / 2),
						localPosition.y +
							this.yOffset * Data.Systems.SQUARE_SIZE +
							this.textureRect.height * position.scaleY * Data.Systems.SQUARE_SIZE -
							y * Data.Systems.SQUARE_SIZE * position.scaleY -
							Math.round((Data.Systems.SQUARE_SIZE * position.scaleY * position.scaleY) / 2),
						localPosition.z,
						Data.Systems.SQUARE_SIZE * position.scaleX,
						Data.Systems.SQUARE_SIZE * position.scaleY,
						1,
						position.angleY,
						position.angleX,
						position.angleZ,
					],
					w: twidth,
					h: theight,
					cr: [0, -size.y / 2, 0],
					k: this.kind === ELEMENT_MAP_KIND.SPRITES_FIX,
					cl: true,
				});
			}
		} else {
			// Character
			objCollision.push({
				b: null,
				w: twidth,
				h: theight,
				k: this.kind === ELEMENT_MAP_KIND.SPRITES_FIX,
			});
		}

		if (geometry instanceof CustomGeometryFace) {
			// Face sprite
			const p = new THREE.Vector3(pos.x, localPosition.y + this.yOffset * Data.Systems.SQUARE_SIZE, pos.z);
			const c = new THREE.Vector3(center.x, localPosition.y + this.yOffset * Data.Systems.SQUARE_SIZE, center.z);
			geometry.pushQuadVerticesFace(
				Sprite.MODEL[0].clone().multiply(size).add(p),
				Sprite.MODEL[1].clone().multiply(size).add(p),
				Sprite.MODEL[2].clone().multiply(size).add(p),
				Sprite.MODEL[3].clone().multiply(size).add(p),
				c,
			);
			geometry.pushQuadIndices(count);
			geometry.pushQuadUVs(texA, texB, texC, texD);
			count = count + 4;
		} else {
			// Simple sprite
			center.setX(center.x + this.xOffset * Data.Systems.SQUARE_SIZE);
			center.setZ(center.z + this.zOffset * Data.Systems.SQUARE_SIZE);
			const vecSimpleA = vecA.clone();
			const vecSimpleB = vecB.clone();
			const vecSimpleC = vecC.clone();
			const vecSimpleD = vecD.clone();
			Mathf.rotateQuadEuler(vecSimpleA, vecSimpleB, vecSimpleC, vecSimpleD, center, position.toRotationEuler());
			count = Sprite.addStaticSpriteToGeometry(
				geometry,
				vecSimpleA,
				vecSimpleB,
				vecSimpleC,
				vecSimpleD,
				texA,
				texB,
				texC,
				texD,
				count,
			);
		}

		// Double sprite
		if (this.kind === ELEMENT_MAP_KIND.SPRITES_DOUBLE || this.kind === ELEMENT_MAP_KIND.SPRITES_QUADRA) {
			const vecDoubleA = vecA.clone();
			const vecDoubleB = vecB.clone();
			const vecDoubleC = vecC.clone();
			const vecDoubleD = vecD.clone();
			Sprite.rotateSprite(vecDoubleA, vecDoubleB, vecDoubleC, vecDoubleD, center, 90, Sprite.Y_AXIS);
			Mathf.rotateQuadEuler(vecDoubleA, vecDoubleB, vecDoubleC, vecDoubleD, center, position.toRotationEuler());
			count = Sprite.addStaticSpriteToGeometry(
				geometry,
				vecDoubleA,
				vecDoubleB,
				vecDoubleC,
				vecDoubleD,
				texA,
				texB,
				texC,
				texD,
				count,
			);

			// Quadra sprite
			if (this.kind === ELEMENT_MAP_KIND.SPRITES_QUADRA) {
				const vecQuadra1A = vecA.clone();
				const vecQuadra1B = vecB.clone();
				const vecQuadra1C = vecC.clone();
				const vecQuadra1D = vecD.clone();
				const vecQuadra2A = vecA.clone();
				const vecQuadra2B = vecB.clone();
				const vecQuadra2C = vecC.clone();
				const vecQuadra2D = vecD.clone();
				Sprite.rotateSprite(vecQuadra1A, vecQuadra1B, vecQuadra1C, vecQuadra1D, center, 45, Sprite.Y_AXIS);
				Mathf.rotateQuadEuler(
					vecQuadra1A,
					vecQuadra1B,
					vecQuadra1C,
					vecQuadra1D,
					center,
					position.toRotationEuler(),
				);
				Sprite.rotateSprite(vecQuadra2A, vecQuadra2B, vecQuadra2C, vecQuadra2D, center, -45, Sprite.Y_AXIS);
				Mathf.rotateQuadEuler(
					vecQuadra2A,
					vecQuadra2B,
					vecQuadra2C,
					vecQuadra2D,
					center,
					position.toRotationEuler(),
				);
				count = Sprite.addStaticSpriteToGeometry(
					geometry,
					vecQuadra1A,
					vecQuadra1B,
					vecQuadra1C,
					vecQuadra1D,
					texA,
					texB,
					texC,
					texD,
					count,
				);
				count = Sprite.addStaticSpriteToGeometry(
					geometry,
					vecQuadra2A,
					vecQuadra2B,
					vecQuadra2C,
					vecQuadra2D,
					texA,
					texB,
					texC,
					texD,
					count,
				);
			}
		}
		return [count, objCollision];
	}

	/**
	 *  Create the geometry associated to this sprite
	 *  @param {number} width - The texture total width
	 *  @param {number} height - The texture total height
	 *  @param {boolean} tileset - Indicate if the texture is tileset
	 *  @param {Position} position - The position
	 *  @returns {any[]}
	 */
	createGeometry(
		width: number,
		height: number,
		tileset: boolean,
		position: Position,
	): [CustomGeometry, [number, StructMapElementCollision[]]] {
		const geometry = new CustomGeometry();
		const collisions = this.updateGeometry(geometry, width, height, position, 0, tileset, null);
		geometry.updateAttributes();
		return [geometry, collisions];
	}

	/**
	 *  Read the JSON associated to the sprite.
	 *  @param {Record<string, any>} - json Json object describing the sprite
	 */
	read(json: Record<string, any>) {
		super.read(json);
		this.front = Utils.valueOrDefault(json.f, true);
		this.kind = json.k;
		this.textureRect = Rectangle.createFromArray(json.t);
	}
}

export { Sprite };
