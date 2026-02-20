/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform } from '../Common';
import { Graphic, Scene } from '../index';
import { Keyboard, KeyboardJSON } from '../Model';
import { Base } from './Base';
import { Settings } from './Settings';

/**
 * Represents the keyboard controls available in menus.
 * Each property corresponds to a specific menu action.
 */
export interface MenuControls {
	Action: Keyboard;
	Cancel: Keyboard;
	Up: Keyboard;
	Down: Keyboard;
	Left: Keyboard;
	Right: Keyboard;
}

/**
 * JSON structure for Keyboards.
 */
export type KeyboardsJSON = {
	list: KeyboardJSON[];
	a: number;
	c: number;
	u: number;
	d: number;
	l: number;
	r: number;
};

/**
 * Handles all keyboard data.
 */
export class Keyboards {
	private static list: Map<number, Keyboard>;
	public static listIDs: number[];
	public static menuControls: MenuControls;
	public static controls: Record<string, Keyboard> = {};

	/**
	 * Get a keyboard by ID.
	 */
	static get(id: number, errorMessage?: string): Keyboard {
		return Base.get(id, this.list, 'keyboard', true, errorMessage);
	}

	/**
	 * Get the graphics commands.
	 */
	static getCommandsGraphics(): Graphic.Keyboard[] {
		return this.listIDs.map((id) => new Graphic.Keyboard(this.get(id)));
	}

	/**
	 * Get the actions commands.
	 */
	static getCommandsActions(): (() => boolean)[] {
		return this.listIDs.map(() => Scene.KeyboardAssign.prototype.updateKey);
	}

	/**
	 * Check if a key string matches a keyboard shortcut.
	 */
	static isKeyEqual(key: string, abr: Keyboard): boolean {
		if (!abr) return false;
		for (const shortcuts of abr.sc) {
			if (shortcuts.length === 1 && shortcuts[0].toUpperCase() === key.toUpperCase()) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Check if key is cancelling menu.
	 */
	static checkCancelMenu(key: string): boolean {
		return this.isKeyEqual(key, this.menuControls.Cancel) || this.isKeyEqual(key, this.controls.MainMenu);
	}

	/**
	 * Check if key is cancelling.
	 */
	static checkCancel(key: string): boolean {
		return this.isKeyEqual(key, this.menuControls.Cancel);
	}

	/**
	 * Check if key is action menu.
	 */
	static checkActionMenu(key: string): boolean {
		return this.isKeyEqual(key, this.menuControls.Action);
	}

	/**
	 * Read the JSON file associated with keyboards.
	 */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_KEYBOARD)) as KeyboardsJSON;

		// Shortcuts
		this.list = new Map();
		this.listIDs = new Array(json.list.length);
		for (const [index, jsonKey] of json.list.entries()) {
			const id = jsonKey.id;
			const abbreviation = jsonKey.abr;
			const key = new Keyboard(jsonKey);
			const sc = Settings.kb.get(id);
			if (sc) {
				key.sc = sc;
			}
			this.list.set(id, key);
			this.listIDs[index] = id;
			this.controls[abbreviation] = key;
		}

		// Menu controls
		this.menuControls = {
			Action: this.get(json['a']),
			Cancel: this.get(json['c']),
			Up: this.get(json['u']),
			Down: this.get(json['d']),
			Left: this.get(json['l']),
			Right: this.get(json['r']),
		};
	}
}
