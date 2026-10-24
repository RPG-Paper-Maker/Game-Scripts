/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Constants, DYNAMIC_VALUE_KIND, MAP_TRANSITION_KIND, Mathf, PICTURE_KIND, SONG_KIND, Utils } from '../Common';
import { Game, MapObject, Position } from '../Core';
import { Data, Manager, Scene } from '../index';
import { CameraProperties } from './CameraProperties';
import { Color } from './Color';
import { DynamicValue, DynamicValueJSON } from './DynamicValue';
import { Localization, LocalizationJSON } from './Localization';
import { MapObjectJSON, MapObject as ModelMapObject } from './MapObject';
import { PlaySong, PlaySongJSON } from './PlaySong';
import { RandomBattle, RandomBattleJSON } from './RandomBattle';
import { Tileset } from './Tileset';

/**
 * JSON structure describing map properties.
 */
export type MapPropertiesJSON = LocalizationJSON & {
	id: number;
	l: number;
	w: number;
	h: number;
	d: number;
	tileset: number;
	music: PlaySongJSON;
	bgs: PlaySongJSON;
	cp: DynamicValueJSON;
	isky: boolean;
	isi: boolean;
	sky?: DynamicValueJSON;
	ipid?: number;
	sbid?: DynamicValueJSON;
	so: MapObjectJSON;
	randomBattleMapID: DynamicValueJSON;
	randomBattles?: RandomBattleJSON[];
	randomBattleNumberStep?: DynamicValueJSON;
	randomBattleVariance?: DynamicValueJSON;
	isl?: boolean;
	sll?: { c?: DynamicValueJSON; i?: DynamicValueJSON; io?: DynamicValueJSON; it?: DynamicValueJSON };
	ial?: boolean;
	al?: { c?: DynamicValueJSON; i?: DynamicValueJSON; io?: DynamicValueJSON; it?: DynamicValueJSON };
	slx?: number;
	sly?: number;
	slyp?: number;
	slz?: number;
	slpu?: string;
	ols?: boolean;
	isFog?: boolean;
	fogColor?: DynamicValueJSON;
	fogIntensity?: DynamicValueJSON;
	screenToneRed?: DynamicValueJSON;
	screenToneGreen?: DynamicValueJSON;
	screenToneBlue?: DynamicValueJSON;
	screenToneGrey?: DynamicValueJSON;
	objs: { id: number; p: number[] }[];
};

/**
 * Represents the properties of a map.
 */
export class MapProperties extends Localization {
	public id: number;
	public length: number;
	public width: number;
	public height: number;
	public depth: number;
	public tileset: Tileset;
	public music: PlaySong;
	public backgroundSound: PlaySong;
	public cameraProperties: CameraProperties;
	public isBackgroundColor: boolean;
	public isBackgroundImage: boolean;
	public backgroundColorID: DynamicValue;
	public backgroundColor: Color;
	public backgroundImageID: number;
	public backgroundSkyboxID: DynamicValue;
	public startupObject: MapObject;
	public randomBattleMapID: DynamicValue;
	public randomBattles: RandomBattle[];
	public randomBattleNumberStep: DynamicValue;
	public randomBattleVariance: DynamicValue;
	public skyboxGeometry: THREE.BoxGeometry;
	public skyboxMesh: THREE.Mesh;
	public maxNumberSteps: number;
	public isSunLight: boolean;
	public sunlightColor: DynamicValue;
	public isAmbientLight: boolean;
	public ambientLightColor: DynamicValue;
	public ambientLightIntensity: DynamicValue;
	public ambientLightIntensityOffset: DynamicValue;
	public ambientLightIntensityTime: DynamicValue;
	public sunlightIntensity: DynamicValue;
	public sunlightIntensityOffset: DynamicValue;
	public sunlightIntensityTime: DynamicValue;
	public sunlightX: number;
	public sunlightY: number;
	public sunlightYPlus: number;
	public sunlightZ: number;
	public objectLightsShadows: boolean;
	public isFog: boolean;
	public fogColorID: DynamicValue;
	public fogIntensity: DynamicValue;
	public screenToneRed: DynamicValue;
	public screenToneGreen: DynamicValue;
	public screenToneBlue: DynamicValue;
	public screenToneGrey: DynamicValue;
	public allObjects: Map<number, Position>;
	public maxObjectsID: number;

	constructor(json?: MapPropertiesJSON) {
		super(json);
	}

	/**
	 * Load and initialize the startup object state.
	 */
	async load(): Promise<void> {
		await this.startupObject.changeState();
	}

	/**
	 * Update the background (color, image, or skybox).
	 */
	updateBackground(): void {
		if (this.isBackgroundImage) {
			this.updateBackgroundImage();
		} else if (!this.isBackgroundColor) {
			this.updateBackgroundSkybox();
		}
		this.updateBackgroundColor();
	}

	/**
	 * Update the background color.
	 */
	updateBackgroundColor(): void {
		this.backgroundColor = Data.Systems.getColor(
			this.isBackgroundColor ? (this.backgroundColorID.getValue() as number) : 1,
		);
	}

	/**
	 * Update the background image.
	 */
	updateBackgroundImage(): void {
		const picture = Data.Pictures.get(PICTURE_KIND.PICTURES, this.backgroundImageID);
		if (this.backgroundImageID === -1 || !picture?.getPath()) {
			Scene.Map.current.scene.background = new THREE.Color(0x000000);
			return;
		}
		const texture = Manager.GL.textureLoader.load(picture.getPath());
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.NearestFilter;
		texture.colorSpace = THREE.SRGBColorSpace;
		Scene.Map.current.scene.background = texture;
	}

	/**
	 * Update the background skybox.
	 */
	updateBackgroundSkybox(): void {
		const cameraFar = (this.cameraProperties.far.getValue() as number) / Constants.BASIC_SQUARE_SIZE;
		const size = (cameraFar * 2) / Math.sqrt(3);
		this.skyboxGeometry = new THREE.BoxGeometry(size, size, size);
		this.skyboxMesh = new THREE.Mesh(
			this.skyboxGeometry,
			Data.Systems.getSkybox(this.backgroundSkyboxID.getValue() as number).createTextures(),
		);
		Scene.Map.current.scene.add(this.skyboxMesh);
	}

	/**
	 * Update the fog of the current map.
	 */
	updateFog(): void {
		const map = Scene.Map.current;
		if (!map) {
			return;
		}
		if (this.isFog) {
			const color = Data.Systems.getColor(this.fogColorID.getValue() as number);
			map.scene.fog = new THREE.FogExp2(color.color.getHex(), this.fogIntensity.getValue() as number);
		} else {
			map.scene.fog = null;
		}
	}

	/**
	 * Apply this map's default screen tone to the renderer.
	 */
	updateScreenTone(): void {
		Manager.GL.screenTone.set(
			Math.max(Math.min((this.screenToneRed.getValue() as number) / 255, 1), -1),
			Math.max(Math.min((this.screenToneGreen.getValue() as number) / 255, 1), -1),
			Math.max(Math.min((this.screenToneBlue.getValue() as number) / 255, 1), -1),
			Math.max(Math.min(1 - (this.screenToneGrey.getValue() as number) / 100, 1), -1),
		);
		if (this.backgroundColor) {
			Manager.GL.updateBackgroundColor(this.backgroundColor);
		}
	}

	/**
	 * Update the max steps numbers for starting a random battle.
	 */
	updateMaxNumberSteps(): void {
		for (const battle of this.randomBattles) {
			battle.resetCurrentNumberSteps();
		}
		this.maxNumberSteps = Mathf.variance(
			this.randomBattleNumberStep.getValue() as number,
			this.randomBattleVariance.getValue() as number,
		);
	}

	/**
	 * Check if a random battle can be started.
	 */
	checkRandomBattle(): void {
		let triggered = false;
		for (const battle of this.randomBattles) {
			battle.updateCurrentNumberSteps();
			if (battle.currentNumberSteps >= this.maxNumberSteps) {
				triggered = true;
			}
		}
		if (!triggered) {
			return;
		}
		const rand = Mathf.random(1, 100);
		const battles = this.randomBattles.filter(
			(b) => b.currentPriority > 0 && b.currentNumberSteps >= this.maxNumberSteps,
		);
		const total = battles.reduce((sum, b) => sum + b.currentPriority, 0);

		let cumulative = 0;
		let chosen: RandomBattle | null = null;
		for (const battle of battles) {
			cumulative += (battle.currentPriority / total) * 100;
			if (rand <= cumulative) {
				chosen = battle;
				break;
			}
		}
		if (chosen) {
			this.updateMaxNumberSteps();
			const battleMap = Data.BattleSystems.getBattleMap(this.randomBattleMapID.getValue() as number);
			Game.current.heroBattle = new MapObject(Game.current.hero.system, battleMap.position.toVector3(), true);
			Manager.Stack.push(
				new Scene.Battle(
					chosen.troopID.getValue() as number,
					true,
					true,
					battleMap,
					MAP_TRANSITION_KIND.ZOOM,
					MAP_TRANSITION_KIND.ZOOM,
					null,
					null,
				),
			);
		}
	}

	/**
	 * Cleanup background elements.
	 */
	close(): void {
		if (this.skyboxMesh !== null) {
			Scene.Map.current.scene.remove(this.skyboxMesh);
		}
	}

	/**
	 * Initialize this map properties from JSON data.
	 */
	read(json: MapPropertiesJSON): void {
		super.read(json);
		this.skyboxGeometry = null;
		this.skyboxMesh = null;
		this.id = json.id;
		this.length = json.l;
		this.width = json.w;
		this.height = json.h;
		this.depth = json.d;

		// Tileset & stored map data
		const datas = Game.current.mapsProperties[this.id] ?? {};
		this.tileset = Data.Tilesets.get(Utils.valueOrDefault(datas.tileset, json.tileset));
		this.music = new PlaySong(SONG_KIND.MUSIC, Utils.valueOrDefault(datas.music, json.music));
		this.backgroundSound = new PlaySong(
			SONG_KIND.BACKGROUND_SOUND,
			Utils.valueOrDefault(datas.backgroundSound, json.bgs),
		);
		this.cameraProperties = Data.Systems.getCameraProperties(
			Utils.valueOrDefault(datas.camera, DynamicValue.readOrDefaultDatabase(json.cp, 1).getValue() as number),
		);

		// Background
		let kind = -1;
		if (datas.color !== undefined) {
			kind = 0;
		} else if (datas.skybox !== undefined) {
			kind = 1;
		}
		this.isBackgroundColor = kind === 0 ? true : json.isky;
		this.isBackgroundImage = kind !== -1 ? false : json.isi;
		if (this.isBackgroundColor) {
			this.backgroundColorID =
				datas.color === undefined ? new DynamicValue(json.sky) : DynamicValue.createNumber(datas.color);
		} else if (this.isBackgroundImage) {
			this.backgroundImageID = json.ipid;
		} else {
			this.backgroundSkyboxID =
				datas.skybox === undefined
					? DynamicValue.readOrDefaultDatabase(json.sbid)
					: DynamicValue.createNumber(datas.skybox);
		}

		// Startup object
		const startupReactions = new ModelMapObject(json.so);
		this.startupObject = new MapObject(startupReactions);

		// Random battles
		this.randomBattleMapID = DynamicValue.readOrDefaultDatabase(json.randomBattleMapID);
		this.randomBattles = Utils.readJSONList(json.randomBattles, RandomBattle);
		this.randomBattleNumberStep = DynamicValue.readOrDefaultNumber(json.randomBattleNumberStep, 300);
		this.randomBattleVariance = DynamicValue.readOrDefaultNumber(json.randomBattleVariance, 20);
		this.updateMaxNumberSteps();

		this.isSunLight = Utils.valueOrDefault(json.isl, true);
		this.sunlightColor = json.sll?.c
			? DynamicValue.readFromJSON(json.sll.c)
			: DynamicValue.create(DYNAMIC_VALUE_KIND.MESSAGE, '#ffffff');
		this.sunlightIntensity = DynamicValue.readOrDefaultNumberDouble(json.sll?.i, 2);
		this.sunlightIntensityOffset = DynamicValue.readOrDefaultNumberDouble(json.sll?.io, 0);
		this.sunlightIntensityTime = DynamicValue.readOrDefaultNumber(json.sll?.it, 0);
		this.isAmbientLight = Utils.valueOrDefault(json.ial, true);
		this.ambientLightColor = json.al?.c
			? DynamicValue.readFromJSON(json.al.c)
			: DynamicValue.create(DYNAMIC_VALUE_KIND.MESSAGE, '#ffffff');
		this.ambientLightIntensity = DynamicValue.readOrDefaultNumberDouble(
			json.al?.i,
			this.isSunLight ? Math.PI - 14 / 9 : Math.PI,
		);
		this.ambientLightIntensityOffset = DynamicValue.readOrDefaultNumberDouble(json.al?.io, 0);
		this.ambientLightIntensityTime = DynamicValue.readOrDefaultNumber(json.al?.it, 0);
		this.sunlightX = Utils.valueOrDefault(json.slx, -10);
		this.sunlightY = Utils.valueOrDefault(json.sly, 17);
		this.sunlightYPlus = Utils.valueOrDefault(json.slyp, Data.Systems.SQUARE_SIZE / 2);
		this.sunlightZ = Utils.valueOrDefault(json.slz, 10);
		if (json.slpu !== 'px') {
			if (this.sunlightX === -1 && this.sunlightY === 1 && this.sunlightZ === 1) {
				const totalY = (this.sunlightY + (json.slyp === undefined ? 75 : this.sunlightYPlus) / 100) * 10;
				this.sunlightX = -10;
				this.sunlightY = Math.floor(totalY);
				this.sunlightYPlus = (totalY - this.sunlightY) * Data.Systems.SQUARE_SIZE;
				this.sunlightZ = 10;
			} else {
				this.sunlightYPlus =
					((json.slyp === undefined ? 50 : this.sunlightYPlus) / 100) * Data.Systems.SQUARE_SIZE;
			}
		}
		this.objectLightsShadows = Utils.valueOrDefault(json.ols, true);
		this.isFog = Utils.valueOrDefault(json.isFog, false);
		this.fogColorID = DynamicValue.readOrDefaultDatabase(json.fogColor, 1);
		this.fogIntensity = DynamicValue.readOrDefaultNumber(json.fogIntensity, 0.06);
		this.screenToneRed = DynamicValue.readOrDefaultNumber(json.screenToneRed, 0);
		this.screenToneGreen = DynamicValue.readOrDefaultNumber(json.screenToneGreen, 0);
		this.screenToneBlue = DynamicValue.readOrDefaultNumber(json.screenToneBlue, 0);
		this.screenToneGrey = DynamicValue.readOrDefaultNumber(json.screenToneGrey, 0);
		this.readObjects(json);
	}

	/**
	 *  Initialize the map objects.
	 */
	private readObjects(json: MapPropertiesJSON): void {
		const { objs } = json;
		this.allObjects = new Map();
		this.maxObjectsID = 1;
		for (const jsonObject of objs) {
			this.allObjects.set(jsonObject.id, Position.createFromArray(jsonObject.p));
			if (jsonObject.id > this.maxObjectsID) {
				this.maxObjectsID = jsonObject.id;
			}
		}
	}
}
