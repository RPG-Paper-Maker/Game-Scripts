/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ITEM_KIND } from '../Common';
import { Battler } from '../Core';
import { Datas } from '../index';
import { CommonSkillItem } from './CommonSkillItem';

/**
 * Represents a consumable or usable item in the game.
 * Items are skill-like objects that can be used in battle or on the map.
 */
export class Item extends CommonSkillItem {
	/**
	 * Retrieves the display type name of this item (e.g., "Potion", "Elixir").
	 * @returns {string} The localized item type name.
	 */
	getStringType(): string {
		return Datas.Systems.getItemType(this.type).name();
	}

	/**
	 * Retrieves the kind of this object.
	 * Always returns {@link ITEM_KIND.ITEM}.
	 * @returns {ITEM_KIND} The constant value {@link ITEM_KIND.ITEM}.
	 */
	getKind(): ITEM_KIND {
		return ITEM_KIND.ITEM;
	}

	/**
	 * Builds the battle message shown when this item is used.
	 * Replaces placeholders `[user]` and `[item]` in the template.
	 * @param {Battler} user - The battler using the item.
	 * @returns {string} The formatted battle message.
	 */
	getMessage(user: Battler): string {
		return this.battleMessage.name().replace('[user]', user.player.name).replace('[item]', this.name());
	}
}
