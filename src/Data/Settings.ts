/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Data } from '..';
import { IO, Paths, Platform, TITLE_SETTING_KIND, Utils } from '../Common';

/** @class
 *  All the settings datas.
 *  @static
 */
class Settings {
	public static kb: string[][][];
	public static currentLanguage: number;
	public static isProtected: boolean;

	constructor() {
		throw new Error('This is a static class!');
	}

	/**
	 *  Read the settings file.
	 *  @static
	 */
	static async read() {
		// Settings
		const json = (await Platform.parseFileJSON(Paths.FILE_SETTINGS)) as any;
		this.kb = [];
		const jsonObjs = json[String(TITLE_SETTING_KIND.KEYBOARD_ASSIGNMENT)];
		for (const id in jsonObjs) {
			this.kb[id] = jsonObjs[id];
		}
		this.currentLanguage = Utils.valueOrDefault(
			json[String(TITLE_SETTING_KIND.LANGUAGE)],
			Data.Languages.getMainLanguageID()
		);
	}

	/**
	 *  Write the settings file.
	 *  @static
	 */
	static write() {
		const json = {};
		const jsonObjs = {};
		for (const id in this.kb) {
			jsonObjs[id] = this.kb[id];
		}
		json[String(TITLE_SETTING_KIND.KEYBOARD_ASSIGNMENT)] = jsonObjs;
		json[String(TITLE_SETTING_KIND.LANGUAGE)] = this.currentLanguage;
		IO.saveFile(Paths.FILE_SETTINGS, json);
	}

	/**
	 *  Check if the app is in dev mode
	 *  @static
	 */
	static async checkIsProtected() {
		this.isProtected = await Platform.fileExists(Paths.FILE_PROTECT);
	}

	/**
	 *  Update Keyboard settings.
	 *  @param {number} id
	 *  @param {string[][]} sc -
	 *  @static
	 */
	static updateKeyboard(id: number, sc: string[][]) {
		this.kb[id] = sc;
		this.write();
	}

	/**
	 *  Update current language setting.
	 *  @param {number} id
	 */
	static updateCurrentLanguage(id: number) {
		this.currentLanguage = id;
		this.write();
	}
}

export { Settings };
