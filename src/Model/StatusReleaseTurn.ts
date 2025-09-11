/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { OPERATION_KIND, Utils } from '../Common';
import { Base } from './Base';
import { DynamicValue, DynamicValueJSON } from './DynamicValue';

/**
 * JSON structure for a status release turn condition.
 */
export type StatusReleaseTurnJSON = {
	operationTurnKind?: OPERATION_KIND;
	turn?: DynamicValueJSON;
	chance?: DynamicValueJSON;
};

/**
 * A possible status release turn condition for a hero.
 */
export class StatusReleaseTurn extends Base {
	public operationTurnKind: OPERATION_KIND;
	public turn: DynamicValue;
	public chance: DynamicValue;

	constructor(json?: StatusReleaseTurnJSON) {
		super(json);
	}

	/**
	 * Read JSON into this status release turn.
	 */
	read(json: StatusReleaseTurnJSON): void {
		this.operationTurnKind = Utils.valueOrDefault(json.operationTurnKind, OPERATION_KIND.GREATER_THAN_OR_EQUAL_TO);
		this.turn = DynamicValue.readOrDefaultNumber(json.turn, 1);
		this.chance = DynamicValue.readOrDefaultNumberDouble(json.chance);
	}
}
