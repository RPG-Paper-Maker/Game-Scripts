/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '..';
import { OPERATION_KIND, Utils } from '../Common';
import { Base } from './Base';

/** @class
 *  A possible status release turn condition hero.
 *  @extends Model.Base
 *  @param {Record<string, any>} - json Json object describing the object state
 */
class StatusReleaseTurn extends Base {
	public operationTurnKind: OPERATION_KIND;
	public turn: Model.DynamicValue;
	public chance: Model.DynamicValue;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Read the JSON associated to the status release turn.
	 *  @param {Record<string, any>} - json Json object describing the status
	 *  release turn
	 */
	read(json: Record<string, any>) {
		this.operationTurnKind = Utils.defaultValue(json.operationTurnKind, OPERATION_KIND.GREATER_THAN_OR_EQUAL_TO);
		this.turn = Model.DynamicValue.readOrDefaultNumber(json.turn, 1);
		this.chance = Model.DynamicValue.readOrDefaultNumberDouble(json.chance);
	}
}

export { StatusReleaseTurn };
