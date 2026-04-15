/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Constants, CUSTOM_SHAPE_KIND, Mathf, ORIENTATION } from '../Common';
import {
	CollisionSquare,
	CustomGeometry,
	Game,
	MapObject,
	MapPortion,
	Mountain,
	Portion,
	Position,
	StructMapElementCollision,
} from '../Core';
import { Data, Manager, Model, Scene } from '../index';

/** @class
 *  The collisions manager.
 *  @static
 */
class Collisions {
	public static BB_MATERIAL = new THREE.MeshBasicMaterial();
	public static BB_MATERIAL_DETECTION = new THREE.MeshBasicMaterial();
	public static BB_EMPTY_MATERIAL = new THREE.MeshBasicMaterial({ visible: false });
	public static BB_BOX = Collisions.createBox();
	public static BB_ORIENTED_BOX = Collisions.createOrientedBox();
	private static BB_BOX_DETECTION = Collisions.createBox(true);
	public static BB_BOX_DEFAULT_DETECTION = Collisions.createBox(true);
	public static currentCustomObject3D: THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]> = null;
	private static _scratchVertex = new THREE.Vector3();
	private static _scratchNormal = new THREE.Vector3();
	private static _raycaster = new THREE.Raycaster();
	private static _scratchCheckPortion: Portion = null;
	private static _scratchCheckPosition: Position = null;
	private static _scratchMtnPoint = new THREE.Vector2();
	private static _scratchMtnPtA = new THREE.Vector2();
	private static _scratchMtnPtB = new THREE.Vector2();
	private static _scratchMtnPtC = new THREE.Vector2();
	private static _scratchMtnPA = new THREE.Vector3();
	private static _scratchMtnPB = new THREE.Vector3();
	private static _scratchMtnPC = new THREE.Vector3();
	private static _scratchMtnPlane = new THREE.Plane();
	private static _scratchMtnRay = new THREE.Ray();
	private static _scratchMtnNewPosition = new THREE.Vector3();
	private static _scratchMtnJPosition: Position = null;
	private static _scratchDirection = new THREE.Vector3();
	private static _scratchJPositionBefore: Position = null;
	private static _scratchJPositionAfter: Position = null;
	private static _scratchPositionBeforePlus = new THREE.Vector3();
	private static _scratchPositionAfterPlus = new THREE.Vector3();
	private static _scratchPositionBottom = new THREE.Vector3();
	private static _scratchPositionBottomAfter = new THREE.Vector3();
	private static _scratchEuler = new THREE.Euler();
	private static _scratchEulerCenter = new THREE.Vector3();
	private static _scratchCollisionList: StructMapElementCollision[] = [];
	private static _scratchPortion: Portion = null;
	private static _pendingBBFlash: Array<{ scene: THREE.Scene; box: THREE.Mesh }> = [];

	constructor() {
		throw new Error('This is a static class');
	}

	/**
	 *  Initialize necessary collisions.
	 *  @static
	 */
	static initialize() {
		this.BB_BOX_DETECTION.geometry.boundingBox = new THREE.Box3();
		this._scratchCheckPortion = new Portion(0, 0, 0);
		this._scratchCheckPosition = new Position(0, 0, 0);
		this._scratchMtnJPosition = new Position(0, 0, 0);
		this._scratchJPositionBefore = new Position(0, 0, 0);
		this._scratchJPositionAfter = new Position(0, 0, 0);
		this._scratchPortion = new Portion(0, 0, 0);
	}

	/**
	 *  Create a box for bounding box.
	 *  @static
	 *  @returns {THREE.Mesh}
	 */
	static createBox(detection: boolean = false): THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]> {
		const box = new THREE.Mesh(
			CustomGeometry.createBox(1, 1, 1),
			detection ? this.BB_MATERIAL_DETECTION : this.BB_MATERIAL,
		);
		box['previousTranslate'] = [0, 0, 0];
		box['previousRotate'] = [0, 0, 0];
		box['previousScale'] = [1, 1, 1];
		box['previousIsFix'] = false;
		box['previousCenter'] = [0, 0, 0];
		return box;
	}

	/**
	 *  Create an oriented box for bounding box.
	 *  @static
	 *  @returns {THREE.Mesh}
	 */
	static createOrientedBox(): THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]> {
		const box = new THREE.Mesh(CustomGeometry.createBox(1, 1, 1), this.BB_MATERIAL);
		box['previousTranslate'] = [0, 0, 0];
		box['previousRotate'] = [0, 0, 0];
		box['previousScale'] = [1, 1, 1];
		box['previousCenter'] = [0, 0, 0];
		box.geometry.rotateY(Math.PI / 4);
		return box;
	}

	/**
	 *  Apply transform for lands bounding box.
	 *  @static
	 *  @param {THREE.Mesh} box - The mesh bounding box
	 *  @param {number[]} boundingBox - The bounding box list parameters
	 */
	static applyBoxLandTransforms(box: THREE.Mesh, boundingBox: number[]) {
		// Cancel previous geometry transforms
		box.geometry.translate(
			-box['previousTranslate'][0] + box['previousCenter'][0],
			-box['previousTranslate'][1] + box['previousCenter'][1],
			-box['previousTranslate'][2] + box['previousCenter'][2],
		);
		const geometry = <CustomGeometry>box.geometry;
		geometry.rotateFromEuler(
			new THREE.Euler(
				(-box['previousRotate'][1] * Math.PI) / 180.0,
				(-box['previousRotate'][0] * Math.PI) / 180.0,
				(-box['previousRotate'][2] * Math.PI) / 180.0,
				'ZYX',
			),
			new THREE.Vector3(box['previousCenter'][0], box['previousCenter'][1], box['previousCenter'][2]),
		);
		box.geometry.scale(1 / box['previousScale'][0], 1 / box['previousScale'][1], 1 / box['previousScale'][2]);
		// Update to the new ones
		box.geometry.scale(boundingBox[3], 1, boundingBox[4]);
		box.geometry.translate(boundingBox[0], boundingBox[1], boundingBox[2]);
		// Register previous transforms to current
		box['previousTranslate'] = [boundingBox[0], boundingBox[1], boundingBox[2]];
		box['previousRotate'] = [0, 0, 0];
		box['previousScale'] = [boundingBox[3], 1, boundingBox[4]];
		box['previousCenter'] = [0, 0, 0];
		// Update geometry now
		box.updateMatrixWorld();
		// Compute bounding box
		box.geometry.computeBoundingBox();
	}

	/**
	 *  Apply transform for sprite bounding box.
	 *  @static
	 *  @param {THREE.Mesh} box - The mesh bounding box
	 *  @param {number[]} boundingBox - The bounding box list parameters
	 */
	static applyBoxSpriteTransforms(
		box: THREE.Mesh,
		boundingBox: number[],
		isFixSprite: boolean = false,
		center = [0, 0, 0],
	) {
		// Avoid NaN values if scale values are 0
		boundingBox[3] = Mathf.nearZeroValue(boundingBox[3]);
		boundingBox[4] = Mathf.nearZeroValue(boundingBox[4]);
		boundingBox[5] = Mathf.nearZeroValue(boundingBox[5]);

		// Cancel previous geometry transforms
		box.geometry.translate(
			-box['previousTranslate'][0] + box['previousCenter'][0],
			-box['previousTranslate'][1] + box['previousCenter'][1],
			-box['previousTranslate'][2] + box['previousCenter'][2],
		);
		const geometry = <CustomGeometry>box.geometry;
		const se = Collisions._scratchEuler;
		const sc = Collisions._scratchEulerCenter;
		sc.set(box['previousCenter'][0], box['previousCenter'][1], box['previousCenter'][2]);
		se.set(
			(-box['previousRotate'][1] * Math.PI) / 180.0,
			(-box['previousRotate'][0] * Math.PI) / 180.0,
			(-box['previousRotate'][2] * Math.PI) / 180.0,
			'ZYX',
		);
		geometry.rotateFromEuler(se, sc);
		box.geometry.scale(1 / box['previousScale'][0], 1 / box['previousScale'][1], 1 / box['previousScale'][2]);

		// Update to the new ones
		box.geometry.scale(boundingBox[3], boundingBox[4], boundingBox[5]);
		sc.set(center[0], center[1], center[2]);
		se.set(
			(boundingBox[7] * Math.PI) / 180.0,
			(boundingBox[6] * Math.PI) / 180.0,
			(boundingBox[8] * Math.PI) / 180.0,
			'XYZ',
		);
		geometry.rotateFromEuler(se, sc);
		box.geometry.translate(boundingBox[0] - center[0], boundingBox[1] - center[1], boundingBox[2] - center[2]);

		// Register previous transforms to current
		box['previousTranslate'][0] = boundingBox[0];
		box['previousTranslate'][1] = boundingBox[1];
		box['previousTranslate'][2] = boundingBox[2];
		box['previousRotate'][0] = boundingBox[6];
		box['previousRotate'][1] = boundingBox[7];
		box['previousRotate'][2] = boundingBox[8];
		box['previousScale'][0] = boundingBox[3];
		box['previousScale'][1] = boundingBox[4];
		box['previousScale'][2] = boundingBox[5];
		box['previousIsFix'] = isFixSprite;
		box['previousCenter'] = center;

		// Update geometry now
		box.updateMatrixWorld();

		// Compute bounding box
		box.geometry.computeBoundingBox();
	}

	/**
	 *  Apply transform for oriented bounding box.
	 *  @static
	 *  @param {THREE.Mesh} box - The mesh bounding box
	 *  @param {number[]} boundingBox - The bounding box list parameters
	 */
	static applyOrientedBoxTransforms(box: THREE.Mesh, boundingBox: number[], center = [0, 0, 0]) {
		let size = Math.floor(boundingBox[3] / Math.sqrt(2));

		// Avoid NaN values if scale values are 0
		size = Mathf.nearZeroValue(size);
		boundingBox[4] = Mathf.nearZeroValue(boundingBox[4]);

		// Cancel previous geometry transforms
		box.geometry.translate(
			-box['previousTranslate'][0],
			-box['previousTranslate'][1],
			-box['previousTranslate'][2],
		);
		const geometry = <CustomGeometry>box.geometry;
		const se = Collisions._scratchEuler;
		const sc = Collisions._scratchEulerCenter;
		sc.set(box['previousCenter'][0], box['previousCenter'][1], box['previousCenter'][2]);
		se.set(
			(-box['previousRotate'][1] * Math.PI) / 180.0,
			(-box['previousRotate'][0] * Math.PI) / 180.0,
			(-box['previousRotate'][2] * Math.PI) / 180.0,
			'ZYX',
		);
		geometry.rotateFromEuler(se, sc);
		box.geometry.rotateY(-Math.PI / 4);
		box.geometry.scale(1 / box['previousScale'][0], 1 / box['previousScale'][1], 1 / box['previousScale'][2]);

		// Update to the new ones
		box.geometry.scale(size, boundingBox[4], size);
		box.geometry.rotateY(Math.PI / 4);
		sc.set(center[0], center[1], center[2]);
		se.set(
			(boundingBox[7] * Math.PI) / 180.0,
			(boundingBox[6] * Math.PI) / 180.0,
			(boundingBox[8] * Math.PI) / 180.0,
			'XYZ',
		);
		geometry.rotateFromEuler(se, sc);
		box.geometry.translate(boundingBox[0], boundingBox[1], boundingBox[2]);

		// Register previous transforms to current
		box['previousTranslate'][0] = boundingBox[0];
		box['previousTranslate'][1] = boundingBox[1];
		box['previousTranslate'][2] = boundingBox[2];
		box['previousRotate'][0] = boundingBox[6];
		box['previousRotate'][1] = boundingBox[7];
		box['previousRotate'][2] = boundingBox[8];
		box['previousScale'][0] = size;
		box['previousScale'][1] = boundingBox[4];
		box['previousScale'][2] = size;
		box['previousCenter'] = center;

		// Update geometry now
		box.updateMatrixWorld();

		// Compute bounding box
		box.geometry.computeBoundingBox();
	}

	/**
	 *  Get a bounding box mesh. When showBB is true, create a temporary visible
	 *  copy that flashes in the scene.
	 *  @static
	 *  @returns {THREE.Mesh}
	 */
	static getBBBox(): THREE.Mesh {
		if (Data.Systems.showBB) {
			const box = Collisions.createBox();
			this.BB_BOX = box;
			const scene = Scene.Map.current.scene;
			scene.add(box);
			this._pendingBBFlash.push({ scene, box });
		}
		return this.BB_BOX;
	}

	/**
	 *  Get an oriented bounding box mesh. When showBB is true, create a
	 *  temporary visible copy that flashes in the scene.
	 *  @static
	 *  @returns {THREE.Mesh}
	 */
	static getBBOrientedBox(): THREE.Mesh {
		if (Data.Systems.showBB) {
			const box = Collisions.createOrientedBox();
			this.BB_ORIENTED_BOX = box;
			const scene = Scene.Map.current.scene;
			scene.add(box);
			this._pendingBBFlash.push({ scene, box });
		}
		return this.BB_ORIENTED_BOX;
	}

	/**
	 *  Get a bounding box mesh for detection. Keep the same existing one or
	 *  force creating a new one for cases you need several.
	 *  @static
	 *  @param {number} [force=false]
	 *  @returns {THREE.Mesh}
	 */
	static getBBBoxDetection(force: boolean = false): THREE.Mesh {
		if (Data.Systems.showBB && !force) {
			const box = Collisions.createBox(true);
			this.BB_BOX_DETECTION = box;
			box.geometry.boundingBox = new THREE.Box3();
			const scene = Scene.Map.current.scene;
			scene.add(box);
			this._pendingBBFlash.push({ scene, box });
		}
		return this.BB_BOX_DETECTION;
	}

	/**
	 *  Remove all BB flash meshes queued from the previous frame. Call once
	 *  per frame before any collision checks begin.
	 */
	static flushBBFlash() {
		for (const { scene, box } of this._pendingBBFlash) {
			scene.remove(box);
		}
		this._pendingBBFlash = [];
	}

	/**
	 *  Indicate if min and max are overlapping.
	 *  @static
	 *  @param {number} minA
	 *  @param {number} maxA
	 *  @param {number} minB
	 *  @param {number} maxB
	 *  @returns {boolean}
	 */
	static isOverlapping(minA: number, maxA: number, minB: number, maxB: number): boolean {
		let minOverlap = null;
		let maxOverlap = null;

		// If B contain in A
		if (minA <= minB && minB <= maxA) {
			if (minOverlap === null || minB < minOverlap) {
				minOverlap = minB;
			}
		}
		if (minA <= maxB && maxB <= maxA) {
			if (maxOverlap === null || maxB > minOverlap) {
				maxOverlap = maxB;
			}
		}

		// If A contain in B
		if (minB <= minA && minA <= maxB) {
			if (minOverlap === null || minA < minOverlap) {
				minOverlap = minA;
			}
		}
		if (minB <= maxA && maxA <= maxB) {
			if (maxOverlap === null || maxA > minOverlap) {
				maxOverlap = maxA;
			}
		}
		return minOverlap !== null && maxOverlap !== null;
	}

	/**
	 *  Check collision between two OBB.
	 *  @static
	 *  @param {Core.CustomGeometry} shapeA - First shape
	 *  @param {Core.CustomGeometry} shapeB - Second shape
	 *  @param {boolean} deepCheck - if false, only check bounding box
	 *  @returns {boolean}
	 */
	static obbVSobb(shapeA: CustomGeometry, shapeB: CustomGeometry, deepCheck = true): boolean {
		const bbIntersect = shapeA.boundingBox.intersectsBox(shapeB.boundingBox);
		if (!deepCheck && bbIntersect) {
			return true;
		}
		if (!bbIntersect) {
			return false;
		}
		const facesA = shapeA.getNormals();
		const facesB = shapeB.getNormals();
		const verticesA = shapeA.getVertices();
		const verticesB = shapeB.getVertices();
		const lA = verticesA.length;
		const lB = verticesB.length;
		if (!this.checkNormals(facesA, verticesA, verticesB, lA, lB)) {
			return false;
		}
		if (!this.checkNormals(facesB, verticesA, verticesB, lA, lB)) {
			return false;
		}
		return true;
	}

	/**
	 *  Check the fnormals for OBB collision.
	 *  @static
	 *  @param {ArrayLike<number>} normals - The normals to check
	 *  @param {THREE.Vector3[]} verticesA - First vertices to check
	 *  @param {THREE.Vector3[]} verticesB - Second vertices to check
	 *  @param {number} lA - The first vertices length
	 *  @param {number} lB - The second vertices length
	 *  @returns {boolean}
	 */
	static checkNormals(
		normals: ArrayLike<number>,
		verticesA: ArrayLike<number>,
		verticesB: ArrayLike<number>,
		lA: number,
		lB: number,
	): boolean {
		const sn = Collisions._scratchNormal;
		for (let i = 0, l = normals.length; i < l; i += 3) {
			sn.set(normals[i], normals[i + 1], normals[i + 2]);
			if (!this.overlapOnThisNormal(verticesA, verticesB, lA, lB, sn)) {
				return false;
			}
		}
		return true;
	}

	/**
	 *  Check if vertices overlap on one of the faces normal.
	 *  @static
	 *  @param {ArrayLike<number>} verticesA - First vertices to check
	 *  @param {ArrayLike<number>} verticesB - Second vertices to check
	 *  @param {number} lA - The first vertices length
	 *  @param {number} lB - The second vertices length
	 *  @param {Core.THREE.Vector3} normal - The face normal
	 *  @returns {boolean}
	 */
	static overlapOnThisNormal(
		verticesA: ArrayLike<number>,
		verticesB: ArrayLike<number>,
		lA: number,
		lB: number,
		normal: THREE.Vector3,
	): boolean {
		// We test each vertex of A
		let minA = null;
		let maxA = null;
		let i: number, buffer: number;
		const sv = Collisions._scratchVertex;
		for (i = 0; i < lA; i += 3) {
			sv.set(verticesA[i], verticesA[i + 1], verticesA[i + 2]);
			buffer = Mathf.orthogonalProjection(sv, normal);
			if (minA === null || buffer < minA) {
				minA = buffer;
			}
			if (maxA === null || buffer > maxA) {
				maxA = buffer;
			}
		}

		// We test each vertex of B
		let minB = null;
		let maxB = null;
		for (i = 0; i < lB; i += 3) {
			sv.set(verticesB[i], verticesB[i + 1], verticesB[i + 2]);
			buffer = Mathf.orthogonalProjection(sv, normal);
			if (minB === null || buffer < minB) {
				minB = buffer;
			}
			if (maxB === null || buffer > maxB) {
				maxB = buffer;
			}
		}

		// We test if there is overlaping
		return this.isOverlapping(minA, maxA, minB, maxB);
	}

	/**
	 *  Check collision ray.
	 *  @static
	 *  @param {THREE.Vector3} positionBefore - The position before collision
	 *  @param {THREE.Vector3} positionAfter - The position after collision
	 *  @param {MapObject} object - The map object to test collision
	 *  @returns {boolean}
	 */
	static checkRay(
		positionBefore: THREE.Vector3,
		positionAfter: THREE.Vector3,
		object: MapObject,
		bbSettings: number[],
		reverseTestObjects: boolean = false,
	): [boolean, number, ORIENTATION] {
		const direction = Collisions._scratchDirection.subVectors(positionAfter, positionBefore).normalize();
		const squareSz = Data.Systems.SQUARE_SIZE;
		const jpositionBefore = Collisions._scratchJPositionBefore;
		jpositionBefore.x = Math.floor(positionBefore.x / squareSz);
		jpositionBefore.y = Math.floor(positionBefore.y / squareSz);
		jpositionBefore.z = Math.floor(positionBefore.z / squareSz);
		const jpositionAfter = Collisions._scratchJPositionAfter;
		jpositionAfter.x = Math.floor(positionAfter.x / squareSz);
		jpositionAfter.y = Math.floor(positionAfter.y / squareSz);
		jpositionAfter.z = Math.floor(positionAfter.z / squareSz);
		const positionBeforePlus = Collisions._scratchPositionBeforePlus;
		const positionAfterPlus = Collisions._scratchPositionAfterPlus;
		let yMountain = null;
		const mountainCollisionHeight = Data.Systems.mountainCollisionHeight.getValue() as number;

		// Squares to inspect according to the direction of the object
		const [startI, endI, startJ, endJ, startK, endK] = object.getSquaresBB();

		// Test objects
		if (reverseTestObjects) {
			const result = this.checkObjectsRay(positionAfter, object);
			if (result !== null) {
				return result;
			}
		}

		// Check collision outside
		let block = false;
		let i: number,
			j: number,
			k: number,
			i2: number,
			j2: number,
			k2: number,
			mapPortion: MapPortion,
			result: [boolean, number, ORIENTATION];
		const squareSize = Data.Systems.SQUARE_SIZE;
		const chunkSize = squareSize * Constants.PORTION_SIZE;
		const cp = Scene.Map.current.currentPortion;
		const lp = Collisions._scratchCheckPortion;
		const jp = Collisions._scratchCheckPosition;
		for (i = startI; i <= endI; i++) {
			for (j = startJ; j <= endJ; j++) {
				for (k = startK; k <= endK; k++) {
					positionAfterPlus.set(
						positionAfter.x + i * squareSize,
						positionAfter.y + j * squareSize,
						positionAfter.z + k * squareSize,
					);
					lp.x = Math.floor(positionAfterPlus.x / chunkSize) - cp.x;
					lp.y = Math.floor(positionAfterPlus.y / chunkSize) - cp.y;
					lp.z = Math.floor(positionAfterPlus.z / chunkSize) - cp.z;
					mapPortion = Scene.Map.current.getMapPortion(lp.x, lp.y, lp.z);
					if (mapPortion) {
						jp.x = jpositionAfter.x + i;
						jp.y = jpositionAfter.y + j;
						jp.z = jpositionAfter.z + k;
						result = this.check(mapPortion, jpositionBefore, jp, positionAfter, object, direction);
						if (result[0] === null) {
							// If not already climbing, be sure that the before position can colide with climbling sprite
							if (!object.isClimbing) {
								object.updateMeshBBPosition(object.currentBoundingBox, bbSettings, positionBefore);
								for (i2 = startI; i2 <= endI; i2++) {
									for (j2 = startJ; j2 <= endJ; j2++) {
										for (k2 = startK; k2 <= endK; k2++) {
											positionBeforePlus.set(
												positionBefore.x + i2 * squareSize,
												positionBefore.y + j2 * squareSize,
												positionBefore.z + k2 * squareSize,
											);
											lp.x = Math.floor(positionBeforePlus.x / chunkSize) - cp.x;
											lp.y = Math.floor(positionBeforePlus.y / chunkSize) - cp.y;
											lp.z = Math.floor(positionBeforePlus.z / chunkSize) - cp.z;
											mapPortion = Scene.Map.current.getMapPortion(lp.x, lp.y, lp.z);
											if (mapPortion) {
												jp.x = jpositionBefore.x + i2;
												jp.y = jpositionBefore.y + j2;
												jp.z = jpositionBefore.z + k2;
												const [b, y] = this.checkSprites(mapPortion, jp, object);
												// If before and after collides, get up!
												if (b === null) {
													object.updateMeshBBPosition(
														object.currentBoundingBox,
														bbSettings,
														positionAfter,
													);
													return [null, y, result[2]];
												}
											}
										}
									}
								}
								object.updateMeshBBPosition(object.currentBoundingBox, bbSettings, positionAfter);
								return [false, null, ORIENTATION.NONE];
							}
							return [result[0], result[1], result[2]];
						}
						if (result[0]) {
							block = true;
						}
						if (result[1] !== null) {
							if (yMountain === null || yMountain < result[1]) {
								yMountain = result[1];
							}
						}
					}
				}
			}
		}
		if (block && yMountain === null) {
			return [true, null, ORIENTATION.NONE];
		}

		// Test objects
		if (!reverseTestObjects) {
			const result = this.checkObjectsRay(positionAfter, object);
			if (result !== null) {
				return result;
			}
		}

		// Check empty square or square mountain height possible down
		lp.x = Math.floor(positionAfter.x / chunkSize) - cp.x;
		lp.y = Math.floor(positionAfter.y / chunkSize) - cp.y;
		lp.z = Math.floor(positionAfter.z / chunkSize) - cp.z;
		mapPortion = Scene.Map.current.getMapPortion(lp.x, lp.y, lp.z);
		let floors: number[];
		if (mapPortion) {
			floors =
				mapPortion.squareNonEmpty[jpositionAfter.x % Constants.PORTION_SIZE][
					jpositionAfter.z % Constants.PORTION_SIZE
				];
			const otherMapPortion = Scene.Map.current.getMapPortion(lp.x, lp.y + 1, lp.z);
			if (otherMapPortion) {
				floors = floors.concat(
					otherMapPortion.squareNonEmpty[jpositionAfter.x % Constants.PORTION_SIZE][
						jpositionAfter.z % Constants.PORTION_SIZE
					],
				);
			}
			if (yMountain === null && floors.indexOf(positionAfter.y) === -1) {
				const l = floors.length;
				if (l === 0) {
					return [true, null, ORIENTATION.NONE];
				} else {
					let maxY = null;
					const limitY = positionAfter.y - mountainCollisionHeight;
					let temp: number;
					for (i = 0; i < l; i++) {
						temp = floors[i];
						if (temp <= positionAfter.y + mountainCollisionHeight && temp >= limitY) {
							if (maxY === null) {
								maxY = temp;
							} else {
								if (maxY < temp) {
									maxY = temp;
								}
							}
						}
					}
					if (maxY === null) {
						// redo with before pos for going down two following height angled
						lp.x = Math.floor(positionBefore.x / chunkSize) - cp.x;
						lp.y = Math.floor(positionBefore.y / chunkSize) - cp.y;
						lp.z = Math.floor(positionBefore.z / chunkSize) - cp.z;
						mapPortion = Scene.Map.current.getMapPortion(lp.x, lp.y, lp.z);
						if (mapPortion) {
							floors =
								mapPortion.squareNonEmpty[jpositionBefore.x % Constants.PORTION_SIZE][
									jpositionBefore.z % Constants.PORTION_SIZE
								];
							const otherMapPortion = Scene.Map.current.getMapPortion(lp.x, lp.y + 1, lp.z);
							if (otherMapPortion) {
								floors = floors.concat(
									otherMapPortion.squareNonEmpty[jpositionBefore.x % Constants.PORTION_SIZE][
										jpositionBefore.z % Constants.PORTION_SIZE
									],
								);
							}
							if (yMountain === null && floors.indexOf(positionBefore.y) === -1) {
								const l = floors.length;
								if (l === 0) {
									return [null, null, ORIENTATION.NONE];
								} else {
									let maxY = null;
									const limitY = positionBefore.y - mountainCollisionHeight;
									let temp: number;
									for (i = 0; i < l; i++) {
										temp = floors[i];
										if (temp <= positionBefore.y + mountainCollisionHeight && temp >= limitY) {
											if (maxY === null) {
												maxY = temp;
											} else {
												if (maxY < temp) {
													maxY = temp;
												}
											}
										}
									}
									if (maxY === null) {
										if (object.orientation === object.previousOrientation) {
											// If non empty square on front of object, then force move front
											const positionFront = positionBefore.clone();
											switch (object.orientationEye) {
												case ORIENTATION.NORTH:
													positionFront.setZ(positionFront.z - squareSize / 2);
													break;
												case ORIENTATION.SOUTH:
													positionFront.setZ(positionFront.z + squareSize / 2);
													break;
												case ORIENTATION.WEST:
													positionFront.setX(positionFront.x - squareSize / 2);
													break;
												case ORIENTATION.EAST:
													positionFront.setX(positionFront.x + squareSize / 2);
													break;
											}
											lp.x = Math.floor(positionFront.x / chunkSize) - cp.x;
											lp.y = Math.floor(positionFront.y / chunkSize) - cp.y;
											lp.z = Math.floor(positionFront.z / chunkSize) - cp.z;
											mapPortion = Scene.Map.current.getMapPortion(lp.x, lp.y, lp.z);
											if (mapPortion) {
												floors =
													mapPortion.squareNonEmpty[
														Math.floor(positionFront.x / squareSize) %
															Constants.PORTION_SIZE
													][
														Math.floor(positionFront.z / squareSize) %
															Constants.PORTION_SIZE
													];
												if (floors.length > 0) {
													for (const y of floors) {
														if (y === positionFront.y) {
															return [false, null, ORIENTATION.NONE];
														}
													}
												}
											}
										}
										// Check if climbing stuff in 1 px bottom
										const positionBottom = Collisions._scratchPositionBottom.set(
											positionBefore.x,
											positionBefore.y - 1,
											positionBefore.z,
										);
										for (i = startI; i <= endI; i++) {
											for (j = startJ; j <= endJ; j++) {
												for (k = startK; k <= endK; k++) {
													positionBeforePlus.set(
														positionBefore.x + i * squareSize,
														positionBefore.y + j * squareSize - 1,
														positionBefore.z + k * squareSize,
													);
													lp.x = Math.floor(positionBeforePlus.x / chunkSize) - cp.x;
													lp.y = Math.floor(positionBeforePlus.y / chunkSize) - cp.y;
													lp.z = Math.floor(positionBeforePlus.z / chunkSize) - cp.z;
													mapPortion = Scene.Map.current.getMapPortion(lp.x, lp.y, lp.z);
													if (mapPortion) {
														jp.x = Math.floor(positionBeforePlus.x / squareSize);
														jp.y = Math.floor(positionBeforePlus.y / squareSize);
														jp.z = Math.floor(positionBeforePlus.z / squareSize);
														const climbingUp = object.isClimbingUp;
														object.isClimbingUp = false;
														object.updateMeshBBPosition(
															object.currentBoundingBox,
															bbSettings,
															positionBottom,
														);
														let [b, y, o] = this.checkSprites(mapPortion, jp, object);
														if (b === null) {
															// Check if after moving the collision still occurs. If not, go down
															const positionBottomAfter =
																Collisions._scratchPositionBottomAfter.set(
																	positionAfter.x,
																	positionAfter.y - 1,
																	positionAfter.z,
																);
															for (i2 = startI; i2 <= endI; i2++) {
																for (j2 = startJ; j2 <= endJ; j2++) {
																	for (k2 = startK; k2 <= endK; k2++) {
																		positionAfterPlus.set(
																			positionAfter.x + i2 * squareSize,
																			positionAfter.y + j2 * squareSize - 1,
																			positionAfter.z + k2 * squareSize,
																		);
																		lp.x =
																			Math.floor(
																				positionAfterPlus.x / chunkSize,
																			) - cp.x;
																		lp.y =
																			Math.floor(
																				positionAfterPlus.y / chunkSize,
																			) - cp.y;
																		lp.z =
																			Math.floor(
																				positionAfterPlus.z / chunkSize,
																			) - cp.z;
																		mapPortion = Scene.Map.current.getMapPortion(
																			lp.x,
																			lp.y,
																			lp.z,
																		);
																		if (mapPortion) {
																			jp.x = Math.floor(
																				positionAfterPlus.x / squareSize,
																			);
																			jp.y = Math.floor(
																				positionAfterPlus.y / squareSize,
																			);
																			jp.z = Math.floor(
																				positionAfterPlus.z / squareSize,
																			);
																			object.updateMeshBBPosition(
																				object.currentBoundingBox,
																				bbSettings,
																				positionBottomAfter,
																			);
																			b = this.checkSprites(
																				mapPortion,
																				jp,
																				object,
																			)[0];
																			if (b === null) {
																				object.updateMeshBBPosition(
																					object.currentBoundingBox,
																					bbSettings,
																					positionAfter,
																				);
																				object.isClimbingUp = climbingUp;
																				return [null, null, ORIENTATION.NONE];
																			}
																		}
																	}
																}
															}
															object.updateMeshBBPosition(
																object.currentBoundingBox,
																bbSettings,
																positionAfter,
															);
															object.isClimbingUp = climbingUp;
															return [null, y, o];
														}
														object.updateMeshBBPosition(
															object.currentBoundingBox,
															bbSettings,
															positionAfter,
														);
														object.isClimbingUp = climbingUp;
													}
												}
											}
										}
										return [true, null, ORIENTATION.NONE];
									} else {
										yMountain = maxY;
									}
								}
							}
						}
					} else {
						yMountain = maxY;
					}
				}
			}

			// Check lands inside collisions
			lp.x = Math.floor(positionBefore.x / chunkSize) - cp.x;
			lp.y = Math.floor(positionBefore.y / chunkSize) - cp.y;
			lp.z = Math.floor(positionBefore.z / chunkSize) - cp.z;
			mapPortion = Scene.Map.current.getMapPortion(lp.x, lp.y, lp.z);
			return [
				this.checkLandsInside(mapPortion, jpositionBefore, jpositionAfter, direction),
				yMountain,
				ORIENTATION.NONE,
			];
		}
		return [true, null, ORIENTATION.NONE];
	}

	static checkObjectsRay(positionAfter: THREE.Vector3, object: MapObject): [boolean, number, ORIENTATION] {
		// Check collision inside & with other objects
		if (object !== Game.current.hero && object.checkCollisionObject(Game.current.hero)) {
			return [true, null, ORIENTATION.NONE];
		}

		// Check objects collisions
		const squareSzChunk = Data.Systems.SQUARE_SIZE * Constants.PORTION_SIZE;
		const sp = Collisions._scratchPortion;
		sp.x = Math.floor(positionAfter.x / squareSzChunk);
		sp.y = Math.floor(positionAfter.y / squareSzChunk);
		sp.z = Math.floor(positionAfter.z / squareSzChunk);
		const portion = Scene.Map.current.getLocalPortion(sp);
		let i: number, j: number, mapPortion: MapPortion;
		for (i = -1; i <= 1; i++) {
			for (j = -1; j <= 1; j++) {
				mapPortion = Scene.Map.current.getMapPortion(portion.x + i, portion.y, portion.z + j);
				if (mapPortion && this.checkObjects(mapPortion, object)) {
					return [true, null, ORIENTATION.NONE];
				}
			}
		}
		return null;
	}

	/**
	 *  Check if there is a collision at this position.
	 *  @static
	 *  @param {MapPortion} mapPortion - The map portion to check
	 *  @param {Position} jpositionBefore - The json position before collision
	 *  @param {Position} jpositionAfter - The json position after collision
	 *  @param {THREE.Vector3} positionAfter - The position after collision
	 *  @param {MapObject} object - The map object collision test
	 *  @param {THREE.Vector3} direction - The direction collision
	 *  collisions that were already tested
	 *  @returns {boolean}
	 */
	static check(
		mapPortion: MapPortion,
		jpositionBefore: Position,
		jpositionAfter: Position,
		positionAfter: THREE.Vector3,
		object: MapObject,
		direction: THREE.Vector3,
	): [boolean, number, ORIENTATION] {
		// Check sprites and climbing
		let [isCollision, yMountain, o] = this.checkSprites(mapPortion, jpositionAfter, object);
		// Climbing
		if (isCollision || yMountain !== null) {
			return [isCollision, yMountain, o];
		}

		// Check mountain collision first for elevation
		[isCollision, yMountain] = this.checkMountains(mapPortion, jpositionAfter, positionAfter, object);
		if (isCollision) {
			return [isCollision, yMountain, ORIENTATION.NONE];
		}

		// Check other tests
		return [
			this.checkLands(mapPortion, jpositionBefore, jpositionAfter, object, direction) ||
				this.checkObjects3D(mapPortion, jpositionAfter, positionAfter, object),
			yMountain,
			ORIENTATION.NONE,
		];
	}

	/**
	 *  Check if there is a collision with lands at this position.
	 *  @static
	 *  @param {MapPortion} mapPortion - The map portion to check
	 *  @param {Position} jpositionBefore - The json position before collision
	 *  @param {Position} jpositionAfter - The json position after collision
	 *  @param {MapObject} object - The map object collision test
	 *  @param {THREE.Vector3} direction - The direction collision
	 *  collisions that were already tested
	 *  @returns {boolean}
	 */
	static checkLands(
		mapPortion: MapPortion,
		jpositionBefore: Position,
		jpositionAfter: Position,
		object: MapObject,
		direction: THREE.Vector3,
	): boolean {
		const index = jpositionAfter.toIndex();
		const lands = mapPortion.boundingBoxesLands[index];
		if (lands !== null) {
			let objCollision: StructMapElementCollision, boundingBox: number[], collision: CollisionSquare;
			for (let i = 0, l = lands.length; i < l; i++) {
				objCollision = lands[i];
				if (objCollision !== null) {
					boundingBox = objCollision.b;
					collision = objCollision.cs;
					if (
						this.checkIntersectionLand(collision, boundingBox, object) ||
						this.checkDirections(jpositionBefore, jpositionAfter, collision, boundingBox, direction, object)
					) {
						return true;
					}
				}
				//}
			}
		}
		return false;
	}

	/**
	 *  Check if there is a collision with lands with directions.
	 *  @static
	 *  @param {MapPortion} mapPortion - The map portion to check
	 *  @param {Position} jpositionBefore - The json position before collision
	 *  @param {Position} jpositionAfter - The json position after collision
	 *  @param {THREE.Vector3} direction - The direction collision
	 *  @returns {boolean}
	 */
	static checkLandsInside(
		mapPortion: MapPortion,
		jpositionBefore: Position,
		jpositionAfter: Position,
		direction: THREE.Vector3,
	): boolean {
		const lands = mapPortion.boundingBoxesLands[jpositionBefore.toIndex()];
		if (lands !== null) {
			let objCollision: StructMapElementCollision, collision: CollisionSquare;
			for (let i = 0, l = lands.length; i < l; i++) {
				objCollision = lands[i];
				if (objCollision !== null) {
					collision = objCollision.cs;
					if (this.checkDirectionsInside(jpositionBefore, jpositionAfter, collision, direction)) {
						return true;
					}
				}
			}
		}
		return false;
	}

	/**
	 *  Check intersection between ray and an object.
	 *  @static
	 *  @param {StructMapElementCollision} collision - The collision object
	 *  @param {number[]} boundingBox - The bounding box values
	 *  @param {MapObject} object - The map object to check
	 *  @returns {boolean}
	 */
	static checkIntersectionLand(
		collision: StructMapElementCollision,
		boundingBox: number[],
		object: MapObject,
	): boolean {
		if (collision !== null) {
			return false;
		}
		const box = this.getBBBox();
		this.applyBoxLandTransforms(box, boundingBox);
		return this.obbVSobb(<CustomGeometry>object.currentBoundingBox.geometry, <CustomGeometry>box.geometry);
	}

	/**
	 *  Check directions
	 *  @static
	 *  @param {Position} jpositionBefore - The json position before collision
	 *  @param {Position} jpositionAfter - The json position after collision
	 *  @param {StructMapElementCollision} collision - The collision object
	 *  @param {number[]} boundingBox - The bounding box values
	 *  @param {THREE.Vector3} direction - The direction collision
	 *  @param {MapObject} object - The map object collision test
	 *  @returns {boolean}
	 */
	static checkDirections(
		jpositionBefore: Position,
		jpositionAfter: Position,
		collision: StructMapElementCollision,
		boundingBox: number[],
		direction: THREE.Vector3,
		object: MapObject,
	): boolean {
		if (collision === null) {
			return false;
		}
		if (!jpositionBefore.equals(jpositionAfter)) {
			if (this.checkIntersectionLand(null, boundingBox, object)) {
				if (direction.x > 0) {
					return !collision.left;
				}
				if (direction.x < 0) {
					return !collision.right;
				}
				if (direction.z > 0) {
					return !collision.top;
				}
				if (direction.z < 0) {
					return !collision.bot;
				}
			}
		}
		return false;
	}

	/**
	 *  Check directions inside.
	 *  @static
	 *  @param {Position} jpositionBefore - The json position before collision
	 *  @param {Position} jpositionAfter - The json position after collision
	 *  @param {StructMapElementCollision} collision - The collision object
	 *  @param {THREE.Vector3} direction - The direction collision
	 *  @returns {boolean}
	 */
	static checkDirectionsInside(
		jpositionBefore: Position,
		jpositionAfter: Position,
		collision: StructMapElementCollision,
		direction: THREE.Vector3,
	): boolean {
		if (collision === null) {
			return false;
		}
		if (!jpositionBefore.equals(jpositionAfter)) {
			if (direction.x > 0) {
				return !collision.right;
			}
			if (direction.x < 0) {
				return !collision.left;
			}
			if (direction.z > 0) {
				return !collision.bot;
			}
			if (direction.z < 0) {
				return !collision.top;
			}
		}
		return false;
	}

	/**
	 *  Check if there is a collision with sprites at this position.
	 *  @static
	 *  @param {MapPortion} mapPortion - The map portion to check
	 *  @param {Position} jpositionAfter - The json position after collision
	 *  collisions that were already tested
	 *  @param {MapObject} object - The map object collision test
	 *  @returns {boolean}
	 */
	static checkSprites(
		mapPortion: MapPortion,
		jpositionAfter: Position,
		object: MapObject,
	): [boolean, number, ORIENTATION] {
		const sprites = this.getCollisionsWithOverflows(
			mapPortion,
			'boundingBoxesSprites',
			jpositionAfter,
			Scene.Map.current.overflowSprites,
		);

		let tested = false;
		if (sprites !== null) {
			let objCollision: StructMapElementCollision;
			for (let i = 0, l = sprites.length; i < l; i++) {
				objCollision = sprites[i];
				if (this.checkIntersectionSprite(objCollision.b, objCollision.k, object, objCollision.cr)) {
					if (objCollision.cl) {
						const speed =
							(object.speed.getValue() as number) *
							MapObject.SPEED_NORMAL *
							Manager.Stack.averageElapsedTime *
							Data.Systems.SQUARE_SIZE *
							(Data.Systems.climbingSpeed.getValue() as number);
						const limitTop = objCollision.b[1] + Math.ceil(objCollision.b[4] / 2);
						const limitBot = objCollision.b[1] - Math.ceil(objCollision.b[4] / 2);
						const y = object.isClimbingUp
							? Math.min(object.position.y + speed, limitTop)
							: Math.max(object.position.y - speed, limitBot);
						if (y === object.position.y) {
							continue;
						}
						const angle = objCollision.b[6];
						let force = false,
							front = false;
						if (angle === 0 || angle === 180) {
							force = true;
							front = true;
						} else if (angle === 90 || angle === 270) {
							force = true;
						}
						return [null, y, object.getOrientationBetweenPosition(objCollision.l, force, front)];
					}
					if (!object.isClimbing) {
						tested = true;
					}
				}
			}
		}
		return [tested, null, ORIENTATION.NONE];
	}

	/**
	 *  Check intersection between ray and an object.
	 *  @static
	 *  @param {number[]} boundingBox - The bounding box values
	 *  @param {boolean} fix - Indicate if the sprite is fix or not
	 *  @param {MapObject} object - The map object collision test
	 *  @returns {boolean}
	 */
	static checkIntersectionSprite(
		boundingBox: number[],
		fix: boolean,
		object: MapObject,
		center?: [number, number, number],
	): boolean {
		if (boundingBox === null) {
			return false;
		}
		if (fix) {
			const box = this.getBBBox();
			this.applyBoxSpriteTransforms(box, boundingBox, true, center);
			return this.obbVSobb(<CustomGeometry>object.currentBoundingBox.geometry, <CustomGeometry>box.geometry);
		} else {
			const box = this.getBBOrientedBox();
			this.applyOrientedBoxTransforms(box, boundingBox, center);
			return this.obbVSobb(<CustomGeometry>object.currentBoundingBox.geometry, <CustomGeometry>box.geometry);
		}
	}

	static getCollisionsWithOverflows(
		mapPortion: MapPortion,
		boundingBoxPropertyName: string,
		jpositionAfter: Position,
		overflow: Map<string, Set<string>>,
	): StructMapElementCollision[] {
		const base: StructMapElementCollision[] = mapPortion[boundingBoxPropertyName][jpositionAfter.toIndex()] ?? [];
		const overflowPortions = overflow.get(jpositionAfter.getGlobalPortionKey());
		if (!overflowPortions || overflowPortions.size === 0) {
			return base;
		}
		const list = Collisions._scratchCollisionList;
		list.length = 0;
		for (let i = 0, l = base.length; i < l; i++) list.push(base[i]);
		const ocp = Scene.Map.current.currentPortion;
		const osp = Collisions._scratchCheckPortion;
		for (const key of overflowPortions) {
			// Inline Portion.fromKey + getLocalPortion to avoid two Portion allocations per entry
			const s1 = key.indexOf('_');
			const s2 = key.indexOf('_', s1 + 1);
			osp.x = +key.slice(0, s1) - ocp.x;
			osp.y = +key.slice(s1 + 1, s2) - ocp.y;
			osp.z = +key.slice(s2 + 1) - ocp.z;
			const overflowMapPortion = Scene.Map.current.getMapPortion(osp.x, osp.y, osp.z);
			if (overflowMapPortion) {
				const extra = overflowMapPortion[boundingBoxPropertyName][jpositionAfter.toIndex()];
				if (extra) for (let i = 0, l = extra.length; i < l; i++) list.push(extra[i]);
			}
		}
		return list;
	}

	/**
	 *  Check if there is a collision with sprites at this position.
	 *  @static
	 *  @param {MapPortion} mapPortion - The map portion to check
	 *  @param {Position} jpositionAfter - The json position after collision
	 *  @param {THREE.Vector3} positionAfter - The position after collision
	 *  collisions that were already tested
	 *  @param {MapObject} object - The map object collision test
	 *  @returns {boolean}
	 */
	static checkObjects3D(
		mapPortion: MapPortion,
		jpositionAfter: Position,
		positionAfter: THREE.Vector3,
		object: MapObject,
	): boolean {
		const objects3D = this.getCollisionsWithOverflows(
			mapPortion,
			'boundingBoxesObjects3D',
			jpositionAfter,
			Scene.Map.current.overflowObjects3D,
		);
		if (objects3D !== null) {
			let objCollision: StructMapElementCollision;
			for (let i = 0, l = objects3D.length; i < l; i++) {
				objCollision = objects3D[i];
				if (objCollision.id) {
					if (this.checkCustomObject3D(objCollision, object, positionAfter)) {
						return true;
					}
				} else {
					if (this.checkIntersectionSprite(objCollision.b, objCollision.k, object, objCollision.cr)) {
						return true;
					}
				}
			}
		}
		return false;
	}

	/**
	 *  Check if there is a collision with custom object 3D collision.
	 *  @static
	 *  @param {StructMapElementCollision} objCollision - The object colision
	 *  info to test
	 *  @param {MapObject} object - The map object collision test
	 *  @param {THREE.Vector3} positionAfter - The position after collision
	 *  @returns {boolean}
	 */
	static checkCustomObject3D(
		objCollision: StructMapElementCollision,
		object: MapObject,
		positionAfter: THREE.Vector3,
	): boolean {
		// Remove previous
		const mesh = Data.Shapes.get(CUSTOM_SHAPE_KIND.COLLISIONS, objCollision.id)?.mesh;
		if (mesh !== this.currentCustomObject3D) {
			Scene.Map.current.scene.remove(this.currentCustomObject3D);
			this.currentCustomObject3D = mesh;
		}
		if (this.currentCustomObject3D) {
			this.currentCustomObject3D.position.set(objCollision.l.x, objCollision.l.y, objCollision.l.z);
			this.currentCustomObject3D.rotation.set(
				(objCollision.b[7] * Math.PI) / 180.0,
				(objCollision.b[6] * Math.PI) / 180.0,
				(objCollision.b[8] * Math.PI) / 180.0,
				'XYZ',
			);
			Scene.Map.current.scene.add(this.currentCustomObject3D);
			if (Data.Systems.showBB) {
				this.currentCustomObject3D.material = this.BB_MATERIAL;
			} else {
				this.currentCustomObject3D.material = this.BB_EMPTY_MATERIAL;
			}
			const direction = positionAfter.clone().sub(object.position).normalize();
			if (this.checkIntersectionMeshes(object.currentBoundingBox, this.currentCustomObject3D, direction)) {
				return true;
			}
		}
		return false;
	}

	/**
	 *  Check intersection between two complex meshes.
	 *  @static
	 *  @param {THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]>} meshA - The first mesh
	 *  @param {THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]>} meshB - The second mesh
	 *  @param {THREE.Vector3} direction - The meshA direction to mesh B
	 *  @returns {boolean}
	 */
	static checkIntersectionMeshes(
		meshA: THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]>,
		meshB: THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]>,
		direction: THREE.Vector3,
	): boolean {
		const vertices = meshA.geometry.getVerticesVectors();
		const raycaster = Collisions._raycaster;
		const directionNegate = direction.clone().negate();
		let collisionResults: THREE.Intersection[];
		for (const vertex of vertices) {
			raycaster.set(vertex, direction);
			collisionResults = raycaster.intersectObject(meshB);
			if (collisionResults.length === 0) {
				raycaster.set(vertex, directionNegate);
				collisionResults = raycaster.intersectObject(meshB);
			}
			if (collisionResults.length > 0) {
				raycaster.set(collisionResults[0].point, new THREE.Vector3(1, 1, 1));
				const intersects = raycaster.intersectObject(meshA);
				if (intersects.length > 0) {
					// Points is in objet
					return true;
				}
			}
		}
		return false;
	}

	/**
	 *  Check if there is a collision with mountains at this position.
	 *  @static
	 *  @param {MapPortion} mapPortion - The map portion to check
	 *  @param {Position} jpositionAfter - The json position after collision
	 *  @param {THREE.Vector3} positionAfter - The position after collision
	 *  already tested
	 *  @param {MapObject} object - The map object collision test
	 *  @returns {boolean}
	 */
	static checkMountains(
		mapPortion: MapPortion,
		jpositionAfter: Position,
		positionAfter: THREE.Vector3,
		object: MapObject,
	): [boolean, number] {
		let yMountain = null;
		const mountains = this.getCollisionsWithOverflows(
			mapPortion,
			'boundingBoxesMountains',
			jpositionAfter,
			Scene.Map.current.overflowMountains,
		);
		let block = false;
		for (const mountain of mountains) {
			const result = this.checkMountain(
				mapPortion,
				jpositionAfter,
				positionAfter,
				object,
				mountain,
				yMountain,
				block,
			);
			if (result[0]) {
				return [result[1], result[2]];
			} else {
				block = result[1];
				yMountain = result[2];
			}
		}
		return [block && yMountain === null, yMountain];
	}

	/**
	 *  Check if there is a collision with mountains at this position.
	 *  @static
	 *  @param {MapPortion} mapPortion - The map portion to check
	 *  @param {Position} jpositionAfter - The json position after collision
	 *  @param {THREE.Vector3} positionAfter - The position after collision
	 *  @param {MapObject} object - The map object collision test
	 *  @param {StructMapElementCollision} objCollision - The object collision
	 *  @param {number} yMountain - The y mountain collision
	 *  @param {boolean} block - The block mountain collision
	 *  @returns {[boolean, boolean, number]}
	 */
	static checkMountain(
		mapPortion: MapPortion,
		jpositionAfter: Position,
		positionAfter: THREE.Vector3,
		object: MapObject,
		objCollision: StructMapElementCollision,
		yMountain: number,
		block: boolean,
	): [boolean, boolean, number] {
		const result = this.checkIntersectionMountain(mapPortion, jpositionAfter, positionAfter, objCollision, object);
		if (result[0]) {
			if (result[1] === null) {
				return [true, result[0], result[1]];
			} else {
				block = true;
			}
		} else if (result[1] !== null) {
			if (yMountain === null || yMountain < result[1]) {
				yMountain = result[1];
			}
		}
		//}
		return [false, block, yMountain];
	}

	/**
	 *  Check intersection with a mountain.
	 *  @static
	 *  @param {MapPortion} mapPortion - The map portion to check
	 *  @param {Position} jpositionAfter - The json position after collision
	 *  @param {THREE.Vector3} positionAfter - The position after collision
	 *  @param {StructMapElementCollision} objCollision - The object collision
	 *  @param {MapObject} object - The map object collision test
	 *  @returns {[boolean, number]}
	 */
	static checkIntersectionMountain(
		mapPortion: MapPortion,
		jpositionAfter: Position,
		positionAfter: THREE.Vector3,
		objCollision: StructMapElementCollision,
		object: MapObject,
	): [boolean, number] {
		const x = objCollision.l.x;
		const y = objCollision.l.y;
		const z = objCollision.l.z;
		const w = objCollision.rw;
		const h = objCollision.rh;
		const mtnCollisionHeight = Data.Systems.mountainCollisionHeight.getValue() as number;

		// Fast Y-bounds reject: skip full geometric test if player is clearly out of this mountain's vertical range
		if (positionAfter.y > y + h + mtnCollisionHeight || positionAfter.y < y - mtnCollisionHeight) {
			return [false, null];
		}

		const mountain = <Mountain>objCollision.t;
		const system = <Model.Mountain>mountain.getSystem();
		const forceAlways = system.forceAlways();
		const forceNever = system.forceNever();
		const point = Collisions._scratchMtnPoint.set(positionAfter.x, positionAfter.z);
		const mtnCollisionAngle = Data.Systems.mountainCollisionAngle.getValue() as number;

		// if w = 0, check height
		if (w === 0) {
			const pass = forceNever || -(!forceAlways && y + h <= positionAfter.y + mtnCollisionHeight);
			if (Mathf.isPointOnRectangle(point, x, x + Data.Systems.SQUARE_SIZE, z, z + Data.Systems.SQUARE_SIZE)) {
				return pass ? [false, positionAfter.y >= y + h ? null : y + h] : [true, null];
			} else {
				if (!pass) {
					// Collide with BB (avoiding use of checkIntersectionSprite here for perfs issues)
					const vertices = object.currentBoundingBox.geometry.getVertices();
					let vy = 0;
					for (let i = 0, l = vertices.length; i < l; i += 3) {
						vy = vertices[i + 1];
						if (vy >= y && vy <= y + h) {
							point.set(vertices[i], vertices[i + 2]);
							if (
								Mathf.isPointOnRectangle(
									point,
									x,
									x + Data.Systems.SQUARE_SIZE,
									z,
									z + Data.Systems.SQUARE_SIZE,
								)
							) {
								return [true, null];
							}
						}
					}
				}
			}
		} else {
			// if w > 0, go like a slope
			// Fast XZ bounding-box reject: skip if player is outside the maximum slope footprint
			const sqSz = Data.Systems.SQUARE_SIZE;
			if (
				positionAfter.x < x - w ||
				positionAfter.x > x + sqSz + w ||
				positionAfter.z < z - w ||
				positionAfter.z > z + sqSz + w
			) {
				return [false, null];
			}

			const rwBot = objCollision.rwBot ?? objCollision.rw;
			const rwTop = objCollision.rwTop ?? objCollision.rw;
			const rwLeft = objCollision.rwLeft ?? objCollision.rw;
			const rwRight = objCollision.rwRight ?? objCollision.rw;

			// Determine which side the player is on and its slope width
			let sideW: number;
			if (objCollision.left && !mountain.left) {
				sideW = rwLeft;
			} else if (objCollision.right && !mountain.right) {
				sideW = rwRight;
			} else if (objCollision.top && !mountain.top) {
				sideW = rwTop;
			} else if (objCollision.bot && !mountain.bot) {
				sideW = rwBot;
			} else {
				return [false, null];
			}

			// If this side has no slope (width = 0), fall back to box collision for the vertical wall
			if (sideW === 0) {
				const pass = forceNever || -(!forceAlways && y + h <= positionAfter.y + mtnCollisionHeight);
				if (Mathf.isPointOnRectangle(point, x, x + Data.Systems.SQUARE_SIZE, z, z + Data.Systems.SQUARE_SIZE)) {
					return pass ? [false, positionAfter.y >= y + h ? null : y + h] : [true, null];
				} else if (!pass) {
					const vertices = object.currentBoundingBox.geometry.getVertices();
					for (let i = 0, l = vertices.length; i < l; i += 3) {
						const vy = vertices[i + 1];
						if (vy >= y && vy <= y + h) {
							point.set(vertices[i], vertices[i + 2]);
							if (
								Mathf.isPointOnRectangle(
									point,
									x,
									x + Data.Systems.SQUARE_SIZE,
									z,
									z + Data.Systems.SQUARE_SIZE,
								)
							) {
								return [true, null];
							}
						}
					}
				}
				return [false, null];
			}

			// Slope geometry: find the coplanar points for the intersection plane, using per-side widths
			const ptA = Collisions._scratchMtnPtA;
			const ptB = Collisions._scratchMtnPtB;
			const ptC = Collisions._scratchMtnPtC;
			const pA = Collisions._scratchMtnPA;
			const pB = Collisions._scratchMtnPB;
			const pC = Collisions._scratchMtnPC;
			if (objCollision.left && !mountain.left) {
				if (objCollision.top && !mountain.top) {
					ptA.set(x - rwLeft, z);
					ptB.set(x, z);
					ptC.set(x, z - rwTop);
					if (Mathf.isPointOnTriangle(point, ptA, ptB, ptC)) {
						pA.set(ptA.x, y, ptA.y);
						pB.set(ptB.x, y + h, ptB.y);
						pC.set(ptC.x, y, ptC.y);
					} else {
						return [false, null];
					}
				} else if (objCollision.bot && !mountain.bot) {
					ptA.set(x - rwLeft, z + Data.Systems.SQUARE_SIZE);
					ptB.set(x, z + Data.Systems.SQUARE_SIZE);
					ptC.set(x, z + Data.Systems.SQUARE_SIZE + rwBot);
					if (Mathf.isPointOnTriangle(point, ptA, ptB, ptC)) {
						pA.set(ptA.x, y, ptA.y);
						pB.set(ptB.x, y + h, ptB.y);
						pC.set(ptC.x, y, ptC.y);
					} else {
						return [false, null];
					}
				} else {
					if (Mathf.isPointOnRectangle(point, x - rwLeft, x, z, z + Data.Systems.SQUARE_SIZE)) {
						pA.set(x - rwLeft, y, z);
						pB.set(x, y + h, z);
						pC.set(x, y + h, z + Data.Systems.SQUARE_SIZE);
					} else {
						return [false, null];
					}
				}
			} else if (objCollision.right && !mountain.right) {
				if (objCollision.top && !mountain.top) {
					ptA.set(x + Data.Systems.SQUARE_SIZE, z - rwTop);
					ptB.set(x + Data.Systems.SQUARE_SIZE, z);
					ptC.set(x + Data.Systems.SQUARE_SIZE + rwRight, z);
					if (Mathf.isPointOnTriangle(point, ptA, ptB, ptC)) {
						pA.set(ptA.x, y, ptA.y);
						pB.set(ptB.x, y + h, ptB.y);
						pC.set(ptC.x, y, ptC.y);
					} else {
						return [false, null];
					}
				} else if (objCollision.bot && !mountain.bot) {
					ptA.set(x + Data.Systems.SQUARE_SIZE, z + Data.Systems.SQUARE_SIZE + rwBot);
					ptB.set(x + Data.Systems.SQUARE_SIZE, z + Data.Systems.SQUARE_SIZE);
					ptC.set(x + Data.Systems.SQUARE_SIZE + rwRight, z + Data.Systems.SQUARE_SIZE);
					if (Mathf.isPointOnTriangle(point, ptA, ptB, ptC)) {
						pA.set(ptA.x, y, ptA.y);
						pB.set(ptB.x, y + h, ptB.y);
						pC.set(ptC.x, y, ptC.y);
					} else {
						return [false, null];
					}
				} else {
					if (
						Mathf.isPointOnRectangle(
							point,
							x + Data.Systems.SQUARE_SIZE,
							x + Data.Systems.SQUARE_SIZE + rwRight,
							z,
							z + Data.Systems.SQUARE_SIZE,
						)
					) {
						pA.set(x + Data.Systems.SQUARE_SIZE, y + h, z + Data.Systems.SQUARE_SIZE);
						pB.set(x + Data.Systems.SQUARE_SIZE, y + h, z);
						pC.set(x + Data.Systems.SQUARE_SIZE + rwRight, y, z);
					} else {
						return [false, null];
					}
				}
			} else {
				if (objCollision.top && !mountain.top) {
					if (Mathf.isPointOnRectangle(point, x, x + Data.Systems.SQUARE_SIZE, z - rwTop, z)) {
						pA.set(x, y + h, z);
						pB.set(x, y, z - rwTop);
						pC.set(x + Data.Systems.SQUARE_SIZE, y, z - rwTop);
					} else {
						return [false, null];
					}
				} else if (objCollision.bot && !mountain.bot) {
					if (
						Mathf.isPointOnRectangle(
							point,
							x,
							x + Data.Systems.SQUARE_SIZE,
							z + Data.Systems.SQUARE_SIZE,
							z + Data.Systems.SQUARE_SIZE + rwBot,
						)
					) {
						pA.set(x + Data.Systems.SQUARE_SIZE, y, z + Data.Systems.SQUARE_SIZE + rwBot);
						pB.set(x, y, z + Data.Systems.SQUARE_SIZE + rwBot);
						pC.set(x, y + h, z + Data.Systems.SQUARE_SIZE);
					} else {
						return [false, null];
					}
				} else {
					return [false, null];
				}
			}
			// Get the intersection point for updating mountain y
			const plane = Collisions._scratchMtnPlane;
			const ray = Collisions._scratchMtnRay;
			ray.origin.set(positionAfter.x, y, positionAfter.z);
			ray.direction.set(0, 1, 0);
			const newPosition = Collisions._scratchMtnNewPosition;
			plane.setFromCoplanarPoints(pA, pB, pC);
			ray.intersectPlane(plane, newPosition);

			// If going down, check if there's a blocking floor
			let jposition: Position;
			if (newPosition.y - positionAfter.y < 0) {
				jposition = Collisions._scratchMtnJPosition;
				jposition.x = Math.floor(positionAfter.x / Data.Systems.SQUARE_SIZE);
				jposition.y = Math.ceil(positionAfter.y / Data.Systems.SQUARE_SIZE);
				jposition.z = Math.floor(positionAfter.z / Data.Systems.SQUARE_SIZE);
			} else {
				jposition = jpositionAfter;
			}
			const cp = Scene.Map.current.currentPortion;
			mapPortion = Scene.Map.current.getMapPortion(
				Math.floor(jposition.x / Constants.PORTION_SIZE) - cp.x,
				Math.floor(jposition.y / Constants.PORTION_SIZE) - cp.y,
				Math.floor(jposition.z / Constants.PORTION_SIZE) - cp.z,
			);
			let isFloor = mapPortion.boundingBoxesLands[jposition.toIndex()].length > 0;
			if (isFloor && newPosition.y - positionAfter.y < 0) {
				return [false, null];
			}

			// If angle limit, block — compute per-side angle from actual side width
			const sideAngle = sideW === 0 ? 90 : (Math.atan(h / sideW) * 180) / Math.PI;
			if (forceAlways || (!forceNever && sideAngle > mtnCollisionAngle)) {
				// Check if floor existing on top of the mountain angle
				isFloor =
					jposition.y === jpositionAfter.y
						? false
						: mapPortion.boundingBoxesLands[jpositionAfter.toIndex()].length > 0;
				return [!isFloor, null];
			}
			return [!forceNever && Math.abs(newPosition.y - positionAfter.y) > mtnCollisionHeight, newPosition.y];
		}
		return [false, null];
	}

	/**
	 *  Check collision with objects.
	 *  @static
	 *  @param {MapPortion} mapPortion - The map portion to check
	 *  @param {MapObject} object - The map object collision test
	 *  @returns {boolean}
	 */
	static checkObjects(mapPortion: MapPortion, object: MapObject): boolean {
		const datas = Scene.Map.current.getObjectsAtPortion(mapPortion.portion);
		return (
			this.checkObjectsList(mapPortion.objectsList, object) ||
			this.checkObjectsList(datas.min, object) ||
			this.checkObjectsList(datas.mout, object)
		);
	}

	/**
	 *  Check collision with objects.
	 *  @static
	 *  @param {MapObject[]} list - The map objects list to test
	 *  @param {MapObject} object - The map object collision test
	 *  @returns {boolean}
	 */
	static checkObjectsList(list: MapObject[], object: MapObject): boolean {
		let obj: MapObject;
		for (let i = 0, l = list.length; i < l; i++) {
			obj = list[i];
			if (obj !== object) {
				if (object.checkCollisionObject(obj)) {
					return true;
				}
			}
		}
		return false;
	}
}

export { Collisions };
