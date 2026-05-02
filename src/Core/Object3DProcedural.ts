/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { CUSTOM_SHAPE_KIND, Mathf, OBJECT_COLLISION_KIND, SHAPE_KIND } from '../Common';
import { Data, Model } from '../index';
import { CustomGeometry } from './CustomGeometry';
import { StructMapElementCollision } from './MapElement';
import { Object3D } from './Object3D';
import { Position } from './Position';

function buildUnitTriangles(geo: THREE.BufferGeometry): { vertices: THREE.Vector3[]; uvs: THREE.Vector2[] } {
	const nonIndexed = geo.toNonIndexed();
	nonIndexed.computeBoundingBox();
	const box = nonIndexed.boundingBox!;
	const center = new THREE.Vector3();
	box.getCenter(center);
	const size = new THREE.Vector3();
	box.getSize(size);
	const pos = nonIndexed.getAttribute('position') as THREE.BufferAttribute;
	const uv = nonIndexed.getAttribute('uv') as THREE.BufferAttribute;
	const vertices: THREE.Vector3[] = [];
	const uvs: THREE.Vector2[] = [];
	for (let i = 0; i < pos.count; i++) {
		vertices.push(
			new THREE.Vector3(
				(pos.getX(i) - center.x) / size.x,
				(pos.getY(i) - center.y) / size.y,
				(pos.getZ(i) - center.z) / size.z,
			),
		);
		uvs.push(uv ? new THREE.Vector2(uv.getX(i), uv.getY(i)) : new THREE.Vector2(0, 0));
	}
	return { vertices, uvs };
}

const geometryCache = new Map<string, { vertices: THREE.Vector3[]; uvs: THREE.Vector2[] }>();

function getUnitTriangles(
	shapeKind: SHAPE_KIND,
	segments: number,
): { vertices: THREE.Vector3[]; uvs: THREE.Vector2[] } {
	const key = `${shapeKind}_${segments}`;
	if (!geometryCache.has(key)) {
		let geo: THREE.BufferGeometry;
		switch (shapeKind) {
			case SHAPE_KIND.SPHERE:
				geo = new THREE.SphereGeometry(0.5, segments, Math.ceil(segments * 0.75));
				break;
			case SHAPE_KIND.CYLINDER:
				geo = new THREE.CylinderGeometry(0.5, 0.5, 1, segments);
				break;
			case SHAPE_KIND.CONE:
				geo = new THREE.ConeGeometry(0.5, 1, segments);
				break;
			case SHAPE_KIND.CAPSULE:
				// radius=0.25, length=0.5 → total height=1.0, normalized to [-0.5, 0.5]
				geo = new THREE.CapsuleGeometry(0.25, 0.5, Math.ceil(segments / 2), segments);
				break;
			default:
				geo = new THREE.SphereGeometry(0.5, segments, Math.ceil(segments * 0.75));
		}
		geometryCache.set(key, buildUnitTriangles(geo));
	}
	return geometryCache.get(key)!;
}

/**
 * A procedural 3D object (sphere, cylinder, cone, or capsule) built from
 * Three.js built-in geometries, scaled to the object's configured dimensions.
 */
class Object3DProcedural extends Object3D {
	public id: number;
	public datas: Model.Object3D;

	constructor(json?: Record<string, any>, datas?: Model.Object3D) {
		super();
		this.datas = datas;
		if (json) {
			this.read(json);
		}
	}

	static create(datas: Model.Object3D): Object3DProcedural {
		const object = new Object3DProcedural(undefined, datas);
		object.id = datas.id;
		return object;
	}

	read(json: Record<string, any>) {
		super.read(json);
		this.id = this.datas.id;
	}

	getCenterVector(): THREE.Vector3 {
		return new THREE.Vector3(0, this.datas.heightPixels() / 2, 0);
	}

	updateGeometry(geometry: CustomGeometry, position: Position, count: number): [number, StructMapElementCollision[]] {
		const localPosition = position.toVector3();
		const size = this.datas.getSizeVector().multiply(position.toScaleVector());
		const yShift = size.y / 2;
		const euler = position.toRotationEuler();
		const origin = new THREE.Vector3();
		const { vertices, uvs } = getUnitTriangles(this.datas.shapeKind, this.datas.segments);
		for (let i = 0, l = vertices.length; i < l; i += 3) {
			const vecA = vertices[i].clone().multiply(size);
			const vecB = vertices[i + 1].clone().multiply(size);
			const vecC = vertices[i + 2].clone().multiply(size);
			vecA.y += yShift;
			vecB.y += yShift;
			vecC.y += yShift;
			Mathf.rotateVertexEuler(vecA, origin, euler);
			Mathf.rotateVertexEuler(vecB, origin, euler);
			Mathf.rotateVertexEuler(vecC, origin, euler);
			vecA.add(localPosition);
			vecB.add(localPosition);
			vecC.add(localPosition);
			geometry.pushTriangleVertices(vecA, vecB, vecC);
			geometry.pushTriangleIndices(count);
			geometry.pushTriangleUVs(uvs[i].clone(), uvs[i + 1].clone(), uvs[i + 2].clone());
			count += 3;
		}

		const objCollision: StructMapElementCollision[] = [];
		const localOffset = new THREE.Vector3(0, yShift, 0);
		const rotatedCenterLocal = new THREE.Vector3(0, yShift, 0);
		Mathf.rotateVertexEuler(rotatedCenterLocal, origin, euler);
		const worldCenter = rotatedCenterLocal.clone().add(localPosition);
		if (this.datas.collisionKind === OBJECT_COLLISION_KIND.SIMPLIFIED) {
			const w = size.x;
			const h = size.y;
			const d = size.z;
			objCollision.push({
				p: position,
				l: localPosition,
				b: [
					worldCenter.x,
					worldCenter.y,
					worldCenter.z,
					w,
					h,
					d,
					position.angleY,
					position.angleX,
					position.angleZ,
				],
				c: localOffset,
				w: Math.ceil(w / 2 / Data.Systems.SQUARE_SIZE),
				h: Math.ceil(h / 2 / Data.Systems.SQUARE_SIZE),
				d: Math.ceil(d / 2 / Data.Systems.SQUARE_SIZE),
				m: Math.max(
					Math.ceil(w / 2 / Data.Systems.SQUARE_SIZE),
					Math.max(Math.ceil(h / 2 / Data.Systems.SQUARE_SIZE), Math.ceil(d / 2 / Data.Systems.SQUARE_SIZE)),
				),
				k: true,
			});
		} else if (this.datas.collisionKind === OBJECT_COLLISION_KIND.CUSTOM) {
			const obj = Data.Shapes.get(CUSTOM_SHAPE_KIND.COLLISIONS, this.datas.collisionCustomID)?.geometry;
			if (obj) {
				const scaleVec = new THREE.Vector3(position.scaleX, position.scaleY, position.scaleZ);
				const w = obj.w * position.scaleX;
				const h = obj.h * position.scaleY;
				const d = obj.d * position.scaleZ;
				const minPos = obj.minVertex.clone().multiply(scaleVec);
				objCollision.push({
					id: this.datas.collisionCustomID,
					p: position,
					l: localPosition,
					b: [
						worldCenter.x + minPos.x + w / 2,
						worldCenter.y + minPos.y + h / 2,
						worldCenter.z + minPos.z + d / 2,
						w,
						h,
						d,
						position.angleY,
						position.angleX,
						position.angleZ,
					],
					c: localOffset,
					w: Math.ceil(w / 2 / Data.Systems.SQUARE_SIZE),
					h: Math.ceil(h / 2 / Data.Systems.SQUARE_SIZE),
					rw: w,
					rh: h,
					d: Math.ceil(d / 2 / Data.Systems.SQUARE_SIZE),
					m: Math.max(
						Math.max(
							Math.ceil(w / 2 / Data.Systems.SQUARE_SIZE),
							Math.ceil(h / 2 / Data.Systems.SQUARE_SIZE),
						),
						Math.ceil(d / 2 / Data.Systems.SQUARE_SIZE),
					),
					k: true,
				});
			}
		}
		return [count, objCollision];
	}

	createGeometry(position: Position): [CustomGeometry, [number, StructMapElementCollision[]]] {
		const geometry = new CustomGeometry();
		const collisions = this.updateGeometry(geometry, position, 0);
		geometry.updateAttributes();
		return [geometry, collisions];
	}
}

export { Object3DProcedural };
