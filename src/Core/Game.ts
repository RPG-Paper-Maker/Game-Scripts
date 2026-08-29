/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { CHARACTER_KIND, GROUP_KIND, ITEM_KIND, Paths, Platform, Utils } from '../Common';
import { Data, Manager, Model, Scene } from '../index';
import { Chrono } from './Chrono';
import { Item } from './Item';
import { MapObject } from './MapObject';
import { Player } from './Player';
import { Portion } from './Portion';
import { Position } from './Position';

type JsonGame = {
	pv?: string;
	t: number;
	inst: number;
	vars: unknown[];
	shops: Record<string, Record<string, number>[]>;
	steps?: number;
	saves?: number;
	battles?: number;
	chronos?: Record<string, unknown>[];
	itm?: Record<string, unknown>[];
	cur?: number[];
	cure: number[];
	curu: number[];
	th?: Record<string, unknown>[];
	sh?: Record<string, unknown>[];
	hh?: Record<string, unknown>[];
	currentMapId: number;
	heroPosition: [number, number, number];
	heroOrientation?: number;
	cameraState?: { ha: number; va: number; d: number; to: [number, number, number] };
	heroStates: number[];
	heroProp: number[];
	heroStatesOpts: Record<string, unknown>[];
	startS: number[];
	startP: number[];
	mapsP?: Record<string, unknown>;
	textures?: Record<string, unknown>;
	mapsData: Record<string, unknown>;
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
	public caterpillarFollowers: MapObject[];
	public playTime: Chrono;
	public charactersInstances: number;
	public variables: Map<number, unknown>;
	public items: Item[];
	public currencies: Map<number, number>;
	public currenciesEarned: Map<number, number>;
	public currenciesUsed: Map<number, number>;
	public teamHeroes: Player[];
	public reserveHeroes: Player[];
	public hiddenHeroes: Player[];
	public currentMapID: number;
	public heroStates: number[];
	public heroProperties: number[];
	public heroStatesOptions: Record<string, any>[];
	public startupStates: Record<string, any>;
	public startupProperties: Record<string, any>;
	public mapsData: Record<string, any>;
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
	public heroSavedOrientationEye: number = null;
	public heroSavedCamera: {
		horizontalAngle: number;
		verticalAngle: number;
		distance: number;
		targetOffset: THREE.Vector3;
	} = null;

	constructor(slot: number = -1) {
		this.slot = slot;
		this.hero = new MapObject(Data.Systems.modelHero.system, Data.Systems.modelHero.position.clone(), true);
		this.caterpillarFollowers = [];
		this.battleMusic = Data.BattleSystems.battleMusic;
		this.victoryMusic = Data.BattleSystems.battleVictory;
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
	 *  Get current project version.
	 *  @static
	 *  @returns {Promise<string>}
	 */
	static async getProjectVersion(): Promise<string> {
		const json = await Platform.parseFileJSON(Paths.FILE_PROJECT_SETTINGS);
		return typeof json.pv === 'string' ? json.pv : '';
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
		this.variables = Utils.arrayToMap(json.vars, true);
		this.shops = json.shops;
		this.steps = Utils.valueOrDefault(json.steps, 0);
		this.saves = Utils.valueOrDefault(json.saves, 0);
		this.battles = Utils.valueOrDefault(json.battles, 0);
		this.chronometers = Utils.valueOrDefault(json.chronos, []).map((chrono: Record<string, any>) => {
			return new Chrono(chrono.t, chrono.id, true, chrono.d);
		});

		// Items
		this.items = Utils.readJSONList(
			json.itm,
			(element: { kind: ITEM_KIND; id: number; nb: number }) => new Item(element.kind, element.id, element.nb),
		);

		// Currencies
		this.currencies = Utils.arrayToMap(json.cur, true);
		this.currenciesEarned = Utils.arrayToMap(json.cure, true);
		this.currenciesUsed = Utils.arrayToMap(json.curu, true);

		// Heroes
		this.teamHeroes = Utils.readJSONList(
			json.th,
			(element: {
				kind: number;
				id: number;
				instid: number;
				sk: { id: number }[];
				status: { id: number; turn: number }[];
				name: string;
			}) =>
				new Player(element.kind, element.id, element.instid, element.sk, element.status, element.name, element),
		);

		this.reserveHeroes = Utils.readJSONList(
			json.sh,
			(element: {
				kind: number;
				id: number;
				instid: number;
				sk: { id: number }[];
				status: { id: number; turn: number }[];
				name: string;
			}) =>
				new Player(element.kind, element.id, element.instid, element.sk, element.status, element.name, element),
		);

		this.hiddenHeroes = Utils.readJSONList(
			json.hh,
			(element: {
				kind: number;
				id: number;
				instid: number;
				sk: { id: number }[];
				status: { id: number; turn: number }[];
				name: string;
			}) =>
				new Player(element.kind, element.id, element.instid, element.sk, element.status, element.name, element),
		);

		// Map infos
		this.currentMapID = json.currentMapId;
		const positionHero = json.heroPosition;
		this.hero.position.set(positionHero[0], positionHero[1], positionHero[2]);
		if (json.heroOrientation !== undefined) {
			this.heroSavedOrientationEye = json.heroOrientation;
		}
		if (json.cameraState !== undefined) {
			const cs = json.cameraState;
			this.heroSavedCamera = {
				horizontalAngle: cs.ha,
				verticalAngle: cs.va,
				distance: cs.d,
				targetOffset: new THREE.Vector3(cs.to[0], cs.to[1], cs.to[2]),
			};
		}
		this.heroStates = json.heroStates;
		this.heroProperties = json.heroProp;
		this.heroStatesOptions = json.heroStatesOpts;
		this.startupStates = json.startS;
		this.startupProperties = json.startP;
		this.mapsProperties = Utils.valueOrDefault(json.mapsP, {});
		this.mapsData = Utils.valueOrDefault(json.mapsData, {});
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
			pv: await Game.getProjectVersion(),
			t: this.playTime.time,
			th: teamHeroes,
			sh: reserveHeroes,
			hh: hiddenHeroes,
			itm: items,
			cur: Utils.mapToArray(this.currencies),
			cure: Utils.mapToArray(this.currenciesEarned),
			curu: Utils.mapToArray(this.currenciesUsed),
			inst: this.charactersInstances,
			vars: Utils.mapToArray(this.variables),
			currentMapId: this.currentMapID,
			heroPosition: [this.hero.position.x, this.hero.position.y, this.hero.position.z],
			heroOrientation: this.hero.orientationEye,
			cameraState: Scene.Map.current?.camera
				? {
						ha: Scene.Map.current.camera.horizontalAngle,
						va: Scene.Map.current.camera.verticalAngle,
						d: Scene.Map.current.camera.distance,
						to: [
							Scene.Map.current.camera.targetOffset.x,
							Scene.Map.current.camera.targetOffset.y,
							Scene.Map.current.camera.targetOffset.z,
						],
					}
				: undefined,
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
			mapsData: this.getCompressedMapsData(),
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
			objectMapMinMout: Function,
			addPersistentObjectToPortion: Function;
		objectMap = async (t: number[]) => {
			let obj: MapObject;
			if (t.length >= 5) {
				const position = new THREE.Vector3(t[2], t[3], t[4]);
				Scene.Map.current.mapProperties.allObjects.set(t[0], Position.createFromVector3(position));
				Scene.Map.current.mapProperties.maxObjectsID = Math.max(Scene.Map.current.mapProperties.maxObjectsID, t[0]);
				obj = new MapObject(Model.MapObject.createFromModelID(t[1], t[0]), position);
				obj.modelID = t[1];
				obj.isPersistent = Utils.numberToBool(t[5] ?? 0);
			} else {
				if (!Scene.Map.current.mapProperties.allObjects.has(t[0])) {
					return null;
				}
				const result = await MapObject.searchOutMap(t[0]);
				if (!result) {
					return null;
				}
				obj = result.object;
				obj.position = new THREE.Vector3(t[1], t[2], t[3]);
			}
			obj.previousPosition = obj.position;
			return obj;
		};
		addPersistentObjectToPortion = (mapID: number, object: MapObject, data: Record<string, any>, portion: Portion) => {
			if (!object.isPersistent) {
				return;
			}
			const currentPortion = Position.createFromVector3(object.position).getGlobalPortion();
			const currentData = currentPortion.equals(portion)
				? data
				: this.getOrCreatePortionData(mapID, currentPortion);
			const list = currentPortion.equals(portion) ? 'min' : 'mout';
			if (!currentData[list]) {
				currentData[list] = [];
			}
			if (currentData[list].indexOf(object.system.id) === -1) {
				currentData[list].push(object.system.id);
			}
		};
		for (id in this.mapsData) {
			l = this.mapsData[id].length;
			map = null;
			// First initialize all moved objects
			movedObjects = [];
			objPortion = new Array(l);
			for (i = 0; i < l; i++) {
				objPortion[i] = new Array(2);
				for (jp = 0; jp < 2; jp++) {
					h = this.mapsData[id][i][jp].length;
					objPortion[i][jp] = new Array(h);
					for (j = jp === 0 ? 1 : 0; j < h; j++) {
						w = this.mapsData[id][i][jp][j].length;
						objPortion[i][jp][j] = new Array(w);
						for (k = 0; k < w; k++) {
							inf = {};
							datas = this.mapsData[id][i][jp][j][k];
							if (datas) {
								if (datas.m && datas.m.length) {
									if (!map) {
										map = new Scene.Map(parseInt(id), false, true);
										Scene.Map.current = map;
										await map.readMapProperties(true);
									}
									datas.m = (await Promise.all(datas.m.map(objectMap))).filter((object) => object !== null);
									for (const movedObject of datas.m) {
										addPersistentObjectToPortion(
											parseInt(id),
											movedObject,
											datas,
											new Portion(i, jp === 0 ? -j : j, k),
										);
									}
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
					h = this.mapsData[id][i][jp].length;
					objPortion[i][jp] = new Array(h);
					for (j = jp === 0 ? 1 : 0; j < h; j++) {
						w = this.mapsData[id][i][jp][j].length;
						objPortion[i][jp][j] = new Array(w);
						for (k = 0; k < w; k++) {
							inf = {};
							datas = this.mapsData[id][i][jp][j][k];
							if (datas) {
								if (datas.min && datas.min.length) {
									datas.min = datas.min.map(objectMapMinMout).filter((object) => object !== undefined);
								}
								if (datas.mout && datas.mout.length) {
									datas.mout = datas.mout.map(objectMapMinMout).filter((object) => object !== undefined);
								}
							}
						}
					}
				}
			}
		}
	}

	/**
	 *  Get a compressed version of mapsData (don't retain meshs).
	 *  @returns {Object}
	 */
	getCompressedMapsData(): object {
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
		for (id in this.mapsData) {
			l = this.mapsData[id].length;
			objPortion = new Array(l);
			for (i = 0; i < l; i++) {
				objPortion[i] = new Array(2);
				for (jp = 0; jp < 2; jp++) {
					h = this.mapsData[id][i][jp].length;
					objPortion[i][jp] = new Array(h);
					for (j = jp === 0 ? 1 : 0; j < h; j++) {
						w = this.mapsData[id][i][jp][j].length;
						objPortion[i][jp][j] = new Array(w);
						for (k = 0; k < w; k++) {
							inf = {};
							datas = this.mapsData[id][i][jp][j][k];
							if (datas) {
								if (datas.min && datas.min.length) {
									tab = [];
									for (o of datas.min) {
										if (o.isPersistent || (o.currentStateInstance && o.currentStateInstance.keepPosition)) {
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
										if (o.isPersistent || (o.currentStateInstance && o.currentStateInstance.keepPosition)) {
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
										if (o.isPersistent || (o.currentStateInstance && o.currentStateInstance.keepPosition)) {
											tab.push(
												o.modelID === null
													? [o.system.id, o.position.x, o.position.y, o.position.z]
													: [o.system.id, o.modelID, o.position.x, o.position.y, o.position.z, Utils.boolToNumber(o.isPersistent)],
											);
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
								if (datas.pr && datas.pr.length) {
									inf.pr = datas.pr;
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
		this.currencies = Data.Systems.getDefaultCurrencies();
		this.currenciesEarned = Data.Systems.getDefaultCurrencies();
		this.currenciesUsed = Data.Systems.getDefaultCurrencies();
		this.charactersInstances = 0;
		this.initializeVariables();
		this.currentMapID = Data.Systems.ID_MAP_START_HERO;
		this.heroStates = [1];
		this.heroProperties = [];
		this.heroStatesOptions = [];
		this.startupStates = {};
		this.startupProperties = {};
		this.mapsProperties = {};
		for (const member of Data.Systems.initialPartyMembers) {
			this.instanciateTeam(
				member.teamKind,
				member.characterKind,
				member.heroID.getValue() as number as number,
				member.level.getValue() as number as number,
				member.variableInstanceID.getValue(true) as number,
			);
		}
		this.mapsData = {};
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
		this.variables = new Map(Data.Variables.names.keys().map((id) => [id, Data.Variables.getDefaultValue(id)]));
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
		if (groupKind === GROUP_KIND.TROOP && (!Scene.Map.current?.isBattleMap || !(<Scene.Battle>Scene.Map.current).players)) {
			Platform.showErrorMessage(
				'Cannot instantiate a character in the troop group outside of a battle. Use TEAM, RESERVE, or HIDDEN for initial party members, and configure battle enemies in the Troops database.',
			);
			return null;
		}
		const system = type === CHARACTER_KIND.HERO ? Data.Heroes.get(id) : Data.Monsters.get(id);
		if (!system) {
			return null;
		}
		const team = this.getTeam(groupKind);

		// Stock the instanciation id in a variable
		this.variables.set(stockID, this.charactersInstances);

		// Adding the instanciated character in the right group
		const player = new Player(type, id, this.charactersInstances++, [], []);
		player.instanciate(level);
		team.push(player);
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
		return Data.Base.get(id, this.variables, 'variable');
	}

	/**
	 *  Get the currency by ID.
	 *  @param {number} id
	 *  @returns {any}
	 */
	getCurrency(id: number): any {
		return Data.Base.get(id, this.currencies, 'currency');
	}

	setCurrency(id: number, value: number): void {
		const before = this.getCurrency(id) ?? 0;
		this.currencies.set(id, value);
		const dif = Math.abs(value - before);
		if (value > before) {
			Game.current.currenciesEarned.set(id, Game.current.currenciesEarned.get(id) + dif);
		} else {
			Game.current.currenciesUsed.set(id, Game.current.currenciesUsed.get(id) + dif);
		}
	}

	addCurrency(id: number, value: number): void {
		this.currencies.set(id, this.getCurrency(id) + value);
	}

	/**
	 *  Get the currency earned by ID.
	 *  @param {number} id
	 *  @returns {any}
	 */
	getCurrencyEarned(id: number): any {
		return Data.Base.get(id, this.currenciesEarned, 'currency earned');
	}

	/**
	 *  Get the currency used by ID.
	 *  @param {number} id
	 *  @returns {any}
	 */
	getCurrencyUsed(id: number): any {
		return Data.Base.get(id, this.currenciesUsed, 'currency used');
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
				if (!Scene.Map.current?.isBattleMap || !(<Scene.Battle>Scene.Map.current).players) {
					return [];
				}
				return (<Scene.Battle>Scene.Map.current).players[CHARACTER_KIND.MONSTER];
		}
	}

	/**
	 *  Get the portions datas according to id and position.
	 *  @param {number} id - The map id
	 *  @param {Portion} portion - The portion
	 *  @returns {Record<string, any>}
	 */
	getPortionData(id: number, portion: Portion): Record<string, any> {
		return this.getPortionPosData(id, portion.x, portion.y, portion.z);
	}

	/**
	 *  Get or create the portions datas according to id and portion, creating
	 *  missing entries if needed so callers can safely write into the result.
	 *  @param {number} id - The map id
	 *  @param {Portion} portion
	 *  @returns {Record<string, any>}
	 */
	getOrCreatePortionData(id: number, portion: Portion): Record<string, any> {
		const { x: i, y: j, z: k } = portion;
		const jp = j < 0 ? 0 : 1;
		const jabs = Math.abs(j);
		if (!this.mapsData[id]) {
			this.mapsData[id] = [];
		}
		if (!this.mapsData[id][i]) {
			this.mapsData[id][i] = [[], []];
		}
		if (!this.mapsData[id][i][jp][jabs]) {
			this.mapsData[id][i][jp][jabs] = [];
		}
		if (!this.mapsData[id][i][jp][jabs][k]) {
			this.mapsData[id][i][jp][jabs][k] = {
				min: [],
				mout: [],
				m: [],
				si: [],
				s: [],
				pi: [],
				p: [],
				r: [],
				soi: [],
				so: [],
				pr: [],
			};
		}
		return this.mapsData[id][i][jp][jabs][k];
	}

	/**
	 *  Get the portions datas according to id and position.
	 *  @param {number} id - The map id
	 *  @param {number} i
	 *  @param {number} j
	 *  @param {number} k
	 *  @returns {Record<string, any>}
	 */
	getPortionPosData(id: number, i: number, j: number, k: number): Record<string, any> {
		let datas = this.mapsData[id];
		if (datas == null) {
			return {};
		}
		datas = datas[i];
		if (datas == null) {
			return {};
		}
		datas = datas[j < 0 ? 0 : 1];
		if (datas == null) {
			return {};
		}
		datas = datas[Math.abs(j)];
		if (datas == null) {
			return {};
		}
		datas = datas[k];
		if (datas == null) {
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
					Utils.arrayToMap([Model.DynamicValue.createNumber(chrono.id)]),
					true,
					false,
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
