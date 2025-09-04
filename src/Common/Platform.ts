/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { IO } from './index';
import { JsonObject } from './Types';

let firstError = true;

/**
 * Provides platform-specific utilities for file access, window management,
 * rendering contexts, and error reporting.
 *
 * This class is static-only and adapts behavior depending on the runtime
 * environment (desktop, browser, mobile).
 */
export class Platform {
	// -------------------------------------------------------------------------
	// Environment flags
	// -------------------------------------------------------------------------

	/** Root directory for build assets. */
	static readonly ROOT_DIRECTORY = './build/';

	/** Whether the app runs as a desktop build. */
	static readonly IS_DESKTOP = true;

	/** Whether the app is running in web development mode. */
	static readonly WEB_DEV = false;

	/** Active test mode identifier (if any). */
	static readonly MODE_TEST: string | undefined = undefined;

	/** Mode constant for troop battle test. */
	static readonly MODE_TEST_BATTLE_TROOP = 'battleTroop';

	/** Mode constant for text preview test. */
	static readonly MODE_TEST_SHOW_TEXT_PREVIEW = 'showTextPreview';

	// -------------------------------------------------------------------------
	// Screen & canvas
	// -------------------------------------------------------------------------

	/** Current screen width in pixels. */
	static readonly screenWidth: number = window.screen.width;

	/** Current screen height in pixels. */
	static readonly screenHeight: number = window.screen.height;

	/** Main 3D rendering canvas. */
	static readonly canvas3D = document.getElementById('three-d') as HTMLCanvasElement;

	/** HUD (2D overlay) canvas. */
	static readonly canvasHUD = document.getElementById('hud') as HTMLCanvasElement;

	/** Video rendering container element. */
	static readonly canvasVideos = document.getElementById('video-container') as HTMLVideoElement;

	/** Offscreen rendering canvas. */
	static readonly canvasRendering = document.getElementById('rendering') as HTMLCanvasElement;

	/** HUD rendering context (2D). */
	static readonly ctx = Platform.canvasHUD.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;

	/** Offscreen rendering context (2D). */
	static readonly ctxr = Platform.canvasRendering.getContext('2d', {
		willReadFrequently: true,
	}) as CanvasRenderingContext2D;

	// -------------------------------------------------------------------------
	// Window management
	// -------------------------------------------------------------------------

	/**
	 * Change the app window title.
	 * @param title - Title to display.
	 */
	static setWindowTitle(title: string): void {
		window.ipcRenderer.send('change-window-title', title);
	}

	/**
	 * Change the app window size.
	 * @param w - Width in pixels.
	 * @param h - Height in pixels.
	 * @param fullscreen - Whether to switch to fullscreen.
	 */
	static setWindowSize(w: number, h: number, fullscreen: boolean): void {
		window.ipcRenderer.send('change-window-size', w, h, fullscreen);
	}

	/**
	 * Quit the application.
	 */
	static quit(): void {
		window.close();
	}

	// -------------------------------------------------------------------------
	// File I/O
	// -------------------------------------------------------------------------

	/**
	 * Check if a file exists.
	 * @param path - File path.
	 * @returns True if file exists.
	 */
	static async fileExists(path: string): Promise<boolean> {
		return IO.fileExists(path);
	}

	/**
	 * Load a file as text.
	 * @param path - File path.
	 * @param forcePath - If true, prepends {@link ROOT_DIRECTORY}.
	 */
	static async loadFile(path: string, forcePath = false): Promise<string> {
		if (forcePath) {
			path = Platform.ROOT_DIRECTORY + '/' + path;
		}
		return IO.openFile(path);
	}

	/**
	 * Load and parse a JSON file.
	 * @param path - File path.
	 */
	static async parseFileJSON(path: string): Promise<JsonObject> {
		return IO.parseFileJSON(path);
	}

	/**
	 * Load a save file.
	 * @param slot - Save slot index.
	 * @param path - File path.
	 */
	static async loadSave(_slot: number, path: string): Promise<JsonObject | null> {
		if (await IO.fileExists(path)) {
			return Platform.parseFileJSON(path);
		}
		return null;
	}

	/**
	 * Register (write) a save file.
	 * @param slot - Save slot index.
	 * @param path - File path.
	 * @param json - Save data.
	 */
	static async registerSave(_slot: number, path: string, json: JsonObject): Promise<void> {
		await IO.saveFile(path, json);
	}

	// -------------------------------------------------------------------------
	// Error handling
	// -------------------------------------------------------------------------

	/**
	 * Show an error object.
	 * @param e - Error instance.
	 */
	static showError(e: Error): void {
		Platform.showErrorMessage(`${e.message}\n${e.stack}`, false);
	}

	/**
	 * Show an error message.
	 * @param msg - Error message.
	 * @param displayDialog - Whether to also display a dialog box.
	 */
	static showErrorMessage(msg: string, displayDialog = true): void {
		if (firstError) {
			firstError = false;
			window.ipcRenderer.send('window-error', msg);
			if (displayDialog) {
				window.ipcRenderer.send('dialog-error-message', msg);
			}
			throw new Error(msg);
		}
	}

	// -------------------------------------------------------------------------
	// Mode helpers
	// -------------------------------------------------------------------------

	/**
	 * Check if the app is running in normal test mode (battles).
	 */
	static isModeTestNormal(): boolean {
		return true;
	}
}
