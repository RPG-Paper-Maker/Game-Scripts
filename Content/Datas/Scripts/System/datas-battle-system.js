/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
            var id;

            // Statistics
            var jsonStatistics = json.statistics;
            var i, l = jsonStatistics.length;
            this.statistics = new Array(l+1);
            this.statisticsOrder = new Array(l);
            for (i = 0; i < l; i++){
                var jsonStatistic = jsonStatistics[i];
                id = jsonStatistic.id;
                var statistic = new SystemStatistic();
                statistic.readJSON(jsonStatistic);
                this.statistics[id] = statistic;
                this.statisticsOrder[i] = id;
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

            // Elements
            var jsonElements = json.elements;
            l = jsonElements.length;
            this.elements = new Array(l+1);
            for (i = 0; i < l; i++){
                var jsonElement = jsonElements[i];
                id = jsonElement.id;
                var element = new SystemElement();
                element.readJSON(jsonElement);
                this.elements[id] = element;
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
            this.battleLevelUp = new SystemPlaySong(SongKind.Soun);
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
