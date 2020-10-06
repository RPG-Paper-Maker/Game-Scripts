/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   All the global informations of the game
*   @property {Object} settings All the general settings
*   @property {DatasPictures} pictures Pictures datas
*   @property {DatasCommonEvents} commonEvents Common events datas
*   @property {DatasItems} items Items datas
*   @property {DatasSkills} skills Skills datas
*   @property {DatasWeapons} weapons Weapons datas
*   @property {DatasArmors} armors Armors datas
*   @property {DatasClasses} classes Classes datas
*   @property {DatasSpecialElements} specialElements Special elements datas
*   @property {DatasTilesets} tileset Tilesets datas
*   @property {DatasHeroes} heroes Heroes datas
*   @property {DatasMonsters} monsters Monsters datas
*   @property {DatasTroops} troops Troops datas
*   @property {DatasSystem} system System datas
*   @property {DatasBattleSystem} battleSystem Battle System datas
*   @property {DatasKeyBoard} keyBoard KeyBoard datas
*/
class DatasGame
{
    static VARIABLES_PER_PAGE = 25;

    constructor()
    {
        this.system = new DatasSystem();
        this.pictures = new DatasPictures();
        this.songs = new DatasSongs();
        this.videos = new DatasVideos();
        this.shapes = new DatasShapes();
        this.commonEvents = new DatasCommonEvents();
        this.specialElements = new DatasSpecialElements();
        this.tilesets = new DatasTilesets();
        this.items = new DatasItems();
        this.skills = new DatasSkills();
        this.weapons = new DatasWeapons();
        this.armors = new DatasArmors();
        this.classes = new DatasClasses();
        this.heroes = new DatasHeroes();
        this.monsters = new DatasMonsters();
        this.troops = new DatasTroops();
        this.battleSystem = new DatasBattleSystem();
        this.titlescreenGameover = new DatasTitlescreenGameover();
        this.keyBoard = new DatasKeyBoard();
        this.animations = new DatasAnimations();
        this.dlcs = new DatasDLCs();
        this.loaded = false;
    }

    async read()
    {
        await this.system.read();
        await this.readSettings();
        await this.pictures.read();
        await this.songs.read();
        await this.videos.read();
        await this.shapes.read();
        await this.specialElements.read();
        await this.tilesets.read();
        await this.items.read();
        await this.skills.read();
        await this.weapons.read();
        await this.armors.read();
        await this.classes.read();
        await this.heroes.read();
        await this.monsters.read();
        await this.troops.read();
        await this.battleSystem.read();
        await this.titlescreenGameover.read();
        await this.keyBoard.read();
        await this.animations.read();
        await this.dlcs.read();
        await this.commonEvents.read();
        await this.system.getModelHero();
        await this.system.loadWindowSkins();
        this.loaded = true;
    }

    // -------------------------------------------------------
    /** Read the JSON files associated to the settings
    */
    async readSettings()
    {
        // Variables
        let json = (await RPM.parseFileJSON(RPM.FILE_VARIABLES)).variables;
        this.variablesNumbers = json.length * DatasGame.VARIABLES_PER_PAGE + 1;
        this.variablesNames = new Array(this.variablesNumbers);
        let i, j, l, m, variable;
        for (i = 0, l = json.length; i < l; i++)
        {
            for (j = 0, m = DatasGame.VARIABLES_PER_PAGE; j < m; j++)
            {
                variable = json[i].list[j];
                this.variablesNames[variable.id] = variable.name;
            }
        }

        // Shaders
        json = await RPM.openFile(RPM.PATH_SHADERS + "fix.vert");
        RPM.SHADER_FIX_VERTEX = json;
        json = await RPM.openFile(RPM.PATH_SHADERS + "fix.frag");
        RPM.SHADER_FIX_FRAGMENT = json;
    }

    // -------------------------------------------------------
    /** Get the list of heros or monsters according to kind
    *   @param {CharacterKind} kind The kind of character
    *   @returns {SystemHero[]}
    */
    getHeroesMonsters(kind)
    {
        return (kind === CharacterKind.Hero) ? this.heroes : this.monsters;
    }
}