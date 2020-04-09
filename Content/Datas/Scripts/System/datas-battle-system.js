/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS DatasBattleSystem
//
// -------------------------------------------------------

/** @class
*   All the battle system datas.
*   @property {SystemStatistic[]} statistics List of all the statistics.
*   @property {string[]} equipments List of all the equipments name.
*   @property {SystemElement[]} elements List of all the elements.
*   @property {SystemWeaponArmorKind[]} weaponsKind List of all the weapons
*   kind.
*   @property {SystemWeaponArmorKind[]} armorsKind List of all the armors kind.
*   @property {number[]} battleCommands List of all the battle
*   commands (skill ID).
*   @property {number} idLevelStatistic Id of the level statistic.
*   @property {number} idExpStatistic Id of the experience statistic.
*/
function DatasBattleSystem(){
    this.read();
}

DatasBattleSystem.prototype = {

    /** Read the JSON file associated to battle system.
    */
    read: function(){
        RPM.openFile(this, RPM.FILE_BATTLE_SYSTEM, true, function(res){
            var json = JSON.parse(res);
            var i, l, id, maxID, index, name;

            // Elements
            var jsonElements = json.elements;
            l = jsonElements.length;
            this.elements = new Array(l+1);
            this.elementsOrder = new Array(l);
            for (i = 0; i < l; i++){
                var jsonElement = jsonElements[i];
                id = jsonElement.id;
                var element = new SystemElement();
                element.readJSON(jsonElement);
                this.elements[id] = element;
                this.elementsOrder[i] = id;
            }

            // Statistics
            var jsonStatistics = json.statistics;
            l = jsonStatistics.length;
            this.statistics = [];
            this.statisticsOrder = new Array(l);
            this.statisticsElements = [];
            this.statisticsElementsPercent = [];
            maxID = 0;
            for (index = 0; index < l; index++){
                var jsonStatistic = jsonStatistics[index];
                id = jsonStatistic.id;
                var statistic = new SystemStatistic();
                statistic.readJSON(jsonStatistic);
                this.statistics[id] = statistic;
                this.statisticsOrder[index] = id;
                if (id > maxID) {
                    maxID = id;
                }
            }
            // Add elements res to statistics
            for (i = 0, l = this.elementsOrder.length; i < l; i++) {
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
            var jsonEquipments = json.equipments;
            l = jsonEquipments.length;
            this.equipments = new Array(l+1);
            this.equipmentsOrder = new Array(l);
            for (i = 0; i < l; i++){
                var jsonEquipment = jsonEquipments[i];
                id = jsonEquipment.id;
                this.equipments[id] = jsonEquipment.names[1];
                this.equipmentsOrder[i] = id;
            }

            // Weapons kind
            var jsonWeaponsKind = json.weaponsKind;
            l = jsonWeaponsKind.length;
            this.weaponsKind = new Array(l+1);
            for (i = 0; i < l; i++){
                var jsonWeaponKind = jsonWeaponsKind[i];
                id = jsonWeaponKind.id;
                var weaponKind = new SystemWeaponArmorKind();
                weaponKind.readJSON(jsonWeaponKind);
                this.weaponsKind[id] = weaponKind;
            }

            // Armors kind
            var jsonArmorsKind = json.armorsKind;
            l = jsonArmorsKind.length;
            this.armorsKind = new Array(l+1);
            for (i = 0; i < l; i++){
                var jsonArmorKind = jsonArmorsKind[i];
                id = jsonArmorKind.id;
                var armorKind = new SystemWeaponArmorKind();
                armorKind.readJSON(jsonArmorKind);
                this.armorsKind[id] = armorKind;
            }

            // Battle commands
            var jsonBattleCommands = json.battleCommands;
            l = jsonBattleCommands.length;
            this.battleCommands = new Array(l+1);
            this.battleCommandsOrder = new Array(l);
            for (i = 0; i < l; i++){
                var jsonBattleCommand = jsonBattleCommands[i];
                id = jsonBattleCommand.id;
                this.battleCommands[id] = jsonBattleCommand.s;
                this.battleCommandsOrder[i] = jsonBattleCommand.s;
            }

            // Battle maps
            var jsonBattleMaps = json.battleMaps;
            l = jsonBattleMaps.length;
            this.battleMaps = new Array(l+1);
            for (i = 0; i < l; i++){
                var jsonBattleMap = jsonBattleMaps[i];
                id = jsonBattleMap.id;
                var battleMap = new SystemBattleMap();
                battleMap.readJSON(jsonBattleMap);
                this.battleMaps[id] = battleMap;
            }

            // Ids of specific statistics
            this.idLevelStatistic = json.lv;
            this.idExpStatistic = json.xp;

            // Formulas
            this.formulaIsDead = new SystemValue();
            this.formulaIsDead.read(json.fisdead);
            this.formulaCrit = SystemValue.readOrDefaultMessage(json.fc);

            // Musics
            this.battleMusic = new SystemPlaySong(SongKind.Music);
            this.battleMusic.readJSON(json.bmusic);
            this.battleLevelUp = new SystemPlaySong(SongKind.Sound);
            this.battleLevelUp.readJSON(json.blevelup);
            this.battleVictory = new SystemPlaySong(SongKind.Music);
            this.battleVictory.readJSON(json.bvictory);
        });
    },

    // -------------------------------------------------------

    /** Get the statistic corresponding to the level.
    *   @returns {SystemStatistic}
    */
    getLevelStatistic: function(){
        return this.statistics[this.idLevelStatistic];
    },

    // -------------------------------------------------------

    /** Get the statistic corresponding to the experience.
    *   @returns {SystemStatistic}
    */
    getExpStatistic: function(){
        return this.statistics[this.idExpStatistic];
    }
}
