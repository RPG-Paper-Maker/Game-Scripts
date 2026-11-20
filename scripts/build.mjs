import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { build } from 'vite';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');
const OUT_DIR = path.join(ROOT, 'build', 'Scripts');
const PLATFORM_SOURCE = path.join(SRC_DIR, 'Common', 'Platform.ts');
const PLATFORM_EXTERNAL_ID = 'rpm-platform';
const ENGINE_EXTERNAL_ID = 'rpm-engine';
const BANNER = `/*!
    RPG Paper Maker Copyright (C) 2017-${new Date().getFullYear()} Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.

    Original TypeScript sources are available in the src folder next to this file.
*/`;

function runCommand(command) {
	return new Promise((resolve, reject) => {
		exec(command, { cwd: ROOT }, (err, stdout, stderr) => {
			if (err) {
				reject(`Problem running ${command}\n${stdout}${stderr}`);
				return;
			}
			resolve();
		});
	});
}

const isPlatformSource = (id) => path.normalize(id.split('?')[0]) === PLATFORM_SOURCE;

const toSourcePath = (relativeSourcePath, sourcemapPath) => {
	const absolute = path.resolve(path.dirname(sourcemapPath), relativeSourcePath);
	return path.relative(ROOT, absolute).split(path.sep).join('/');
};

const commonConfig = {
	configFile: false,
	root: ROOT,
	publicDir: false,
	logLevel: 'warn',
	build: {
		outDir: OUT_DIR,
		target: 'es2020',
		minify: false,
		sourcemap: true,
		reportCompressedSize: false,
	},
};

const minifyOptions = {
	compress: true,
	mangle: false,
	codegen: { removeWhitespace: true, legalComments: 'eof' },
};

async function getThirdPartyBanner() {
	const license = await fs.readFile(path.join(ROOT, 'node_modules', 'three-mesh-bvh', 'LICENSE'), 'utf8');
	return `/*!\n    three-mesh-bvh\n\n${license.trim().replaceAll('*/', '* /')}\n*/`;
}

async function buildEngine() {
	const thirdPartyBanner = await getThirdPartyBanner();
	await build({
		...commonConfig,
		plugins: [
			{
				name: 'rpm-platform-external',
				enforce: 'pre',
				async resolveId(source, importer, options) {
					if (!importer) {
						return null;
					}
					const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
					if (resolved && isPlatformSource(resolved.id)) {
						return { id: PLATFORM_EXTERNAL_ID, external: true };
					}
					return null;
				},
			},
		],
		build: {
			...commonConfig.build,
			emptyOutDir: true,
			lib: {
				entry: path.join(SRC_DIR, 'engine.ts'),
				formats: ['es'],
				fileName: () => 'main.js',
			},
			rolldownOptions: {
				output: {
					keepNames: true,
					banner: `${BANNER}\n${thirdPartyBanner}`,
					sourcemapExcludeSources: true,
					comments: { legal: true, annotation: false, jsdoc: false },
					paths: { [PLATFORM_EXTERNAL_ID]: './Common/Platform.js' },
					minify: minifyOptions,
					sourcemapPathTransform: toSourcePath,
				},
			},
		},
	});
}

async function buildPlatform() {
	await build({
		...commonConfig,
		plugins: [
			{
				name: 'rpm-engine-external',
				enforce: 'pre',
				async resolveId(source, importer, options) {
					if (!importer) {
						return null;
					}
					const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
					if (resolved && !isPlatformSource(resolved.id)) {
						return { id: ENGINE_EXTERNAL_ID, external: true };
					}
					return null;
				},
			},
		],
		build: {
			...commonConfig.build,
			outDir: path.join(OUT_DIR, 'Common'),
			emptyOutDir: false,
			lib: {
				entry: PLATFORM_SOURCE,
				formats: ['es'],
				fileName: () => 'Platform.js',
			},
			rolldownOptions: {
				output: {
					keepNames: true,
					banner: BANNER,
					sourcemapExcludeSources: true,
					comments: { legal: true, annotation: false, jsdoc: false },
					paths: { [ENGINE_EXTERNAL_ID]: '../main.js' },
					minify: minifyOptions,
					sourcemapPathTransform: (relativeSourcePath, sourcemapPath) =>
						'../' + toSourcePath(relativeSourcePath, sourcemapPath),
				},
			},
		},
	});
}

async function copyAssets() {
	await fs.cp(path.join(SRC_DIR, 'Shaders'), path.join(OUT_DIR, 'Shaders'), { recursive: true });
	await fs.cp(SRC_DIR, path.join(OUT_DIR, 'src'), { recursive: true });
}

(async function () {
	const startTime = Date.now();
	try {
		await runCommand('npx tsc --noEmit');
		await buildEngine();
		await buildPlatform();
		await copyAssets();
		console.log(`Compilation completed in ${((Date.now() - startTime) / 1000).toFixed(1)} seconds`);
	} catch (error) {
		console.error(error);
		process.exitCode = 1;
	}
})();
