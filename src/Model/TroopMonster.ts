/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../Common';
import { Base } from './Base';
import { DynamicValue, DynamicValueJSON } from './DynamicValue';

/**
 * JSON structure for a troop monster.
 */
export type TroopMonsterJSON = {
	mid?: number;
	l?: DynamicValueJSON;
	h?: DynamicValueJSON;
	isSpecificPosition?: boolean;
	specificPosition?: DynamicValueJSON;
};

/**
 * A troop monster definition.
 */
export class TroopMonster extends Base {
	public id: number;
	public level: DynamicValue;
	public hidden: DynamicValue;
	public isSpecificPosition: boolean;
	public specificPosition: DynamicValue;

	constructor(json?: TroopMonsterJSON) {
		super(json);
	}

	/**
	 * Read JSON into this troop monster.
	 */
	read(json: TroopMonsterJSON): void {
		this.id = json.mid;
		this.level = DynamicValue.readOrDefaultNumber(json.l, 1);
		this.hidden = DynamicValue.readOrDefaultSwitch(json.h, false);
		this.isSpecificPosition = Utils.valueOrDefault(json.isSpecificPosition, false);
		this.specificPosition = DynamicValue.readOrDefaultMessage(json.specificPosition, 'new THREE.Vector3(0,0,0)');
	}
}
