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
//  CLASS GameDatas
//
// -------------------------------------------------------

/** @class
*   All the global informations of the game.
*   @property {Object} settings All the general settings.
*   @property {DatasPictures} pictures Pictures datas.
*   @property {DatasCommonEvents} commonEvents Common events datas.
*   @property {DatasItems} items Items datas.
*   @property {DatasSkills} skills Skills datas.
*   @property {DatasWeapons} weapons Weapons datas.
*   @property {DatasArmors} armors Armors datas.
*   @property {DatasClasses} classes Classes datas.
*   @property {DatasSpecialElements} specialElements Special elements datas.
*   @property {DatasTilesets} tileset Tilesets datas.
*   @property {DatasHeroes} heroes Heroes datas.
*   @property {DatasMonsters} monsters Monsters datas.
*   @property {DatasTroops} troops Troops datas.
*   @property {DatasSystem} system System datas.
*   @property {DatasBattleSystem} battleSystem Battle System datas.
*   @property {DatasKeyBoard} keyBoard KeyBoard datas.
*/
function DatasGame(){
    this.tilesets = new DatasTilesets();
    this.songs = new DatasSongs();
    this.commonEvents = new DatasCommonEvents();
    this.items = new DatasItems();
    this.skills = new DatasSkills();
    this.weapons = new DatasWeapons();
    this.armors = new DatasArmors();
    this.classes = new DatasClasses(this);
    this.heroes = new DatasHeroes();
    this.monsters = new DatasMonsters();
    this.troops = new DatasTroops();
    this.system = new DatasSystem();
    this.battleSystem = new DatasBattleSystem();
    this.titlescreenGameover = new DatasTitlescreenGameover();
    this.keyBoard = new DatasKeyBoard();
    this.shapes = new DatasShapes();
    this.specialElements = new DatasSpecialElements();
    this.animations = new DatasAnimations();
    this.pictures = new DatasPictures(this, DatasGame.prototype.readAfterPictures);
    this.videos = new DatasVideos();
    this.readSettings();
    this.loaded = false;
}

DatasGame.VARIABLES_PER_PAGE = 25;

DatasGame.prototype = {

    /** Read the JSON files associated to the settings.
    */
    readSettings: function(){
        this.settings = {};

        RPM.openFile(this, RPM.FILE_VARIABLES, true, function(res){
            var json = JSON.parse(res).variables;
            var i, j, l, ll, variable;

            this.variablesNumbers =
                 json.length * DatasGame.VARIABLES_PER_PAGE + 1;
            this.variablesNames = new Array(this.variablesNumbers);
            for (i = 0, l = json.length; i < l; i++) {
                for (j = 0, ll = DatasGame.VARIABLES_PER_PAGE; j < ll; j++) {
                    variable = json[i].list[j];
                    this.variablesNames[variable.id] = variable.name;
                }
            }
        });
    },

    readAfterPictures: function() {
        this.tilesets.read();
        if (this.classes.loaded) {
            this.heroes.read();
            this.monsters.read();
        }
        this.system.loadWindowSkins();
        this.commonEvents.read();
    },

    updateLoadings: function() {
        if (this.tilesets.loading) {
            var tileset;
            tileset = this.tilesets.loading[0];
            if (tileset.callback !== null) {
                tileset.callback.call(tileset);
            } else {
                this.tilesets.loading.splice(0, 1);
            }
            this.loaded = this.tilesets.loading.length === 0;
        }
    },

    getHeroesMonsters: function(kind) {
        return (kind === CharacterKind.Hero) ? this.heroes : this.monsters;
    }
}
