/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { IO, Paths, Utils, Enum } from "../Common/index.js";
import { System, Datas } from "../index.js";
var SongKind = Enum.SongKind;
/** @class
 *  All the battle System datas.
 *  @property {Element[]} elements List of all the elements by ID
 *  @property {Element[]} elementsOrder List of all the elements by index
 *  @property {SystemStatistic[]} statistics List of all the statistics by ID
 *  @property {SystemStatistic[]} statistics List of all the statistics by index
 *  @property {SystemStatistic[]} statisticsElements List of all the statistics
 *  elements
 *  @property {SystemStatistic[]} statisticsElementsPercent List of all the
 *  statistics elements percents
 *  @property {string[]} equipments List of all the equipments name by ID
 *  @property {string[]} equipmentsOrder List of all the equipments name by
 *  index
 *  @property {number} maxEquipmentID Max equipment ID in the list
 *  @property {SystemWeaponArmorKind[]} weaponsKind List of all the weapons
 *  kind by ID
 *  @property {SystemWeaponArmorKind[]} armorsKind List of all the armors kind
 *  by ID
 *  @property {number[]} battleCommands List of all the battle commands (skill
 *  ID) by ID
 *  @property {number[]} battleCommandsOrder List of all the battle commands (
 *  skill ID) by index
 *  @property {SystemBattleMap[]} battleMaps List of all the battle maps by ID
 *  @property {number} idLevelStatistic Id of the level statistic
 *  @property {number} idExpStatistic Id of the experience statistic
 *  @property {SystemValue} formulaIsDead The formula is dead
 *  @property {SystemValue} formulaCrit The formula for critical hit
 *  @property {SystemPlaySong} battleMusic The battle music
 *  @property {SystemPlaySong} battleLevelUp The battle level up music
 *  @property {SystemPlaySong} battleVictory The battle victory music
 */
class BattleSystems {
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
        Utils.readJSONSystemList({ list: json.elements, listIDs: this.elements,
            listIndexes: this.elementsOrder, cons: System.Element });
        // Statistics
        this.statistics = [];
        this.statisticsOrder = [];
        let maxID = Utils.readJSONSystemList({ list: json.statistics, listIDs: this.statistics, listIndexes: this.statisticsOrder, cons: System
                .Statistic });
        // Add elements res to statistics
        this.statisticsElements = [];
        this.statisticsElementsPercent = [];
        let index = this.statisticsOrder.length;
        let id, name;
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
        this.maxEquipmentID = Utils.readJSONSystemList({ list: json.equipments,
            listIDs: this.equipments, listIndexes: this.equipmentsOrder, func: (jsonEquipment) => {
                return jsonEquipment.names[1];
            }
        });
        SongKind;
        Utils.readJSONSystemList({ list: json.weapons, listIDs: this.weaponsKind,
            cons: System.WeaponArmorKind });
        // Armors kind
        this.armorsKind = [];
        Utils.readJSONSystemList({ list: json.armorsKind, listIDs: this
                .armorsKind, cons: System.WeaponArmorKind });
        // Battle commands
        this.battleCommands = [];
        this.battleCommandsOrder = [];
        Utils.readJSONSystemList({ list: json.battleCommands, listIDs: this
                .battleCommands, listIndexes: this.battleCommandsOrder, func: (jsonBattleCommand) => {
                return jsonBattleCommand.s;
            }
        });
        // Battle maps
        this.battleMaps = [];
        Utils.readJSONSystemList({ list: json.battleMaps, listIDs: this
                .battleMaps, cons: System.BattleMap });
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
    static getLevelStatistic() {
        return this.statistics[this.idLevelStatistic];
    }
    /**
     *  Get the statistic corresponding to the experience.
     *  @static
     *  @returns {System.Statistic}
     */
    static getExpStatistic() {
        let stat = this.statistics[this.idExpStatistic];
        return (Utils.isUndefined(stat) || stat.isRes) ? null : stat;
    }
    /**
     *  Get the element by ID.
     *  @param {number} id
     *  @returns {System.Element}
     */
    static getElement(id) {
        return Datas.Base.get(id, this.elements, "element");
    }
    /**
     *  Get the statistic by ID.
     *  @param {number} id
     *  @returns {System.Statistic}
     */
    static getStatistic(id) {
        return Datas.Base.get(id, this.statistics, "statistic");
    }
    /**
     *  Get the equipment by ID.
     *  @param {number} id
     *  @returns {string}
     */
    static getEquipment(id) {
        return Datas.Base.get(id, this.equipments, "equipment");
    }
    /**
     *  Get the weapon kind by ID.
     *  @param {number} id
     *  @returns {System.WeaponArmorKind}
     */
    static getWeaponKind(id) {
        return Datas.Base.get(id, this.weaponsKind, "weapon kind");
    }
    /**
     *  Get the armor kind by ID.
     *  @param {number} id
     *  @returns {System.WeaponArmorKind}
     */
    static getArmorKind(id) {
        return Datas.Base.get(id, this.armorsKind, "armor kind");
    }
    /**
     *  Get the battle command by ID.
     *  @param {number} id
     *  @returns {number}
     */
    static getBattleCommand(id) {
        return Datas.Base.get(id, this.battleCommands, "battle command");
    }
    /**
     *  Get the battle map by ID.
     *  @param {number} id
     *  @returns {System.BattleMap}
     */
    static getBattleMap(id) {
        return Datas.Base.get(id, this.battleMaps, "battle map");
    }
}
export { BattleSystems };
