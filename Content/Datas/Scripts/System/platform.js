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

window.onerror = function (msg, url, line, column, err)
{
    let str = url ? url + ": " + line + "\n" : "";
    if (err.stack != null) 
    {
        str += err.stack;
    } else if (err.message != null) 
    {
        str += err.message;
    }
    const fs = require('fs');
    fs.writeFile("log.txt", "ERROR LOG:\n\n" + str, (e) => {
        if (e)
        {
            RPM.showError(e);
        }
    });

    // Send it to main process to open a dialog box
    ipc.send('window-error', str);
}

function Platform()
{

}

Platform.ROOT_DIRECTORY = app.getAppPath();
Platform.error = false;
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