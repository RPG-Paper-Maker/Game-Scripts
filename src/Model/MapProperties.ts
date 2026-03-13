/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Constants, MAP_TRANSITION_KIND, Mathf, PICTURE_KIND, SONG_KIND, Utils } from '../Common';
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
		const texture = Manager.GL.textureLoader.load(
			Data.Pictures.get(PICTURE_KIND.PICTURES, this.backgroundImageID).getPath(),
		);
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.NearestFilter;
		Scene.Map.current.scene.background = texture;
	}

	/**
	 * Update the background skybox.
	 */
	updateBackgroundSkybox(): void {
		const size = (10000 * Data.Systems.SQUARE_SIZE) / Constants.BASIC_SQUARE_SIZE;
		this.skyboxGeometry = new THREE.BoxGeometry(size, size, size);
		this.skyboxMesh = new THREE.Mesh(
			this.skyboxGeometry,
			Data.Systems.getSkybox(this.backgroundSkyboxID.getValue() as number).createTextures(),
		);
		Scene.Map.current.scene.add(this.skyboxMesh);
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
		const rand = Mathf.random(0, 100);
		const battles = this.randomBattles.filter(
			(b) => b.currentPriority > 0 && b.currentNumberSteps >= this.maxNumberSteps,
		);
		const total = battles.reduce((sum, b) => sum + b.currentPriority, 0);

		let cumulative = 0;
		let chosen: RandomBattle | null = null;
		for (const battle of battles) {
			cumulative += ((battle.priority.getValue() as number) / total) * 100;
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
