/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform, SONG_KIND, Utils } from '../Common';
import { Datas, Model } from '../index';

/** @class
 *  All the battle System datas.
 *  @static
 */
class BattleSystems {
	private static elements: Model.Element[];
	private static elementsOrder: number[];
	private static statistics: Model.Statistic[];
	public static statisticsOrder: number[];
	private static statisticsElements: number[];
	private static statisticsElementsPercent: number[];
	public static maxStatisticID: number;
	private static equipments: Model.Localization[];
	public static equipmentsOrder: number[];
	public static maxEquipmentID: number;
	private static weaponsKind: Model.WeaponArmorKind[];
	private static armorsKind: Model.WeaponArmorKind[];
	private static battleCommands: number[];
	public static battleCommandsOrder: number[];
	private static battleMaps: Model.BattleMap[];
	public static idLevelStatistic: number;
	public static idExpStatistic: number;
	public static formulaIsDead: Model.DynamicValue;
	public static formulaCrit: Model.DynamicValue;
	public static heroesBattlersCenterOffset: Model.DynamicValue;
	public static heroesBattlersOffset: Model.DynamicValue;
	public static troopsBattlersCenterOffset: Model.DynamicValue;
	public static troopsBattlersOffset: Model.DynamicValue;
	public static battleMusic: Model.PlaySong;
	public static battleLevelUp: Model.PlaySong;
	public static battleVictory: Model.PlaySong;
	public static cameraMoveInBattle: boolean;

	constructor() {
		throw new Error('This is a static class!');
	}

	/**
	 *  Read the JSON file associated to battle Model.
	 */
	static async read() {
		const json = (await Platform.parseFileJSON(Paths.FILE_BATTLE_SYSTEM)) as any;

		// Elements
		this.elements = [];
		this.elementsOrder = [];
		Utils.readJSONSystemList({
			list: Utils.valueOrDefault(json.elements, []),
			listIDs: this.elements,
			listIndexes: this.elementsOrder,
			indexesIDs: true,
			cons: Model.Element,
		});

		// Statistics
		this.statistics = [];
		this.statisticsOrder = [];
		this.maxStatisticID = Utils.readJSONSystemList({
			list: Utils.valueOrDefault(json.statistics, []),
			listIDs: this.statistics,
			listIndexes: this.statisticsOrder,
			indexesIDs: true,
			cons: Model.Statistic,
		});

		// Add elements res to statistics
		this.statisticsElements = [];
		this.statisticsElementsPercent = [];
		const index = this.statisticsOrder.length;
		let id: number, name: string, i: number, l: number;
		for (i = 0, l = this.elementsOrder.length; i < l; i++) {
			id = this.elementsOrder[i];
			name = this.elements[id].name();
			this.statistics[this.maxStatisticID + i * 2 + 1] = Model.Statistic.createElementRes(id);
			this.statistics[this.maxStatisticID + i * 2 + 2] = Model.Statistic.createElementResPercent(id, name);
			this.statisticsOrder[index + i * 2] = this.maxStatisticID + i * 2 + 1;
			this.statisticsOrder[index + i * 2 + 1] = this.maxStatisticID + i * 2 + 2;
			this.statisticsElements[id] = this.maxStatisticID + i * 2 + 1;
			this.statisticsElementsPercent[id] = this.maxStatisticID + i * 2 + 2;
		}
		this.maxStatisticID += l * 2;

		// Equipments
		this.equipments = [];
		this.equipmentsOrder = [];
		this.maxEquipmentID = Utils.readJSONSystemList({
			list: Utils.valueOrDefault(json.equipments, []),
			listIDs: this.equipments,
			listIndexes: this.equipmentsOrder,
			indexesIDs: true,
			cons: Model.Localization,
		});
		this.weaponsKind = [];
		Utils.readJSONSystemList({
			list: Utils.valueOrDefault(json.weaponsKind, []),
			listIDs: this.weaponsKind,
			cons: Model.WeaponArmorKind,
		});

		// Armors kind
		this.armorsKind = [];
		Utils.readJSONSystemList({
			list: Utils.valueOrDefault(json.armorsKind, []),
			listIDs: this.armorsKind,
			cons: Model.WeaponArmorKind,
		});

		// Battle commands
		this.battleCommands = [];
		this.battleCommandsOrder = [];
		Utils.readJSONSystemList({
			list: Utils.valueOrDefault(json.battleCommands, []),
			listIDs: this.battleCommands,
			listIndexes: this.battleCommandsOrder,
			indexesIDs: true,
			func: (jsonBattleCommand: Record<string, any>) => {
				return jsonBattleCommand.s;
			},
		});

		// Battle maps
		this.battleMaps = [];
		Utils.readJSONSystemList({
			list: Utils.valueOrDefault(json.battleMaps, []),
			listIDs: this.battleMaps,
			cons: Model.BattleMap,
		});

		// Ids of specific statistics
		this.idLevelStatistic = json.lv;
		this.idExpStatistic = json.xp;

		// Formulas
		this.formulaIsDead = new Model.DynamicValue(json.fisdead);
		this.formulaCrit = Model.DynamicValue.readOrDefaultMessage(json.fc);
		this.heroesBattlersCenterOffset = Model.DynamicValue.readOrDefaultMessage(
			json.heroesBattlersCenterOffset,
			'new THREE.Vector3(2 * Datas.Systems.SQUARE_SIZE, 0, -Datas.Systems.SQUARE_SIZE)'
		);
		this.heroesBattlersOffset = Model.DynamicValue.readOrDefaultMessage(
			json.heroesBattlersOffset,
			'new THREE.Vector3(i * Datas.Systems.SQUARE_SIZE / 2, 0, i * Datas.Systems.SQUARE_SIZE)'
		);
		this.troopsBattlersCenterOffset = Model.DynamicValue.readOrDefaultMessage(
			json.troopsBattlersCenterOffset,
			'new THREE.Vector3(-2 * Datas.Systems.SQUARE_SIZE, 0, -Datas.Systems.SQUARE_SIZE)'
		);
		this.troopsBattlersOffset = Model.DynamicValue.readOrDefaultMessage(
			json.troopsBattlersOffset,
			'new THREE.Vector3(-i * Datas.Systems.SQUARE_SIZE * 3 / 4, 0, i * Datas.Systems.SQUARE_SIZE)'
		);

		// Musics
		this.battleMusic = new Model.PlaySong(SONG_KIND.MUSIC, json.bmusic);
		this.battleLevelUp = new Model.PlaySong(SONG_KIND.SOUND, json.blevelup);
		this.battleVictory = new Model.PlaySong(SONG_KIND.MUSIC, json.bvictory);

		// Options
		this.cameraMoveInBattle = Utils.valueOrDefault(json.cmib, true);
	}

	/**
	 *  Get the statistic corresponding to the level.
	 *  @static
	 *  @returns {System.Statistic}
	 */
	static getLevelStatistic(): Model.Statistic {
		return this.statistics[this.idLevelStatistic];
	}

	/**
	 *  Get the statistic corresponding to the experience.
	 *  @static
	 *  @returns {System.Statistic}
	 */
	static getExpStatistic(): Model.Statistic {
		const stat = this.statistics[this.idExpStatistic];
		return stat === undefined || stat.isRes ? null : stat;
	}

	/**
	 *  Get the element by ID.
	 *  @param {number} id
	 *  @returns {System.Element}
	 */
	static getElement(id: number): Model.Element {
		return Datas.Base.get(id, this.elements, 'element');
	}

	/**
	 *  Get the statistic by ID.
	 *  @param {number} id
	 *  @returns {System.Statistic}
	 */
	static getStatistic(id: number): Model.Statistic {
		return Datas.Base.get(id, this.statistics, 'statistic');
	}

	/**
	 *  Get the statistic element by ID.
	 *  @param {number} id
	 *  @returns {number}
	 */
	static getStatisticElement(id: number): number {
		return Datas.Base.get(id, this.statisticsElements, 'statistic element');
	}

	/**
	 *  Get the statistic element percent by ID.
	 *  @param {number} id
	 *  @returns {System.Statistic}
	 */
	static getStatisticElementPercent(id: number): number {
		return Datas.Base.get(id, this.statisticsElementsPercent, 'statistic element percent');
	}

	/**
	 *  Get the equipment by ID.
	 *  @param {number} id
	 *  @returns {System.Localization}
	 */
	static getEquipment(id: number): Model.Localization {
		return Datas.Base.get(id, this.equipments, 'equipment');
	}

	/**
	 *  Get the weapon kind by ID.
	 *  @param {number} id
	 *  @returns {System.WeaponArmorKind}
	 */
	static getWeaponKind(id: number): Model.WeaponArmorKind {
		return Datas.Base.get(id, this.weaponsKind, 'weapon kind');
	}

	/**
	 *  Get the armor kind by ID.
	 *  @param {number} id
	 *  @returns {System.WeaponArmorKind}
	 */
	static getArmorKind(id: number): Model.WeaponArmorKind {
		return Datas.Base.get(id, this.armorsKind, 'armor kind');
	}

	/**
	 *  Get the battle command by ID.
	 *  @param {number} id
	 *  @returns {number}
	 */
	static getBattleCommand(id: number): number {
		return Datas.Base.get(id, this.battleCommands, 'battle command');
	}

	/**
	 *  Get the battle map by ID.
	 *  @param {number} id
	 *  @returns {System.BattleMap}
	 */
	static getBattleMap(id: number): Model.BattleMap {
		return Datas.Base.get(id, this.battleMaps, 'battle map');
	}
}

export { BattleSystems };
