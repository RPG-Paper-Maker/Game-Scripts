/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform, Utils } from '../Common';
import { Data, Model } from '../index';

/** @class
 *  All the videos datas.
 *  @static
 */
class Videos {
	private static list: Model.Video[];

	constructor() {
		throw new Error('This is a static class!');
	}

	/**
	 *  Read the JSON file associated to videos
	 */
	static async read() {
		const json = (await Platform.parseFileJSON(Paths.FILE_VIDEOS)).list as any;
		this.list = [];
		Utils.readJSONSystemList({ list: json, listIDs: this.list, cons: Model.Video });
		if (!Platform.IS_DESKTOP) {
			for (const video of this.list) {
				if (video) {
					video.base64 = await Platform.loadFile(
						Platform.ROOT_DIRECTORY.slice(0, -1) + Model.Video.getLocalFolder() + '/' + video.name
					);
				}
			}
		}
	}

	/**
	 *  Get the corresponding video.
	 *  @param {number} id
	 *  @returns {System.Video}
	 */
	static get(id: number): Model.Video {
		return id === -1 ? new Model.Video() : Data.Base.get(id, this.list, 'video');
	}
}

export { Videos };
