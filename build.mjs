import fs from "fs/promises";
import { exec } from "child_process";


function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const commandArgs = args.join(",").replace(",", " ");

    exec(`${command} ${commandArgs}`, async (err, stdout, stderr) => {
      if (err) {
        reject(`"Problem running ${command} ${commandArgs} \n ${stdout}"`)
        return;
      }
      if (stdout.length > 0) {
        console.log(stdout);
      } else if (stderr.length > 0) {
        console.log(stderr);
      }
      resolve({ stdout, stderr })
    });
  })
}

async function copyDir (src, dest) {
  await fs.mkdir(dest, { recursive: true });
  let entries = await fs.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    entry.isDirectory() ?
      await copyDir(srcPath, destPath) :
      await fs.copyFile(srcPath, destPath);
  }
}

async function exists(path) {
  try {
    await fs.access(SYSTEM_DIR);
    return true;
  } catch (error) {
    return false;
  }
}

(async function () {
  const BUILD_DIR = "./Content";
  const SRC_DIR = "./src";
  const SYSTEM_DIR = `${BUILD_DIR}/Datas/Scripts/System`;
  const startTime = Date.now();

  try {
    if (await exists(SYSTEM_DIR)) {
      await fs.rmdir(SYSTEM_DIR, {
        recursive: true
      });
    }

    if (process.env.CI || process.env.PRODUCTION) {
      await runCommand("npx", ["tsc", "--outDir Scripts/System"]);
    } else {
      await runCommand("npx", ["tsc", "--incremental"]);
    }
    await runCommand("module-fix.sh", [], true);
    await fs.copyFile(`${ SRC_DIR }/Definitions.d.ts`, `${ SYSTEM_DIR }/Definitions.d.ts`)
    const endTime = Date.now() - startTime;
    console.log(
        `Compilation completed in ${ Math.floor(endTime / 1000) } seconds`
      );
  } catch (error) {
    console.error(error);
  }
})();
