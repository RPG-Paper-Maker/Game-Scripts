/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { CUSTOM_SHAPE_KIND, Paths, Platform, Utils } from '../Common';
import { CustomGeometry } from '../Core';
import { Datas, Manager } from '../index';
import { Base } from './Base';

/** @class
 *  A shape of the game.
 *  @extends Model.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  shape
 *  @param {CustomSHAPE_KIND} [kind=CustomShapeKin] - The kind of custom shape
 */
class Shape extends Base {
	public static loader = new THREE.FileLoader();
	public id: number;
	public kind: CUSTOM_SHAPE_KIND;
	public name: string;
	public isBR: boolean;
	public dlc: string;
	public base64: string;
	public mesh: THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]>;
	public geometry: Record<string, any>;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Get string of custom shape kind.
	 *  @param {CustomSHAPE_KIND} kind - The custom shape kind
	 *  @returns {string}
	 */
	static customSHAPE_KINDToString(kind: CUSTOM_SHAPE_KIND): string {
		switch (kind) {
			case CUSTOM_SHAPE_KIND.OBJ:
				return '.obj';
			case CUSTOM_SHAPE_KIND.MTL:
				return '.mtl';
			case CUSTOM_SHAPE_KIND.COLLISIONS:
				return '.obj collisions';
		}
		return '';
	}

	/**
	 *  Parse the .obj text.
	 *  @param {string } - text
	 *  @returns {Record<string, any>}
	 */
	static parse(text: string): Record<string, any> {
		const object: Record<string, any> = {};
		const vertices = [];
		const normals = [];
		const uvs = [];
		const v = [];
		const t = [];
		let minVertex = new THREE.Vector3();
		let maxVertex = new THREE.Vector3();
		let firstVertex = true;
		const vertex_pattern = /^v\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;
		const normal_pattern = /^vn\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;
		const uv_pattern = /^vt\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;
		const face_pattern =
			/^f\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))(?:\s+((-?\d+)\/(-?\d+)\/(-?\d+)))?/;
		const lines = text.split('\n');
		let arg1: string[],
			arg2: string[],
			arg3: string[],
			temp3D: THREE.Vector3,
			j: number,
			n: number,
			lineList: string[],
			line: string,
			result: string[];
		for (let i = 0; i < lines.length; i++) {
			line = lines[i];
			line = line.trim();
			if (line.length === 0 || line.charAt(0) === '#') {
				continue;
			} else if ((result = vertex_pattern.exec(line)) !== null) {
				// ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
				temp3D = new THREE.Vector3(
					parseFloat(result[1]) * Datas.Systems.SQUARE_SIZE,
					parseFloat(result[2]) * Datas.Systems.SQUARE_SIZE,
					parseFloat(result[3]) * Datas.Systems.SQUARE_SIZE
				);
				v.push(temp3D);
				if (firstVertex) {
					minVertex = temp3D.clone();
					maxVertex = temp3D.clone();
					firstVertex = false;
				} else {
					if (temp3D.x < minVertex.x) {
						minVertex.setX(temp3D.x);
					}
					if (temp3D.y < minVertex.y) {
						minVertex.setY(temp3D.y);
					}
					if (temp3D.z < minVertex.z) {
						minVertex.setZ(temp3D.z);
					}
					if (temp3D.x > maxVertex.x) {
						maxVertex.setX(temp3D.x);
					}
					if (temp3D.y > maxVertex.y) {
						maxVertex.setY(temp3D.y);
					}
					if (temp3D.z > maxVertex.z) {
						maxVertex.setZ(temp3D.z);
					}
				}
			} else if ((result = normal_pattern.exec(line)) !== null) {
				// ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
				normals.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
			} else if ((result = uv_pattern.exec(line)) !== null) {
				// ["vt 0.1 0.2", "0.1", "0.2"]
				t.push(new THREE.Vector2(parseFloat(result[1]), 1.0 - parseFloat(result[2])));
			} else if ((result = face_pattern.exec(line)) !== null) {
				// ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]
				lineList = line.split(' ');
				n = lineList.length - 1;
				arg1 = lineList[1].split('/');
				for (j = 1; j < n - 1; j++) {
					arg2 = lineList[1 + j].split('/');
					arg3 = lineList[2 + j].split('/');
					vertices.push(v[parseInt(arg1[0]) - 1]);
					uvs.push(t[parseInt(arg1[1]) - 1]);
					vertices.push(v[parseInt(arg2[0]) - 1]);
					uvs.push(t[parseInt(arg2[1]) - 1]);
					vertices.push(v[parseInt(arg3[0]) - 1]);
					uvs.push(t[parseInt(arg3[1]) - 1]);
				}
			}
		}
		object.vertices = vertices;
		object.uvs = uvs;
		object.minVertex = minVertex;
		object.maxVertex = maxVertex;
		object.center = new THREE.Vector3(
			(maxVertex.x - minVertex.x) / 2 + minVertex.x,
			(maxVertex.y - minVertex.y) / 2 + minVertex.y,
			(maxVertex.z - minVertex.z) / 2 + minVertex.z
		);
		object.w = maxVertex.x - minVertex.x;
		object.h = maxVertex.y - minVertex.y;
		object.d = maxVertex.z - minVertex.z;
		return object;
	}

	/**
	 *  Get the folder associated to a kind of custom shape.
	 *  @static
	 *  @param {CustomSHAPE_KIND} kind - The kind of custom shape
	 *  @param {boolean} isBR - Indicate if the shape is a BR
	 *  @param {string} dlc - The dlc name
	 *  @returns {string}
	 */
	static getFolder(kind: CUSTOM_SHAPE_KIND, isBR: boolean, dlc: string): string {
		return (
			(isBR ? Datas.Systems.PATH_BR : dlc ? Datas.Systems.PATH_DLCS + '/' + dlc : Platform.ROOT_DIRECTORY) +
			this.getLocalFolder(kind)
		);
	}

	/**
	 *  Get the local folder associated to a kind of custom shape.
	 *  @param {CustomSHAPE_KIND} kind - The kind of custom shape
	 *  @returns {string}
	 */
	static getLocalFolder(kind: CUSTOM_SHAPE_KIND): string {
		switch (kind) {
			case CUSTOM_SHAPE_KIND.OBJ:
				return Paths.OBJ;
			case CUSTOM_SHAPE_KIND.MTL:
				return Paths.MTL;
			case CUSTOM_SHAPE_KIND.COLLISIONS:
				return Paths.OBJ_COLLISIONS;
		}
		return '';
	}

	/**
	 *  Read the JSON associated to the shape
	 *  @param {Record<string, any>} - json Json object describing the shape
	 */
	read(json: Record<string, any>) {
		this.id = json.id;
		this.name = json.name;
		this.isBR = json.br;
		this.dlc = Utils.defaultValue(json.d, '');
		this.base64 = json.base64;
	}

	/**
	 *  Load the .obj.
	 */
	async load() {
		if (this.id !== -1 && !this.geometry) {
			if (this.base64) {
				const base64Data = this.base64.split(',')[1];
				this.geometry = Shape.parse(atob(base64Data));
				this.base64 = '';
			} else {
				const url = this.getPath();
				this.geometry = await new Promise((resolve, reject) => {
					Shape.loader.load(
						url,
						(text: string | ArrayBuffer) => {
							resolve(Shape.parse(<string>text));
						},
						() => {},
						() => {
							const error = 'Could not load ' + url;
							if (Datas.Systems.ignoreAssetsLoadingErrors) {
								console.warn(error);
								resolve({});
							} else {
								Platform.showErrorMessage(error);
							}
						}
					);
				});
				const geometry = new CustomGeometry();
				const vertices = this.geometry.vertices;
				const uvs = this.geometry.uvs;
				let count = 0;
				let vecA: THREE.Vector3, vecB: THREE.Vector3, vecC: THREE.Vector3;
				for (let i = 0, l = this.geometry.vertices.length; i < l; i += 3) {
					vecA = vertices[i].clone();
					vecB = vertices[i + 1].clone();
					vecC = vertices[i + 2].clone();
					geometry.pushTriangleVertices(vecA, vecB, vecC);
					geometry.pushTriangleIndices(count);
					geometry.pushTriangleUVs(uvs[i].clone(), uvs[i + 1].clone(), uvs[i + 2].clone());
					count += 3;
				}
				geometry.updateAttributes();
				this.mesh = new THREE.Mesh(geometry, Manager.Collisions.BB_MATERIAL);
			}
		}
	}

	/**
	 *  Get the absolute path associated to this picture.
	 *  @returns {string}
	 */
	getPath(): string {
		return this.id === -1 ? '' : Shape.getFolder(this.kind, this.isBR, this.dlc) + '/' + this.name;
	}
}

export { Shape };
