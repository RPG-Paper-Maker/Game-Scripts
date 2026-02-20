/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { IO, Paths, Platform, TITLE_SETTING_KIND, Utils } from '../Common';
import { Languages } from './Languages';

/**
 * JSON structure for the settings file.
 */
export type SettingsJSON = {
	[TITLE_SETTING_KIND.KEYBOARD_ASSIGNMENT]: {
		[id: number]: string[][];
	};
	[TITLE_SETTING_KIND.LANGUAGE]: number;
};

/**
 * Handles all application settings.
 */
export class Settings {
	public static kb: Map<number, string[][]>;
	public static currentLanguage: number;
	public static isProtected: boolean;

	/**
	 * Check if the app is in protected (dev) mode.
	 */
	static async checkIsProtected(): Promise<void> {
		this.isProtected = await Platform.fileExists(Paths.FILE_PROTECT);
	}

	/**
	 * Update keyboard settings for a given ID.
	 * @param id - Keyboard ID
	 * @param sc - Shortcuts array
	 */
	static async updateKeyboard(id: number, sc: string[][]): Promise<void> {
		this.kb.set(id, sc);
		await this.save();
	}

	/**
	 * Update the current language.
	 * @param id - Language ID
	 */
	static async updateCurrentLanguage(id: number): Promise<void> {
		this.currentLanguage = id;
		await this.save();
	}

	/**
	 * Read the settings file.
	 */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_SETTINGS)) as SettingsJSON;
		this.kb = new Map();
		const jsonObjs = json[TITLE_SETTING_KIND.KEYBOARD_ASSIGNMENT];
		for (const id in jsonObjs) {
			this.kb.set(Number(id), jsonObjs[id]);
		}
		this.currentLanguage = Utils.valueOrDefault(json[TITLE_SETTING_KIND.LANGUAGE], Languages.getMainLanguageID());
	}

	/**
	 *  Write the settings file.
	 */
	static async save(): Promise<void> {
		const json = {};
		const jsonObjs = {};
		for (const [id, value] of this.kb.entries()) {
			jsonObjs[id] = value;
		}
		json[TITLE_SETTING_KIND.KEYBOARD_ASSIGNMENT] = jsonObjs;
		json[TITLE_SETTING_KIND.LANGUAGE] = this.currentLanguage;
		await IO.saveFile(Paths.FILE_SETTINGS, json);
	}
}
