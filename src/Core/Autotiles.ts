/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Manager } from '../index';
import { Autotile } from './Autotile';
import { CustomGeometry } from './CustomGeometry';
import { StructMapElementCollision } from './MapElement';
import { Position } from './Position';
import { TextureBundle } from './TextureBundle';

/**
 * A group of autotiles that share the same {@link TextureBundle}.
 * Provides geometry aggregation and mesh creation for rendering.
 */
export class Autotiles {
	public static COUNT_LIST = 5;
	public static LIST_A = ['A1', 'A2', 'A3', 'A4', 'A5'];
	public static LIST_B = ['B1', 'B2', 'B3', 'B4', 'B5'];
	public static LIST_C = ['C1', 'C2', 'C3', 'C4', 'C5'];
	public static LIST_D = ['D1', 'D2', 'D3', 'D4', 'D5'];
	public static AUTOTILE_BORDER = {
		A1: 2,
		B1: 3,
		C1: 6,
		D1: 7,
		A2: 8,
		B4: 9,
		A4: 10,
		B2: 11,
		C5: 12,
		D3: 13,
		C3: 14,
		D5: 15,
		A5: 16,
		B3: 17,
		A3: 18,
		B5: 19,
		C2: 20,
		D4: 21,
		C4: 22,
		D2: 23,
	};

	public bundle: TextureBundle;
	public width: number;
	public height: number;
	public geometry: CustomGeometry;
	public mesh: THREE.Mesh;
	public index: number;

	constructor(bundle: TextureBundle) {
		this.bundle = bundle;
		const { width, height } = Manager.GL.getMaterialTextureSize(bundle.material);
		this.width = width;
		this.height = height;
		this.geometry = new CustomGeometry();
		this.mesh = null;
		this.index = 0;
	}

	/**
	 * Update the geometry with a new autotile instance at a given position.
	 * @param position - The autotile’s position in the map grid.
	 * @param autotile - The autotile instance to update geometry for.
	 * @param pictureID - The picture ID used to resolve autotile textures.
	 */
	updateGeometry(position: Position, autotile: Autotile, pictureID: number): StructMapElementCollision {
		return this.width === null || this.height === 0
			? null
			: autotile.updateGeometryAutotile(
					this.geometry,
					this.bundle,
					position,
					this.width,
					this.height,
					pictureID,
					this.index++
			  );
	}

	/**
	 * Create a mesh from the current geometry and material.
	 * @returns `true` if the mesh was successfully created, `false` if geometry is empty.
	 */
	createMesh(): boolean {
		if (this.geometry.isEmpty()) {
			return false;
		}
		this.geometry.updateAttributes();
		this.mesh = new THREE.Mesh(this.geometry, this.bundle.material);
		return true;
	}
}
