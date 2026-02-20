/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '..';
import { DynamicValueJSON } from './DynamicValue';
import { Icon, IconJSON } from './Icon';

/**
 * JSON structure describing a currency.
 */
export type CurrencyJSON = IconJSON & {
	dim?: DynamicValueJSON;
};

/**
 * A currency of the game.
 */
export class Currency extends Icon {
	public displayInMenu: Model.DynamicValue;

	constructor(json?: CurrencyJSON) {
		super(json);
	}

	/**
	 * Read the JSON associated to the currency.
	 */
	read(json: CurrencyJSON) {
		super.read(json);
		this.displayInMenu = Model.DynamicValue.readOrDefaultSwitch(json.dim, true);
	}
}
