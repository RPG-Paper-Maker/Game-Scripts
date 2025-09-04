/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, PICTURE_KIND, Platform } from '../Common';
import { Picture2D } from '../Core';
import { Datas, System } from '../index';

/** @class
 *   All the pictures datas.
 *   @static
 */
class Pictures {
	private static list: System.Picture[][];

	constructor() {
		throw new Error('This is a static class!');
	}

	/**
	 *  Read the JSON file associated to pictures.
	 *  @static
	 *  @async
	 */
	static async read() {
		const json = (await Platform.parseFileJSON(Paths.FILE_PICTURES)).list as any;
		const l = json.length;
		this.list = new Array(l);
		let k: number,
			j: number,
			m: number,
			n: number,
			id: number,
			jsonHash: Record<string, any>,
			jsonList: Record<string, any>[],
			jsonPicture: Record<string, any>,
			list: System.Picture[],
			picture: System.Picture;
		for (let i = 0; i < l; i++) {
			jsonHash = json[i];
			k = jsonHash.k;
			jsonList = jsonHash.v;

			// Get the max ID
			m = jsonList.length;
			n = 0;
			for (j = 0; j < m; j++) {
				jsonPicture = jsonList[j];
				id = jsonPicture.id;
				if (id > n) {
					n = id;
				}
			}
			// Fill the pictures list
			list = new Array(n + 1);
			for (j = 0; j < n + 1 + (k === PICTURE_KIND.CHARACTERS ? 1 : 0); j++) {
				jsonPicture = jsonList[j];
				if (jsonPicture) {
					id = jsonPicture.id;
					picture = new System.Picture(jsonPicture, k);
					if (!Platform.IS_DESKTOP && !picture.isBR) {
						picture.base64 = await Platform.loadFile(
							Platform.ROOT_DIRECTORY.slice(0, -1) +
								System.Picture.getLocalFolder(picture.kind) +
								'/' +
								picture.name
						);
					}
					if (
						k === PICTURE_KIND.ICONS ||
						k === PICTURE_KIND.PICTURES ||
						k === PICTURE_KIND.FACESETS ||
						k === PICTURE_KIND.ANIMATIONS ||
						k === PICTURE_KIND.BATTLERS ||
						k === PICTURE_KIND.BARS
					) {
						await picture.load();
						if (k === PICTURE_KIND.BARS) {
							picture.checkBarBorder();
						}
					}
					if (id !== 0) {
						if (id === -1) {
							id = 0;
						}
						list[id] = picture;
					}
				}
			}
			this.list[k] = list;
		}
	}

	/**
	 *  Get the corresponding picture.
	 *  @param {PICTURE_KIND} kind - The picture kind
	 *  @param {number} id - The picture id
	 *  @returns {Picture}
	 */
	static get(kind: PICTURE_KIND, id: number): System.Picture {
		return kind === PICTURE_KIND.NONE || id === -1
			? new System.Picture()
			: Datas.Base.get(id, this.list[kind], 'picture ' + System.Picture.pictureKindToString(kind));
	}

	/**
	 *  Get the corresponding picture list by kind.
	 *  @param {PICTURE_KIND} kind - The picture kind
	 *  @returns {Picture}
	 */
	static getListByKind(kind: PICTURE_KIND): System.Picture[] {
		return this.list[kind];
	}

	/** Get a copy of the picture 2D.
	 *   @param {PICTURE_KIND} kind - The picture kind
	 *   @param {number} id - The picture id
	 *   @returns {Picture2D}
	 */
	static getPictureCopy(kind: PICTURE_KIND, id: number): Picture2D {
		const picture = this.get(kind, id);
		return picture && picture.picture ? picture.picture.createCopy() : new Picture2D();
	}
}

export { Pictures };
