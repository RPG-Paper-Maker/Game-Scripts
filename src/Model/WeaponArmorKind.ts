/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Localization } from './Localization';

/** @class
 *  A weapon/armor kind of the game.
 *  @extends Model.Localization
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  weapon / armor kind
 */
class WeaponArmorKind extends Localization {
	public equipments: boolean[];

	constructor(json?: Record<string, any>) {
		super(json as any);
	}

	/**
	 *  Read the JSON associated to the weapon / armor kind.
	 *  @param {Record<string, any>} - json Json object describing the weapon /
	 *  armor kind
	 */
	read(json: Record<string, any>) {
		super.read(json as any);
		this.equipments = json.equipment;
		this.equipments.unshift(false);
	}
}

export { WeaponArmorKind };
