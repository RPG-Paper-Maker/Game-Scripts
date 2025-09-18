/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform, Utils } from '../Common';
import { Data } from '../index';
import { Video } from '../Model';

/** @class
 *  All the videos datas.
 *  @static
 */
class Videos {
	private static list: Map<number, Video>;

	/**
	 *  Read the JSON file associated to videos
	 */
	static async read() {
		const json = (await Platform.parseFileJSON(Paths.FILE_VIDEOS)).list as any;
		this.list = Utils.readJSONMap(json, Video);
		if (!Platform.IS_DESKTOP) {
			for (const video of this.list.values()) {
				video.base64 = await Platform.loadFile(
					Platform.ROOT_DIRECTORY.slice(0, -1) + Video.getLocalFolder() + '/' + video.name
				);
			}
		}
	}

	/**
	 *  Get the corresponding video.
	 *  @param {number} id
	 *  @returns {System.Video}
	 */
	static get(id: number): Video {
		return id === -1 ? new Video() : Data.Base.get(id, this.list, 'video');
	}
}

export { Videos };
