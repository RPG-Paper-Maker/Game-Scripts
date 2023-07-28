import fs from 'fs/promises';
import { exec } from 'child_process';
import path from 'path';

function runCommand(command, args = []) {
	return new Promise((resolve, reject) => {
		const commandArgs = args.join(',').replace(',', ' ');

		exec(`${command} ${commandArgs}`, async (err, stdout, stderr) => {
			if (err) {
				reject(`"Problem running ${command} ${commandArgs} \n ${stdout}"`);
				return;
			}
			if (stdout.length > 0) {
				console.log(stdout);
			} else if (stderr.length > 0) {
				console.log(stderr);
			}
			resolve({ stdout, stderr });
		});
	});
}

async function exists(path) {
	try {
		await fs.stat(path);
		return true;
	} catch (error) {
		return false;
	}
}

// Solves that dammit stupid TypeScript decision to not add .js extensions to import paths... :°
async function modifyImportsInFile(filePath) {
	try {
		const content = await fs.readFile(filePath, 'utf-8');
		const modifiedContent = content
			.replace(/export \* from ['"](.+)['"]/g, 'export * from "$1.js"')
			.replace(/export \* as (.+) from "(.+)"/g, 'export * as $1 from "./$1/index.js"')
			.replace(/import ({ .+ }|\* as .+) from ['"](..?\/)(.+)['"]/g, `import $1 from '$2$3.js'`)
			.replace(
				/import ({ .+ }|\* as .+) from ['"](..?\/?\.?\.?\/)(Graphic|Core|Datas|EventCommand|Manager|Scene|Common|System|Libs|Utils).js['"]/g,
				`import $1 from '$2$3/index.js'`
			)
			.replace(/import ({ .+ }|\* as .+) from ['"](..?)['"]/g, 'import $1 from "$2/index.js"');
		await fs.writeFile(filePath, modifiedContent, 'utf-8');
	} catch (error) {
		console.error(`Error modifying imports in file: ${filePath}`);
		console.error(error);
	}
}

async function modifyImports(dir) {
	try {
		const entries = await fs.readdir(dir, { withFileTypes: true });
		for (const entry of entries) {
			const filePath = path.join(dir, entry.name);

			if (entry.isDirectory()) {
				await modifyImports(filePath);
			} else {
				await modifyImportsInFile(filePath);
			}
		}
	} catch (error) {
		console.error(`Error reading directory: ${dir}`);
		console.error(error);
	}
}

(async function () {
	const BUILD_DIR = './Content';
	const SRC_DIR = './src';
	const SYSTEM_DIR = `${BUILD_DIR}/Scripts/System`;
	const startTime = Date.now();

	try {
		if (await exists(SYSTEM_DIR)) {
			await fs.rm(SYSTEM_DIR, {
				recursive: true,
			});
		}

		if (process.env.CI || process.env.PRODUCTION) {
			await runCommand('npx', ['tsc']);
		} else {
			await runCommand('npx', ['tsc', '--incremental']);
		}

		modifyImports(SYSTEM_DIR);
		await fs.copyFile(`${SRC_DIR}/Definitions.d.ts`, `${SYSTEM_DIR}/Definitions.d.ts`);
		const endTime = Date.now() - startTime;
		console.log(`Compilation completed in ${Math.floor(endTime / 1000)} seconds`);
	} catch (error) {
		console.error(error);
	}
})();
