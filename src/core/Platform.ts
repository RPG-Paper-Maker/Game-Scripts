/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import electron from 'electron';

const remote = electron.remote;
const ipc = electron.ipcRenderer;
const console = remote.getGlobal('console');
const Screen = remote.screen;
const app = remote.app;

import {RPM} from ".";

export class Platform {
    static ROOT_DIRECTORY = app.getAppPath();
    static screen = Screen.getPrimaryDisplay();
    static screenWidth = Platform.screen.bounds.width;
    static screenHeight = Platform.screen.bounds.height;
    static canvas3D = document.getElementById('three-d');
    static canvasHUD = document.getElementById('hud');
    static canvasVideos = document.getElementById('video-container');
    static canvasRendering = document.getElementById('rendering');
    static ctx = Platform.canvasHUD.getContext('2d');
    static ctxr = Platform.canvasRendering.getContext("2d");
    static DESKTOP = true;

    constructor() {
        throw new Error("This class is static.")
    }

    // -------------------------------------------------------
    /** Set window title
     *   @static
     *   @param {string} title The title to display
     */
    static setWindowTitle = function (title: string) {
        ipc.send('change-window-title', title);
    }

    // -------------------------------------------------------
    /** Set window size
     *   @static
     *   @param {number} w The window width
     *   @param {number} h The window height
     *   @param {boolean} f Indicate if the window is fullscreen
     */
    static setWindowSize = function (w, h, f) {
        ipc.send('change-window-size', w, h, f);
    }

    // -------------------------------------------------------
    /** Quit app
     *   @static
     */
    static quit = function () {
        window.close();
    }
}

/** This
 *   @static
 */
let $that = this;

window.onerror = function (msg, url, line, column, err) {
    let str = url ? url + ": " + line + "\n" : "";
    if (err.stack != null) {
        str += err.stack;
    } else if (err.message != null) {
        str += err.message;
    }
    const fs = require('fs');
    fs.writeFile("log.txt", "ERROR LOG:\n\n" + str, (e) => {
        if (e) {
            RPM.showError(e);
        }
    });

    // Send it to main process to open a dialog box
    ipc.send('window-error', str);
}

