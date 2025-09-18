/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Paths, PICTURE_KIND, Platform, Utils } from '../Common';
import { Data, Manager } from '../index';
import { Picture, Tileset } from '../Model';

/** @class
 *  All the tilesets datas.
 *  @static
 */
class Tilesets {
	public static PROPERTY_TEXTURES_CHARACTERS = 'texturesCharacters';
	public static PROPERTY_TEXTURES_BATTLERS = 'texturesBattlers';
	private static list: Map<number, Tileset>;
	public static texturesCharacters: THREE.MeshPhongMaterial[];
	public static texturesBattlers: THREE.MeshPhongMaterial[];

	constructor() {
		throw new Error('This is a static class!');
	}

	/**
	 *  Read the JSON file associated to tilesets.
	 */
	static async read() {
		const json = (await Platform.parseFileJSON(Paths.FILE_TILESETS)).list as any;
		this.list = Utils.readJSONMap(json, Tileset);
		await this.loadPictures(PICTURE_KIND.CHARACTERS, Data.Tilesets.PROPERTY_TEXTURES_CHARACTERS);
		await this.loadPictures(PICTURE_KIND.BATTLERS, Data.Tilesets.PROPERTY_TEXTURES_BATTLERS);
	}

	/**
	 *  Get the tileset by ID.
	 *  @static
	 *  @param {number} id
	 *  @returns {System.Tileset}
	 */
	static get(id: number): Tileset {
		return Data.Base.get(id, this.list, 'tileset');
	}

	/**
	 *  Load pictures.
	 *  @param {PICTURE_KIND} pictureKind - The picture kind
	 *  @param {string} texturesName - The field name textures
	 */
	static async loadPictures(pictureKind: PICTURE_KIND, texturesName: string) {
		const pictures = Data.Pictures.getListByKind(pictureKind);
		const textures = new Array(pictures.size);
		textures[0] = Manager.GL.loadTextureEmpty();
		let picture: Picture, path: string;
		for (let i = 1; i < pictures.size; i++) {
			picture = pictures.get(i);
			if (picture) {
				path = picture.getPath();
				textures[i] = path ? await Manager.GL.loadTexture(path) : Manager.GL.loadTextureEmpty();
			} else {
				textures[i] = Manager.GL.loadTextureEmpty();
			}
		}
		this[texturesName] = textures;
	}
}

export { Tilesets };
