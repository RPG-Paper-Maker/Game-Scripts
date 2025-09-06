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
 * Extends {@link Localization} to support translatable names.
 */
export class Icon extends Localization {
	/** The ID of the picture representing this icon. */
	public pictureID: number;

	/** The X index in the picture sheet. */
	public pictureIndexX: number;

	/** The Y index in the picture sheet. */
	public pictureIndexY: number;

	constructor(json?: IconJSON) {
		super(json);
	}

	/**
	 * Reads the JSON data describing the icon.
	 * @param json - The JSON object containing the icon data.
	 */
	read(json: IconJSON): void {
		super.read(json);
		this.pictureID = json.pid;
		this.pictureIndexX = Utils.valueOrDefault(json.pictureIndexX, 0);
		this.pictureIndexY = Utils.valueOrDefault(json.pictureIndexY, 0);
	}
}
