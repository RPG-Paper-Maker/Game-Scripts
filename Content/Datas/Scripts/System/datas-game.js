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
function DatasGame()
{
    this.system = new DatasSystem();
    this.pictures = new DatasPictures();
    this.commonEvents = new DatasCommonEvents();
    /*
    this.tilesets = new DatasTilesets();
    this.songs = new DatasSongs();
    this.items = new DatasItems();
    this.skills = new DatasSkills();
    this.weapons = new DatasWeapons();
    this.armors = new DatasArmors();
    this.classes = new DatasClasses();
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
    this.pictures = new DatasPictures();
    this.videos = new DatasVideos();
    this.dlcs = new DatasDLCs();
    */
    this.loaded = false;
}

DatasGame.VARIABLES_PER_PAGE = 25;

DatasGame.prototype = {

    read: async function()
    {
        await this.system.read();
        await this.pictures.read();
        await this.commonEvents.read();
        /*
        await this.songs.read();
        await this.commonEvents.read();
        await this.items.read();
        await this.skills.read();
        await this.weapons.read();
        await this.armors.read();
        await this.troops.read();
        await this.battleSystem.read();
        await this.titlescreenGameover.read();
        await this.keyBoard.read();
        await this.shapes.read();
        await this.specialElements.read();
        await this.animations.read();
        
        await this.tilesets.read();
        await this.classes.read();
        await this.heroes.read();
        await this.monsters.read();
        await this.system.loadWindowSkins();
        await this.commonEvents.read();
        await this.videos.read();
        await this.dlcs.read();
        this.readSettings();*/
        this.loaded = true;
    },

    /** Read the JSON files associated to the settings.
    */
    readSettings: function(){
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

    getHeroesMonsters: function(kind) {
        return (kind === CharacterKind.Hero) ? this.heroes : this.monsters;
    }
}
