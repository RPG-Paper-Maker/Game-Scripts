/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { THREE } from "../Globals";
import { Player } from "./Player";
import { Datas } from "..";
import { Item } from "./Item";
import { Chrono } from "./Chrono";
import { MapObject } from "./MapObject";
import { Paths, Constants, Utils, IO, Enum } from "../Common";
var GroupKind = Enum.GroupKind;
var CharacterKind = Enum.CharacterKind;
/** @class
 *  All the global informations of a particular game.
 *  @param {number} slot The number of the slot to load
 */
class Game {
    constructor(slot = -1) {
        this.slot = slot;
        this.hero = new MapObject(Datas.Systems.modelHero.system, new THREE
            .Vector3(Datas.Systems.modelHero.position.x, Datas.Systems.modelHero
            .position.y, Datas.Systems.modelHero.position.z), true);
        this.isEmpty = true;
    }
    /**
     *  Get the hero in a tab with instance ID.
     *  @static
     *  @param {Player[]} tab The heroes tab
     *  @param {number} id The instance ID
     *  @returns {GamePlayer}
     */
    static getHeroInstanceInTab(tab, id) {
        let hero;
        for (let i = 0, l = tab.length; i < l; i++) {
            hero = tab[i];
            if (hero.instid === id) {
                return hero;
            }
        }
        return null;
    }
    /**
     *  Load the game file.
     *  @async
     */
    async load() {
        let json = null;
        let path = this.getPathSave();
        if (IO.fileExists(path)) {
            json = await IO.parseFileJSON(path);
        }
        if (json === null) {
            return;
        }
        this.playTime = new Chrono(json.t);
        this.charactersInstances = json.inst;
        this.variables = json.vars;
        // Items
        this.items = [];
        Utils.readJSONSystemList({ list: json.itm, listIndexes: this.items, func: (json) => {
                return new Item(json.kind, json.id, json.nb);
            }
        });
        // Currencies
        let l = json.cur.length;
        this.currencies = new Array(l);
        for (let i = 1; i < l; i++) {
            this.currencies[i] = json.cur[i];
        }
        // Heroes
        this.teamHeroes = [];
        Utils.readJSONSystemList({ list: json.th, listIndexes: this.teamHeroes, func: (json) => {
                return new Player(json.kind, json.id, json.instid, json.sk, json
                    .name, json);
            }
        });
        this.reserveHeroes = [];
        Utils.readJSONSystemList({ list: json.sh, listIndexes: this
                .reserveHeroes, func: (json) => {
                return new Player(json.kind, json.id, json.instid, json.sk, json
                    .name, json);
            }
        });
        this.hiddenHeroes = [];
        Utils.readJSONSystemList({ list: json.hh, listIndexes: this.hiddenHeroes, func: (json) => {
                return new Player(json.kind, json.id, json.instid, json.sk, json
                    .name, json);
            }
        });
        // Map infos
        this.currentMapID = json.currentMapId;
        var positionHero = json.heroPosition;
        this.hero.position.set(positionHero[0], positionHero[1], positionHero[2]);
        this.heroStates = json.heroStates;
        this.heroProperties = json.heroProp;
        this.heroStatesOptions = json.heroStatesOpts;
        this.startupStates = json.startS;
        this.startupProperties = json.startP;
        this.mapsDatas = json.mapsDatas;
        this.isEmpty = false;
    }
    /**
     *  Save a game file.
     *  @async
     */
    async save(slot) {
        if (!Utils.isUndefined(slot)) {
            this.slot = slot;
        }
        let l = this.teamHeroes.length;
        let teamHeroes = new Array(l);
        let i;
        for (i = 0; i < l; i++) {
            teamHeroes[i] = this.teamHeroes[i].getSaveCharacter();
        }
        l = this.reserveHeroes.length;
        let reserveHeroes = new Array(l);
        for (i = 0; i < l; i++) {
            reserveHeroes[i] = this.reserveHeroes[i].getSaveCharacter();
        }
        l = this.hiddenHeroes.length;
        let hiddenHeroes = new Array(l);
        for (i = 0; i < l; i++) {
            hiddenHeroes[i] = this.hiddenHeroes[i].getSaveCharacter();
        }
        await IO.saveFile(this.getPathSave(slot), {
            t: this.playTime.time,
            th: teamHeroes,
            sh: reserveHeroes,
            hh: hiddenHeroes,
            itm: this.items,
            cur: this.currencies,
            inst: this.charactersInstances,
            vars: this.variables,
            currentMapId: this.currentMapID,
            heroPosition: [this.hero.position.x, this.hero.position.y, this.hero
                    .position.z],
            heroStates: this.heroStates,
            heroProp: this.heroProperties,
            heroStatesOpts: this.heroStatesOptions,
            startS: this.startupStates,
            startP: this.startupProperties,
            mapsDatas: this.getCompressedMapsDatas()
        });
    }
    /**
     *  Get a compressed version of mapsDatas (don't retain meshs).
     *  @returns {Object}
     */
    getCompressedMapsDatas() {
        let obj = {};
        let l = Object.keys(this.mapsDatas).length;
        let i, jp, j, k, w, h, id, objPortion, inf, datas;
        for (id in this.mapsDatas) {
            l = this.mapsDatas[id].length;
            objPortion = new Array(l);
            for (i = 0; i < l; i++) {
                objPortion[i] = new Array(2);
                for (jp = 0; jp < 2; jp++) {
                    h = this.mapsDatas[id][i][jp].length;
                    objPortion[i][jp] = new Array(h);
                    for (j = (jp === 0 ? 1 : 0); j < h; j++) {
                        w = this.mapsDatas[id][i][jp][j].length;
                        objPortion[i][jp][j] = new Array(w);
                        for (k = 0; k < w; k++) {
                            inf = {};
                            datas = this.mapsDatas[id][i][jp][j][k];
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
                                if (datas.soi && datas.soi.length) {
                                    inf.soi = datas.soi;
                                }
                                if (datas.so && datas.so.length) {
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
    /**
     *  Initialize a default game
     */
    initializeDefault() {
        this.teamHeroes = [];
        this.reserveHeroes = [];
        this.hiddenHeroes = [];
        this.items = [];
        this.currencies = Datas.Systems.getDefaultCurrencies();
        this.charactersInstances = 0;
        this.initializeVariables();
        this.currentMapID = Datas.Systems.ID_MAP_START_HERO;
        this.heroStates = [1];
        this.heroProperties = [];
        this.heroStatesOptions = [];
        this.startupStates = {};
        this.startupProperties = {};
        this.instanciateTeam(GroupKind.Team, CharacterKind.Hero, 1, 1, 1);
        this.mapsDatas = {};
        this.hero.initializeProperties();
        this.playTime = new Chrono(0);
        this.isEmpty = false;
    }
    /**
     *  Initialize the default variables.
     */
    initializeVariables() {
        this.variables = new Array(Datas.Variables.variablesNumbers);
        for (let i = 0; i < Datas.Variables.variablesNumbers; i++) {
            this.variables[i] = null;
        }
    }
    /**
     *  Instanciate a new character in a group in the game.
     *  @param {GroupKind} groupKind In which group we should instanciate
     *  @param {CharacterKind} type The type of character to instanciate
     *  @param {number} id The ID of the character to instanciate
     *  @param {number} level The player level
     *  @param {number} stockID The ID of the variable where we will stock the
     *  instantiate ID
     */
    instanciateTeam(groupKind, type, id, level, stockID) {
        // Stock the instanciation id in a variable
        this.variables[stockID] = this.charactersInstances;
        // Adding the instanciated character in the right group
        let player = new Player(type, id, this.charactersInstances++, []);
        player.instanciate(level);
        this.getTeam(groupKind).push(player);
    }
    /**
     *  Get the teams list in a list.
     *  @returns {Player[][]}
     */
    getGroups() {
        return [this.teamHeroes, this.reserveHeroes, this.hiddenHeroes];
    }
    /**
     *  Get the path save according to slot.
     *  @param {number} [slot=undefined]
     *  @returns {string}
    */
    getPathSave(slot) {
        return Paths.SAVES + Constants.STRING_SLASH + (Utils.isUndefined(slot) ?
            this.slot : slot) + Constants.EXTENSION_JSON;
    }
    /**
     *  Get the variable by ID.
     *  @param {number} id
     *  @returns {any}
     */
    getVariable(id) {
        return Datas.Base.get(id, this.variables, "variable");
    }
    /**
     *  Get the currency by ID.
     *  @param {number} id
     *  @returns {any}
     */
    getCurrency(id) {
        return Datas.Base.get(id, this.currencies, "currency");
    }
    /**
     *  Get the hero with instance ID.
     *  @param {number} id The instance ID
     *  @returns {Player}
     */
    getHeroByInstanceID(id) {
        let hero = Game.getHeroInstanceInTab(this.teamHeroes, id);
        if (hero !== null) {
            return hero;
        }
        hero = Game.getHeroInstanceInTab(this.reserveHeroes, id);
        if (hero !== null) {
            return hero;
        }
        return Game.getHeroInstanceInTab(this.hiddenHeroes, id);
    }
    /**
     *  Use an item and remove it from inventory.
     *  @param {Item} item The item
    */
    useItem(item) {
        if (!item.use()) {
            this.items.splice(this.items.indexOf(item), 1);
        }
    }
    /**
     *  Get the team according to group kind.
     *  @param {GroupKind} kind The group kind
     *  @returns {Player[]}
     */
    getTeam(kind) {
        switch (kind) {
            case GroupKind.Team:
                return this.teamHeroes;
            case GroupKind.Reserve:
                return this.reserveHeroes;
            case GroupKind.Hidden:
                return this.hiddenHeroes;
        }
    }
    /**
     *  Get the portions datas according to id and position.
     *  @param {number} id The map id
     *  @param {Portion} portion The portion
     *  @returns {Record<string, any>}
    */
    getPotionsDatas(id, portion) {
        return this.mapsDatas[id][portion.x][portion.y < 0 ? 0 : 1][Math.abs(portion.y)][portion.z];
    }
}
export { Game };
