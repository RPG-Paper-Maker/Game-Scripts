/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { IO, Paths, Utils, Enum } from "../Common";
import { System, Datas } from "..";
import SongKind = Enum.SongKind;

/** @class
 *  All the battle System datas.
 *  @static
 */
class BattleSystems {

    private static elements: System.Element[];
    private static elementsOrder: number[];
    private static statistics: System.Statistic[];
    public static statisticsOrder: number[];
    public static statisticsElements: number[];
    public static statisticsElementsPercent: number[];
    private static equipments: string[];
    public static equipmentsOrder: number[];
    public static maxEquipmentID: number;
    private static weaponsKind: System.WeaponArmorKind[];
    private static armorsKind: System.WeaponArmorKind[];
    private static battleCommands: number[];
    public static battleCommandsOrder: number[];
    private static battleMaps: System.BattleMap[];
    public static idLevelStatistic: number;
    public static idExpStatistic: number;
    public static formulaIsDead: System.DynamicValue;
    public static formulaCrit: System.DynamicValue;
    public static battleMusic: System.PlaySong;
    public static battleLevelUp: System.PlaySong;
    public static battleVictory: System.PlaySong;
        
    constructor() {
        throw new Error("This is a static class!");
    }

    /** 
     *  Read the JSON file associated to battle System.
     */
    static async read() {
        let json = await IO.parseFileJSON(Paths.FILE_BATTLE_SYSTEM);

        // Elements
        this.elements = [];
        this.elementsOrder = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.elements, []), 
            listIDs: this.elements, listIndexes: this.elementsOrder, indexesIDs: 
            true, cons: System.Element });

        // Statistics
        this.statistics = [];
        this.statisticsOrder = [];
        let maxID = Utils.readJSONSystemList({ list: Utils.defaultValue(json
            .statistics, []), listIDs: this.statistics, listIndexes: this
            .statisticsOrder, indexesIDs: true, cons: System.Statistic });

        // Add elements res to statistics
        this.statisticsElements = [];
        this.statisticsElementsPercent = [];
        let index = this.statisticsOrder.length;
        let id: number, name: string;
        for (let i = 0, l = this.elementsOrder.length; i < l; i++) {
            id = this.elementsOrder[i];
            name = this.elements[id].name();
            this.statistics[maxID + (i * 2) + 1] = System.Statistic
                .createElementRes(id, name);
            this.statistics[maxID + (i * 2) + 2] = System.Statistic
                .createElementResPercent(id, name);
            this.statisticsOrder[index + (i * 2)] = maxID + (i * 2) + 1;
            this.statisticsOrder[index + (i * 2) + 1] = maxID + (i * 2) + 2;
            this.statisticsElements[id] = maxID + (i * 2) + 1;
            this.statisticsElementsPercent[id] = maxID + (i * 2) + 2;
        }

        // Equipments
        this.equipments = [];
        this.equipmentsOrder = [];
        this.maxEquipmentID = Utils.readJSONSystemList({ list: Utils
            .defaultValue(json.equipments, []), listIDs: this.equipments, 
            listIndexes: this.equipmentsOrder, indexesIDs: true, func: (
            jsonEquipment: Record<string, any>) => 
            {
                return jsonEquipment.names[1];
            }
        });
        this.weaponsKind = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.weaponsKind, []
            ), listIDs: this.weaponsKind, cons: System.WeaponArmorKind });

        // Armors kind
        this.armorsKind = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.armorsKind, [])
            , listIDs: this.armorsKind, cons: System.WeaponArmorKind });

        // Battle commands
        this.battleCommands = [];
        this.battleCommandsOrder = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.battleCommands, 
            []), listIDs: this.battleCommands, listIndexes: this
            .battleCommandsOrder, indexesIDs: true, func: (jsonBattleCommand: 
            Record<string, any>) =>
            {
                return jsonBattleCommand.s;
            }
        });

        // Battle maps
        this.battleMaps = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.battleMaps, []), 
            listIDs: this.battleMaps, cons: System.BattleMap });

        // Ids of specific statistics
        this.idLevelStatistic = json.lv;
        this.idExpStatistic = json.xp;

        // Formulas
        this.formulaIsDead = new System.DynamicValue(json.fisdead);
        this.formulaCrit = System.DynamicValue.readOrDefaultMessage(json.fc);

        // Musics
        this.battleMusic = new System.PlaySong(SongKind.Music, json.bmusic);
        this.battleLevelUp = new System.PlaySong(SongKind.Sound, json.blevelup);
        this.battleVictory = new System.PlaySong(SongKind.Music, json.bvictory);
    }

    /** 
     *  Get the statistic corresponding to the level.
     *  @static
     *  @returns {System.Statistic}
     */
    static getLevelStatistic(): System.Statistic {
        return this.statistics[this.idLevelStatistic];
    }

    /** 
     *  Get the statistic corresponding to the experience.
     *  @static
     *  @returns {System.Statistic}
     */
    static getExpStatistic(): System.Statistic {
        let stat = this.statistics[this.idExpStatistic];
        return (Utils.isUndefined(stat) || stat.isRes) ? null : stat;
    }

    /** 
     *  Get the element by ID.
     *  @param {number} id
     *  @returns {System.Element}
     */
    static getElement(id: number): System.Element {
        return Datas.Base.get(id, this.elements, "element");
    }

    /** 
     *  Get the statistic by ID.
     *  @param {number} id
     *  @returns {System.Statistic}
     */
    static getStatistic(id: number): System.Statistic {
        return Datas.Base.get(id, this.statistics, "statistic");
    }

    /** 
     *  Get the equipment by ID.
     *  @param {number} id
     *  @returns {string}
     */
    static getEquipment(id: number): string {
        return Datas.Base.get(id, this.equipments, "equipment");
    }

    /** 
     *  Get the weapon kind by ID.
     *  @param {number} id
     *  @returns {System.WeaponArmorKind}
     */
    static getWeaponKind(id: number): System.WeaponArmorKind {
        return Datas.Base.get(id, this.weaponsKind, "weapon kind");
    }

    /** 
     *  Get the armor kind by ID.
     *  @param {number} id
     *  @returns {System.WeaponArmorKind}
     */
    static getArmorKind(id: number): System.WeaponArmorKind {
        return Datas.Base.get(id, this.armorsKind, "armor kind");
    }

    /** 
     *  Get the battle command by ID.
     *  @param {number} id
     *  @returns {number}
     */
    static getBattleCommand(id: number): number {
        return Datas.Base.get(id, this.battleCommands, "battle command");
    }

    /** 
     *  Get the battle map by ID.
     *  @param {number} id
     *  @returns {System.BattleMap}
     */
    static getBattleMap(id: number): System.BattleMap {
        return Datas.Base.get(id, this.battleMaps, "battle map");
    }
}

export { BattleSystems }