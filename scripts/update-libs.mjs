import fs from 'node:fs/promises';
import path from 'node:path';
import { minify } from 'terser';

const root = path.resolve(import.meta.dirname, '..');
const libs = path.join(root, 'src', 'Libs');

async function copy(from, to) {
	const destination = path.join(libs, to);
	await fs.mkdir(path.dirname(destination), { recursive: true });
	await fs.copyFile(path.join(root, 'node_modules', from), destination);
}

async function minifyThree(from, to, rewriteCoreImport = false) {
	let source = await fs.readFile(path.join(root, 'node_modules', 'three', 'build', from), 'utf8');
	if (rewriteCoreImport) {
		const updated = source.replaceAll('./three.core.js', './three.core.min.js');
		if (updated === source) {
			throw new Error('Three.js module no longer imports three.core.js');
		}
		source = updated;
	}
	const result = await minify(source, { module: true, format: { comments: /@license/ } });
	if (!result.code) {
		throw new Error(`Could not minify ${from}`);
	}
	await fs.writeFile(path.join(libs, to), `${result.code}\n`);
}

await minifyThree('three.core.js', 'three.core.min.js');
await minifyThree('three.module.js', 'three.module.min.js', true);

await copy('three/examples/jsm/loaders/GLTFLoader.js', 'examples/jsm/loaders/GLTFLoader.js');
await copy('three/examples/jsm/utils/BufferGeometryUtils.js', 'examples/jsm/utils/BufferGeometryUtils.js');
await copy('three/examples/jsm/utils/SkeletonUtils.js', 'examples/jsm/utils/SkeletonUtils.js');
await copy('howler/dist/howler.core.min.js', 'howler.core.min.js');
await copy('howler/dist/howler.min.js', 'howler.min.js');

console.log('Three.js and Howler copied to src/Libs');
