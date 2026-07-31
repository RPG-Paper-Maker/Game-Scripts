/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { app, BrowserWindow, dialog, globalShortcut, ipcMain } from 'electron';
import { promises as fs, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getBackendCachePath = () => {
	let dir;
	try {
		dir = app.getPath('userData');
	} catch {
		dir = app.getPath('temp');
	}
	return path.join(dir, 'gpu-backend');
};

const readBackendCache = () => {
	try {
		const value = readFileSync(getBackendCachePath(), 'utf8').trim();
		if (value === 'vulkan' || value === 'gl') {
			return value;
		}
	} catch {}
	return null;
};

const getLinuxAngleBackend = () => readBackendCache() ?? 'gl';

const detectGLRenderer = async () => {
	const probe = new BrowserWindow({
		width: 1,
		height: 1,
		show: false,
		webPreferences: { nodeIntegration: false, contextIsolation: true },
	});
	try {
		await probe.loadURL('about:blank');
		const renderer = await probe.webContents.executeJavaScript(`(() => {
			try {
				const canvas = document.createElement('canvas');
				const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
				if (!gl) return '';
				const ext = gl.getExtension('WEBGL_debug_renderer_info');
				return ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : String(gl.getParameter(gl.RENDERER));
			} catch {
				return '';
			}
		})();`);
		return String(renderer ?? '').trim();
	} catch {
		return '';
	} finally {
		if (!probe.isDestroyed()) {
			probe.destroy();
		}
	}
};

const ensureLinuxAngleBackend = async () => {
	if (process.platform !== 'linux' || readBackendCache() !== null) {
		return false;
	}
	const renderer = await detectGLRenderer();
	console.log(`[gpu-backend] glRenderer = "${renderer}"`);
	if (renderer.length === 0) {
		return false;
	}
	if (/llvmpipe|softpipe|swrast|software/i.test(renderer)) {
		console.log('[gpu-backend] software GL detected, switching to Vulkan and relaunching');
		writeFileSync(getBackendCachePath(), 'vulkan');
		app.relaunch();
		app.exit(0);
		return true;
	}
	writeFileSync(getBackendCachePath(), 'gl');
	return false;
};

app.commandLine.appendSwitch('high-dpi-support', 'true');
app.commandLine.appendSwitch('force-device-scale-factor', '1');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('disable-features', 'HardwareMediaKeyHandling,MediaSessionService');
if (process.platform === 'darwin') {
	if (process.arch === 'arm64') {
		// Apple Silicon: Metal works well
		app.commandLine.appendSwitch('use-angle', 'metal');
		app.commandLine.appendSwitch('use-gl', 'angle');
		app.commandLine.appendSwitch('enable-features', 'Metal');
	} else {
		// Intel Mac: Metal/ANGLE causes BindToCurrentSequence failures, fall back to OpenGL
		app.commandLine.appendSwitch('use-angle', 'gl');
	}
} else if (process.platform === 'linux') {
	app.commandLine.appendSwitch('no-sandbox');
	app.commandLine.appendSwitch('disable-gpu-sandbox');
	app.commandLine.appendSwitch('ozone-platform', 'x11');
	app.commandLine.appendSwitch('use-gl', 'angle');
	app.commandLine.appendSwitch('use-angle', getLinuxAngleBackend());
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
	ipcMain.on('save-file', async (event, filePath, content) => {
		const absolutePath = path.resolve(__dirname, filePath);
		await fs.mkdir(path.dirname(absolutePath), { recursive: true });
		await fs.writeFile(absolutePath, content, 'utf-8');
	});
	window.loadFile('index.html');
	window.removeMenu();
	window.webContents.on('did-finish-load', () => {
		if (window && !window.isDestroyed()) {
			window.focus();
			window.webContents.focus();
		}
	});
}

app.whenReady().then(async () => {
	if (await ensureLinuxAngleBackend()) {
		return;
	}
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
