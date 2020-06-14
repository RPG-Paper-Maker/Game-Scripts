/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

const electron = require('electron')
const remote = electron.remote;
const ipc = electron.ipcRenderer;
const console = remote.getGlobal('console');
const Screen = remote.screen;
const app = remote.app;

window.onerror = function (msg, url, line, column, error)
{
    // Convert error to Object to it can be properly send to main process
    let obj = {};
    Object.getOwnPropertyNames(error).forEach(function(key) 
    {
        obj[key] = error[key];
    });

    // Send it to main process to open a dialog box
    ipc.send('window-error', obj);
}

function Platform()
{

}

Platform.ROOT_DIRECTORY = app.getAppPath();
Platform.screen = Screen.getPrimaryDisplay();
Platform.screenWidth = Platform.screen.bounds.width;
Platform.screenHeight = Platform.screen.bounds.height;
Platform.canvas3D = document.getElementById('three-d');
Platform.canvasHUD = document.getElementById('hud');
Platform.canvasVideos = document.getElementById('video-container');
Platform.canvasRendering = document.getElementById('rendering');
Platform.ctx = Platform.canvasHUD.getContext('2d');
Platform.DESKTOP = true;

Platform.setWindowTitle = function(title)
{
    ipc.send('change-window-title', title);
}

Platform.setWindowSize = function(w, h, f)
{
    ipc.send('change-window-size', w, h, f);
}

Platform.quit = function()
{
    window.close();
}