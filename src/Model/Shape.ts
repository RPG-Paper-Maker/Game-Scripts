/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three/webgpu';
import { GLTFLoader } from '../Libs/examples/jsm/loaders/GLTFLoader';
import { CUSTOM_SHAPE_KIND, Paths, Platform, Utils } from '../Common';
import { CustomGeometry } from '../Core';
import { Data, Manager } from '../index';
import { Base } from './Base';

/**
 * JSON structure describing a shape.
 */
export type ShapeJSON = {
	id: number;
	name: string;
	br: boolean;
	d?: string;
	base64?: string;
};

/**
 * Parsed geometry structure returned by Shape.parse.
 */
type ParsedGeometry = {
	vertices: THREE.Vector3[];
	uvs: THREE.Vector2[];
	minVertex: THREE.Vector3;
	maxVertex: THREE.Vector3;
	center: THREE.Vector3;
	w: number;
	h: number;
	d: number;
};

/**
 * A custom shape of the game.
 */
export class Shape extends Base {
	public static loader = new THREE.FileLoader();
	public id: number;
	public kind: CUSTOM_SHAPE_KIND;
	public name: string;
	public isBR: boolean;
	public dlc: string;
	public base64: string;
	public mesh: THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]>;
	public geometry: ParsedGeometry | null = null;
	public gltfScene: THREE.Group | null = null;
	public gltfAnimations: THREE.AnimationClip[] = [];

	constructor(json?: ShapeJSON) {
		super(json);
	}

	/**
	 * Get string extension of a custom shape kind.
	 */
	static customShapeKindToString(kind: CUSTOM_SHAPE_KIND): string {
		switch (kind) {
			case CUSTOM_SHAPE_KIND.OBJ:
				return '.obj';
			case CUSTOM_SHAPE_KIND.MTL:
				return '.mtl';
			case CUSTOM_SHAPE_KIND.COLLISIONS:
				return '.obj collisions';
			case CUSTOM_SHAPE_KIND.GLTF:
				return '.gltf';
		}
		return '';
	}

	/**
	 * Get the folder associated to a kind of custom shape.
	 */
	static getFolder(kind: CUSTOM_SHAPE_KIND, isBR: boolean, dlc: string): string {
		return (
			(isBR ? Data.Systems.PATH_BR + '/' : dlc ? `${Data.Systems.PATH_DLCS}/${dlc}/` : Platform.ROOT_DIRECTORY) +
			this.getLocalFolder(kind)
		);
	}

	/**
	 * Get the local folder associated to a kind of custom shape.
	 */
	static getLocalFolder(kind: CUSTOM_SHAPE_KIND): string {
		switch (kind) {
			case CUSTOM_SHAPE_KIND.OBJ:
				return Paths.OBJ;
			case CUSTOM_SHAPE_KIND.MTL:
				return Paths.MTL;
			case CUSTOM_SHAPE_KIND.COLLISIONS:
				return Paths.OBJ_COLLISIONS;
			case CUSTOM_SHAPE_KIND.GLTF:
				return Paths.GLTF;
		}
		return '';
	}

	/**
	 * Parse the .obj text into vertices, uvs, and bounds.
	 */
	static parse(text: string): ParsedGeometry {
		const vertices: THREE.Vector3[] = [];
		const uvs: THREE.Vector2[] = [];
		const v: THREE.Vector3[] = [];
		const t: THREE.Vector2[] = [];
		let minVertex = new THREE.Vector3();
		let maxVertex = new THREE.Vector3();
		let firstVertex = true;
		const vertexPattern = /^v\s+([\d.+\-eE]+)\s+([\d.+\-eE]+)\s+([\d.+\-eE]+)/;
		const uvPattern = /^vt\s+([\d.+\-eE]+)\s+([\d.+\-eE]+)/;
		const facePattern =
			/^f\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))(?:\s+((-?\d+)\/(-?\d+)\/(-?\d+)))?/;
		for (const rawLine of text.split('\n')) {
			const line = rawLine.trim();
			if (!line || line.startsWith('#')) {
				continue;
			}
			let result: RegExpExecArray | null;
			if ((result = vertexPattern.exec(line))) {
				// ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
				const temp3D = new THREE.Vector3(
					parseFloat(result[1]) * Data.Systems.SQUARE_SIZE,
					parseFloat(result[2]) * Data.Systems.SQUARE_SIZE,
					parseFloat(result[3]) * Data.Systems.SQUARE_SIZE,
				);
				v.push(temp3D);

				if (firstVertex) {
					minVertex = temp3D.clone();
					maxVertex = temp3D.clone();
					firstVertex = false;
				} else {
					minVertex.min(temp3D);
					maxVertex.max(temp3D);
				}
			} else if ((result = uvPattern.exec(line))) {
				// ["vt 0.1 0.2", "0.1", "0.2"]
				t.push(new THREE.Vector2(parseFloat(result[1]), 1.0 - parseFloat(result[2])));
			} else if ((result = facePattern.exec(line))) {
				// ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]
				const parts = line.split(' ');
				for (let j = 1; j < parts.length - 2; j++) {
					const arg1 = parts[1].split('/');
					const arg2 = parts[1 + j].split('/');
					const arg3 = parts[2 + j].split('/');
					vertices.push(v[parseInt(arg1[0]) - 1]);
					uvs.push(t[parseInt(arg1[1]) - 1]);
					vertices.push(v[parseInt(arg2[0]) - 1]);
					uvs.push(t[parseInt(arg2[1]) - 1]);
					vertices.push(v[parseInt(arg3[0]) - 1]);
					uvs.push(t[parseInt(arg3[1]) - 1]);
				}
			}
		}
		return {
			vertices,
			uvs,
			minVertex,
			maxVertex,
			center: new THREE.Vector3(
				(maxVertex.x - minVertex.x) / 2 + minVertex.x,
				(maxVertex.y - minVertex.y) / 2 + minVertex.y,
				(maxVertex.z - minVertex.z) / 2 + minVertex.z,
			),
			w: maxVertex.x - minVertex.x,
			h: maxVertex.y - minVertex.y,
			d: maxVertex.z - minVertex.z,
		};
	}

	/**
	 * Parse a GLTF/GLB buffer into vertices, uvs, and bounds.
	 */
	static async parseGLTF(
		buffer: ArrayBuffer,
		squareSize: number,
	): Promise<{ geometryData: ParsedGeometry; scene: THREE.Group; animations: THREE.AnimationClip[] }> {
		const loader = new GLTFLoader();
		const gltf = await loader.parseAsync(buffer, '');
		const vertices: THREE.Vector3[] = [];
		const uvs: THREE.Vector2[] = [];
		let minVertex = new THREE.Vector3();
		let maxVertex = new THREE.Vector3();
		let firstVertex = true;
		gltf.scene.traverse((child) => {
			if (!(child instanceof THREE.Mesh)) {
				return;
			}
			let geometry = child.geometry as THREE.BufferGeometry;
			if (geometry.index) {
				geometry = geometry.toNonIndexed();
			}
			const posAttr = geometry.getAttribute('position');
			const uvAttr = geometry.getAttribute('uv');
			for (let i = 0; i < posAttr.count; i++) {
				const vertex = new THREE.Vector3(
					posAttr.getX(i) * squareSize,
					posAttr.getY(i) * squareSize,
					posAttr.getZ(i) * squareSize,
				);
				vertices.push(vertex);
				if (uvAttr) {
					uvs.push(new THREE.Vector2(uvAttr.getX(i), 1.0 - uvAttr.getY(i)));
				} else {
					uvs.push(new THREE.Vector2(0, 0));
				}
				if (firstVertex) {
					minVertex = vertex.clone();
					maxVertex = vertex.clone();
					firstVertex = false;
				} else {
					minVertex.min(vertex);
					maxVertex.max(vertex);
				}
			}
		});
		return {
			geometryData: {
				vertices,
				uvs,
				minVertex,
				maxVertex,
				center: new THREE.Vector3(
					(maxVertex.x - minVertex.x) / 2 + minVertex.x,
					(maxVertex.y - minVertex.y) / 2 + minVertex.y,
					(maxVertex.z - minVertex.z) / 2 + minVertex.z,
				),
				w: maxVertex.x - minVertex.x,
				h: maxVertex.y - minVertex.y,
				d: maxVertex.z - minVertex.z,
			},
			scene: gltf.scene,
			animations: gltf.animations ?? [],
		};
	}

	/**
	 *  Load the shape.
	 */
	async load(): Promise<void> {
		if (this.id === -1 || this.geometry) {
			return;
		}
		if (this.kind === CUSTOM_SHAPE_KIND.GLTF) {
			const url = this.getPath();
			try {
				const response = await fetch(url);
				const buffer = await response.arrayBuffer();
				const result = await Shape.parseGLTF(buffer, Data.Systems.SQUARE_SIZE);
				this.geometry = result.geometryData;
				this.gltfScene = result.scene;
				this.gltfAnimations = result.animations;
			} catch {
				const error = `Could not load ${url}`;
				if (Data.Systems.ignoreAssetsLoadingErrors) {
					console.warn(error);
					this.geometry = {
						vertices: [],
						uvs: [],
						minVertex: new THREE.Vector3(),
						maxVertex: new THREE.Vector3(),
						center: new THREE.Vector3(),
						w: 0,
						h: 0,
						d: 0,
					};
				} else {
					Platform.showErrorMessage(error);
				}
			}
		} else if (this.base64) {
			const base64Data = this.base64.split(',')[1];
			this.geometry = Shape.parse(atob(base64Data));
			this.base64 = '';
		} else {
			const url = this.getPath();
			this.geometry = await new Promise<ParsedGeometry>((resolve) => {
				Shape.loader.load(
					url,
					(text: string | ArrayBuffer) => resolve(Shape.parse(text as string)),
					() => {},
					() => {
						const error = `Could not load ${url}`;
						if (Data.Systems.ignoreAssetsLoadingErrors) {
							console.warn(error);
							resolve({
								vertices: [],
								uvs: [],
								minVertex: new THREE.Vector3(),
								maxVertex: new THREE.Vector3(),
								center: new THREE.Vector3(),
								w: 0,
								h: 0,
								d: 0,
							});
						} else {
							Platform.showErrorMessage(error);
						}
					},
				);
			});
		}
		if (this.geometry && this.geometry.vertices.length > 0) {
			const geometry = new CustomGeometry();
			const vertices = this.geometry.vertices;
			const uvs = this.geometry.uvs;
			let count = 0;
			for (let i = 0, l = vertices.length; i < l; i += 3) {
				geometry.pushTriangleVertices(vertices[i].clone(), vertices[i + 1].clone(), vertices[i + 2].clone());
				geometry.pushTriangleIndices(count);
				geometry.pushTriangleUVs(uvs[i].clone(), uvs[i + 1].clone(), uvs[i + 2].clone());
				count += 3;
			}
			geometry.updateAttributes();
			this.mesh = new THREE.Mesh(geometry, Manager.Collisions.BB_MATERIAL);
		}
	}

	/**
	 * Get the absolute path of this shape.
	 */
	getPath(): string {
		return this.id === -1 ? '' : `${Shape.getFolder(this.kind, this.isBR, this.dlc)}/${this.name}`;
	}

	/**
	 * Load the shape as a base64 string when not on desktop and not br.
	 */
	async checkBase64(): Promise<void> {
		if (!Platform.IS_DESKTOP && !this.isBR && Platform.WEB_DEV) {
			this.base64 = await Platform.loadFile(
				`${Platform.ROOT_DIRECTORY.slice(0, -1)}${Shape.getLocalFolder(this.kind)}/${this.name}`,
			);
		}
	}

	/**
	 * Read the JSON associated with the shape.
	 */
	read(json: ShapeJSON): void {
		this.id = json.id;
		this.name = json.name;
		this.isBR = json.br;
		this.dlc = Utils.valueOrDefault(json.d, '');
		this.base64 = json.base64;
	}
}
