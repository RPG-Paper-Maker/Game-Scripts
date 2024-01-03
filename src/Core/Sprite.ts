/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Enum, Utils } from '../Common';
import ElementMapKind = Enum.ElementMapKind;
import { MapElement, StructMapElementCollision } from './MapElement';
import { THREE } from '../Globals';
import { Position } from './Position';
import { Datas, Core, Scene } from '../index';
import { Vector3 } from './Vector3';
import { Vector2 } from './Vector2';
import { CustomGeometry } from './CustomGeometry';
import { CustomGeometryFace } from './CustomGeometryFace';

/** @class
 *  A sprite in the map.
 *  @extends MapElement
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  sprite
 */
class Sprite extends MapElement {
	public static MODEL = [
		new Vector3(-0.5, 1.0, 0.0),
		new Vector3(0.5, 1.0, 0.0),
		new Vector3(0.5, 0.0, 0.0),
		new Vector3(-0.5, 0.0, 0.0),
	];
	public static Y_AXIS = new Vector3(0, 1, 0);
	public static X_AXIS = new Vector3(1, 0, 0);
	public static Z_AXIS = new Vector3(0, 0, 1);

	public kind: ElementMapKind;
	public textureRect: number[];

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
	 *  @param {ElementMapKind} kind - The element map kind
	 *  @param {number[]} texture - Texture UV coords
	 */
	static create(kind: ElementMapKind, texture: number[]): Sprite {
		let sprite = new Sprite();
		sprite.kind = kind;
		sprite.textureRect = texture;
		return sprite;
	}

	/**
	 *  Rotate a vertex around a specified center.
	 *  @static
	 *  @param {Vector3} vec - The vertex to rotate
	 *  @param {Vector3} center - The center to rotate around
	 *  @param {number} angle - The angle in degree
	 *  @param {Vector3} axis - The vector axis
	 */
	static rotateVertex(vec: Vector3, center: Vector3, angle: number, axis: Vector3, isDegree: boolean = true) {
		vec.sub(center);
		vec.applyAxisAngle(axis, isDegree ? (angle * Math.PI) / 180.0 : angle);
		vec.add(center);
	}

	/** Rotate the four vertices of a sprite around a specified center.
	 *   @static
	 *   @param {Vector3} vecA - The A vertex to rotate
	 *   @param {Vector3} vecB - The B vertex to rotate
	 *   @param {Vector3} vecC - The C vertex to rotate
	 *   @param {Vector3} vecD - The D vertex to rotate
	 *   @param {Vector3} center - The center to rotate around
	 *   @param {number} angle - The angle in degree
	 *   @param {Vector3} axis - The vector axis
	 */
	static rotateSprite(
		vecA: Vector3,
		vecB: Vector3,
		vecC: Vector3,
		vecD: Vector3,
		center: Vector3,
		angle: number,
		axis: Vector3
	) {
		Sprite.rotateVertex(vecA, center, angle, axis);
		Sprite.rotateVertex(vecB, center, angle, axis);
		Sprite.rotateVertex(vecC, center, angle, axis);
		Sprite.rotateVertex(vecD, center, angle, axis);
	}

	static rotateVertexEuler(vec: THREE.Vector3, center: THREE.Vector3, euler: THREE.Euler) {
		vec.sub(center);
		vec.applyEuler(euler);
		vec.add(center);
	}

	static rotateQuadEuler(
		vecA: THREE.Vector3,
		vecB: THREE.Vector3,
		vecC: THREE.Vector3,
		vecD: THREE.Vector3,
		center: THREE.Vector3,
		euler: THREE.Euler
	) {
		Sprite.rotateVertexEuler(vecA, center, euler);
		Sprite.rotateVertexEuler(vecB, center, euler);
		Sprite.rotateVertexEuler(vecC, center, euler);
		Sprite.rotateVertexEuler(vecD, center, euler);
	}

	/**
	 *  Add a static sprite to the geometry.
	 *  @static
	 *  @param {THREE.Geometry} geometry - The geometry
	 *  @param {Vector3} vecA - The A vertex
	 *  @param {Vector3} vecB - The B vertex
	 *  @param {Vector3} vecC - The C vertex
	 *  @param {Vector3} vecD - The D vertex
	 *  @param {Vector2} texA- The texture face A
	 *  @param {Vector2} texB - The texture face B
	 *  @param {number} count - The faces count
	 *  @returns {number}
	 */
	static addStaticSpriteToGeometry(
		geometry: CustomGeometry,
		vecA: Core.Vector3,
		vecB: Vector3,
		vecC: Vector3,
		vecD: Vector3,
		texA: Vector2,
		texB: Vector2,
		texC: Vector2,
		texD: Vector2,
		count: number
	): number {
		geometry.pushQuadVertices(vecA, vecB, vecC, vecD);
		geometry.pushQuadIndices(count);
		geometry.pushQuadUVs(texA, texB, texC, texD);
		return count + 4;
	}

	/**
	 *  Update the geometry associated to this.
	 *  @param {Core.CustomGeometry} geometry - The geometry
	 *  @param {number} width - The total texture width
	 *  @param {number} height - The total texture height
	 *  @param {number[]} position - The position
	 *  @param {number} count - The faces count
	 *  @param {boolean} tileset - Indicate if the texture is tileset
	 *  @param {Vector3} localPosition - The local position
	 *  @returns {any[]}
	 */
	updateGeometry(
		geometry: CustomGeometry | CustomGeometryFace,
		width: number,
		height: number,
		position: Position,
		count: number,
		tileset: boolean,
		localPosition: Vector3
	): [number, StructMapElementCollision[]] {
		let vecA = Sprite.MODEL[0].clone();
		let vecB = Sprite.MODEL[1].clone();
		let vecC = Sprite.MODEL[2].clone();
		let vecD = Sprite.MODEL[3].clone();
		let center = new Vector3(0, 0, 0);
		let size = new Vector3(
			this.textureRect[2] * Datas.Systems.SQUARE_SIZE * position.scaleX,
			this.textureRect[3] * Datas.Systems.SQUARE_SIZE * position.scaleY,
			1.0
		);

		// For static sprites
		super.scale(vecA, vecB, vecC, vecD, center, position, size, this.kind);
		if (localPosition !== null) {
			vecA.add(localPosition);
			vecB.add(localPosition);
			vecC.add(localPosition);
			vecD.add(localPosition);
			center.add(localPosition);
		} else {
			localPosition = tileset ? position.toVector3() : new Vector3();
		}

		// Getting UV coordinates
		let x = (this.textureRect[0] * Datas.Systems.SQUARE_SIZE) / width;
		let y = (this.textureRect[1] * Datas.Systems.SQUARE_SIZE) / height;
		let w = (this.textureRect[2] * Datas.Systems.SQUARE_SIZE) / width;
		let h = (this.textureRect[3] * Datas.Systems.SQUARE_SIZE) / height;
		let coefX = MapElement.COEF_TEX / width;
		let coefY = MapElement.COEF_TEX / height;
		x += coefX;
		y += coefY;
		w -= coefX * 2;
		h -= coefY * 2;
		let texA = new Vector2();
		let texB = new Vector2();
		let texC = new Vector2();
		let texD = new Vector2();
		CustomGeometry.uvsQuadToTex(texA, texB, texC, texD, x, y, w, h);

		// Collision
		let objCollision: StructMapElementCollision[] = new Array();
		let twidth = Math.floor((this.textureRect[2] * position.scaleX) / 2);
		let theight = Math.floor((this.textureRect[3] * position.scaleY) / 2);
		if (tileset) {
			let collisions = Scene.Map.current.mapProperties.tileset.picture.getSquaresForTexture(this.textureRect);
			for (let rect of collisions) {
				objCollision.push({
					p: position,
					l: localPosition,
					b: [
						localPosition.x -
							twidth * Datas.Systems.SQUARE_SIZE -
							((this.textureRect[2] * position.scaleX) % 2) * Math.round(Datas.Systems.SQUARE_SIZE / 2) +
							rect[0] +
							Math.round((rect[2] * position.scaleX) / 2),
						localPosition.y +
							this.textureRect[3] * position.scaleY * Datas.Systems.SQUARE_SIZE -
							rect[1] -
							Math.round((rect[3] * position.scaleY) / 2),
						localPosition.z,
						rect[2] * position.scaleX,
						rect[3] * position.scaleY,
						1,
						position.angleY,
						position.angleX,
						position.angleZ,
					],
					w: twidth,
					h: theight,
					cr: [0, -size.y / 2, 0],
					k: this.kind === ElementMapKind.SpritesFix,
				});
			}
			let climbing = Scene.Map.current.mapProperties.tileset.picture.getSquaresClimbing(this.textureRect);
			for (let [x, y] of climbing) {
				objCollision.push({
					p: position,
					l: localPosition,
					b: [
						localPosition.x -
							twidth * Datas.Systems.SQUARE_SIZE -
							((this.textureRect[2] * position.scaleX) % 2) * Math.round(Datas.Systems.SQUARE_SIZE / 2) +
							(x + this.xOffset) * Datas.Systems.SQUARE_SIZE * position.scaleX +
							Math.round((Datas.Systems.SQUARE_SIZE * position.scaleX * position.scaleX) / 2),
						localPosition.y +
							this.yOffset * Datas.Systems.SQUARE_SIZE +
							this.textureRect[3] * position.scaleY * Datas.Systems.SQUARE_SIZE -
							y * Datas.Systems.SQUARE_SIZE * position.scaleY -
							Math.round((Datas.Systems.SQUARE_SIZE * position.scaleY * position.scaleY) / 2),
						localPosition.z,
						Datas.Systems.SQUARE_SIZE * position.scaleX,
						Datas.Systems.SQUARE_SIZE * position.scaleY,
						1,
						position.angleY,
						position.angleX,
						position.angleZ,
					],
					w: twidth,
					h: theight,
					cr: [0, -size.y / 2, 0],
					k: this.kind === ElementMapKind.SpritesFix,
					cl: true,
				});
			}
		} else {
			// Character
			objCollision.push({
				b: null,
				w: twidth,
				h: theight,
				k: this.kind === ElementMapKind.SpritesFix,
			});
		}

		if (geometry instanceof CustomGeometryFace) {
			// Face sprite
			const c = new THREE.Vector3(center.x, localPosition.y, center.z);
			geometry.pushQuadVerticesFace(
				Sprite.MODEL[0].clone().multiply(size).add(c),
				Sprite.MODEL[1].clone().multiply(size).add(c),
				Sprite.MODEL[2].clone().multiply(size).add(c),
				Sprite.MODEL[3].clone().multiply(size).add(c),
				c
			);
			geometry.pushQuadIndices(count);
			geometry.pushQuadUVs(texA, texB, texC, texD);
			count = count + 4;
		} else {
			// Simple sprite
			let vecSimpleA = vecA.clone();
			let vecSimpleB = vecB.clone();
			let vecSimpleC = vecC.clone();
			let vecSimpleD = vecD.clone();
			Sprite.rotateQuadEuler(vecSimpleA, vecSimpleB, vecSimpleC, vecSimpleD, center, position.toRotationEuler());
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
				count
			);
		}

		// Double sprite
		if (this.kind === ElementMapKind.SpritesDouble || this.kind === ElementMapKind.SpritesQuadra) {
			let vecDoubleA = vecA.clone();
			let vecDoubleB = vecB.clone();
			let vecDoubleC = vecC.clone();
			let vecDoubleD = vecD.clone();
			Sprite.rotateSprite(vecDoubleA, vecDoubleB, vecDoubleC, vecDoubleD, center, 90, Sprite.Y_AXIS);
			Sprite.rotateQuadEuler(vecDoubleA, vecDoubleB, vecDoubleC, vecDoubleD, center, position.toRotationEuler());
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
				count
			);

			// Quadra sprite
			if (this.kind === ElementMapKind.SpritesQuadra) {
				let vecQuadra1A = vecA.clone();
				let vecQuadra1B = vecB.clone();
				let vecQuadra1C = vecC.clone();
				let vecQuadra1D = vecD.clone();
				let vecQuadra2A = vecA.clone();
				let vecQuadra2B = vecB.clone();
				let vecQuadra2C = vecC.clone();
				let vecQuadra2D = vecD.clone();
				Sprite.rotateSprite(vecQuadra1A, vecQuadra1B, vecQuadra1C, vecQuadra1D, center, 45, Sprite.Y_AXIS);
				Sprite.rotateQuadEuler(
					vecQuadra1A,
					vecQuadra1B,
					vecQuadra1C,
					vecQuadra1D,
					center,
					position.toRotationEuler()
				);
				Sprite.rotateSprite(vecQuadra2A, vecQuadra2B, vecQuadra2C, vecQuadra2D, center, -45, Sprite.Y_AXIS);
				Sprite.rotateQuadEuler(
					vecQuadra2A,
					vecQuadra2B,
					vecQuadra2C,
					vecQuadra2D,
					center,
					position.toRotationEuler()
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
					count
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
					count
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
		position: Position
	): [CustomGeometry, [number, StructMapElementCollision[]]] {
		let geometry = new CustomGeometry();
		let collisions = this.updateGeometry(geometry, width, height, position, 0, tileset, null);
		geometry.updateAttributes();
		return [geometry, collisions];
	}

	/**
	 *  Read the JSON associated to the sprite.
	 *  @param {Record<string, any>} - json Json object describing the sprite
	 */
	read(json: Record<string, any>) {
		super.read(json);
		this.front = Utils.defaultValue(json.f, true);
		this.kind = json.k;
		this.textureRect = json.t;
	}
}

export { Sprite };
