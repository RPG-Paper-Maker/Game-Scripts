/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Constants, MAP_TRANSITION_KIND, Mathf, PICTURE_KIND, SONG_KIND, Utils } from '../Common';
import { Game, Position } from '../Core';
import { MapObject } from '../Core/MapObject';
import { Datas, Manager, Scene, System } from '../index';
import { Base } from './Base';
import { CameraProperties } from './CameraProperties';
import { Color } from './Color';
import { DynamicValue } from './DynamicValue';
import { PlaySong } from './PlaySong';

/** @class
 *  The properties of a map.
 *  @extends System.Base
 */
class MapProperties extends Base {
	public id: number;
	public names: System.Translatable;
	public length: number;
	public width: number;
	public height: number;
	public depth: number;
	public tileset: System.Tileset;
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
	public randomBattleMapID: System.DynamicValue;
	public randomBattles: System.RandomBattle[];
	public randomBattleNumberStep: System.DynamicValue;
	public randomBattleVariance: System.DynamicValue;
	public skyboxGeometry: THREE.BoxGeometry;
	public skyboxMesh: THREE.Mesh;
	public maxNumberSteps: number;
	public isSunLight: boolean;
	public allObjects: Position[];
	public maxObjectsID: number;

	constructor() {
		super();

		this.skyboxGeometry = null;
		this.skyboxMesh = null;
	}

	/**
	 *  Read the JSON associated to the map properties.
	 *  @param {Record<string, any>} - json Json object describing the map
	 *  properties
	 */
	read(json: Record<string, any>) {
		this.skyboxGeometry = null;
		this.skyboxMesh = null;
		this.id = json.id;
		this.names = new System.Translatable(json);
		this.length = json.l;
		this.width = json.w;
		this.height = json.h;
		this.depth = json.d;

		// Tileset: if not existing, by default select the first one
		let datas = Game.current.mapsProperties[this.id];
		if (datas === undefined) {
			datas = {};
		}
		this.tileset = Datas.Tilesets.get(Utils.defaultValue(datas.tileset, json.tileset));
		this.music = new PlaySong(SONG_KIND.MUSIC, Utils.defaultValue(datas.music, json.music));
		this.backgroundSound = new PlaySong(
			SONG_KIND.BACKGROUND_SOUND,
			Utils.defaultValue(datas.backgroundSound, json.bgs)
		);
		this.cameraProperties = Datas.Systems.getCameraProperties(
			Utils.defaultValue(datas.camera, DynamicValue.readOrDefaultDatabase(json.cp, 1).getValue())
		);
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
		const startupReactions = new System.MapObject(json.so);
		this.startupObject = new MapObject(startupReactions);
		this.startupObject.changeState();

		// Random battles
		this.randomBattleMapID = System.DynamicValue.readOrDefaultDatabase(json.randomBattleMapID);
		this.randomBattles = [];
		Utils.readJSONSystemList({
			list: Utils.defaultValue(json.randomBattles, []),
			listIndexes: this.randomBattles,
			cons: System.RandomBattle,
		});
		this.randomBattleNumberStep = System.DynamicValue.readOrDefaultNumber(json.randomBattleNumberStep, 300);
		this.randomBattleVariance = System.DynamicValue.readOrDefaultNumber(json.randomBattleVariance, 20);
		this.updateMaxNumberSteps();

		this.isSunLight = Utils.defaultValue(json.isl, true);

		this.readObjects(json);
	}

	/**
	 *  Initialize the map objects.
	 */
	readObjects(json: Record<string, any>) {
		const { objs } = json;
		const l = objs.length;
		this.allObjects = new Array(l + 1);
		let jsonObject: Record<string, any>;
		this.maxObjectsID = 1;
		for (let i = 0; i < l; i++) {
			jsonObject = objs[i];
			this.allObjects[jsonObject.id] = Position.createFromArray(jsonObject.p);
			if (jsonObject.id > this.maxObjectsID) {
				this.maxObjectsID = jsonObject.id;
			}
		}
	}

	/**
	 *  Update the background.
	 */
	updateBackground() {
		if (this.isBackgroundImage) {
			this.updateBackgroundImage();
		} else if (!this.isBackgroundColor) {
			this.updateBackgroundSkybox();
		}
		this.updateBackgroundColor();
	}

	/**
	 *  Update the background color.
	 */
	updateBackgroundColor() {
		this.backgroundColor = Datas.Systems.getColor(this.isBackgroundColor ? this.backgroundColorID.getValue() : 1);
	}

	/**
	 *  Update the background image.
	 */
	updateBackgroundImage() {
		const texture = Manager.GL.textureLoader.load(
			Datas.Pictures.get(PICTURE_KIND.PICTURES, this.backgroundImageID).getPath()
		);
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.NearestFilter;
		Scene.Map.current.scene.background = texture;
	}

	/**
	 *  Update the background skybox.
	 */
	updateBackgroundSkybox() {
		const size = (10000 * Datas.Systems.SQUARE_SIZE) / Constants.BASIC_SQUARE_SIZE;
		this.skyboxGeometry = new THREE.BoxGeometry(size, size, size);
		this.skyboxMesh = new THREE.Mesh(
			this.skyboxGeometry,
			Datas.Systems.getSkybox(this.backgroundSkyboxID.getValue()).createTextures()
		);
		Scene.Map.current.scene.add(this.skyboxMesh);
	}

	/**
	 *  Update the max steps numbers for starting a random battle.
	 */
	updateMaxNumberSteps() {
		for (const battle of this.randomBattles) {
			battle.resetCurrentNumberSteps();
		}
		this.maxNumberSteps = Mathf.variance(
			this.randomBattleNumberStep.getValue(),
			this.randomBattleVariance.getValue()
		);
	}

	/**
	 *  Check if a random battle can be started.
	 */
	checkRandomBattle() {
		let randomBattle: System.RandomBattle;
		let test = false;
		for (randomBattle of this.randomBattles) {
			randomBattle.updateCurrentNumberSteps();
			if (randomBattle.currentNumberSteps >= this.maxNumberSteps) {
				test = true;
			}
		}
		if (test) {
			randomBattle = null;
			const rand = Mathf.random(0, 100);
			let priority = 0;
			// Remove 0 priority or not reached current steps
			const battles = [];
			let total = 0;
			for (randomBattle of this.randomBattles) {
				randomBattle.updateCurrentPriority();
				if (randomBattle.currentPriority > 0 && randomBattle.currentNumberSteps >= this.maxNumberSteps) {
					battles.push(randomBattle);
					total += randomBattle.currentPriority;
				}
			}
			for (randomBattle of battles) {
				priority += (randomBattle.priority.getValue() / total) * 100;
				if (rand <= priority) {
					break;
				} else {
					randomBattle = null;
				}
			}
			if (randomBattle !== null) {
				this.updateMaxNumberSteps();
				const battleMap = Datas.BattleSystems.getBattleMap(this.randomBattleMapID.getValue());
				Game.current.heroBattle = new MapObject(Game.current.hero.system, battleMap.position.toVector3(), true);
				Manager.Stack.push(
					new Scene.Battle(
						randomBattle.troopID.getValue(),
						true,
						true,
						battleMap,
						MAP_TRANSITION_KIND.ZOOM,
						MAP_TRANSITION_KIND.ZOOM,
						null,
						null
					)
				);
			}
		}
	}

	close() {
		if (this.skyboxMesh !== null) {
			Scene.Map.current.scene.remove(this.skyboxMesh);
		}
	}
}

export { MapProperties };
