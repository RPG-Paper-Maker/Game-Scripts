/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform, SONG_KIND, Utils } from '../Common';
import { JsonType } from '../Common/Types';
import { Data } from '../index';
import {
	BattleMap,
	DynamicValue,
	DynamicValueJSON,
	Element,
	Localization,
	PlaySong,
	PlaySongJSON,
	Statistic,
	WeaponArmorKind,
} from '../Model';

/**
 * JSON structure for BattleSystems.
 */
export type BattleSystemsJSON = {
	elements: Record<string, JsonType>[];
	statistics: Record<string, JsonType>[];
	equipments: Record<string, JsonType>[];
	weaponsKind: Record<string, JsonType>[];
	armorsKind: Record<string, JsonType>[];
	battleCommands: { s: number }[];
	battleMaps: Record<string, JsonType>[];
	lv: number;
	xp: number;
	fisdead: DynamicValueJSON;
	fc: DynamicValueJSON;
	heroesBattlersCenterOffset?: DynamicValueJSON;
	heroesBattlersOffset?: DynamicValueJSON;
	troopsBattlersCenterOffset?: DynamicValueJSON;
	troopsBattlersOffset?: DynamicValueJSON;
	bmusic: PlaySongJSON;
	blevelup: PlaySongJSON;
	bvictory: PlaySongJSON;
	cmib?: boolean;
};

/**
 * Handles all battle system data.
 */
export class BattleSystems {
	private static elements: Map<number, Element>;
	private static statistics: Map<number, Statistic>;
	public static statisticsIDs: number[];
	private static statisticsElements: Map<number, number>;
	private static statisticsElementsPercent: Map<number, number>;
	public static maxStatisticID: number;
	private static equipments: Map<number, Localization>;
	public static equipmentsIDs: number[];
	public static maxEquipmentID: number;
	private static weaponsKind: Map<number, WeaponArmorKind>;
	private static armorsKind: Map<number, WeaponArmorKind>;
	private static battleCommands: Map<number, number>;
	public static battleCommandsIDs: number[];
	private static battleMaps: Map<number, BattleMap>;
	public static idLevelStatistic: number;
	public static idExpStatistic: number;
	public static formulaIsDead: DynamicValue;
	public static formulaCrit: DynamicValue;
	public static heroesBattlersCenterOffset: DynamicValue;
	public static heroesBattlersOffset: DynamicValue;
	public static troopsBattlersCenterOffset: DynamicValue;
	public static troopsBattlersOffset: DynamicValue;
	public static battleMusic: PlaySong;
	public static battleLevelUp: PlaySong;
	public static battleVictory: PlaySong;
	public static cameraMoveInBattle: boolean;

	/** Get the statistic corresponding to the level. */
	static getLevelStatistic(): Statistic {
		return this.getStatistic(this.idLevelStatistic);
	}

	/** Get the statistic corresponding to the experience. */
	static getExpStatistic(): Statistic {
		const stat = this.getStatistic(this.idExpStatistic);
		return stat === undefined || stat.isRes ? null : stat;
	}

	/** Get an element by ID. */
	static getElement(id: number): Element {
		return Data.Base.get(id, this.elements, 'element');
	}

	/** Get a statistic by ID. */
	static getStatistic(id: number): Statistic {
		return Data.Base.get(id, this.statistics, 'statistic');
	}

	/** Get the statistic element by ID. */
	static getStatisticElement(id: number): number {
		return Data.Base.get(id, this.statisticsElements, 'statistic element');
	}

	/** Get the statistic element percent by ID. */
	static getStatisticElementPercent(id: number): number {
		return Data.Base.get(id, this.statisticsElementsPercent, 'statistic element percent');
	}

	/** Get an equipment by ID. */
	static getEquipment(id: number): Localization {
		return Data.Base.get(id, this.equipments, 'equipment');
	}

	/** Get a weapon kind by ID. */
	static getWeaponKind(id: number): WeaponArmorKind {
		return Data.Base.get(id, this.weaponsKind, 'weapon kind');
	}

	/** Get an armor kind by ID. */
	static getArmorKind(id: number): WeaponArmorKind {
		return Data.Base.get(id, this.armorsKind, 'armor kind');
	}

	/** Get a battle command by ID. */
	static getBattleCommand(id: number): number {
		return Data.Base.get(id, this.battleCommands, 'battle command');
	}

	/** Get a battle map by ID. */
	static getBattleMap(id: number): BattleMap {
		return Data.Base.get(id, this.battleMaps, 'battle map');
	}

	/**
	 * Read the JSON file associated with battle system.
	 */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_BATTLE_SYSTEM)) as BattleSystemsJSON;

		const elementsIDs = [];
		this.elements = Utils.readJSONMap(json.elements, Element, elementsIDs);
		this.statisticsIDs = [];
		this.statistics = Utils.readJSONMap(json.statistics, Statistic, this.statisticsIDs);
		this.maxStatisticID = Utils.getMapMaxID(this.statistics);
		this.equipmentsIDs = [];
		this.equipments = Utils.readJSONMap(json.equipments, Localization, this.equipmentsIDs);
		this.maxEquipmentID = Utils.getMapMaxID(this.equipments);
		this.weaponsKind = Utils.readJSONMap(json.weaponsKind, WeaponArmorKind);
		this.armorsKind = Utils.readJSONMap(json.armorsKind, WeaponArmorKind);
		this.battleCommandsIDs = [];
		this.battleCommands = Utils.readJSONMap(
			json.battleCommands,
			(jsonBattleCommand: { s: number }) => jsonBattleCommand.s,
			this.battleCommandsIDs
		);
		this.battleMaps = Utils.readJSONMap(json.battleMaps, BattleMap);

		// Add elements res to statistics
		this.statisticsElements = new Map();
		this.statisticsElementsPercent = new Map();
		const index = this.statisticsIDs.length;
		for (const [i, id] of elementsIDs.entries()) {
			const element = this.elements.get(id);
			this.statistics.set(this.maxStatisticID + i * 2 + 1, Statistic.createElementRes(id));
			this.statistics.set(this.maxStatisticID + i * 2 + 2, Statistic.createElementResPercent(id, element.name()));
			this.statisticsIDs[index + i * 2] = this.maxStatisticID + i * 2 + 1;
			this.statisticsIDs[index + i * 2 + 1] = this.maxStatisticID + i * 2 + 2;
			this.statisticsElements.set(id, this.maxStatisticID + i * 2 + 1);
			this.statisticsElementsPercent.set(id, this.maxStatisticID + i * 2 + 2);
		}
		this.maxStatisticID += elementsIDs.length * 2;

		// Ids of specific statistics
		this.idLevelStatistic = json.lv;
		this.idExpStatistic = json.xp;

		// Formulas
		this.formulaIsDead = new DynamicValue(json.fisdead);
		this.formulaCrit = DynamicValue.readOrDefaultMessage(json.fc);
		this.heroesBattlersCenterOffset = DynamicValue.readOrDefaultMessage(
			json.heroesBattlersCenterOffset,
			'new THREE.Vector3(2 * Data.Systems.SQUARE_SIZE, 0, -Data.Systems.SQUARE_SIZE)'
		);
		this.heroesBattlersOffset = DynamicValue.readOrDefaultMessage(
			json.heroesBattlersOffset,
			'new THREE.Vector3(i * Data.Systems.SQUARE_SIZE / 2, 0, i * Data.Systems.SQUARE_SIZE)'
		);
		this.troopsBattlersCenterOffset = DynamicValue.readOrDefaultMessage(
			json.troopsBattlersCenterOffset,
			'new THREE.Vector3(-2 * Data.Systems.SQUARE_SIZE, 0, -Data.Systems.SQUARE_SIZE)'
		);
		this.troopsBattlersOffset = DynamicValue.readOrDefaultMessage(
			json.troopsBattlersOffset,
			'new THREE.Vector3(-i * Data.Systems.SQUARE_SIZE * 3 / 4, 0, i * Data.Systems.SQUARE_SIZE)'
		);

		// Musics
		this.battleMusic = new PlaySong(SONG_KIND.MUSIC, json.bmusic);
		this.battleLevelUp = new PlaySong(SONG_KIND.SOUND, json.blevelup);
		this.battleVictory = new PlaySong(SONG_KIND.MUSIC, json.bvictory);

		// Options
		this.cameraMoveInBattle = Utils.valueOrDefault(json.cmib, true);
	}
}
