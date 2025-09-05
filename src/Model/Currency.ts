/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '..';
import { Icon } from './Icon';

/** @class
 *  A currency of the game.
 *  @extends {System.Icon}
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  currency
 */
class Currency extends Icon {
	public displayInMenu: Model.DynamicValue;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Read the JSON associated to the cost.
	 *  @param {Record<string, any>} - json Json object describing the cost
	 */
	read(json: Record<string, any>) {
		super.read(json);
		this.displayInMenu = Model.DynamicValue.readOrDefaultSwitch(json.dim, true);
	}
}

export { Currency };
