"use strict";
/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
const electron_1 = __importDefault(require("electron"));
const Common_1 = require("../Common");
const remote = electron_1.default.remote;
const ipc = electron_1.default.ipcRenderer;
const console = remote.getGlobal('console');
const Screen = remote.screen;
const app = remote.app;
class Platform {
    constructor() {
        throw new Error("This class is static.");
    }
}
exports.Platform = Platform;
Platform.ROOT_DIRECTORY = app.getAppPath();
Platform.screen = Screen.getPrimaryDisplay();
Platform.screenWidth = Platform.screen.bounds.width;
Platform.screenHeight = Platform.screen.bounds.height;
Platform.canvas3D = document.getElementById('three-d');
Platform.canvasHUD = document.getElementById('hud');
Platform.canvasVideos = document.getElementById('video-container');
Platform.canvasRendering = document.getElementById('rendering');
Platform.ctx = Platform.canvasHUD.getContext('2d');
Platform.ctxr = Platform.canvasRendering.getContext("2d");
Platform.DESKTOP = true;
// -------------------------------------------------------
/** Set window title
 *   @static
 *   @param {string} title The title to display
 */
Platform.setWindowTitle = function (title) {
    ipc.send('change-window-title', title);
};
// -------------------------------------------------------
/** Set window size
 *   @static
 *   @param {number} w The window width
 *   @param {number} h The window height
 *   @param {boolean} f Indicate if the window is fullscreen
 */
Platform.setWindowSize = function (w, h, f) {
    ipc.send('change-window-size', w, h, f);
};
// -------------------------------------------------------
/** Quit app
 *   @static
 */
Platform.quit = function () {
    window.close();
};
/** This
 *   @static
 */
let $that = this;
window.onerror = function (msg, url, line, column, err) {
    let str = url ? url + ": " + line + "\n" : "";
    if (err.stack != null) {
        str += err.stack;
    }
    else if (err.message != null) {
        str += err.message;
    }
    const fs = require('fs');
    fs.writeFile("log.txt", "ERROR LOG:\n\n" + str, (e) => {
        if (e) {
            Common_1.Utils.showError(e);
        }
    });
    // Send it to main process to open a dialog box
    ipc.send('window-error', str);
};
