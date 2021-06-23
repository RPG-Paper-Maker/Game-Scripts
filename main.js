/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

const { app, BrowserWindow, globalShortcut, dialog, screen } = require('electron')

if (process.argv.length === 3) {
    global.modeTest = process.argv[2];
}
let ipc = require('electron').ipcMain;
let window;

function createWindow () {
    let width = screen.getPrimaryDisplay().bounds.width;
    let height = screen.getPrimaryDisplay().bounds.height;
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
    if (global.modeTest === "showTextPreview") {
        window.setAlwaysOnTop(true, 'screen');
    }
    ipc.on('window-error', function(event, err) {
        window.webContents.openDevTools();
    });
    ipc.on('dialog-error-message', function(event, err) {
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
            if (global.modeTest === "showTextPreview") {
                window.setBounds({ x: width - 640, y: (height - 480) / 2 });
            } else {
                window.center();
            }
        }
    })
    window.loadFile('index.html');
    window.removeMenu();
}

app.whenReady().then(()=>
globalShortcut.register('Alt+CommandOrControl+I', () => {
    window.openDevTools({mode:'undocked'})
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