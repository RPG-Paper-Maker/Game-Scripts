/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants, IO } from "./index";
const electron = require('electron');
const remote = electron.remote;
const ipc = electron.ipcRenderer;
const ElectronScreen = remote.screen;
const app = remote.app;

let firstError = true;

/**
 * A class replaced according to te platform used (desktop, browser, mobile...)
 *
 * @class Platform
 */
class Platform {

    public static readonly ROOT_DIRECTORY: any = app.getAppPath();
    public static readonly screen: any = ElectronScreen.getPrimaryDisplay();
    public static readonly screenWidth: number = Platform.screen.bounds.width;
    public static readonly screenHeight: number = Platform.screen.bounds.height;
    public static readonly DESKTOP: boolean = true;
    public static readonly MODE_TEST = remote.getGlobal('modeTest');
    public static readonly MODE_TEST_BATTLE_TROOP = "battleTroop";
    public static readonly MODE_TEST_SHOW_TEXT_PREVIEW = "showTextPreview";
    public static canvas3D: any = document.getElementById('three-d');
    public static canvasHUD: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('hud');
    public static canvasVideos: HTMLVideoElement = <HTMLVideoElement> document.getElementById('video-container');
    public static canvasRendering: HTMLCanvasElement= <HTMLCanvasElement> document.getElementById('rendering');
    public static ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D> Platform.canvasHUD.getContext('2d');
    public static ctxr: CanvasRenderingContext2D = <CanvasRenderingContext2D> Platform.canvasRendering.getContext("2d");

    /**
     * Creates an instance of Platform.
     * @memberof Platform
     */
    constructor() {
        throw new Error("This class is static.")
    }

    /** 
     *  Set window title.
     *  @static
     *  @param {string} title - The title to display
     */
    static setWindowTitle = function (title: string) {
        ipc.send('change-window-title', title);
    }

    /** 
     *  Set window size.
     *  @static
     *  @param {number} w - The window width
     *  @param {number} h - The window height
     *  @param {boolean} f - Indicate if the window is fullscreen
     */
    static setWindowSize = function (w: number, h: number, f: boolean) {
        ipc.send('change-window-size', w, h, f);
    }

    /** 
     *  Quit app.
     *  @static
     */
    static quit = function () {
        window.close();
    }

    /** 
     *  Load a save.
     *  @static
     */
    static async loadSave(slot: number, path: string): Promise<Record<string ,any>> {
        if (await IO.fileExists(path)) {
            return await IO.parseFileJSON(path);
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
        Platform.showErrorMessage(e.message + Constants.STRING_NEW_LINE + e
            .stack, false);
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
            ipc.send('window-error', msg);
            if (displayDialog) {
                ipc.send('dialog-error-message', msg);
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
        return Platform.MODE_TEST !== Platform.MODE_TEST_BATTLE_TROOP && Platform
            .MODE_TEST !== Platform.MODE_TEST_SHOW_TEXT_PREVIEW;
    }
}

// Display error to main process
window.onerror = function (msg, url, line, column, err) {
    if (firstError) {
        firstError = false;
        let str = url ? url + Constants.STRING_COLON + " " + line + Constants
            .STRING_NEW_LINE : "";
        if (err.stack != null) {
            str += err.stack;
        } else if (err.message != null) {
            str += err.message;
        }
        const fs = require('fs');
        fs.writeFile("log.txt", "ERROR LOG" + Constants.STRING_COLON + Constants
            .STRING_NEW_LINE + Constants.STRING_NEW_LINE + str, (e: Error) => {
            if (e) {
                Platform.showError(e);
            }
        });

        // Send it to main process to open a dialog box
        ipc.send('window-error', str);
        throw err;
    } else {
        console.error(err);
    }
}

export { Platform }