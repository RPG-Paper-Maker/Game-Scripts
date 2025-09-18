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
import { Data } from '../index';
import { Picture, PictureJSON } from '../Model';

/** @class
 *   All the pictures datas.
 *   @static
 */
class Pictures {
	private static list: Map<number, Map<number, Picture>>;

	/**
	 *  Read the JSON file associated to pictures.
	 *  @static
	 *  @async
	 */
	static async read() {
		const json = (await Platform.parseFileJSON(Paths.FILE_PICTURES)).list as any;
		const l = json.length;
		this.list = new Map();
		let k: number,
			j: number,
			m: number,
			n: number,
			id: number,
			jsonHash: Record<string, any>,
			jsonList: PictureJSON[],
			jsonPicture: PictureJSON,
			picture: Picture;
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
			const list = new Map<number, Picture>();
			for (j = 0; j < n + 1 + (k === PICTURE_KIND.CHARACTERS ? 1 : 0); j++) {
				jsonPicture = jsonList[j];
				if (jsonPicture) {
					id = jsonPicture.id;
					picture = new Picture(jsonPicture);
					picture.kind = k;
					if (!Platform.IS_DESKTOP && !picture.isBR) {
						picture.base64 = await Platform.loadFile(
							Platform.ROOT_DIRECTORY.slice(0, -1) +
								Picture.getLocalFolder(picture.kind) +
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
						list.set(id, picture);
					}
				}
			}
			this.list.set(k, list);
		}
	}

	/**
	 *  Get the corresponding picture.
	 *  @param {PICTURE_KIND} kind - The picture kind
	 *  @param {number} id - The picture id
	 *  @returns {Picture}
	 */
	static get(kind: PICTURE_KIND, id: number): Picture {
		return kind === PICTURE_KIND.NONE || id === -1
			? new Picture()
			: Data.Base.get(id, this.list.get(kind), 'picture ' + Picture.pictureKindToString(kind));
	}

	/**
	 *  Get the corresponding picture list by kind.
	 *  @param {PICTURE_KIND} kind - The picture kind
	 *  @returns {Picture}
	 */
	static getListByKind(kind: PICTURE_KIND): Map<number, Picture> {
		return this.list.get(kind);
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
