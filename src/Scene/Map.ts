/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import {
	Constants,
	EFFECT_SPECIAL_ACTION_KIND,
	Inputs,
	Interpreter,
	ORIENTATION,
	Paths,
	PICTURE_KIND,
	Platform,
	ScreenResolution,
	TARGET_KIND,
	Utils,
} from '../Common';
import {
	Autotiles,
	Battler,
	Camera,
	Frame,
	Game,
	MapPortion,
	Player,
	Portion,
	Position,
	ReactionInterpreter,
	Rectangle,
} from '../Core';
import { Data, Manager, Model, Scene } from '../index';
import { Base } from './Base';

/** @class
 *  A scene for a local map.
 *  @extends Scene.Base
 *  @param {number} id - The map ID
 *  @param {boolean} [isBattleMap=false] - Indicate if this map is a battle one
 *  @param {boolean} [minimal=false] - Indicate if the map should be partialy
 *  loaded (only for getting objects infos)
 */
class Map extends Base {
	public static current: Scene.Map;
	public static allowMainMenu = true;
	public static allowSaves = true;
	public static autotileFrame = new Frame(0);
	public static autotilesOffset: THREE.Vector2 = new THREE.Vector2();

	public id: number;
	public mapFilename: string;
	public orientation: ORIENTATION;
	public user: Battler;
	public isBattleMap: boolean;
	public tempTargets: Battler[];
	public targets: Battler[];
	public battleCommandKind: EFFECT_SPECIAL_ACTION_KIND;
	public mapProperties: Model.MapProperties;
	public scene: THREE.Scene;
	public currentPortion: Portion;
	public previousPortion: Portion;
	public mapPortions: MapPortion[];
	public textureTileset: THREE.MeshPhongMaterial;
	public texturesCharacters: THREE.MeshPhongMaterial[];
	public collisions: Rectangle[][][][];
	public previousCameraPosition: THREE.Vector3;
	public portionsObjectsUpdated: boolean;
	public heroOrientation: ORIENTATION;
	public previousWeatherPoints: THREE.Points = null;
	public previousWeatherVelocities: number[];
	public previousWeatherRotationsAngle: number[];
	public previousWeatherRotationsPoint: THREE.Vector3[];
	public weatherPoints: THREE.Points = null;
	public weatherVelocities: number[];
	public weatherRotationsAngle: number[];
	public weatherRotationsPoint: THREE.Vector3[];
	public sunLight: THREE.DirectionalLight;
	public overflowSprites: globalThis.Map<string, Set<string>> = new globalThis.Map();
	public overflowMountains: globalThis.Map<string, Set<string>> = new globalThis.Map();
	public overflowObjects3D: globalThis.Map<string, Set<string>> = new globalThis.Map();

	constructor(
		id: number,
		isBattleMap: boolean = false,
		minimal: boolean = false,
		heroOrientation: ORIENTATION = null
	) {
		super(false);

		this.id = id;
		this.isBattleMap = isBattleMap;
		this.mapFilename = Scene.Map.generateMapName(id);
		this.loading = false;
		this.heroOrientation = heroOrientation;
		if (!minimal) {
			this.loading = true;
			this.load().catch(console.error);
		}
	}

	/**
	 *  Load async stuff.
	 */
	async load() {
		Scene.Map.current = this;

		if (!this.isBattleMap) {
			Game.current.currentMapID = this.id;
		}
		this.scene = new THREE.Scene();

		// Adding meshes for collision
		this.collisions = [];
		if (Data.Systems.showBB) {
			this.scene.add(Manager.Collisions.BB_BOX);
			this.scene.add(Manager.Collisions.BB_ORIENTED_BOX);
			this.scene.add(Manager.Collisions.BB_BOX_DEFAULT_DETECTION);
		}
		await this.readMapProperties();
		this.initializeSunLight();
		this.initializeCamera();
		this.orientation = this.camera.getMapOrientation();
		this.initializePortionsObjects();
		await this.loadTextures();
		this.loadCollisions();
		await this.initializePortions();
		this.createWeather(false);
		this.createWeather();

		Manager.Stack.requestPaintHUD = true;
		this.loading = false;
	}

	/**
	 *  Reload only the textures + collisions
	 */
	async reloadTextures() {
		const limit = Data.Systems.PORTIONS_RAY;
		let i: number, j: number, k: number;
		for (i = -limit; i <= limit; i++) {
			for (j = -limit; j <= limit; j++) {
				for (k = -limit; k <= limit; k++) {
					const mapPortion = this.getMapPortion(i, j, k);
					if (mapPortion) {
						mapPortion.cleanStatic();
					}
				}
			}
		}
		this.collisions = [];
		await this.readMapProperties();
		this.initializeCamera();
		await this.loadTextures();
		this.loadCollisions();
		for (i = -limit; i <= limit; i++) {
			for (j = -limit; j <= limit; j++) {
				for (k = -limit; k <= limit; k++) {
					const mapPortion = this.getMapPortion(i, j, k);
					if (mapPortion) {
						const portion = new Portion(
							this.currentPortion.x + i,
							this.currentPortion.y + j,
							this.currentPortion.z + k
						);
						const json = (await Platform.parseFileJSON(
							Paths.FILE_MAPS + this.mapFilename + '/' + portion.getFileName()
						)) as any;
						mapPortion.readStatic(json);
					}
				}
			}
		}
		this.loading = false;
	}

	/**
	 *  Generate the map name according to the ID.
	 *  @static
	 *  @param {number} id - ID of the map
	 *  @returns {string}
	 */
	static generateMapName(id: number): string {
		return 'MAP' + Utils.formatNumber(id, 4);
	}

	/**
	 *  Read the map properties file.
	 */
	async readMapProperties(minimal: boolean = false) {
		const json = (await Platform.parseFileJSON(Paths.FILE_MAPS + this.mapFilename + Paths.FILE_MAP_INFOS)) as any;
		if (this.isBattleMap && json.tileset === undefined) {
			Platform.showErrorMessage(
				'The battle map ' + this.id + " doesn't " + 'exists. Please check your battle maps.'
			);
		}
		this.mapProperties = new Model.MapProperties(json);
		await this.mapProperties.load();
		if (!minimal) {
			this.mapProperties.updateBackground();
		}
	}

	/**
	 *  Get all the possible targets of a skill.
	 *  @param {TARGET_KIND} targetKind
	 *  @returns {Player[]}
	 */
	getPossibleTargets(targetKind: TARGET_KIND): Player[] {
		if (targetKind === TARGET_KIND.USER) {
			return this.user ? [this.user.player] : [];
		} else if (targetKind === TARGET_KIND.ALLY || targetKind === TARGET_KIND.ALL_ALLIES) {
			return Game.current.teamHeroes;
		} else {
			return [];
		}
	}

	/**
	 *  Initialize sun light.
	 */
	initializeSunLight() {
		const ambient = new THREE.AmbientLight(0xffffff, this.mapProperties.isSunLight ? 1.2 : 2);
		this.scene.add(ambient);
		if (this.mapProperties.isSunLight) {
			this.sunLight = new THREE.DirectionalLight(0xffffff, 2);
			this.sunLight.position.set(-1, 1.75, 1);
			this.sunLight.position.multiplyScalar(Data.Systems.SQUARE_SIZE * 10);
			this.sunLight.target.position.set(0, 0, 0);
			this.scene.add(this.sunLight);
			this.sunLight.castShadow = true;
			this.sunLight.shadow.mapSize.width = 2048;
			this.sunLight.shadow.mapSize.height = 2048;
			const d = Data.Systems.SQUARE_SIZE * 10;
			this.sunLight.shadow.camera.left = -d;
			this.sunLight.shadow.camera.right = d;
			this.sunLight.shadow.camera.top = d;
			this.sunLight.shadow.camera.bottom = -d;
			this.sunLight.shadow.camera.far = Data.Systems.SQUARE_SIZE * 350;
			this.sunLight.shadow.bias = -0.0003;
		}
	}

	/**
	 *  Initialize the map objects.
	 */
	initializeCamera() {
		this.camera = new Camera(this.mapProperties.cameraProperties, Game.current.hero);
		this.camera.update();
		this.currentPortion = Portion.createFromVector3(this.camera.getThreeCamera().position);
		this.previousCameraPosition = null;
		if (this.mapProperties.skyboxGeometry !== null) {
			this.previousCameraPosition = this.camera.getThreeCamera().position.clone();
			this.mapProperties.skyboxGeometry.translate(
				this.camera.getThreeCamera().position.x,
				this.camera.getThreeCamera().position.y,
				this.camera.getThreeCamera().position.z
			);
		}
	}

	/**
	 *  Initialize all the objects moved or / and with changed states.
	 */
	initializePortionsObjects() {
		const mapsData = Game.current.mapsData[this.id];
		let datas = null;
		const l = Math.ceil(this.mapProperties.length / Constants.PORTION_SIZE);
		const w = Math.ceil(this.mapProperties.width / Constants.PORTION_SIZE);
		const d = Math.ceil(this.mapProperties.depth / Constants.PORTION_SIZE);
		const h = Math.ceil(this.mapProperties.height / Constants.PORTION_SIZE);
		const objectsPortions = new Array(l);
		let i: number, j: number, jp: number, k: number, jabs: number;
		for (i = 0; i < l; i++) {
			objectsPortions[i] = new Array(2);
			objectsPortions[i][0] = new Array(d); // Depth
			objectsPortions[i][1] = new Array(h); // Height
			for (j = -d; j < h; j++) {
				jp = j < 0 ? 0 : 1;
				jabs = Math.abs(j);
				objectsPortions[i][jp][jabs] = new Array(w);
				for (k = 0; k < w; k++) {
					datas =
						mapsData && mapsData[i] && mapsData[i][jp] && mapsData[i][jp][jabs]
							? mapsData[i][jp][jabs][k]
							: null;
					objectsPortions[i][jp][jabs][k] = {
						min: datas && datas.min ? datas.min : [],
						// All the moved objects that are in this
						// portion
						mout: datas && datas.mout ? datas.mout : [],
						// All the moved objects that are from another
						// portion
						m: datas && datas.m ? datas.m : [],
						// All the moved objects that are from this
						// portion
						si: datas && datas.si ? datas.si : [],
						// Ids of the objects that have modified states
						s: datas && datas.s ? datas.s : [],
						// States of the objects according to id
						pi: datas && datas.pi ? datas.pi : [],
						// Ids of the objects that have modified properties
						p: datas && datas.p ? datas.p : [],
						// Properties values of the objects according to id
						r: datas && datas.r ? datas.r : [],
						// Removed objects according to id
						soi: datas && datas.soi ? datas.soi : [],
						// Ids of the objects that have modified states options
						so: datas && datas.so ? datas.so : [],
						// States options of the objects according to id
					};
				}
			}
		}
		Game.current.mapsData[this.id] = objectsPortions;
		this.portionsObjectsUpdated = true;
	}

	/**
	 *  Load all the textures of the map.
	 */
	async loadTextures() {
		const tileset = this.mapProperties.tileset;
		const path = tileset.getPath();
		this.textureTileset = path ? await Manager.GL.loadTexture(path) : Manager.GL.loadTextureEmpty();
		const t: THREE.Texture = this.textureTileset.map;
		if (t.image.width % Data.Systems.SQUARE_SIZE !== 0 || t.image.height % Data.Systems.SQUARE_SIZE !== 0) {
			Platform.showErrorMessage(
				'Tileset in ' +
					path +
					' is not in a size multiple of ' +
					Data.Systems.SQUARE_SIZE +
					'. Please edit this picture size.'
			);
		}
		this.texturesCharacters = Data.Tilesets.texturesCharacters;
	}

	/**
	 *  Load the collisions settings.
	 */
	loadCollisions() {
		// Tileset
		const texture = Manager.GL.getMaterialTexture(this.textureTileset);
		if (this.mapProperties.tileset.picture && texture) {
			this.mapProperties.tileset.picture.readCollisionsImage(texture.image);
		}

		// Characters
		const pictures = Data.Pictures.getListByKind(PICTURE_KIND.CHARACTERS);
		const l = pictures.length;
		this.collisions[PICTURE_KIND.CHARACTERS] = new Array(l);
		let material: THREE.MeshPhongMaterial, image: HTMLImageElement, p: Model.Picture;
		for (let i = 1; i < l; i++) {
			material = this.texturesCharacters[i];
			const texture = Manager.GL.getMaterialTexture(material);
			if (texture) {
				image = texture.image;
			}
			p = pictures[i];
			if (p) {
				p.readCollisionsImage(image);
				this.collisions[PICTURE_KIND.CHARACTERS][i] = p.getSquaresForStates(image);
			} else {
				this.collisions[PICTURE_KIND.CHARACTERS][i] = null;
			}
		}
	}

	/**
	 *  Initialize the map portions.
	 */
	async initializePortions() {
		this.updateCurrentPortion();
		await this.loadPortions();

		// Hero initialize
		if (!this.isBattleMap) {
			await Game.current.hero.changeState();
			if (this.heroOrientation !== null) {
				Game.current.hero.orientation = this.heroOrientation;
				Game.current.hero.orientationEye = this.heroOrientation;
				Game.current.hero.updateUVs();
			}

			// Start music and background sound
			this.mapProperties.music.playMusic();
			this.mapProperties.backgroundSound.playMusic();

			// Background color update
			this.updateBackgroundColor();
		}
	}

	/**
	 *  Update previous and current portion and return true if current changed
	 *  from previous.
	 *  @returns {boolean}
	 */
	updateCurrentPortion(): boolean {
		if (!this.camera) {
			return false;
		}
		this.previousPortion = this.currentPortion;
		this.currentPortion = Portion.createFromVector3(this.camera.getThreeCamera().position);
		if (!this.previousPortion) {
			this.previousPortion = this.currentPortion;
		}
		return !this.previousPortion.equals(this.currentPortion);
	}

	/**
	 *  Get the portion file name.
	 *  @param {boolean} update - Indicate if the map portions array had previous
	 *  values.
	 */
	async loadPortions(update: boolean = false) {
		if (!update) {
			this.mapPortions = new Array(this.getMapPortionTotalSize());
		}
		const offsetX = this.currentPortion.x - this.previousPortion.x;
		const offsetY = this.currentPortion.y - this.previousPortion.y;
		const offsetZ = this.currentPortion.z - this.previousPortion.z;
		const limit = Data.Systems.PORTIONS_RAY;
		let i: number, j: number, k: number;
		if (!update) {
			for (i = -limit; i <= limit; i++) {
				for (j = -limit; j <= limit; j++) {
					for (k = -limit; k <= limit; k++) {
						await this.loadPortion(
							this.currentPortion.x + i,
							this.currentPortion.y + j,
							this.currentPortion.z + k,
							i,
							j,
							k
						);
					}
				}
			}
			return;
		}

		// Make a temp copy for moving stuff correctly
		const temp = new Array(this.mapPortions.length);
		for (let i = 0, l = this.mapPortions.length; i < l; i++) {
			temp[i] = this.mapPortions[i];
		}

		// Remove existing portions
		let x: number, y: number, z: number, oi: number, oj: number, ok: number;
		for (i = -limit; i <= limit; i++) {
			for (j = -limit; j <= limit; j++) {
				for (k = -limit; k <= limit; k++) {
					x = this.currentPortion.x + i;
					y = this.currentPortion.y + j;
					z = this.currentPortion.z + k;
					oi = i - offsetX;
					oj = j - offsetY;
					ok = k - offsetZ;
					// If with negative offset, out of ray boundaries, remove
					if (oi < -limit || oi > limit || oj < -limit || oj > limit || ok < -limit || ok > limit) {
						this.removePortion(i, j, k);
					}
				}
			}
		}
		// Move / Load
		for (i = -limit; i <= limit; i++) {
			for (j = -limit; j <= limit; j++) {
				for (k = -limit; k <= limit; k++) {
					x = this.currentPortion.x + i;
					y = this.currentPortion.y + j;
					z = this.currentPortion.z + k;
					oi = i - offsetX;
					oj = j - offsetY;
					ok = k - offsetZ;
					// If with negative offset, in ray boundaries, move
					if (oi >= -limit && oi <= limit && oj >= -limit && oj <= limit && ok >= -limit && ok <= limit) {
						const previousIndex = this.getPortionIndex(i, j, k);
						const newIndex = this.getPortionIndex(oi, oj, ok);
						this.mapPortions[newIndex] = temp[previousIndex];
					}
					oi = i + offsetX;
					oj = j + offsetY;
					ok = k + offsetZ;
					// If with positive offset, out of ray boundaries, load
					if (oi < -limit || oi > limit || oj < -limit || oj > limit || ok < -limit || ok > limit) {
						await this.loadPortion(x, y, z, i, j, k, true);
					}
				}
			}
		}
		this.loading = false;
	}

	/**
	 *  Load a portion.
	 *  @param {number} realX - The global x portion
	 *  @param {number} realY - The global y portion
	 *  @param {number} realZ - The global z portion
	 *  @param {number} x - The local x portion
	 *  @param {number} y - The local y portion
	 *  @param {number} z - The local z portion
	 *  @param {boolean} move - Indicate if the portion was moved or completely
	 *  loaded
	 */
	async loadPortion(
		realX: number,
		realY: number,
		realZ: number,
		x: number,
		y: number,
		z: number,
		move: boolean = false
	) {
		const lx = Math.ceil(this.mapProperties.length / Constants.PORTION_SIZE);
		const lz = Math.ceil(this.mapProperties.width / Constants.PORTION_SIZE);
		const ld = Math.ceil(this.mapProperties.depth / Constants.PORTION_SIZE);
		const lh = Math.ceil(this.mapProperties.height / Constants.PORTION_SIZE);
		if (realX >= 0 && realX < lx && realY >= -ld && realY < lh && realZ >= 0 && realZ < lz) {
			const portion = new Portion(realX, realY, realZ);
			const json = (await Platform.parseFileJSON(
				Paths.FILE_MAPS + this.mapFilename + '/' + portion.getFileName()
			)) as any;
			if (json.hasOwnProperty('lands')) {
				const mapPortion = new MapPortion(portion);
				this.setMapPortion(x, y, z, mapPortion, move);
				await mapPortion.read(json);
			} else {
				this.setMapPortion(x, y, z, null, move);
			}
		} else {
			this.setMapPortion(x, y, z, null, move);
		}
	}

	/**
	 *  Load a portion from a portion.
	 *  @param {Portion} portion - The portion
	 *  @param {number} x - The local x portion
	 *  @param {number} y - The local y portion
	 *  @param {number} z - The local z portion
	 *  @param {boolean} move - Indicate if the portion was moved or completely
	 *  loaded
	 */
	async loadPortionFromPortion(portion: Portion, x: number, y: number, z: number, move: boolean) {
		await this.loadPortion(portion.x + x, portion.y + y, portion.z + z, x, y, z, move);
	}

	/**
	 *  Remove a portion.
	 *  @param {number} x - The local x portion
	 *  @param {number} y - The local y portion
	 *  @param {number} z - The local z portion
	 */
	removePortion(x: number, y: number, z: number) {
		const index = this.getPortionIndex(x, y, z);
		const mapPortion = this.mapPortions[index];
		if (mapPortion !== null) {
			mapPortion.cleanAll();
			this.mapPortions[index] = null;
		}
	}

	/**
	 *  Set a portion.
	 *  @param {number} i - The previous x portion
	 *  @param {number} j - The previous y portion
	 *  @param {number} k - The previous z portion
	 *  @param {number} m - The new x portion
	 *  @param {number} n - The new y portion
	 *  @param {number} o - The new z portion
	 */
	setPortion(i: number, j: number, k: number, m: number, n: number, o: number) {
		this.setMapPortion(i, j, k, this.getMapPortion(m, n, o), true);
	}

	/**
	 *  Set a portion.
	 *  @param {number} x - The local x portion
	 *  @param {number} y - The local y portion
	 *  @param {number} z - The local z portion
	 *  @param {MapPortion} mapPortion - The new map portion
	 *  @param {boolean} move - Indicate if the portion was moved or completely
	 *  loaded
	 */
	setMapPortion(x: number, y: number, z: number, mapPortion: MapPortion, move: boolean) {
		const index = this.getPortionIndex(x, y, z);
		const currentMapPortion = this.mapPortions[index];
		if (currentMapPortion && !move) {
			currentMapPortion.cleanAll();
		}
		this.mapPortions[index] = mapPortion;
	}

	/**
	 *  Get the objects at a specific portion.
	 *  @param {Portion} portion
	 *  @returns {Record<string, any>}
	 */
	getObjectsAtPortion(portion: Portion): Record<string, any> {
		return Game.current.getPortionData(this.id, portion);
	}

	/**
	 *  Get a map portion at local postions.
	 *  @param {number} x - The local x portion
	 *  @param {number} y - The local y portion
	 *  @param {number} z - The local z portion
	 *  @returns {MapPortion}
	 */
	getMapPortion(x: number, y: number, z: number): MapPortion {
		return this.getBrutMapPortion(this.getPortionIndex(x, y, z));
	}

	/**
	 *  Get a map portion at local portion.
	 *  @param {Portion} portion - The local portion
	 *  @returns {MapPortion}
	 */
	getMapPortionFromPortion(portion: Portion): MapPortion {
		return this.getMapPortion(portion.x, portion.y, portion.z);
	}

	/**
	 *  Get a map portion at json position.
	 *  @param {Position} position - The position
	 *  @returns {MapPortion}
	 */
	getMapPortionByPosition(position: Position): MapPortion {
		return this.getMapPortionFromPortion(this.getLocalPortion(position.getGlobalPortion()));
	}

	/**
	 *  Get map portion according to portion index.
	 *  @param {number} index - The portion index
	 *  @returns {MapPortion}
	 */
	getBrutMapPortion(index: number): MapPortion {
		return this.mapPortions[index];
	}

	/**
	 *  Get portion index according to local positions of portion.
	 *  @param {number} x - The local x position of portion
	 *  @param {number} y - The local y position of portion
	 *  @param {number} z - The local z position of portion
	 *  @returns {number}
	 */
	getPortionIndex(x: number, y: number, z: number): number {
		const size = this.getMapPortionSize();
		const limit = Data.Systems.PORTIONS_RAY;
		return (x + limit) * size * size + (y + limit) * size + (z + limit);
	}

	/**
	 *  Get portion index according to local portion.
	 *  @param {Portion} portion - The local portion
	 *  @returns {number}
	 */
	getPortionIndexFromPortion(portion: Portion): number {
		return this.getPortionIndex(portion.x, portion.y, portion.z);
	}

	/**
	 *  Set a local portion with a global portion.
	 *  @param {Portion} portion - The global portion
	 *  @returns {Portion}
	 */
	getLocalPortion(portion: Portion): Portion {
		return new Portion(
			portion.x - this.currentPortion.x,
			portion.y - this.currentPortion.y,
			portion.z - this.currentPortion.z
		);
	}

	/**
	 *  Get the map portions size.
	 *  @returns {number}
	 */
	getMapPortionSize(): number {
		return Data.Systems.PORTIONS_RAY * 2 + 1;
	}

	/**
	 *  Get the map portion total size.
	 *  @returns {number}
	 */
	getMapPortionTotalSize(): number {
		const size = this.getMapPortionSize();
		const limit = Data.Systems.PORTIONS_RAY;
		return limit * 2 * size * size + limit * 2 * size + limit * 2;
	}

	/**
	 *  Check if a local portion if in the limit
	 *  @param {Portion} portion - The local portion
	 *  @returns {boolean}
	 */
	isInPortion(portion: Portion): boolean {
		const limit = Data.Systems.PORTIONS_RAY;
		return (
			portion.x >= -limit &&
			portion.x <= limit &&
			portion.y >= -limit &&
			portion.y <= limit &&
			portion.z >= -limit &&
			portion.z <= limit
		);
	}

	/**
	 *  Check if a position is in the map.
	 *  @param {Position} position - The json position
	 *  @returns {boolean}
	 */
	isInMap(position: Position): boolean {
		return (
			position.x >= 0 &&
			position.x < this.mapProperties.length &&
			position.z >= 0 &&
			position.z < this.mapProperties.width
		);
	}

	/**
	 *  Get the hero position according to battle map.
	 *  @returns {THREE.Vector3}
	 */
	getHeroPosition(): THREE.Vector3 {
		return this.isBattleMap ? Game.current.heroBattle.position : Game.current.hero.position;
	}

	/**
	 *  Update the background color.
	 */
	updateBackgroundColor() {
		this.mapProperties.updateBackgroundColor();
		Manager.GL.updateBackgroundColor(this.mapProperties.backgroundColor);
	}

	/**
	 *  Load collision for special elements.
	 *  @param {number[]} list - The IDs list
	 *  @param {PICTURE_KIND} kind - The picture kind
	 *  @param {SpecialElement[]} specials - The specials list
	 */
	loadSpecialsCollision(list: number[], kind: PICTURE_KIND, specials: Model.SpecialElement[]) {
		let special: Model.SpecialElement, picture: Model.Picture;
		for (let i = 0, l = list.length; i < l; i++) {
			const id = list[i];
			special = specials[id];
			if (special) {
				let pictureID = undefined;
				switch (kind) {
					case PICTURE_KIND.AUTOTILES:
						pictureID = Game.current.textures.autotiles[id];
						break;
					case PICTURE_KIND.MOUNTAINS:
						pictureID = Game.current.textures.mountains[id];
						break;
					case PICTURE_KIND.WALLS:
						pictureID = Game.current.textures.walls[id];
						break;
					case PICTURE_KIND.OBJECTS_3D:
						pictureID = Game.current.textures.objects3D[id];
						break;
				}
				if (pictureID === undefined) {
					pictureID = special.pictureID;
				}
				picture = Data.Pictures.get(kind, pictureID);
				if (picture) {
					picture.readCollisions();
				}
			}
		}
	}

	/**
	 *  Update portions according to a callback.
	 */
	updatePortions(base: object, callback: Function) {
		const limit = Data.Systems.PORTIONS_RAY;
		const lx = Math.ceil(this.mapProperties.length / Constants.PORTION_SIZE);
		const lz = Math.ceil(this.mapProperties.width / Constants.PORTION_SIZE);
		const ld = Math.ceil(this.mapProperties.depth / Constants.PORTION_SIZE);
		const lh = Math.ceil(this.mapProperties.height / Constants.PORTION_SIZE);
		let i: number, j: number, k: number, x: number, y: number, z: number;
		for (i = -limit; i <= limit; i++) {
			for (j = -limit; j <= limit; j++) {
				for (k = -limit; k <= limit; k++) {
					x = this.currentPortion.x + i;
					y = this.currentPortion.y + j;
					z = this.currentPortion.z + k;
					if (x >= 0 && x < lx && y >= -ld && y < lh && z >= 0 && z < lz) {
						callback.call(base, x, y, z, i, j, k);
					}
				}
			}
		}
	}

	/**
	 *  Get a random particle weather position according to options.
	 *  @param {number} portionsRay
	 *  @param {boolean} [offset=true]
	 *  @returns {number}
	 */
	getWeatherPosition(portionsRay: number, offset: boolean = true): number {
		return (
			Math.random() * (Data.Systems.SQUARE_SIZE * Data.Systems.SQUARE_SIZE * (portionsRay * 2 + 1)) -
			Data.Systems.SQUARE_SIZE * Data.Systems.SQUARE_SIZE * (portionsRay + (offset ? 0.5 : 0))
		);
	}

	/**
	 *  Create the weather mesh system.
	 */
	createWeather(current: boolean = true) {
		let options: Record<string, any>,
			points: THREE.Points,
			velocities: number[],
			rotationsAngle: number[],
			rotationsPoints: THREE.Vector3[];
		if (current) {
			options = Game.current.currentWeatherOptions;
		} else {
			options = Game.current.previousWeatherOptions;
		}
		if (options === null || options.isNone) {
			return;
		}
		// Create the weather variables
		const vertices = [];
		velocities = [];
		rotationsAngle = [];
		rotationsPoints = [];
		Interpreter.evaluate(
			'Scene.Map.current.add' +
				(current ? '' : 'Previous') +
				'WeatherYRotation=function(){return ' +
				options.yRotationAddition +
				';}',
			{ addReturn: false }
		);
		Interpreter.evaluate(
			'Scene.Map.current.add' +
				(current ? '' : 'Previous') +
				'WeatherVelocityn=function(){return ' +
				options.velocityAddition +
				';}',
			{ addReturn: false }
		);
		let initialVelocity = Interpreter.evaluate(options.initialVelocity) as number;
		initialVelocity *= Data.Systems.SQUARE_SIZE / Constants.BASIC_SQUARE_SIZE;
		const initialYRotation = Interpreter.evaluate(options.initialYRotation) as number;
		const portionsRay = options.portionsRay;
		const particlesNumber = options.finalParticlesNumber;
		for (let i = 0; i < particlesNumber; i++) {
			const x = this.getWeatherPosition(portionsRay);
			const y = this.getWeatherPosition(portionsRay, false);
			const z = this.getWeatherPosition(portionsRay);
			vertices.push(x, y, z);
			velocities.push(initialVelocity);
			rotationsAngle.push(initialYRotation);
			rotationsPoints.push(Scene.Map.current.camera.target.position.clone());
		}
		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
		const material = new THREE.PointsMaterial({
			color: options.isColor ? Data.Systems.getColor(options.colorID).getHex() : 0xffffff,
			size: options.size,
			transparent: true,
			depthTest: options.depthTest,
			depthWrite: options.depthWrite,
		});
		if (!options.isColor) {
			const texture = new THREE.TextureLoader().load(
				Data.Pictures.get(PICTURE_KIND.PARTICLES, options.imageID).getPath()
			);
			texture.magFilter = THREE.NearestFilter;
			texture.minFilter = THREE.NearestFilter;
			material.map = texture;
		}
		points = new THREE.Points(geometry, material);
		points.position.set(
			Scene.Map.current.camera.target.position.x,
			Scene.Map.current.camera.target.position.y,
			Scene.Map.current.camera.target.position.z
		);
		points.renderOrder = 1;
		this.scene.add(points);
		if (current) {
			this.weatherPoints = points;
			this.weatherVelocities = velocities;
			this.weatherRotationsAngle = rotationsAngle;
			this.weatherRotationsPoint = rotationsPoints;
		} else {
			this.previousWeatherPoints = points;
			this.previousWeatherVelocities = velocities;
			this.previousWeatherRotationsAngle = rotationsAngle;
			this.previousWeatherRotationsPoint = rotationsPoints;
		}
	}

	/**
	 *  Function to overwrite with interpreter to add rotation to particles.
	 */
	addPreviousWeatherYRotation() {
		return 0;
	}

	/**
	 *  Function to overwrite with interpreter to add velocity to particles.
	 */
	addPreviousWeatherVelocity() {
		return 0;
	}

	/**
	 *  Function to overwrite with interpreter to add rotation to particles.
	 */
	addWeatherYRotation() {
		return 0;
	}

	/**
	 *  Function to overwrite with interpreter to add velocity to particles.
	 */
	addWeatherVelocity() {
		return 0;
	}

	switchPreviousWeather() {
		Game.current.previousWeatherOptions = Game.current.currentWeatherOptions;
		this.previousWeatherPoints = this.weatherPoints;
		this.previousWeatherVelocities = this.weatherVelocities;
		this.previousWeatherRotationsAngle = this.weatherRotationsAngle;
		this.previousWeatherRotationsPoint = this.weatherRotationsPoint;
		this.addPreviousWeatherVelocity = this.addWeatherVelocity;
		this.addPreviousWeatherYRotation = this.addWeatherYRotation;
	}

	/**
	 *  Update the weather particles moves.
	 */
	updateWeather(current: boolean = true) {
		let options: Record<string, any>,
			points: THREE.Points,
			velocities: number[],
			rotationsAngle: number[],
			rotationsPoints: THREE.Vector3[];
		if (current) {
			options = Game.current.currentWeatherOptions;
			points = this.weatherPoints;
			velocities = this.weatherVelocities;
			rotationsAngle = this.weatherRotationsAngle;
			rotationsPoints = this.weatherRotationsPoint;
		} else {
			options = Game.current.previousWeatherOptions;
			points = this.previousWeatherPoints;
			velocities = this.previousWeatherVelocities;
			rotationsAngle = this.previousWeatherRotationsAngle;
			rotationsPoints = this.previousWeatherRotationsPoint;
		}
		if (options === null || options.isNone || !points) {
			return;
		}
		let initialVelocity = Interpreter.evaluate(options.initialVelocity) as number;
		initialVelocity *= Data.Systems.SQUARE_SIZE / Constants.BASIC_SQUARE_SIZE;
		const initialYRotation = Interpreter.evaluate(options.initialYRotation) as number;
		const portionsRay = options.portionsRay;
		const positionAttribute = points.geometry.getAttribute('position');
		const yAxis = new THREE.Vector3(0, 1, 0);
		const particlesNumber = Math.round(options.particlesNumber);
		points.geometry.drawRange.count = particlesNumber;
		let y: number, v: THREE.Vector3;
		for (let i = 0; i < particlesNumber; i++) {
			y = positionAttribute.getY(i);
			if (
				y <
				(<THREE.PointsMaterial>points.material).size -
					Data.Systems.SQUARE_SIZE * Data.Systems.SQUARE_SIZE * portionsRay
			) {
				y += Data.Systems.SQUARE_SIZE * Data.Systems.SQUARE_SIZE * (portionsRay + 1);
				velocities[i] = initialVelocity;
				rotationsAngle[i] = initialYRotation;
				rotationsPoints[i] = Scene.Map.current.camera.target.position.clone();
				positionAttribute.setX(i, this.getWeatherPosition(portionsRay));
				positionAttribute.setZ(i, this.getWeatherPosition(portionsRay));
			}
			y -= Scene.Map.current.camera.target.position.y - points.position.y;
			v = new THREE.Vector3(
				positionAttribute.getX(i) - (Scene.Map.current.camera.target.position.x - points.position.x),
				y,
				positionAttribute.getZ(i) - (Scene.Map.current.camera.target.position.z - points.position.z)
			);
			rotationsAngle[i] +=
				((current ? this.addWeatherYRotation() : this.addPreviousWeatherYRotation()) * Math.PI) / 180;
			v.applyAxisAngle(yAxis, rotationsAngle[i]);
			positionAttribute.setX(i, v.x);
			positionAttribute.setZ(i, v.z);
			velocities[i] +=
				(current ? this.addWeatherVelocity() : this.addPreviousWeatherVelocity()) *
				(Data.Systems.SQUARE_SIZE / Constants.BASIC_SQUARE_SIZE);
			positionAttribute.setY(i, v.y + velocities[i]);
		}
		positionAttribute.needsUpdate = true;
		points.position.set(
			Scene.Map.current.camera.target.position.x,
			Scene.Map.current.camera.target.position.y,
			Scene.Map.current.camera.target.position.z
		);
	}

	/**
	 *  Update and move the camera position for hiding stuff.
	 *  @param {THREE.Vector2} pointer 2D position on screen to test if intersect
	 */
	updateCameraHiding(pointer: THREE.Vector2) {
		Manager.GL.raycaster.setFromCamera(pointer, this.camera.getThreeCamera());
		Manager.GL.raycaster.layers.set(1);
		const intersects = Manager.GL.raycaster.intersectObjects(this.scene.children);
		let distance: number;
		for (let i = 0; i < intersects.length; i++) {
			distance = Math.ceil(intersects[i].distance) + 5;
			if (
				distance < this.camera.distance &&
				(!this.camera.isHiding() || this.camera.distance - distance < this.camera.hidingDistance)
			) {
				this.camera.hidingDistance = this.camera.distance - distance;
			}
		}
	}

	/**
	 *  Update the scene.
	 */
	update() {
		// Mouse down repeat
		if (!this.loading) {
			if (!ReactionInterpreter.blockingHero && !this.isBattleMap) {
				Manager.Events.sendEvent(
					null,
					2,
					0,
					true,
					5,
					Utils.arrayToMap([
						Model.DynamicValue.createNumber(Inputs.mouseX),
						Model.DynamicValue.createNumber(Inputs.mouseY),
						Model.DynamicValue.createSwitch(Inputs.mouseLeftPressed),
						Model.DynamicValue.createSwitch(true),
					]),
					true,
					false
				);
			}
		}

		// Update autotiles animated
		if (Scene.Map.autotileFrame.update()) {
			Scene.Map.autotilesOffset.setY(
				(Scene.Map.autotileFrame.value * Autotiles.COUNT_LIST * 2 * Data.Systems.SQUARE_SIZE) /
					Constants.MAX_PICTURE_SIZE
			);
		}

		// Update camera
		this.camera.forceNoHide = true;
		this.camera.update();

		// Update skybox
		if (this.mapProperties.skyboxGeometry !== null && this.previousCameraPosition) {
			const posDif = this.camera.getThreeCamera().position.clone().sub(this.previousCameraPosition);
			this.mapProperties.skyboxGeometry.translate(posDif.x, posDif.y, posDif.z);
			this.previousCameraPosition = this.camera.getThreeCamera().position.clone();
		}

		// Getting the Y angle of the camera
		const vector = new THREE.Vector3();
		this.camera.getThreeCamera().getWorldDirection(vector);
		const angle = Math.atan2(vector.x, vector.z) + Math.PI;

		// Update the objects
		if (Game.current !== null) {
			Game.current.hero.update(angle);
		}
		this.updatePortions(this, function (x: number, y: number, z: number, i: number, j: number, k: number) {
			const objects = Game.current.getPortionData(this.id, new Portion(x, y, z));
			let movedObjects = objects.min;
			let p: number, l: number;
			for (p = 0, l = movedObjects.length; p < l; p++) {
				movedObjects[p].update(angle);
			}
			movedObjects = objects.mout;
			for (p = 0, l = movedObjects.length; p < l; p++) {
				movedObjects[p].update(angle);
			}

			// Update face sprites
			const mapPortion = this.getMapPortion(i, j, k);
			if (mapPortion) {
				mapPortion.updateFaceSprites(angle);
			}
		});

		this.updateWeather(false);
		this.updateWeather();

		// Update scene game (interpreters)
		this.mapProperties.startupObject.update();
		super.update();

		// Update camera hiding
		if (Game.current !== null && (Data.Systems.moveCameraOnBlockView.getValue() as number)) {
			this.camera.forceNoHide = false;
			this.camera.hidingDistance = -1;
			const pointer = Manager.GL.toScreenPosition(
				this.camera.target.position
					.clone()
					.add(new THREE.Vector3(0, this.camera.target.height * Data.Systems.SQUARE_SIZE, 0)),
				this.camera.getThreeCamera()
			)
				.divide(new THREE.Vector2(ScreenResolution.CANVAS_WIDTH, ScreenResolution.CANVAS_HEIGHT))
				.subScalar(0.5);
			pointer.setY(-pointer.y);
			this.updateCameraHiding(pointer);
			if (this.camera.isHiding()) {
				this.updateCameraHiding(new THREE.Vector2(0, 0));
				this.camera.update();
			}
			let opacity = 1;
			if (this.camera.isHiding()) {
				if (this.camera.hidingDistance < 2 * Data.Systems.SQUARE_SIZE) {
					if (this.camera.hidingDistance < Data.Systems.SQUARE_SIZE) {
						opacity = 0;
					} else {
						opacity = 0.5;
					}
				}
			}
			if (Game.current && Game.current.hero.mesh) {
				Game.current.hero.mesh.material.opacity = opacity;
			}
			this.camera.updateTimer();
		}

		// Update portion
		if (Scene.Map.current.updateCurrentPortion()) {
			this.loadPortions(true);
			this.loading = true;
		}
	}

	/**
	 *  Handle scene key pressed.
	 *  @param {number} key - The key ID
	 */
	onKeyPressed(key: string) {
		if (!this.loading) {
			// Send keyPressEvent to all the objects
			if (!ReactionInterpreter.blockingHero && !this.isBattleMap) {
				Manager.Events.sendEvent(
					null,
					2,
					0,
					true,
					3,
					Utils.arrayToMap([
						Model.DynamicValue.createMessage(key),
						Model.DynamicValue.createSwitch(false),
						Model.DynamicValue.createSwitch(false),
					]),
					true,
					false
				);
			}
			super.onKeyPressed(key);
		}
	}

	/**
	 *  Handle scene key released.
	 *  @param {number} key - The key ID
	 */
	onKeyReleased(key: string) {
		if (!this.loading) {
			// Send keyReleaseEvent to all the objects
			if (!ReactionInterpreter.blockingHero && !this.isBattleMap) {
				Manager.Events.sendEvent(
					null,
					2,
					0,
					true,
					4,
					Utils.arrayToMap([Model.DynamicValue.createMessage(key)]),
					true,
					false
				);
			}
			super.onKeyReleased(key);
		}
	}

	/**
	 *  Handle scene pressed repeat key.
	 *  @param {number} key - The key ID
	 *  @returns {boolean}
	 */
	onKeyPressedRepeat(key: string): boolean {
		if (!this.loading) {
			if (!ReactionInterpreter.blockingHero && !this.isBattleMap) {
				Manager.Events.sendEvent(
					null,
					2,
					0,
					true,
					3,
					Utils.arrayToMap([
						Model.DynamicValue.createMessage(key),
						Model.DynamicValue.createSwitch(true),
						Model.DynamicValue.createSwitch(true),
					]),
					true,
					false
				);
			}
			return super.onKeyPressedRepeat(key);
		}
		return true;
	}

	/**
	 *  Handle scene pressed and repeat key.
	 *  @param {number} key - The key ID
	 *  @returns {boolean}
	 */
	onKeyPressedAndRepeat(key: string): boolean {
		if (!this.loading) {
			if (!ReactionInterpreter.blockingHero && !this.isBattleMap) {
				Manager.Events.sendEvent(
					null,
					2,
					0,
					true,
					3,
					Utils.arrayToMap([
						Model.DynamicValue.createMessage(key),
						Model.DynamicValue.createSwitch(true),
						Model.DynamicValue.createSwitch(false),
					]),
					true,
					false
				);
			}
			super.onKeyPressedAndRepeat(key);
		}
		return true;
	}

	/**
	 *  Mouse down handle for the scene.
	 *  @param {number} x - The x mouse position on screen
	 *  @param {number} y - The y mouse position on screen
	 */
	onMouseDown(x: number, y: number) {
		if (!this.loading) {
			if (!ReactionInterpreter.blockingHero && !this.isBattleMap) {
				Manager.Events.sendEvent(
					null,
					2,
					0,
					true,
					5,
					Utils.arrayToMap([
						Model.DynamicValue.createNumber(x),
						Model.DynamicValue.createNumber(y),
						Model.DynamicValue.createSwitch(Inputs.mouseLeftPressed),
						Model.DynamicValue.createSwitch(false),
					]),
					true,
					false
				);
			}
			super.onMouseDown(x, y);
		}
	}

	/**
	 *  Mouse move handle for the scene.
	 *  @param {number} x - The x mouse position on screen
	 *  @param {number} y - The y mouse position on screen
	 */
	onMouseMove(x: number, y: number) {
		if (!this.loading) {
			if (!ReactionInterpreter.blockingHero && !this.isBattleMap) {
				Manager.Events.sendEvent(
					null,
					2,
					0,
					true,
					7,
					Utils.arrayToMap([Model.DynamicValue.createNumber(x), Model.DynamicValue.createNumber(y)]),
					true,
					false
				);
			}
			super.onMouseMove(x, y);
		}
	}

	/**
	 *  Mouse up handle for the scene.
	 *  @param {number} x - The x mouse position on screen
	 *  @param {number} y - The y mouse position on screen
	 */
	onMouseUp(x: number, y: number) {
		if (!this.loading) {
			if (!ReactionInterpreter.blockingHero && !this.isBattleMap) {
				Manager.Events.sendEvent(
					null,
					2,
					0,
					true,
					6,
					Utils.arrayToMap([
						Model.DynamicValue.createNumber(x),
						Model.DynamicValue.createNumber(y),
						Model.DynamicValue.createSwitch(Inputs.mouseLeftPressed),
					]),
					true,
					false
				);
			}
			super.onMouseUp(x, y);
		}
	}

	/**
	 *  Draw the 3D scene.
	 */
	draw3D() {
		Manager.GL.renderer.clear();
		Manager.GL.renderer.render(this.scene, this.camera.getThreeCamera());
	}

	/**
	 *  Close the map.
	 */
	close() {
		const l = Math.ceil(this.mapProperties.length / Constants.PORTION_SIZE);
		const w = Math.ceil(this.mapProperties.width / Constants.PORTION_SIZE);
		const d = Math.ceil(this.mapProperties.depth / Constants.PORTION_SIZE);
		const h = Math.ceil(this.mapProperties.height / Constants.PORTION_SIZE);
		let i: number, j: number, k: number, portion: Record<string, any>, x: number;
		for (i = 0; i < l; i++) {
			for (j = -d; j < h; j++) {
				for (k = 0; k < w; k++) {
					portion = Game.current.getPortionPosData(this.id, i, j, k);
					for (x = portion.min.length - 1; x >= 0; x--) {
						if (!portion.min[x].currentState || !portion.min[x].currentStateInstance.keepPosition) {
							portion.min.splice(x, 1);
						} else {
							portion.min[x].removeFromScene();
						}
					}
					for (x = portion.mout.length - 1; x >= 0; x--) {
						if (!portion.mout[x].currentState || !portion.mout[x].currentStateInstance.keepPosition) {
							portion.mout.splice(x, 1);
						} else {
							portion.mout[x].removeFromScene();
						}
					}
					for (x = portion.m.length - 1; x >= 0; x--) {
						if (!portion.m[x].currentState || !portion.m[x].currentStateInstance.keepPosition) {
							portion.m.splice(x, 1);
						} else {
							portion.m[x].removeFromScene();
						}
					}
					portion.r = [];
				}
			}
		}

		// Clear scene
		for (i = this.scene.children.length - 1; i >= 0; i--) {
			this.scene.remove(this.scene.children[i]);
		}

		// Clear bounding boxes
		Manager.Collisions.applyBoxSpriteTransforms(Manager.Collisions.BB_BOX, [0, 0, 0, 1, 1, 1, 0, 0, 0]);
		Manager.Collisions.applyOrientedBoxTransforms(Manager.Collisions.BB_ORIENTED_BOX, [0, 0, 0, 2, 1, 1, 0, 0, 0]);
	}
}

export { Map };
