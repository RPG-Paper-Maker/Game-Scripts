/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { CUSTOM_SHAPE_KIND, Mathf, OBJECT_COLLISION_KIND } from '../Common';
import { Data, Model } from '../index';
import { CustomGeometry } from './CustomGeometry';
import { StructMapElementCollision } from './MapElement';
import { Object3D } from './Object3D';
import { Position } from './Position';

/** @class
 *  A 3D object custom in the map.
 *  @extends Object3D
 *  @param {Record<string, any>} json - Json object describing the object 3D custom
 *  @param {System.Object3D} datas - The System object 3D
 */
class Object3DCustom extends Object3D {
	public id: number;
	public datas: Model.Object3D;

	constructor(json?: Record<string, any>, datas?: Model.Object3D) {
		super();

		this.datas = datas;
		if (json) {
			this.read(json);
		}
	}

	/**
	 *  Create a new 3D object box.
	 *  @static
	 *  @param {System.Object3D} datas - The object datas
	 *  @returns {Core.Object3DBox}
	 */
	static create(datas: Model.Object3D): Object3DCustom {
		const object = new Object3DCustom(undefined, datas);
		object.id = datas.id;
		return object;
	}

	/**
	 *  Read the JSON associated to the object 3D custom.
	 *  @param {Record<string, any>} json - Json object describing the object 3D
	 *  custom
	 */
	read(json: Record<string, any>) {
		super.read(json);

		this.id = this.datas.id;
	}

	/**
	 *  Get the center vector.
	 *  @returns {Vector3}
	 */
	getShapeKindAndID(): [CUSTOM_SHAPE_KIND, number] {
		if (this.datas.gltfID !== -1) {
			return [CUSTOM_SHAPE_KIND.GLTF, this.datas.gltfID];
		}
		return [CUSTOM_SHAPE_KIND.OBJ, this.datas.objID];
	}

	getCenterVector(): THREE.Vector3 {
		const [kind, id] = this.getShapeKindAndID();
		return Data.Shapes.get(kind, id).geometry.center.clone();
	}

	/**
	 *  Update the geometry of a group of objects 3D cutom with the same
	 *  material.
	 *  @param {Core.CustomGeometry} geometry - Geometry of the object 3D custom
	 *  @param {Position} position - The position of the object 3D custom
	 *  @param {number} count - The faces count
	 *  @return {any[]}
	 */
	updateGeometry(geometry: CustomGeometry, position: Position, count: number): [number, StructMapElementCollision[]] {
		const localPosition = position.toVector3();
		const [kind, shapeID] = this.getShapeKindAndID();
		const modelGeometry = Data.Shapes.get(kind, shapeID).geometry;
		const vertices = modelGeometry.vertices;
		const uvs = modelGeometry.uvs;
		const scale = this.datas.scale;
		const scaleVec = new THREE.Vector3(scale * position.scaleX, scale * position.scaleY, scale * position.scaleZ);
		const center = new THREE.Vector3();
		center.multiply(scaleVec);
		let vecA: THREE.Vector3, vecB: THREE.Vector3, vecC: THREE.Vector3;
		for (let i = 0, l = modelGeometry.vertices.length; i < l; i += 3) {
			vecA = vertices[i].clone();
			vecB = vertices[i + 1].clone();
			vecC = vertices[i + 2].clone();
			vecA.multiply(scaleVec);
			vecB.multiply(scaleVec);
			vecC.multiply(scaleVec);
			Mathf.rotateVertexEuler(vecA, center, position.toRotationEuler());
			Mathf.rotateVertexEuler(vecB, center, position.toRotationEuler());
			Mathf.rotateVertexEuler(vecC, center, position.toRotationEuler());
			vecA.add(localPosition);
			vecB.add(localPosition);
			vecC.add(localPosition);
			geometry.pushTriangleVertices(vecA, vecB, vecC);
			geometry.pushTriangleIndices(count);
			geometry.pushTriangleUVs(uvs[i].clone(), uvs[i + 1].clone(), uvs[i + 2].clone());
			count += 3;
		}

		// Collisions
		const objCollision: StructMapElementCollision[] = [];
		if (this.datas.collisionKind === OBJECT_COLLISION_KIND.SIMPLIFIED) {
			const obj = this.datas.getObj().geometry;
			const w = obj.w * scale * position.scaleX;
			const h = obj.h * scale * position.scaleY;
			const d = obj.d * scale * position.scaleZ;
			const minPos = obj.minVertex.clone();
			minPos.multiply(scaleVec);
			objCollision.push({
				p: position,
				l: localPosition,
				b: [
					localPosition.x,
					localPosition.y,
					localPosition.z,
					w,
					h,
					d,
					position.angleY,
					position.angleX,
					position.angleZ,
				],
				c: center,
				w: Math.ceil(w / 2 / Data.Systems.SQUARE_SIZE),
				h: Math.ceil(h / 2 / Data.Systems.SQUARE_SIZE),
				cr: [-minPos.x - w / 2, -minPos.y - h / 2, -minPos.z - d / 2],
				d: Math.ceil(d / 2 / Data.Systems.SQUARE_SIZE),
				m: Math.max(
					Math.max(Math.ceil(w / 2 / Data.Systems.SQUARE_SIZE), Math.ceil(h / 2 / Data.Systems.SQUARE_SIZE)),
					Math.ceil(d / 2 / Data.Systems.SQUARE_SIZE),
				),
				k: true,
			});
		} else if (this.datas.collisionKind === OBJECT_COLLISION_KIND.CUSTOM) {
			const obj = Data.Shapes.get(CUSTOM_SHAPE_KIND.COLLISIONS, this.datas.collisionCustomID).geometry;
			const w = obj.w * scale * position.scaleX;
			const h = obj.h * scale * position.scaleY;
			const d = obj.d * scale * position.scaleZ;
			const minPos = obj.minVertex.clone();
			minPos.multiply(scaleVec);
			objCollision.push({
				id: this.datas.collisionCustomID,
				p: position,
				l: localPosition,
				b: [
					localPosition.x + minPos.x + w / 2,
					localPosition.y + minPos.y + h / 2,
					localPosition.z + minPos.z + d / 2,
					w,
					h,
					d,
					position.angleY,
					position.angleX,
					position.angleZ,
				],
				c: center,
				w: Math.ceil(w / 2 / Data.Systems.SQUARE_SIZE),
				h: Math.ceil(h / 2 / Data.Systems.SQUARE_SIZE),
				rw: w,
				rh: h,
				d: Math.ceil(d / 2 / Data.Systems.SQUARE_SIZE),
				m: Math.max(
					Math.max(Math.ceil(w / 2 / Data.Systems.SQUARE_SIZE), Math.ceil(h / 2 / Data.Systems.SQUARE_SIZE)),
					Math.ceil(d / 2 / Data.Systems.SQUARE_SIZE),
				),
				k: true,
			});
		}
		return [count, objCollision];
	}

	/**
	 *  Create a new geometry.
	 *  @param {Position} position - The position of object 3D
	 *  @return {[Core.CustomGeometry, [number, StructMapElementCollision[]]]}
	 */
	createGeometry(position: Position): [CustomGeometry, [number, StructMapElementCollision[]]] {
		const geometry = new CustomGeometry();
		const collisions = this.updateGeometry(geometry, position, 0);
		geometry.updateAttributes();
		return [geometry, collisions];
	}
}

export { Object3DCustom };
