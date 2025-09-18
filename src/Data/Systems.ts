/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform, ScreenResolution, SONG_KIND, Utils } from '../Common';
import { MapObject, Position } from '../Core';
import { Data, EventCommand, Manager, Scene } from '../index';
import {
	CameraProperties,
	Color,
	Currency,
	Detection,
	DynamicValue,
	DynamicValueJSON,
	FontName,
	InitialPartyMember,
	InventoryFilter,
	Localization,
	MainMenuCommand,
	PlaySong,
	Skybox,
	WindowSkin,
} from '../Model';

/** @class
 *   All the System datas.
 *   @static
 */
class Systems {
	public static SQUARE_SIZE: number;
	public static PORTIONS_RAY: number;
	public static FRAMES: number;
	public static PATH_BR: string;
	public static PATH_DLCS: string;
	public static ID_MAP_START_HERO: number;
	public static heroMapPosition: Position;
	public static projectName: Localization;
	public static antialias: boolean;
	public static isMouseControls: boolean;
	public static mountainCollisionHeight: DynamicValue;
	public static mountainCollisionAngle: DynamicValue;
	public static climbingSpeed: DynamicValue;
	public static moveCameraOnBlockView: DynamicValue;
	public static mapFrameDuration: DynamicValue;
	public static battlersFrames: number;
	public static battlersFrameDuration: string;
	public static battlersFrameAttackingDuration: string;
	public static battlersColumns: number;
	public static autotilesFrames: number;
	public static autotilesFrameDuration: number;
	public static priceSoldItem: DynamicValue;
	public static enterNameTable: string[][];
	public static showBB: boolean;
	public static showFPS: boolean;
	private static itemsTypes: Map<number, Localization>;
	public static inventoryFilters: InventoryFilter[];
	public static mainMenuCommands: MainMenuCommand[];
	public static heroesStatistics: DynamicValue[];
	private static colors: Map<number, Color>;
	private static currencies: Map<number, Currency>;
	private static windowSkins: Map<number, WindowSkin>;
	private static cameraProperties: Map<number, CameraProperties>;
	private static detections: Map<number, Detection>;
	private static skyboxes: Map<number, Skybox>;
	private static fontSizes: Map<number, DynamicValue>;
	private static fontNames: Map<number, FontName>;
	private static speeds: Map<number, DynamicValue>;
	private static frequencies: Map<number, DynamicValue>;
	public static initialPartyMembers: InitialPartyMember[];
	public static soundCursor: PlaySong;
	public static soundConfirmation: PlaySong;
	public static soundCancel: PlaySong;
	public static soundImpossible: PlaySong;
	public static dbOptions: EventCommand.SetDialogBoxOptions;
	public static facesetsSize: number;
	public static facesetScalingWidth: number;
	public static facesetScalingHeight: number;
	public static iconsSize: number;
	public static saveSlots: number;
	public static modelHero: MapObject;
	public static ignoreAssetsLoadingErrors: boolean;
	public static windowWidth: number;
	public static windowHeight: number;
	public static isScreenWindow: boolean;

	constructor() {
		throw new Error('This is a static class!');
	}

	/**
	 *  Read the JSON file associated to
	 *  @static
	 */
	static async read() {
		const json = (await Platform.parseFileJSON(Paths.FILE_SYSTEM)) as any;

		// Project name
		this.projectName = new Localization(json.pn);
		Platform.setWindowTitle(this.projectName.name());

		// Screen resolution + antialiasing
		let w = json.sw;
		let h = json.sh;
		let isScreenWindow = json.isw;
		if (!Platform.isModeTestNormal()) {
			w = 640;
			h = 480;
			isScreenWindow = true;
		}
		this.windowWidth = w;
		this.windowHeight = h;
		this.isScreenWindow = isScreenWindow;
		this.updateWindowSize(w, h, !isScreenWindow);
		this.antialias = Utils.valueOrDefault(json.aa, false);
		this.isMouseControls = Utils.valueOrDefault(json.isMouseControls, true);

		// Other numbers
		this.SQUARE_SIZE = json.ss;
		this.PORTIONS_RAY = Utils.valueOrDefault(json.portionRayIngame, 3);
		this.FRAMES = json.frames;
		this.mountainCollisionHeight = DynamicValue.readOrDefaultNumber(json.mch, 4);
		this.mountainCollisionAngle = DynamicValue.readOrDefaultNumberDouble(json.mca, 45);
		this.climbingSpeed = DynamicValue.readOrDefaultNumberDouble(json.cs, 0.25);
		this.moveCameraOnBlockView = DynamicValue.readOrDefaultSwitch(json.mcobv, true);
		this.mapFrameDuration = DynamicValue.readOrDefaultNumber(json.mfd, 150);
		this.battlersFrames = Utils.valueOrDefault(json.battlersFrames, 4);
		this.battlersFrameDuration = Utils.valueOrDefault(json.bfd, 'Common.Mathf.random(250, 300)');
		this.battlersFrameAttackingDuration = Utils.valueOrDefault(json.bfad, '200');
		this.battlersColumns = Utils.valueOrDefault(json.battlersColumns, 9);
		this.autotilesFrames = Utils.valueOrDefault(json.autotilesFrames, 4);
		this.autotilesFrameDuration = Utils.valueOrDefault(json.autotilesFrameDuration, 150);
		this.saveSlots = Utils.valueOrDefault(json.saveSlots, 4);
		this.priceSoldItem = DynamicValue.readOrDefaultNumberDouble(json.priceSoldItem, 50);

		// Path BR
		this.PATH_BR = Platform.WEB_DEV ? './BR' : Paths.FILES + json.pathBR;

		// Path DLC
		this.PATH_DLCS = (Paths.FILES + (await Platform.parseFileJSON(Paths.FILE_DLCS)).p) as any;

		// Hero beginning
		this.ID_MAP_START_HERO = json.idMapHero;
		this.heroMapPosition = Position.createFromArray(json.hmp);

		// Debug bounding box
		this.showBB = Utils.valueOrDefault(json.bb, false);
		if (this.showBB) {
			Manager.Collisions.BB_MATERIAL.color.setHex(0xff0000);
			Manager.Collisions.BB_MATERIAL.wireframe = true;
			Manager.Collisions.BB_MATERIAL_DETECTION.color.setHex(0x00f2ff);
			Manager.Collisions.BB_MATERIAL_DETECTION.wireframe = true;
		}
		Manager.Collisions.BB_MATERIAL.visible = this.showBB;
		Manager.Collisions.BB_MATERIAL_DETECTION.visible = this.showBB;
		this.showFPS = Utils.valueOrDefault(json.fps, false);
		this.ignoreAssetsLoadingErrors = true; //TODO

		// Lists
		this.itemsTypes = Utils.readJSONMap(json.itemsTypes, Localization);
		this.inventoryFilters = [];
		this.mainMenuCommands = [];
		this.heroesStatistics = [];
		this.initialPartyMembers = [];
		Utils.readJSONSystemList({
			list: json.inventoryFilters,
			listIndexes: this.inventoryFilters,
			cons: InventoryFilter,
		});
		Utils.readJSONSystemList({
			list: json.mainMenuCommands,
			listIndexes: this.mainMenuCommands,
			cons: MainMenuCommand,
		});
		Utils.readJSONSystemList({
			list: json.heroesStatistics,
			listIndexes: this.heroesStatistics,
			func: (element: Record<string, any>) => {
				return DynamicValue.readOrDefaultDatabase(element.statisticID);
			},
		});
		this.colors = Utils.readJSONMap(json.colors, Color);
		this.currencies = Utils.readJSONMap(json.currencies, Currency);
		this.windowSkins = Utils.readJSONMap(json.wskins, WindowSkin);
		this.cameraProperties = Utils.readJSONMap(json.cp, CameraProperties);
		this.detections = Utils.readJSONMap(json.d, Detection);
		this.skyboxes = Utils.readJSONMap(json.sb, Skybox);
		this.fontSizes = Utils.readJSONMap(json.fs, (element: { s: DynamicValueJSON }) =>
			DynamicValue.readOrDefaultNumber(element.s)
		);
		this.fontNames = Utils.readJSONMap(json.fn, FontName);
		this.speeds = Utils.readJSONMap(json.sf, (element: { v: DynamicValueJSON }) =>
			DynamicValue.readOrDefaultNumberDouble(element.v, 1)
		);
		this.frequencies = Utils.readJSONMap(json.f, (element: { v: DynamicValueJSON }) =>
			DynamicValue.readOrDefaultNumberDouble(element.v, 1)
		);
		Utils.readJSONSystemList({
			list: Utils.valueOrDefault(json.initialPartyMembers, []),
			listIndexes: this.initialPartyMembers,
			cons: InitialPartyMember,
		});

		// Sounds
		this.soundCursor = new PlaySong(SONG_KIND.SOUND, json.scu);
		this.soundConfirmation = new PlaySong(SONG_KIND.SOUND, json.sco);
		this.soundCancel = new PlaySong(SONG_KIND.SOUND, json.sca);
		this.soundImpossible = new PlaySong(SONG_KIND.SOUND, json.si);

		// Window skin options
		this.dbOptions = <EventCommand.SetDialogBoxOptions>Manager.Events.getEventCommand(json.dbo);
		this.dbOptions.update();

		// Faceset options
		this.facesetsSize = Utils.valueOrDefault(json.facesetsSize, 128);
		this.facesetScalingWidth = Utils.valueOrDefault(json.facesetScalingWidth, 120);
		this.facesetScalingHeight = Utils.valueOrDefault(json.facesetScalingHeight, 120);

		// Icons size
		this.iconsSize = Utils.valueOrDefault(json.iconsSize, 16);

		// Enter name menu options
		this.enterNameTable = json.enterNameTable;

		// Initialize autotile frame counter
		Scene.Map.autotileFrame.duration = this.autotilesFrameDuration;
		Scene.Map.autotileFrame.frames = this.autotilesFrames;

		// Initialize loading scene now that basics are loaded
		Manager.Stack.sceneLoading = new Scene.Loading();
		Manager.Stack.requestPaintHUD = true;
	}

	/**
	 *  Get the item type by ID safely.
	 *  @static
	 *  @param {number} id
	 *  @returns {string}
	 */
	static getItemType(id: number): Localization {
		return Data.Base.get(id, this.itemsTypes, 'item type');
	}

	/**
	 *  Get the color by ID safely.
	 *  @static
	 *  @param {number} id
	 *  @returns {System.Color}
	 */
	static getColor(id: number): Color {
		return Data.Base.get(id, this.colors, 'color');
	}

	/**
	 *  Get the currency by ID safely.
	 *  @static
	 *  @param {number} id
	 *  @returns {string}
	 */
	static getCurrency(id: number): Currency {
		return Data.Base.get(id, this.currencies, 'currency');
	}

	/**
	 *  Get the window skin by ID safely.
	 *  @static
	 *  @param {number} id
	 *  @returns {string}
	 */
	static getWindowSkin(id: number): WindowSkin {
		return Data.Base.get(id, this.windowSkins, 'window skin');
	}

	/**
	 *  Get the camera properties by ID safely.
	 *  @static
	 *  @param {number} id
	 *  @returns {string}
	 */
	static getCameraProperties(id: number): CameraProperties {
		return Data.Base.get(id, this.cameraProperties, 'camera properties');
	}

	/**
	 *  Get the detection by ID safely.
	 *  @static
	 *  @param {number} id
	 *  @returns {string}
	 */
	static getDetection(id: number): Detection {
		return Data.Base.get(id, this.detections, 'detections');
	}

	/**
	 *  Get the skybox by ID safely.
	 *  @static
	 *  @param {number} id
	 *  @returns {string}
	 */
	static getSkybox(id: number): Skybox {
		return Data.Base.get(id, this.skyboxes, 'skybox');
	}

	/**
	 *  Get the font size by ID safely.
	 *  @static
	 *  @param {number} id
	 *  @returns {string}
	 */
	static getFontSize(id: number): DynamicValue {
		return Data.Base.get(id, this.fontSizes, 'font size');
	}

	/**
	 *  Get the font name by ID safely.
	 *  @static
	 *  @param {number} id
	 *  @returns {string}
	 */
	static getFontName(id: number): FontName {
		return Data.Base.get(id, this.fontNames, 'font name');
	}

	/**
	 *  Get the speed by ID safely.
	 *  @static
	 *  @param {number} id
	 *  @returns {string}
	 */
	static getSpeed(id: number): DynamicValue {
		return Data.Base.get(id, this.speeds, 'speed');
	}

	/**
	 *  Get the frequency by ID safely.
	 *  @static
	 *  @param {number} id
	 *  @returns {string}
	 */
	static getFrequency(id: number): DynamicValue {
		return Data.Base.get(id, this.frequencies, 'frequency');
	}

	/**
	 *  Get the system object of hero.
	 *  @static
	 *  @async
	 */
	static getModelHero() {
		this.modelHero = new MapObject(Data.CommonEvents.heroObject, this.heroMapPosition.toVector3(), true);
	}

	/**
	 *  Load the window skins pictures
	 *  @static
	 */
	static async loadWindowSkins() {
		for (const windowSkin of this.windowSkins.values()) {
			await windowSkin.updatePicture();
		}
	}

	/**
	 *  Get the default array currencies for a default game.
	 */
	static getDefaultCurrencies(): Map<number, number> {
		return new Map<number, number>(this.currencies.keys().map((id) => [id, 0]));
	}

	/**
	 *  Get the current System window skin.
	 *  @static
	 *  @returns {SystemWindowSkin}
	 */
	static getCurrentWindowSkin(): WindowSkin {
		return this.dbOptions.v_windowSkin;
	}

	/**
	 *  Update the window size and all the canvas sizes.
	 *  @static
	 *  @param {number} w
	 *  @param {number} h
	 *  @param {boolean} fullscreen
	 */
	static updateWindowSize(w: number, h: number, fullscreen: boolean) {
		if (fullscreen) {
			w = Platform.screenWidth;
			h = Platform.screenHeight;
		}
		Platform.setWindowSize(w, h, fullscreen);
		Platform.canvasHUD.width = w;
		Platform.canvasHUD.height = h;
		Platform.canvasHUD.style.width = `${w}px`;
		Platform.canvasHUD.style.height = `${h}px`;
		Platform.canvas3D.style.width = `${w}px`;
		Platform.canvas3D.style.height = `${h}px`;
		Platform.canvasVideos.height = h;
		ScreenResolution.CANVAS_WIDTH = w;
		ScreenResolution.CANVAS_HEIGHT = h;
		ScreenResolution.WINDOW_X = ScreenResolution.CANVAS_WIDTH / ScreenResolution.SCREEN_X;
		ScreenResolution.WINDOW_Y = ScreenResolution.CANVAS_HEIGHT / ScreenResolution.SCREEN_Y;
		Manager.GL.resize();
		Manager.Stack.requestPaintHUD = true;
		for (const scene of Manager.Stack.content) {
			scene.draw3D();
		}
	}

	/**
	 *  Switch between window and fullscreen.
	 *  @static
	 */
	static switchFullscreen() {
		this.isScreenWindow = !this.isScreenWindow;
		this.updateWindowSize(this.windowWidth, this.windowHeight, this.isScreenWindow);
	}
}

export { Systems };
