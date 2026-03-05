/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three/webgpu';
import { Manager } from '../index';
import { CustomGeometry } from './CustomGeometry';
import { StructMapElementCollision } from './MapElement';
import { Mountain } from './Mountain';
import { Position } from './Position';
import { TextureBundle } from './TextureBundle';

/** @class
 *  The wrapper class for handle mountains sharing the same texture.
 *  @param {TextureBundle} texture
 */
class Mountains {
	public bundle: TextureBundle;
	public width: number;
	public height: number;
	public geometry: CustomGeometry;
	public count: number;
	public mesh: THREE.Mesh;

	constructor(bundle: TextureBundle) {
		this.bundle = bundle;
		const { width, height } = Manager.GL.getMaterialTextureSize(bundle.material);
		this.width = width;
		this.height = height;
		this.geometry = new CustomGeometry();
		this.count = 0;
		this.mesh = null;
	}

	/**
	 *  Update the geometry of the mountains according to a mountain.
	 *  @param {Position} position - The position
	 *  @param {Mountain} mountain - The moutain to update
	 *  @param {number} pictureID - The current mountain picture ID
	 */
	updateGeometry(position: Position, mountain: Mountain, pictureID: number): StructMapElementCollision[] {
		const res = mountain.updateGeometry(this.geometry, this.bundle, position, pictureID, this.count);
		this.count = res[0];
		return res[1];
	}

	/**
	 *  Create a mesh with material and geometry.
	 *  @returns {boolean}
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

export { Mountains };
