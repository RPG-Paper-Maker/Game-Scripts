/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { app, BrowserWindow, dialog, globalShortcut, ipcMain } from 'electron';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.commandLine.appendSwitch('high-dpi-support', 'true');
app.commandLine.appendSwitch('force-device-scale-factor', '1');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
if (process.platform === 'darwin') {
	app.commandLine.appendSwitch('use-angle', 'metal');
	app.commandLine.appendSwitch('use-gl', 'angle');
	app.commandLine.appendSwitch('enable-features', 'Metal');
}

let window;

function createWindow() {
	window = new BrowserWindow({
		title: '',
		width: 640,
		height: 480,
		resizable: false,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false,
			preload: path.join(__dirname, 'preload.js'),
		},
	});
	ipcMain.on('window-error', function (event, err) {
		window.webContents.openDevTools();
		window.setFullScreen(false);
	});
	ipcMain.on('dialog-error-message', function (event, err) {
		dialog.showMessageBoxSync({ title: 'Error', type: 'error', message: err });
	});
	ipcMain.on('change-window-title', function (event, title) {
		window.setTitle(title);
	});
	ipcMain.on('change-window-size', function (event, w, h, f) {
		if (f) {
			window.setResizable(true);
			window.setFullScreen(true);
		} else {
			window.setContentSize(w, h);
			window.center();
			window.setFullScreen(false);
		}
	});
	ipcMain.on('save-file', async (event, path, content) => {
		await fs.writeFile(path, content, 'utf-8');
		return true;
	});
	window.loadFile('index.html');
	window.removeMenu();
}

app.whenReady().then(() => {
	const shortcuts = ['CommandOrControl+Alt+I', 'CommandOrControl+Shift+I'];
	for (const shortcut of shortcuts) {
		globalShortcut.register(shortcut, () => {
			window.openDevTools({ mode: 'undocked' });
		});
	}
	createWindow();
});

app.on('window-all-closed', () => {
	app.quit();
});

// Mac OS open new window if clicking on dock again
app.on('activate', () => {
	if (!window) {
		createWindow();
	}
});
