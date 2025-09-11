/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Localization, LocalizationJSON } from './Localization';

/**
 * JSON structure for a weapon/armor kind.
 */
export type WeaponArmorKindJSON = LocalizationJSON & {
	equipment: boolean[];
};

/**
 * A weapon/armor kind in the game.
 */
export class WeaponArmorKind extends Localization {
	public equipments: boolean[];

	constructor(json?: WeaponArmorKindJSON) {
		super(json);
	}

	/**
	 * Read JSON into this weapon/armor kind.
	 */
	read(json: WeaponArmorKindJSON): void {
		super.read(json);
		this.equipments = json.equipment;
		this.equipments.unshift(false);
	}
}
