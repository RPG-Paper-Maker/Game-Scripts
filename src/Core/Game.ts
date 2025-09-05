/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { CHARACTER_KIND, GROUP_KIND, Paths, Platform, Utils } from '../Common';
import { Datas, Manager, Model, Scene } from '../index';
import { Chrono } from './Chrono';
import { Item } from './Item';
import { MapObject } from './MapObject';
import { Player } from './Player';
import { Portion } from './Portion';

type JsonGame = {
	t: number;
	inst: number;
	vars: unknown[];
	shops: Record<string, Record<string, number>[]>;
	steps?: number;
	saves?: number;
	battles?: number;
	chronos?: Record<string, unknown>[];
	itm?: Record<string, unknown>[];
	cur?: Record<string, unknown>;
	cure: number[];
	curu: number[];
	th?: Record<string, unknown>[];
	sh?: Record<string, unknown>[];
	hh?: Record<string, unknown>[];
	currentMapId: number;
	heroPosition: [number, number, number];
	heroStates: number[];
	heroProp: number[];
	heroStatesOpts: Record<string, unknown>[];
	startS: number[];
	startP: number[];
	mapsP?: Record<string, unknown>;
	textures?: Record<string, unknown>;
	mapsDatas: Record<string, unknown>;
};

/** @class
 *  All the global informations of a particular game.
 *  @param {number} slot - The number of the slot to load
 */
class Game {
	public static current: Game = null;

	public slot: number;
	public hero: MapObject;
	public heroBattle: MapObject;
	public playTime: Chrono;
	public charactersInstances: number;
	public variables: any[];
	public items: Item[];
	public currencies: number[];
	public currenciesEarned: number[];
	public currenciesUsed: number[];
	public teamHeroes: Player[];
	public reserveHeroes: Player[];
	public hiddenHeroes: Player[];
	public currentMapID: number;
	public heroStates: number[];
	public heroProperties: number[];
	public heroStatesOptions: Record<string, any>[];
	public startupStates: Record<string, any>;
	public startupProperties: Record<string, any>;
	public mapsDatas: Record<string, any>;
	public mapsProperties: Record<string, any>;
	public isEmpty: boolean;
	public shops: Record<string, Record<string, number>[]>;
	public battleMusic: Model.PlaySong;
	public victoryMusic: Model.PlaySong;
	public steps: number;
	public saves: number;
	public battles: number;
	public chronometers: Chrono[] = [];
	public previousWeatherOptions: Record<string, any> = null;
	public currentWeatherOptions: Record<string, any> = null;
	public textures: Record<string, any>;

	constructor(slot: number = -1) {
		this.slot = slot;
		this.hero = new MapObject(Datas.Systems.modelHero.system, Datas.Systems.modelHero.position.clone(), true);
		this.battleMusic = Datas.BattleSystems.battleMusic;
		this.victoryMusic = Datas.BattleSystems.battleVictory;
		this.textures = {};
		this.textures.tilesets = {};
		this.textures.autotiles = {};
		this.textures.walls = {};
		this.textures.objects3D = {};
		this.textures.mountains = {};
		this.isEmpty = true;
	}

	/**
	 *  Get the hero in a tab with instance ID.
	 *  @static
	 *  @param {Player[]} tab - The heroes tab
	 *  @param {number} id - The instance ID
	 *  @returns {GamePlayer}
	 */
	static getHeroInstanceInTab(tab: Player[], id: number): Player {
		let hero: Player;
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
		const path = this.getPathSave();
		const json = (await Platform.loadSave(this.slot, path)) as JsonGame;
		if (json === null) {
			return;
		}
		this.playTime = new Chrono(json.t);
		this.charactersInstances = json.inst;
		this.variables = json.vars;
		this.shops = json.shops;
		this.steps = Utils.defaultValue(json.steps, 0);
		this.saves = Utils.defaultValue(json.saves, 0);
		this.battles = Utils.defaultValue(json.battles, 0);
		this.chronometers = Utils.defaultValue(json.chronos, []).map((chrono: Record<string, any>) => {
			return new Chrono(chrono.t, chrono.id, true, chrono.d);
		});

		// Items
		this.items = [];
		Utils.readJSONSystemList({
			list: json.itm,
			listIndexes: this.items,
			func: (json: Record<string, any>) => {
				return new Item(json.kind, json.id, json.nb);
			},
		});

		// Currencies
		this.currencies = [];
		for (const id in json.cur) {
			if (json.cur[id] !== null) {
				this.currencies[id] = json.cur[id];
			}
		}
		this.currenciesEarned = [];
		for (const id in json.cure) {
			if (json.cure[id] !== null) {
				this.currenciesEarned[id] = json.cure[id];
			}
		}
		this.currenciesUsed = [];
		for (const id in json.curu) {
			if (json.curu[id] !== null) {
				this.currenciesUsed[id] = json.curu[id];
			}
		}

		// Heroes
		this.teamHeroes = [];
		Utils.readJSONSystemList({
			list: json.th,
			listIndexes: this.teamHeroes,
			func: (json: Record<string, any>) => {
				return new Player(json.kind, json.id, json.instid, json.sk, json.status, json.name, json);
			},
		});
		this.reserveHeroes = [];
		Utils.readJSONSystemList({
			list: json.sh,
			listIndexes: this.reserveHeroes,
			func: (json: Record<string, any>) => {
				return new Player(json.kind, json.id, json.instid, json.sk, json.status, json.name, json);
			},
		});
		this.hiddenHeroes = [];
		Utils.readJSONSystemList({
			list: json.hh,
			listIndexes: this.hiddenHeroes,
			func: (json: Record<string, any>) => {
				return new Player(json.kind, json.id, json.instid, json.sk, json.status, json.name, json);
			},
		});

		// Map infos
		this.currentMapID = json.currentMapId;
		const positionHero = json.heroPosition;
		this.hero.position.set(positionHero[0], positionHero[1], positionHero[2]);
		this.heroStates = json.heroStates;
		this.heroProperties = json.heroProp;
		this.heroStatesOptions = json.heroStatesOpts;
		this.startupStates = json.startS;
		this.startupProperties = json.startP;
		this.mapsProperties = Utils.defaultValue(json.mapsP, {});
		this.mapsDatas = json.mapsDatas;
		if (json.textures) {
			this.textures = json.textures;
		}
		this.isEmpty = false;
	}

	/**
	 *  Save a game file.
	 *  @async
	 */
	async save(slot?: number) {
		if (slot !== undefined) {
			this.slot = slot;
		}
		let l = this.teamHeroes.length;
		const teamHeroes = new Array(l);
		let i: number;
		for (i = 0; i < l; i++) {
			teamHeroes[i] = this.teamHeroes[i].getSaveCharacter();
		}
		l = this.reserveHeroes.length;
		const reserveHeroes = new Array(l);
		for (i = 0; i < l; i++) {
			reserveHeroes[i] = this.reserveHeroes[i].getSaveCharacter();
		}
		l = this.hiddenHeroes.length;
		const hiddenHeroes = new Array(l);
		for (i = 0; i < l; i++) {
			hiddenHeroes[i] = this.hiddenHeroes[i].getSaveCharacter();
		}
		l = this.items.length;
		const items: Record<string, any>[] = new Array(l);
		for (i = 0; i < l; i++) {
			items[i] = this.items[i].getSave();
		}
		this.saves++;
		await Platform.registerSave(slot, this.getPathSave(slot), {
			t: this.playTime.time,
			th: teamHeroes,
			sh: reserveHeroes,
			hh: hiddenHeroes,
			itm: items,
			cur: this.currencies,
			cure: this.currenciesEarned,
			curu: this.currenciesUsed,
			inst: this.charactersInstances,
			vars: this.variables,
			currentMapId: this.currentMapID,
			heroPosition: [this.hero.position.x, this.hero.position.y, this.hero.position.z],
			heroStates: this.heroStates,
			heroProp: this.heroProperties,
			heroStatesOpts: this.heroStatesOptions,
			startS: this.startupStates,
			startP: this.startupProperties,
			mapsP: this.mapsProperties,
			shops: this.shops,
			steps: this.steps,
			saves: this.saves,
			battles: this.battles,
			chronos: this.chronometers.map((chrono: Chrono) => {
				return {
					t: chrono.time,
					id: chrono.id,
					d: chrono.graphic !== null,
				};
			}),
			textures: this.textures,
			mapsDatas: this.getCompressedMapsDatas(),
		});
	}

	/**
	 *  Load the positions that were kept (keep position option).
	 */
	async loadPositions() {
		let i: number,
			l: number,
			jp: number,
			j: number,
			k: number,
			w: number,
			h: number,
			id: string,
			objPortion: any[],
			inf: Record<string, any>,
			datas: Record<string, any>,
			map: Scene.Map,
			objectMap: Function,
			movedObjects: MapObject[],
			objectMapMinMout: Function;
		objectMap = objectMap = async (t: number[]) => {
			const obj = (await MapObject.searchOutMap(t[0])).object;
			obj.position = new THREE.Vector3(t[1], t[2], t[3]);
			obj.previousPosition = obj.position;
			return obj;
		};
		for (id in this.mapsDatas) {
			l = this.mapsDatas[id].length;
			map = null;
			// First initialize all moved objects
			movedObjects = [];
			objPortion = new Array(l);
			for (i = 0; i < l; i++) {
				objPortion[i] = new Array(2);
				for (jp = 0; jp < 2; jp++) {
					h = this.mapsDatas[id][i][jp].length;
					objPortion[i][jp] = new Array(h);
					for (j = jp === 0 ? 1 : 0; j < h; j++) {
						w = this.mapsDatas[id][i][jp][j].length;
						objPortion[i][jp][j] = new Array(w);
						for (k = 0; k < w; k++) {
							inf = {};
							datas = this.mapsDatas[id][i][jp][j][k];
							if (datas) {
								if (datas.m && datas.m.length) {
									if (!map) {
										map = new Scene.Map(parseInt(id), false, true);
										Scene.Map.current = map;
										await map.readMapProperties();
									}
									datas.m = await Promise.all(datas.m.map(objectMap));
									movedObjects = movedObjects.concat(datas.m);
								}
							}
						}
					}
				}
			}
			// Associate min and mout
			objectMapMinMout = (i: number) => {
				return movedObjects[Utils.indexOfProp(movedObjects as any, 'id', i)];
			};
			for (i = 0; i < l; i++) {
				objPortion[i] = new Array(2);
				for (jp = 0; jp < 2; jp++) {
					h = this.mapsDatas[id][i][jp].length;
					objPortion[i][jp] = new Array(h);
					for (j = jp === 0 ? 1 : 0; j < h; j++) {
						w = this.mapsDatas[id][i][jp][j].length;
						objPortion[i][jp][j] = new Array(w);
						for (k = 0; k < w; k++) {
							inf = {};
							datas = this.mapsDatas[id][i][jp][j][k];
							if (datas) {
								if (datas.min && datas.min.length) {
									datas.min = datas.min.map(objectMapMinMout);
								}
								if (datas.mout && datas.mout.length) {
									datas.mout = datas.mout.map(objectMapMinMout);
								}
							}
						}
					}
				}
			}
		}
	}

	/**
	 *  Get a compressed version of mapsDatas (don't retain meshs).
	 *  @returns {Object}
	 */
	getCompressedMapsDatas(): object {
		const obj = {};
		let i: number,
			l: number,
			jp: number,
			j: number,
			k: number,
			w: number,
			h: number,
			id: string,
			objPortion: any[],
			inf: Record<string, any>,
			datas: Record<string, any>,
			o: MapObject,
			tab: any[];
		for (id in this.mapsDatas) {
			l = this.mapsDatas[id].length;
			objPortion = new Array(l);
			for (i = 0; i < l; i++) {
				objPortion[i] = new Array(2);
				for (jp = 0; jp < 2; jp++) {
					h = this.mapsDatas[id][i][jp].length;
					objPortion[i][jp] = new Array(h);
					for (j = jp === 0 ? 1 : 0; j < h; j++) {
						w = this.mapsDatas[id][i][jp][j].length;
						objPortion[i][jp][j] = new Array(w);
						for (k = 0; k < w; k++) {
							inf = {};
							datas = this.mapsDatas[id][i][jp][j][k];
							if (datas) {
								if (datas.min && datas.min.length) {
									tab = [];
									for (o of datas.min) {
										if (o.currentStateInstance && o.currentStateInstance.keepPosition) {
											tab.push(o.system.id);
										}
									}
									if (tab.length) {
										inf.min = tab;
									}
								}
								if (datas.mout && datas.mout.length) {
									tab = [];
									for (o of datas.mout) {
										if (o.currentStateInstance && o.currentStateInstance.keepPosition) {
											tab.push(o.system.id);
										}
									}
									if (tab.length) {
										inf.mout = tab;
									}
								}
								if (datas.m && datas.m.length) {
									tab = [];
									for (o of datas.m) {
										if (o.currentStateInstance && o.currentStateInstance.keepPosition) {
											tab.push([o.system.id, o.position.x, o.position.y, o.position.z]);
										}
									}
									if (tab.length) {
										inf.m = tab;
									}
								}
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
		this.currenciesEarned = Datas.Systems.getDefaultCurrencies();
		this.currenciesUsed = Datas.Systems.getDefaultCurrencies();
		this.charactersInstances = 0;
		this.initializeVariables();
		this.currentMapID = Datas.Systems.ID_MAP_START_HERO;
		this.heroStates = [1];
		this.heroProperties = [];
		this.heroStatesOptions = [];
		this.startupStates = {};
		this.startupProperties = {};
		this.mapsProperties = {};
		for (const member of Datas.Systems.initialPartyMembers) {
			this.instanciateTeam(
				member.teamKind,
				member.CHARACTER_KIND,
				member.heroID.getValue(),
				member.level.getValue(),
				member.variableInstanceID.getValue(true)
			);
		}
		this.mapsDatas = {};
		this.hero.initializeProperties();
		this.playTime = new Chrono(0);
		this.shops = {};
		this.steps = 0;
		this.saves = 0;
		this.battles = 0;
		this.isEmpty = false;
	}

	/**
	 *  Initialize the default variables.
	 */
	initializeVariables() {
		this.variables = new Array(Datas.Variables.variablesNumbers);
		for (let i = 0; i < Datas.Variables.variablesNumbers; i++) {
			this.variables[i] = 0;
		}
	}

	/**
	 *  Instanciate a new character in a group in the game.
	 *  @param {GROUP_KIND} groupKind - In which group we should instanciate
	 *  @param {CHARACTER_KIND} type - The type of character to instanciate
	 *  @param {number} id - The ID of the character to instanciate
	 *  @param {number} level - The player level
	 *  @param {number} stockID - The ID of the variable where we will stock the
	 *  instantiate ID
	 *  @returns {Player}
	 */
	instanciateTeam(groupKind: GROUP_KIND, type: CHARACTER_KIND, id: number, level: number, stockID: number): Player {
		// Stock the instanciation id in a variable
		this.variables[stockID] = this.charactersInstances;

		// Adding the instanciated character in the right group
		const player = new Player(type, id, this.charactersInstances++, [], []);
		player.instanciate(level);
		this.getTeam(groupKind).push(player);
		return player;
	}

	/**
	 *  Get the teams list in a list.
	 *  @returns {Player[][]}
	 */
	getGroups(): Player[][] {
		return [this.teamHeroes, this.reserveHeroes, this.hiddenHeroes];
	}

	/**
	 *  Get the path save according to slot.
	 *  @param {number} [slot=undefined]
	 *  @returns {string}
	 */
	getPathSave(slot?: number): string {
		return Paths.SAVES + '/' + (slot === undefined ? this.slot : slot) + '.json';
	}

	/**
	 *  Get the variable by ID.
	 *  @param {number} id
	 *  @returns {any}
	 */
	getVariable(id: number): any {
		return Datas.Base.get(id, this.variables, 'variable');
	}

	/**
	 *  Get the currency by ID.
	 *  @param {number} id
	 *  @returns {any}
	 */
	getCurrency(id: number): any {
		return Datas.Base.get(id, this.currencies, 'currency');
	}

	/**
	 *  Get the currency earned by ID.
	 *  @param {number} id
	 *  @returns {any}
	 */
	getCurrencyEarned(id: number): any {
		return Datas.Base.get(id, this.currenciesEarned, 'currency earned');
	}

	/**
	 *  Get the currency used by ID.
	 *  @param {number} id
	 *  @returns {any}
	 */
	getCurrencyUsed(id: number): any {
		return Datas.Base.get(id, this.currenciesUsed, 'currency used');
	}

	/**
	 *  Get the hero with instance ID.
	 *  @param {number} id - The instance ID
	 *  @returns {Player}
	 */
	getHeroByInstanceID(id: number): Player {
		let hero = Game.getHeroInstanceInTab(this.teamHeroes, id);
		if (hero !== null) {
			return hero;
		}
		hero = Game.getHeroInstanceInTab(this.reserveHeroes, id);
		if (hero !== null) {
			return hero;
		}
		hero = Game.getHeroInstanceInTab(this.hiddenHeroes, id);
		if (hero !== null) {
			return hero;
		}
		if (Scene.Map.current.isBattleMap) {
			return Game.getHeroInstanceInTab((<Scene.Battle>Scene.Map.current).players[CHARACTER_KIND.MONSTER], id);
		}
		return null;
	}

	/**
	 *  Use an item and remove it from inventory.
	 *  @param {Item} item - The item
	 */
	useItem(item: Item) {
		if (!item.use()) {
			this.items.splice(this.items.indexOf(item), 1);
		}
	}

	/**
	 *  Get the team according to group kind.
	 *  @param {GROUP_KIND} kind - The group kind
	 *  @returns {Player[]}
	 */
	getTeam(kind: GROUP_KIND): Player[] {
		switch (kind) {
			case GROUP_KIND.TEAM:
				return this.teamHeroes;
			case GROUP_KIND.RESERVE:
				return this.reserveHeroes;
			case GROUP_KIND.HIDDEN:
				return this.hiddenHeroes;
			case GROUP_KIND.TROOP:
				return (<Scene.Battle>Scene.Map.current).players[CHARACTER_KIND.MONSTER];
		}
	}

	/**
	 *  Get the portions datas according to id and position.
	 *  @param {number} id - The map id
	 *  @param {Portion} portion - The portion
	 *  @returns {Record<string, any>}
	 */
	getPortionDatas(id: number, portion: Portion): Record<string, any> {
		return this.getPortionPosDatas(id, portion.x, portion.y, portion.z);
	}

	/**
	 *  Get the portions datas according to id and position.
	 *  @param {number} id - The map id
	 *  @param {number} i
	 *  @param {number} j
	 *  @param {number} k
	 *  @returns {Record<string, any>}
	 */
	getPortionPosDatas(id: number, i: number, j: number, k: number): Record<string, any> {
		let datas = this.mapsDatas[id];
		if (datas === undefined) {
			return {};
		}
		datas = datas[i];
		if (datas === undefined) {
			return {};
		}
		datas = datas[j < 0 ? 0 : 1];
		if (datas === undefined) {
			return {};
		}
		datas = datas[Math.abs(j)];
		if (datas === undefined) {
			return {};
		}
		datas = datas[k];
		if (datas === undefined) {
			return {};
		}
		return datas;
	}

	/**
	 *  Get a chrono ID.
	 *  @returns {number}
	 */
	getNewChronoID(): number {
		let id = 0;
		let test = false;
		let chrono: Chrono;
		while (!test) {
			test = true;
			for (chrono of this.chronometers) {
				if (chrono.id === id) {
					id++;
					test = false;
					break;
				}
			}
		}
		return id;
	}

	/**
	 *  Update.
	 */
	update() {
		this.playTime.update();
		for (const chrono of this.chronometers) {
			if (chrono.update()) {
				Manager.Events.sendEvent(
					null,
					0,
					1,
					true,
					2,
					[null, Model.DynamicValue.createNumber(chrono.id)],
					true,
					false
				);
			}
		}
	}

	/**
	 *  Draw the HUD.
	 */
	drawHUD() {
		for (const chrono of this.chronometers) {
			chrono.drawHUD();
		}
	}
}

export { Game };
