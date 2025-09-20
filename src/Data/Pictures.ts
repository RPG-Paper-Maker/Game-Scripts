/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Manager } from '..';
import { Paths, PICTURE_KIND, Platform } from '../Common';
import { Picture2D } from '../Core';
import { Picture, PictureJSON } from '../Model';
import { Base } from './Base';

/**
 * JSON structure for Pictures.
 */
export type PicturesJSON = {
	list: {
		k: PICTURE_KIND;
		v: PictureJSON[];
	}[];
};

/**
 * Handles all picture data.
 */
export class Pictures {
	private static PROPERTY_TEXTURES_CHARACTERS = 'texturesCharacters';
	private static PROPERTY_TEXTURES_BATTLERS = 'texturesBattlers';
	private static list: Map<PICTURE_KIND, Map<number, Picture>>;
	public static texturesCharacters: Map<number, THREE.MeshPhongMaterial>;
	public static texturesBattlers: Map<number, THREE.MeshPhongMaterial>;

	/**
	 * Get a picture by kind and ID.
	 */
	static get(kind: PICTURE_KIND, id: number, errorMessage?: string): Picture {
		if (kind === PICTURE_KIND.NONE || id === -1) {
			return new Picture();
		}
		return Base.get(id, this.list.get(kind), `picture ${Picture.pictureKindToString(kind)}`, true, errorMessage);
	}

	/**
	 * Get all pictures of a given kind.
	 */
	static getListByKind(kind: PICTURE_KIND): Map<number, Picture> {
		return this.list.get(kind);
	}

	/**
	 * Get a copy of a 2D picture.
	 */
	static getPictureCopy(kind: PICTURE_KIND, id: number): Picture2D {
		const picture = this.get(kind, id);
		return picture?.picture ? picture.picture.createCopy() : new Picture2D();
	}

	/**
	 *  Load textures (for characters and battlers).
	 */
	static async loadTextures(pictureKind: PICTURE_KIND, texturesName: string) {
		const pictures = this.getListByKind(pictureKind);
		const textures = new Map<number, THREE.MeshPhongMaterial>();
		textures.set(0, Manager.GL.loadTextureEmpty());
		for (const [id, picture] of pictures.entries()) {
			if (picture) {
				const path = picture.getPath();
				textures.set(id, path ? await Manager.GL.loadTexture(path) : Manager.GL.loadTextureEmpty());
			} else {
				textures.set(id, Manager.GL.loadTextureEmpty());
			}
		}
		this[texturesName] = textures;
	}

	/**
	 * Read the JSON file associated with pictures.
	 */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_PICTURES)) as PicturesJSON;
		this.list = new Map();
		for (const jsonHash of json.list) {
			const k = jsonHash.k;
			const jsonList = jsonHash.v;
			const list = new Map<number, Picture>();
			for (const jsonPicture of jsonList) {
				const id = jsonPicture.id ?? 0;
				const picture = new Picture(jsonPicture);
				picture.kind = k;
				await picture.checkBase64();
				if (
					[
						PICTURE_KIND.ICONS,
						PICTURE_KIND.PICTURES,
						PICTURE_KIND.FACESETS,
						PICTURE_KIND.ANIMATIONS,
						PICTURE_KIND.BATTLERS,
						PICTURE_KIND.BARS,
					].includes(k)
				) {
					await picture.load();
					if (k === PICTURE_KIND.BARS) {
						picture.checkBarBorder();
					}
				}
				list.set(id, picture);
			}
			this.list.set(k, list);
		}
		await this.loadTextures(PICTURE_KIND.CHARACTERS, this.PROPERTY_TEXTURES_CHARACTERS);
		await this.loadTextures(PICTURE_KIND.BATTLERS, this.PROPERTY_TEXTURES_BATTLERS);
	}
}
