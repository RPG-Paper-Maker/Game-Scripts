import fs from 'fs/promises';
import os from 'os';
import path from 'path';

async function copyDir(src, dest) {
	await fs.mkdir(dest, { recursive: true });
	let entries = await fs.readdir(src, { withFileTypes: true });

	for (let entry of entries) {
		let srcPath = path.join(src, entry.name);
		let destPath = path.join(dest, entry.name);
		entry.isDirectory() ? await copyDir(srcPath, destPath) : await fs.copyFile(srcPath, destPath);
	}
}

async function exists(path) {
	try {
		await fs.stat(path);
		return true;
	} catch (error) {
		return false;
	}
}

(async function () {
	const BUILD_DIR = './build';
	const DOCUMENTS_FOLDER = path.join(os.homedir(), 'Documents');
	const CONTENT_FOLDER = path.join(DOCUMENTS_FOLDER, 'RPG Paper Maker Games', 'Project-without-name');

	try {
		if (await exists(BUILD_DIR)) {
			await fs.rm(BUILD_DIR, {
				recursive: true,
			});
		}
		await copyDir(CONTENT_FOLDER, BUILD_DIR);
	} catch (error) {
		console.error(error);
	}
})();
