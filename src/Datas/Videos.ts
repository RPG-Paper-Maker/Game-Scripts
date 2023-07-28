/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Platform, Paths, Utils } from '../Common';
import { System, Datas } from '../index';

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
