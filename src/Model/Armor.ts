/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ITEM_KIND } from '../Common';
import { Data } from '../index';
import { CommonSkillItem } from './CommonSkillItem';
import { WeaponArmorKind } from './WeaponArmorKind';

/**
 * Represents an armor item in the game.
 */
export class Armor extends CommonSkillItem {
	/**
	 * Gets the armor type (as defined in battle system data).
	 * @returns The corresponding {@link WeaponArmorKind}.
	 */
	getType(): WeaponArmorKind {
		return Data.BattleSystems.getArmorKind(this.type);
	}

	/**
	 * Gets the item kind for this armor.
	 * @returns {@link ITEM_KIND.ARMOR}.
	 */
	getKind(): ITEM_KIND {
		return ITEM_KIND.ARMOR;
	}
}
