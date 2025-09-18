/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, Platform } from '../Common';
import { Data, Graphic, Scene } from '../index';
import { Keyboard, KeyboardJSON } from '../Model';

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

/** @class
 *  All the keyBoards datas.
 *  @static
 */
class Keyboards {
	private static list: Map<number, Keyboard>;
	public static listIDs: number[];
	public static menuControls: Record<string, any> = {};
	public static controls: Record<string, any> = {};

	/**
	 *  Test if a key id can be equal to a keyboard System object.
	 *  @static
	 *  @param {number} key - The key id that needs to be compared
	 *  @param {System.KeyBoard} abr - The keyBoard to compare to the key
	 *  @returns {boolean}
	 */
	static isKeyEqual(key: string, abr: Keyboard): boolean {
		if (abr) {
			const sc = abr.sc;
			let m: number;
			for (let i = 0, l = sc.length; i < l; i++) {
				m = sc[i].length;
				if (m === 1) {
					if (sc[i][0].toUpperCase() === key.toUpperCase()) {
						return true;
					}
				} else {
					return false;
				}
			}
		}
		return false;
	}

	/**
	 *  Read the JSON file associated to keyboard.
	 *  @static
	 *  @async
	 */
	static async read() {
		const json = (await Platform.parseFileJSON(Paths.FILE_KEYBOARD)) as any;

		// Shortcuts
		const jsonList = json.list;
		const l = jsonList.length;
		this.list = new Map();
		this.listIDs = new Array(l);
		let jsonKey: Record<string, any>, id: number, abbreviation: string, key: Keyboard, sc: string[][];
		for (let i = 0; i < l; i++) {
			jsonKey = jsonList[i];
			id = jsonKey.id;
			abbreviation = jsonKey.abr;
			key = new Keyboard(jsonKey as KeyboardJSON);
			sc = Data.Settings.kb[id];
			if (sc) {
				key.sc = sc;
			}
			this.list.set(id, key);
			this.listIDs[i] = id;
			this.controls[abbreviation] = key;
		}

		// Menu controls
		this.menuControls['Action'] = this.list.get(json['a']);
		this.menuControls['Cancel'] = this.list.get(json['c']);
		this.menuControls['Up'] = this.list.get(json['u']);
		this.menuControls['Down'] = this.list.get(json['d']);
		this.menuControls['Left'] = this.list.get(json['l']);
		this.menuControls['Right'] = this.list.get(json['r']);
	}

	/**
	 *  Get the keyboard by ID.
	 *  @static
	 *  @param {number} id
	 *  @returns {System.Keyboard}
	 */
	static get(id: number): Keyboard {
		return Data.Base.get(id, this.list, 'keyboard');
	}

	static getByIndex(index: number): Keyboard {
		return this.get(this.listIDs[index]);
	}

	/**
	 *  Get the graphics commands.
	 *  @static
	 *  @returns {GraphicKeyboard[]}
	 */
	static getCommandsGraphics(): Graphic.Keyboard[] {
		const l = this.listIDs.length;
		const list = new Array(l);
		for (let i = 0; i < l; i++) {
			list[i] = new Graphic.Keyboard(this.getByIndex(i));
		}
		return list;
	}

	/**
	 *  Get the actions commands.
	 *  @static
	 *  @returns {Function[]}
	 */
	static getCommandsActions(): Function[] {
		const l = this.listIDs.length;
		const list = new Array(l);
		for (let i = 0; i < l; i++) {
			list[i] = Scene.KeyboardAssign.prototype.updateKey;
		}
		return list;
	}

	/**
	 *  Check if key is cancelling menu.
	 *  @static
	 *  @returns {boolean}
	 */
	static checkCancelMenu(key: string): boolean {
		return (
			Data.Keyboards.isKeyEqual(key, Data.Keyboards.menuControls.Cancel) ||
			Data.Keyboards.isKeyEqual(key, Data.Keyboards.controls.MainMenu)
		);
	}

	/**
	 *  Check if key is cancelling.
	 *  @static
	 *  @returns {boolean}
	 */
	static checkCancel(key: string): boolean {
		return Data.Keyboards.isKeyEqual(key, Data.Keyboards.menuControls.Cancel);
	}

	/**
	 *  Check if key is action menu.
	 *  @static
	 *  @returns {boolean}
	 */
	static checkActionMenu(key: string): boolean {
		return Data.Keyboards.isKeyEqual(key, Data.Keyboards.menuControls.Action);
	}
}

export { Keyboards };
