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
//  CLASS Game
//
// -------------------------------------------------------

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
function Game() {
    this.currentSlot = -1;
    this.hero = new MapObject(RPM.modelHero.system, new THREE.Vector3(RPM.modelHero
        .position.x, RPM.modelHero.position.y, RPM.modelHero.position.z), true);
}

Game.getHeroInstanceInTab = function(tab, id) {
    var i, l, hero;

    for (i = 0, l = tab.length; i < l; i++) {
        hero = tab[i];
        if (hero.instid === id) {
            return hero;
        }
    }

    return null;
}

Game.prototype = {

    getHeroByInstanceID: function(id) {
        var hero;

        hero = Game.getHeroInstanceInTab(this.teamHeroes, id);
        if (hero !== null) {
            return hero;
        }
        hero = Game.getHeroInstanceInTab(this.reserveHeroes, id);
        if (hero !== null) {
            return hero;
        }
        hero = Game.getHeroInstanceInTab(this.hiddenHeroes, id);

        return hero;
    },

    // -------------------------------------------------------

    /** Initialize a default game.
    */
    initializeDefault: function(){
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
        this.startupStates = {};
        this.startupProperties = {};
        EventCommandModifyTeam.instanciateTeam(GroupKind.Team,
                                               CharacterKind.Hero, 1, 1, 1);
        this.mapsDatas = {};
        this.hero.initializeProperties();
        this.playTime = new Chrono(0);
    },

    // -------------------------------------------------------

    /** Initialize the default variables.
    */
    initializeVariables: function(){
        this.variables = new Array(RPM.datasGame.variablesNumbers);
        for (var i = 0; i < RPM.datasGame.variablesNumbers; i++)
            this.variables[i] = null;
    },

    // -------------------------------------------------------

    useItem: function(gameItem) {
        var q = gameItem.use();
        if (!q) {
            this.items.splice(this.items.indexOf(gameItem), 1);
        }
    },

    // -------------------------------------------------------

    getTeam: function(kind) {
        switch (kind) {
        case GroupKind.Team:
            return this.teamHeroes;
        case GroupKind.Reserve:
            return this.reserveHeroes;
        case GroupKind.Hidden:
            return this.hiddenHeroes;
        }

        return null;
    },

    // -------------------------------------------------------

    /** Read a game file.
    *   @param {number} slot The number of the slot to load.
    *   @param {Object} json json Json object describing the object.
    */
    read: function(slot, json){
        this.currentSlot = slot;
        this.playTime = new Chrono(json.t);
        this.charactersInstances = json.inst;
        this.variables = json.vars;

        // Items
        var itemsJson = json.itm;
        var i, l = itemsJson.length;
        this.items = new Array(l);
        for (i = 0; i < l; i++){
            var itemJson = itemsJson[i];
            this.items[i] = new GameItem(itemJson.k, itemJson.id, itemJson.nb);
        }

        // Currencies
        l = json.cur.length;
        this.currencies = new Array(l);
        for (i = 1; i < l; i++) {
            this.currencies[i] = json.cur[i];
        }

        // Heroes
        var heroesJson = json.th;
        l = heroesJson.length
        this.teamHeroes = new Array(l);
        var heroJson, character;
        for (i = 0; i < l; i++){
            heroJson = heroesJson[i];
            character = new GamePlayer(heroJson.k, heroJson.id, heroJson.instid,
                                       heroJson.sk);
            character.readJSON(heroJson, this.items);
            this.teamHeroes[i] = character;
        }
        heroesJson = json.sh;
        l = heroesJson.length
        this.reserveHeroes = new Array(l);
        for (i = 0; i < l; i++){
            heroJson = heroesJson[i];
            character = new GamePlayer(heroJson.k, heroJson.id, heroJson.instid,
                                       heroJson.sk);
            character.readJSON(heroJson, this.items);
            this.reserveHeroes[i] = character;
        }
        heroesJson = json.hh;
        l = heroesJson.length
        this.hiddenHeroes = new Array(l);
        for (i = 0; i < l; i++){
            heroJson = heroesJson[i];
            character = new GamePlayer(heroJson.k, heroJson.id, heroJson.instid,
                                       heroJson.sk);
            character.readJSON(heroJson, this.items);
            this.hiddenHeroes[i] = character;
        }

        // Map infos
        this.currentMapId = json.currentMapId;
        var positionHero = json.heroPosition;
        this.hero.position.set(positionHero[0],
                               positionHero[1],
                               positionHero[2]);
        this.heroStates = json.heroStates;
        this.heroProperties = json.heroProp;
        this.startupStates = json.startS;
        this.startupProperties = json.startP;
        this.readMapsDatas(json.mapsDatas);
    },

    /** Read all the maps datas.
    *   @param {Object} json Json object describing the maps datas.
    */
    readMapsDatas: function(json){
        this.mapsDatas = json;
    },

    /** Save a game file.
    *   @param {number} slot The number of the slot to save.
    */
    write: function(slot){
        this.currentSlot = slot;
        var i, l = this.teamHeroes.length;
        var teamHeroes = new Array(l);
        for (i = 0; i < l; i++)
            teamHeroes[i] = this.teamHeroes[i].getSaveCharacter();
        l = this.reserveHeroes.length;
        var reserveHeroes = new Array(l);
        for (i = 0; i < l; i++)
            reserveHeroes[i] = this.reserveHeroes[i].getSaveCharacter();
        l = this.hiddenHeroes.length;
        var hiddenHeroes = new Array(l);
        for (i = 0; i < l; i++)
            hiddenHeroes[i] = this.hiddenHeroes[i].getSaveCharacter();

        RPM.openFile(this, RPM.FILE_SAVE, true, function(res){
            var jsonList = JSON.parse(res);
            jsonList[slot - 1] =
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
                heroPosition: [this.hero.position.x,
                               this.hero.position.y,
                               this.hero.position.z],
                heroStates: this.heroStates,
                heroProp: this.heroProperties,
                startS: this.startupStates,
                startP: this.startupProperties,
                mapsDatas : this.getCompressedMapsDatas()
            };

            RPM.saveFile(RPM.FILE_SAVE, jsonList);
        });
    },

    /** Get a compressed version of mapsDatas (don't retain meshs).
    *   @returns {Object}
    */
    getCompressedMapsDatas: function() {
        var obj = {}, i, j, k, l = Object.keys(this.mapsDatas).length, w, h, id,
            datas, inf, objPortion;
        for (id in this.mapsDatas) {
            objPortion = new Array(l);
            l = this.mapsDatas[id].length;
            h = this.mapsDatas[id][0].length;
            w = this.mapsDatas[id][0][0].length;
            for (i = 0; i < l; i++) {
                objPortion[i] = new Array(h);
                for (j = 0; j < h; j++) {
                    objPortion[i][j] = new Array(w);
                    for (k = 0; k < w; k++) {
                        inf = {};
                        datas = this.mapsDatas[id][i][j][k];
                        if (datas) {
                            if (datas.si && datas.si.length) {
                                inf.si = datas.si;
                            }
                            if (datas.s && datas.s.length) {
                                inf.s = datas.s;
                            }
                            if (datas.pi && datas.pi.length) {
                                inf.pi = datas.pi;
                            }
                            if (datas.p && datas.p.length) {
                                inf.p = datas.p;
                            }
                        }
                        objPortion[i][j][k] = datas ? inf : null;
                    }
                }
            }
            obj[id] = objPortion;
        }

        return obj;
    }
}
