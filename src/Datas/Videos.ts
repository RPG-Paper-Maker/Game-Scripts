/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants, Paths, Platform, Utils } from '../Common';
import { Datas, System } from '../index';

/** @class
 *  All the videos datas.
 *  @static
 */
class Videos {
	private static list: System.Video[];

	constructor() {
		throw new Error('This is a static class!');
	}

	/**
	 *  Read the JSON file associated to videos
	 */
	static async read() {
		let json = (await Platform.parseFileJSON(Paths.FILE_VIDEOS)).list;
		this.list = [];
		Utils.readJSONSystemList({ list: json, listIDs: this.list, cons: System.Video });
		if (Platform.WEB_DEV) {
			for (const video of this.list) {
				if (video) {
					video.base64 = await Platform.loadFile(
						Platform.ROOT_DIRECTORY.slice(0, -1) +
							System.Video.getLocalFolder() +
							Constants.STRING_SLASH +
							video.name
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
	static get(id: number): System.Video {
		return id === -1 ? new System.Video() : Datas.Base.get(id, this.list, 'video');
	}
}

export { Videos };
