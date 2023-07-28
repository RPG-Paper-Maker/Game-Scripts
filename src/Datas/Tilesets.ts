/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Platform, Paths, Enum } from '../Common';
import { System, Datas, Manager } from '../index';
import PictureKind = Enum.PictureKind;

/** @class
 *  All the tilesets datas.
 *  @static
 */
class Tilesets {
	public static PROPERTY_TEXTURES_CHARACTERS = 'texturesCharacters';
	public static PROPERTY_TEXTURES_BATTLERS = 'texturesBattlers';
	private static list: System.Tileset[];
	public static texturesCharacters: THREE.MeshPhongMaterial[];
	public static texturesBattlers: THREE.MeshPhongMaterial[];

	constructor() {
		throw new Error('This is a static class!');
	}

	/**
	 *  Read the JSON file associated to tilesets.
	 */
	static async read() {
		let json = (await Platform.parseFileJSON(Paths.FILE_TILESETS)).list;
		let l = json.length;
		this.list = new Array(l + 1);

		// Sorting all the tilesets according to the ID
		let i: number, jsonTileset: Record<string, any>, tileset: System.Tileset;
		for (i = 0; i < l; i++) {
			jsonTileset = json[i];
			tileset = new System.Tileset(jsonTileset);
			this.list[jsonTileset.id] = tileset;
		}
		await this.loadPictures(PictureKind.Characters, Datas.Tilesets.PROPERTY_TEXTURES_CHARACTERS);
		await this.loadPictures(PictureKind.Battlers, Datas.Tilesets.PROPERTY_TEXTURES_BATTLERS);
	}

	/**
	 *  Get the tileset by ID.
	 *  @static
	 *  @param {number} id
	 *  @returns {System.Tileset}
	 */
	static get(id: number): System.Tileset {
		return Datas.Base.get(id, this.list, 'tileset');
	}

	/**
	 *  Load pictures.
	 *  @param {PictureKind} pictureKind - The picture kind
	 *  @param {string} texturesName - The field name textures
	 */
	static async loadPictures(pictureKind: PictureKind, texturesName: string) {
		let pictures = Datas.Pictures.getListByKind(pictureKind);
		let l = pictures.length;
		let textures = new Array(l);
		textures[0] = Manager.GL.loadTextureEmpty();
		let picture: System.Picture, path: string;
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
