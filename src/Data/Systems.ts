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
	CameraPropertiesJSON,
	Color,
	ColorJSON,
	Currency,
	CurrencyJSON,
	Detection,
	DetectionJSON,
	DynamicValue,
	DynamicValueJSON,
	FontName,
	FontNameJSON,
	InitialPartyMember,
	InventoryFilter,
	InventoryFilterJSON,
	Localization,
	LocalizationJSON,
	MainMenuCommand,
	MainMenuCommandJSON,
	PlaySong,
	PlaySongJSON,
	ReactionCommandJSON,
	Skybox,
	SkyboxJSON,
	WindowSkin,
	WindowSkinJSON,
} from '../Model';
import { Base } from './Base';

/**
 * Minimal JSON type for system file (use `any`-ish shapes where models read their own fields).
 */
export type SystemsJSON = {
	pn: LocalizationJSON;
	sw: number;
	sh: number;
	isw: boolean;
	aa?: boolean;
	isMouseControls?: boolean;
	ss: number;
	portionRayIngame?: number;
	frames: number;
	mch?: DynamicValueJSON;
	mca?: DynamicValueJSON;
	cs?: DynamicValueJSON;
	mcobv?: DynamicValueJSON;
	mfd?: DynamicValueJSON;
	battlersFrames?: number;
	bfd?: string;
	bfad?: string;
	battlersColumns?: number;
	autotilesFrames?: number;
	autotilesFrameDuration?: number;
	saveSlots?: number;
	priceSoldItem?: DynamicValueJSON;
	pathBR?: string;
	pathDLCS?: string;
	idMapHero?: number;
	hmp?: number[];
	bb?: boolean;
	fps?: boolean;
	itemsTypes?: LocalizationJSON[];
	inventoryFilters?: InventoryFilterJSON[];
	mainMenuCommands?: MainMenuCommandJSON[];
	heroesStatistics?: LocalizationJSON[];
	initialPartyMembers?: { statisticID: DynamicValueJSON }[];
	colors?: ColorJSON[];
	currencies?: CurrencyJSON[];
	wskins?: WindowSkinJSON[];
	cp?: CameraPropertiesJSON[];
	d?: DetectionJSON[];
	sb?: SkyboxJSON[];
	fs?: { s: DynamicValueJSON }[];
	fn?: FontNameJSON[];
	sf?: { v: DynamicValueJSON }[];
	f?: { v: DynamicValueJSON }[];
	scu?: PlaySongJSON;
	sco?: PlaySongJSON;
	sca?: PlaySongJSON;
	si?: PlaySongJSON;
	dbo?: ReactionCommandJSON;
	facesetsSize?: number;
	facesetScalingWidth?: number;
	facesetScalingHeight?: number;
	iconsSize?: number;
	enterNameTable?: string[][];
};

/** @class
 *   All the System datas.
 *   @static
 */
export class Systems {
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

	/**
	 * Get the item type by ID safely.
	 */
	static getItemType(id: number): Localization {
		return Base.get(id, this.itemsTypes, 'item type');
	}

	/**
	 * Get the color by ID safely.
	 */
	static getColor(id: number): Color {
		return Base.get(id, this.colors, 'color');
	}

	/**
	 * Get the currency by ID safely.
	 */
	static getCurrency(id: number): Currency {
		return Base.get(id, this.currencies, 'currency');
	}

	/**
	 * Get the window skin by ID safely.
	 */
	static getWindowSkin(id: number): WindowSkin {
		return Base.get(id, this.windowSkins, 'window skin');
	}

	/**
	 * Get the camera properties by ID safely.
	 */
	static getCameraProperties(id: number): CameraProperties {
		return Base.get(id, this.cameraProperties, 'camera properties');
	}

	/**
	 * Get the detection by ID safely.
	 */
	static getDetection(id: number): Detection {
		return Base.get(id, this.detections, 'detection');
	}

	/**
	 * Get the skybox by ID safely.
	 */
	static getSkybox(id: number): Skybox {
		return Base.get(id, this.skyboxes, 'skybox');
	}

	/**
	 * Get the font size by ID safely.
	 */
	static getFontSize(id: number): DynamicValue {
		return Base.get(id, this.fontSizes, 'font size');
	}

	/**
	 * Get the font name by ID safely.
	 */
	static getFontName(id: number): FontName {
		return Base.get(id, this.fontNames, 'font name');
	}

	/**
	 * Get the speed by ID safely.
	 */
	static getSpeed(id: number): DynamicValue {
		return Base.get(id, this.speeds, 'speed');
	}

	/**
	 * Get the frequency by ID safely.
	 */
	static getFrequency(id: number): DynamicValue {
		return Base.get(id, this.frequencies, 'frequency');
	}

	/**
	 * Get the system object of hero.
	 */
	static getModelHero(): void {
		this.modelHero = new MapObject(Data.CommonEvents.heroObject, this.heroMapPosition.toVector3(), true);
	}

	/**
	 * Get the default array currencies for a default game.
	 */
	static getDefaultCurrencies(): Map<number, number> {
		return new Map<number, number>(Array.from(this.currencies.keys()).map((id) => [id, 0]));
	}

	/**
	 * Get the current System window skin.
	 */
	static getCurrentWindowSkin(): WindowSkin {
		return this.dbOptions.v_windowSkin;
	}

	/**
	 * Update the window size and all the canvas sizes.
	 */
	static updateWindowSize(w: number, h: number, fullscreen: boolean): void {
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
	 *  Read the JSON file associated to
	 *  @static
	 */
	static async read() {
		const json = (await Platform.parseFileJSON(Paths.FILE_SYSTEM)) as SystemsJSON;

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
		this.PATH_DLCS = Paths.FILES + json.pathDLCS;

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
		this.inventoryFilters = Utils.readJSONList(json.inventoryFilters, InventoryFilter);
		this.mainMenuCommands = Utils.readJSONList(json.mainMenuCommands, MainMenuCommand);
		this.heroesStatistics = Utils.readJSONList(
			json.heroesStatistics,
			(element: { statisticID: DynamicValueJSON }) => DynamicValue.readOrDefaultDatabase(element.statisticID),
		);
		this.initialPartyMembers = Utils.readJSONList(json.initialPartyMembers, InitialPartyMember);
		this.colors = Utils.readJSONMap(json.colors, Color);
		this.currencies = Utils.readJSONMap(json.currencies, Currency);
		this.windowSkins = Utils.readJSONMap(json.wskins, WindowSkin);
		this.cameraProperties = Utils.readJSONMap(json.cp, CameraProperties);
		this.detections = Utils.readJSONMap(json.d, Detection);
		this.skyboxes = Utils.readJSONMap(json.sb, Skybox);
		this.fontSizes = Utils.readJSONMap(json.fs, (element: { s: DynamicValueJSON }) =>
			DynamicValue.readOrDefaultNumber(element.s),
		);
		this.fontNames = Utils.readJSONMap(json.fn, FontName);
		this.speeds = Utils.readJSONMap(json.sf, (element: { v: DynamicValueJSON }) =>
			DynamicValue.readOrDefaultNumberDouble(element.v, 1),
		);
		this.frequencies = Utils.readJSONMap(json.f, (element: { v: DynamicValueJSON }) =>
			DynamicValue.readOrDefaultNumberDouble(element.v, 1),
		);

		// Sounds
		this.soundCursor = new PlaySong(SONG_KIND.SOUND, json.scu);
		this.soundConfirmation = new PlaySong(SONG_KIND.SOUND, json.sco);
		this.soundCancel = new PlaySong(SONG_KIND.SOUND, json.sca);
		this.soundImpossible = new PlaySong(SONG_KIND.SOUND, json.si);

		// Window skin options
		this.dbOptions = Manager.Events.getEventCommand(json.dbo) as EventCommand.SetDialogBoxOptions;
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
}
