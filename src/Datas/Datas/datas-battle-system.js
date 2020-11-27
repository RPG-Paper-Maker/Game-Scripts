/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *   All the battle System datas
 *   @property {Element[]} elements List of all the elements by ID
 *   @property {Element[]} elementsOrder List of all the elements by index
 *   @property {SystemStatistic[]} statistics List of all the statistics by ID
 *   @property {SystemStatistic[]} statistics List of all the statistics by index
 *   @property {SystemStatistic[]} statisticsElements List of all the statistics
 *   elements
 *   @property {SystemStatistic[]} statisticsElementsPercent List of all the
 *   statistics elements percents
 *   @property {string[]} equipments List of all the equipments name by ID
 *   @property {string[]} equipmentsOrder List of all the equipments name by
 *   index
 *   @property {number} maxEquipmentID Max equipment ID in the list
 *   @property {SystemWeaponArmorKind[]} weaponsKind List of all the weapons
 *   kind by ID
 *   @property {SystemWeaponArmorKind[]} armorsKind List of all the armors kind
 *   by ID
 *   @property {number[]} battleCommands List of all the battle commands (skill
 *   ID) by ID
 *   @property {number[]} battleCommandsOrder List of all the battle commands (
 *   skill ID) by index
 *   @property {BattleMap[]} battleMaps List of all the battle maps by ID
 *   @property {number} idLevelStatistic Id of the level statistic
 *   @property {number} idExpStatistic Id of the experience statistic
 *   @property {SystemValue} formulaIsDead The formula is dead
 *   @property {SystemValue} formulaCrit The formula for critical hit
 *   @property {SystemPlaySong} battleMusic The battle music
 *   @property {SystemPlaySong} battleLevelUp The battle level up music
 *   @property {SystemPlaySong} battleVictory The battle victory music
 */
class DatasBattleSystem {
    constructor() {

    }

    // -------------------------------------------------------
    /** Read the JSON file associated to battle System.
     */
    async read() {
        let json = await RPM.parseFileJSON(RPM.FILE_BATTLE_SYSTEM);

        // Elements
        this.elements = []
        this.elementsOrder = [];
        RPM.readJSONSystemListByIDIndex(json.elements, this.elements, this
            .elementsOrder, Element);

        // Statistics
        this.statistics = [];
        this.statisticsOrder = [];
        let maxID = RPM.readJSONSystemListByIDIndex(json.statistics, this
            .statistics, this.statisticsOrder, SystemStatistic);

        // Add elements res to statistics
        this.statisticsElements = [];
        this.statisticsElementsPercent = [];
        let id, name, index = this.statisticsOrder.length;
        for (let i = 0, l = this.elementsOrder.length; i < l; i++) {
            id = this.elementsOrder[i];
            name = this.elements[id].name;
            this.statistics[maxID + (i * 2) + 1] = SystemStatistic
                .createElementRes(id, name);
            this.statistics[maxID + (i * 2) + 2] = SystemStatistic
                .createElementResPercent(id, name);
            this.statisticsOrder[index + (i * 2)] = maxID + (i * 2) + 1;
            this.statisticsOrder[index + (i * 2) + 1] = maxID + (i * 2) + 2;
            this.statisticsElements[id] = maxID + (i * 2) + 1;
            this.statisticsElementsPercent[id] = maxID + (i * 2) + 2;
        }

        // Equipments
        this.equipments = [];
        this.equipmentsOrder = [];
        this.maxEquipmentID = RPM.readJSONSystemListByIDIndex(json.equipments,
            this.equipments, this.equipmentsOrder, (jsonEquipment) => {
                return jsonEquipment.names[1];
            }, false
        );

        // Weapons kind
        this.weaponsKind = RPM.readJSONSystemList(json.weaponsKind,
            SystemWeaponArmorKind);

        // Armors kind
        this.armorsKind = RPM.readJSONSystemList(json.armorsKind,
            SystemWeaponArmorKind);

        // Battle commands
        this.battleCommands = [];
        this.battleCommandsOrder = [];
        RPM.readJSONSystemListByIDIndex(json.battleCommands, this.battleCommands
            , this.battleCommandsOrder, (jsonBattleCommand) => {
                return jsonBattleCommand.s;
            }, false
        );

        // Battle maps
        this.battleMaps = RPM.readJSONSystemList(json.battleMaps,
            BattleMap);

        // Ids of specific statistics
        this.idLevelStatistic = json.lv;
        this.idExpStatistic = json.xp;

        // Formulas
        this.formulaIsDead = new DynamicValue(json.fisdead);
        this.formulaCrit = DynamicValue.readOrDefaultMessage(json.fc);

        // Musics
        this.battleMusic = new PlaySong(SongKind.Music, json.bmusic);
        this.battleLevelUp = new PlaySong(SongKind.Sound, json.blevelup);
        this.battleVictory = new PlaySong(SongKind.Music, json.bvictory);
    }

    // -------------------------------------------------------

    /** Get the statistic corresponding to the level
     *   @returns {SystemStatistic}
     */
    getLevelStatistic() {
        return this.statistics[this.idLevelStatistic];
    }

    // -------------------------------------------------------

    /** Get the statistic corresponding to the experience
     *   @returns {SystemStatistic}
     */
    getExpStatistic() {
        let stat = this.statistics[this.idExpStatistic];
        return (RPM.isUndefined(stat) || stat.isRes) ? null : stat;
    }
}