/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Paths, PICTURE_KIND, Platform } from '../Common';
import { Datas, Manager, Model } from '../index';

/** @class
 *  All the tilesets datas.
 *  @static
 */
class Tilesets {
	public static PROPERTY_TEXTURES_CHARACTERS = 'texturesCharacters';
	public static PROPERTY_TEXTURES_BATTLERS = 'texturesBattlers';
	private static list: Model.Tileset[];
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
		const l = json.length;
		this.list = new Array(l + 1);

		// Sorting all the tilesets according to the ID
		let i: number, jsonTileset: Record<string, any>, tileset: Model.Tileset;
		for (i = 0; i < l; i++) {
			jsonTileset = json[i];
			tileset = new Model.Tileset(jsonTileset);
			this.list[jsonTileset.id] = tileset;
		}
		await this.loadPictures(PICTURE_KIND.CHARACTERS, Datas.Tilesets.PROPERTY_TEXTURES_CHARACTERS);
		await this.loadPictures(PICTURE_KIND.BATTLERS, Datas.Tilesets.PROPERTY_TEXTURES_BATTLERS);
	}

	/**
	 *  Get the tileset by ID.
	 *  @static
	 *  @param {number} id
	 *  @returns {System.Tileset}
	 */
	static get(id: number): Model.Tileset {
		return Datas.Base.get(id, this.list, 'tileset');
	}

	/**
	 *  Load pictures.
	 *  @param {PICTURE_KIND} pictureKind - The picture kind
	 *  @param {string} texturesName - The field name textures
	 */
	static async loadPictures(pictureKind: PICTURE_KIND, texturesName: string) {
		const pictures = Datas.Pictures.getListByKind(pictureKind);
		const l = pictures.length;
		const textures = new Array(l);
		textures[0] = Manager.GL.loadTextureEmpty();
		let picture: Model.Picture, path: string;
		for (let i = 1; i < l; i++) {
			picture = pictures[i];
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
