/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ITEM_KIND } from '../Common';
import { Datas, Model } from '../index';
import { Armor } from './Armor';

/** @class
 *  A weapon of the game.
 *  @extends Model.Armor
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  weapon
 */
class Weapon extends Armor {
	constructor(json?: Record<string, any>) {
		super(json as any);
	}

	/**
	 *  Get the weapon kind.
	 *  @returns {System/WeaponArmorKind}
	 */
	getType(): Model.WeaponArmorKind {
		return Datas.BattleSystems.getWeaponKind(this.type);
	}

	/**
	 *  Get the item kind.
	 *  @returns {ITEM_KIND}
	 */
	getKind(): ITEM_KIND {
		return ITEM_KIND.WEAPON;
	}
}

export { Weapon };
