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
import { Base } from './Base';

/**
 * JSON structure for a video.
 */
export type VideoJSON = {
	id?: number;
	name?: string;
	br?: boolean;
	d?: string; // DLC name
	base64?: string;
};

/**
 * A video resource in the game.
 */
export class Video extends Base {
	public id: number;
	public name: string;
	public isBR: boolean;
	public dlc: string;
	public base64: string;

	constructor(json?: VideoJSON) {
		super(json);
	}

	/**
	 * Get the folder associated to videos.
	 * @param isBR - Indicate if the video is a BR
	 * @param dlc - The DLC name
	 */
	static getFolder(isBR: boolean, dlc: string): string {
		return (
			(isBR ? Data.Systems.PATH_BR : dlc ? `${Data.Systems.PATH_DLCS}/${dlc}` : Platform.ROOT_DIRECTORY) +
			this.getLocalFolder()
		);
	}

	/**
	 * Get the local folder associated to videos.
	 */
	static getLocalFolder(): string {
		return Paths.VIDEOS;
	}

	/**
	 * Get the absolute path associated to this video.
	 */
	getPath(): string {
		if (this.base64) {
			return this.base64;
		}
		return this.id === -1 ? '' : Video.getFolder(this.isBR, this.dlc) + '/' + this.name;
	}

	/**
	 * Read JSON into this video.
	 */
	read(json: VideoJSON): void {
		this.id = Utils.valueOrDefault(json.id, -1);
		this.name = Utils.valueOrDefault(json.name, '');
		this.isBR = Utils.valueOrDefault(json.br, false);
		this.dlc = Utils.valueOrDefault(json.d, '');
		this.base64 = Utils.valueOrDefault(json.base64, '');
	}
}
