/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../Common';
import { Player } from '../Core';
import { Base } from './Base';
import { HeroTroopBattleTestEquipment, HeroTroopBattleTestEquipmentJSON } from './HeroTroopBattleTestEquipment';

/**
 * JSON structure describing a hero troop battle test.
 */
export type HeroTroopBattleTestJSON = {
	heroID?: number;
	level?: number;
	equipments?: HeroTroopBattleTestEquipmentJSON[];
};

/**
 * A hero troop battle test.
 */
export class HeroTroopBattleTest extends Base {
	public heroID: number;
	public level: number;
	public equipments: HeroTroopBattleTestEquipment[];

	constructor(json?: HeroTroopBattleTestJSON) {
		super(json);
	}

	/**
	 * Equip all the test equipments to a player.
	 */
	equip(player: Player): void {
		for (const equipment of this.equipments) {
			equipment.equip(player);
		}
	}

	/**
	 * Read the JSON associated to the hero troop battle test.
	 */
	read(json: HeroTroopBattleTestJSON): void {
		this.heroID = Utils.valueOrDefault(json.heroID, 1);
		this.level = Utils.valueOrDefault(json.level, 1);
		this.equipments = Utils.readJSONList(json.equipments, HeroTroopBattleTestEquipment);
	}
}
