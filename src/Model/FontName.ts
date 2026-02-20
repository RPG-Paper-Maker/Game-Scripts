/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '..';
import { Constants, Utils } from '../Common';
import { Base } from './Base';
import { DynamicValueJSON } from './DynamicValue';

/**
 * JSON structure describing a font name.
 */
export type FontNameJSON = {
	name: string;
	isBasic?: boolean;
	f?: DynamicValueJSON;
	customFontID?: number;
};

/**
 * A font name of the game.
 */
export class FontName extends Base {
	public name: string;
	public isBasic: boolean;
	public font: Model.DynamicValue;
	public customFontID: number;

	constructor(json?: FontNameJSON) {
		super(json);
	}

	/**
	 * Get the font name (default or custom).
	 */
	getName(): string {
		return this.isBasic ? (this.font.getValue() as string) : this.name;
	}

	/**
	 * Read the JSON associated to the font name.
	 */
	read(json: FontNameJSON) {
		this.name = json.name;
		this.isBasic = Utils.valueOrDefault(json.isBasic, true);
		this.font = Model.DynamicValue.readOrDefaultMessage(json.f, Constants.DEFAULT_FONT_NAME);
		this.customFontID = Utils.valueOrDefault(json.customFontID, 1);
	}
}
