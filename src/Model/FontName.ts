/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '..';
import { Constants, Utils } from '../Common';
import { Base } from './Base';

/** @class
 *  A font name of the game.
 *  @extends Model.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  font name
 */
class FontName extends Base {
	public name: string;
	public isBasic: boolean;
	public font: Model.DynamicValue;
	public customFontID: number;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Read the JSON associated to the font name.
	 *  @param {Record<string, any>} - json Json object describing the font name
	 */
	read(json: Record<string, any>) {
		this.name = json.name;
		this.isBasic = Utils.valueOrDefault(json.isBasic, true);
		this.font = Model.DynamicValue.readOrDefaultMessage(json.f, Constants.DEFAULT_FONT_NAME);
		this.customFontID = Utils.valueOrDefault(json.customFontID, 1);
	}

	/**
	 *  Get the font name (default or custom).
	 *  @returns {string}
	 */
	getName(): string {
		return this.isBasic ? this.font.getValue() : this.name;
	}
}

export { FontName };
