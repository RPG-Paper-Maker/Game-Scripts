/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants, IO } from './index';

let firstError = true;

/**
 * A class replaced according to te platform used (desktop, browser, mobile...)
 *
 * @class Platform
 */
class Platform {
	public static readonly ROOT_DIRECTORY: any = './build/';
	public static readonly IS_DESKTOP = false;
	public static readonly screenWidth: number = window.screen.width;
	public static readonly screenHeight: number = window.screen.height;
	public static readonly DESKTOP: boolean = true;
	public static readonly WEB_DEV: boolean = false;
	public static readonly MODE_TEST: string | undefined = undefined;
	public static readonly MODE_TEST_BATTLE_TROOP = 'battleTroop';
	public static readonly MODE_TEST_SHOW_TEXT_PREVIEW = 'showTextPreview';
	public static canvas3D: any = document.getElementById('three-d');
	public static canvasHUD: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('hud');
	public static canvasVideos: HTMLVideoElement = <HTMLVideoElement>document.getElementById('video-container');
	public static canvasRendering: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('rendering');
	public static ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>(
		Platform.canvasHUD.getContext('2d', { willReadFrequently: true })
	);
	public static ctxr: CanvasRenderingContext2D = <CanvasRenderingContext2D>(
		Platform.canvasRendering.getContext('2d', { willReadFrequently: true })
	);

	/**
	 * Creates an instance of Platform.
	 * @memberof Platform
	 */
	constructor() {
		throw new Error('This class is static.');
	}

	/**
	 *  Set window title.
	 *  @static
	 *  @param {string} title - The title to display
	 */
	static setWindowTitle = function (title: string) {
		window.ipcRenderer.send('change-window-title', title);
	};

	/**
	 *  Set window size.
	 *  @static
	 *  @param {number} w - The window width
	 *  @param {number} h - The window height
	 *  @param {boolean} f - Indicate if the window is fullscreen
	 */
	static setWindowSize = function (w: number, h: number, f: boolean) {
		window.ipcRenderer.send('change-window-size', w, h, f);
	};

	/**
	 *  Quit app.
	 *  @static
	 */
	static quit = function () {
		window.close();
	};

	/**
	 *  Check if a file exists.
	 *  @static
	 *  @param {string} path - The path of the file
	 *  @returns {Promise<boolean>}
	 */
	static fileExists = async function (path: string): Promise<boolean> {
		return await IO.fileExists(path);
	};

	/**
	 *  Load a file.
	 *  @static
	 */
	static async loadFile(path: string, forcePath = false): Promise<string> {
		if (forcePath) {
			path = Platform.ROOT_DIRECTORY + '/' + path;
		}
		return await IO.openFile(path);
	}

	/**
	 *  Parse a JSON file
	 *  @static
	 */
	static async parseFileJSON(path: string): Promise<Record<string, any>> {
		return await IO.parseFileJSON(path);
	}

	/**
	 *  Load a save.
	 *  @static
	 */
	static async loadSave(slot: number, path: string): Promise<Record<string, any>> {
		if (await IO.fileExists(path)) {
			return await Platform.parseFileJSON(path);
		}
		return null;
	}

	/**
	 *  Register a save.
	 *  @static
	 */
	static async registerSave(slot: number, path: string, json: Record<string, any>) {
		await IO.saveFile(path, json);
	}

	/**
	 *  Show an error object.
	 *  @static
	 *  @param {Error} e - The error message
	 */
	static showError(e: Error) {
		Platform.showErrorMessage(e.message + Constants.STRING_NEW_LINE + e.stack, false);
	}

	/**
	 *  Show an error message.
	 *  @static
	 *  @param {string} msg - The error message
	 *  @param {boolean} displayDialog - Indicates if you need to display the
	 *  dialog box
	 */
	static showErrorMessage(msg: string, displayDialog: boolean = true) {
		if (firstError) {
			firstError = false;
			window.ipcRenderer.send('window-error', msg);
			if (displayDialog) {
				window.ipcRenderer.send('dialog-error-message', msg);
			}
			throw new Error(msg);
		}
	}

	/**
	 *  Check if there is a specific mode test (app args).
	 *  @static
	 *  @returns {boolean}
	 */
	static isModeTestNormal(): boolean {
		return true;
	}
}

export { Platform };
