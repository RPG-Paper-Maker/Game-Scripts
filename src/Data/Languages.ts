/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Graphic } from '..';
import { Paths, Platform, Utils } from '../Common';
import { Localization, LocalizationJSON } from '../Model';
import { Base } from './Base';

interface ExtrasKind {
	loadAGame: Localization;
	loadAGameDescription: Localization;
	slot: Localization;
	empty: Localization;
	saveAGame: Localization;
	saveAGameDescription: Localization;
	keyboardAssignment: Localization;
	keyboardAssignmentDescription: Localization;
	keyboardAssignmentSelectedDescription: Localization;
	language: Localization;
	languageDescription: Localization;
	languageSelectedDescription: Localization;
	confirm: Localization;
	ok: Localization;
	yes: Localization;
	no: Localization;
	add: Localization;
	remove: Localization;
	shop: Localization;
	buy: Localization;
	sell: Localization;
	owned: Localization;
	selectAnAlly: Localization;
	victory: Localization;
	defeat: Localization;
	levelUp: Localization;
	precision: Localization;
	critical: Localization;
	damage: Localization;
	heal: Localization;
	skill: Localization;
	performSkill: Localization;
	loading: Localization;
	equipQuestion: Localization;
	pressAnyKeys: Localization;
	target: Localization;
}

/**
 * JSON structure for Languages.
 */
export type LanguagesJSON = {
	langs: { id: number; name: string }[];
	lag: LocalizationJSON;
	lagd: LocalizationJSON;
	sl: LocalizationJSON;
	em: LocalizationJSON;
	sag: LocalizationJSON;
	sagd: LocalizationJSON;
	ka: LocalizationJSON;
	kad: LocalizationJSON;
	kasd: LocalizationJSON;
	l: LocalizationJSON;
	ld: LocalizationJSON;
	lsd: LocalizationJSON;
	co: LocalizationJSON;
	ok: LocalizationJSON;
	ye: LocalizationJSON;
	no: LocalizationJSON;
	ad: LocalizationJSON;
	re: LocalizationJSON;
	sh: LocalizationJSON;
	bu: LocalizationJSON;
	se: LocalizationJSON;
	ow: LocalizationJSON;
	saa: LocalizationJSON;
	vi: LocalizationJSON;
	de: LocalizationJSON;
	lu: LocalizationJSON;
	pr: LocalizationJSON;
	cr: LocalizationJSON;
	da: LocalizationJSON;
	he: LocalizationJSON;
	sk: LocalizationJSON;
	ps: LocalizationJSON;
	lo: LocalizationJSON;
	eq: LocalizationJSON;
	pak: LocalizationJSON;
	ta: LocalizationJSON;
};

/**
 * Handles all language data.
 */
export class Languages {
	private static list: Map<number, string>;
	public static listIDs: number[];
	public static extras: ExtrasKind;

	/**
	 * Get the main language ID.
	 */
	static getMainLanguageID(): number {
		return this.listIDs[0];
	}

	/**
	 * Get a language name by ID.
	 */
	static get(id: number, errorMessage?: string): string {
		return Base.get(id, this.list, 'language', true, errorMessage);
	}

	/**
	 * Get the index according to language ID.
	 */
	static getIndexByID(id: number): number {
		return this.listIDs.indexOf(id);
	}

	/**
	 * Get the language graphics.
	 */
	static getCommandsGraphics(): Graphic.Text[] {
		return this.listIDs.map((id) => new Graphic.Text(this.get(id)));
	}

	/**
	 * Get the language callbacks.
	 */
	static getCommandsCallbacks(): (() => boolean)[] {
		return this.listIDs.map(() => () => true);
	}

	/**
	 * Read the JSON file associated with languages.
	 */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_LANGS)) as LanguagesJSON;
		this.listIDs = [];
		this.list = Utils.readJSONMap(json.langs, (element: { name: string }) => element.name, this.listIDs);
		this.extras = {
			loadAGame: new Localization(json.lag),
			loadAGameDescription: new Localization(json.lagd),
			slot: new Localization(json.sl),
			empty: new Localization(json.em),
			saveAGame: new Localization(json.sag),
			saveAGameDescription: new Localization(json.sagd),
			keyboardAssignment: new Localization(json.ka),
			keyboardAssignmentDescription: new Localization(json.kad),
			keyboardAssignmentSelectedDescription: new Localization(json.kasd),
			language: new Localization(json.l),
			languageDescription: new Localization(json.ld),
			languageSelectedDescription: new Localization(json.lsd),
			confirm: new Localization(json.co),
			ok: new Localization(json.ok),
			yes: new Localization(json.ye),
			no: new Localization(json.no),
			add: new Localization(json.ad),
			remove: new Localization(json.re),
			shop: new Localization(json.sh),
			buy: new Localization(json.bu),
			sell: new Localization(json.se),
			owned: new Localization(json.ow),
			selectAnAlly: new Localization(json.saa),
			victory: new Localization(json.vi),
			defeat: new Localization(json.de),
			levelUp: new Localization(json.lu),
			precision: new Localization(json.pr),
			critical: new Localization(json.cr),
			damage: new Localization(json.da),
			heal: new Localization(json.he),
			skill: new Localization(json.sk),
			performSkill: new Localization(json.ps),
			loading: new Localization(json.lo),
			equipQuestion: new Localization(json.eq),
			pressAnyKeys: new Localization(json.pak),
			target: new Localization(json.ta),
		};
	}
}
