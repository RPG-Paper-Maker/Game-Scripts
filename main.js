/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

const { app, BrowserWindow, globalShortcut, dialog } = require('electron')

let ipc = require('electron').ipcMain;
let window;

function createWindow () {    
    window = new BrowserWindow({
        title: "",
        width: 640,
        height: 480,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    ipc.on('window-error', function(event, err) {
        window.webContents.openDevTools();
        dialog.showMessageBoxSync({ title: 'Error', type: 'error', message: err });
    });
    ipc.on('change-window-title', function(event, title) {
        window.setTitle(title);
    })
    ipc.on('change-window-size', function(event, w, h, f) {
        if (f)
        {
            window.setResizable(true);
            window.setFullScreen(true)
        } else
        {
            window.setContentSize(w, h);
            window.center();
        }
    })
    window.loadFile('index.html');
    window.removeMenu();
}

app.whenReady().then(()=>
globalShortcut.register('Alt+CommandOrControl+I', () => {
    window.webContents.openDevTools();
  })
).then(createWindow)
app.commandLine.appendSwitch('high-dpi-support', 'true');
app.commandLine.appendSwitch('force-device-scale-factor', '1');

app.on('window-all-closed', () => {
    app.quit();
})

// Avoid warning deprecated default value
app.allowRendererProcessReuse = false;

// Mac OS open new window if clicking on dock again
app.on('activate', () => {
    if (!window) {
        createWindow();
    }
})