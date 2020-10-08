/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   All the global informations of a particular game.
*   @property {number} playTime The current time played since the beginning of
*   the game in seconds.
*   @property {number[]} teamHeroes List of all the heroes in the team.
*   @property {number[]} reserveHeroes List of all the heroes in the reserve.
*   @property {number[]} hiddenHeroes List of all the hidden heroes.
*   @property {number[]} items List of all the items, weapons, and armors in the
*   inventory.
*   @property {number[]} currencies List of all the currencies.
*   @property {number} charactersInstances IDs of the last instance character.
*   @property {number} hero Hero informations.
*   @property {number} mapsDatas All the informations for each maps.
*/
class Game
{
    constructor(slot, json)
    {
        this.currentSlot = -1;
        this.hero = new MapObject(RPM.modelHero.system, new THREE.Vector3(RPM
            .modelHero.position.x, RPM.modelHero.position.y, RPM.modelHero
            .position.z), true);
        if (json)
        {
            this.read(slot, json);
        }
    }

    static getHeroInstanceInTab(tab, id)
    {
        let hero;
        for (let i = 0, l = tab.length; i < l; i++)
        {
            hero = tab[i];
            if (hero.instid === id)
            {
                return hero;
            }
        }
        return null;
    }

    static getPathSave(slot)
    {
        return RPM.PATH_SAVES + RPM.STRING_SLASH + slot + RPM
            .EXTENSION_JSON;
    }

    getHeroByInstanceID(id)
    {
        let hero = Game.getHeroInstanceInTab(this.teamHeroes, id);
        if (hero !== null)
        {
            return hero;
        }
        hero = Game.getHeroInstanceInTab(this.reserveHeroes, id);
        if (hero !== null)
        {
            return hero;
        }
        hero = Game.getHeroInstanceInTab(this.hiddenHeroes, id);
        return hero;
    }

    // -------------------------------------------------------
    /** Initialize a default game
    */
    initializeDefault()
    {
        this.teamHeroes = [];
        this.reserveHeroes = [];
        this.hiddenHeroes = [];
        this.items = [];
        this.currencies = RPM.datasGame.system.getDefaultCurrencies();
        this.charactersInstances = 0;
        this.initializeVariables();
        this.currentMapId = RPM.datasGame.system.idMapStartHero;
        this.heroStates = [1];
        this.heroProperties = [];
        this.heroStatesOptions = [];
        this.startupStates = {};
        this.startupProperties = {};
        EventCommandModifyTeam.instanciateTeam(GroupKind.Team, CharacterKind
            .Hero, 1, 1, 1);
        this.mapsDatas = {};
        this.hero.initializeProperties();
        this.playTime = new Chrono(0);
    }

    // -------------------------------------------------------
    /** Initialize the default variables.
    */
    initializeVariables()
    {
        this.variables = new Array(RPM.datasGame.variablesNumbers);
        for (let i = 0; i < RPM.datasGame.variablesNumbers; i++)
        {
            this.variables[i] = null;
        }
    }

    // -------------------------------------------------------

    useItem(gameItem)
    {
        if (!gameItem.use())
        {
            this.items.splice(this.items.indexOf(gameItem), 1);
        }
    }

    // -------------------------------------------------------

    getTeam(kind)
    {
        switch (kind)
        {
        case GroupKind.Team:
            return this.teamHeroes;
        case GroupKind.Reserve:
            return this.reserveHeroes;
        case GroupKind.Hidden:
            return this.hiddenHeroes;
        }
        return null;
    }

    // -------------------------------------------------------

    getPotionsDatas(id, i, j, k)
    {
        return RPM.game.mapsDatas[id][i][j < 0 ? 0 : 1][Math.abs(j)][k];
    }

    // -------------------------------------------------------
    /** Read a game file
    *   @param {number} slot The number of the slot to load
    *   @param {Object} json json Json object describing the object
    */
    read(slot, json)
    {
        this.currentSlot = slot;
        this.playTime = new Chrono(json.t);
        this.charactersInstances = json.inst;
        this.variables = json.vars;

        // Items
        this.items = RPM.readJSONSystemListByIndex(json.itm, (json) =>
            {
                return new GameItem(json.k, json.id, json.nb);
            },
            false
        );

        // Currencies
        let l = json.cur.length;
        this.currencies = new Array(l);
        for (let i = 1; i < l; i++)
        {
            this.currencies[i] = json.cur[i];
        }

        // Heroes
        this.teamHeroes = RPM.readJSONSystemListByIndex(json.th, (json) =>
            {
                return new GamePlayer(json.k, json.id, json.instid, json.sk, 
                    json);
            },
            false
        );
        this.reserveHeroes = RPM.readJSONSystemListByIndex(json.sh, (json) =>
            {
                return new GamePlayer(json.k, json.id, json.instid, json.sk, 
                    json);
            },
            false
        );
        this.hiddenHeroes = RPM.readJSONSystemListByIndex(json.hh, (json) =>
            {
                return new GamePlayer(json.k, json.id, json.instid, json.sk, 
                    json);
            },
            false
        );

        // Map infos
        this.currentMapId = json.currentMapId;
        var positionHero = json.heroPosition;
        this.hero.position.set(positionHero[0], positionHero[1], positionHero[2]);
        this.heroStates = json.heroStates;
        this.heroProperties = json.heroProp;
        this.heroStatesOptions = json.heroStatesOpts;
        this.startupStates = json.startS;
        this.startupProperties = json.startP;
        this.readMapsDatas(json.mapsDatas);
    }

    /** Read all the maps datas
    *   @param {Object} json Json object describing the maps datas
    */
    readMapsDatas(json)
    {
        this.mapsDatas = json;
    }

    /** Save a game file
    *   @param {number} slot The number of the slot to save.
    */
    async write(slot)
    {
        this.currentSlot = slot;
        let l = this.teamHeroes.length;
        let teamHeroes = new Array(l);
        let i;
        for (i = 0; i < l; i++)
        {
            teamHeroes[i] = this.teamHeroes[i].getSaveCharacter();
        }
        l = this.reserveHeroes.length;
        let reserveHeroes = new Array(l);
        for (i = 0; i < l; i++)
        {
            reserveHeroes[i] = this.reserveHeroes[i].getSaveCharacter();
        }
        l = this.hiddenHeroes.length;
        let hiddenHeroes = new Array(l);
        for (i = 0; i < l; i++)
        {
            hiddenHeroes[i] = this.hiddenHeroes[i].getSaveCharacter();
        }
        await RPM.saveFile(Game.getPathSave(slot),
        {
            t: this.playTime.time,
            th: teamHeroes,
            sh: reserveHeroes,
            hh: hiddenHeroes,
            itm: this.items,
            cur: this.currencies,
            inst: this.charactersInstances,
            vars: this.variables,
            currentMapId: this.currentMapId,
            heroPosition: [this.hero.position.x, this.hero.position.y, this.hero
                .position.z],
            heroStates: this.heroStates,
            heroProp: this.heroProperties,
            heroStatesOpts: this.heroStatesOptions,
            startS: this.startupStates,
            startP: this.startupProperties,
            mapsDatas : this.getCompressedMapsDatas()
        });
    }

    /** Get a compressed version of mapsDatas (don't retain meshs)
    *   @returns {Object}
    */
    getCompressedMapsDatas()
    {
        let obj = {};
        let l = Object.keys(this.mapsDatas).length;
        let i, jp, j, k, w, h, id, objPortion, inf, datas;
        for (id in this.mapsDatas)
        {
            l = this.mapsDatas[id].length;
            objPortion = new Array(l);
            for (i = 0; i < l; i++)
            {
                objPortion[i] = new Array(2);
                for (jp = 0; jp < 2; jp++)
                {
                    h = this.mapsDatas[id][i][jp].length;
                    objPortion[i][jp] = new Array(h);
                    for (j = (jp === 0 ? 1 : 0); j < h; j++)
                    {
                        w = this.mapsDatas[id][i][jp][j].length;
                        objPortion[i][jp][j] = new Array(w);
                        for (k = 0; k < w; k++)
                        {
                            inf = {};
                            datas = this.mapsDatas[id][i][jp][j][k];
                            if (datas)
                            {
                                if (datas.si && datas.si.length)
                                {
                                    inf.si = datas.si;
                                }
                                if (datas.s && datas.s.length)
                                {
                                    inf.s = datas.s;
                                }
                                if (datas.pi && datas.pi.length)
                                {
                                    inf.pi = datas.pi;
                                }
                                if (datas.p && datas.p.length)
                                {
                                    inf.p = datas.p;
                                }
                                if (datas.soi && datas.soi.length)
                                {
                                    inf.soi = datas.soi;
                                }
                                if (datas.so && datas.so.length)
                                {
                                    inf.so = datas.so;
                                }
                            }
                            objPortion[i][jp][j][k] = datas ? inf : null;
                        }
                    }
                }
            }
            obj[id] = objPortion;
        }
        return obj;
    }
}