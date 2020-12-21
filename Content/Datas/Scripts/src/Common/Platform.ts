/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants } from ".";
const electron = require('electron');
const remote = electron.remote;
const ipc = electron.ipcRenderer;
const ElectronScreen = remote.screen;
const app = remote.app;

let firstError = true;

/** @class
 *  @static
 *  A class replaced according to te platform used (desktop, browser, mobile...).
 */
class Platform {
    public static readonly ROOT_DIRECTORY = app.getAppPath();
    public static readonly screen = ElectronScreen.getPrimaryDisplay();
    public static readonly screenWidth = Platform.screen.bounds.width;
    public static readonly screenHeight = Platform.screen.bounds.height;
    public static readonly DESKTOP = true;
    public static canvas3D = document.getElementById('three-d');
    public static canvasHUD = <HTMLCanvasElement> document.getElementById('hud');
    public static canvasVideos = <HTMLVideoElement> document.getElementById('video-container');
    public static canvasRendering = <HTMLCanvasElement> document.getElementById('rendering');
    public static ctx = <CanvasRenderingContext2D> Platform.canvasHUD.getContext('2d');
    public static ctxr = <CanvasRenderingContext2D> Platform.canvasRendering.getContext("2d");

    constructor() {
        throw new Error("This class is static.")
    }

    /** 
     *  Set window title.
     *  @static
     *  @param {string} title The title to display
     */
    static setWindowTitle = function (title: string) {
        ipc.send('change-window-title', title);
    }

    /** 
     *  Set window size.
     *  @static
     *  @param {number} w The window width
     *  @param {number} h The window height
     *  @param {boolean} f Indicate if the window is fullscreen
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
     *  Show an error object.
     *  @static
     *  @param {Error} e The error message
     */
    static showError(e: Error) {
        Platform.showErrorMessage(e.message + Constants.STRING_NEW_LINE + e
            .stack);
    }

    /** 
     *  Show an error message.
     *  @static
     *  @param {string} msg The error message
     */
    static showErrorMessage(msg: string) {
        if (firstError) {
            firstError = false;
            ipc.send('window-error', msg);
            throw new Error(msg);
        }
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
    }
}

export { Platform }