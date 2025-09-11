/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../Common';
import { Localization, LocalizationJSON } from './Localization';

/**
 * JSON schema for an icon.
 */
export type IconJSON = LocalizationJSON & {
	pid: number;
	pictureIndexX?: number;
	pictureIndexY?: number;
};

/**
 * Represents an icon, including picture ID and indices.
 */
export class Icon extends Localization {
	public pictureID: number;
	public pictureIndexX: number;
	public pictureIndexY: number;

	constructor(json?: IconJSON) {
		super(json);
	}

	/**
	 * Reads the JSON data describing the icon.
	 */
	read(json: IconJSON): void {
		super.read(json);
		this.pictureID = json.pid;
		this.pictureIndexX = Utils.valueOrDefault(json.pictureIndexX, 0);
		this.pictureIndexY = Utils.valueOrDefault(json.pictureIndexY, 0);
	}
}
