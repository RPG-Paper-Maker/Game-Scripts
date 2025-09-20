/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Localization, LocalizationJSON } from './Localization';

/**
 * Represents a key shortcut in the game.
 */
export type KeyboardJSON = LocalizationJSON & {
	id: number;
	abr: string;
	sc: string[][];
};

/**
 *  A key shortcut of the game.
 */
export class Keyboard extends Localization {
	public id: number;
	public sc: string[][];

	constructor(json?: KeyboardJSON) {
		super(json);
	}

	/**
	 *  Get the string representation of the keyboard.
	 *  @returns {string}
	 */
	toString(): string {
		return this.sc
			.map((shortcut) =>
				shortcut
					.map((sc) => {
						switch (sc) {
							case 'ArrowUp':
								return '↑';
							case 'ArrowDown':
								return '↓';
							case 'ArrowLeft':
								return '←';
							case 'ArrowRight':
								return '→';
							case 'Control':
								return 'Ctrl';
							default:
								return sc;
						}
					})
					.join(' + ')
			)
			.join(' | ')
			.toUpperCase();
	}

	/**
	 *  Read the JSON associated to the keyboard.
	 */
	read(json: KeyboardJSON) {
		super.read(json);
		this.id = json.id;
		this.sc = json.sc;
	}
}
