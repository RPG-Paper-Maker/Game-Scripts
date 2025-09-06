/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '..';
import { Utils } from '../Common';
import { Base } from './Base';

/** @class
 *  A troop monster.
 *  @extends Model.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  troop monster
 */
class TroopMonster extends Base {
	public id: number;
	public level: Model.DynamicValue;
	public hidden: Model.DynamicValue;
	public isSpecificPosition: boolean;
	public specificPosition: Model.DynamicValue;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Read the JSON associated to the troop monster.
	 *  @param {Record<string, any>} - json Json object describing the troop
	 *  monster
	 */
	read(json: Record<string, any>) {
		this.id = json.mid;
		this.level = Model.DynamicValue.readOrDefaultNumber(json.l, 1);
		this.hidden = Model.DynamicValue.readOrDefaultSwitch(json.h, false);
		this.isSpecificPosition = Utils.valueOrDefault(json.isSpecificPosition, false);
		this.specificPosition = Model.DynamicValue.readOrDefaultMessage(
			json.specificPosition,
			'new THREE.Vector3(0,0,0)'
		);
	}
}

export { TroopMonster };
