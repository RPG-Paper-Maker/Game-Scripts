import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import path from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			parser: tseslint.parser,
			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir: path.resolve(__dirname), // 🔑 normalizes to a single form
			},
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
	},
]);
