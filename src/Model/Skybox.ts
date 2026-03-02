/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three/webgpu';
import { PICTURE_KIND, Utils } from '../Common';
import { Data, Manager } from '../index';
import { Base } from './Base';

/**
 * JSON structure describing a skybox.
 */
export type SkyboxJSON = {
	fid?: number;
	bid?: number;
	tid?: number;
	boid?: number;
	lid?: number;
	rid?: number;
};

/**
 * A skybox of the game.
 */
export class Skybox extends Base {
	public front: number;
	public back: number;
	public top: number;
	public bot: number;
	public left: number;
	public right: number;

	constructor(json?: SkyboxJSON) {
		super(json);
	}

	/**
	 * Create the textures for the skybox.
	 */
	createTextures(): THREE.MeshPhongNodeMaterial[] {
		return [this.left, this.right, this.top, this.bot, this.front, this.back].map((side) => {
			const texture = Manager.GL.textureLoader.load(Data.Pictures.get(PICTURE_KIND.SKYBOXES, side).getPath());
			texture.wrapS = THREE.RepeatWrapping;
			texture.repeat.x = -1;
			return Manager.GL.createMaterial({
				texture: texture,
				side: THREE.BackSide,
				shadows: false,
				flipY: true,
			});
		});
	}

	/**
	 *  Read the JSON associated to the skybox.
	 */
	read(json: SkyboxJSON) {
		this.front = Utils.valueOrDefault(json.fid, 1);
		this.back = Utils.valueOrDefault(json.bid, 1);
		this.top = Utils.valueOrDefault(json.tid, 1);
		this.bot = Utils.valueOrDefault(json.boid, 1);
		this.left = Utils.valueOrDefault(json.lid, 1);
		this.right = Utils.valueOrDefault(json.rid, 1);
	}
}
